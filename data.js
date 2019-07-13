
const DATA = {
    'rooms': [
        {
            'W45N37': {
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

                /**
                 * Each body part (except MOVE) generates fatigue points when the
                 * creep moves: 1 point per body part on roads, 2 on plain land,
                 * 10 on swamp. Each MOVE body part decreases fatigue points by
                 * 2 per tick.
                 */

                'units': [
                    {
                        'count': 0,
                        'features': {
                            'needed': [[WORK, 1], [CARRY, 1], [MOVE, 3]],
                            'wanted': [[TOUGH, 8], [WORK, 4], [CARRY, 2], [MOVE, 8], [ATTACK, 3], [MOVE, 1]]
                        },
                        'role': 'harvester'
                    },
                    {
                        'count': 1,
                        'features': {
                            'needed': [[WORK, 1], [CARRY, 1], [MOVE, 3]],
                            'wanted': [[TOUGH, 8], [WORK, 4], [CARRY, 2], [MOVE, 8], [ATTACK, 3], [MOVE, 1]]
                        },
                        'role': 'harvestSender'
                    },
                    {
                        'count': 1,
                        'features': {
                            'needed': [[WORK, 1], [CARRY, 1], [MOVE, 3]],
                            'wanted': [[TOUGH, 8], [WORK, 4], [CARRY, 2], [MOVE, 8], [ATTACK, 3], [MOVE, 1]]
                        },
                        'role': 'harvestReceiver'
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
