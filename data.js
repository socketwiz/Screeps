
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

                'units': [
                    {
                        'priority': 1,
                        'count': 2,
                        'features': [WORK, CARRY, MOVE, MOVE],
                        'role': 'harvester'
                    },
                    {
                        'priority': 2,
                        'count': 3,
                        'features': [WORK, WORK, WORK, CARRY, MOVE, MOVE],
                        'role': 'upgrader'
                    },
                    {
                        'priority': 3,
                        'count': 2,
                        'features': [WORK, WORK, WORK, CARRY, MOVE, MOVE],
                        'role': 'builder'
                    }
                ]
            }
        }
    ]
};

module.exports = DATA;
