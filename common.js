/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    /**
     * Figure out which structure need to be repaired
     *
     * @param {String} structureType - type of structure to repair
     * @param {Number} repairMax - max hits to repair to (don't repair walls to 300M for example)
     * @param {Object} structure - structure to check for repairs
     * @returns {Boolean} - true if needs repair
     */
    needsRepair(structureType, repairMax, structure) {
        const REPAIR_MAX = repairMax || structure.hitsMax;
        const NEEDS_REPAIR = structure.hits < REPAIR_MAX;
        const IS_STRUCTURE_TYPE = structure.structureType === structureType;

        if (IS_STRUCTURE_TYPE && NEEDS_REPAIR) {
            return true;
        }

        return false;
    }
};

