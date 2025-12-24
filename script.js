const apiKey = "8c9f910a04460f8c4c161ef485f13220";
const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weather = document.querySelector(".weather");
const error = document.querySelector(".error");
const loading = document.querySelector(".loading");

async function checkWeather(city) {
    if (!city.trim()) return;

    loading.style.display = "block";
    error.style.display = "none";
    weather.style.display = "none";

    try {
        const response = await fetch(
            apiUrl + city + `&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();

        document.querySelector(".city").innerText = data.name;
        document.querySelector(".temp").innerText =
            Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerText =
            data.main.humidity + "%";
        document.querySelector(".wind").innerText =
            data.wind.speed + " km/h";

        const condition = data.weather[0].main.toLowerCase();
        weatherIcon.src = `images/${condition}.png`;

        weather.style.display = "block";
    } catch (err) {
        error.style.display = "block";
    } finally {
        loading.style.display = "none";
    }
}

/* Button click */
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

/* Enter key */
searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});
