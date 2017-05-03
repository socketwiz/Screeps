
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
                        'features': {
                            'needed': [[WORK, 1], [CARRY, 1], [MOVE, 3]],
                            'wanted': [[TOUGH, 8], [WORK, 4], [CARRY, 2], [MOVE, 8], [ATTACK, 3], [MOVE, 1]]
                        },
                        'role': 'harvester'
                    },
                    {
                        'count': 3,
                        'features': {
                            'wanted': [[TOUGH, 5], [WORK, 4], [CARRY, 2], [MOVE, 7], [RANGED_ATTACK, 2], [MOVE, 1]]
                        },
                        'role': 'upgrader'
                    },
                    {
                        'count': 1,
                        'features': {
                            'wanted': [[TOUGH, 8], [WORK, 4], [CARRY, 2], [MOVE, 8], [ATTACK, 3], [MOVE, 1]]
                        },
                        'role': 'builder'
                    },
                    {
                        'count': 2,
                        'features': {
                            'wanted': [[TOUGH, 10], [WORK, 4], [CARRY, 2], [MOVE, 8], [HEAL, 1], [MOVE, 1]]
                        },
                        'role': 'roadCrew'
                    }
                ]
            }
        }
    ]
};

module.exports = DATA;
