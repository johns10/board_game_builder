// Space Adventure Game Implementation Plan

// 1. CONFIG/DATA LAYER
// gameConfig.js - Contains all static game data

const gameConfig = {
  // Basic game settings
  settings: {
    name: "Space Adventure",
    players: {
      min: 2,
      max: 4,
      default: 2
    },
    diceRange: [1, 6]
  },
  
  // Board layout
  board: {
    // Path definition - array of tile positions in sequence
    path: [
      { x: 1, y: 1, type: "start" }, // Start position
      { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 },
      { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 }, { x: 10, y: 1 },
      { x: 10, y: 2 }, { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 },
      { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 },
      { x: 9, y: 9 }, { x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 },
      { x: 5, y: 9 }, { x: 4, y: 9 }, { x: 3, y: 9 }, { x: 2, y: 9 }, { x: 1, y: 9 },
      { x: 1, y: 8 }, { x: 1, y: 7 }, { x: 1, y: 6 }, { x: 1, y: 5 },
      { x: 1, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 2 },
      // Inner path continues...
      // ... More tiles defined here
      { x: 10, y: 10, type: "finish" } // Finish position
    ],
    
    // Visual elements for rendering the board
    visualElements: [
      { type: "sun", x: 680, y: 680, radius: 50 },
      { type: "planet", x: 140, y: 60, radius: 15, color: "#9C27B0" },
      { type: "planet", x: 700, y: 200, radius: 30, color: "#607D8B" },
      { type: "rocket", x: 650, y: 500, rotation: -45 },
      { type: "alien", x: 230, y: 360 },
      { type: "ufo", x: 450, y: 480 }
    ]
  },
  
  // Tile types and their effects
  tiles: {
    "start": {
      name: "Start",
      color: "#FFEB3B",
      description: "Begin your space adventure!",
      effect: null
    },
    "finish": {
      name: "Finish",
      color: "#FF5722",
      description: "You've completed your space adventure!",
      effect: "win"
    },
    "wormhole": {
      name: "Wormhole",
      color: "#9C27B0",
      description: "Transport through space-time!",
      effect: "teleport",
      params: { min: 5, max: 10 } // Random teleport 5-10 spaces
    },
    "asteroid": {
      name: "Asteroid Field",
      color: "#795548",
      description: "Navigate carefully through the asteroid field!",
      effect: "lose_turn"
    },
    "alien_encounter": {
      name: "Alien Encounter",
      color: "#8BC34A",
      description: "Meet friendly aliens who help you on your journey!",
      effect: "move_forward",
      params: { spaces: 3 }
    },
    "space_station": {
      name: "Space Station",
      color: "#2196F3",
      description: "Refuel at the space station!",
      effect: "extra_turn"
    },
    "black_hole": {
      name: "Black Hole",
      color: "#000000",
      description: "Caught in a black hole! Go back to start.",
      effect: "go_to_start"
    },
    "comet": {
      name: "Comet",
      color: "#03A9F4",
      description: "Ride a comet across the galaxy!",
      effect: "move_forward",
      params: { spaces: 5 }
    },
    "meteor_shower": {
      name: "Meteor Shower",
      color: "#FF5722",
      description: "Take cover from the meteor shower!",
      effect: "move_backward",
      params: { spaces: 2 }
    }
    // Add more tile types as needed
  },
  
  // Mapping specific tiles on the board to tile types
  tileMapping: {
    "3_1": "wormhole", // Tile at x=3, y=1 is a wormhole
    "5_1": "alien_encounter",
    "7_1": "space_station",
    "9_1": "meteor_shower",
    "10_3": "black_hole",
    "10_6": "comet",
    "8_9": "asteroid",
    "3_9": "alien_encounter",
    "1_7": "wormhole",
    "1_4": "meteor_shower",
    // ... more mappings
  }
};

// 2. RENDERING LAYER
// boardRenderer.js - Handles drawing the game board

class BoardRenderer {
  constructor(canvasId, config) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.config = config;
    this.tileSize = 60; // Size of each square tile
    this.boardPadding = 50;
    
    // Initialize canvas size
    this.canvas.width = (12 * this.tileSize) + (this.boardPadding * 2);
    this.canvas.height = (12 * this.tileSize) + (this.boardPadding * 2);
    
    // Load assets
    this.assets = {};
    this.loadAssets();
  }
  
  loadAssets() {
    // Load images for game pieces, dice, etc.
    const assetList = ['rocket', 'alien', 'ufo', 'planet', 'astronaut'];
    assetList.forEach(name => {
      const img = new Image();
      img.src = `assets/${name}.png`;
      this.assets[name] = img;
    });
  }
  
  drawBoard() {
    // Clear canvas
    this.ctx.fillStyle = '#f5f5f5';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw board background
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(
      this.boardPadding, 
      this.boardPadding, 
      this.canvas.width - (this.boardPadding * 2), 
      this.canvas.height - (this.boardPadding * 2)
    );
    this.ctx.strokeRect(
      this.boardPadding, 
      this.boardPadding, 
      this.canvas.width - (this.boardPadding * 2), 
      this.canvas.height - (this.boardPadding * 2)
    );
    
    // Draw path tiles
    this.config.board.path.forEach((tile, index) => {
      this.drawTile(tile, index);
    });
    
    // Draw visual elements
    this.config.board.visualElements.forEach(element => {
      this.drawVisualElement(element);
    });
    
    // Draw title
    this.drawTitle();
  }
  
  drawTile(tile, index) {
    const x = this.boardPadding + ((tile.x - 1) * this.tileSize);
    const y = this.boardPadding + ((tile.y - 1) * this.tileSize);
    
    // Get tile type if mapped
    const tileKey = `${tile.x}_${tile.y}`;
    const tileType = this.config.tileMapping[tileKey] || 
                    (tile.type ? tile.type : "default");
    
    // Get tile color
    const tileConfig = this.config.tiles[tileType] || { color: "#FFFFFF" };
    
    // Draw tile background
    this.ctx.fillStyle = tileConfig.color || "#FFFFFF";
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
    this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
    
    // Draw tile number
    this.ctx.fillStyle = 'black';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(index, x + (this.tileSize / 2), y + (this.tileSize / 2));
    
    // Draw specific elements for special tiles
    if (tileType !== "default") {
      this.drawTileIcon(tileType, x, y);
    }
  }
  
  drawTileIcon(tileType, x, y) {
    // Draw small icons to represent different tile types
    const centerX = x + (this.tileSize / 2);
    const centerY = y + (this.tileSize / 2);
    
    switch(tileType) {
      case "start":
        this.ctx.fillStyle = 'green';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText("START", centerX, centerY + 15);
        break;
      case "finish":
        this.ctx.fillStyle = 'red';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText("FINISH", centerX, centerY + 15);
        break;
      case "wormhole":
        this.ctx.beginPath();
        this.ctx.fillStyle = 'purple';
        this.ctx.arc(centerX, centerY + 10, 8, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      // Add more icon drawing logic for other tile types
    }
  }
  
  drawVisualElement(element) {
    // Draw decorative elements on the board
    switch(element.type) {
      case "sun":
        this.drawSun(element.x, element.y, element.radius);
        break;
      case "planet":
        this.drawPlanet(element.x, element.y, element.radius, element.color);
        break;
      case "rocket":
        this.drawRocket(element.x, element.y, element.rotation);
        break;
      // Add more drawing logic for other elements
    }
  }
  
  drawSun(x, y, radius) {
    // Sun with rays
    this.ctx.fillStyle = '#FFEB3B';
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#FF9800';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Draw rays
    this.ctx.strokeStyle = '#FF9800';
    this.ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      this.ctx.beginPath();
      this.ctx.moveTo(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius
      );
      this.ctx.lineTo(
        x + Math.cos(angle) * (radius + 10),
        y + Math.sin(angle) * (radius + 10)
      );
      this.ctx.stroke();
    }
  }
  
  drawPlanet(x, y, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }
  
  drawRocket(x, y, rotation) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw rocket
    this.ctx.fillStyle = '#F44336';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -20);
    this.ctx.lineTo(10, 10);
    this.ctx.lineTo(-10, 10);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.fillStyle = '#9E9E9E';
    this.ctx.fillRect(-8, 10, 16, 20);
    
    this.ctx.fillStyle = '#2196F3';
    this.ctx.beginPath();
    this.ctx.arc(-4, 16, 2, 0, Math.PI * 2);
    this.ctx.arc(4, 16, 2, 0, Math.PI * 2);
    this.ctx.arc(0, 22, 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  drawTitle() {
    this.ctx.save();
    this.ctx.translate(
      this.canvas.width / 2, 
      this.canvas.height / 2
    );
    this.ctx.rotate((-10 * Math.PI) / 180);
    
    // Title background
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(-120, -40, 240, 80);
    this.ctx.strokeRect(-120, -40, 240, 80);
    
    // Title text
    this.ctx.fillStyle = 'black';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText("SPACE", 0, -10);
    this.ctx.fillText("ADVENTURE", 0, 20);
    
    this.ctx.restore();
  }
  
  drawPlayers(players) {
    players.forEach(player => {
      const tile = this.config.board.path[player.position];
      const x = this.boardPadding + ((tile.x - 1) * this.tileSize) + (this.tileSize / 2);
      const y = this.boardPadding + ((tile.y - 1) * this.tileSize) + (this.tileSize / 2);
      
      // Draw player token
      this.ctx.fillStyle = player.color;
      this.ctx.beginPath();
      this.ctx.arc(
        x + (player.index * 8) - 12, 
        y - 10, 
        10, 
        0, 
        Math.PI * 2
      );
      this.ctx.fill();
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Draw player number/icon
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(player.index + 1, x + (player.index * 8) - 12, y - 10);
    });
  }
  
  // Animation methods
  animatePlayerMove(player, fromPosition, toPosition, callback) {
    // Implementation for animating player movement between tiles
    // This would use requestAnimationFrame to create smooth movement
  }
  
  // Additional visual effects
  showDiceRoll(value) {
    // Visualize dice roll 
  }
  
  showTileEffect(tileType, player) {
    // Show animation for tile effects
  }
}

// 3. GAME LOGIC
// gameEngine.js - Core game mechanics

class SpaceAdventureGame {
  constructor(config, renderer) {
    this.config = config;
    this.renderer = renderer;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.gameState = 'setup'; // setup, playing, gameover
  }
  
  initGame(playerCount) {
    // Create players
    this.players = [];
    const playerColors = ['#FF5252', '#448AFF', '#66BB6A', '#FFC107'];
    
    for (let i = 0; i < playerCount; i++) {
      this.players.push({
        index: i,
        name: `Player ${i+1}`,
        color: playerColors[i],
        position: 0, // Start position
        isActive: true,
        skipTurn: false
      });
    }
    
    this.currentPlayerIndex = 0;
    this.gameState = 'playing';
    this.renderer.drawBoard();
    this.renderer.drawPlayers(this.players);
  }
  
  rollDice() {
    if (this.gameState !== 'playing') return;
    
    const player = this.players[this.currentPlayerIndex];
    if (player.skipTurn) {
      player.skipTurn = false;
      this.nextPlayer();
      return;
    }
    
    // Roll dice
    const min = this.config.settings.diceRange[0];
    const max = this.config.settings.diceRange[1];
    const roll = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Show dice roll animation
    this.renderer.showDiceRoll(roll);
    
    // Move player
    this.movePlayer(player, roll);
  }
  
  movePlayer(player, spaces) {
    const pathLength = this.config.board.path.length;
    const newPosition = Math.min(player.position + spaces, pathLength - 1);
    
    // Animate player movement
    this.renderer.animatePlayerMove(
      player, 
      player.position, 
      newPosition, 
      () => {
        player.position = newPosition;
        this.applyTileEffect(player);
      }
    );
  }
  
  applyTileEffect(player) {
    const tile = this.config.board.path[player.position];
    const tileKey = `${tile.x}_${tile.y}`;
    const tileType = this.config.tileMapping[tileKey] || 
                    (tile.type ? tile.type : "default");
    
    // Skip if default tile
    if (tileType === "default") {
      this.nextPlayer();
      return;
    }
    
    const tileConfig = this.config.tiles[tileType];
    
    // Render effect animation
    this.renderer.showTileEffect(tileType, player);
    
    // Apply tile effect
    switch(tileConfig.effect) {
      case "win":
        this.gameState = 'gameover';
        this.announceWinner(player);
        break;
        
      case "teleport":
        const min = tileConfig.params.min;
        const max = tileConfig.params.max;
        const teleportSpaces = Math.floor(Math.random() * (max - min + 1)) + min;
        this.movePlayer(player, teleportSpaces);
        break;
        
      case "lose_turn":
        player.skipTurn = true;
        this.nextPlayer();
        break;
        
      case "move_forward":
        this.movePlayer(player, tileConfig.params.spaces);
        break;
        
      case "move_backward":
        const backSpaces = -tileConfig.params.spaces;
        const newPosition = Math.max(0, player.position + backSpaces);
        this.renderer.animatePlayerMove(
          player, 
          player.position, 
          newPosition, 
          () => {
            player.position = newPosition;
            this.nextPlayer();
          }
        );
        break;
        
      case "go_to_start":
        this.renderer.animatePlayerMove(
          player, 
          player.position, 
          0, 
          () => {
            player.position = 0;
            this.nextPlayer();
          }
        );
        break;
        
      case "extra_turn":
        // Player gets another turn, don't change currentPlayerIndex
        break;
        
      default:
        this.nextPlayer();
    }
  }
  
  nextPlayer() {
    if (this.gameState !== 'playing') return;
    
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    // Update UI to indicate current player
  }
  
  announceWinner(player) {
    // Display winning message
    console.log(`${player.name} has won the game!`);
    // Trigger winning animation/display
  }
}

// 4. UI LAYER
// main.js - Connects everything and handles user input

document.addEventListener('DOMContentLoaded', () => {
  // Initialize renderer
  const renderer = new BoardRenderer('gameCanvas', gameConfig);
  
  // Initialize game
  const game = new SpaceAdventureGame(gameConfig, renderer);
  
  // Set up event listeners
  document.getElementById('startGame').addEventListener('click', () => {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    game.initGame(playerCount);
  });
  
  document.getElementById('rollDice').addEventListener('click', () => {
    game.rollDice();
  });
  
  // Initial draw
  renderer.drawBoard();
});

// 5. HTML STRUCTURE
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Space Adventure Board Game</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background-color: #f0f0f0;
    }
    
    #gameContainer {
      display: flex;
      gap: 20px;
    }
    
    #gameBoard {
      border: 1px solid #ccc;
      background-color: white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    #gameControls {
      width: 250px;
      padding: 15px;
      background-color: white;
      border: 1px solid #ccc;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 15px;
      margin: 5px 0;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      width: 100%;
    }
    
    button:hover {
      background-color: #3e8e41;
    }
    
    select {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    #gameInfo {
      margin-top: 10px;
      border-top: 1px solid #eee;
      padding-top: 10px;
    }
    
    .player-info {
      display: flex;
      align-items: center;
      margin: 5px 0;
    }
    
    .player-color {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin-right: 10px;
    }
  </style>
</head>
<body>
  <h1>Space Adventure</h1>
  
  <div id="gameContainer">
    <div id="gameBoard">
      <canvas id="gameCanvas" width="800" height="800"></canvas>
    </div>
    
    <div id="gameControls">
      <h2>Game Controls</h2>
      
      <div id="setupControls">
        <label for="playerCount">Number of Players:</label>
        <select id="playerCount">
          <option value="2">2 Players</option>
          <option value="3">3 Players</option>
          <option value="4">4 Players</option>
        </select>
        
        <button id="startGame">Start Game</button>
      </div>
      
      <div id="playControls" style="display: none;">
        <div id="currentPlayer"></div>
        <button id="rollDice">Roll Dice</button>
      </div>
      
      <div id="gameInfo">
        <h3>Players</h3>
        <div id="playersList"></div>
      </div>
    </div>
  </div>

  <script src="gameConfig.js"></script>
  <script src="boardRenderer.js"></script>
  <script src="gameEngine.js"></script>
  <script src="main.js"></script>
</body>
</html>
*/