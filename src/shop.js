class Shop {
    constructor() {
        this.isOpen = false;
        this.playerInventories = {}; // Track player inventories
        this.initializeShopUI();
    }

    initializeShopUI() {
        // Create shop container
        this.shopContainer = document.createElement('div');
        this.shopContainer.id = 'shop-container';
        this.shopContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, ${shopConfig.ui.backgroundColor}, #0a0e27);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            transition: all 0.5s ease;
        `;

        // Create shop window
        this.shopWindow = document.createElement('div');
        this.shopWindow.style.cssText = `
            background: ${shopConfig.ui.windowColor};
            border: 3px solid ${shopConfig.ui.ufoWindowColor};
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 0 30px ${shopConfig.ui.ufoWindowColor}40;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        // Create shop header
        const header = document.createElement('div');
        header.innerHTML = `
            <h2 style="color: ${shopConfig.ui.textColor}; text-align: center; margin: 0 0 20px 0; font-size: 28px;">
                🛸 Galactic Shop 🛸
            </h2>
            <div style="text-align: center; margin-bottom: 20px;">
                <span id="player-money-display" style="color: ${shopConfig.ui.buttonColor}; font-size: 18px; font-weight: bold;"></span>
            </div>
        `;

        // Create items container
        this.itemsContainer = document.createElement('div');
        this.itemsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        `;

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close Shop';
        closeButton.style.cssText = `
            width: 100%;
            padding: 12px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        closeButton.addEventListener('mouseover', () => closeButton.style.background = '#dc2626');
        closeButton.addEventListener('mouseout', () => closeButton.style.background = '#ef4444');
        closeButton.addEventListener('click', () => this.closeShop());

        // Assemble shop window
        this.shopWindow.appendChild(header);
        this.shopWindow.appendChild(this.itemsContainer);
        this.shopWindow.appendChild(closeButton);
        this.shopContainer.appendChild(this.shopWindow);
        document.body.appendChild(this.shopContainer);

        // Create UFO button
        this.createUfoButton();
    }

    createUfoButton() {
        this.ufoButton = document.createElement('div');
        this.ufoButton.id = 'ufo-shop-button';
        this.ufoButton.style.cssText = `
            position: fixed;
            top: ${shopConfig.ufoButton.y}px;
            left: ${shopConfig.ufoButton.x}px;
            width: ${shopConfig.ufoButton.width}px;
            height: ${shopConfig.ufoButton.height}px;
            background: linear-gradient(45deg, #4ade80, #22c55e);
            border: 3px solid ${shopConfig.ui.ufoWindowColor};
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(74, 222, 128, 0.4);
            transition: all 0.3s ease;
            z-index: 100;
            animation: ufoGlow 2s ease-in-out infinite alternate;
        `;

        // Add glow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ufoGlow {
                0% { box-shadow: 0 4px 15px rgba(74, 222, 128, 0.4); }
                100% { box-shadow: 0 8px 25px rgba(74, 222, 128, 0.8); }
            }
        `;
        document.head.appendChild(style);

        const ufoContent = document.createElement('div');
        ufoContent.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="font-size: 20px; margin-bottom: 2px;">🛸</div>
                <div style="font-size: 12px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">SHOP</div>
            </div>
        `;

        this.ufoButton.appendChild(ufoContent);
        this.ufoButton.addEventListener('click', () => this.openShop());
        this.ufoButton.addEventListener('mouseover', () => {
            this.ufoButton.style.transform = 'scale(1.1)';
            this.ufoButton.style.boxShadow = '0 8px 25px rgba(74, 222, 128, 0.8)';
        });
        this.ufoButton.addEventListener('mouseout', () => {
            this.ufoButton.style.transform = 'scale(1)';
            this.ufoButton.style.boxShadow = '0 4px 15px rgba(74, 222, 128, 0.4)';
        });

        document.body.appendChild(this.ufoButton);
    }

    openShop() {
        if (!gameState.players || gameState.players.length === 0) {
            alert('Start a game first!');
            return;
        }

        this.isOpen = true;
        this.currentPlayer = gameState.players[gameState.currentPlayerIndex];
        this.updateShopDisplay();
        
        // Teleport effect
        this.shopContainer.style.display = 'flex';
        setTimeout(() => {
            this.shopWindow.style.transform = 'scale(1)';
        }, 50);
        
        // Hide game UI
        document.getElementById('game-container').style.display = 'none';
    }

    closeShop() {
        this.isOpen = false;
        this.shopWindow.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.shopContainer.style.display = 'none';
            // Show game UI
            document.getElementById('game-container').style.display = 'block';
        }, 300);
    }

    updateShopDisplay() {
        // Update player money display
        const moneyDisplay = document.getElementById('player-money-display');
        moneyDisplay.textContent = `💰 ${this.currentPlayer.type === 'computer' ? 'Computer' : 'Player'} ${this.currentPlayer.index + 1} - $${this.currentPlayer.money}`;

        // Clear items container
        this.itemsContainer.innerHTML = '';

        // Add shop items
        Object.values(shopConfig.items).forEach(item => {
            const itemCard = this.createItemCard(item);
            this.itemsContainer.appendChild(itemCard);
        });
    }

    createItemCard(item) {
        const card = document.createElement('div');
        card.style.cssText = `
            background: ${shopConfig.ui.accentColor};
            border: 2px solid ${shopConfig.ui.ufoWindowColor}40;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
        `;

        const playerInventory = this.getPlayerInventory(this.currentPlayer.playerId);
        const itemCount = playerInventory[item.id] || 0;
        const canAfford = this.currentPlayer.money >= item.price;

        card.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 10px;">${item.icon}</div>
            <h3 style="color: ${shopConfig.ui.textColor}; margin: 0 0 10px 0; font-size: 18px;">${item.name}</h3>
            <p style="color: ${shopConfig.ui.textColor}90; margin: 0 0 15px 0; font-size: 14px; line-height: 1.4;">${item.description}</p>
            <div style="color: ${shopConfig.ui.buttonColor}; font-weight: bold; margin-bottom: 10px;">
                💰 $${item.price}
            </div>
            <div style="color: ${shopConfig.ui.textColor}80; font-size: 12px; margin-bottom: 15px;">
                Owned: ${itemCount} | Max uses: ${item.maxUses}
            </div>
        `;

        const buyButton = document.createElement('button');
        buyButton.textContent = canAfford ? 'Buy Item' : 'Not enough money';
        buyButton.disabled = !canAfford;
        buyButton.style.cssText = `
            width: 100%;
            padding: 10px;
            background: ${canAfford ? shopConfig.ui.buttonColor : '#666'};
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: bold;
            cursor: ${canAfford ? 'pointer' : 'not-allowed'};
            transition: background 0.3s ease;
        `;

        if (canAfford) {
            buyButton.addEventListener('mouseover', () => buyButton.style.background = shopConfig.ui.buttonHoverColor);
            buyButton.addEventListener('mouseout', () => buyButton.style.background = shopConfig.ui.buttonColor);
            buyButton.addEventListener('click', () => this.buyItem(item));
        }

        card.appendChild(buyButton);

        // Hover effect for card
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = `0 8px 20px ${shopConfig.ui.ufoWindowColor}30`;
        });
        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });

        return card;
    }

    buyItem(item) {
        if (moneyManager.spendMoney(this.currentPlayer.playerId, item.price)) {
            // Update player money in game state
            this.currentPlayer.money = moneyManager.getPlayerMoney(this.currentPlayer.playerId);
            
            // Add item to player inventory
            this.addItemToInventory(this.currentPlayer.playerId, item.id, item.maxUses);
            
            // Update shop display
            this.updateShopDisplay();
            
            // Update main game UI
            updateUI();
            
            // Update inventory display
            if (typeof inventoryManager !== 'undefined') {
                inventoryManager.updatePlayerInventory(this.currentPlayer.playerId);
            }
            
            // Show purchase confirmation
            this.showPurchaseConfirmation(item);
        } else {
            alert('Not enough money!');
        }
    }

    addItemToInventory(playerId, itemId, uses) {
        if (!this.playerInventories[playerId]) {
            this.playerInventories[playerId] = {};
        }
        
        if (!this.playerInventories[playerId][itemId]) {
            this.playerInventories[playerId][itemId] = 0;
        }
        
        this.playerInventories[playerId][itemId] += uses;
    }

    addItem(playerId, itemId, uses = 1) {
        this.addItemToInventory(playerId, itemId, uses);
    }

    getPlayerInventory(playerId) {
        return this.playerInventories[playerId] || {};
    }

    useItem(playerId, itemId) {
        const inventory = this.getPlayerInventory(playerId);
        if (inventory[itemId] && inventory[itemId] > 0) {
            inventory[itemId]--;
            return true;
        }
        return false;
    }

    hasItem(playerId, itemId) {
        const inventory = this.getPlayerInventory(playerId);
        return inventory[itemId] && inventory[itemId] > 0;
    }

    showPurchaseConfirmation(item) {
        const confirmation = document.createElement('div');
        confirmation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${shopConfig.ui.buttonColor};
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 1001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        confirmation.textContent = `✅ Purchased ${item.name}!`;
        
        document.body.appendChild(confirmation);
        
        setTimeout(() => {
            document.body.removeChild(confirmation);
        }, 2000);
    }
}

// Create global shop instance
const shop = new Shop();