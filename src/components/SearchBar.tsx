import { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { searchCities } from "../lib/weather.ts";
import type { GeoResult } from "../lib/weather.ts";

interface SearchBarProps {
  onSelect: (location: GeoResult) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        const cities = await searchCities(query);
        setResults(cities);
        setOpen(true);
      } else {
        setResults([]);
        setOpen(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <div className="glass-card flex items-center gap-3 px-4 py-3 rounded-lg">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-lg overflow-hidden z-50 animate-fade-in">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                onSelect(r);
                setQuery(r.name);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">{r.name}</span>
              <span className="text-muted-foreground text-sm">{r.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}