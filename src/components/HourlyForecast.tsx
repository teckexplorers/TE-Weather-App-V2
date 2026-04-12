import type { HourlyForecast as HourlyType } from "../lib/weather.ts";
import { getWeatherInfo } from "../lib/weather.ts";

interface Props {
  hours: HourlyType[];
}

export default function HourlyForecast({ hours }: Props) {
  return (
    <div className="glass-card rounded-lg p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Next 24 Hours
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {hours.slice(0, 12).map((h, i) => {
          const hour = new Date(h.time).getHours();
          const label = i === 0 ? "Now" : `${hour}:00`;
          const info = getWeatherInfo(h.weathercode, hour >= 6 && hour < 20 ? 1 : 0);

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2 min-w-[60px] py-2"
            >
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-2xl">{info.icon}</span>
              <span className="text-sm font-semibold text-foreground">
                {Math.round(h.temperature)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
