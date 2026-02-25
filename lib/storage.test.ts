import { saveEntry, getEntry, getAllEntries } from "@/lib/storage";
import type { HabitEntry } from "@/types/entry";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const makeEntry = (overrides: Partial<HabitEntry> = {}): HabitEntry => ({
  date: "2026-02-25",
  meditation: true,
  exercise: false,
  reading: true,
  journaling: false,
  drawing: false,
  sleep: 7.5,
  water: 6,
  screenTime: 3,
  coffee: 1,
  decafCoffee: 2,
  joyTags: ["walked outside", "cooked dinner"],
  reflection: "Good day overall.",
  ...overrides,
});

// ─── Setup / teardown ────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
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
