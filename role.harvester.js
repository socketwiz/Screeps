
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
            if (super.depositToBanks(creep) === false) {
                super.depositToContainers(creep);
            }
        }
    }

    /**
     * Spawn a creep
     */
    spawn() {
        super.spawn();
    }

    /**
     * Find something for the group of harvesters to do
     */
    work() {
        _.forEach(this.creeps, this.run.bind(this));
    }
}

module.exports = RoleHarvester;
