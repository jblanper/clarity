"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllEntries } from "@/lib/storage";
import type { HabitEntry } from "@/types/entry";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import DayDetail from "@/components/DayDetail";

export default function HistoryView() {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getAllEntries());
  }, []);

  // When returning from the edit page (/history?open=YYYY-MM-DD),
  // auto-reopen the DayDetail for that date, then clean the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openDate = params.get("open");
    if (openDate) {
      setSelectedDate(openDate);
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
          href="/settings?back=/history"
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
      />

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
