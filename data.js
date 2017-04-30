
const DATA = {
    'rooms': [
        {
            'W93N16': {
                'extensions': [
                    {
                        'x': 6,
                        'y': 33,
                        'type': STRUCTURE_EXTENSION
                    }
                ],

                // MOVE          = 50
                // WORK          = 100
                // CARRY         = 50
                // ATTACK        = 80
                // RANGED_ATTACK = 150
                // HEAL          = 250
                // CLAIM         = 600
                // TOUGH         = 10

                'units': [
                    {
                        'count': 2,
                        // eslint-disable-next-line
                        'features': [TOUGH, TOUGH, WORK, WORK, WORK, WORK, CARRY, CARRY, RANGED_ATTACK, HEAL, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                        'role': 'harvester'
                    },
                    {
                        'count': 3,
                        // eslint-disable-next-line
                        'features': [TOUGH, TOUGH, WORK, WORK, WORK, WORK, CARRY, CARRY, RANGED_ATTACK, HEAL, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                        'role': 'upgrader'
                    },
                    {
                        'count': 3,
                        // eslint-disable-next-line
                        'features': [TOUGH, TOUGH, WORK, WORK, WORK, WORK, CARRY, CARRY, RANGED_ATTACK, HEAL, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                        'role': 'builder'
                    }
                ]
            }
        }
    ]
};

module.exports = DATA;
