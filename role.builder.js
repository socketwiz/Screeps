
let BaseRole = require('role.base');

class RoleBuilder extends BaseRole {
    constructor(unit, energyAvailable) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(unit);

        this.color = '#29506D';
        this.creeps = creeps;
        this.energyAvailable = energyAvailable;

        console.log(`${unit.role.capitalize()}s: ${creeps.length}`);
    }

    needRepair(structure) {
        return structure.hits < structure.hitsMax;
    }

    repair(creep, structure) {
        if (structure.hits < structure.hitsMax) {
            let notNearStructure = creep.repair(structure) === ERR_NOT_IN_RANGE;

            if (notNearStructure) {
                creep.moveTo(structure, {visualizePathStyle: {stroke: this.color}});
            }
        }
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

        if (creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            if (this.energyAvailable < 800) {
                let depositCurried = _.curry(super.depositToBanks);
                let depositWithCreep = depositCurried(creep);

                _.forEach(targets, depositWithCreep.bind(this));
            } else {
                let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                let structures = creep.room.find(FIND_STRUCTURES);
                let needRepairs = _.filter(structures, this.needRepair);

                if (constructionSites.length) {
                    let target = constructionSites[0];
                    // let target = Game.getObjectById('58fb7ae8b10571061ceaed4b');

                    if (creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: this.color}});
                    }
                } else if (structures.length && needRepairs.length) {
                    let repairCurried = _.curry(this.repair);
                    let repairWithCreep = repairCurried(creep);
                    _.forEach(structures, repairWithCreep.bind(this));
                } else {

                    // Do upgrade while waiting for something else to build
                    let notNearController = creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE;

                    if (notNearController && creep.carry.energy < creep.carryCapacity) {
                        super.getResources(creep, true, this.color, 1);
                    } else if (creep.carry.energy) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: this.color}});
                    } else {
                        super.getResources(creep, false, this.color, 1);
                    }
                }
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

module.exports = RoleBuilder;
