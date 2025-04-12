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

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    statusMessage = document.getElementById('status-message');
    playerCountSelect = document.getElementById('player-count');
    startButton = document.getElementById('start-button');
    rollButton = document.getElementById('roll-button');
    playersContainer = document.getElementById('players-container');
    
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
            color: gameConfig.playerColors[i],
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
    
    // Roll dice
    const roll = Math.floor(Math.random() * 6) + 1;
    gameState.dice = roll;
    
    // Update status
    updateStatusMessage(`Player ${currentPlayer.index + 1} rolled a ${roll}!`);
    
    // Move player
    setTimeout(() => {
        movePlayer(currentPlayer, roll);
    }, 1000);
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
        
        const colorIndicator = document.createElement('span');
        colorIndicator.style.display = 'inline-block';
        colorIndicator.style.width = '24px';
        colorIndicator.style.height = '24px';
        colorIndicator.style.backgroundColor = player.color;
        colorIndicator.style.borderRadius = '50%';
        colorIndicator.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        
        const text = document.createElement('span');
        text.style.fontWeight = index === gameState.currentPlayerIndex ? 'bold' : 'normal';
        text.textContent = `Player ${index + 1}`;
        
        playerDiv.appendChild(colorIndicator);
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
