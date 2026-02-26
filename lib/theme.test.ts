import { getTheme, setTheme, applyTheme } from "@/lib/theme";

// ─── Setup / teardown ────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

// ─── getTheme ────────────────────────────────────────────────────────────────

describe("getTheme", () => {
  it("returns 'light' when nothing is stored", () => {
    expect(getTheme()).toBe("light");
  });

  it("returns 'dark' when 'dark' is stored", () => {
    localStorage.setItem("clarity-theme", "dark");
    expect(getTheme()).toBe("dark");
  });

  it("returns 'light' when 'light' is stored", () => {
    localStorage.setItem("clarity-theme", "light");
    expect(getTheme()).toBe("light");
  });

  it("returns 'light' for any unrecognised stored value", () => {
    localStorage.setItem("clarity-theme", "solarized");
    expect(getTheme()).toBe("light");
  });
});

// ─── setTheme ────────────────────────────────────────────────────────────────

describe("setTheme", () => {
  it("persists 'dark' to localStorage", () => {
    setTheme("dark");
    expect(localStorage.getItem("clarity-theme")).toBe("dark");
  });

  it("persists 'light' to localStorage", () => {
    setTheme("light");
    expect(localStorage.getItem("clarity-theme")).toBe("light");
  });

  it("adds the dark class to <html> when theme is 'dark'", () => {
    setTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes the dark class from <html> when theme is 'light'", () => {
    document.documentElement.classList.add("dark");
    setTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("does not throw when localStorage is unavailable", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });

    expect(() => setTheme("dark")).not.toThrow();

    jest.restoreAllMocks();
  });
});

// ─── applyTheme ───────────────────────────────────────────────────────────────

describe("applyTheme", () => {
  it("applies dark mode when 'dark' is stored", () => {
    localStorage.setItem("clarity-theme", "dark");
    applyTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("applies light mode (removes dark class) when 'light' is stored", () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("clarity-theme", "light");
    applyTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("defaults to light mode when nothing is stored", () => {
    document.documentElement.classList.add("dark");
    applyTheme();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
