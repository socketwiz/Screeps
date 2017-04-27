
let BaseRole = require('role.base');

class RoleBuilder extends BaseRole {
    constructor(props) {
        let unit = props.unit;
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(props);

        this.color = '#29506D';
        this.creeps = creeps;
        this.energyAvailable = props.energyAvailable;
        this.unit = unit;

        console.log(`${unit.role.capitalize()}s: ${creeps.length}`);
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

    /** Work for a single creep to perform
     *
     * @param {Object} creep - the creep to send to the node
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
            if (this.energyAvailable < 800) {
                super.depositToBanks(creep);
            } else {
                let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                let structures = creep.room.find(FIND_STRUCTURES);
                let needRepairs = _.filter(structures, structure => structure.hits < structure.hitsMax);

                if (constructionSites.length) {
                    // Construct sites
                    let target = constructionSites[0];

                    if (creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: this.color}});
                    }
                } else if (structures.length && needRepairs.length) {
                    // Repair structures
                    let repairCurried = _.curry(this.repair);
                    let repairWithCreep = repairCurried(creep);
                    _.forEach(structures, repairWithCreep.bind(this));
                } else {
                    // Do upgrade while waiting for something else to build or repair
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

    /**
     * Find something for the group of harvesters to do
     */
    work() {
        _.forEach(this.creeps, this.run.bind(this));
    }
}

module.exports = RoleBuilder;
