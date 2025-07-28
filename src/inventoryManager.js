class InventoryManager {
    constructor() {
        this.inventoryContainer = null;
        this.initializeInventoryUI();
    }

    initializeInventoryUI() {
        // Create inventory container that will be positioned in the game UI
        this.inventoryContainer = document.createElement('div');
        this.inventoryContainer.id = 'inventory-container';
        this.inventoryContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 50;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 200px;
        `;
        document.body.appendChild(this.inventoryContainer);
    }

    createInventoryUFO(itemIcon, quantity, itemId) {
        const ufoContainer = document.createElement('div');
        ufoContainer.className = 'inventory-ufo';
        ufoContainer.style.cssText = `
            position: relative;
            width: 60px;
            height: 35px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        // UFO body
        const ufoBody = document.createElement('div');
        ufoBody.style.cssText = `
            width: 60px;
            height: 20px;
            background: linear-gradient(45deg, #4ade80, #22c55e);
            border: 2px solid #22ff44;
            border-radius: 50px;
            position: relative;
            box-shadow: 0 2px 8px rgba(74, 222, 128, 0.4);
        `;

        // UFO dome/window
        const ufoDome = document.createElement('div');
        ufoDome.style.cssText = `
            width: 30px;
            height: 15px;
            background: rgba(34, 255, 68, 0.8);
            border: 1px solid #22ff44;
            border-radius: 15px 15px 0 0;
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        `;

        // Item icon in the window
        ufoDome.textContent = itemIcon;

        // Quantity indicator
        const quantityBadge = document.createElement('div');
        quantityBadge.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ef4444;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 10px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid white;
        `;
        quantityBadge.textContent = quantity;

        // UFO lights
        const lights = document.createElement('div');
        lights.style.cssText = `
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 3px;
        `;

        // Add 3 small lights
        for (let i = 0; i < 3; i++) {
            const light = document.createElement('div');
            light.style.cssText = `
                width: 4px;
                height: 4px;
                background: #22ff44;
                border-radius: 50%;
                animation: ufoLightBlink ${0.5 + i * 0.2}s ease-in-out infinite alternate;
            `;
            lights.appendChild(light);
        }

        // Assemble UFO
        ufoBody.appendChild(ufoDome);
        ufoContainer.appendChild(ufoBody);
        ufoContainer.appendChild(quantityBadge);
        ufoContainer.appendChild(lights);

        // Hover effects
        ufoContainer.addEventListener('mouseover', () => {
            ufoContainer.style.transform = 'scale(1.1) translateY(-2px)';
            ufoBody.style.boxShadow = '0 4px 15px rgba(74, 222, 128, 0.8)';
        });

        ufoContainer.addEventListener('mouseout', () => {
            ufoContainer.style.transform = 'scale(1) translateY(0)';
            ufoBody.style.boxShadow = '0 2px 8px rgba(74, 222, 128, 0.4)';
        });

        // Store reference for consumption animation
        ufoContainer.dataset.itemId = itemId;

        // Add tooltip
        this.addTooltip(ufoContainer, itemId, quantity);

        return ufoContainer;
    }

    addTooltip(element, itemId, quantity) {
        const itemNames = {
            shield: 'Space Shield',
            extraLife: 'Heart Booster',
            luckyCharm: 'Lucky Charm',
            jumpBoost: 'Warp Drive'
        };

        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1000;
        `;
        tooltip.textContent = `${itemNames[itemId] || itemId} (${quantity})`;

        element.appendChild(tooltip);

        element.addEventListener('mouseover', () => {
            tooltip.style.opacity = '1';
        });

        element.addEventListener('mouseout', () => {
            tooltip.style.opacity = '0';
        });
    }

    updatePlayerInventory(playerId) {
        if (typeof shop === 'undefined') return;

        // Clear existing inventory display
        this.inventoryContainer.innerHTML = '';

        // Create title
        const title = document.createElement('div');
        title.style.cssText = `
            color: white;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 5px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        `;
        title.textContent = 'Inventory';
        this.inventoryContainer.appendChild(title);

        // Create inventory grid
        const inventoryGrid = document.createElement('div');
        inventoryGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            border: 1px solid rgba(74, 222, 128, 0.3);
        `;

        const playerInventory = shop.getPlayerInventory(playerId);

        // Add UFOs for each item type if player has it
        if (playerInventory.shield > 0) {
            inventoryGrid.appendChild(this.createInventoryUFO('🛡️', playerInventory.shield, 'shield'));
        }
        if (playerInventory.extraLife > 0) {
            inventoryGrid.appendChild(this.createInventoryUFO('❤️‍🩹', playerInventory.extraLife, 'extraLife'));
        }
        if (playerInventory.luckyCharm > 0) {
            inventoryGrid.appendChild(this.createInventoryUFO('🍀', playerInventory.luckyCharm, 'luckyCharm'));
        }
        if (playerInventory.jumpBoost > 0) {
            inventoryGrid.appendChild(this.createInventoryUFO('🚀', playerInventory.jumpBoost, 'jumpBoost'));
        }

        // Show empty message if no items
        if (Object.values(playerInventory).every(count => count === 0)) {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                color: rgba(255, 255, 255, 0.6);
                font-size: 10px;
                padding: 10px;
            `;
            emptyMessage.textContent = 'No items yet - visit the shop!';
            inventoryGrid.appendChild(emptyMessage);
        }

        this.inventoryContainer.appendChild(inventoryGrid);
        
        // Add share buttons if gift context is available
        if (typeof giftContext !== 'undefined') {
            giftContext.addShareButtonsToInventory();
        }
    }

    showInventoryForCurrentPlayer() {
        if (typeof gameState !== 'undefined' && gameState.players && gameState.players.length > 0) {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            this.updatePlayerInventory(currentPlayer.playerId);
        }
    }

    hideInventory() {
        this.inventoryContainer.style.display = 'none';
    }

    showInventory() {
        this.inventoryContainer.style.display = 'block';
    }

    animateItemConsumption(itemId) {
        // Find the UFO for this item and animate it
        const ufoElements = this.inventoryContainer.querySelectorAll('.inventory-ufo');
        ufoElements.forEach(ufo => {
            if (ufo.dataset.itemId === itemId) {
                // Animate UFO consumption
                ufo.style.animation = 'ufoConsumption 0.8s ease-out forwards';
                
                // Add flash effect
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: white;
                    opacity: 0.8;
                    border-radius: 50px;
                    animation: flashEffect 0.3s ease-out;
                `;
                ufo.appendChild(flash);
                
                // Remove flash after animation
                setTimeout(() => {
                    if (ufo.contains(flash)) {
                        ufo.removeChild(flash);
                    }
                }, 300);
            }
        });
    }

    showItemUsage(itemId, itemIcon) {
        // Animate UFO consumption first
        this.animateItemConsumption(itemId);
        
        // Create usage notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #4ade80, #22c55e);
            border: 3px solid #22ff44;
            border-radius: 15px;
            padding: 20px;
            z-index: 2000;
            text-align: center;
            box-shadow: 0 0 30px rgba(74, 222, 128, 0.8);
            animation: itemUsagePopup 2s ease-out forwards;
        `;

        const itemNames = {
            shield: 'Space Shield',
            extraLife: 'Heart Booster',
            luckyCharm: 'Lucky Charm',
            jumpBoost: 'Warp Drive'
        };

        notification.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 10px;">${itemIcon}</div>
            <div style="color: white; font-weight: bold; font-size: 18px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                ${itemNames[itemId]} USED!
            </div>
        `;

        document.body.appendChild(notification);

        // Remove after animation
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 2000);

        // Update inventory display to reflect usage
        if (typeof gameState !== 'undefined' && gameState.players && gameState.players.length > 0) {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            setTimeout(() => {
                this.updatePlayerInventory(currentPlayer.playerId);
            }, 800);
        }
    }
}

// Add CSS animations
const inventoryStyle = document.createElement('style');
inventoryStyle.textContent = `
    @keyframes ufoLightBlink {
        0% { opacity: 0.3; }
        100% { opacity: 1; }
    }
    
    @keyframes itemUsagePopup {
        0% { 
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        20% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        40% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }
    
    @keyframes ufoConsumption {
        0% { 
            transform: scale(1);
            opacity: 1;
        }
        50% { 
            transform: scale(1.3);
            opacity: 0.8;
        }
        100% { 
            transform: scale(0.8);
            opacity: 0.3;
        }
    }
    
    @keyframes flashEffect {
        0% { 
            opacity: 0.8;
        }
        100% { 
            opacity: 0;
        }
    }
`;
document.head.appendChild(inventoryStyle);

// Create global inventory manager instance
const inventoryManager = new InventoryManager();