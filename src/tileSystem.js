class TileSystem {
    constructor(gameConfig) {
        this.gameConfig = gameConfig;
    }

    handleTileEffects(player, position, gameState, callbacks) {
        const effects = [];
        
        // Check for money tile first
        const moneyAmount = this.gameConfig.moneyTiles[position];
        if (moneyAmount) {
            effects.push({
                type: 'money',
                amount: moneyAmount,
                execute: () => this.handleMoneyTile(player, moneyAmount, callbacks)
            });
        }

        // Check for special tile
        const specialTile = this.gameConfig.specialTiles[position];
        if (specialTile) {
            effects.push({
                type: 'special',
                tile: specialTile,
                execute: () => this.handleSpecialTile(player, specialTile, gameState, callbacks)
            });
        }

        return effects;
    }

    handleMoneyTile(player, amount, callbacks) {
        if (typeof moneyManager !== 'undefined') {
            moneyManager.addMoney(player.playerId, amount);
            player.money = moneyManager.getPlayerMoney(player.playerId);
        }
        
        callbacks.updateStatus(`Player ${player.index + 1} collected $${amount}! Total: $${player.money}`);
        callbacks.updateUI();
    }

    handleSpecialTile(player, tile, gameState, callbacks) {
        callbacks.updateStatus(`${tile.name}: ${tile.description}`);
        
        setTimeout(() => {
            switch (tile.effect) {
                case 'move_forward':
                    callbacks.movePlayer(player, tile.params.spaces);
                    break;
                    
                case 'lose_hearts':
                    this.handleLoseHearts(player, tile, gameState, callbacks);
                    break;
                    
                case 'gain_hearts':
                    this.handleGainHearts(player, tile, gameState, callbacks);
                    break;
                    
                case 'black_hole':
                    this.handleBlackHole(player, tile, gameState, callbacks);
                    break;
                    
                case 'meteor_hit':
                    this.handleMeteorHit(player, tile, gameState, callbacks);
                    break;
                    
                case 'space_station':
                    this.handleSpaceStation(player, tile, gameState, callbacks);
                    break;
                    
                case 'ufo_abduction':
                    this.handleUfoAbduction(player, tile, gameState, callbacks);
                    break;
            }
        }, 1000);
    }

    handleLoseHearts(player, tile, gameState, callbacks) {
        if (this.tryUseShield(player, tile, callbacks)) {
            callbacks.updateStatus(`${tile.name}: Space Shield protected you from losing hearts!`);
            setTimeout(() => {
                gameState.animating = false;
                callbacks.nextTurn();
            }, 1500);
        } else {
            player.hearts = Math.max(0, player.hearts - tile.params.hearts);
            callbacks.updateUI();
            if (player.hearts === 0) {
                callbacks.handlePlayerLoss(player);
            } else {
                gameState.animating = false;
                callbacks.nextTurn();
            }
        }
    }

    handleGainHearts(player, tile, gameState, callbacks) {
        player.hearts = Math.min(5, player.hearts + tile.params.hearts);
        
        // Check if player has Heart Booster and wants to use it
        if (typeof shop !== 'undefined' && shop.hasItem(player.playerId, 'extraLife') && player.hearts < 5) {
            shop.useItem(player.playerId, 'extraLife');
            if (typeof inventoryManager !== 'undefined') {
                inventoryManager.showItemUsage('extraLife', '❤️‍🩹');
            }
            player.hearts = Math.min(5, player.hearts + 1);
            callbacks.updateStatus(`${tile.name}: You also used Heart Booster for an extra heart!`);
        }
        
        callbacks.updateUI();
        gameState.animating = false;
        callbacks.nextTurn();
    }

    handleBlackHole(player, tile, gameState, callbacks) {
        if (this.tryUseShield(player, tile, callbacks)) {
            callbacks.updateStatus(`${tile.name}: Space Shield protected you from losing hearts! But you still go back to start.`);
            setTimeout(() => {
                callbacks.animateMovement(player, 0, () => {
                    gameState.animating = false;
                    callbacks.nextTurn();
                });
            }, 1500);
        } else {
            player.hearts = Math.max(0, player.hearts - tile.params.hearts);
            callbacks.updateUI();
            if (player.hearts === 0) {
                callbacks.handlePlayerLoss(player);
            } else {
                callbacks.animateMovement(player, 0, () => {
                    gameState.animating = false;
                    callbacks.nextTurn();
                });
            }
        }
    }

    handleMeteorHit(player, tile, gameState, callbacks) {
        if (this.tryUseShield(player, tile, callbacks)) {
            callbacks.updateStatus(`${tile.name}: Space Shield protected you from losing hearts! But you still move back.`);
            setTimeout(() => {
                const newPos = Math.max(0, player.position - tile.params.spaces);
                callbacks.animateMovement(player, newPos, () => {
                    gameState.animating = false;
                    callbacks.nextTurn();
                });
            }, 1500);
        } else {
            player.hearts = Math.max(0, player.hearts - tile.params.hearts);
            callbacks.updateUI();
            if (player.hearts === 0) {
                callbacks.handlePlayerLoss(player);
            } else {
                const newPos = Math.max(0, player.position - tile.params.spaces);
                callbacks.animateMovement(player, newPos, () => {
                    gameState.animating = false;
                    callbacks.nextTurn();
                });
            }
        }
    }

    handleSpaceStation(player, tile, gameState, callbacks) {
        player.hearts = Math.min(5, player.hearts + tile.params.hearts);
        callbacks.updateUI();
        gameState.animating = false;
        callbacks.updateStatus(`Player ${player.index + 1} gets another turn!`);
        
        // Enable roll button for human players or start computer turn
        setTimeout(() => {
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            callbacks.setRollButtonState(currentPlayer.type === 'computer');
            
            if (currentPlayer.type === 'computer') {
                setTimeout(callbacks.handleComputerTurn, 1000);
            }
        }, 1500);
    }

    handleUfoAbduction(player, tile, gameState, callbacks) {
        if (this.tryUseShield(player, tile, callbacks)) {
            callbacks.updateStatus(`${tile.name}: Space Shield protected you from losing hearts! But you still skip next turn.`);
            player.skipTurn = true;
            setTimeout(() => {
                gameState.animating = false;
                callbacks.nextTurn();
            }, 1500);
        } else {
            player.hearts = Math.max(0, player.hearts - tile.params.hearts);
            player.skipTurn = true;
            callbacks.updateUI();
            if (player.hearts === 0) {
                callbacks.handlePlayerLoss(player);
            } else {
                gameState.animating = false;
                callbacks.nextTurn();
            }
        }
    }

    tryUseShield(player, tile, callbacks) {
        if (typeof shop !== 'undefined' && shop.hasItem(player.playerId, 'shield')) {
            shop.useItem(player.playerId, 'shield');
            if (typeof inventoryManager !== 'undefined') {
                inventoryManager.showItemUsage('shield', '🛡️');
            }
            return true;
        }
        return false;
    }

    hasMoneyTile(position) {
        return !!this.gameConfig.moneyTiles[position];
    }

    hasSpecialTile(position) {
        return !!this.gameConfig.specialTiles[position];
    }

    getMoneyAmount(position) {
        return this.gameConfig.moneyTiles[position] || 0;
    }

    getSpecialTile(position) {
        return this.gameConfig.specialTiles[position];
    }
}