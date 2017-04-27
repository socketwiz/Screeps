
let BaseRole = require('role.base');

class RoleHarvester extends BaseRole {
    constructor(unit) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(unit);

        this.color = '#FFFFFF';
        this.creeps = creeps;
        console.log(`${unit.role.capitalize()}s: ${creeps.length}`);
    }

    /**
     * Returns how many creeps there are of this particular role
     *
     * @returns {Number} - number of creeps of role
     */
    length() {
        return super.length();
    }

    /** Work for a single creep to perform
     *
     * @param {Object} creep - the creep to send to the node
     */
    run(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            super.getResources(creep, false, this.color);
        } else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                'filter': (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });

            let depositCurried = _.curry(super.depositToBanks);
            let depositWithCreep = depositCurried(creep);

            if (targets.length) {
                _.forEach(targets, depositWithCreep.bind(this));
            } else {
                super.depositToContainers(creep);
            }
        }
    }

    /**
     * Spawn a creep
     *
     * @param {Object} unit - the creep definition to build
     * @param {Number} energyAvailable - amount of energy available to the room
     */
    spawn(unit, energyAvailable) {
        super.spawn(unit, energyAvailable);
    }

    /**
     * Find something for the group of harvesters to do
     */
    work() {
        _.forEach(this.creeps, this.run.bind(this));
    }
}

module.exports = RoleHarvester;
