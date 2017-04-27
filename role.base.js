
/**
 * Capitalize the first character in a word
 *
 * @return {String} - the capitalized word
 */
String.prototype.capitalize = function capitalize() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

class BaseRole {
    constructor(unit) {
        this.unit = unit;
    }

    length() {
        let units = _.filter(Game.creeps, (creep) => creep.memory.role == this.unit.role);

        return units.length;
    }

    /**
     * Return a list of the units that have been spawned onto this board
     *
     * @return {Object} - units that have been spawned and their counts
     */
    whosOnBoard() {
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

        return {
            'harvesters': harvesters.length,
            'builders': builders.length,
            'upgraders': upgraders.length
        };
    }

    depositToBanks(creep, target) {
        // Deposit harvest
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: this.color}});
            }
        }
    }

    depositToContainers(creep) {
        // Check to see if there is a container we could fill
        let container = creep.room.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
            }
        });

        if (container.length) {
            if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: this.color}});
            }
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
     *
     * @returns {Boolean} - true if unit wasn't spawned, false if it was
     */
    spawn(role, energyAvailable) {
        let featureSet = this.unit.features.want;
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

        // if (energyAvailable < 601 && harvesters.length === 0) {
        //     if (this.unit.features.need) {
        //         featureSet = this.unit.features.need;
        //     }
        // }

        let newCreep = Game.spawns['SpawnDominator'].createCreep(featureSet, undefined, {role: role});

        console.log(`Spawning new ${role}: ${this.formatError(newCreep)}`);
    }

    /**
     * Move creeps to resource nodes
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

