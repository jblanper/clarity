"use client";

import { useState, useEffect, useLayoutEffect, startTransition } from "react";
import Link from "next/link";
import type { HabitEntry } from "@/types/entry";
import BlossomIcon from "@/components/BlossomIcon";
import {
  getConfigs,
  DEFAULT_HABIT_CONFIGS,
  DEFAULT_MOMENT_CONFIGS,
  type AppConfigs,
  type NumericHabitConfig,
} from "@/lib/habitConfig";

interface Props {
  date: string;
  entry: HabitEntry | null;
  onClose: () => void;
}

const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Formats "YYYY-MM-DD" as "Monday, 25 February 2026". */
function formatDetailDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Formats an ISO timestamp as "Mon 24 Feb". */
function formatLastEdited(isoString: string): string {
  const d = new Date(isoString);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const month   = d.toLocaleDateString("en-GB", { month: "short" });
  return `${weekday} ${d.getDate()} ${month}`;
}

export default function DayDetail({ date, entry, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  // Initialise with defaults so first render matches SSR; updated on mount.
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

  // Prevent body scroll while the sheet is open.
  // useLayoutEffect ensures cleanup runs synchronously during navigation so the
  // lock is never left behind when the user switches pages mid-animation.
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Animate out, then notify parent to unmount
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // Build id → config lookup maps. Includes archived habits so historical
  // entries display correctly. Unknown IDs (e.g. from imported backups) fall
  // back to the raw ID string rather than being silently dropped.
  const booleanHabitMap = new Map(
    configs.habits
      .filter((h) => h.type === "boolean")
      .map((h) => [h.id, h])
  );
  const numericHabitMap = new Map(
    configs.habits
      .filter((h): h is NumericHabitConfig => h.type === "numeric")
      .map((h) => [h.id, h])
  );
  const momentMap = new Map(configs.moments.map((m) => [m.id, m.label]));

  // Derive display-ready slices by iterating the stored IDs in the entry,
  // not the config list — this ensures unknown IDs are still surfaced.
  const checkedHabits = entry
    ? Object.entries(entry.habits)
        .filter(([, state]) => state.done)
        .map(([id, state]) => ({ id, label: booleanHabitMap.get(id)?.label ?? id, joy: state.joy }))
    : [];
  const loggedNumbers = entry
    ? Object.entries(entry.numeric)
        .filter(([, value]) => value > 0)
        .map(([id, value]) => ({
          id,
          label: numericHabitMap.get(id)?.label ?? id,
          unit: numericHabitMap.get(id)?.unit ?? "",
          value,
        }))
    : [];
  const resolvedMoments = entry
    ? entry.moments.map((id) => momentMap.get(id) ?? id)
    : [];
  const reflection = entry?.reflection ?? "";

  const hasNothingLogged =
    !entry ||
    (checkedHabits.length === 0 &&
      loggedNumbers.length === 0 &&
      resolvedMoments.length === 0 &&
      !reflection);

  return (
    <div
      role="dialog"
      aria-modal
      aria-label={`Details for ${date}`}
      className="fixed inset-0 z-50"
    >
      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <div
        style={{ opacity: isVisible ? 1 : 0 }}
        className="daydetail-backdrop absolute inset-0 bg-black/30 dark:bg-black/50 transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden
      />

      {/* ── Sheet ─────────────────────────────────────────────────── */}
      {/* Using inline style for transform to avoid Tailwind v4 CSS-variable
          transform pipeline issues (same reason toggle uses explicit left-X). */}
      <div
        style={{ transform: isVisible ? "translateY(0)" : "translateY(100%)" }}
        className="daydetail-sheet absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-background transition-transform duration-300 ease-out"
      >
        {/* ── Close button — sticky so it stays reachable when content scrolls */}
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

        {/* ── Content ────────────────────────────────────────────── */}
        <div className="mx-auto max-w-md px-6 pb-10">

          {/* Date heading */}
          <h2 className="mb-6 text-base font-light tracking-widest text-stone-800 dark:text-stone-200">
            {formatDetailDate(date)}
          </h2>

          {hasNothingLogged ? (
            <p className="py-8 text-center text-stone-500 dark:text-stone-500">
              Nothing here yet
            </p>
          ) : (
            <>
              {/* Highlights — joy-marked habits */}
              {checkedHabits.some((h) => h.joy) && (
                <section className="mb-6 bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900/30 rounded-2xl px-4 py-4">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
                    Highlights
                  </h3>
                  <div className="space-y-1.5">
                    {checkedHabits
                      .filter((h) => h.joy)
                      .map((h) => (
                        <div key={h.id} className="flex items-center gap-2">
                          <BlossomIcon filled={true} size={16} />
                          <span className="text-sm text-stone-700 dark:text-stone-300">{h.label}</span>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Boolean habits — only checked ones */}
              {checkedHabits.length > 0 && (
                <section className="mb-6">
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
                    Habits
                  </h3>
                  <div className="space-y-1">
                    {checkedHabits.map((h) => (
                      <div key={h.id} className="flex items-center gap-2">
                        <span className="text-sm text-amber-600 dark:text-amber-400">✓</span>
                        <span className="text-sm text-stone-700 dark:text-stone-300">{h.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Numeric habits — only fields with a value > 0 */}
              {loggedNumbers.length > 0 && (
                <section className="mb-6">
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
                    Numbers
                  </h3>
                  <div className="space-y-1">
                    {loggedNumbers.map((h) => (
                      <div key={h.id} className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-stone-800 dark:text-stone-200">
                          {h.value}
                        </span>
                        <span className="text-xs text-stone-500 dark:text-stone-500">{h.unit}</span>
                        <span className="text-sm text-stone-600 dark:text-stone-400">{h.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Moments — resolved from UUIDs to labels */}
              {resolvedMoments.length > 0 && (
                <section className="mb-6">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
                    Moments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resolvedMoments.map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border dark:border-amber-700/40 dark:text-amber-300 px-3 py-1.5 text-sm"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Reflection — only when non-empty */}
              {reflection && (
                <section className="mb-6">
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
                    Reflection
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-stone-700 dark:text-stone-300">
                    {reflection}
                  </p>
                </section>
              )}
            </>
          )}

          {/* Edit — navigates to the edit page for this date */}
          <div className="mt-4">
            <Link
              href={`/edit?date=${date}`}
              className="inline-flex items-center rounded-xl border border-stone-200 dark:border-stone-700 px-4 py-2 text-xs text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
            >
              Edit this day
            </Link>
          </div>

          {/* Last edited — only when the timestamp is present */}
          {entry?.lastEdited && (
            <p className="mt-3 text-xs text-stone-500 dark:text-stone-500">
              Last edited {formatLastEdited(entry.lastEdited)}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
