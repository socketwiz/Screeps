
let BaseRole = require('role.base');

class RoleHarvester extends BaseRole {
    constructor(props) {
        let unit = props.unit;
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(props);

        this.color = '#FFFFFF';
        this.creeps = creeps;
        this.energyAvailable = props.energyAvailable;
        this.unit = unit;

        if (creeps.length !== unit.count) {
            console.log(`${unit.role.capitalize()}s: ${creeps.length}/${unit.count}`);
        }
    }

    /**
     * Work for a single creep to perform
     *
     * @param {Object} creep - the creep to put to work
     */
    run(creep) {
        let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length) {
            // All forces to attack
            return;
        }

        if (creep.memory.depositing && creep.carry.energy === 0) {
            creep.memory.depositing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.depositing && creep.carry.energy === creep.carryCapacity) {
            creep.memory.depositing = true;
            creep.say('$ deposit');
        }

        if (creep.memory.depositing) {
            if (super.depositToBanks(creep) === false) {
                if (super.depositToContainers(creep) === false) {
                    // Do upgrade while waiting for something else to harvest
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: this.color}});
                    }
                }
            }
        } else {
            super.getResources(creep, false, this.color);
        }
    }

    /**
     * Find something for the group of harvesters to do
     */
    work() {
        _.forEach(this.creeps, this.run.bind(this));
    }
}

module.exports = RoleHarvester;
