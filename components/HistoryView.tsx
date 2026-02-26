"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllEntries } from "@/lib/storage";
import type { HabitEntry } from "@/types/entry";
import CalendarHeatmap from "@/components/CalendarHeatmap";

export default function HistoryView() {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getAllEntries());
  }, []);

  const handleDayClick = (date: string) => {
    // Toggle selection: tapping an already-selected date deselects it
    setSelectedDate((prev) => (prev === date ? null : date));
  };

  return (
    <div className="mx-auto max-w-md px-5 pt-10 pb-12">

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="mb-6 flex items-center gap-4">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 transition-colors hover:text-stone-600 dark:hover:text-stone-300"
        >
          ← today
        </Link>
        <h1 className="text-xl font-light tracking-widest text-stone-800 dark:text-stone-200">
          History
        </h1>
      </header>

      {/* ── Heatmap ───────────────────────────────────────────── */}
      <CalendarHeatmap
        entries={entries}
        selectedDate={selectedDate}
        onDayClick={handleDayClick}
      />

    </div>
  );
}
