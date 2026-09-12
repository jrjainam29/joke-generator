// ========== API MANAGEMENT ==========
class JokeAPI {
    constructor() {
        this.baseUrl = 'https://v2.jokeapi.dev/joke';
        this.cache = {};
    }

    /**
     * Fetch a joke from the JokeAPI
     * @param {string} category - Joke category (any, general, programming, knock-knock)
     * @returns {Promise<Object>} Joke object
     */
    async getJoke(category = 'any') {
        try {
            const url = `${this.baseUrl}/${category}?format=json`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error('No joke available at this moment');
            }

            // Add unique ID
            data.id = this.generateId(data);

            return data;
        } catch (error) {
            console.error('Error fetching joke:', error);
            throw error;
        }
    }

    /**
     * Fetch multiple jokes
     * @param {string} category - Joke category
     * @param {number} count - Number of jokes to fetch
     * @returns {Promise<Array>} Array of jokes
     */
    async getMultipleJokes(category = 'any', count = 5) {
        try {
            const jokes = [];
            for (let i = 0; i < count; i++) {
                const joke = await this.getJoke(category);
                jokes.push(joke);
                // Avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return jokes;
        } catch (error) {
            console.error('Error fetching multiple jokes:', error);
            throw error;
        }
    }

    /**
     * Generate a unique ID for a joke
     * @param {Object} joke - Joke object
     * @returns {string} Unique ID
     */
    generateId(joke) {
        const text = joke.type === 'single' ? joke.joke : `${joke.setup}${joke.delivery}`;
        return `joke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Format joke for display
     * @param {Object} joke - Raw joke object
     * @returns {Object} Formatted joke object
     */
    formatJoke(joke) {
        return {
            id: joke.id,
            category: joke.category,
            type: joke.type,
            text: joke.type === 'single' ? joke.joke : `${joke.setup}\n\n${joke.delivery}`,
            setup: joke.setup || null,
            delivery: joke.delivery || null,
            joke: joke.joke || null,
            isSafe: joke.safe,
            flags: joke.flags
        };
    }
}

const jokeAPI = new JokeAPI();
