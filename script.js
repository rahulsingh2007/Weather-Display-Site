const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const searchButton = document.getElementById("myButton");
const weatherContainer = document.querySelector(".weather-container");
const card = document.querySelector(".card");
const cardRight = document.getElementById("cardRight");
const cardLeft = document.getElementById("cardLeft");
const detailsContainer = document.querySelector(".details");
const errorDisplay = document.getElementById("errorDisplay");
const apiKey = "51e402a9cc2982d713c0639b1fa73aec";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
        displayError("Please enter a city name!");
        return;
    }

    try {
        if (searchButton) {
            searchButton.disabled = true;
            searchButton.textContent = "⏳ Searching...";
        }
        const weatherData = await getWeatherData(city);
        displayWeatherInfo(weatherData);
    } catch (error) {
        console.error(error);
        displayError(error.message || "Could not fetch weather data.");
    } finally {
        if (searchButton) {
            searchButton.disabled = false;
            searchButton.textContent = "🔍︎ Search";
        }
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("City not found. Please check spelling.");
        } else if (response.status === 401) {
            throw new Error("Invalid API key. Please check credentials.");
        } else {
            throw new Error("Could not fetch weather data. Please try again later.");
        }
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const {
        name: city,
        main: { temp, humidity, pressure, feels_like },
        weather,
        wind: { speed },
        sys: { country, sunrise, sunset } = {},
        visibility,
        timezone
    } = data;

    const weatherInfo = weather && weather.length > 0 ? weather[0] : { description: "N/A", id: 800 };
    const { description, id } = weatherInfo;

    weatherContainer.style.display = "block";
    detailsContainer.style.display = "grid";
    card.classList.remove("error-card");
    card.style.justifyContent = "space-between";
    errorDisplay.style.display = "none";
    cardRight.style.display = "block";
    cardLeft.style.display = "flex";

    const cityDisplay = document.getElementById("cityDisplay");
    cityDisplay.textContent = country ? `${city}, ${country}` : city;

    const tempDisplay = document.getElementById("tempDisplay");
    tempDisplay.textContent = `${Math.round(temp)}°C`;

    const feelsLikeDisplay = document.getElementById("feels_like");
    feelsLikeDisplay.textContent = `Feels like: ${Math.round(feels_like)}°C`;

    const descDisplay = document.getElementById("descDisplay");
    descDisplay.textContent = description;

    const weatherEmoji = document.getElementById("weatherEmoji");
    weatherEmoji.textContent = getWeatherEmoji(id);

    const humidityDisplay = document.getElementById("humidityDisplay");
    humidityDisplay.textContent = `${humidity}%`;

    const windDisplay = document.getElementById("windDisplay");
    windDisplay.textContent = `${(speed * 3.6).toFixed(1)} km/h`;

    const visibilityDisplay = document.getElementById("visibilityDisplay");
    visibilityDisplay.textContent = visibility !== undefined ? `${(visibility / 1000).toFixed(1)} km` : "N/A";

    const pressureDisplay = document.getElementById("pressureDisplay");
    pressureDisplay.textContent = `${pressure} hPa`;

    const sunriseDisplay = document.getElementById("sunriseDisplay");
    sunriseDisplay.textContent = formatSunTime(sunrise, timezone);

    const sunsetDisplay = document.getElementById("sunsetDisplay");
    sunsetDisplay.textContent = formatSunTime(sunset, timezone);
}

function formatSunTime(timestamp, timezoneOffset = 0) {
    if (!timestamp) return "N/A";
    const date = new Date((timestamp + timezoneOffset) * 1000);
    const hours24 = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes} ${ampm}`;
}

function getWeatherEmoji(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return "⛈️";
    if (weatherId >= 300 && weatherId < 500) return "🌦️";
    if (weatherId >= 500 && weatherId < 600) return "🌧️";
    if (weatherId >= 600 && weatherId < 700) return "❄️";
    if (weatherId >= 700 && weatherId < 800) return "🌫️";
    if (weatherId === 800) return "☀️";
    if (weatherId > 800) return "⛅";
    return "❓";
}

function displayError(message) {
    weatherContainer.style.display = "block";
    card.classList.add("error-card");
    card.style.justifyContent = "center";
    cardRight.style.display = "none";
    cardLeft.style.display = "none";
    detailsContainer.style.display = "none";

    errorDisplay.textContent = `⚠️ ${message}`;
    errorDisplay.style.display = "block";
}