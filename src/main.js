// Game state
let gameState = {
    phase: 'setup', // setup, playing, gameover
    players: [],
    currentPlayerIndex: 0,
    dice: 0,
    animating: false
};

// DOM elements
let renderer;
let statusMessage;
let playerCountSelect;
let startButton;
let rollButton;
let playersContainer;
let diceElement;
let diceFace;

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    statusMessage = document.getElementById('status-message');
    playerCountSelect = document.getElementById('player-count');
    startButton = document.getElementById('start-button');
    rollButton = document.getElementById('roll-button');
    playersContainer = document.getElementById('players-container');
    diceElement = document.getElementById('dice');
    diceFace = diceElement.querySelector('.dice-face');
    
    // Initialize renderer
    renderer = new BoardRenderer('gameCanvas', gameConfig);
    
    // Draw initial board
    renderer.drawBoard();
    
    // Set up event listeners
    startButton.addEventListener('click', startGame);
    rollButton.addEventListener('click', handleRoll);
});

function startGame() {
    // Get number of players
    const playerCount = parseInt(playerCountSelect.value);
    
    // Initialize players
    gameState.players = [];
    for (let i = 0; i < playerCount; i++) {
        gameState.players.push({
            index: i,
            position: 0,
            avatar: gameConfig.players[i].avatar, // Base path without extension
            avatarPng: `${gameConfig.players[i].avatar}.png`,
            avatarSvg: `${gameConfig.players[i].avatar}.svg`,
            color: gameConfig.players[i].color, // fallback color
            skipTurn: false
        });
    }
    
    // Update game state
    gameState.phase = 'playing';
    gameState.currentPlayerIndex = 0;
    
    // Update UI
    updateUI();
    
    // Enable roll button
    rollButton.disabled = false;
    
    // Disable player count and start button
    playerCountSelect.disabled = true;
    startButton.disabled = true;
    
    // Show initial status
    updateStatusMessage(`Player 1's turn to roll!`);
}

function handleRoll() {
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
                
            case 'move_backward':
                const newPos = Math.max(0, player.position - tile.params.spaces);
                animateMovement(player, newPos, () => {
                    gameState.animating = false;
                    nextTurn();
                });
                break;
                
            case 'lose_turn':
                player.skipTurn = true;
                gameState.animating = false;
                nextTurn();
                break;
                
            case 'extra_turn':
                gameState.animating = false;
                updateStatusMessage(`Player ${player.index + 1} gets another turn!`);
                break;
                
            case 'go_to_start':
                animateMovement(player, 0, () => {
                    gameState.animating = false;
                    nextTurn();
                });
                break;
        }
    }, 1000);
}

function handleWin(player) {
    gameState.phase = 'gameover';
    updateStatusMessage(`Player ${player.index + 1} wins!`);
    rollButton.disabled = true;
    
    // Enable start button for new game
    startButton.disabled = false;
    playerCountSelect.disabled = false;
}

function nextTurn() {
    if (gameState.phase !== 'playing') return;
    
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    updateStatusMessage(`Player ${gameState.currentPlayerIndex + 1}'s turn to roll!`);
    updateUI();
}

function updateUI() {
    // Clear players container
    playersContainer.innerHTML = '';
    
    // Add player indicators
    gameState.players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.style.padding = '12px 20px';
        playerDiv.style.borderRadius = '8px';
        playerDiv.style.backgroundColor = index === gameState.currentPlayerIndex ? '#e3f2fd' : 'transparent';
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
        
        const text = document.createElement('span');
        text.style.fontWeight = index === gameState.currentPlayerIndex ? 'bold' : 'normal';
        text.textContent = `Player ${index + 1}`;
        
        playerDiv.appendChild(avatarImg);
        playerDiv.appendChild(text);
        playersContainer.appendChild(playerDiv);
    });
    
    // Draw board and players
    renderer.drawBoard();
    renderer.drawPlayers(gameState.players);
}

function updateStatusMessage(message) {
    statusMessage.textContent = message;
}
