# Daily Hunt

Daily Hunt is a small, responsive news page that lets you browse current headlines by category or search for a topic. It uses the NewsData.io API to retrieve articles.

## Features

- Browse top, technology, sports, and business news.
- Search news by keyword.
- View article titles, descriptions, and available images.
- Open the original article in a new tab.
- Responsive layout for desktop and mobile screens.

## Run the project

1. Download or clone the project.
2. Open `index.html` in a web browser.
3. Select a category or enter a search term.

The page fetches news from NewsData.io, so an internet connection and a valid API key are required. Create a local `config.js` file containing:

```js
window.NEWS_API_KEY = "your-newsdata-api-key";
```

The local config file is ignored by Git. `config.example.js` is provided as a template. Never commit a private API key to a public repository; for production, make API requests through a server that keeps the key private.

## Project files

- `index.html` — page structure and controls.
- `style.css` — responsive page styling.
- `script.js` — API requests, search, category selection, and article rendering.
