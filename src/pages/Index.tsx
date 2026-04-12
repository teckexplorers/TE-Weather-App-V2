import { useState, useEffect } from "react";
import { CloudSun, RefreshCw } from "lucide-react";
import SearchBar from "../components/SearchBar";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import HourlyForecast from "../components/HourlyForecast";
import DailyForecast from "../components/DailyForecast";
import WeatherBackground from "../components/WeatherBackgrounds";
import WeatherAlerts from "../components/WeatherAlerts";
import { fetchWeather, getWeatherTheme } from "../lib/weather.ts";
import type { GeoResult, WeatherData, WeatherTheme } from '../lib/weather.ts';

export default function Index() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [theme, setTheme] = useState<WeatherTheme>("sunny");

  const loadWeather = async (location: GeoResult) => {
    setLoading(true);
    try {
      const data = await fetchWeather(location);
      setWeather(data);
      setTheme(getWeatherTheme(data.current.weathercode, data.current.is_day));
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to fetch weather", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const location: GeoResult = {
            name: data.address.city || data.address.town || data.address.village || "Your Location",
            country: data.address.country_code?.toUpperCase() ?? "",
            latitude,
            longitude,
          };
          loadWeather(location);
        },
        () => {
          loadWeather({ name: "Mumbai", country: "IN", latitude: 19.076, longitude: 72.8777 });
        }
      );
    } else {
      loadWeather({ name: "Mumbai", country: "IN", latitude: 19.076, longitude: 72.8777 });
    }

    const interval = setInterval(() => {
      if (weather) loadWeather(weather.location);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isLightTheme = ["sunny", "snowy", "foggy"].includes(theme);

  return (
    <div className="min-h-screen relative">
      <WeatherBackground theme={theme} />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun className={`h-7 w-7 ${isLightTheme ? "text-foreground" : "text-white"}`} />
            <h1 className={`text-2xl font-bold ${isLightTheme ? "text-foreground" : "text-white"}`}>TE Weather</h1>
          </div>
          {lastUpdated && (
            <button
              onClick={() => weather && loadWeather(weather.location)}
              className={`flex items-center gap-1 text-xs transition-colors ${isLightTheme ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white"}`}
            >
              <RefreshCw className="h-3 w-3" />
              {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </button>
          )}
        </div>

        {/* Search */}
        <SearchBar onSelect={(loc) => loadWeather(loc)} />

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-5xl animate-pulse-slow">🌤️</div>
            <p className={isLightTheme ? "text-foreground/70" : "text-white/70"}>Loading weather...</p>
          </div>
        ) : weather ? (
          <div className="space-y-4">
            <WeatherAlerts data={weather} />
            <CurrentWeatherCard data={weather} />
            <HourlyForecast hours={weather.hourly} />
            <DailyForecast days={weather.daily} />
          </div>
        ) : null}
      </div>
    </div>
  );
}