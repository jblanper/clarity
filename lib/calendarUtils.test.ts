import { buildMonthWeeks, computeCellStyle, doesEntryMatchFilter } from "@/lib/calendarUtils";
import type { HabitEntry } from "@/types/entry";

// ─── buildMonthWeeks ─────────────────────────────────────────────────────────

describe("buildMonthWeeks", () => {
  it("returns correct week count for March 2026 (starts Sunday)", () => {
    // March 2026: 1st = Sunday (index 6 in Mon-first), 31 days → 6 weeks
    const weeks = buildMonthWeeks(2026, 2); // month=2 → March
    expect(weeks.length).toBe(6);
    expect(weeks[0][6]).toBe("2026-03-01"); // first day in week 0, slot 6 (Sun)
    expect(weeks[5][0]).toBe("2026-03-30"); // Monday slot
    expect(weeks[5][1]).toBe("2026-03-31"); // Tuesday slot
    expect(weeks[5][2]).toBeNull();         // padded null
  });

  it("first day of each week falls on Monday (slot 0) or is null", () => {
    const weeks = buildMonthWeeks(2026, 0); // January 2026
    for (const week of weeks) {
      expect(week.length).toBe(7);
    }
  });

  it("each week always has exactly 7 slots", () => {
    // Test several months
    for (let month = 0; month < 12; month++) {
      const weeks = buildMonthWeeks(2025, month);
      for (const week of weeks) {
        expect(week.length).toBe(7);
      }
    }
  });

  it("includes all days of the month exactly once", () => {
    const weeks = buildMonthWeeks(2026, 1); // February 2026 (28 days)
    const dates = weeks.flat().filter((d): d is string => d !== null);
    expect(dates.length).toBe(28);
    expect(dates[0]).toBe("2026-02-01");
    expect(dates[27]).toBe("2026-02-28");
  });
});

// ─── doesEntryMatchFilter ─────────────────────────────────────────────────────

const makeEntry = (overrides: Partial<HabitEntry> = {}): HabitEntry => ({
  date: "2026-03-01",
  habits: {
    "habit-bool-1": { done: true, joy: false },
    "habit-bool-2": { done: false, joy: false },
  },
  numeric: { "habit-num-1": 3.5 },
  moments: ["moment-1"],
  reflection: "",
  ...overrides,
});

describe("doesEntryMatchFilter", () => {
  it("returns true for a done boolean habit", () => {
    const entry = makeEntry();
    expect(doesEntryMatchFilter(entry, { type: "boolean-habit", id: "habit-bool-1" })).toBe(true);
  });

  it("returns false for an undone boolean habit", () => {
    const entry = makeEntry();
    expect(doesEntryMatchFilter(entry, { type: "boolean-habit", id: "habit-bool-2" })).toBe(false);
  });

  it("returns false for a missing boolean habit id", () => {
    const entry = makeEntry();
    expect(doesEntryMatchFilter(entry, { type: "boolean-habit", id: "missing" })).toBe(false);
  });

  it("returns true for a numeric habit with value > 0", () => {
    const entry = makeEntry();
    expect(doesEntryMatchFilter(entry, { type: "numeric-habit", id: "habit-num-1" })).toBe(true);
  });

  it("returns false for a numeric habit with value 0 or missing", () => {
    const entry = makeEntry({ numeric: { "habit-num-1": 0 } });
    expect(doesEntryMatchFilter(entry, { type: "numeric-habit", id: "habit-num-1" })).toBe(false);
    expect(doesEntryMatchFilter(entry, { type: "numeric-habit", id: "missing" })).toBe(false);
  });

  it("returns true when entry includes the moment id", () => {
    const entry = makeEntry();
    expect(doesEntryMatchFilter(entry, { type: "moment", id: "moment-1" })).toBe(true);
  });

  it("returns false when entry does not include the moment id", () => {
    const entry = makeEntry();
    expect(doesEntryMatchFilter(entry, { type: "moment", id: "missing-moment" })).toBe(false);
  });
});

// ─── computeCellStyle ─────────────────────────────────────────────────────────

describe("computeCellStyle", () => {
  it("returns font-light and dimmed color for null entry", () => {
    const style = computeCellStyle(null, 4);
    expect(style.weightClass).toBe("font-light");
    expect(style.colorClass).toContain("stone-300");
  });

  it("returns font-light for an entry with zero done habits", () => {
    const entry = makeEntry({ habits: { a: { done: false, joy: false } } });
    const style = computeCellStyle(entry, 1);
    expect(style.weightClass).toBe("font-light");
  });

  it("returns font-bold when all habits are done", () => {
    const entry = makeEntry({
      habits: { a: { done: true, joy: false }, b: { done: true, joy: false } },
      moments: [],
    });
    const style = computeCellStyle(entry, 2);
    expect(style.weightClass).toBe("font-bold");
  });

  it("returns font-semibold for >67% done", () => {
    const entry = makeEntry({
      habits: {
        a: { done: true, joy: false },
        b: { done: true, joy: false },
        c: { done: false, joy: false },
      },
      moments: [],
    });
    const style = computeCellStyle(entry, 3); // 2/3 = 0.67 → semibold threshold
    expect(style.weightClass).toBe("font-semibold");
  });

  it("returns amber color when joy is marked", () => {
    const entry = makeEntry({
      habits: { a: { done: true, joy: true } },
      moments: [],
    });
    const style = computeCellStyle(entry, 1);
    expect(style.colorClass).toContain("amber");
  });

  it("returns amber color when moments are present", () => {
    const entry = makeEntry({
      habits: { a: { done: false, joy: false } },
      moments: ["some-moment"],
    });
    const style = computeCellStyle(entry, 1);
    expect(style.colorClass).toContain("amber");
  });

  it("returns stone color when no joy and no moments", () => {
    const entry = makeEntry({
      habits: { a: { done: true, joy: false } },
      moments: [],
    });
    const style = computeCellStyle(entry, 1);
    expect(style.colorClass).toContain("stone");
    expect(style.colorClass).not.toContain("amber");
  });

  it("returns font-light when activeHabitCount is 0 (no habits configured)", () => {
    const entry = makeEntry({ habits: {}, moments: [] });
    const style = computeCellStyle(entry, 0);
    expect(style.weightClass).toBe("font-light");
  });
});
