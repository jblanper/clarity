"use client";

import { useState, useEffect, startTransition } from "react";
import type { HabitEntry } from "@/types/entry";
import {
  getConfigs,
  DEFAULT_HABIT_CONFIGS,
  DEFAULT_MOMENT_CONFIGS,
  type AppConfigs,
} from "@/lib/habitConfig";

export type Period = "month" | "3m" | "always";

interface Props {
  entries: HabitEntry[];
  period: Period;
  viewedYear: number;
  viewedMonth: number;
}

interface FrequencyItem {
  id: string;
  label: string;
  type: "habit" | "moment";
  count: number;
}

export default function FrequencyList({ entries, period, viewedYear, viewedMonth }: Props) {
  const [configs, setConfigs] = useState<AppConfigs>({
    habits: DEFAULT_HABIT_CONFIGS,
    moments: DEFAULT_MOMENT_CONFIGS,
  });

  useEffect(() => {
    startTransition(() => setConfigs(getConfigs()));
  }, []);

  // Filter entries by period
  const filtered = (() => {
    if (period === "always") return entries;

    if (period === "month") {
      const mm = String(viewedMonth + 1).padStart(2, "0");
      const prefix = `${viewedYear}-${mm}`;
      return entries.filter((e) => e.date.startsWith(prefix));
    }

    // "3m": current month and the two months before it (always relative to today)
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-01`;
    return entries.filter((e) => e.date >= startStr);
  })();

  // Count occurrences per UUID
  const counts = new Map<string, number>();
  for (const entry of filtered) {
    for (const [id, state] of Object.entries(entry.habits)) {
      if (state.done) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    for (const [id, value] of Object.entries(entry.numeric)) {
      if (value > 0) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    for (const id of entry.moments) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  const habitMap = new Map(configs.habits.map((h) => [h.id, h.label]));
  const momentMap = new Map(configs.moments.map((m) => [m.id, m.label]));

  const items: FrequencyItem[] = [];
  for (const [id, count] of counts.entries()) {
    if (habitMap.has(id)) {
      items.push({ id, label: habitMap.get(id)!, type: "habit", count });
    } else if (momentMap.has(id)) {
      items.push({ id, label: momentMap.get(id)!, type: "moment", count });
    }
  }
  items.sort((a, b) => b.count - a.count);

  const maxCount = items[0]?.count ?? 1;

  return (
    <div className="mt-8">
      <p className="mb-4 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
        Frequency
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-stone-500 dark:text-stone-500">
          Nothing logged in this period
        </p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="py-3">
              <span
                className={`text-sm ${
                  item.type === "moment"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-stone-700 dark:text-stone-300"
                }`}
              >
                {item.label}
              </span>
              <div className="mt-1.5 h-0.5 w-full rounded-full bg-stone-100 dark:bg-stone-800">
                <div
                  className={`h-full rounded-full ${
                    item.type === "moment"
                      ? "bg-amber-400 dark:bg-amber-500"
                      : "bg-stone-400 dark:bg-stone-600"
                  }`}
                  style={{ width: `${Math.round((item.count / maxCount) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
