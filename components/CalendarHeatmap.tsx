"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import type { HabitEntry } from "@/types/entry";
import { getConfigs, DEFAULT_HABIT_CONFIGS } from "@/lib/habitConfig";
import Chevron from "@/components/Chevron";

/** Narrows the heatmap to a single habit or moment item. */
export interface HeatmapFilter {
  type: "boolean-habit" | "numeric-habit" | "moment";
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

// Sunset palette — exact target colors at full intensity
const HABIT_LIGHT  = "#7090b0"; // dusk blue  — hsl(210, 29%, 57%)
const HABIT_DARK   = "#506880"; //              hsl(210, 23%, 41%)
const MOMENT_LIGHT = "#c4784a"; // warm ember  — hsl(23, 51%, 53%)
const MOMENT_DARK  = "#a05f38"; //              hsl(23, 48%, 42%)

// HSL components for blended overview cells
const HABIT_H        = 210;
const HABIT_S_LIGHT  = 29;
const HABIT_S_DARK   = 23;
const MOMENT_H       = 23;
const MOMENT_S_LIGHT = 51;
const MOMENT_S_DARK  = 48;

function computeCellColor(
  entry: HabitEntry,
  isDark: boolean,
  totalBooleanHabits: number,
): string {
  const muted = isDark ? "hsl(25, 6%, 35%)" : "hsl(25, 6%, 80%)";

  const habitCount = Object.values(entry.habits).filter((s) => s.done).length;
  const joyCount =
    Object.values(entry.habits).filter((s) => s.joy).length +
    entry.moments.length;
  const b = habitCount / (totalBooleanHabits || 1);
  const y = Math.min(joyCount / 6, 1);

  if (b === 0 && y === 0) return muted;

  const habitS  = isDark ? HABIT_S_DARK   : HABIT_S_LIGHT;
  const momentS = isDark ? MOMENT_S_DARK  : MOMENT_S_LIGHT;
  const habitL  = isDark ? 19 + 22 * b   : 80 - 23 * b;  // dark 19→41=HABIT_DARK,  light 80→57=HABIT_LIGHT
  const momentL = isDark ? 23 + 19 * y   : 81 - 28 * y;  // dark 23→42=MOMENT_DARK, light 81→53=MOMENT_LIGHT

  if (y === 0) return `hsl(${HABIT_H}, ${habitS}%, ${Math.round(habitL)}%)`;
  if (b === 0) return `hsl(${MOMENT_H}, ${momentS}%, ${Math.round(momentL)}%)`;

  const total = b + y;
  const h = Math.round((HABIT_H * b + MOMENT_H * y) / total);
  const s = Math.round((habitS * b + momentS * y) / total);
  const l = Math.round((habitL * b + momentL * y) / total);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function doesEntryMatchFilter(entry: HabitEntry, filter: HeatmapFilter): boolean {
  if (filter.type === "boolean-habit") return entry.habits[filter.id]?.done ?? false;
  if (filter.type === "numeric-habit") return (entry.numeric[filter.id] ?? 0) > 0;
  return entry.moments.includes(filter.id);
}

/** Returns the exact palette color for a filter-match highlight. */
function getFilterHighlightColor(filter: HeatmapFilter, isDark: boolean): string {
  return filter.type === "moment"
    ? (isDark ? MOMENT_DARK : MOMENT_LIGHT)
    : (isDark ? HABIT_DARK  : HABIT_LIGHT);
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

type SlidePhase = "idle" | "exit-left" | "exit-right" | "enter-left" | "enter-right";

export default function CalendarHeatmap({ entries, selectedDate, onDayClick, filter = null, onMonthChange }: Props) {
  const today = getTodayString();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const minYear = currentYear - 5;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const isDark = useIsDark();

  const [slidePhase, setSlidePhase] = useState<SlidePhase>("idle");
  const [headingFading, setHeadingFading] = useState(false);
  const isAnimating = useRef(false);

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

  function animateToMonth(newYear: number, newMonth: number, dir: "next" | "prev") {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const exitPhase: SlidePhase = dir === "next" ? "exit-left" : "exit-right";
    const enterPhase: SlidePhase = dir === "next" ? "enter-right" : "enter-left";
    setSlidePhase(exitPhase);
    setHeadingFading(true);
    setTimeout(() => {
      setMonth(newMonth);
      setYear(newYear);
      onMonthChange?.(newYear, newMonth);
      setSlidePhase(enterPhase);
      setHeadingFading(false);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setSlidePhase("idle");
        isAnimating.current = false;
      }));
    }, 220);
  }

  const entryMap = new Map(entries.map((e) => [e.date, e]));
  const weeks = buildMonthWeeks(year, month);
  const isAtCurrentMonth = year === currentYear && month === currentMonth;

  const prevMonth = () => {
    if (year <= minYear && month === 0) return;
    const newYear = month === 0 ? year - 1 : year;
    const newMonth = month === 0 ? 11 : month - 1;
    animateToMonth(newYear, newMonth, "prev");
  };

  const nextMonth = () => {
    if (isAtCurrentMonth) return;
    const newYear = month === 11 ? year + 1 : year;
    const newMonth = month === 11 ? 0 : month + 1;
    animateToMonth(newYear, newMonth, "next");
  };

  const prevYear = () => {
    if (year <= minYear) return;
    animateToMonth(year - 1, month, "prev");
  };

  const nextYear = () => {
    if (year >= currentYear) return;
    // Clamp month if jumping into the current year past today's month
    const newMonth = year + 1 === currentYear && month > currentMonth ? currentMonth : month;
    animateToMonth(year + 1, newMonth, "next");
  };

  const slideClass = slidePhase !== "idle" ? `slide-${slidePhase}` : "";

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
        <h2 className={`text-base font-light tracking-widest text-stone-600 dark:text-stone-400 month-heading${headingFading ? " fading" : ""}`}>
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
      <div className="calendar-grid-wrap">
        <div className="flex justify-center">
          <div className={`flex gap-1.5 calendar-grid${slideClass ? ` ${slideClass}` : ""}`}>

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
                  const matchesFilter = !!filter && !!entry && !isFuture && doesEntryMatchFilter(entry, filter);
                  const cellBg = entry && !isFuture
                    ? (matchesFilter
                        ? getFilterHighlightColor(filter, isDark)
                        : computeCellColor(entry, isDark, activeHabitCount))
                    : undefined;
                  const dimmed = !!filter && !!entry && !isFuture && !matchesFilter;
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
                      style={{
                        ...(cellBg ? { backgroundColor: cellBg } : {}),
                        ...(dimmed ? { opacity: 0.25 } : {}),
                      }}
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
    </div>
  );
}
