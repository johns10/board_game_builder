class GiftContext {
    constructor() {
        this.isModalOpen = false;
        this.initializeGiftUI();
    }

    initializeGiftUI() {
        // Create gift modal overlay
        this.modalOverlay = document.createElement('div');
        this.modalOverlay.id = 'gift-modal-overlay';
        this.modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 3000;
            display: none;
            justify-content: center;
            align-items: center;
        `;

        // Create gift modal
        this.giftModal = document.createElement('div');
        this.giftModal.id = 'gift-modal';
        this.giftModal.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: 3px solid #22ff44;
            border-radius: 20px;
            padding: 30px;
            min-width: 400px;
            max-width: 500px;
            color: white;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            animation: giftModalAppear 0.3s ease-out;
        `;

        this.modalOverlay.appendChild(this.giftModal);
        document.body.appendChild(this.modalOverlay);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            width: 30px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
        `;
        closeButton.addEventListener('click', () => this.closeGiftModal());
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = 'transparent';
        });

        this.giftModal.appendChild(closeButton);

        // Close modal when clicking outside
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.closeGiftModal();
            }
        });
    }

    openMoneyShareModal(currentPlayer) {
        if (this.isModalOpen) return;

        this.isModalOpen = true;
        this.giftModal.innerHTML = '';

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
        `;
        closeButton.addEventListener('click', () => this.closeGiftModal());
        this.giftModal.appendChild(closeButton);

        // Title
        const title = document.createElement('h2');
        title.textContent = 'Share Money 💰';
        title.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 24px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;
        this.giftModal.appendChild(title);

        // Current money display
        const moneyDisplay = document.createElement('div');
        moneyDisplay.textContent = `Your money: $${currentPlayer.money}`;
        moneyDisplay.style.cssText = `
            font-size: 18px;
            margin-bottom: 20px;
            color: #22ff44;
            font-weight: bold;
        `;
        this.giftModal.appendChild(moneyDisplay);

        // Amount input
        const amountContainer = document.createElement('div');
        amountContainer.style.cssText = `
            margin-bottom: 20px;
        `;

        const amountLabel = document.createElement('label');
        amountLabel.textContent = 'Amount to share:';
        amountLabel.style.cssText = `
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
        `;

        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.min = '1';
        amountInput.max = currentPlayer.money;
        amountInput.value = '1';
        amountInput.style.cssText = `
            width: 100px;
            padding: 8px;
            border: 2px solid #22ff44;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            font-size: 16px;
            text-align: center;
        `;

        amountContainer.appendChild(amountLabel);
        amountContainer.appendChild(amountInput);
        this.giftModal.appendChild(amountContainer);

        // Players list
        const playersTitle = document.createElement('h3');
        playersTitle.textContent = 'Choose recipient:';
        playersTitle.style.cssText = `
            margin: 20px 0 15px 0;
            font-size: 18px;
        `;
        this.giftModal.appendChild(playersTitle);

        const playersContainer = document.createElement('div');
        playersContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        `;

        // Get other players
        const otherPlayers = gameState.players.filter(p => p.playerId !== currentPlayer.playerId);

        otherPlayers.forEach(player => {
            const playerButton = document.createElement('button');
            playerButton.style.cssText = `
                padding: 12px 20px;
                border: 2px solid ${player.color};
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
            `;

            const playerInfo = document.createElement('span');
            playerInfo.textContent = `${player.type === 'computer' ? 'Computer' : 'Player'} ${player.index + 1}`;

            const playerMoney = document.createElement('span');
            playerMoney.textContent = `$${player.money}`;
            playerMoney.style.color = '#22ff44';

            playerButton.appendChild(playerInfo);
            playerButton.appendChild(playerMoney);

            playerButton.addEventListener('mouseover', () => {
                playerButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                playerButton.style.transform = 'scale(1.02)';
            });

            playerButton.addEventListener('mouseout', () => {
                playerButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                playerButton.style.transform = 'scale(1)';
            });

            playerButton.addEventListener('click', () => {
                const amount = parseInt(amountInput.value);
                if (amount > 0 && amount <= currentPlayer.money) {
                    this.transferMoney(currentPlayer, player, amount);
                    this.closeGiftModal();
                }
            });

            playersContainer.appendChild(playerButton);
        });

        this.giftModal.appendChild(playersContainer);
        this.modalOverlay.style.display = 'flex';
    }

    openInventoryShareModal(currentPlayer) {
        if (this.isModalOpen) return;

        this.isModalOpen = true;
        this.giftModal.innerHTML = '';

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
        `;
        closeButton.addEventListener('click', () => this.closeGiftModal());
        this.giftModal.appendChild(closeButton);

        // Title
        const title = document.createElement('h2');
        title.textContent = 'Share Items 🎁';
        title.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 24px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;
        this.giftModal.appendChild(title);

        // Get player inventory
        const playerInventory = shop.getPlayerInventory(currentPlayer.playerId);
        const hasItems = Object.values(playerInventory).some(count => count > 0);

        if (!hasItems) {
            const noItemsMessage = document.createElement('div');
            noItemsMessage.textContent = 'You have no items to share!';
            noItemsMessage.style.cssText = `
                font-size: 18px;
                color: #ff6b6b;
                margin: 20px 0;
            `;
            this.giftModal.appendChild(noItemsMessage);
            this.modalOverlay.style.display = 'flex';
            return;
        }

        // Items list
        const itemsContainer = document.createElement('div');
        itemsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 20px;
        `;

        const itemNames = {
            shield: 'Space Shield',
            extraLife: 'Heart Booster',
            luckyCharm: 'Lucky Charm',
            jumpBoost: 'Warp Drive'
        };

        const itemIcons = {
            shield: '🛡️',
            extraLife: '❤️‍🩹',
            luckyCharm: '🍀',
            jumpBoost: '🚀'
        };

        // Create item buttons for items that player has
        Object.entries(playerInventory).forEach(([itemId, quantity]) => {
            if (quantity > 0) {
                const itemContainer = document.createElement('div');
                itemContainer.style.cssText = `
                    border: 2px solid #22ff44;
                    border-radius: 10px;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.1);
                `;

                const itemHeader = document.createElement('div');
                itemHeader.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                `;

                const itemTitle = document.createElement('span');
                itemTitle.textContent = `${itemIcons[itemId]} ${itemNames[itemId]}`;
                itemTitle.style.cssText = `
                    font-size: 16px;
                    font-weight: bold;
                `;

                const itemCount = document.createElement('span');
                itemCount.textContent = `x${quantity}`;
                itemCount.style.cssText = `
                    background: #22ff44;
                    color: #000;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                `;

                itemHeader.appendChild(itemTitle);
                itemHeader.appendChild(itemCount);

                // Players list for this item
                const playersContainer = document.createElement('div');
                playersContainer.style.cssText = `
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                `;

                const otherPlayers = gameState.players.filter(p => p.playerId !== currentPlayer.playerId);

                otherPlayers.forEach(player => {
                    const playerButton = document.createElement('button');
                    playerButton.style.cssText = `
                        padding: 6px 12px;
                        border: 1px solid ${player.color};
                        border-radius: 15px;
                        background: rgba(255, 255, 255, 0.1);
                        color: white;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    `;

                    playerButton.textContent = `${player.type === 'computer' ? 'Computer' : 'Player'} ${player.index + 1}`;

                    playerButton.addEventListener('mouseover', () => {
                        playerButton.style.backgroundColor = player.color;
                        playerButton.style.color = '#000';
                    });

                    playerButton.addEventListener('mouseout', () => {
                        playerButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        playerButton.style.color = 'white';
                    });

                    playerButton.addEventListener('click', () => {
                        this.transferItem(currentPlayer, player, itemId);
                        this.closeGiftModal();
                    });

                    playersContainer.appendChild(playerButton);
                });

                itemContainer.appendChild(itemHeader);
                itemContainer.appendChild(playersContainer);
                itemsContainer.appendChild(itemContainer);
            }
        });

        this.giftModal.appendChild(itemsContainer);
        this.modalOverlay.style.display = 'flex';
    }

    transferMoney(fromPlayer, toPlayer, amount) {
        // Validate transfer
        if (amount <= 0 || amount > fromPlayer.money) {
            this.showNotification('Invalid amount!', '#ff6b6b');
            return;
        }

        // Transfer money using money manager
        if (moneyManager.spendMoney(fromPlayer.playerId, amount)) {
            moneyManager.addMoney(toPlayer.playerId, amount);

            // Update player objects
            fromPlayer.money = moneyManager.getPlayerMoney(fromPlayer.playerId);
            toPlayer.money = moneyManager.getPlayerMoney(toPlayer.playerId);

            // Update UI
            updateUI();

            // Show success notification
            this.showNotification(
                `Sent $${amount} to ${toPlayer.type === 'computer' ? 'Computer' : 'Player'} ${toPlayer.index + 1}!`,
                '#22ff44'
            );
        } else {
            this.showNotification('Transfer failed!', '#ff6b6b');
        }
    }

    transferItem(fromPlayer, toPlayer, itemId) {
        // Verify player has the item
        if (!shop.hasItem(fromPlayer.playerId, itemId)) {
            this.showNotification('You don\'t have this item!', '#ff6b6b');
            return;
        }

        // Remove item from sender
        shop.useItem(fromPlayer.playerId, itemId);

        // Add item to recipient
        shop.addItem(toPlayer.playerId, itemId);

        // Update inventory display
        if (typeof inventoryManager !== 'undefined') {
            inventoryManager.updatePlayerInventory(fromPlayer.playerId);
        }

        const itemNames = {
            shield: 'Space Shield',
            extraLife: 'Heart Booster',
            luckyCharm: 'Lucky Charm',
            jumpBoost: 'Warp Drive'
        };

        // Show success notification
        this.showNotification(
            `Sent ${itemNames[itemId]} to ${toPlayer.type === 'computer' ? 'Computer' : 'Player'} ${toPlayer.index + 1}!`,
            '#22ff44'
        );
    }

    showNotification(message, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${color};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 4000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            animation: notificationSlide 3s ease-out forwards;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    closeGiftModal() {
        this.modalOverlay.style.display = 'none';
        this.isModalOpen = false;
    }

    // Method to add share buttons to inventory
    addShareButtonsToInventory() {
        if (typeof inventoryManager === 'undefined') return;

        const inventoryContainer = inventoryManager.inventoryContainer;

        // Check if share buttons already exist
        if (inventoryContainer.querySelector('.share-buttons-container')) {
            return;
        }

        const shareButtonsContainer = document.createElement('div');
        shareButtonsContainer.className = 'share-buttons-container';
        shareButtonsContainer.style.cssText = `
            display: flex;
            gap: 5px;
            margin-top: 10px;
            justify-content: center;
            max-width: 100%;
        `;

        // Share money button
        const shareMoneyButton = document.createElement('button');
        shareMoneyButton.textContent = '💰';
        shareMoneyButton.title = 'Share Money';
        shareMoneyButton.style.cssText = `
            background: linear-gradient(45deg, #ffd700, #ffed4a) !important;
            border: 2px solid #f59e0b !important;
            border-radius: 8px !important;
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;
            max-width: 32px !important;
            min-height: 32px !important;
            max-height: 32px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
            flex-shrink: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
        `;

        shareMoneyButton.addEventListener('mouseover', () => {
            shareMoneyButton.style.transform = 'scale(1.1)';
            shareMoneyButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });

        shareMoneyButton.addEventListener('mouseout', () => {
            shareMoneyButton.style.transform = 'scale(1)';
            shareMoneyButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });

        shareMoneyButton.addEventListener('click', () => {
            if (typeof gameState !== 'undefined' && gameState.players && gameState.players.length > 0) {
                const currentPlayer = gameState.players[gameState.currentPlayerIndex];
                this.openMoneyShareModal(currentPlayer);
            }
        });

        // Share inventory button
        const shareInventoryButton = document.createElement('button');
        shareInventoryButton.textContent = '🎁';
        shareInventoryButton.title = 'Share Items';
        shareInventoryButton.style.cssText = `
            background: linear-gradient(45deg, #4ade80, #22c55e) !important;
            border: 2px solid #22ff44 !important;
            border-radius: 8px !important;
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;
            max-width: 32px !important;
            min-height: 32px !important;
            max-height: 32px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
            flex-shrink: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
        `;

        shareInventoryButton.addEventListener('mouseover', () => {
            shareInventoryButton.style.transform = 'scale(1.1)';
            shareInventoryButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });

        shareInventoryButton.addEventListener('mouseout', () => {
            shareInventoryButton.style.transform = 'scale(1)';
            shareInventoryButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });

        shareInventoryButton.addEventListener('click', () => {
            if (typeof gameState !== 'undefined' && gameState.players && gameState.players.length > 0) {
                const currentPlayer = gameState.players[gameState.currentPlayerIndex];
                this.openInventoryShareModal(currentPlayer);
            }
        });

        shareButtonsContainer.appendChild(shareMoneyButton);
        shareButtonsContainer.appendChild(shareInventoryButton);
        inventoryContainer.appendChild(shareButtonsContainer);
    }
}

// Add CSS animations for gift context
const giftStyle = document.createElement('style');
giftStyle.textContent = `
    @keyframes giftModalAppear {
        0% { 
            transform: scale(0.7);
            opacity: 0;
        }
        100% { 
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes notificationSlide {
        0% { 
            transform: translate(-50%, -100px);
            opacity: 0;
        }
        10% { 
            transform: translate(-50%, 0);
            opacity: 1;
        }
        90% { 
            transform: translate(-50%, 0);
            opacity: 1;
        }
        100% { 
            transform: translate(-50%, -100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(giftStyle);

// Create global gift context instance
const giftContext = new GiftContext();