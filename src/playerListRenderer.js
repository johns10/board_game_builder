class PlayerListRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    
    render(players, currentPlayerIndex) {
        // Clear container
        this.container.innerHTML = '';
        
        // Add player indicators
        players.forEach((player) => {
            const playerDiv = this.createPlayerElement(player, currentPlayerIndex);
            this.container.appendChild(playerDiv);
        });
    }
    
    createPlayerElement(player, currentPlayerIndex) {
        const playerDiv = document.createElement('div');
        this.applyStyles(playerDiv, {
            padding: '12px 20px',
            borderRadius: '8px',
            backgroundColor: player.index === currentPlayerIndex ? '#e3f2fd' : 'transparent',
            border: `2px solid ${player.color}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease'
        });
        
        const avatarImg = this.createAvatarElement(player);
        const playerInfo = this.createPlayerInfoElement(player, currentPlayerIndex);
        
        playerDiv.appendChild(avatarImg);
        playerDiv.appendChild(playerInfo);
        
        return playerDiv;
    }
    
    createAvatarElement(player) {
        const avatarImg = document.createElement('img');
        this.applyStyles(avatarImg, {
            display: 'inline-block',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            objectFit: 'cover'
        });
        
        // Try SVG first, fallback to PNG
        avatarImg.src = player.avatarSvg;
        avatarImg.onerror = () => {
            // Try PNG if SVG fails
            avatarImg.src = player.avatarPng;
            avatarImg.onerror = () => {
                // Fallback to color if both SVG and PNG fail
                avatarImg.style.display = 'none';
                const colorFallback = document.createElement('span');
                this.applyStyles(colorFallback, {
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    backgroundColor: player.color,
                    borderRadius: '50%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                });
                avatarImg.parentNode.insertBefore(colorFallback, avatarImg);
            };
        };
        
        return avatarImg;
    }
    
    createPlayerInfoElement(player, currentPlayerIndex) {
        const playerInfo = document.createElement('div');
        this.applyStyles(playerInfo, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '5px'
        });
        
        const text = document.createElement('span');
        text.className = 'player-name';
        text.style.fontWeight = player.index === currentPlayerIndex ? 'bold' : 'normal';
        text.textContent = `${player.type === 'computer' ? 'Computer' : 'Player'} ${player.index + 1}`;
        
        const hearts = this.createHeartsElement(player.hearts);
        
        playerInfo.appendChild(text);
        playerInfo.appendChild(hearts);
        
        return playerInfo;
    }
    
    createHeartsElement(heartCount) {
        const hearts = document.createElement('div');
        hearts.className = 'hearts';
        
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('span');
            heart.textContent = i < heartCount ? '❤️' : '🖤';
            hearts.appendChild(heart);
        }
        
        return hearts;
    }
    
    applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }
}
