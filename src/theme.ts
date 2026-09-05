import type { Theme } from "./types";

const THEME_KEY = "tagesdrill.theme";

let current: Theme = resolveInitial();

function systemPrefersDark(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveInitial(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* private mode */
  }
  return systemPrefersDark() ? "dark" : "light";
}

export function getTheme(): Theme {
  return current;
}

export function applyTheme(theme: Theme): void {
  current = theme;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* not fatal */
  }
}

export function toggleTheme(): Theme {
  applyTheme(current === "dark" ? "light" : "dark");
  return current;
}

/** Called once at boot, before the first paint of the shell. */
export function initTheme(): void {
  applyTheme(current);
}
