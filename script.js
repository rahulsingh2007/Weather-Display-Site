const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "51e402a9cc2982d713c0639b1fa73aec";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    }
    else {
        displayError("Please enter a city!");
    }
})

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Could not fetch weather data.")
    }
    return await response.json();
}

function displayWeatherInfo(data) {
    const { name: city,
        main: { temp, humidity, pressure },
        weather: [{ description, id }],
        wind: { speed },
        visibility } = data;

    const cityDisplay = document.getElementById(`cityDisplay`);;
    cityDisplay.textContent = city;

    const tempDisplay = document.getElementById(`tempDisplay`);
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;

    const humidityDisplay = document.getElementById(`humidityDisplay`);
    humidityDisplay.textContent = `${humidity} %`;

    const windDisplay = document.getElementById(`windDisplay`);
    windDisplay.textContent = `${speed} km/h`;

    const visibilityDisplay = document.getElementById(`visibilityDisplay`);
    visibilityDisplay.textContent = `${visibility / 1000} km`;

    const pressureDisplay = document.getElementById(`pressureDisplay`);
    pressureDisplay.textContent = `${pressure} hPa`;

    const sunriseDisplay = document.getElementById('sunriseDisplay');
    const sunriseTimestamp = data.sys.sunrise * 1000;
    const sunriseDate = new Date(sunriseTimestamp);
    const formattedSunrise = sunriseDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    sunriseDisplay.textContent = `${formattedSunrise}`;

    const sunsetDisplay = document.getElementById('sunsetDisplay');
    const sunsetTimestamp = data.sys.sunset * 1000;
    const sunsetDate = new Date(sunsetTimestamp);
    const formattedSunset = sunsetDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    sunsetDisplay.textContent = `${formattedSunset}`;


    const descDisplay = document.getElementById(`descDisplay`);
    descDisplay.textContent = description;

    const weatherEmoji = document.getElementById(`weatherEmoji`);
    weatherEmoji.textContent = getWeatherEmoji(id);

}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
            break;
        case (weatherId >= 300 && weatherId < 500):
            return "🌦️";
            break;
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
            break;
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
            break;
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
            break;
        case (weatherId === 800):
            return "☀️";
            break;
        case (weatherId > 800):
            return "☁️";
            break;
        default:
            return "❓"
            break;
    }
}

function displayError(message) {
    const errorDisplay = document.createElement("p")
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}