// ========== STORAGE MANAGEMENT ==========
class StorageManager {
    constructor() {
        this.favoritesKey = 'jokeGeneratorFavorites';
        this.historyKey = 'jokeGeneratorHistory';
        this.settingsKey = 'jokeGeneratorSettings';
        this.maxHistoryItems = 50;
    }

    // Favorites Management
    addFavorite(joke) {
        let favorites = this.getFavorites();
        const exists = favorites.some(j => j.id === joke.id);
        if (!exists) {
            favorites.unshift(joke);
            localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
            return true;
        }
        return false;
    }

    removeFavorite(jokeId) {
        let favorites = this.getFavorites();
        favorites = favorites.filter(j => j.id !== jokeId);
        localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    }

    getFavorites() {
        try {
            const data = localStorage.getItem(this.favoritesKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading favorites:', e);
            return [];
        }
    }

    isFavorite(jokeId) {
        return this.getFavorites().some(j => j.id === jokeId);
    }

    // History Management
    addToHistory(joke) {
        let history = this.getHistory();
        history.unshift({ ...joke, addedAt: new Date().toISOString() });
        history = history.slice(0, this.maxHistoryItems);
        localStorage.setItem(this.historyKey, JSON.stringify(history));
    }

    getHistory() {
        try {
            const data = localStorage.getItem(this.historyKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading history:', e);
            return [];
        }
    }

    clearHistory() {
        localStorage.removeItem(this.historyKey);
    }

    // Settings Management
    saveSetting(key, value) {
        let settings = this.getSettings();
        settings[key] = value;
        localStorage.setItem(this.settingsKey, JSON.stringify(settings));
    }

    getSetting(key, defaultValue = null) {
        let settings = this.getSettings();
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }

    getSettings() {
        try {
            const data = localStorage.getItem(this.settingsKey);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error loading settings:', e);
            return {};
        }
    }

    clearAll() {
        localStorage.removeItem(this.favoritesKey);
        localStorage.removeItem(this.historyKey);
        localStorage.removeItem(this.settingsKey);
    }

    exportData() {
        return {
            favorites: this.getFavorites(),
            history: this.getHistory(),
            settings: this.getSettings()
        };
    }

    importData(data) {
        if (data.favorites) localStorage.setItem(this.favoritesKey, JSON.stringify(data.favorites));
        if (data.history) localStorage.setItem(this.historyKey, JSON.stringify(data.history));
        if (data.settings) localStorage.setItem(this.settingsKey, JSON.stringify(data.settings));
    }
}

const storage = new StorageManager();
