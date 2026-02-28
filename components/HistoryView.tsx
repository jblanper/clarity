"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { getAllEntries } from "@/lib/storage";
import type { HabitEntry } from "@/types/entry";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import type { HeatmapFilter } from "@/components/CalendarHeatmap";
import DayDetail from "@/components/DayDetail";
import FrequencyList, { type Period } from "@/components/FrequencyList";

export default function HistoryView() {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const now = new Date();
  const [viewedYear, setViewedYear] = useState(now.getFullYear());
  const [viewedMonth, setViewedMonth] = useState(now.getMonth());
  const [period, setPeriod] = useState<Period>("month");
  const [activeFilter, setActiveFilter] = useState<HeatmapFilter | null>(null);
  const [frequencyVisible, setFrequencyVisible] = useState(false);

  useEffect(() => {
    startTransition(() => setEntries(getAllEntries()));
  }, []);

  // When returning from the edit page (/history?open=YYYY-MM-DD),
  // auto-reopen the DayDetail for that date, then clean the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openDate = params.get("open");
    if (openDate) {
      startTransition(() => setSelectedDate(openDate));
      window.history.replaceState({}, "", "/history");
    }
  }, []);

  const handleDayClick = (date: string) => {
    // Toggle selection: tapping the same date again closes the sheet
    setSelectedDate((prev) => (prev === date ? null : date));
  };

  const handleClose = () => setSelectedDate(null);

  // Find the full entry object for the selected date (null if none saved yet)
  const selectedEntry = selectedDate
    ? (entries.find((e) => e.date === selectedDate) ?? null)
    : null;

  return (
    <div className="mx-auto max-w-md px-5 pt-10 pb-28">

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-light tracking-widest text-stone-800 dark:text-stone-200">
          History
        </h1>
        <Link
          href="/settings"
          onClick={() => sessionStorage.setItem("settings-back", "/history")}
          className="text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
        >
          Settings
        </Link>
      </header>

      {/* ── Heatmap ───────────────────────────────────────────── */}
      <CalendarHeatmap
        entries={entries}
        selectedDate={selectedDate}
        onDayClick={handleDayClick}
        filter={activeFilter}
        onMonthChange={(y, m) => { setViewedYear(y); setViewedMonth(m); }}
      />

      {/* ── Section divider + Frequency ─────────────────────── */}
      <div className="mt-10 border-t border-stone-100 dark:border-stone-800">
        <div className="pt-8">

          {/* Toggle */}
          <button
            type="button"
            onClick={() => setFrequencyVisible((v) => !v)}
            className="w-full min-h-[44px] flex items-center text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500 transition-colors hover:text-stone-700 dark:hover:text-stone-400"
          >
            {frequencyVisible ? "Frequency ↑" : "Frequency ↓"}
          </button>

          {frequencyVisible && (
            <>
              {/* Period selector */}
              <div className="mt-5 mb-6 flex items-center justify-center gap-3">
                <button type="button" onClick={() => setPeriod("month")}
                  className={`text-xs uppercase tracking-widest transition-colors ${period === "month" ? "text-stone-900 dark:text-stone-100" : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
                  Month
                </button>
                <span className="text-stone-300 dark:text-stone-600">·</span>
                <button type="button" onClick={() => setPeriod("3m")}
                  className={`text-xs uppercase tracking-widest transition-colors ${period === "3m" ? "text-stone-900 dark:text-stone-100" : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
                  3 Months
                </button>
                <span className="text-stone-300 dark:text-stone-600">·</span>
                <button type="button" onClick={() => setPeriod("always")}
                  className={`text-xs uppercase tracking-widest transition-colors ${period === "always" ? "text-stone-900 dark:text-stone-100" : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"}`}>
                  Always
                </button>
              </div>

              {/* Frequency list */}
              <FrequencyList
                entries={entries}
                period={period}
                viewedYear={viewedYear}
                viewedMonth={viewedMonth}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </>
          )}
        </div>
      </div>

      {/* ── Day detail sheet ──────────────────────────────────── */}
      {selectedDate && (
        <DayDetail
          date={selectedDate}
          entry={selectedEntry}
          onClose={handleClose}
        />
      )}

    </div>
  );
}
