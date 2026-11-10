const API_KEY = "pub_88cf27ca64b644d6a7001fc8ca8a3730";
const API_URL = "https://newsdata.io/api/1/latest";
const newsList = document.getElementById("newsList");
const message = document.getElementById("msg");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const buttons = document.querySelectorAll("#categories button");
let currentRequest;

function createNewsUrl(params) {
    const query = new URLSearchParams({
        apikey: API_KEY,
        country: "in",
        language: "en",
        ...params
    });
    return `${API_URL}?${query}`;
}

async function getNews(params) {
    if (currentRequest) {
        currentRequest.abort();
    }

    currentRequest = new AbortController();
    message.textContent = "Loading news...";
    newsList.replaceChildren();

    try {
        const response = await fetch(createNewsUrl(params), {
            signal: currentRequest.signal
        });
        const data = await response.json();

        if (!response.ok || data.status === "error") {
            throw new Error(data.results?.message || data.message || "Unable to load news. Please try again.");
        }

        renderNews(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
        if (error.name === "AbortError") {
            return;
        }
        message.textContent = error.message || "Unable to load news. Please check your connection and try again.";
    }
}

function renderNews(articles) {
    const availableArticles = articles
        .filter(article => article.title && isHttpUrl(article.link))
        .slice(0, 10);

    if (availableArticles.length === 0) {
        message.textContent = "No articles found.";
        return;
    }

    const cards = availableArticles.map(article => {
        const link = document.createElement("a");
        link.className = "news-card";
        link.href = article.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        if (isHttpUrl(article.image_url)) {
            const image = document.createElement("img");
            image.src = article.image_url;
            image.alt = "";
            image.loading = "lazy";
            image.addEventListener("error", () => image.remove(), { once: true });
            link.append(image);
        }

        const title = document.createElement("h2");
        title.textContent = article.title;
        link.append(title);

        if (article.description) {
            const description = document.createElement("p");
            description.textContent = article.description;
            link.append(description);
        }

        return link;
    });

    newsList.replaceChildren(...cards);
    message.textContent = `Showing ${cards.length} article${cards.length === 1 ? "" : "s"}.`;
}

function isHttpUrl(value) {
    if (typeof value !== "string") {
        return false;
    }

    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function setActiveCategory(selectedButton) {
    buttons.forEach(button => {
        const isActive = button === selectedButton;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        setActiveCategory(button);
        searchInput.value = "";
        getNews({ category: button.dataset.category });
    });
});

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
        message.textContent = "Enter a topic to search for.";
        searchInput.focus();
        return;
    }

    buttons.forEach(button => {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
    });
    getNews({ q: query });
});

getNews({ category: "top" });