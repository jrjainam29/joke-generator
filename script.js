// ========== MAIN APPLICATION ==========
class JokeGeneratorApp {
    constructor() {
        this.currentJoke = null;
        this.jokeCount = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.updateStats();
    }

    setupEventListeners() {
        // Main buttons
        document.getElementById('getJokeBtn').addEventListener('click', () => this.fetchJoke());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyJoke());
        document.getElementById('shareBtn').addEventListener('click', () => this.openShareModal());
        document.getElementById('addFavoriteBtn').addEventListener('click', () => this.toggleFavorite());
        document.getElementById('favoriteBtn').addEventListener('click', () => this.toggleFavorite());

        // View toggle
        document.getElementById('jokeViewBtn').addEventListener('click', () => this.switchView('joke'));
        document.getElementById('favoritesViewBtn').addEventListener('click', () => this.switchView('favorites'));
        document.getElementById('historyViewBtn').addEventListener('click', () => this.switchView('history'));

        // History
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());

        // Share modal
        document.getElementById('closeShareModal').addEventListener('click', () => this.closeShareModal());
        document.querySelector('.share-btn.twitter').addEventListener('click', () => this.shareOn('twitter'));
        document.querySelector('.share-btn.facebook').addEventListener('click', () => this.shareOn('facebook'));
        document.querySelector('.share-btn.whatsapp').addEventListener('click', () => this.shareOn('whatsapp'));
        document.querySelector('.share-btn.copy-link').addEventListener('click', () => this.copyShareLink());

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
    }

    async fetchJoke() {
        const category = document.getElementById('categorySelect').value || 'any';
        const btn = document.getElementById('getJokeBtn');

        btn.disabled = true;
        document.getElementById('loadingSpinner').style.display = 'flex';
        document.getElementById('jokeContainer').style.display = 'none';

        try {
            this.currentJoke = await jokeAPI.getJoke(category);
            this.displayJoke();
            this.jokeCount++;
            storage.addToHistory(this.currentJoke);
            this.updateStats();
            this.showToast('Joke loaded!');
        } catch (error) {
            console.error('Error fetching joke:', error);
            this.showToast('Failed to load joke', 'error');
        } finally {
            btn.disabled = false;
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('jokeContainer').style.display = 'block';
        }
    }

    displayJoke() {
        if (!this.currentJoke) return;

        document.getElementById('jokeCategory').textContent = this.currentJoke.category;
        document.getElementById('jokeType').textContent = this.currentJoke.type === 'single' ? 'Single' : 'Two-Part';
        document.getElementById('jokeCount').textContent = this.jokeCount;

        if (this.currentJoke.type === 'single') {
            document.getElementById('jokeText').textContent = this.currentJoke.joke;
            document.getElementById('jokeSetup').style.display = 'none';
            document.getElementById('jokeDelivery').style.display = 'none';
        } else {
            document.getElementById('jokeSetup').textContent = this.currentJoke.setup;
            document.getElementById('jokeDelivery').textContent = this.currentJoke.delivery;
            document.getElementById('jokeText').style.display = 'none';
            document.getElementById('jokeSetup').style.display = 'block';
            document.getElementById('jokeDelivery').style.display = 'block';
        }

        this.updateFavoriteButton();
    }

    toggleFavorite() {
        if (!this.currentJoke) return;

        const isFavorite = storage.isFavorite(this.currentJoke.id);
        if (isFavorite) {
            storage.removeFavorite(this.currentJoke.id);
            this.showToast('Removed from favorites');
        } else {
            storage.addFavorite(this.currentJoke);
            this.showToast('Added to favorites!');
        }
        this.updateFavoriteButton();
        this.updateStats();
    }

    updateFavoriteButton() {
        if (!this.currentJoke) return;
        const isFavorite = storage.isFavorite(this.currentJoke.id);
        const btn = document.getElementById('addFavoriteBtn');
        if (isFavorite) {
            btn.classList.add('liked');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('liked');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    }

    copyJoke() {
        if (!this.currentJoke) return;
        const text = this.currentJoke.type === 'single'
            ? this.currentJoke.joke
            : `${this.currentJoke.setup}\n${this.currentJoke.delivery}`;
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!');
        });
    }

    openShareModal() {
        document.getElementById('shareModal').classList.add('show');
    }

    closeShareModal() {
        document.getElementById('shareModal').classList.remove('show');
    }

    shareOn(platform) {
        if (!this.currentJoke) return;
        const text = this.currentJoke.type === 'single'
            ? this.currentJoke.joke
            : `${this.currentJoke.setup} ${this.currentJoke.delivery}`;
        const url = window.location.href;

        let shareUrl = '';
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
        this.closeShareModal();
    }

    copyShareLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            this.showToast('Link copied!');
            this.closeShareModal();
        });
    }

    switchView(view) {
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(view + 'ViewBtn').classList.add('active');

        document.getElementById('jokeSection').style.display = 'none';
        document.getElementById('favoritesSection').style.display = 'none';
        document.getElementById('historySection').style.display = 'none';

        if (view === 'joke') {
            document.getElementById('jokeSection').style.display = 'block';
        } else if (view === 'favorites') {
            document.getElementById('favoritesSection').style.display = 'block';
            this.renderFavorites();
        } else if (view === 'history') {
            document.getElementById('historySection').style.display = 'block';
            this.renderHistory();
        }
    }

    renderFavorites() {
        const favorites = storage.getFavorites();
        const list = document.getElementById('favoritesList');
        const empty = document.getElementById('emptyFavorites');

        if (favorites.length === 0) {
            list.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        list.innerHTML = favorites.map(joke => `
            <div class="joke-item">
                <div class="joke-item-text">${this.truncate(this.getJokeText(joke), 100)}</div>
                <div class="joke-item-actions">
                    <button class="joke-item-btn" onclick="app.copyToClipboard('${this.escapeQuotes(this.getJokeText(joke))}')">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="joke-item-btn remove" onclick="app.removeFavorite('${joke.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderHistory() {
        const history = storage.getHistory();
        const list = document.getElementById('historyList');
        const empty = document.getElementById('emptyHistory');

        if (history.length === 0) {
            list.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        list.innerHTML = history.map((joke, idx) => `
            <div class="joke-item">
                <div class="joke-item-text">${this.truncate(this.getJokeText(joke), 100)}</div>
                <div class="joke-item-actions">
                    <button class="joke-item-btn" onclick="app.copyToClipboard('${this.escapeQuotes(this.getJokeText(joke))}')">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    removeFavorite(jokeId) {
        storage.removeFavorite(jokeId);
        this.renderFavorites();
        this.updateStats();
        this.showToast('Removed from favorites');
    }

    clearHistory() {
        if (confirm('Clear all history?')) {
            storage.clearHistory();
            this.renderHistory();
            this.updateStats();
            this.showToast('History cleared');
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied!');
        });
    }

    getJokeText(joke) {
        return joke.type === 'single' ? joke.joke : `${joke.setup} ${joke.delivery}`;
    }

    truncate(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    escapeQuotes(text) {
        return text.replace(/'/g, "\\'");
    }

    updateStats() {
        document.getElementById('favoriteCount').textContent = storage.getFavorites().length;
        document.getElementById('historyCount').textContent = storage.getHistory().length;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        document.getElementById('toastMessage').textContent = message;
        toast.classList.remove('error', 'warning');
        if (type !== 'success') toast.classList.add(type);
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        storage.saveSetting('darkMode', isDark);
        const btn = document.getElementById('themeToggle');
        btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    loadSettings() {
        if (storage.getSetting('darkMode')) {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new JokeGeneratorApp();
    // Auto-fetch first joke
    app.fetchJoke();
});
