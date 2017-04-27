
let data = require('data');
let RoleHarvester = require('role.harvester');
let RoleUpgrader = require('role.upgrader');
let RoleBuilder = require('role.builder');

class Room {
    constructor() {
        this.energyAvailable = 0;
        this.units = {
            'harvester': undefined,
            'upgrader': undefined,
            'builder': undefined
        };
    }

    /**
     * Check to see if this is a room we own
     *
     * @param {Object} room - room to check
     * @returns {Boolean} - true if our room
     */
    isValid(room) {
        let rooms = _.filter(Game.rooms, (gameRoom) => gameRoom.name === room);

        if (rooms.length) {
            return true;
        }

        console.log(`${room} does not belong to us`);
        return false;
    }

    /**
     * Instantiate the various roles for this room
     *
     * @param {Object} unit - unit definition
     */
    setup(unit) {
        let props = {
            unit,
            'energyAvailable': this.energyAvailable
        };

        switch (unit.role) {
            case 'harvester':
                this.units.harvester = new RoleHarvester(props);
                break;
            case 'upgrader':
                this.units.upgrader = new RoleUpgrader(props);
                break;
            case 'builder':
                this.units.builder = new RoleBuilder(props);
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
            currentUnit.spawn(unit.role, this.energyAvailable);
        }
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
        let units = roomSet[0][room].units;

        if (this.isValid(room)) {
            _.forEach(units, this.setup.bind(this));
            _.forEach(units, this.spawn.bind(this));
            _.forEach(units, this.work.bind(this));
        }
    }

    /**
     * Dispatch the work per room
     *
     * @param {Array} rooms - room to dispatch work to
     */
    rooms(rooms) {
        _.forEach(_.keys(rooms), this.room.bind(this));
    }

    /**
     * For each room, put creeps to work
     *
     * @param {Number} energyAvailable - amount of energy available per room
     */
    run(energyAvailable) {
        this.energyAvailable = energyAvailable;

        _.forEach(data.rooms, this.rooms.bind(this));
    }
}

module.exports = Room;
