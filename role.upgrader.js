
let BaseRole = require('role.base');

class RoleUpgrader extends BaseRole {
    constructor(unit, energyAvailable) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(unit);

        this.color = '#FFAA00';
        this.creeps = creeps;
        this.energyAvailable = energyAvailable;

        console.log(`${unit.role.capitalize()}s: ${creeps.length}`);
    }

    /** @param {Creep} creep **/
    run(creep) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        let notNearController = creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE;

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        // if (notNearController && creep.carry.energy < creep.carryCapacity) {
        if (notNearController && creep.carry.energy === 0) {
            super.getResources(creep, true, this.color, 1);
        } else if (creep.carry.energy) {
            if (this.energyAvailable < 600) {
                let depositCurried = _.curry(super.depositToBanks);
                let depositWithCreep = depositCurried(creep);

                _.forEach(targets, depositWithCreep.bind(this));
            } else {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: this.color}});
            }
        } else {
            super.getResources(creep, false, this.color, 1);
        }
    }

    spawn(unit) {
        super.spawn(unit);
    }

    work() {
        _.forEach(this.creeps, this.run.bind(this));
    }
}

module.exports = RoleUpgrader;
