
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

            // Deposit harvest
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: this.color}});
                }
            } else {
                // Check to see if there is a container we could fill
                let container = creep.room.find(FIND_STRUCTURES, {
                    'filter': (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });

                if (container.length) {
                    if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {visualizePathStyle: {stroke: this.color}});
                    }
                } else {
                    // Just get off the resource and park it back at the spawn
                    targets = creep.room.find(FIND_STRUCTURES, {
                        'filter': (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN);
                        }
                    });

                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: this.color}});
                }
            }
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
