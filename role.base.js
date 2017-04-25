
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

    /**
     * Spawn a creep
     *
     * @returns {Boolean} - true if unit wasn't spawned, false if it was
     */
    spawn() {
        let units = _.filter(Game.creeps, (creep) => creep.memory.role == this.unit.role);

        if (this.unit.role === this.role && this.unit.count > units.length) {
            let newCreep = Game.spawns['SpawnDominator'].createCreep(this.unit.features, undefined, {role: this.role});

            console.log(`Spawning new ${this.role}: ${this.formatError(newCreep)}`);
            return false;
        }

        return true;
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
        default:
            return error;
        }
    }
}

module.exports = BaseRole;

