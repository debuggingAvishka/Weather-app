const apiKey = "8c9f910a04460f8c4c161ef485f13220";

const weatherURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const airURL = "https://api.openweathermap.org/data/2.5/air_pollution?";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

const weatherDiv = document.querySelector(".weather");
const loading = document.querySelector(".loading");
const error = document.querySelector(".error");

async function checkWeather(city) {
    if (!city.trim()) return;

    loading.style.display = "block";
    weatherDiv.style.display = "none";
    error.style.display = "none";

    try {
        const res = await fetch(weatherURL + city + `&appid=${apiKey}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        updateWeather(data);
        await getAirQuality(data.coord.lat, data.coord.lon);
        getAlerts(data);

        weatherDiv.style.display = "block";
    } catch {
        error.style.display = "block";
    } finally {
        loading.style.display = "none";
    }
}

function updateWeather(data) {
    document.querySelector(".city").innerText = data.name;
    document.querySelector(".temp").innerText = Math.round(data.main.temp) + "°C";
    document.querySelector(".description").innerText = data.weather[0].description;

    document.querySelector(".feels").innerText = Math.round(data.main.feels_like) + "°C";
    document.querySelector(".pressure").innerText = data.main.pressure + " hPa";
    document.querySelector(".visibility").innerText = (data.visibility / 1000) + " km";

    document.querySelector(".sunrise").innerText =
        new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    document.querySelector(".sunset").innerText =
        new Date(data.sys.sunset * 1000).toLocaleTimeString();

    document.querySelector(".weather-icon").src =
        `images/${data.weather[0].main.toLowerCase()}.png`;
}

async function getAirQuality(lat, lon) {
    const res = await fetch(`${airURL}lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await res.json();

    const aqiValue = data.list[0].main.aqi;
    const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

    document.querySelector(".aqi").innerText =
        `${levels[aqiValue - 1]} (AQI ${aqiValue})`;
}

function getAlerts(data) {
    const alertBox = document.querySelector(".alerts");

    if (data.alerts && data.alerts.length > 0) {
        alertBox.innerText = data.alerts[0].event;
    } else {
        alertBox.innerText = "No active weather alerts";
    }
}

/* Events */
searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keypress", e => {
    if (e.key === "Enter") checkWeather(searchBox.value);
});
