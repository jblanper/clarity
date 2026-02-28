"use client";

import { useState, useEffect, startTransition } from "react";
import type { HabitEntry } from "@/types/entry";
import { getConfigs, DEFAULT_HABIT_CONFIGS } from "@/lib/habitConfig";
import Chevron from "@/components/Chevron";

/** Narrows the heatmap to a single habit or moment item. */
export interface HeatmapFilter {
  type: "boolean-habit" | "moment";
  id: string;
}

interface Props {
  entries: HabitEntry[];
  selectedDate: string | null;
  onDayClick: (date: string) => void;
  /** When set, colors each cell relative to that one item rather than the full overview. */
  filter?: HeatmapFilter | null;
  onMonthChange?: (year: number, month: number) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

/** Returns today's date as YYYY-MM-DD in local time. */
function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Builds the week grid for a given month.
 * Returns an array of weeks; each week has 7 slots (index 0=Mon … 6=Sun).
 * Slots outside the month boundaries are null.
 */
function buildMonthWeeks(year: number, month: number): (string | null)[][] {
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

/**
 * Computes a cell background color.
 *
 * Overview mode (filter = null):
 *   - Blue  (hue 220): scales with habits where done: true (0–totalBooleanHabits)
 *   - Amber (hue 45):  scales with combined joy signals — habits where joy: true
 *                      plus moments selected (0–6, saturates at 6)
 *   Hues are weighted-averaged, so equal max scores blend toward green (~132°).
 *
 * Filter mode:
 *   - boolean-habit: full blue when done: true, muted otherwise
 *   - moment:        full amber when the moment UUID is present, muted otherwise
 */
function computeCellColor(
  entry: HabitEntry,
  isDark: boolean,
  totalBooleanHabits: number,
  filter: HeatmapFilter | null,
): string {
  const muted = isDark ? "hsl(25, 6%, 35%)" : "hsl(25, 6%, 80%)";

  // ── Filter mode ────────────────────────────────────────────────────────────
  if (filter !== null) {
    // Full-intensity lightness values match the overview mode at b=1 / y=1
    const fullL = isDark ? 65 : 50;
    if (filter.type === "boolean-habit") {
      return (entry.habits[filter.id]?.done ?? false)
        ? `hsl(220, 55%, ${fullL}%)`
        : muted;
    }
    // moment
    return entry.moments.includes(filter.id)
      ? `hsl(45, 65%, ${fullL}%)`
      : muted;
  }

  // ── Overview mode ──────────────────────────────────────────────────────────
  const habitCount = Object.values(entry.habits).filter((s) => s.done).length;
  // Joy signal: boolean habits with joy: true + moments selected (equal weight)
  const joyCount =
    Object.values(entry.habits).filter((s) => s.joy).length +
    entry.moments.length;

  const b = habitCount / (totalBooleanHabits || 1); // 0–1, guard against divide-by-zero
  const y = Math.min(joyCount / 6, 1);              // 0–1, saturates at 6

  // Entry exists but nothing logged — muted neutral tint
  if (b === 0 && y === 0) return muted;

  // Each dimension drives lightness independently:
  // light mode: high intensity → lower lightness (richer color)
  // dark mode:  high intensity → higher lightness (brighter against dark bg)
  const blueL   = isDark ? 30 + 35 * b : 88 - 38 * b; // dark 30→65, light 88→50
  const yellowL = isDark ? 30 + 35 * y : 88 - 38 * y;

  if (y === 0) return `hsl(220, 55%, ${Math.round(blueL)}%)`;
  if (b === 0) return `hsl(45, 65%, ${Math.round(yellowL)}%)`;

  // Both present: blend hue, saturation, and lightness by each dimension's weight
  const total = b + y;
  const h = Math.round((220 * b + 45 * y) / total); // 220 → ~132 (green) → 45
  const s = Math.round((55 * b + 65 * y) / total);
  const l = Math.round((blueL * b + yellowL * y) / total);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

/** Subscribes to changes on the <html> class list to detect active theme. */
function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setIsDark(html.classList.contains("dark"));

    startTransition(update);
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export default function CalendarHeatmap({ entries, selectedDate, onDayClick, filter = null, onMonthChange }: Props) {
  const today = getTodayString();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const minYear = currentYear - 5;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const isDark = useIsDark();

  // Count of active boolean habits — used to normalise the heat intensity.
  // Initialised from defaults so first render matches SSR; updated on mount.
  const [activeHabitCount, setActiveHabitCount] = useState(
    DEFAULT_HABIT_CONFIGS.filter((h) => h.type === "boolean" && !h.archived).length
  );
  useEffect(() => {
    startTransition(() => {
      const configs = getConfigs();
      setActiveHabitCount(
        configs.habits.filter((h) => h.type === "boolean" && !h.archived).length
      );
    });
  }, []);

  const entryMap = new Map(entries.map((e) => [e.date, e]));
  const weeks = buildMonthWeeks(year, month);
  const isAtCurrentMonth = year === currentYear && month === currentMonth;

  const prevMonth = () => {
    if (year <= minYear && month === 0) return;
    const newYear = month === 0 ? year - 1 : year;
    const newMonth = month === 0 ? 11 : month - 1;
    setYear(newYear);
    setMonth(newMonth);
    onMonthChange?.(newYear, newMonth);
  };

  const nextMonth = () => {
    if (isAtCurrentMonth) return;
    const newYear = month === 11 ? year + 1 : year;
    const newMonth = month === 11 ? 0 : month + 1;
    setYear(newYear);
    setMonth(newMonth);
    onMonthChange?.(newYear, newMonth);
  };

  const prevYear = () => {
    if (year <= minYear) return;
    const newYear = year - 1;
    setYear(newYear);
    onMonthChange?.(newYear, month);
  };

  const nextYear = () => {
    if (year >= currentYear) return;
    const newYear = year + 1;
    // Clamp month if jumping into the current year past today's month
    const newMonth = newYear === currentYear && month > currentMonth ? currentMonth : month;
    setYear(newYear);
    setMonth(newMonth);
    onMonthChange?.(newYear, newMonth);
  };

  return (
    <div>
      {/* ── Year selector ─────────────────────────────────────── */}
      <div className="mb-1 flex items-center justify-center gap-8">
        <button
          onClick={prevYear}
          disabled={year <= minYear}
          aria-label="Previous year"
          className="text-xl text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300 disabled:opacity-30"
        >
          <Chevron direction="left" />
        </button>
        <span className="min-w-[4rem] text-center text-sm uppercase tracking-widest text-stone-500 dark:text-stone-500">
          {year}
        </span>
        <button
          onClick={nextYear}
          disabled={year >= currentYear}
          aria-label="Next year"
          className="text-xl text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300 disabled:opacity-30"
        >
          <Chevron direction="right" />
        </button>
      </div>

      {/* ── Month navigation ──────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="min-h-[44px] flex items-center text-xl text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
        >
          <Chevron direction="left" />
        </button>
        <h2 className="text-base font-light tracking-widest text-stone-600 dark:text-stone-400">
          {MONTH_NAMES[month]}
        </h2>
        <button
          onClick={nextMonth}
          disabled={isAtCurrentMonth}
          aria-label="Next month"
          className="min-h-[44px] flex items-center text-xl text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300 disabled:opacity-30"
        >
          <Chevron direction="right" />
        </button>
      </div>

      {/* ── Calendar grid ─────────────────────────────────────── */}
      <div className="flex justify-center">
        <div className="flex gap-1.5">

          {/* Day-of-week labels (M T W T F S S) as row labels on the left */}
          <div className="mr-2 flex flex-col gap-1.5">
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="flex h-11 w-5 items-center justify-center text-xs uppercase tracking-widest text-stone-500 dark:text-stone-600"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Week columns — each column = one week, rows = Mon…Sun */}
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-1.5">
              {week.map((dateStr, d) => {

                // Blank slot for days outside the current month
                if (!dateStr) {
                  return <div key={d} className="h-11 w-11" aria-hidden />;
                }

                const entry = entryMap.get(dateStr) ?? null;
                const isFuture = dateStr > today;
                const isSelected = dateStr === selectedDate;
                const cellBg = entry && !isFuture
                  ? computeCellColor(entry, isDark, activeHabitCount, filter)
                  : undefined;
                const dayNum = parseInt(dateStr.split("-")[2], 10);

                return (
                  <button
                    key={d}
                    onClick={() => !isFuture && onDayClick(dateStr)}
                    disabled={isFuture}
                    aria-label={dateStr}
                    aria-pressed={isSelected}
                    className={[
                      "flex h-11 w-11 items-start justify-end rounded-md p-1 transition-colors",
                      !cellBg ? "bg-stone-200 dark:bg-stone-800" : "",
                      isSelected ? "ring-2 ring-stone-500 dark:ring-stone-500" : "",
                      isFuture ? "cursor-default opacity-25" : "cursor-pointer",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={cellBg ? { backgroundColor: cellBg } : undefined}
                  >
                    {/* Date number in the corner */}
                    <span className="text-[11px] leading-none text-black/50 dark:text-white/35">
                      {dayNum}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
