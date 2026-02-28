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

      {/* ── What is Clarity ───────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className={SECTION_LABEL}>What is Clarity</h2>
        <p className={BODY}>
          Clarity is a personal daily tracker for habits, numbers, moments, and
          reflections. It is designed to be used in the evening — a quiet
          end-of-day ritual rather than an all-day monitor. The goal is not to
          optimise or perform, but to notice: what you did, what brought you
          joy, what felt worth remembering.
        </p>
        <p className={`${BODY} mt-4`}>
          Over time, the entries build into something like a diary — a record of
          what your days were actually made of.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Habits and Moments ────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className={SECTION_LABEL}>Habits and Moments</h2>
        <p className={BODY}>
          The most important distinction in Clarity is between a Habit and a
          Moment.
        </p>
        <p className={`${BODY} mt-4`}>
          A Habit is something intentional and recurring — an action you chose
          to do, or tried to do. Meditating, exercising, reading, journalling.
          Habits repeat by design. Some days you do them out of discipline,
          other days they genuinely lift your mood. Clarity captures both.
        </p>
        <p className={`${BODY} mt-4`}>
          A Moment is something unplanned that brought joy — something that
          happened to you rather than something you set out to do. A good meal,
          an interesting conversation, time in nature, an inspiring piece of
          music. Moments don&apos;t repeat on a schedule. They arrive.
        </p>
        <p className={`${BODY} mt-4`}>
          The distinction matters because mixing them up flattens the picture.
          Discipline and delight are both worth tracking, but they&apos;re different
          things.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── The Joy Layer ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className={SECTION_LABEL}>The Joy Layer</h2>
        <p className={BODY}>
          Boolean habits — the ones you either did or didn&apos;t do — have a third
          state beyond done and not done: done with joy. A heart indicator on
          the check-in form captures this. When a habit is done, an outlined
          heart appears. Tapping it marks the habit as done with joy.
        </p>
        <p className={`${BODY} mt-4`}>
          Some habits default to joy (like Meditation or Reading), others
          default to done without joy (like Exercise or Journalling). You can
          change the default for any habit in Manage, and you can always
          override it on any given day.
        </p>
        <p className={`${BODY} mt-4`}>
          The distinction is honest. Some days meditation is a delight. Other
          days it is a discipline. Both are valid. Both are worth knowing.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Numeric Habits ────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className={SECTION_LABEL}>Numeric Habits</h2>
        <p className={BODY}>
          Some things are better tracked with a number — hours of sleep, cups
          of coffee, pages read. Numeric habits use a stepper with a unit
          label. Each one has a custom step size so the increments feel natural
          for what you&apos;re counting.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── The History View ──────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className={SECTION_LABEL}>The History View</h2>
        <p className={BODY}>
          The History page shows a calendar heatmap of your entries. Days are
          coloured by a blend of two signals: how many habits you completed, and
          how many moments you experienced. Tapping any day opens a detail view
          showing everything logged for that day.
        </p>
        <p className={`${BODY} mt-4`}>
          Any past entry — or future one — can be edited. There is no
          restriction. Clarity is a private tool with no leaderboard to game.
          Life happens: you forget to log, you travel, you remember something at
          2am. A last-edited timestamp appears on edited entries, quietly,
          without judgement.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Your Data ─────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className={SECTION_LABEL}>Your Data</h2>
        <p className={BODY}>
          Everything is stored on your device. Nothing is sent anywhere. You
          can export a full backup as a JSON file at any time from Settings, and
          import it again if you change devices or want to keep a local copy.
          The file is human-readable and can be opened in any text editor.
        </p>
        <p className={`${BODY} mt-4`}>
          Nothing in Clarity is ever permanently deleted. Habits and moments you
          no longer want on your check-in form can be archived — they disappear
          from the form but remain in all past entries. You can restore them at
          any time from Manage.
        </p>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── A Note on Design ──────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className={SECTION_LABEL}>A Note on Design</h2>
        <p className={BODY}>
          Clarity was designed to feel like opening a beloved notebook — warm,
          unhurried, personal. There are no streaks, no badges, no reminders,
          no scores. The app does not reward you for using it and does not
          punish you for stepping away.
        </p>
        <p className={`${BODY} mt-4`}>
          Some days are full entries. Some days are a single moment and a line
          of reflection. Both are enough.
        </p>
      </section>

    </div>
  );
}
