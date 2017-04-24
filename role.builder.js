/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing === 'a thing'; // true
 */

var common = require('common');

var roleBuilder = {

    /** @param {Creep} creep **/
    'run': function moveBuilderCreep(creep) {
        if (creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

            if (targets.length) {
                var target = targets[0];
                // var target = Game.getObjectById('58fb7ae8b10571061ceaed4b');

                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            common.getResources(creep, false, '#ffaa00', 1);
        }
    }
};

module.exports = roleBuilder;
