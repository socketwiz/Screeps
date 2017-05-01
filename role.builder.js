
let BaseRole = require('role.base');

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
            console.log(`${unit.role.capitalize()}s: ${creeps.length}/${unit.count}`);
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
                let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                let damagedStructures = creep.room.find(FIND_STRUCTURES, {
                    'filter': structure => structure.hits < structure.hitsMax &&
                        structure.structureType !== STRUCTURE_RAMPART,
                    'sortBy': structure => {
                        const RANK = {
                            STRUCTURE_ROAD: 0,
                            STRUCTURE_RAMPART: 1
                        };

                        return structure[RANK];
                    }
                });

                if (constructionSites.length) {
                    // Do main job, build stuff
                    let target = constructionSites[0];

                    if (creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: this.color}});
                    }
                } else if (damagedStructures.length) {
                    // Repair structures
                    let repairCurried = _.curry(this.repair);
                    let repairWithCreep = repairCurried(creep);
                    _.forEach(damagedStructures, repairWithCreep);
                } else {
                    // Do upgrade while waiting for something else to build or repair
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: this.color}});
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
