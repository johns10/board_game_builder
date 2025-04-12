// Game state
let gameState = {
    phase: 'setup', // setup, playing, gameover
    players: [],
    currentPlayerIndex: 0,
    dice: 0,
    animating: false,
    humanCount: 1,
    computerCount: 1
};

// DOM elements
let renderer;
let statusMessage;
let startButton;
let rollButton;
let playersContainer;
let diceElement;
let diceFace;
let humanCount;
let computerCount;
let humanPlus;
let humanMinus;
let computerPlus;
let computerMinus;

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    statusMessage = document.getElementById('status-message');
    startButton = document.getElementById('start-button');
    rollButton = document.getElementById('roll-button');
    playersContainer = document.getElementById('players-container');
    diceElement = document.getElementById('dice');
    diceFace = diceElement.querySelector('.dice-face');
    
    // Get counter elements
    humanCount = document.getElementById('human-count');
    computerCount = document.getElementById('computer-count');
    humanPlus = document.getElementById('human-plus');
    humanMinus = document.getElementById('human-minus');
    computerPlus = document.getElementById('computer-plus');
    computerMinus = document.getElementById('computer-minus');
    
    // Initialize renderer
    renderer = new BoardRenderer('gameCanvas', gameConfig);
    
    // Draw initial board
    renderer.drawBoard();
    
    // Set up event listeners
    startButton.addEventListener('click', startGame);
    rollButton.addEventListener('click', handleRoll);
    
    // Set up counter buttons
    humanPlus.addEventListener('click', () => updatePlayerCount('human', 1));
    humanMinus.addEventListener('click', () => updatePlayerCount('human', -1));
    computerPlus.addEventListener('click', () => updatePlayerCount('computer', 1));
    computerMinus.addEventListener('click', () => updatePlayerCount('computer', -1));
    
    // Initialize button states
    updateCounterButtons();
});

function updatePlayerCount(type, change) {
    const total = gameState.humanCount + gameState.computerCount;
    
    if (type === 'human') {
        const newCount = gameState.humanCount + change;
        if (newCount >= 0 && newCount <= 4 && total + change <= 4) {
            gameState.humanCount = newCount;
            humanCount.textContent = newCount;
        }
    } else {
        const newCount = gameState.computerCount + change;
        if (newCount >= 0 && newCount <= 4 && total + change <= 4) {
            gameState.computerCount = newCount;
            computerCount.textContent = newCount;
        }
    }
    
    updateCounterButtons();
}

function updateCounterButtons() {
    const total = gameState.humanCount + gameState.computerCount;
    
    humanMinus.disabled = gameState.humanCount <= 0;
    humanPlus.disabled = gameState.humanCount >= 4 || total >= 4;
    
    computerMinus.disabled = gameState.computerCount <= 0;
    computerPlus.disabled = gameState.computerCount >= 4 || total >= 4;
    
    startButton.disabled = total < 2;
}

function startGame() {
    // Initialize players
    gameState.players = [];
    let playerIndex = 0;
    
    // Add human players
    for (let i = 0; i < gameState.humanCount; i++) {
        gameState.players.push({
            index: playerIndex,
            position: 0,
            avatar: gameConfig.players[playerIndex].avatar,
            avatarPng: `${gameConfig.players[playerIndex].avatar}.png`,
            avatarSvg: `${gameConfig.players[playerIndex].avatar}.svg`,
            color: gameConfig.players[playerIndex].color,
            skipTurn: false,
            type: 'human',
            hearts: 5
        });
        playerIndex++;
    }
    
    // Add computer players
    for (let i = 0; i < gameState.computerCount; i++) {
        gameState.players.push({
            index: playerIndex,
            position: 0,
            avatar: gameConfig.players[playerIndex].avatar,
            avatarPng: `${gameConfig.players[playerIndex].avatar}.png`,
            avatarSvg: `${gameConfig.players[playerIndex].avatar}.svg`,
            color: gameConfig.players[playerIndex].color,
            skipTurn: false,
            type: 'computer',
            hearts: 5
        });
        playerIndex++;
    }
    
    // Update game state
    gameState.phase = 'playing';
    gameState.currentPlayerIndex = 0;
    
    // Update UI
    updateUI();
    
    // Enable roll button for human player
    rollButton.disabled = gameState.players[0].type === 'computer';
    
    // Disable counter buttons and start button
    humanPlus.disabled = true;
    humanMinus.disabled = true;
    computerPlus.disabled = true;
    computerMinus.disabled = true;
    startButton.disabled = true;
    
    // Show initial status
    updateStatusMessage(`Player 1's turn to roll!`);
    
    // If first player is computer, start their turn
    if (gameState.players[0].type === 'computer') {
        setTimeout(handleComputerTurn, 1000);
    }
}

function handleComputerTurn() {
    if (gameState.phase !== 'playing' || gameState.animating) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Check if player should skip turn
    if (currentPlayer.skipTurn) {
        currentPlayer.skipTurn = false;
        updateStatusMessage(`Player ${currentPlayer.index + 1} loses their turn!`);
        setTimeout(() => {
            nextTurn();
        }, 1000);
        return;
    }
    
    // Start rolling animation
    diceFace.removeAttribute('data-value');
    diceFace.classList.add('rolling');
    
    // Roll dice after a short delay
    setTimeout(() => {
        const roll = Math.floor(Math.random() * 6) + 1;
        gameState.dice = roll;
        
        // Stop rolling animation and show result
        diceFace.classList.remove('rolling');
        diceFace.setAttribute('data-value', roll.toString());
        
        // Update status
        updateStatusMessage(`Player ${currentPlayer.index + 1} rolled a ${roll}!`);
        
        // Move player after showing dice
        setTimeout(() => {
            movePlayer(currentPlayer, roll);
        }, 1000);
    }, 600);
}

function handleRoll() {
    if (gameState.phase !== 'playing' || gameState.animating) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Only allow human players to click roll button
    if (currentPlayer.type === 'computer') return;
    
    // Check if player should skip turn
    if (currentPlayer.skipTurn) {
        currentPlayer.skipTurn = false;
        updateStatusMessage(`Player ${currentPlayer.index + 1} loses their turn!`);
        setTimeout(() => {
            nextTurn();
        }, 1000);
        return;
    }
    
    // Disable roll button during animation
    rollButton.disabled = true;
    
    // Start rolling animation
    diceFace.removeAttribute('data-value');
    diceFace.classList.add('rolling');
    
    // Roll dice after a short delay
    setTimeout(() => {
        const roll = Math.floor(Math.random() * 6) + 1;
        gameState.dice = roll;
        
        // Stop rolling animation and show result
        diceFace.classList.remove('rolling');
        diceFace.setAttribute('data-value', roll.toString());
        
        // Update status
        updateStatusMessage(`Player ${currentPlayer.index + 1} rolled a ${roll}!`);
        
        // Move player after showing dice
        setTimeout(() => {
            movePlayer(currentPlayer, roll);
            rollButton.disabled = false;
        }, 1000);
    }, 600);
}

function movePlayer(player, spaces) {
    gameState.animating = true;
    
    // Calculate new position
    const newPosition = Math.min(player.position + spaces, gameConfig.path.length - 1);
    
    // Animate movement
    animateMovement(player, newPosition, () => {
        // Check for special tile
        const specialTile = gameConfig.specialTiles[newPosition];
        if (specialTile) {
            handleSpecialTile(player, specialTile);
        } else {
            gameState.animating = false;
            
            // Check for win
            if (newPosition === gameConfig.path.length - 1) {
                handleWin(player);
            } else {
                nextTurn();
            }
        }
    });
}

function animateMovement(player, newPosition, callback) {
    const steps = newPosition - player.position;
    let currentStep = 0;
    
    function step() {
        if (currentStep < steps) {
            player.position++;
            currentStep++;
            
            // Redraw board and players
            renderer.drawBoard();
            renderer.drawPlayers(gameState.players);
            
            requestAnimationFrame(() => {
                setTimeout(step, 200); // Delay between steps
            });
        } else {
            callback();
        }
    }
    
    step();
}

function handleSpecialTile(player, tile) {
    updateStatusMessage(`${tile.name}: ${tile.description}`);
    
    setTimeout(() => {
        switch (tile.effect) {
            case 'move_forward':
                movePlayer(player, tile.params.spaces);
                break;
                
            case 'lose_hearts':
                player.hearts = Math.max(0, player.hearts - tile.params.hearts);
                updateUI();
                if (player.hearts === 0) {
                    handlePlayerLoss(player);
                } else {
                    gameState.animating = false;
                    nextTurn();
                }
                break;
                
            case 'gain_hearts':
                player.hearts = Math.min(5, player.hearts + tile.params.hearts);
                updateUI();
                gameState.animating = false;
                nextTurn();
                break;
                
            case 'black_hole':
                player.hearts = Math.max(0, player.hearts - tile.params.hearts);
                updateUI();
                if (player.hearts === 0) {
                    handlePlayerLoss(player);
                } else {
                    animateMovement(player, 0, () => {
                        gameState.animating = false;
                        nextTurn();
                    });
                }
                break;
                
            case 'meteor_hit':
                player.hearts = Math.max(0, player.hearts - tile.params.hearts);
                updateUI();
                if (player.hearts === 0) {
                    handlePlayerLoss(player);
                } else {
                    const newPos = Math.max(0, player.position - tile.params.spaces);
                    animateMovement(player, newPos, () => {
                        gameState.animating = false;
                        nextTurn();
                    });
                }
                break;
                
            case 'space_station':
                player.hearts = Math.min(5, player.hearts + tile.params.hearts);
                updateUI();
                gameState.animating = false;
                updateStatusMessage(`Player ${player.index + 1} gets another turn!`);
                break;
                
            case 'ufo_abduction':
                player.hearts = Math.max(0, player.hearts - tile.params.hearts);
                player.skipTurn = true;
                updateUI();
                if (player.hearts === 0) {
                    handlePlayerLoss(player);
                } else {
                    gameState.animating = false;
                    nextTurn();
                }
                break;
        }
    }, 1000);
}

function handlePlayerLoss(player) {
    updateStatusMessage(`Player ${player.index + 1} lost all hearts and is out of the game!`);
    
    // Remove player from game
    gameState.players = gameState.players.filter(p => p !== player);
    
    // If only one player remains, they win
    if (gameState.players.length === 1) {
        handleWin(gameState.players[0]);
    } else {
        // Adjust currentPlayerIndex if needed
        if (gameState.currentPlayerIndex >= gameState.players.length) {
            gameState.currentPlayerIndex = 0;
        }
        gameState.animating = false;
        nextTurn();
    }
}

function handleWin(player) {
    gameState.phase = 'gameover';
    updateStatusMessage(`${player.type === 'computer' ? 'Computer' : 'Player'} ${player.index + 1} wins!`);
    rollButton.disabled = true;
    
    // Re-enable all controls for new game
    startButton.disabled = false;
    humanPlus.disabled = false;
    humanMinus.disabled = false;
    computerPlus.disabled = false;
    computerMinus.disabled = false;
    
    // Reset counters to initial state
    updateCounterButtons();
}

function nextTurn() {
    if (gameState.phase !== 'playing') return;
    
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    const nextPlayer = gameState.players[gameState.currentPlayerIndex];
    
    updateStatusMessage(`Player ${nextPlayer.index + 1}'s turn to roll!`);
    updateUI();
    
    // Enable/disable roll button based on player type
    rollButton.disabled = nextPlayer.type === 'computer';
    
    // If next player is computer, start their turn
    if (nextPlayer.type === 'computer') {
        setTimeout(handleComputerTurn, 1000);
    }
}

function updateUI() {
    // Clear players container
    playersContainer.innerHTML = '';
    
    // Add player indicators
    gameState.players.forEach((player) => {
        const playerDiv = document.createElement('div');
        playerDiv.style.padding = '12px 20px';
        playerDiv.style.borderRadius = '8px';
        playerDiv.style.backgroundColor = player.index === gameState.currentPlayerIndex ? '#e3f2fd' : 'transparent';
        playerDiv.style.border = `2px solid ${player.color}`;
        playerDiv.style.display = 'flex';
        playerDiv.style.alignItems = 'center';
        playerDiv.style.gap = '12px';
        playerDiv.style.transition = 'all 0.3s ease';
        
        const avatarImg = document.createElement('img');
        // Try SVG first, fallback to PNG
        avatarImg.src = player.avatarSvg;
        avatarImg.style.display = 'inline-block';
        avatarImg.style.width = '24px';
        avatarImg.style.height = '24px';
        avatarImg.style.borderRadius = '50%';
        avatarImg.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        avatarImg.style.objectFit = 'cover';
        avatarImg.onerror = () => {
            // Try PNG if SVG fails
            avatarImg.src = player.avatarPng;
            avatarImg.onerror = () => {
                // Fallback to color if both SVG and PNG fail
                avatarImg.style.display = 'none';
                const colorFallback = document.createElement('span');
                colorFallback.style.display = 'inline-block';
                colorFallback.style.width = '24px';
                colorFallback.style.height = '24px';
                colorFallback.style.backgroundColor = player.color;
                colorFallback.style.borderRadius = '50%';
                colorFallback.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                avatarImg.parentNode.insertBefore(colorFallback, avatarImg);
            };
        };
        
        const playerInfo = document.createElement('div');
        playerInfo.style.display = 'flex';
        playerInfo.style.flexDirection = 'column';
        playerInfo.style.alignItems = 'flex-start';
        playerInfo.style.gap = '5px';
        
        const text = document.createElement('span');
        text.className = 'player-name';
        text.style.fontWeight = player.index === gameState.currentPlayerIndex ? 'bold' : 'normal';
        text.textContent = `${player.type === 'computer' ? 'Computer' : 'Player'} ${player.index + 1}`;
        
        const hearts = document.createElement('div');
        hearts.className = 'hearts';
        
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('span');
            heart.textContent = i < player.hearts ? '❤️' : '🖤';
            hearts.appendChild(heart);
        }
        
        playerInfo.appendChild(text);
        playerInfo.appendChild(hearts);
        
        playerDiv.appendChild(avatarImg);
        playerDiv.appendChild(playerInfo);
        playersContainer.appendChild(playerDiv);
    });
    
    // Draw board and players
    renderer.drawBoard();
    renderer.drawPlayers(gameState.players);
}

function updateStatusMessage(message) {
    statusMessage.textContent = message;
}
