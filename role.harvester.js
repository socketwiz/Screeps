/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

var common = require('common');

var roleHarvester = {

    /** @param {Creep} creep **/
    'run': function moveHarvesterCreep(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            common.getResources(creep, false, '#ffffff');
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
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
};

module.exports = roleHarvester;
