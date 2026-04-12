import { useLayoutEffect, useState } from "react";

export function useTheme() {
  const [isDark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  // Keep <html> class in sync
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return { isDark, setDark };
}