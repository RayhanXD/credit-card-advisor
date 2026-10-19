"use client";

import { useSyncExternalStore } from "react";

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

// The active theme attribute; changes re-render any component that reads it.
export function useThemeAttr(): string {
  return useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.getAttribute("data-theme") ?? "light",
    () => "light"
  );
}

export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
