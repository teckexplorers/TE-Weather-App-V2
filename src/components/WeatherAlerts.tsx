import type { WeatherData } from '../lib/weather.ts';
import { getWeatherAlerts } from '../lib/weather.ts';
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

interface Props {
  data: WeatherData;
}

export default function WeatherAlerts({ data }: Props) {
  const alerts = getWeatherAlerts(data);
  if (alerts.length === 0) return null;

  const icons = {
    info: <Info className="h-4 w-4 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 shrink-0" />,
    danger: <ShieldAlert className="h-4 w-4 shrink-0" />,
  };

  const styles = {
    info: "bg-blue-500/20 border-blue-400/30 text-blue-100",
    warning: "bg-amber-500/20 border-amber-400/30 text-amber-100",
    danger: "bg-red-500/20 border-red-400/30 text-red-100",
  };

  return (
    <div className="space-y-2 animate-fade-in">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${styles[alert.severity]}`}
        >
          {icons[alert.severity]}
          <span className="text-sm font-medium">{alert.message}</span>
        </div>
      ))}
    </div>
  );
}