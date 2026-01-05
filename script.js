const API_KEY = 'b82a1ab692012a1795f9c6556188152f';

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");

const weatherCard = document.getElementById("weatherCard");
const stats = document.getElementById("stats");

const cityName = document.getElementById("cityName");
const description = document.getElementById("description");
const temperature = document.getElementById("temperature");
const range = document.getElementById("range");
const icon = document.getElementById("icon");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const weatherAnimation = document.getElementById("weatherAnimation");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeatherByCity(city);
});

async function fetchWeatherByCity(city) {
  showLoading();
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
    );

    if (!res.ok) {
      throw new Error("City not found");
    }

    const data = await res.json();
    renderWeather(data);
  } catch (err) {
    showError(err.message);
  }
}

function renderWeather(data) {
  hideLoading();
  hideError();

  setWeatherAnimation(data.weather[0].main);
  weatherCard.classList.remove("hidden");
  stats.classList.remove("hidden");

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  description.textContent = data.weather[0].description;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  range.textContent = `Min: ${Math.round(data.main.temp_min)}°C | Max: ${Math.round(data.main.temp_max)}°C`;

  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} m/s`;
  pressure.textContent = `${data.main.pressure} hPa`;
  visibility.textContent = `${data.visibility / 1000} km`;
  


}

function setWeatherAnimation(condition) {
  weatherAnimation.innerHTML = "";

  if (condition === "Clear") {
    weatherAnimation.innerHTML = `<div class="sun"></div>`;
  }

  if (condition === "Clouds") {
    weatherAnimation.innerHTML = `<div class="cloud"></div>`;
  }

  if (condition === "Rain" || condition === "Drizzle") {
    weatherAnimation.innerHTML = `
      <div class="cloud"></div>
      <div class="rain"></div>
      <div class="rain" style="left:45%"></div>
      <div class="rain" style="left:55%"></div>
    `;
  }
}

function showLoading() {
  loading.classList.remove("hidden");
  weatherCard.classList.add("hidden");
  stats.classList.add("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

function hideError() {
  errorDiv.classList.add("hidden");
}

/* BONUS: Auto-location on load */
navigator.geoloca
