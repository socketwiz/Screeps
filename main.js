
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

/**
 * Return a readable string rather than a number
 *
 * @param {Number} error - error to format
 * @return {String} - formatted error
 */
function formatError(error) {
    switch (error) {
        case ERR_BUSY:
            return 'Busy';
        case ERR_NOT_ENOUGH_ENERGY:
            return 'Not enough energy';
        default:
            return error;
    }
}

module.exports.loop = function gameLoop() {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    console.log('Upgrades: ' + upgraders.length);
    console.log('Builders: ' + builders.length);

    // var tower = Game.getObjectById('d78e235dfa65938db402f4f0');
    var tower = false;

    if (tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            'filter': (structure) => structure.hits < structure.hitsMax
        });

        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Memory.creeps) {
        if (Memory.creeps.hasOwnProperty(name)) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Burying the deceased creap:', name);
            }
        }
    }

    if (upgraders.length < 3 && harvesters.length && builders.length) {
        var newUpgrader = Game.spawns['SpawnDominator'].createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + formatError(newUpgrader));
    }

    if (builders.length < 2 && harvesters.length) {
        var newBuilder = Game.spawns['SpawnDominator'].createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + formatError(newBuilder));
    }

    for (var room in Game.rooms) {
        if (Game.rooms.hasOwnProperty(room)) {
            console.log('Room "' + room + '" has ' + Game.rooms[room].energyAvailable + ' energy');
        }
    }

    roleHarvester.init();

    for(var creeps in Game.creeps) {
        if (Game.creeps.hasOwnProperty(creeps)) {
            var creep = Game.creeps[creeps];

            if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        }
    }
};

// Game.spawns['SpawnDominator'].room.controller.activateSafeMode();
// Game.spawns['SpawnDominator'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );
