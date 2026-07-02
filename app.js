let lang = "zh";
let state = null;

const EARTH_TO_SKY = {
  Taipei: "Kavi",
  Tokyo: "Haro",
  Seoul: "Vakka",
  Paris: "Lura",
  Berlin: "Kragor",
  Bangkok: "Moana"
};

const SKY_TRANSLATION = {
  Kavi: {
    zh: "卡維",
    en: "Kavi",
    ja: "カヴィ"
  },
  Haro: {
    zh: "哈洛",
    en: "Haro",
    ja: "ハロ"
  },
  Vakka: {
    zh: "瓦卡",
    en: "Vakka",
    ja: "ヴァッカ"
  },
  Lura: {
    zh: "露拉",
    en: "Lura",
    ja: "ルラ"
  },
  Kragor: {
    zh: "克拉戈",
    en: "Kragor",
    ja: "クラゴル"
  },
  Moana: {
    zh: "莫阿納",
    en: "Moana",
    ja: "モアナ"
  }
};

function setStatus(message) {
  const el = document.getElementById("status");
  if (!el) return;
  el.textContent = message || "";
}

async function fetchIP() {
  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) {
    throw new Error("IP request failed");
  }
  return res.json();
}

async function fetchWeather(latitude, longitude) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + latitude +
    "&longitude=" + longitude +
    "&current_weather=true";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Weather request failed");
  }
  return res.json();
}

async function init() {
  try {
    setStatus("loading");

    const ip = await fetchIP();

    const weather = await fetchWeather(
      ip.latitude,
      ip.longitude
    );

    const skyCity = EARTH_TO_SKY[ip.city] || "Kavi";

    state = {
      earthCity: ip.city,
      skyCity: skyCity,
      temperature: weather.current_weather.temperature
    };

    setStatus("ready");
    render();

  } catch (error) {
    console.error(error);

    setStatus("offline mode");

    state = {
      earthCity: "Unknown",
      skyCity: "Kavi",
      temperature: 0
    };

    render();
  }
}

function render() {
  if (!state) return;

  const cityData = SKY_TRANSLATION[state.skyCity];

  const cityName =
    (cityData && cityData[lang]) || state.skyCity;

  const temperature = Math.round(state.temperature);

  const cityEl = document.getElementById("city");
  const tempEl = document.getElementById("temp");
  const descEl = document.getElementById("desc");

  if (cityEl) {
    cityEl.textContent = cityName;
  }

  if (tempEl) {
    tempEl.textContent = temperature + "°";
  }

  if (descEl) {
    descEl.textContent = "Current Weather";
  }
}

function setupLanguage() {
  const selector = document.getElementById("lang");

  if (!selector) return;

  selector.addEventListener("change", function (event) {
    lang = event.target.value;
    render();
  });
}

(function bootstrap() {
  setupLanguage();
  init();
})();
