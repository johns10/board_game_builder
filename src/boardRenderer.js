class BoardRenderer {
    constructor(canvasId, config) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.config = config;
        
        // Initialize canvas size
        this.canvas.width = this.config.boardSize;
        this.canvas.height = this.config.boardSize;
    }
    
    drawBoard() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board background
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw decorative elements
        this.drawDecorativeElements();
        
        // Draw path tiles
        this.drawPath();
        
        // Draw title
        this.drawTitle();
    }
    
    drawPath() {
        this.config.path.forEach((pos, index) => {
            const [x, y] = pos;
            const xPos = this.config.padding + (x - 1) * this.config.tileSize;
            const yPos = this.config.padding + (y - 1) * this.config.tileSize;
            
            // Determine tile color based on type
            let tileColor = '#ffffff';
            let textColor = '#000000';
            
            // Special tile colors
            if (index === 0) {
                tileColor = '#4CAF50'; // Start
                textColor = '#ffffff';
            } else if (index === this.config.path.length - 1) {
                tileColor = '#FF5722'; // Finish
                textColor = '#ffffff';
            } else if (this.config.moneyTiles && this.config.moneyTiles[index]) {
                tileColor = '#FFD700'; // Gold for money tiles
                textColor = '#000000';
            } else if (this.config.specialTiles[index]) {
                const specialTile = this.config.specialTiles[index];
                switch (specialTile.type) {
                    case 'wormhole': tileColor = '#9C27B0'; textColor = '#ffffff'; break;
                    case 'asteroid': tileColor = '#795548'; textColor = '#ffffff'; break;
                    case 'alien': tileColor = '#8BC34A'; break;
                    case 'black_hole': tileColor = '#263238'; textColor = '#ffffff'; break;
                    case 'meteor': tileColor = '#FF9800'; break;
                    case 'space_station': tileColor = '#2196F3'; textColor = '#ffffff'; break;
                    case 'comet': tileColor = '#03A9F4'; textColor = '#ffffff'; break;
                    case 'ufo': tileColor = '#673AB7'; textColor = '#ffffff'; break;
                }
            }
            
            // Draw tile background
            this.ctx.fillStyle = tileColor;
            this.ctx.fillRect(xPos, yPos, this.config.tileSize, this.config.tileSize);
            
            // Draw tile border
            this.ctx.strokeStyle = '#333333';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(xPos, yPos, this.config.tileSize, this.config.tileSize);
            
            // Draw tile number in top-left corner
            this.ctx.fillStyle = textColor;
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(index, xPos + 2, yPos + 2);
            
            // Draw money amount on money tiles
            if (this.config.moneyTiles && this.config.moneyTiles[index]) {
                this.drawMoneyIcon(
                    this.config.moneyTiles[index],
                    xPos + this.config.tileSize / 2,
                    yPos + this.config.tileSize / 2 + 5
                );
            }
            
            // Draw special tile icons
            if (this.config.specialTiles[index]) {
                this.drawTileIcon(
                    this.config.specialTiles[index].type,
                    xPos + this.config.tileSize / 2,
                    yPos + this.config.tileSize / 2 + 10
                );
            }
        });
    }
    
    drawMoneyIcon(amount, x, y) {
        // Draw coin
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 5, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Coin border
        this.ctx.strokeStyle = '#FFA000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Dollar sign
        this.ctx.fillStyle = '#FFA000';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('$', x, y - 5);
        
        // Amount text
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.fillText(amount, x, y + 8);
    }

    drawTileIcon(type, x, y) {
        this.ctx.fillStyle = '#ffffff';
        
        switch (type) {
            case 'wormhole':
                // Draw wormhole spiral
                this.ctx.beginPath();
                this.ctx.arc(x, y, 8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 12, 0, Math.PI * 1.5);
                this.ctx.stroke();
                break;
                
            case 'asteroid':
                // Draw asteroid
                this.ctx.beginPath();
                this.ctx.moveTo(x - 8, y - 5);
                this.ctx.lineTo(x - 2, y - 8);
                this.ctx.lineTo(x + 4, y - 3);
                this.ctx.lineTo(x + 8, y + 2);
                this.ctx.lineTo(x + 3, y + 8);
                this.ctx.lineTo(x - 5, y + 5);
                this.ctx.closePath();
                this.ctx.fill();
                break;
                
            case 'alien':
                // Draw alien
                this.ctx.beginPath();
                this.ctx.arc(x, y - 3, 7, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = '#000000';
                this.ctx.beginPath();
                this.ctx.arc(x - 3, y - 5, 2, 0, Math.PI * 2);
                this.ctx.arc(x + 3, y - 5, 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
                
            case 'black_hole':
                // Draw black hole
                this.ctx.beginPath();
                this.ctx.arc(x, y, 10, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#9E9E9E';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 14, 0, Math.PI * 1.5);
                this.ctx.stroke();
                break;
                
            case 'meteor':
                // Draw meteor
                this.ctx.beginPath();
                this.ctx.moveTo(x - 5, y - 7);
                this.ctx.lineTo(x + 7, y + 5);
                this.ctx.lineTo(x, y + 7);
                this.ctx.lineTo(x - 7, y);
                this.ctx.closePath();
                this.ctx.fill();
                break;
                
            case 'space_station':
                // Draw space station
                this.ctx.fillRect(x - 8, y - 3, 16, 6);
                this.ctx.fillRect(x - 3, y - 8, 6, 16);
                break;
                
            case 'comet':
                // Draw comet
                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(x - 5, y - 5);
                this.ctx.lineTo(x - 10, y - 10);
                this.ctx.stroke();
                break;
                
            case 'ufo':
                // Draw UFO
                this.ctx.beginPath();
                this.ctx.ellipse(x, y, 10, 4, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(x, y - 3, 5, Math.PI, 0);
                this.ctx.fill();
                break;
        }
    }
    
    drawDecorativeElements() {
        // Draw visual elements from config
        this.config.visualElements.forEach(element => {
            switch (element.type) {
                case 'sun':
                    this.drawSun(element.x, element.y, element.radius);
                    break;
                case 'planet':
                    this.drawPlanet(element.x, element.y, element.radius, element.color);
                    break;
            }
        });
        
        // Draw stars
        this.drawStars();
    }
    
    drawSun(x, y, radius) {
        // Sun glow
        const gradient = this.ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 1.5);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Sun body
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Sun rays
        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            this.ctx.beginPath();
            this.ctx.moveTo(
                x + Math.cos(angle) * radius,
                y + Math.sin(angle) * radius
            );
            this.ctx.lineTo(
                x + Math.cos(angle) * (radius * 1.5),
                y + Math.sin(angle) * (radius * 1.5)
            );
            this.ctx.stroke();
        }
    }
    
    drawPlanet(x, y, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.beginPath();
        this.ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawStars() {
        this.ctx.fillStyle = 'white';
        const starCount = 50;
        
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2 + 1;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawTitle() {
    }
    
    drawPlayers(players) {
        players.forEach(player => {
            const [x, y] = this.config.path[player.position];
            const xPos = this.config.padding + (x - 1) * this.config.tileSize + (this.config.tileSize / 2);
            const yPos = this.config.padding + (y - 1) * this.config.tileSize + (this.config.tileSize / 2);
            
            // Draw player token with offset based on player index
            const offset = player.index * 10;
            const tokenX = xPos - 15 + offset;
            const tokenY = yPos - 15;
            
            // Create temporary image for avatar
            const avatar = new Image();
            
            // Draw fallback circle
            const drawColorCircle = () => {
                this.ctx.fillStyle = player.color;
                this.ctx.beginPath();
                this.ctx.arc(tokenX, tokenY, 12, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Token border
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                // Player number
                this.ctx.fillStyle = 'white';
                this.ctx.font = 'bold 14px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(player.index + 1, tokenX, tokenY);
            };
            
            // Try SVG first
            avatar.src = player.avatarSvg;
            
            const tryPng = () => {
                const pngAvatar = new Image();
                pngAvatar.src = player.avatarPng;
                
                pngAvatar.onload = () => {
                    // Draw PNG avatar
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.arc(tokenX, tokenY, 12, 0, Math.PI * 2);
                    this.ctx.clip();
                    this.ctx.drawImage(pngAvatar, tokenX - 12, tokenY - 12, 24, 24);
                    this.ctx.restore();
                    
                    // Draw border
                    this.ctx.strokeStyle = 'white';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.arc(tokenX, tokenY, 12, 0, Math.PI * 2);
                    this.ctx.stroke();
                };
                
                pngAvatar.onerror = drawColorCircle;
            };
            
            avatar.onload = () => {
                // Draw SVG avatar
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(tokenX, tokenY, 12, 0, Math.PI * 2);
                this.ctx.clip();
                this.ctx.drawImage(avatar, tokenX - 12, tokenY - 12, 24, 24);
                this.ctx.restore();
                
                // Draw border
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(tokenX, tokenY, 12, 0, Math.PI * 2);
                this.ctx.stroke();
            };
            
            avatar.onerror = tryPng;
            
            // Draw fallback while loading
            drawColorCircle();
        });
    }
}
