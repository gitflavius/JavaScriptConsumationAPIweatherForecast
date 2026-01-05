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

  icon.textContent = getWeatherIcon(data.weather[0].main);
}

function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Mist: "🌫️"
  };
  return icons[condition] || "🌍";
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
