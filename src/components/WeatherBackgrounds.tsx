import { useMemo } from "react";
import type { WeatherTheme } from "../lib/weather.ts";

interface Props {
  theme: WeatherTheme;
}

function Particles({ type }: { type: "rain" | "snow" }) {
  const particles = useMemo(() => {
    return Array.from({ length: type === "rain" ? 60 : 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: type === "rain" ? `${0.4 + Math.random() * 0.4}s` : `${2 + Math.random() * 3}s`,
      size: type === "snow" ? `${4 + Math.random() * 6}px` : undefined,
    }));
  }, [type]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className={type === "rain" ? "weather-raindrop" : "weather-snowflake"}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            ...(p.size ? { width: p.size, height: p.size } : {}),
          }}
        />
      ))}
    </div>
  );
}

function LightningFlash() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="weather-lightning" />
    </div>
  );
}

function FloatingClouds() {
  const clouds = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: `${10 + Math.random() * 40}%`,
      size: 60 + Math.random() * 80,
      delay: `${i * 4}s`,
      duration: `${20 + Math.random() * 15}s`,
      opacity: 0.15 + Math.random() * 0.25,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((c) => (
        <div
          key={c.id}
          className="weather-cloud"
          style={{
            top: c.top,
            width: `${c.size}px`,
            height: `${c.size * 0.5}px`,
            animationDelay: c.delay,
            animationDuration: c.duration,
            opacity: c.opacity,
          }}
        />
      ))}
    </div>
  );
}

function SunGlow() {
  return (
    <div className="absolute top-[-60px] right-[-60px] pointer-events-none">
      <div className="w-[200px] h-[200px] rounded-full bg-yellow-300/30 blur-3xl animate-pulse-slow" />
      <div className="absolute inset-8 rounded-full bg-yellow-200/20 blur-2xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
    </div>
  );
}

function Stars() {
  const stars = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      size: `${1 + Math.random() * 2}px`,
      delay: `${Math.random() * 4}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-pulse-slow"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

function FogLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="weather-fog-layer" style={{ top: "30%", animationDelay: "0s" }} />
      <div className="weather-fog-layer" style={{ top: "50%", animationDelay: "5s" }} />
      <div className="weather-fog-layer" style={{ top: "70%", animationDelay: "10s" }} />
    </div>
  );
}

const THEME_GRADIENTS: Record<WeatherTheme, string> = {
  sunny:  "bg-gradient-to-br from-[#1a1f4e] via-[#1e2456] to-[#1a2a6c]",
  cloudy: "bg-gradient-to-br from-[#1a1f3e] via-[#1e2248] to-[#161b3a]",
  rainy:  "bg-gradient-to-br from-[#141830] via-[#1a1e3a] to-[#111528]",
  snowy:  "bg-gradient-to-br from-[#1e2456] via-[#232870] to-[#1a2060]",
  stormy: "bg-gradient-to-br from-[#0d1020] via-[#111428] to-[#0a0d1a]",
  foggy:  "bg-gradient-to-br from-[#1a1f3e] via-[#1e2248] to-[#161b3a]",
  night:  "bg-gradient-to-br from-[#0d1033] via-[#0f1240] to-[#0a0d2e]",
};

export default function WeatherBackground({ theme }: Props) {
  return (
    <div className={`fixed inset-0 transition-all duration-1000 ${THEME_GRADIENTS[theme]}`}>
      {theme === "sunny" && <SunGlow />}
      {theme === "cloudy" && <FloatingClouds />}
      {theme === "rainy" && (
        <>
          <FloatingClouds />
          <Particles type="rain" />
        </>
      )}
      {theme === "snowy" && <Particles type="snow" />}
      {theme === "stormy" && (
        <>
          <Particles type="rain" />
          <LightningFlash />
        </>
      )}
      {theme === "foggy" && <FogLayer />}
      {theme === "night" && (
        <>
          <Stars />
        </>
      )}
    </div>
  );
}