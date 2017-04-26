
let BaseRole = require('role.base');

class RoleBuilder extends BaseRole {
    constructor(unit, energyAvailable) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == unit.role);

        super(unit);

        this.color = '#29506D';
        this.creeps = creeps;
        this.energyAvailable = energyAvailable;

        console.log(`${unit.role.capitalize()}s: ${creeps.length}`);
    }

    /** @param {Creep} creep **/
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
            if (this.energyAvailable < 600) {
                super.depositToBanks(creep, this.color);
            } else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

                if (targets.length) {
                    var target = targets[0];
                    // var target = Game.getObjectById('58fb7ae8b10571061ceaed4b');

                    if (creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: this.color}});
                    }
                } else {
                    // Do upgrade while waiting for something else to build
                    var notNearController = creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE;

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

    spawn(unit) {
        super.spawn(unit);
    }

    work() {
        _.forEach(this.creeps, this.run.bind(this));
    }
}

module.exports = RoleBuilder;
