
let BaseRole = require('role.base');

class RoleHarvester extends BaseRole {
    constructor(unit) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(unit);

        this.color = '#FFFFFF';
        this.creeps = creeps;
        console.log(`${unit.role.capitalize()}s: ${creeps.length}`);
    }

    /** @param {Creep} creep **/
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

            _.forEach(targets, depositWithCreep.bind(this));
            super.depositToContainers(creep);
        }
    }

    length() {
        return super.length();
    }

    spawn(unit, energyAvailable) {
        super.spawn(unit, energyAvailable);
    }

    work() {
        _.forEach(this.creeps, this.run.bind(this));
    }
}

module.exports = RoleHarvester;
