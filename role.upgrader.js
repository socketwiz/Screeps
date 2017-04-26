
let BaseRole = require('role.base');

class RoleUpgrader extends BaseRole {
    constructor(unit) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(unit);

        this.creeps = creeps;
        console.log(`${unit.role.capitalize()}s: ${creeps.length}`);
    }

    /** @param {Creep} creep **/
    run(creep) {
        var notNearController = creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE;

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        // if (creep.carry.energy === 0) {
        if (notNearController && creep.carry.energy < creep.carryCapacity) {
            super.getResources(creep, true, '#29506d', 1);
        } else if (creep.carry.energy) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#29506d'}});
        } else {
            super.getResources(creep, false, '#29506d', 1);
        }
    }

    spawn(unit) {
        super.spawn(unit);
    }

    work() {
        _.forEach(this.creeps, this.run);
    }
}

module.exports = RoleUpgrader;
