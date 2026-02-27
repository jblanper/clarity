import { saveEntry, getEntry, getAllEntries, clearAllEntries, sanitizeHabitState } from "@/lib/storage";
import type { HabitEntry } from "@/types/entry";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const makeEntry = (overrides: Partial<HabitEntry> = {}): HabitEntry => ({
  date: "2026-02-25",
  habits: {
    "00000000-0000-4000-8000-000000000001": { done: true,  joy: true  },
    "00000000-0000-4000-8000-000000000002": { done: false, joy: false },
  },
  numeric: {
    "00000000-0000-4000-8000-000000000006": 7.5,
  },
  moments: ["00000000-0000-4000-8000-000000000011"],
  reflection: "Good day overall.",
  ...overrides,
});

// ─── Setup / teardown ────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

// ─── sanitizeHabitState ───────────────────────────────────────────────────────

describe("sanitizeHabitState", () => {
  it("returns { done: false, joy: false } for empty input", () => {
    expect(sanitizeHabitState({})).toEqual({ done: false, joy: false });
  });

  it("returns { done: true, joy: false } when only done is true", () => {
    expect(sanitizeHabitState({ done: true })).toEqual({ done: true, joy: false });
  });

  it("returns { done: true, joy: true } when joy is true", () => {
    expect(sanitizeHabitState({ joy: true })).toEqual({ done: true, joy: true });
  });

  it("enforces done: true when joy: true even if done is explicitly false", () => {
    expect(sanitizeHabitState({ done: false, joy: true })).toEqual({ done: true, joy: true });
  });
});

// ─── saveEntry ───────────────────────────────────────────────────────────────

describe("saveEntry", () => {
  it("persists an entry to localStorage", () => {
    const entry = makeEntry();
    saveEntry(entry);

    const raw = localStorage.getItem("clarity_entries");
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed["2026-02-25"]).toEqual(entry);
  });

  it("overwrites an existing entry for the same date", () => {
    saveEntry(makeEntry({ reflection: "First save." }));
    saveEntry(makeEntry({ reflection: "Updated save." }));

    const raw = localStorage.getItem("clarity_entries");
    const parsed = JSON.parse(raw!);
    expect(parsed["2026-02-25"].reflection).toBe("Updated save.");
  });

  it("stores multiple entries under different dates", () => {
    saveEntry(makeEntry({ date: "2026-02-24" }));
    saveEntry(makeEntry({ date: "2026-02-25" }));

    const raw = localStorage.getItem("clarity_entries");
    const parsed = JSON.parse(raw!);
    expect(Object.keys(parsed)).toHaveLength(2);
  });
});

// ─── getEntry ────────────────────────────────────────────────────────────────

describe("getEntry", () => {
  it("returns the correct entry for a saved date", () => {
    const entry = makeEntry();
    saveEntry(entry);

    expect(getEntry("2026-02-25")).toEqual(entry);
  });

  it("returns null for a date that has no entry", () => {
    expect(getEntry("2026-01-01")).toBeNull();
  });

  it("returns null when localStorage is empty", () => {
    expect(getEntry("2026-02-25")).toBeNull();
  });

  it("returns the correct entry when multiple dates are stored", () => {
    const entryA = makeEntry({ date: "2026-02-24", reflection: "Day A" });
    const entryB = makeEntry({ date: "2026-02-25", reflection: "Day B" });
    saveEntry(entryA);
    saveEntry(entryB);

    expect(getEntry("2026-02-24")).toEqual(entryA);
    expect(getEntry("2026-02-25")).toEqual(entryB);
  });
});

// ─── getAllEntries ────────────────────────────────────────────────────────────

describe("getAllEntries", () => {
  it("returns an empty array when nothing is stored", () => {
    expect(getAllEntries()).toEqual([]);
  });

  it("returns all saved entries", () => {
    const entryA = makeEntry({ date: "2026-02-24" });
    const entryB = makeEntry({ date: "2026-02-25" });
    saveEntry(entryA);
    saveEntry(entryB);

    const results = getAllEntries();
    expect(results).toHaveLength(2);
    expect(results).toContainEqual(entryA);
    expect(results).toContainEqual(entryB);
  });

  it("returns entries sorted chronologically (oldest first)", () => {
    // Save out of order to verify sorting is applied
    saveEntry(makeEntry({ date: "2026-02-25" }));
    saveEntry(makeEntry({ date: "2026-02-23" }));
    saveEntry(makeEntry({ date: "2026-02-24" }));

    const dates = getAllEntries().map((e) => e.date);
    expect(dates).toEqual(["2026-02-23", "2026-02-24", "2026-02-25"]);
  });
});

// ─── clearAllEntries ──────────────────────────────────────────────────────────

describe("clearAllEntries", () => {
  it("removes all saved entries so getAllEntries returns empty", () => {
    saveEntry(makeEntry({ date: "2026-02-24" }));
    saveEntry(makeEntry({ date: "2026-02-25" }));
    clearAllEntries();
    expect(getAllEntries()).toEqual([]);
  });

  it("leaves localStorage key absent after clearing", () => {
    saveEntry(makeEntry());
    clearAllEntries();
    expect(localStorage.getItem("clarity_entries")).toBeNull();
  });
});

// ─── Error resilience ────────────────────────────────────────────────────────

describe("error resilience", () => {
  it("getEntry returns null when stored data is malformed JSON", () => {
    localStorage.setItem("clarity_entries", "not valid json{{{");
    expect(getEntry("2026-02-25")).toBeNull();
  });

  it("getAllEntries returns an empty array when stored data is malformed JSON", () => {
    localStorage.setItem("clarity_entries", "not valid json{{{");
    expect(getAllEntries()).toEqual([]);
  });

  it("saveEntry does not throw when localStorage is unavailable", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });

    expect(() => saveEntry(makeEntry())).not.toThrow();

    jest.restoreAllMocks();
  });
});
