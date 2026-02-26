export type Theme = "light" | "dark";

const THEME_KEY = "clarity-theme";

/** Reads the saved theme from localStorage, defaulting to 'light'. */
export function getTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

/** Persists the theme choice and immediately applies the dark class to <html>. */
export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage unavailable — still apply visually
  }
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

/** Reads the saved theme from localStorage and applies it to the document. Call on app load. */
export function applyTheme(): void {
  setTheme(getTheme());
}
