import type { HabitEntry } from "@/types/entry";

/** Narrows the heatmap to a single habit or moment item. */
export interface HeatmapFilter {
  type: "boolean-habit" | "numeric-habit" | "moment";
  id: string;
}

export interface CellStyle {
  weightClass: string;
  colorClass: string;
}

/**
 * Builds the week grid for a given month.
 * Returns an array of weeks; each week has 7 slots (index 0=Mon … 6=Sun).
 * Slots outside the month boundaries are null.
 */
export function buildMonthWeeks(year: number, month: number): (string | null)[][] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Convert Sunday-first JS day to Monday-first (0=Mon, 6=Sun)
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells: (string | null)[] = Array(firstDow).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    cells.push(`${year}-${mm}-${dd}`);
  }

  // Pad to a complete final week
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function doesEntryMatchFilter(entry: HabitEntry, filter: HeatmapFilter): boolean {
  if (filter.type === "boolean-habit") return entry.habits[filter.id]?.done ?? false;
  if (filter.type === "numeric-habit") return (entry.numeric[filter.id] ?? 0) > 0;
  return entry.moments.includes(filter.id);
}

export function computeCellStyle(
  entry: HabitEntry | null,
  activeHabitCount: number,
): CellStyle {
  if (!entry) {
    return { weightClass: "font-light", colorClass: "text-stone-300 dark:text-stone-700" };
  }
  const done = Object.values(entry.habits).filter((s) => s.done).length;
  const b = activeHabitCount > 0 ? done / activeHabitCount : 0;
  const hasJoyOrMoment =
    Object.values(entry.habits).some((s) => s.joy) || entry.moments.length > 0;

  const weightClass =
    b === 0 ? "font-light"
    : b <= 0.33 ? "font-normal"
    : b <= 0.67 ? "font-semibold"
    : "font-bold";

  const colorClass = hasJoyOrMoment
    ? "text-amber-600 dark:text-amber-400"
    : "text-stone-700 dark:text-stone-300";

  return { weightClass, colorClass };
}
