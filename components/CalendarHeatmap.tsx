"use client";

import { useState, useEffect, startTransition } from "react";
import { AnimatePresence, m } from "motion/react";
import type { HabitEntry } from "@/types/entry";
import { getConfigs, DEFAULT_HABIT_CONFIGS } from "@/lib/habitConfig";
import Chevron from "@/components/Chevron";
import {
  buildMonthWeeks,
  computeCellStyle,
  doesEntryMatchFilter,
} from "@/lib/calendarUtils";
import type { HeatmapFilter } from "@/lib/calendarUtils";

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

/** Variants that receive the slide direction (1=forward, -1=back) via custom. */
const gridVariants = {
  enter: (d: number) => ({ x: d * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -40, opacity: 0 }),
};

export default function CalendarHeatmap({ entries, selectedDate, onDayClick, filter = null, onMonthChange }: Props) {
  const today = getTodayString();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const minYear = currentYear - 5;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  // +1 = forward (slide left), -1 = back (slide right).
  // Stored as state (not a ref) so it can be safely read during render.
  // React 18 batches it with the year/month updates into a single commit.
  const [dir, setDir] = useState<1 | -1>(1);

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

  const sortedDates = entries.map((e) => e.date).sort();
  const earliestYear = sortedDates[0] ? parseInt(sortedDates[0].substring(0, 4), 10) : currentYear;
  const showYearRow = currentYear - earliestYear >= 1 && entries.length >= 7;

  const prevMonth = () => {
    if (year <= minYear && month === 0) return;
    setDir(-1);
    const newYear = month === 0 ? year - 1 : year;
    const newMonth = month === 0 ? 11 : month - 1;
    setYear(newYear);
    setMonth(newMonth);
    onMonthChange?.(newYear, newMonth);
  };

  const nextMonth = () => {
    if (isAtCurrentMonth) return;
    setDir(1);
    const newYear = month === 11 ? year + 1 : year;
    const newMonth = month === 11 ? 0 : month + 1;
    setYear(newYear);
    setMonth(newMonth);
    onMonthChange?.(newYear, newMonth);
  };

  const prevYear = () => {
    if (year <= minYear) return;
    setDir(-1);
    setYear(year - 1);
    onMonthChange?.(year - 1, month);
  };

  const nextYear = () => {
    if (year >= currentYear) return;
    setDir(1);
    const newMonth = year + 1 === currentYear && month > currentMonth ? currentMonth : month;
    const newYear = year + 1;
    setYear(newYear);
    setMonth(newMonth);
    onMonthChange?.(newYear, newMonth);
  };

  return (
    <div>
      {/* ── Year selector ─────────────────────────────────────── */}
      {showYearRow && (
        <div className="mb-1 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={prevYear}
            disabled={year <= minYear}
            aria-label="Previous year"
            className="min-h-[44px] flex items-center justify-center text-xl text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300 disabled:opacity-30"
          >
            <Chevron direction="left" />
          </button>
          <span className="min-w-[4rem] text-center text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
            {year}
          </span>
          <button
            type="button"
            onClick={nextYear}
            disabled={year >= currentYear}
            aria-label="Next year"
            className="min-h-[44px] flex items-center justify-center text-xl text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300 disabled:opacity-30"
          >
            <Chevron direction="right" />
          </button>
        </div>
      )}

      {/* ── Month navigation ──────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="min-h-[44px] flex items-center text-xl text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
        >
          <Chevron direction="left" />
        </button>

        {/* Month heading crossfades on change */}
        <AnimatePresence initial={false}>
          <m.h2
            key={`${year}-${month}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="text-base font-light tracking-widest text-stone-600 dark:text-stone-400"
          >
            {MONTH_NAMES[month]}{!showYearRow ? ` ${year}` : ""}
          </m.h2>
        </AnimatePresence>

        <button
          type="button"
          onClick={nextMonth}
          disabled={isAtCurrentMonth}
          aria-label="Next month"
          className="min-h-[44px] flex items-center text-xl text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300 disabled:opacity-30"
        >
          <Chevron direction="right" />
        </button>
      </div>

      {/* ── Calendar grid — slides in the direction of navigation ── */}
      {/* custom + variants: Motion calls the variant function with the    */}
      {/* current custom value at animation time, so reversing direction   */}
      {/* always uses the latest dir even for the exiting element.         */}
      {/* mode="popLayout": exiting element is immediately removed from     */}
      {/* document flow (made position:absolute) so the layout height never */}
      {/* changes during transitions — prevents BottomNav repaint on iOS.  */}
      {/* overflow-hidden clips the absolutely-positioned exiting element.  */}
      <div className="relative overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <m.div
          key={`${year}-${month}`}
          custom={dir}
          variants={gridVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ overflow: "hidden" }}
        >
          <div className="flex justify-center">
            <div className="flex gap-1.5">

              {/* Day-of-week labels (M T W T F S S) as row labels on the left */}
              <div className="mr-2 flex flex-col gap-1.5">
                {DAY_LABELS.map((label, i) => (
                  <div
                    key={i}
                    className="flex h-11 w-5 items-center justify-center text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500"
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
                    const isFilteredOut = !!filter && !!entry && !isFuture && !doesEntryMatchFilter(entry, filter);
                    const { weightClass, colorClass } = computeCellStyle(entry, activeHabitCount);
                    const dayNum = parseInt(dateStr.split("-")[2], 10);

                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => !isFuture && onDayClick(dateStr)}
                        disabled={isFuture}
                        aria-label={dateStr}
                        aria-pressed={isSelected}
                        className={[
                          "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                          isSelected ? "bg-stone-100 dark:bg-stone-800" : "",
                          isFuture ? "cursor-default opacity-30" : "cursor-pointer",
                          isFilteredOut ? "opacity-30" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <span className={`text-sm leading-none ${weightClass} ${colorClass}`}>
                          {dayNum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}

            </div>
          </div>
        </m.div>
      </AnimatePresence>
      </div>

      {/* ── Legend ─────────────────────────────────────────────── */}
      <div className="mt-4 flex items-center justify-center gap-5">
        <span className="text-xs font-light text-stone-500 dark:text-stone-500">no activity</span>
        <span className="text-xs font-bold text-stone-700 dark:text-stone-300">active</span>
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">joy</span>
      </div>
    </div>
  );
}
