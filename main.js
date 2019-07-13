
let common = require('common');
let Room = require('room');

/**
 * Print room stats to the console
 *
 * @param {Object} room - room stats to print
 */
function displayRoom(room) {
    let needsRepairCurried = _.curry(common.needsRepair);

    let areRoadsDamaged = needsRepairCurried(STRUCTURE_ROAD, undefined);
    let areRampartsDamaged = needsRepairCurried(STRUCTURE_RAMPART, undefined);
    let areWallsDamaged = needsRepairCurried(STRUCTURE_WALL, 1000);

    let constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    let damagedRoads = room.find(FIND_STRUCTURES, {'filter': areRoadsDamaged});
    let damagedRamparts = room.find(FIND_STRUCTURES, {'filter': areRampartsDamaged});
    let damagedWalls = room.find(FIND_STRUCTURES, {'filter': areWallsDamaged});

    console.log(`Room "${room.name}" has ${room.energyAvailable} energy`);
    console.log(`Constructiion sites: ${constructionSites.length}`);
    console.log(`Roads to repair: ${damagedRoads.length}`);
    console.log(`Ramparts to repair: ${damagedRamparts.length}`);
    console.log(`Walls to repair: ${damagedWalls.length}`);
}

/**
 * Print creep stats to the console
 *
 * @param {Object} creep - creep stats to print
 */
function displayCreep(creep) {
    const POS = creep.pos;

    // eslint-disable-next-line
    console.log(`Room: ${creep.room.name}, Role: ${creep.memory.role}, Energy: ${creep.carry.energy}/${creep.carryCapacity}, POS: ${POS.x},${POS.y}, Name: ${creep.name}`)
}

/**
 * Global command to run from console gameStats()
 */
global.gameStats = function gameStats() {
    _.forEach(Game.rooms, displayRoom);
    _.forEach(Game.creeps, displayCreep);
};

/**
 * Tower should attack and or repair
 *
 * @param {Object} tower - tower that will attack or repair
 */
function towerRepairAttack(tower) {
    if (tower) {
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            'filter': (structure) => structure.hits < structure.hitsMax
        });

        if (closestDamagedStructure) {
            // tower.repair(closestDamagedStructure);
        }

        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
}

module.exports.loop = function gameLoop() {
    let room = new Room();

    for (let name in Memory.creeps) {
        if (Memory.creeps.hasOwnProperty(name)) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Burying the deceased creap:', name);
            }
        }
    }

    for (let gameRoom in Game.rooms) {
        if (Game.rooms.hasOwnProperty(gameRoom)) {
            let energyAvailable = Game.rooms[gameRoom].energyAvailable;
            let energyCapacityAvailable = Game.rooms[gameRoom].energyCapacityAvailable;

            let towers = Game.rooms[gameRoom].find(FIND_STRUCTURES, {
                'filter': (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER);
                }
            });

            let links = Game.rooms[gameRoom].find(FIND_STRUCTURES, {
                'filter': (structure) => {
                    return (structure.structureType == STRUCTURE_LINK);
                }
            });

            let linkSender = links[0];
            let linkReceiver = links[1];

            _.forEach(towers, towerRepairAttack);

            if (linkSender && linkReceiver) { // sometimes one or both of these are undefined, not sure why
                if (linkSender.cooldown === 0 && linkReceiver.cooldown === 0 && linkSender.energy >= 100) {
                    linkSender.transferEnergy(linkReceiver, linkSender.energy);
                }
            }

            room.run(gameRoom, energyAvailable, energyCapacityAvailable);
        }
    }

};

// Game.spawns['SpawnDominator'].room.controller.activateSafeMode();
// Game.spawns['SpawnDominator'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );
