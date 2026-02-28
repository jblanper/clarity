"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveEntry, getEntry, sanitizeHabitState } from "@/lib/storage";
import {
  getConfigs,
  DEFAULT_HABIT_CONFIGS,
  DEFAULT_MOMENT_CONFIGS,
  type AppConfigs,
  type BooleanHabitConfig,
  type NumericHabitConfig,
} from "@/lib/habitConfig";
import type { HabitEntry, HabitState } from "@/types/entry";
import HabitToggle from "@/components/HabitToggle";
import NumberStepper from "@/components/NumberStepper";
import MomentChip from "@/components/MomentChip";

interface Props {
  /** When provided, the form runs in edit mode for that specific date. */
  date?: string;
}

type SaveState = "idle" | "saving" | "confirmed";

type FormFields = {
  habits: Record<string, HabitState>;
  numeric: Record<string, number>;
  moments: string[];
  reflection: string;
};

const emptyFields: FormFields = {
  habits: {},
  numeric: {},
  moments: [],
  reflection: "",
};

/** Returns today's date as a YYYY-MM-DD string in local time. */
function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Formats a YYYY-MM-DD string as a human-readable date, e.g. "Tuesday, February 25". */
function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

/** Returns just the day name for the edit-mode primary title, e.g. "Monday". */
function formatEditDayName(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return WEEKDAYS[new Date(year, month - 1, day).getDay()];
}

/** Returns the date subtitle for edit mode, e.g. "24 February 2026". */
function formatEditSubtitle(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Extracts mutable form fields from a saved HabitEntry. */
function toFormFields(entry: HabitEntry): FormFields {
  return {
    habits: { ...entry.habits },
    numeric: { ...entry.numeric },
    moments: [...entry.moments],
    reflection: entry.reflection,
  };
}

export default function CheckInForm({ date }: Props) {
  const router = useRouter();
  const isEditMode = !!date;
  const today = getTodayDate();
  const targetDate = date ?? today;

  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  // Initialise with defaults so first render matches SSR; updated on mount.
  const [configs, setConfigs] = useState<AppConfigs>({
    habits: DEFAULT_HABIT_CONFIGS,
    moments: DEFAULT_MOMENT_CONFIGS,
  });

  useEffect(() => {
    startTransition(() => setConfigs(getConfigs()));
  }, []);

  // Pre-populate form with any existing entry for the target date
  useEffect(() => {
    const existing = getEntry(targetDate);
    if (existing !== null) {
      startTransition(() => setFields(toFormFields(existing)));
    }
  }, [targetDate]);

  const activeBoolean = configs.habits.filter(
    (h): h is BooleanHabitConfig => h.type === "boolean" && !h.archived
  );
  const activeNumeric = configs.habits.filter(
    (h): h is NumericHabitConfig => h.type === "numeric" && !h.archived
  );
  const activeMoments = configs.moments.filter((m) => !m.archived);

  const setHabit = (id: string, state: HabitState) => {
    setFields((prev) => ({
      ...prev,
      habits: { ...prev.habits, [id]: state },
    }));
  };

  const setNumericHabit = (id: string, value: number) => {
    setFields((prev) => ({
      ...prev,
      numeric: { ...prev.numeric, [id]: value },
    }));
  };

  const toggleMoment = (id: string) => {
    setFields((prev) => ({
      ...prev,
      moments: prev.moments.includes(id)
        ? prev.moments.filter((m) => m !== id)
        : [...prev.moments, id],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveState !== "idle") return;

    setSaveState("saving");

    // Apply joy→done constraint to every habit state before persisting
    const sanitizedHabits: Record<string, HabitState> = {};
    for (const [id, state] of Object.entries(fields.habits)) {
      sanitizedHabits[id] = sanitizeHabitState(state);
    }

    const entry: HabitEntry = {
      date: targetDate,
      habits: sanitizedHabits,
      numeric: fields.numeric,
      moments: fields.moments,
      reflection: fields.reflection,
    };

    if (isEditMode) {
      entry.lastEdited = new Date().toISOString();
    }

    // Defer save to next tick so "Saving..." renders before the write
    setTimeout(() => {
      saveEntry(entry);
      setSaveState("confirmed");

      // Redirect 1200ms after confirmation
      const destination = isEditMode
        ? `/history?open=${targetDate}`
        : "/history";
      setTimeout(() => router.push(destination), 1200);
    }, 0);
  };

  return (
    <form onSubmit={handleSave} className={`mx-auto max-w-md px-5 pt-10 ${isEditMode ? "pb-12" : "pb-28"}`}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-light tracking-widest text-stone-800 dark:text-stone-200">
            {isEditMode ? formatEditDayName(targetDate) : "Today"}
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-500">
            {isEditMode ? formatEditSubtitle(targetDate) : formatDisplayDate(today)}
          </p>
        </div>
        {isEditMode ? (
          <Link
            href="/history"
            className="mt-2 text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
          >
            ← history
          </Link>
        ) : (
          <Link
            href="/settings"
            onClick={() => sessionStorage.setItem("settings-back", "/")}
            className="mt-2 text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
          >
            Settings
          </Link>
        )}
      </header>

      {/* ── Boolean habits ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          Habits
        </h2>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {activeBoolean.map((h) => (
            <HabitToggle
              key={h.id}
              label={h.label}
              value={fields.habits[h.id] ?? { done: false, joy: false }}
              joyByDefault={h.joyByDefault}
              onChange={(state) => setHabit(h.id, state)}
            />
          ))}
        </div>
      </section>

      {/* ── Numeric habits ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          By the numbers
        </h2>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {activeNumeric.map((h) => (
            <NumberStepper
              key={h.id}
              label={h.label}
              unit={h.unit}
              value={fields.numeric[h.id] ?? 0}
              step={h.step}
              onChange={(value) => setNumericHabit(h.id, value)}
            />
          ))}
        </div>
      </section>

      {/* ── Moments ────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          Moments
        </h2>
        <div className="flex flex-wrap gap-2">
          {activeMoments.map((m) => (
            <MomentChip
              key={m.id}
              label={m.label}
              selected={fields.moments.includes(m.id)}
              onToggle={() => toggleMoment(m.id)}
            />
          ))}
        </div>
      </section>

      {/* ── Reflection ─────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          Reflection
        </h2>
        <textarea
          value={fields.reflection}
          onChange={(e) =>
            setFields((prev) => ({ ...prev, reflection: e.target.value }))
          }
          placeholder="Anything about today worth remembering?"
          rows={4}
          className="w-full resize-none rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-3 text-stone-700 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-600 focus:border-stone-500 dark:focus:border-stone-500 focus:outline-none"
        />
      </section>

      {/* ── Save ───────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={saveState !== "idle"}
        className={`w-full rounded-2xl py-4 text-sm tracking-widest transition-colors duration-500 ${
          saveState === "confirmed"
            ? "bg-stone-300 text-stone-700 dark:bg-stone-700 dark:text-stone-300"
            : "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-300 active:bg-stone-900 dark:active:bg-stone-100"
        }`}
      >
        {saveState === "saving"
          ? "Saving..."
          : saveState === "confirmed"
            ? "Day captured"
            : "Save"}
      </button>

    </form>
  );
}
