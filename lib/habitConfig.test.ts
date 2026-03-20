import { getConfigs, saveConfigs, DEFAULT_HABIT_CONFIGS, DEFAULT_MOMENT_CONFIGS } from "@/lib/habitConfig";
import type { AppConfigs } from "@/lib/habitConfig";

// ─── Setup / teardown ────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

// ─── getConfigs ───────────────────────────────────────────────────────────────

describe("getConfigs", () => {
  it("returns defaults when localStorage is empty", () => {
    const configs = getConfigs();
    expect(configs.habits).toEqual(DEFAULT_HABIT_CONFIGS);
    expect(configs.moments).toEqual(DEFAULT_MOMENT_CONFIGS);
  });

  it("returns stored configs when valid data exists", () => {
    const stored: AppConfigs = {
      habits: [{ id: "abc", label: "Custom habit", type: "boolean", joyByDefault: false, archived: false }],
      moments: [{ id: "def", label: "Custom moment", archived: false }],
    };
    localStorage.setItem("clarity-configs", JSON.stringify(stored));
    const configs = getConfigs();
    expect(configs.habits).toEqual(stored.habits);
    expect(configs.moments).toEqual(stored.moments);
  });

  it("returns defaults when stored JSON is malformed", () => {
    localStorage.setItem("clarity-configs", "not-json{{");
    const configs = getConfigs();
    expect(configs.habits).toEqual(DEFAULT_HABIT_CONFIGS);
    expect(configs.moments).toEqual(DEFAULT_MOMENT_CONFIGS);
  });

  it("returns defaults when stored object lacks habits/moments arrays", () => {
    localStorage.setItem("clarity-configs", JSON.stringify({ habits: "oops", moments: 42 }));
    const configs = getConfigs();
    expect(configs.habits).toEqual(DEFAULT_HABIT_CONFIGS);
    expect(configs.moments).toEqual(DEFAULT_MOMENT_CONFIGS);
  });
});

// ─── saveConfigs ──────────────────────────────────────────────────────────────

describe("saveConfigs", () => {
  it("persists configs to localStorage", () => {
    const configs: AppConfigs = {
      habits: [{ id: "aaa", label: "Run", type: "boolean", joyByDefault: true, archived: false }],
      moments: [],
    };
    saveConfigs(configs);
    const raw = localStorage.getItem("clarity-configs");
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual(configs);
  });

  it("overwrites previously stored configs", () => {
    const first: AppConfigs = { habits: [], moments: [] };
    const second: AppConfigs = {
      habits: [{ id: "bbb", label: "Yoga", type: "boolean", joyByDefault: false, archived: false }],
      moments: [],
    };
    saveConfigs(first);
    saveConfigs(second);
    const raw = localStorage.getItem("clarity-configs");
    expect(JSON.parse(raw!)).toEqual(second);
  });
});
