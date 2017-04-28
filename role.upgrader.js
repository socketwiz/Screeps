
let BaseRole = require('role.base');

class RoleUpgrader extends BaseRole {
    constructor(props) {
        let unit = props.unit;
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(props);

        this.color = '#FFAA00';
        this.creeps = creeps;
        this.energyAvailable = props.energyAvailable;
        this.energyCapacityAvailable = props.energyCapacityAvailable;
        this.unit = unit;

        console.log(`${unit.role.capitalize()}s: ${creeps.length}/${unit.count}`);
    }

    /**
     * Work for a single creep to perform
     *
     * @param {Object} creep - the creep to put to work
     */
    run(creep) {
        let notNearController = creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE;

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (this.energyAvailable < this.energyCapacityAvailable) {
                // All hands on deck when energy is below max
                super.depositToBanks(creep);
            } else {
                if (notNearController && creep.carry.energy === 0) {
                    super.getResources(creep, true, this.color, 1);
                } else if (creep.carry.energy) {
                    // Do main job, upgrade the controller
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: this.color}});
                } else {
                    super.getResources(creep, false, this.color, 1);
                }
            }
        } else {
            super.getResources(creep, false, this.color, 1);
        }
    }

    /**
     * Find something for the group of upgraders to do
     */
    work() {
        _.forEach(this.creeps, this.run.bind(this));
    }
}

module.exports = RoleUpgrader;
