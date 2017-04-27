
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

    isValid(room) {
        let rooms = _.filter(Game.rooms, (gameRoom) => gameRoom.name === room);

        if (rooms.length) {
            return true;
        }

        console.log(`${room} does not belong to us`);
        return false;
    }

    setupUnits(unit) {
        switch (unit.role) {
            case 'harvester':
                this.units.harvester = new RoleHarvester(unit);
                break;
            case 'upgrader':
            this.units.upgrader = new RoleUpgrader(unit, this.energyAvailable);
                break;
            case 'builder':
                this.units.builder = new RoleBuilder(unit, this.energyAvailable);
                break;
        }
    }

    spawn(unit) {
        let currentUnit = this.units[unit.role];

        if (unit.count > currentUnit.length()) {
            currentUnit.spawn(unit.role, this.energyAvailable);
        }

        return unit.count === currentUnit.length();
    }

    work(unit) {
        let currentUnit = this.units[unit.role];

        currentUnit.work(unit.role);
    }

    room(room) {
        let roomSet = _.filter(data.rooms, (value) => _.keys(value) == room);
        let units = roomSet[0][room].units;

        if (this.isValid(room)) {
            _.forEach(units, this.setupUnits.bind(this));
            _.forEach(units, this.spawn.bind(this));
            _.forEach(units, this.work.bind(this));
        }
    }

    rooms(rooms) {
        _.forEach(_.keys(rooms), this.room.bind(this));
    }

    run(energyAvailable) {
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        this.energyAvailable = energyAvailable;

        _.forEach(data.rooms, this.rooms.bind(this));
    }
}

module.exports = Room;
