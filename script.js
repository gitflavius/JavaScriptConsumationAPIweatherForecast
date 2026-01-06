const API_KEY = "b82a1ab692012a1795f9c6556188152f";
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');

const weatherCard = document.getElementById('weatherCard');
const stats = document.getElementById('stats');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

const weatherAnimation = document.getElementById('weatherAnimation');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city) | fetchForecast(city);
});

async function fetchWeather(city) {
  loading.classList.remove('hidden');
  error.classList.add('hidden');

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
    );

    if (!res.ok) throw new Error('Cidade não encontrada');

    const data = await res.json();
    renderWeather(data);

  } catch (err) {
    error.textContent = err.message;
    error.classList.remove('hidden');
  } finally {
    loading.classList.add('hidden');
  }
}

async function fetchForecast(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&lang=pt_br&appid=${API_KEY}`
  );

  const data = await res.json();
  renderForecast(data.daily.slice(1, 6));
}

function renderForecast(days) {
  const grid = document.getElementById('forecastGrid');
  const section = document.getElementById('forecast');

  grid.innerHTML = '';

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  days.forEach(day => {
    const date = new Date(day.dt * 1000);
    const name = weekDays[date.getDay()];

    const card = document.createElement('div');
    card.className = 'forecast-card';

    card.innerHTML = `
      <div class="day">${name}</div>
      ${getMiniIcon(day.weather[0].main)}
      <div class="temp">${Math.round(day.temp.min)}° / ${Math.round(day.temp.max)}°</div>
    `;

    grid.appendChild(card);
  });

  section.classList.remove('hidden');
}


function getMiniIcon(condition) {
  if (condition === 'Clear') {
    return `<div class="sun" style="width:32px;height:32px;margin:auto;"></div>`;
  }

  if (condition === 'Clouds') {
    return `<div class="cloud" style="width:50px;height:28px;margin:auto;"></div>`;
  }

  if (condition === 'Rain') {
    return `<div class="cloud" style="width:50px;height:28px;margin:auto;"></div>`;
  }

  return '';
}


function renderWeather(data) {
  document.getElementById('cityName').textContent =
    `${data.name}, ${data.sys.country}`;

  document.getElementById('description').textContent =
    data.weather[0].description;

  document.getElementById('temperature').textContent =
    `${Math.round(data.main.temp)}°C`;

  document.getElementById('range').textContent =
    `Min: ${Math.round(data.main.temp_min)}° | Max: ${Math.round(data.main.temp_max)}°`;

  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('wind').textContent = `${data.wind.speed} m/s`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
  document.getElementById('visibility').textContent =
    `${(data.visibility / 1000).toFixed(1)} km`;

  setWeatherVisual(data.weather[0].main);
  
  fetchForecast(data.coord.lat, data.coord.lon);


  weatherCard.classList.remove('hidden');
  stats.classList.remove('hidden');
}

function setWeatherVisual(condition) {
  document.body.className = '';
  weatherAnimation.innerHTML = '';

  if (condition === 'Clear') {
    document.body.classList.add('sunny');
    weatherAnimation.innerHTML = `<div class="sun"></div>`;
  }

  else if (condition === 'Clouds') {
    document.body.classList.add('cloudy');
    weatherAnimation.innerHTML = `<div class="cloud"></div>`;
  }

  else if (condition === 'Rain' || condition === 'Drizzle') {
    document.body.classList.add('rainy');
    weatherAnimation.innerHTML = `
      <div class="cloud"></div>
      <div class="rain">
        ${Array.from({ length: 8 }).map(() => `<div class="drop"></div>`).join('')}
      </div>
    `;
  }



}