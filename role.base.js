
/**
 * Capitalize the first character in a word
 *
 * @return {String} - the capitalized word
 */
String.prototype.capitalize = function capitalize() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

class BaseRole {
    constructor(props) {
        this.unit = props.unit;
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
     * Deposit into into one of type extension, spawn, or tower
     *
     * @param {Object} creep - creep that has energy to deposit
     * @param {Object} target - one of extension, spawn or tower
     */
    depositToBank(creep, target) {
        // Deposit harvest
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: this.color}});
            }
        }
    }

    depositToBanks(creep) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });

        let depositCurried = _.curry(this.depositToBank);
        let depositWithCreep = depositCurried(creep);

        if (targets.length) {
            _.forEach(targets, depositWithCreep.bind(this));

            return true;
        } else {
            return false;
        }
    }

    /**
     * Deposit energy into a container
     *
     * @param {Object} creep - creep that has energy to deposit
     * @param {Object} container - container to deposit into
     */
    depositToContainer(creep, container) {
        if (_.isEmpty(container) === false) {
            if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: this.color}});
            }
        }
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
                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
            }
        });

        let depositToContainerCurried = _.curry(this.depositToContainer);
        let depositToContainerWithCreep = depositToContainerCurried(creep);

        if (containers.length) {
            _.forEach(containers, depositToContainerWithCreep);
        } else {
            // Just get off the resource and park it back at the spawn
            let targets = creep.room.find(FIND_STRUCTURES, {
                'filter': (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });

            creep.moveTo(targets[0], {visualizePathStyle: {stroke: this.color}});
        }
    }

    /**
     * Spawn a creep
     */
    spawn() {
        let featureSet = this.unit.features;
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

        let newCreep = Game.spawns['SpawnDominator'].createCreep(featureSet, undefined, {role: this.unit.role});

        console.log(`Spawning new ${this.unit.role}: ${this.formatError(newCreep)}`);
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
        var source = creep.pos.findClosestByRange(FIND_SOURCES);
        var sources = creep.room.find(FIND_SOURCES);
        var currentSource = sources[id];

        if (closest) {
            currentSource = source;
        }

        if (creep.harvest(currentSource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(currentSource, {visualizePathStyle: {stroke: color}});
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

