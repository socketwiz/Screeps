
let BaseRole = require('role.base');
let common = require('common');

class RoleBuilder extends BaseRole {
    constructor(props) {
        let unit = props.unit;
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(props);

        this.color = '#29506D';
        this.creeps = creeps;
        this.energyAvailable = props.energyAvailable;
        this.energyCapacityAvailable = props.energyCapacityAvailable;
        this.unit = unit;

        if (creeps.length !== unit.count) {
            console.log(`${_.capitalize(unit.role)}s: ${creeps.length}/${unit.count}`);
        }
    }

    /**
     * Repair a structure
     *
     * @param {Object} - creep that will repair structure
     * @param {Structure} - structure to repair
     */
    repair(creep, structure) {
        if (structure.hits < structure.hitsMax) {
            // eslint-disable-next-line max-len
            // console.log(`${_.capitalize(structure.structureType)} needs repair at ${structure.pos.x},${structure.pos.y}`);

            let notNearStructure = creep.repair(structure) === ERR_NOT_IN_RANGE;

            if (notNearStructure) {
                creep.moveTo(structure, {visualizePathStyle: {stroke: this.color}});
            }
        }
    }

    /**
     * Work for a single creep to perform
     *
     * @param {Object} creep - the creep to put to work
     */
    run(creep) {
        let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length) {
            // All forces to attack
            return;
        }

        if (creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            if (this.energyAvailable < this.energyCapacityAvailable) {
                // All hands on deck when energy is below max
                super.depositToBanks(creep);
            } else {
                let needsRepairCurried = _.curry(common.needsRepair);

                let areRoadsDamaged = needsRepairCurried(STRUCTURE_ROAD);
                let areRampartsDamaged = needsRepairCurried(STRUCTURE_RAMPART);
                let areWallsDamaged = needsRepairCurried(STRUCTURE_WALL);

                let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                let damagedRoads = creep.room.find(FIND_STRUCTURES, {'filter': areRoadsDamaged});
                let damagedRamparts = creep.room.find(FIND_STRUCTURES, {'filter': areRampartsDamaged});
                let damagedWalls = creep.room.find(FIND_STRUCTURES, {'filter': areWallsDamaged});

                if (constructionSites.length) {
                    // Do main job, build stuff
                    let target = constructionSites[0];

                    if (creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: this.color}});
                    }
                } else if (damagedRoads.length || damagedRamparts.length || damagedWalls.length) {
                    let repairCurried = _.curry(this.repair);
                    let repairWithCreep = repairCurried(creep);

                    // Repair roads
                    if (creep.memory.role === 'roadCrew') {
                        _.forEach(damagedRoads, repairWithCreep);
                    }

                    // Repair ramparts
                    if (creep.memory.role === 'builder') {
                        if (damagedRamparts.length) {
                            _.forEach(damagedRamparts, repairWithCreep);
                        } else if (damagedWalls.length) {
                            _.forEach(damagedWalls, repairWithCreep);
                        }
                    }
                } else {
                    if (super.depositToTowers(creep) === false) {
                        super.depositToContainers(creep);
                    }
                }
            }
        } else {
            super.getResources(creep, false, this.color, 1);
        }
    }

    /**
     * Find something for the group of builders to do
     */
    work() {
        _.forEach(this.creeps, this.run.bind(this));
    }
}

module.exports = RoleBuilder;
