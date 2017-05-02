
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
                        'features': {
                            'needed': [{WORK: 1}, {CARRY: 1}, {MOVE: 3}],
                            'wanted': [{TOUGH: 2}, {WORK: 4}, {CARRY: 2}, {MOVE: 5}, {RANGED_ATTACK: 1}, {HEAL: 1}, {ATTACK: 1}, {MOVE: 1}]
                        },
                        'role': 'harvester'
                    },
                    {
                        'count': 3,
                        // eslint-disable-next-line
                        'features': {
                            'wanted': [{TOUGH: 2}, {WORK: 4}, {CARRY: 2}, {MOVE: 5}, {RANGED_ATTACK: 1}, {HEAL: 1}, {ATTACK: 1}, {MOVE: 1}]
                        },
                        'role': 'upgrader'
                    },
                    {
                        'count': 2,
                        // eslint-disable-next-line
                        'features': {
                            'wanted': [{TOUGH: 2}, {WORK: 4}, {CARRY: 2}, {MOVE: 5}, {RANGED_ATTACK: 1}, {HEAL: 1}, {ATTACK: 1}, {MOVE: 1}]
                        },
                        'role': 'builder'
                    },
                    {
                        'count': 1,
                        // eslint-disable-next-line
                        'features': {
                            'wanted': [{TOUGH: 2}, {WORK: 4}, {CARRY: 2}, {MOVE: 5}, {RANGED_ATTACK: 1}, {HEAL: 1}, {ATTACK: 1}, {MOVE: 1}]
                        },
                        'role': 'roadCrew'
                    }
                ]
            }
        }
    ]
};

module.exports = DATA;
