// DOM Elements
const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

// API Configuration
const API_CONFIG = {
    BASE_URL: "https://api.openweathermap.org/data/2.5/weather",
    API_KEY: "adcbea262d8cc07d77954c272ca1c83d",
    UNITS: "metric"
};

// Weather ID to Emoji Mapping
const WEATHER_EMOJI_MAP = {
    thunderstorm: "⛈️",
    drizzle: "🌧️",
    rain: "🌧️",
    snow: "❄️",
    mist: "🌫️",
    clear: "☀️",
    clouds: "☁️"
};

// Event Listeners
weatherForm.addEventListener("submit", handleFormSubmit);
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleFormSubmit(e);
});

/**
 * Handle form submission
 * @param {Event} event - Form submission event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const city = cityInput.value.trim();
    
    if (!city) {
        displayError("Please enter a city name");
        return;
    }

    try {
        const weatherData = await getWeatherData(city);
        displayWeatherInfo(weatherData);
        cityInput.value = "";
    } catch (error) {
        console.error("Weather fetch error:", error);
        displayError(error.message || "Could not fetch weather data. Please check the city name and try again.");
    }
}

/**
 * Fetch weather data from OpenWeatherMap API
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data
 * @throws {Error} If API request fails
 */
async function getWeatherData(city) {
    const url = new URL(API_CONFIG.BASE_URL);
    url.searchParams.append("q", city);
    url.searchParams.append("appid", API_CONFIG.API_KEY);
    url.searchParams.append("units", API_CONFIG.UNITS);

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("City not found. Please check the spelling and try again.");
        }
        throw new Error("Unable to fetch weather data. Please try again later.");
    }

    return await response.json();
}

/**
 * Display weather information on the card
 * @param {Object} data - Weather data from API
 */
function displayWeatherInfo(data) {
    const { name: city, sys: { country }, main: { temp, feels_like, humidity }, weather: [{ description, main }] } = data;
    
    card.innerHTML = "";
    card.style.display = "flex";

    const cityDisplay = createElement("div", "cityDisplay", `${city}, ${country}`);
    const tempDisplay = createElement("div", "tempDisplay", `${Math.round(temp)}°C`);
    const feelsLikeDisplay = createElement("p", "", `Feels like ${Math.round(feels_like)}°C`);
    const humidityDisplay = createElement("p", "humidityDisplay", `Humidity: ${humidity}%`);
    const descDisplay = createElement("p", "descDisplay", description);
    const weatherEmoji = createElement("p", "weatherEmoji", getWeatherEmoji(main));

    card.appendChild(weatherEmoji);
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(feelsLikeDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
}

/**
 
 * @param {string} tag - HTML tag name
 * @param {string} className - CSS class name
 * @param {string} textContent - Element text content
 * @returns {HTMLElement} Created element
 */
function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = textContent;
    return element;
}

/**
 * Get weather emoji based on weather condition
 * @param {string} weatherMain - Main weather condition
 * @returns {string} Appropriate emoji
 */
function getWeatherEmoji(weatherMain) {
    const main = weatherMain.toLowerCase();
    return WEATHER_EMOJI_MAP[main] || "🌡️";
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function displayError(message) {
    card.innerHTML = "";
    card.style.display = "flex";
    
    const errorDisplay = createElement("p", "errorDisplay", message);
    card.appendChild(errorDisplay);
}
