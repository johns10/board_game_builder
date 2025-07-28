const shopConfig = {
    // Shop items available for purchase
    items: {
        shield: {
            id: 'shield',
            name: 'Space Shield',
            description: 'Protects you from losing hearts 2 times',
            price: 15,
            maxUses: 2,
            icon: '🛡️',
            effect: 'heart_protection'
        },
        extraLife: {
            id: 'extraLife',
            name: 'Heart Booster',
            description: 'Instantly gain 1 heart',
            price: 10,
            maxUses: 1,
            icon: '❤️‍🩹',
            effect: 'gain_heart'
        },
        luckyCharm: {
            id: 'luckyCharm',
            name: 'Lucky Charm',
            description: 'Roll the dice twice and pick the better result',
            price: 20,
            maxUses: 3,
            icon: '🍀',
            effect: 'lucky_roll'
        },
        jumpBoost: {
            id: 'jumpBoost',
            name: 'Warp Drive',
            description: 'Move forward 3 extra spaces once',
            price: 12,
            maxUses: 1,
            icon: '🚀',
            effect: 'bonus_movement'
        }
    },
    
    // Shop UI configuration
    ui: {
        backgroundColor: '#1a1a2e',
        windowColor: '#16213e',
        accentColor: '#0f3460',
        textColor: '#ffffff',
        buttonColor: '#4ade80',
        buttonHoverColor: '#22c55e',
        ufoColor: '#4ade80',
        ufoWindowColor: '#22ff44'
    },
    
    // Shop positioning
    ufoButton: {
        x: 50,
        y: 50,
        width: 120,
        height: 60
    }
};