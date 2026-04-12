export interface GeoResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  humidity: number;
  apparent_temperature: number;
  is_day: number;
  uv_index: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weathercode: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weathercode: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  location: GeoResult;
}

export type WeatherTheme = "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "foggy" | "night";

const WMO_CODES: Record<number, { label: string; icon: string; theme: WeatherTheme }> = {
  0: { label: "Clear sky", icon: "☀️", theme: "sunny" },
  1: { label: "Mainly clear", icon: "🌤️", theme: "sunny" },
  2: { label: "Partly cloudy", icon: "⛅", theme: "cloudy" },
  3: { label: "Overcast", icon: "☁️", theme: "cloudy" },
  45: { label: "Foggy", icon: "🌫️", theme: "foggy" },
  48: { label: "Rime fog", icon: "🌫️", theme: "foggy" },
  51: { label: "Light drizzle", icon: "🌦️", theme: "rainy" },
  53: { label: "Moderate drizzle", icon: "🌦️", theme: "rainy" },
  55: { label: "Dense drizzle", icon: "🌧️", theme: "rainy" },
  61: { label: "Slight rain", icon: "🌧️", theme: "rainy" },
  63: { label: "Moderate rain", icon: "🌧️", theme: "rainy" },
  65: { label: "Heavy rain", icon: "🌧️", theme: "rainy" },
  71: { label: "Slight snow", icon: "🌨️", theme: "snowy" },
  73: { label: "Moderate snow", icon: "❄️", theme: "snowy" },
  75: { label: "Heavy snow", icon: "❄️", theme: "snowy" },
  77: { label: "Snow grains", icon: "🌨️", theme: "snowy" },
  80: { label: "Slight showers", icon: "🌦️", theme: "rainy" },
  81: { label: "Moderate showers", icon: "🌧️", theme: "rainy" },
  82: { label: "Violent showers", icon: "⛈️", theme: "stormy" },
  85: { label: "Slight snow showers", icon: "🌨️", theme: "snowy" },
  86: { label: "Heavy snow showers", icon: "❄️", theme: "snowy" },
  95: { label: "Thunderstorm", icon: "⛈️", theme: "stormy" },
  96: { label: "Thunderstorm with hail", icon: "⛈️", theme: "stormy" },
  99: { label: "Thunderstorm with heavy hail", icon: "⛈️", theme: "stormy" },
};

const NIGHT_CODES: Record<number, { label: string; icon: string; theme: WeatherTheme }> = {
  0: { label: "Clear sky", icon: "🌙", theme: "night" },
  1: { label: "Mainly clear", icon: "🌙", theme: "night" },
  2: { label: "Partly cloudy", icon: "🌛", theme: "night" },
  3: { label: "Overcast", icon: "☁️", theme: "night" },
};

export function getWeatherInfo(code: number, isDay: number = 1) {
  if (!isDay && NIGHT_CODES[code]) return NIGHT_CODES[code];
  return WMO_CODES[code] ?? { label: "Unknown", icon: "❓", theme: "cloudy" as WeatherTheme };
}

export function getWeatherTheme(code: number, isDay: number): WeatherTheme {
  if (!isDay) return "night";
  return getWeatherInfo(code).theme;
}

export function getUvLabel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "Low", color: "text-green-500" };
  if (uv <= 5) return { label: "Moderate", color: "text-yellow-500" };
  if (uv <= 7) return { label: "High", color: "text-orange-500" };
  if (uv <= 10) return { label: "Very High", color: "text-red-500" };
  return { label: "Extreme", color: "text-purple-500" };
}

export function getWeatherAlerts(data: WeatherData): { message: string; severity: "info" | "warning" | "danger" }[] {
  const alerts: { message: string; severity: "info" | "warning" | "danger" }[] = [];
  const { current } = data;

  if (current.uv_index >= 8) {
    alerts.push({ message: `🔴 Extreme UV Index (${current.uv_index.toFixed(1)}) — Avoid sun exposure`, severity: "danger" });
  } else if (current.uv_index >= 6) {
    alerts.push({ message: `🟠 High UV Index (${current.uv_index.toFixed(1)}) — Wear sunscreen`, severity: "warning" });
  }

  if (current.windspeed >= 60) {
    alerts.push({ message: `🌪️ Dangerous winds at ${Math.round(current.windspeed)} km/h`, severity: "danger" });
  } else if (current.windspeed >= 40) {
    alerts.push({ message: `💨 Strong winds at ${Math.round(current.windspeed)} km/h`, severity: "warning" });
  }

  if (current.temperature >= 40) {
    alerts.push({ message: `🔥 Extreme heat warning: ${Math.round(current.temperature)}°C`, severity: "danger" });
  } else if (current.temperature <= -10) {
    alerts.push({ message: `🥶 Extreme cold warning: ${Math.round(current.temperature)}°C`, severity: "danger" });
  }

  if ([82, 95, 96, 99].includes(current.weathercode)) {
    alerts.push({ message: "⛈️ Severe weather — Thunderstorm in progress", severity: "danger" });
  }

  return alerts;
}

export async function searchCities(query: string): Promise<GeoResult[]> {
  if (!query || query.length < 2) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  const data = await res.json();
  return (data.results ?? []).map((r: any) => ({
    name: r.name,
    country: r.country ?? "",
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function fetchWeather(location: GeoResult): Promise<WeatherData> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,apparent_temperature,is_day,uv_index&hourly=temperature_2m,weathercode,relativehumidity_2m,apparent_temperature,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
  );
  const data = await res.json();
  const utcOffsetSeconds = data.utc_offset_seconds; // 19800 for IST
  const nowUtc = Date.now() + (new Date().getTimezoneOffset() * 60000);
  const localHour = new Date(nowUtc + (utcOffsetSeconds * 1000)).getHours();
  const currentHourIndex = localHour;

  console.log("daily weathercodes:", data.daily.weathercode);


  return {
    current: {
      temperature: data.current.temperature_2m,
      windspeed: data.current.windspeed_10m,
      weathercode: data.current.weathercode,
      humidity: data.current.relativehumidity_2m,
      apparent_temperature: data.current.apparent_temperature,
      is_day: data.current.is_day,
      uv_index: data.hourly.uv_index?.[currentHourIndex] ?? 0,
    },
    daily: data.daily.time.map((t: string, i: number) => ({
      date: t,
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      weathercode: i === 0 ? data.current.weathercode : data.daily.weathercode[i],
    })),
    hourly: data.hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((t: string, i: number) => ({
      time: t,
      temperature: data.hourly.temperature_2m[currentHourIndex + i],
      weathercode: data.hourly.weathercode[currentHourIndex + i],
    })),
    location,
  };
}