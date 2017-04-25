
let Room = require('room');

module.exports.loop = function gameLoop() {
    let room = new Room();

    // let tower = Game.getObjectById('d78e235dfa65938db402f4f0');
    let tower = false;

    if (tower) {
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            'filter': (structure) => structure.hits < structure.hitsMax
        });

        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (let name in Memory.creeps) {
        if (Memory.creeps.hasOwnProperty(name)) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Burying the deceased creap:', name);
            }
        }
    }

    for (let room in Game.rooms) {
        if (Game.rooms.hasOwnProperty(room)) {
            console.log(`Room "${room}" has ${Game.rooms[room].energyAvailable} energy`);
        }
    }

    room.run();
};

// Game.spawns['SpawnDominator'].room.controller.activateSafeMode();
// Game.spawns['SpawnDominator'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );
