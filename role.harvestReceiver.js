
let BaseRole = require('role.base');

class RoleHarvestReceiver extends BaseRole {
    constructor(props) {
        let unit = props.unit;
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(props);

        this.color = '#FFFFFF';
        this.creeps = creeps;
        this.energyAvailable = props.energyAvailable;
        this.unit = unit;

        if (creeps.length !== unit.count) {
            console.log(`${_.capitalize(unit.role)}s: ${creeps.length}/${unit.count}`);
        }
    }

    /**
     * Work for a single creep to perform
     *
     * @param {Object} creep - the creep to put to work
     */
    run(creep) {
        if (creep.memory.depositing && creep.carry.energy === 0) {
            creep.memory.depositing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.depositing && creep.carry.energy === creep.carryCapacity) {
            creep.memory.depositing = true;
            creep.say('$ deposit');
        }

        if (creep.memory.depositing) {
            super.depositToStorage(creep);
        } else {
            super.getResourcesFromLink(creep, 1);
        }
    }

    /**
     * Find something for the group of harvesters to do
     */
    work() {
        _.forEach(this.creeps, this.run.bind(this));
    }
}

module.exports = RoleHarvestReceiver;
