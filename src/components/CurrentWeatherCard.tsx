import { Droplets, Wind, Thermometer, Sun} from "lucide-react";
import { getWeatherInfo, getUvLabel } from "../lib/weather";
import type { WeatherData } from "../lib/weather";

interface Props {
  data: WeatherData;
}

export default function CurrentWeatherCard({ data }: Props) {
  const { current, location } = data;
  const info = getWeatherInfo(current.weathercode, current.is_day);
  const uvInfo = getUvLabel(current.uv_index);

  return (
    <div className="glass-card rounded-lg p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-medium text-muted-foreground">
            {location.name}, {location.country}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-7xl">{info.icon}</span>
            <span className="text-6xl font-light text-foreground">
              {Math.round(current.temperature)}°
            </span>
          </div>
          <p className="text-lg text-muted-foreground mt-2">{info.label}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="flex flex-col items-center gap-2">
            <Thermometer className="h-5 w-5 text-accent" />
            <span className="text-xs text-muted-foreground">Feels like</span>
            <span className="text-lg font-semibold text-foreground">
              {Math.round(current.apparent_temperature)}°
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            <span className="text-xs text-muted-foreground">Humidity</span>
            <span className="text-lg font-semibold text-foreground">
              {current.humidity}%
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Wind className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Wind</span>
            <span className="text-lg font-semibold text-foreground">
              {Math.round(current.windspeed)} km/h
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <span className="text-xs text-muted-foreground">UV Index</span>
            <div className="text-center">
              <span className="text-lg font-semibold text-foreground">
                {current.uv_index.toFixed(1)}
              </span>
              <p className={`text-xs font-medium ${uvInfo.color}`}>{uvInfo.label}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}