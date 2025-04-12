const gameConfig = {
    // Board settings
    boardSize: 600,
    tileSize: 40,
    padding: 40,
    
    // Game settings
    diceRange: [1, 6],
    
    // Player avatars and fallback colors
    players: [
        { avatar: 'images/avatars/player1', color: '#e74c3c' },
        { avatar: 'images/avatars/player2', color: '#3498db' },
        { avatar: 'images/avatars/player3', color: '#2ecc71' },
        { avatar: 'images/avatars/player4', color: '#f39c12' }
    ],
    
    // Path definition - [x, y] coordinates for each tile
    path: [
        [1, 10], // Start position
        [2, 10], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10],
        [10, 9], [10, 8], [10, 7], [10, 6], [10, 5], [10, 4], [10, 3], [10, 2], [10, 1],
        [9, 1], [8, 1], [7, 1], [6, 1], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1],
        [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9],
        [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9],
        [9, 8], [9, 7], [9, 6], [9, 5], [9, 4], [9, 3], [9, 2],
        [8, 2], [7, 2], [6, 2], [5, 2], [4, 2], [3, 2], [2, 2],
        [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8],
        [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8],
        [8, 7], [8, 6], [8, 5], [8, 4], [8, 3],
        [7, 3], [6, 3], [5, 3], [4, 3], [3, 3],
        [3, 4], [3, 5], [3, 6], [3, 7],
        [4, 7], [5, 7], [6, 7], [7, 7],
        [7, 6], [7, 5], [7, 4],
        [6, 4], [5, 4], [4, 4],
        [4, 5], [4, 6],
        [5, 6], [6, 6],
        [6, 5],
        [5, 5]  // Finish position
    ],
    
    // Special tiles configuration
    specialTiles: {
        4: { type: 'wormhole', name: 'Wormhole', description: 'Teleport ahead 5 spaces!', effect: 'move_forward', params: { spaces: 5 } },
        10: { type: 'asteroid', name: 'Asteroid Field', description: 'Hit by asteroids! Lose 1 heart.', effect: 'lose_hearts', params: { hearts: 1 } },
        15: { type: 'alien', name: 'Friendly Alien', description: 'Aliens heal you! Gain 1 heart.', effect: 'gain_hearts', params: { hearts: 1 } },
        22: { type: 'black_hole', name: 'Black Hole', description: 'Pulled into a black hole! Go back to start and lose 2 hearts.', effect: 'black_hole', params: { hearts: 2 } },
        28: { type: 'meteor', name: 'Meteor Shower', description: 'Hit by meteors! Move back 2 spaces and lose 1 heart.', effect: 'meteor_hit', params: { spaces: 2, hearts: 1 } },
        35: { type: 'space_station', name: 'Space Station', description: 'Repair at the station! Gain 2 hearts and roll again.', effect: 'space_station', params: { hearts: 2 } },
        42: { type: 'comet', name: 'Comet', description: 'Ride a comet across the galaxy! Move forward 4 spaces.', effect: 'move_forward', params: { spaces: 4 } },
        50: { type: 'ufo', name: 'UFO Encounter', description: 'Aliens abduct you! Skip your next turn and lose 1 heart.', effect: 'ufo_abduction', params: { hearts: 1 } }
    },
    
    // Visual elements for board decoration
    visualElements: [
        { type: 'sun', x: 500, y: 500, radius: 25 },
        { type: 'planet', x: 100, y: 50, radius: 12, color: '#9C27B0' },
        { type: 'planet', x: 500, y: 150, radius: 15, color: '#607D8B' },
        { type: 'planet', x: 80, y: 400, radius: 14, color: '#8BC34A' }
    ]
};
