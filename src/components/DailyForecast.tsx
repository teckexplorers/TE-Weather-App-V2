import { getWeatherInfo } from "../lib/weather.ts";
import type { DailyForecast as DailyType,} from '../lib/weather.ts';

interface Props {
  days: DailyType[];
}

export default function DailyForecast({ days }: Props) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="glass-card rounded-lg p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        7-Day Forecast
      </h3>
      <div className="space-y-3">
        {days.map((d, i) => {
          const info = getWeatherInfo(d.weathercode, 1);
          const date = new Date(d.date);
          const label = i === 0 ? "Today" : dayNames[date.getDay()];
          return (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
            >
              <span className="w-12 text-sm font-medium text-foreground">{label}</span>
              <span className="text-xl">{info.icon}</span>
              <span className="text-xs text-muted-foreground w-24 text-center">{info.label}</span>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold text-foreground">
                  {Math.round(d.tempMax)}°
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(d.tempMin)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
