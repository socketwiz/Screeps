
let data = require('data');
let RoleHarvester = require('role.harvester');
let RoleUpgrader = require('role.upgrader');
let RoleBuilder = require('role.builder');

class Room {
    isValid(room) {
        let rooms = _.filter(Game.rooms, (gameRoom) => gameRoom.name === room);

        if (rooms.length) {
            return true;
        }

        console.log(`${room} does not belong to us`);
        return false;
    }

    spawn(unit) {
        let currentUnit;

        switch (unit.role) {
            case 'harvester':
                currentUnit = new RoleHarvester(unit);
                break;
            case 'upgrader':
                currentUnit = new RoleUpgrader(unit);
                break;
            case 'builder':
                currentUnit = new RoleBuilder(unit);
                break;
        }
        console.log(JSON.stringify(typeof RoleHarvester.init));

        switch (unit.priority) {
            case 1:
                return currentUnit.spawn();
            case 2:
                return currentUnit.spawn();
            case 3:
                return currentUnit.spawn();
        }

        return false;
    }

    room(room) {
        let roomSet = _.filter(data.rooms, (value) => _.keys(value) == room);
        let units = roomSet[0][room].units;

        if (this.isValid(room)) {
            _.forEach(units, this.spawn);
        }
    }

    rooms(rooms) {
        _.forEach(_.keys(rooms), this.room.bind(this));
    }

    run() {
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');


        //harvester.init();
        //upgrader.init();
        //builder.init();

        _.forEach(data.rooms, this.rooms.bind(this));
    }
}

module.exports = Room;
