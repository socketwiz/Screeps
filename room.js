
let data = require('data');
let RoleHarvester = require('role.harvester');
let RoleHarvestSender = require('role.harvestSender');
let RoleHarvestReceiver = require('role.harvestReceiver');
let RoleUpgrader = require('role.upgrader');
let RoleBuilder = require('role.builder');

class Room {
    constructor() {
        this.energyAvailable = 0;
        this.energyCapacityAvailable = 0;
        this.units = {
            'harvester': undefined,
            'harvestSender': undefined,
            'harvestReceiver': undefined,
            'upgrader': undefined,
            'builder': undefined,
            'roadCrew': undefined
        };
    }

    /**
     * Instantiate the various roles for this room
     *
     * @param {Object} unit - unit definition
     */
    setup(unit) {
        let props = {
            unit,
            'energyAvailable': this.energyAvailable,
            'energyCapacityAvailable': this.energyCapacityAvailable
        };

        switch (unit.role) {
            case 'harvester':
                this.units.harvester = new RoleHarvester(props);
                break;
            case 'harvestSender':
                this.units.harvestSender = new RoleHarvestSender(props);
                break;
            case 'harvestReceiver':
                this.units.harvestReceiver = new RoleHarvestReceiver(props);
                break;
            case 'upgrader':
                this.units.upgrader = new RoleUpgrader(props);
                break;
            case 'builder':
                this.units.builder = new RoleBuilder(props);
                break;
            case 'roadCrew':
                this.units.roadCrew = new RoleBuilder(props);
                break;
        }
    }

    /**
     * Spawn creep
     *
     * @param {Object} unit - unit definition
     */
    spawn(unit) {
        let currentUnit = this.units[unit.role];

        if (unit.count > currentUnit.length()) {
            currentUnit.spawn();
        }
    }

    /**
     * Look for wounded soldiers to heal
     *
     * @param {Object} unit - unit definition
     */
    heal(unit) {
        let currentUnit = this.units[unit.role];

        currentUnit.heal();
    }

    /**
     * Look for enemy creep to attack
     *
     * @param {Object} unit - unit definition
     */
    attack(unit) {
        let currentUnit = this.units[unit.role];

        currentUnit.attack();
    }

    /**
     * Put creep to work
     *
     * @param {Object} unit - unit definition
     */
    work(unit) {
        let currentUnit = this.units[unit.role];

        currentUnit.work();
    }

    /**
     * Instantiate roles
     * Spawn creep
     * Put creep to work
     *
     * @param {Object} room - room to work on
     */
    room(room) {
        let roomSet = _.filter(data.rooms, (value) => _.keys(value) == room);

        if (roomSet.length) {
            let units = roomSet[0][room].units;

            if (_.isEmpty(units) === false) {
                _.forEach(units, this.setup.bind(this));
                _.forEach(units, this.spawn.bind(this));
                _.forEach(units, this.heal.bind(this));
                _.forEach(units, this.attack.bind(this));
                _.forEach(units, this.work.bind(this));
            }
        }

        const ROOM = 'W93N16';
        let lostCreeps = _.filter(Game.creeps, (creep) => creep.room.name !== ROOM);

        if (lostCreeps.length) {
            // get back to our spawnPoint
            let ourRoom = new RoomPosition(17, 46, ROOM);
            _.forEach(lostCreeps, creep => creep.moveTo(ourRoom));
        }

    }

    /**
     * For each room, put creeps to work
     *
     * @param {Number} energyAvailable - amount of energy available per room
     * @param {Number} energyCapacityAvailable - max capacity available
     */
    run(room, energyAvailable, energyCapacityAvailable) {
        this.energyAvailable = energyAvailable;
        this.energyCapacityAvailable = energyCapacityAvailable;

        this.room(room);
    }
}

module.exports = Room;
