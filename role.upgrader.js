/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

var common = require('common');

var roleUpgrader = {

    /** @param {Creep} creep **/
    'run': function moveUpgraderCreep(creep) {
        var notNearController = creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE;

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say(':zap: upgrade');
        }

        // if (creep.carry.energy === 0) {
        if (notNearController && creep.carry.energy < creep.carryCapacity) {
            common.getResources(creep, true, '#29506d', 1);
        } else if (creep.carry.energy) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#29506d'}});
        } else {
            common.getResources(creep, false, '#29506d', 1);
        }
    }
};

module.exports = roleUpgrader;
