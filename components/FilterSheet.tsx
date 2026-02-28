"use client";

import { useState, useEffect, startTransition } from "react";
import {
  getConfigs,
  DEFAULT_HABIT_CONFIGS,
  DEFAULT_MOMENT_CONFIGS,
  type AppConfigs,
} from "@/lib/habitConfig";
import type { HeatmapFilter } from "@/components/CalendarHeatmap";

interface Props {
  onSelect: (filter: HeatmapFilter | null, label?: string) => void;
  onClose: () => void;
}

export default function FilterSheet({ onSelect, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [configs, setConfigs] = useState<AppConfigs>({
    habits: DEFAULT_HABIT_CONFIGS,
    moments: DEFAULT_MOMENT_CONFIGS,
  });

  useEffect(() => {
    startTransition(() => setConfigs(getConfigs()));
  }, []);

  // Trigger slide-up on next tick so the CSS transition fires from the initial state
  useEffect(() => {
    const id = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(id);
  }, []);

  // Prevent body scroll while the sheet is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSelect = (filter: HeatmapFilter | null, label?: string) => {
    onSelect(filter, label);
    handleClose();
  };

  const activeHabits = configs.habits.filter((h) => !h.archived);
  const activeMoments = configs.moments.filter((m) => !m.archived);

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Filter by habit or moment"
      className="fixed inset-0 z-50"
    >
      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <div
        style={{ opacity: isVisible ? 1 : 0 }}
        className="absolute inset-0 bg-black/30 dark:bg-black/50 transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden
      />

      {/* ── Sheet ─────────────────────────────────────────────────── */}
      <div
        style={{ transform: isVisible ? "translateY(0)" : "translateY(100%)" }}
        className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-background transition-transform duration-300 ease-out"
      >
        {/* Sticky close row */}
        <div className="sticky top-0 z-10 bg-background px-5 pt-5 pb-1">
          <div className="mx-auto flex max-w-md justify-end">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="flex min-h-[44px] min-w-[44px] items-center justify-end text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-md px-6 pb-10">
          <p className="mb-4 text-xs uppercase tracking-widest text-stone-500">Filter</p>

          {/* All */}
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className="flex min-h-[44px] w-full items-center text-sm text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
          >
            All
          </button>

          {/* Habits */}
          {activeHabits.length > 0 && (
            <>
              <p className="mt-4 mb-2 text-xs uppercase tracking-widest text-stone-500">Habits</p>
              {activeHabits.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() =>
                    handleSelect(
                      { type: h.type === "boolean" ? "boolean-habit" : "numeric-habit", id: h.id },
                      h.label,
                    )
                  }
                  className="flex min-h-[44px] w-full items-center text-sm text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
                >
                  {h.label}
                </button>
              ))}
            </>
          )}

          {/* Moments */}
          {activeMoments.length > 0 && (
            <>
              <p className="mt-4 mb-2 text-xs uppercase tracking-widest text-stone-500">Moments</p>
              {activeMoments.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelect({ type: "moment", id: m.id }, m.label)}
                  className="flex min-h-[44px] w-full items-center text-sm text-amber-700 dark:text-amber-400 transition-colors hover:text-amber-800 dark:hover:text-amber-300"
                >
                  {m.label}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
