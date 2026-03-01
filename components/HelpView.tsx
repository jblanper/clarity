"use client";

import Link from "next/link";
import Chevron from "@/components/Chevron";

const SECTION_LABEL =
  "mb-3 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500";

const BODY = "text-sm leading-relaxed text-stone-700 dark:text-stone-300";

export default function HelpView() {
  return (
    <div className="mx-auto max-w-md px-5 pb-12 pt-10">

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="mb-10 flex items-start justify-between">
        <h1 className="text-xl font-light tracking-widest text-stone-800 dark:text-stone-200">
          Help
        </h1>
        <Link
          href="/settings"
          className="mt-2 text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
        >
          <Chevron direction="left" /> Settings
        </Link>
      </header>

      {/* ── A Place for Clarity ───────────────────────────────────── */}
      <section className="mb-8">
        <h2 className={SECTION_LABEL}>A Place for Clarity</h2>
        <p className={BODY}>
          Clarity is a quiet space for daily noticing. It is built for a single 
          end-of-day entry: a record of the habits you chose, the moments that 
          arrived, and the reflections worth keeping. It is a tool for seeing 
          what your days are made of, without judgment or urgency.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Logging ───────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className={SECTION_LABEL}>Logging</h2>
        <p className={BODY}>
          Distinguish between intentional habits and unplanned moments to see 
          the balance of discipline and surprise. Mark habits with a joy blossom, 
          use custom steps for numeric counters, and set &quot;Joy by default&quot; in 
          Manage for activities that always lift your mood.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── History & Insights ────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className={SECTION_LABEL}>History & Insights</h2>
        <p className={BODY}>
          The heatmap blends habit completion (Dusk Blue) with emotional intensity 
          (Warm Ember). Any day in your history can be opened and edited at any 
          time. Tap any item in the list below the calendar to filter the view 
          and find correlations in your life.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Ownership & Archiving ─────────────────────────────────── */}
      <section className="mb-8">
        <h2 className={SECTION_LABEL}>Ownership & Archiving</h2>
        <p className={BODY}>
          Your data never leaves your device. Archive habits or moments to hide 
          them from your daily form without losing their historical records. 
          Use Settings to export backups, import data, or perform a factory 
          reset to start fresh.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Calma ─────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className={SECTION_LABEL}>Calma</h2>
        <p className={BODY}>
          Clarity follows the Calma system: warm tones, paper-like typography, 
          and zero urgency. No streaks, no scores, no guilt. Both full entries 
          and single lines of reflection are enough.
        </p>
      </section>

    </div>
  );
}
