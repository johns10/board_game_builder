class MoneyManager {
    constructor() {
        this.storageKey = 'boardGamePlayerMoney';
        this.playerMoney = this.loadPlayerMoney();
    }

    loadPlayerMoney() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Failed to load player money:', error);
            return {};
        }
    }

    savePlayerMoney() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.playerMoney));
        } catch (error) {
            console.warn('Failed to save player money:', error);
        }
    }

    getPlayerMoney(playerId) {
        return this.playerMoney[playerId] || 0;
    }

    addMoney(playerId, amount) {
        if (amount <= 0) return;
        
        this.playerMoney[playerId] = (this.playerMoney[playerId] || 0) + amount;
        this.savePlayerMoney();
    }

    spendMoney(playerId, amount) {
        if (amount <= 0) return false;
        
        const currentMoney = this.playerMoney[playerId] || 0;
        if (currentMoney < amount) return false;
        
        this.playerMoney[playerId] = currentMoney - amount;
        this.savePlayerMoney();
        return true;
    }

    awardWinBonus(playerId) {
        this.addMoney(playerId, 20);
    }

    resetAllMoney() {
        this.playerMoney = {};
        this.savePlayerMoney();
    }

    getAllPlayerMoney() {
        return { ...this.playerMoney };
    }
}

// Create global instance
const moneyManager = new MoneyManager();