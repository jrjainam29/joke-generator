# 🎭 Joke Generator

A modern, interactive joke generator application that fetches jokes from the [JokeAPI](https://jokeapi.dev/) with multiple features for entertainment and sharing.

## ✨ Features

- **Random Joke Fetching** - Get random jokes from JokeAPI
- **Multiple Categories** - Choose from General, Programming, or Knock-Knock jokes
- **Favorites System** - Save your favorite jokes locally
- **History Tracking** - Keep track of all jokes you've viewed
- **Copy to Clipboard** - Easily copy jokes to share
- **Social Sharing** - Share jokes on Twitter, Facebook, WhatsApp
- **Dark Mode** - Switch between light and dark themes
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Local Storage** - All data persists in your browser
- **Toast Notifications** - Get feedback on your actions

## 🚀 Getting Started

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/jrjainam29/joke-generator.git
   cd joke-generator
   ```

2. Open `index.html` in your web browser
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server
   ```

3. Visit `http://localhost:8000` in your browser

### No Build Required!
This is a vanilla JavaScript application with no dependencies. Just open `index.html` and start using!

## 📖 How to Use

1. **Get a Joke** - Click the "Get Joke" button to fetch a random joke
2. **Choose Category** - Select a category from the dropdown (General, Programming, Knock-Knock)
3. **Add to Favorites** - Click the heart icon to save jokes you love
4. **Copy Joke** - Click the copy button to copy the joke text
5. **Share** - Click share to post on social media
6. **View History** - Check out all jokes you've viewed
7. **Dark Mode** - Toggle dark mode in the top-right corner

## 📂 Project Structure

```
joke-generator/
├── index.html       # Main HTML structure
├── style.css        # Styling with dark mode support
├── storage.js       # Local storage management
├── api.js          # JokeAPI integration
├── script.js       # Main application logic
└── README.md       # This file
```

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **JokeAPI** - External API for joke data
- **Local Storage API** - For persistent data

### Key Classes

#### StorageManager
Manages all local storage operations
- `addFavorite()` - Add joke to favorites
- `removeFavorite()` - Remove from favorites
- `getHistory()` - Get all viewed jokes
- `clearHistory()` - Clear history

#### JokeAPI
Handles all API calls to JokeAPI
- `getJoke(category)` - Fetch a single joke
- `getMultipleJokes(category, count)` - Fetch multiple jokes
- `formatJoke()` - Format joke for display

#### JokeGeneratorApp
Main application controller
- `fetchJoke()` - Get new joke from API
- `toggleFavorite()` - Manage favorites
- `switchView()` - Switch between views
- `shareOn()` - Share on social media

## 📊 Data Structure

Joke Object:
```javascript
{
    id: "joke_timestamp_random",
    category: "general",
    type: "single" | "twopart",
    joke: "full joke text",           // if type is single
    setup: "setup text",              // if type is twopart
    delivery: "punchline",            // if type is twopart
    isSafe: true,
    flags: { /* content warnings */ }
}
```

## 🎨 Customization

### Change Theme Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    --success-color: #10b981;
    /* etc */
}
```

### Change API Categories
Edit the category select in `index.html` or modify the API call in `script.js`

## 🔐 Privacy

- All data is stored locally in your browser
- No data is sent to external servers (except JokeAPI for joke fetching)
- No tracking or analytics
- No ads

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 API Reference

This app uses the free [JokeAPI](https://jokeapi.dev/) by Sv443.

### Rate Limiting
- 100 requests per hour
- No API key required

## 🚀 Future Enhancements

- [ ] Random joke auto-refresh timer
- [ ] Search/filter jokes
- [ ] Multiple language support
- [ ] Offline mode
- [ ] Browser notifications
- [ ] Export favorites as JSON/CSV
- [ ] Joke categories as tags
- [ ] User ratings on jokes
- [ ] PWA support
- [ ] Backend sync (optional)

## 📄 License

MIT License - Feel free to use this project for any purpose

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📞 Support

If you have questions or issues:
1. Check the [JokeAPI documentation](https://jokeapi.dev/)
2. Review the code comments
3. Open an issue on GitHub

## 🎉 Enjoy!

Hope you enjoy some great laughs with this joke generator!

---

Made with ❤️ using vanilla JavaScript
