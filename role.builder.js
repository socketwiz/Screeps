
let BaseRole = require('role.base');

class RoleBuilder extends BaseRole {
    constructor(role, size) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);

        super(creeps, role, size);

        this.creeps = creeps;
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
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

            if (targets.length) {
                var target = targets[0];
                // var target = Game.getObjectById('58fb7ae8b10571061ceaed4b');

                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                // Do upgrade while waiting for something else to build
                var notNearController = creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE;

                // if (creep.carry.energy === 0) {
                if (notNearController && creep.carry.energy < creep.carryCapacity) {
                    super.getResources(creep, true, '#29506d', 1);
                } else if (creep.carry.energy) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#29506d'}});
                } else {
                    super.getResources(creep, false, '#29506d', 1);
                }
            }
        } else {
            super.getResources(creep, false, '#ffaa00', 1);
        }
    }

    spawn(ourRoom) {
        let rooms = _.filter(Game.rooms, (room) => room.name === ourRoom);

        if (rooms.length) {
            super.spawn(ourRoom);
        }
    }

    init() {
        _.forEach(this.creeps, this.run);
    }
}

module.exports = RoleBuilder;
