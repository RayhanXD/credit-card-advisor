"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

// Renders "light" on both the server and the first client pass (avoiding a
// hydration mismatch), then syncs to the real persisted theme right after
// mount — the inline script in the root layout already set the DOM attribute
// before this runs, so only this hook's own React state needs to catch up.
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>("light");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState((document.documentElement.getAttribute("data-theme") as ThemeMode) || "light");
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    document.documentElement.setAttribute("data-theme", mode);
    try {
      localStorage.setItem("strata-theme", mode);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return { theme, setTheme, toggle };
}
