"use client";

import Link from "next/link";
import BlossomIcon from "@/components/BlossomIcon";
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

      {/* ── One entry a day ───────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className={SECTION_LABEL}>One entry a day</h2>
        <p className={BODY}>
          Clarity is built around a single daily record: the habits you chose,
          the moments that came, and a line or two about how it felt. There is
          no score to beat, no streak to protect, nothing to catch up on.
          Opening the form once at the end of the day is all that is needed.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── The daily form ────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className={SECTION_LABEL}>The daily form</h2>
        <p className={BODY}>
          Habits are deliberate — things you chose to do and track over time.
          Moments are unplanned — things that arrived and were worth noting.
          Reflection is yours to use however it fits: a sentence, a name,
          a passing thought.
        </p>
        <p className={`${BODY} mt-3`}>
          When a habit was done and it also felt good, the blossom marks that
          separately. Completion and joy are different things, and keeping them
          apart lets you see the difference over time.
        </p>
        <div className="mt-4 flex items-center gap-4 pl-0.5">
          <BlossomIcon filled={false} size={22} />
          <BlossomIcon filled={true} size={22} />
        </div>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Looking back ──────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className={SECTION_LABEL}>Looking back</h2>
        <p className={BODY}>
          Each day on the calendar carries two signals: how much was completed,
          and how much felt good. Cool tones show completion; warm tones show
          joy and moments. Days where both are strong find a color somewhere
          between.
        </p>
        <p className={`${BODY} mt-3`}>
          The list below the calendar shows how often each habit and moment
          appeared. Tap any item to filter the calendar to match. Any past
          day can be opened and edited.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Your data ─────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className={SECTION_LABEL}>Your data</h2>
        <p className={BODY}>
          Everything stays on your device. Export a backup from Settings before
          making large changes. Archive a habit or moment to remove it from the
          daily form without erasing its history.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Calma ─────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className={SECTION_LABEL}>Calma</h2>
        <p className={BODY}>
          The look and feel follows a quiet design system called Calma — warm
          tones, generous space, nothing competing for attention.
        </p>
        <a
          href="/clarity/calma-design-language.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition-colors"
        >
          Design language <Chevron direction="right" />
        </a>
      </section>

    </div>
  );
}
