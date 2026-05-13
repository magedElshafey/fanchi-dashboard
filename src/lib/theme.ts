const KEY = "theme"; // 'dark' | 'light'

export type ThemeMode = "dark" | "light";

export function getTheme(): ThemeMode {
  const saved = localStorage.getItem(KEY);
  return saved === "light" ? "light" : "dark";
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "light") root.classList.add("light");
  else root.classList.remove("light");
  localStorage.setItem(KEY, mode);
}

export function toggleTheme(): ThemeMode {
  const next: ThemeMode = getTheme() === "light" ? "dark" : "light";
  applyTheme(next);
  return next;
}
