/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

function getResources(creep) {
    var source = creep.pos.findClosestByRange(FIND_SOURCES);

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
}

var roleUpgrader = {

    /** @param {Creep} creep **/
    'run': function moveUpgraderCreep(creep) {
        var notNearController = creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE;

        // if (creep.carry.energy === 0) {
        if (notNearController && creep.carry.energy < creep.carryCapacity) {
            getResources(creep);
        } else if (creep.carry.energy) {
            creep.moveTo(creep.room.controller);
        } else {
            getResources(creep);
        }
    }
};

module.exports = roleUpgrader;
