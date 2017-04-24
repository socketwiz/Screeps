/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

let common = require('common');

let roleHarvester = {
    'role': 'harvester',

    spawn(harvesters) {
        if (harvesters.length < 2) {
            // let newHarvester = Game.spawns['SpawnDominator'].createCreep([WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], undefined, {role: 'harvester'});
            let newHarvester = Game.spawns['SpawnDominator'].createCreep([WORK, CARRY, MOVE, MOVE], undefined, {role: 'harvester'});
            console.log('Spawning new harvester: ' + formatError(newHarvester));
        }
    },

    /** @param {Creep} creep **/
    run(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            common.getResources(creep, false, '#ffffff');
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
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
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
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    // Just get off the resource and park it back at the spawn
                    targets = creep.room.find(FIND_STRUCTURES, {
                        'filter': (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN);
                        }
                    });

                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },

    init() {
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == this.role);

        console.log('Harvesters: ' + harvesters.length);

        this.spawn(harvesters);
        _.forEach(harvesters, this.run);
    }
};

module.exports = roleHarvester;
