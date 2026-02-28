"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { getAllEntries } from "@/lib/storage";
import type { HabitEntry } from "@/types/entry";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import type { HeatmapFilter } from "@/components/CalendarHeatmap";
import DayDetail from "@/components/DayDetail";
import FilterSheet from "@/components/FilterSheet";
import FrequencyList, { type Period } from "@/components/FrequencyList";

export default function HistoryView() {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const now = new Date();
  const [viewedYear, setViewedYear] = useState(now.getFullYear());
  const [viewedMonth, setViewedMonth] = useState(now.getMonth());
  const [period, setPeriod] = useState<Period>("month");
  const [activeFilter, setActiveFilter] = useState<HeatmapFilter | null>(null);
  const [activeFilterLabel, setActiveFilterLabel] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleFilterSelect = (filter: HeatmapFilter | null, label?: string) => {
    setActiveFilter(filter);
    setActiveFilterLabel(label ?? "");
  };

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

      {/* ── Control row ──────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className={`max-w-[140px] truncate text-xs uppercase tracking-widest transition-colors ${
            activeFilter
              ? "text-amber-600 dark:text-amber-400"
              : "text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
          }`}
        >
          {activeFilter ? `${activeFilterLabel} ↓` : "All ↓"}
        </button>

        {/* Period selector */}
        <div className="flex gap-4">
          {(["month", "3m", "always"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`text-xs uppercase tracking-widest transition-colors ${
                period === p
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              }`}
            >
              {p === "month" ? "Month" : p === "3m" ? "3M" : "Always"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Frequency list ────────────────────────────────────── */}
      <FrequencyList
        entries={entries}
        period={period}
        viewedYear={viewedYear}
        viewedMonth={viewedMonth}
        activeFilter={activeFilter}
      />

      {/* ── Filter sheet ──────────────────────────────────────── */}
      {sheetOpen && (
        <FilterSheet
          onSelect={(f, label) => handleFilterSelect(f, label)}
          onClose={() => setSheetOpen(false)}
        />
      )}

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
