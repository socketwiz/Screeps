
/**
 * Capitalize the first character in a word
 *
 * @return {String} - the capitalized word
 */
String.prototype.capitalize = function capitalize() {
    return this.replace(/(?:^|\s)\S/g, function capitalizeWord(word) {
        return word.toUpperCase();
    });
};

class BaseRole {
    constructor(props) {
        this.unit = props.unit;
        this.energyAvailable = props.energyAvailable;
        this.energyCapacityAvailable = props.energyCapacityAvailable;
    }

    /**
     * If there are any hostiles, attack!
     *
     * @param {Object} creep - creep used in the attack
     */
    attackWithCreep(creep) {
        let closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (closestHostile) {
            creep.attack(closestHostile);
        }
    }

    /**
     * Check for hostiles to attack
     */
    attack() {
        _.forEach(this.creeps, this.attackWithCreep.bind(this));
    }

    /**
     * If there are any wounded soldiers heal them
     *
     * @param {Object} creep - creep used to heal
     */
    healWithCreep(creep) {
        let woundedSoldier = creep.pos.findClosestByRange(FIND_CREEPS, {
            'filter': (soldier) => soldier.hits < soldier.hitsMax
        });

        if (woundedSoldier) {
            creep.repair(woundedSoldier);
        }
    }

    /**
     * Check for wounded soldiers to heal
     */
    heal() {
        _.forEach(this.creeps, this.healWithCreep.bind(this));
    }

    /**
     * Returns how many creeps there are of this particular role
     *
     * @returns {Number} - number of creeps of role
     */
    length() {
        let units = _.filter(Game.creeps, (creep) => creep.memory.role == this.unit.role);

        return units.length;
    }

    /**
     * Deposit harvest into into target
     *
     * @param {Object} creep - creep that has energy to deposit
     * @param {Object} target - one of extension, spawn, container
     */
    makeDeposit(creep, target) {
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: this.color}});
            }
        }
    }

    /**
     * Find a list of "banks" (extensions, spawns, or towers) to deposit into
     *
     * @param {Object} creep - creep that has energy to deposit
     * @returns {Boolean} - true if there are structures that need a deposit
     */
    depositToBanks(creep) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN
                        ) && structure.energy < structure.energyCapacity;
            }
        });

        let depositCurried = _.curry(this.makeDeposit);
        let depositWithCreep = depositCurried(creep);

        if (targets.length) {
            _.forEach(targets, depositWithCreep);

            return true;
        }

        return false;
    }

    /**
     * Find a list of containers to deposit into
     *
     * @param {Object} creep - creep that has energy to deposit
     */
    depositToContainers(creep) {
        // Check to see if there is a container we could fill
        let containers = creep.room.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_STORAGE) &&
                    structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
            }
        });

        let depositCurried = _.curry(this.makeDeposit);
        let depositWithCreep = depositCurried(creep);

        if (containers.length) {
            _.forEach(containers, depositWithCreep);

            return true;
        }

        return false;
    }

    /**
     * Withdraw energy from a container
     *
     * @param {Object} creep - creep to withdraw
     * @param {Object} container - container to withdraw from
     */
    withdrawFromContainer(creep, container) {
        if (_.isEmpty(container) === false) {
            if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: this.color}});
            }
        }
    }

    /**
     * Spawn a creep
     */
    spawn() {
        let featureSet = this.unit.features;
        let newCreep = Game.spawns['SpawnDominator'].createCreep(featureSet, undefined, {role: this.unit.role});

        console.log(`Spawning new ${this.unit.role}: ${this.formatError(newCreep)}`);
    }

    /**
     * When a creep dies they drop their resources, lets pick them up
     *
     * @param {Object} creep - the creep to pickup the resource
     * @param {Object} resource - the resource to pickup
     */
    pickupDroppedResource(creep, resource) {
        if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(resource, {visualizePathStyle: {stroke: this.color}});
        }
    }

    /**
     * Find the list of energy sources and move creep to one
     *
     * @param {Object} creep - the creep to send to the node
     * @param {Boolean} closest - send to closest node if true
     * @param {String} color - color of the trail to leave
     * @param {Number} id - an id for a specific node
     */
    getResources(creep, closest, color, id = 0) {
        const MIN_DROPPED_RESOURCES = 25;

        let source = creep.pos.findClosestByRange(FIND_SOURCES);
        let sources = creep.room.find(FIND_SOURCES);
        let droppedResources = creep.room.find(FIND_DROPPED_RESOURCES, {
            // no sense in sending creep over to pickup 1 resource
            'filter': (resource) => resource.amount > MIN_DROPPED_RESOURCES
        });
        let containers = creep.room.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER ||
                       structure.structureType === STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY];
            }
        });
        let currentSource = sources[id];

        // If there are dropped resources, make sure the creeps we send have room to pick it up
        if (droppedResources.length && (creep.carry < (creep.carrayCapacity - (MIN_DROPPED_RESOURCES + 1)))) {
            // Dropped resources have highest priority because they decay rapidly, pickup no matter what
            let pickupDroppedCurried = _.curry(this.pickupDroppedResource);
            let pickupDroppedWithCreep = pickupDroppedCurried(creep);

            _.forEach(droppedResources, pickupDroppedWithCreep.bind(this));
        } else {
            if (closest) {
                currentSource = source;
            }

            if (containers.length &&
                this.energyAvailable !== this.energyCapacityAvailable) {
                let withdrawFromContainerCurried = _.curry(this.withdrawFromContainer);
                let withdrawFromContainerWithCreep = withdrawFromContainerCurried(creep);

                _.forEach(containers, withdrawFromContainerWithCreep);
            } else if (creep.harvest(currentSource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(currentSource, {visualizePathStyle: {stroke: color}});
            }
        }
    }

    /**
     * Return a readable string rather than a number
     *
     * @param {Number} error - error to format
     * @return {String} - formatted error
     */
    formatError(error) {
        switch (error) {
            case ERR_BUSY:
                return 'Busy';
            case ERR_NOT_ENOUGH_ENERGY:
                return 'Not enough energy';
            case ERR_INVALID_ARGS:
                return 'Invalid arguments';
            default:
                return error;
        }
    }
}

module.exports = BaseRole;

