"use client";

import Link from "next/link";
import Chevron from "@/components/Chevron";
import BlossomIcon from "@/components/BlossomIcon";
import { useState, useEffect, startTransition } from "react";
import { AnimatePresence, m } from "motion/react";
import {
  getConfigs,
  saveConfigs,
  DEFAULT_HABIT_CONFIGS,
  DEFAULT_MOMENT_CONFIGS,
  type AppConfigs,
  type HabitConfig,
} from "@/lib/habitConfig";

// ── Local state types ──────────────────────────────────────────────────────

interface EditingHabit {
  id: string;
  label: string;
  type: "boolean" | "numeric";
  unit: string;
  step: number;
  startAt?: number;
}

type AddHabitStep =
  | { stage: "type" }
  | { stage: "form-boolean"; label: string; joyByDefault: boolean }
  | { stage: "form-numeric"; label: string; unit: string; step: number; startAt?: number };

// ── Shared style constants ─────────────────────────────────────────────────

const ACTION_BTN =
  "text-xs text-stone-500 dark:text-stone-400 underline-offset-2 hover:underline transition-colors";

const ARCHIVE_BTN =
  "text-xs text-amber-700 dark:text-amber-500 underline-offset-2 hover:underline transition-colors";

const TRAY_ARCHIVE_BTN =
  "inline-flex items-center rounded-full border border-amber-300 dark:border-amber-700/50 px-3 py-1.5 text-xs text-amber-700 dark:text-amber-400 transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20";

const TRAY_JOY_BTN =
  "inline-flex items-center gap-1 rounded-full border border-stone-200 dark:border-stone-700 px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50";

const TRAY_JOY_ON_BTN =
  "inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700/50 px-3 py-1.5 text-xs text-amber-700 dark:text-amber-400 transition-colors hover:bg-amber-200 dark:hover:bg-amber-900/50";

const TEXT_INPUT =
  "w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600";

const SAVE_BTN =
  "rounded-xl bg-stone-800 dark:bg-stone-200 px-4 py-2 text-xs text-white dark:text-stone-900 transition-colors hover:bg-stone-700 dark:hover:bg-stone-300 disabled:opacity-40";

const CANCEL_BTN =
  "text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors";

const INLINE_FORM =
  "mb-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 px-4 py-4 space-y-3";

const FIELD_LABEL = "mb-1 block text-xs text-stone-500 dark:text-stone-400";

// ── ManageView ─────────────────────────────────────────────────────────────

export default function ManageView() {
  // Initialise with defaults so SSR and first client render match;
  // useEffect replaces with saved configs on mount.
  const [configs, setConfigs] = useState<AppConfigs>({
    habits: DEFAULT_HABIT_CONFIGS,
    moments: DEFAULT_MOMENT_CONFIGS,
  });

  const [editingHabit, setEditingHabit] = useState<EditingHabit | null>(null);
  const [addHabit, setAddHabit] = useState<AddHabitStep | null>(null);
  const [addingTag, setAddingTag] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState("");
  // Holds the ID of the most recently archived item to show the confirmation note
  const [justArchivedId, setJustArchivedId] = useState<string | null>(null);
  const [actionTrayId, setActionTrayId] = useState<string | null>(null);
  const [editingMomentId, setEditingMomentId] = useState<string | null>(null);
  const [editingMomentLabel, setEditingMomentLabel] = useState("");

  useEffect(() => {
    startTransition(() => setConfigs(getConfigs()));
  }, []);

  const activeHabits = configs.habits.filter((h) => !h.archived);
  const archivedHabits = configs.habits.filter((h) => h.archived);
  const activeTags = configs.moments.filter((m) => !m.archived);
  const archivedTags = configs.moments.filter((m) => m.archived);

  // ── Config helpers ─────────────────────────────────────────────────────

  function applyConfigs(next: AppConfigs) {
    saveConfigs(next);
    setConfigs(next);
  }

  function closeAllEditors() {
    setEditingHabit(null);
    setAddHabit(null);
    setAddingTag(false);
    setNewTagLabel("");
    setActionTrayId(null);
    setEditingMomentId(null);
    setEditingMomentLabel("");
  }

  // ── Habit actions ──────────────────────────────────────────────────────

  function startEditHabit(h: HabitConfig) {
    closeAllEditors();
    setJustArchivedId(null);
    setEditingHabit({
      id: h.id,
      label: h.label,
      type: h.type,
      unit: h.type === "numeric" ? h.unit : "",
      step: h.type === "numeric" ? h.step : 1,
      startAt: h.type === "numeric" ? h.startAt : undefined,
    });
  }

  function saveEditHabit() {
    if (!editingHabit) return;
    applyConfigs({
      ...configs,
      habits: configs.habits.map((h): HabitConfig => {
        if (h.id !== editingHabit.id) return h;
        if (h.type === "boolean") {
          return { id: h.id, label: editingHabit.label, type: "boolean", joyByDefault: h.joyByDefault, archived: h.archived };
        }
        return {
          id: h.id,
          label: editingHabit.label,
          type: "numeric",
          unit: editingHabit.unit,
          step: editingHabit.step,
          ...(editingHabit.startAt !== undefined && { startAt: editingHabit.startAt }),
          archived: h.archived,
        };
      }),
    });
    setEditingHabit(null);
  }

  function archiveMoment(id: string) {
    closeAllEditors();
    applyConfigs({
      ...configs,
      moments: configs.moments.map((m) =>
        m.id === id ? { ...m, archived: true } : m
      ),
    });
    setJustArchivedId(id);
  }

  function archiveHabit(id: string) {
    closeAllEditors();
    applyConfigs({
      ...configs,
      habits: configs.habits.map((h) =>
        h.id === id ? { ...h, archived: true } : h
      ),
    });
    setJustArchivedId(id);
  }

  function restoreHabit(id: string) {
    setJustArchivedId(null);
    applyConfigs({
      ...configs,
      habits: configs.habits.map((h) =>
        h.id === id ? { ...h, archived: false } : h
      ),
    });
  }

  function toggleJoyByDefault(id: string) {
    applyConfigs({
      ...configs,
      habits: configs.habits.map((h) =>
        h.id === id && h.type === "boolean" ? { ...h, joyByDefault: !h.joyByDefault } : h
      ),
    });
  }

  function saveNewHabit() {
    if (!addHabit || addHabit.stage === "type") return;
    const id = crypto.randomUUID();
    const newHabit: HabitConfig =
      addHabit.stage === "form-boolean"
        ? { id, label: addHabit.label.trim(), type: "boolean", joyByDefault: addHabit.joyByDefault, archived: false }
        : { id, label: addHabit.label.trim(), type: "numeric", unit: addHabit.unit.trim(), step: addHabit.step, ...(addHabit.startAt !== undefined && { startAt: addHabit.startAt }), archived: false };
    applyConfigs({ ...configs, habits: [...configs.habits, newHabit] });
    setAddHabit(null);
  }

  // ── Tag actions ────────────────────────────────────────────────────────

  function restoreTag(id: string) {
    setJustArchivedId(null);
    applyConfigs({
      ...configs,
      moments: configs.moments.map((m) =>
        m.id === id ? { ...m, archived: false } : m
      ),
    });
  }

  function saveNewTag() {
    if (!newTagLabel.trim()) return;
    const id = crypto.randomUUID();
    applyConfigs({
      ...configs,
      moments: [...configs.moments, { id, label: newTagLabel.trim(), archived: false }],
    });
    setAddingTag(false);
    setNewTagLabel("");
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-md px-5 pb-12 pt-10">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-light tracking-widest text-stone-800 dark:text-stone-200">
          Manage
        </h1>
        <Link
          href="/settings"
          className="flex min-h-[44px] items-center text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
        >
          <Chevron direction="left" /> Settings
        </Link>
      </header>

      {/* ── Habits ──────────────────────────────────────────────────── */}
      <section className="mb-6">
        <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
              Habits
            </h2>
            <button
              type="button"
              onClick={() => { closeAllEditors(); setAddHabit({ stage: "type" }); }}
              className="flex min-h-[44px] items-center text-xs text-stone-500 dark:text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
            >
              + New
            </button>
          </div>

          <div className="space-y-0.5">
          {/* Active habits */}
          {activeHabits.map((h) => (
            <div key={h.id}>
              {/* Resting row — full-width tap target */}
              <button
                type="button"
                aria-expanded={actionTrayId === h.id}
                onClick={() => {
                  if (actionTrayId === h.id) {
                    setActionTrayId(null);
                  } else {
                    closeAllEditors();
                    setActionTrayId(h.id);
                  }
                }}
                className={`flex w-full min-h-[44px] items-center gap-2 py-3 text-left transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl -mx-1 px-1 ${
                  actionTrayId === h.id ? "bg-stone-50 dark:bg-stone-800/50" : ""
                }`}
              >
                <span className={`text-sm ${actionTrayId === h.id ? "font-medium text-stone-800 dark:text-stone-100" : "text-stone-700 dark:text-stone-300"}`}>{h.label}</span>
                {h.type === "numeric" && (
                  <span className="text-xs text-stone-500 dark:text-stone-500">{h.unit}</span>
                )}
                {h.type === "boolean" && h.joyByDefault && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400">
                    Joy
                  </span>
                )}
                <span className="ml-auto text-stone-400 dark:text-stone-600 text-xs leading-none select-none">···</span>
              </button>

              {/* Action tray */}
              <AnimatePresence initial={false}>
                {actionTrayId === h.id && !editingHabit && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    style={{ overflow: "hidden" }}
                    className="mb-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 px-4 py-3 flex gap-3 flex-wrap"
                  >
                    <button type="button" onClick={() => startEditHabit(h)} className={ACTION_BTN}>Edit</button>
                    <button type="button" onClick={() => archiveHabit(h.id)} className={TRAY_ARCHIVE_BTN}>Archive</button>
                    {h.type === "boolean" && (
                      <button
                        type="button"
                        onClick={() => toggleJoyByDefault(h.id)}
                        className={h.joyByDefault ? TRAY_JOY_ON_BTN : TRAY_JOY_BTN}
                      >
                        <BlossomIcon filled={h.joyByDefault} size={14} />
                        Joy
                      </button>
                    )}
                  </m.div>
                )}
              </AnimatePresence>

              {/* Inline edit form */}
              <AnimatePresence initial={false}>
                {editingHabit?.id === h.id && (
                  <m.div
                    className={INLINE_FORM}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div>
                      <label className={FIELD_LABEL}>Label</label>
                      <input
                        type="text"
                        value={editingHabit.label}
                        onChange={(e) => setEditingHabit({ ...editingHabit, label: e.target.value })}
                        className={TEXT_INPUT}
                      />
                    </div>
                    {h.type === "numeric" && (
                      <>
                        <div>
                          <label className={FIELD_LABEL}>Unit</label>
                          <input
                            type="text"
                            value={editingHabit.unit}
                            onChange={(e) => setEditingHabit({ ...editingHabit, unit: e.target.value })}
                            className={TEXT_INPUT}
                          />
                        </div>
                        <div>
                          <label className={FIELD_LABEL}>Increment</label>
                          <input
                            type="number"
                            min={0.01}
                            step={0.01}
                            value={editingHabit.step}
                            onChange={(e) =>
                              setEditingHabit({ ...editingHabit, step: parseFloat(e.target.value) || 1 })
                            }
                            className={TEXT_INPUT}
                          />
                        </div>
                        <div>
                          <label className={FIELD_LABEL}>
                            Start at{editingHabit.unit ? ` · ${editingHabit.unit}` : ""}
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={editingHabit.step}
                            placeholder="Optional"
                            value={editingHabit.startAt ?? ""}
                            onChange={(e) =>
                              setEditingHabit({
                                ...editingHabit,
                                startAt: e.target.value === "" ? undefined : parseFloat(e.target.value),
                              })
                            }
                            className={TEXT_INPUT}
                          />
                        </div>
                      </>
                    )}
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={saveEditHabit}
                        disabled={!editingHabit.label.trim()}
                        className={SAVE_BTN}
                      >
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingHabit(null)} className={CANCEL_BTN}>
                        Cancel
                      </button>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Archived habits */}
          {archivedHabits.map((h) => (
            <div key={h.id}>
              <div className="flex items-center justify-between gap-2 py-2">
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="text-sm text-stone-500 dark:text-stone-500">{h.label}</span>
                  {h.type === "numeric" && (
                    <span className="text-xs text-stone-500 dark:text-stone-500">{h.unit}</span>
                  )}
                </div>
                <button type="button" onClick={() => restoreHabit(h.id)} className={ACTION_BTN}>
                  Restore
                </button>
              </div>
              {justArchivedId === h.id && (
                <p className="pb-1 text-xs text-stone-500 dark:text-stone-500">
                  Archived. Past entries are preserved.
                </p>
              )}
            </div>
          ))}
        </div>

          <AnimatePresence initial={false}>
          {addHabit?.stage === "type" && (
            <m.div
              className="mt-3 space-y-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <p className="text-xs text-stone-500 dark:text-stone-400">What kind of habit?</p>
              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={() => setAddHabit({ stage: "form-boolean", label: "", joyByDefault: false })}
                  className="text-sm text-stone-600 dark:text-stone-300 underline-offset-4 hover:underline"
                >
                  Yes / No
                </button>
                <button
                  type="button"
                  onClick={() => setAddHabit({ stage: "form-numeric", label: "", unit: "", step: 1 })}
                  className="text-sm text-stone-600 dark:text-stone-300 underline-offset-4 hover:underline"
                >
                  Number
                </button>
              </div>
              <button type="button" onClick={() => setAddHabit(null)} className={CANCEL_BTN}>
                Cancel
              </button>
            </m.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
        {(addHabit?.stage === "form-boolean" || addHabit?.stage === "form-numeric") && (
          <m.div
            className={`mt-3 ${INLINE_FORM}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div>
              <label className={FIELD_LABEL}>Label</label>
              <input
                type="text"
                placeholder={addHabit.stage === "form-boolean" ? "e.g. Stretching" : "e.g. Running"}
                value={addHabit.label}
                onChange={(e) => setAddHabit({ ...addHabit, label: e.target.value })}
                className={TEXT_INPUT}
              />
            </div>
            {addHabit.stage === "form-boolean" && (
              <div>
                <label className={FIELD_LABEL}>Joy by default</label>
                <button
                  type="button"
                  onClick={() =>
                    setAddHabit({ ...addHabit, joyByDefault: !addHabit.joyByDefault })
                  }
                  className="self-start text-left transition-colors"
                >
                  <span className={`flex items-center gap-1 text-xs ${addHabit.joyByDefault ? "text-amber-600 dark:text-amber-500" : "text-stone-500"}`}>
                    <BlossomIcon filled={addHabit.joyByDefault} size={16} />
                    {addHabit.joyByDefault ? "Brings joy by default" : "Joy is marked separately"}
                  </span>
                </button>
              </div>
            )}
            {addHabit.stage === "form-numeric" && (
              <>
                <div>
                  <label className={FIELD_LABEL}>Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. km, pages, cups"
                    value={addHabit.unit}
                    onChange={(e) => setAddHabit({ ...addHabit, unit: e.target.value })}
                    className={TEXT_INPUT}
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>Increment</label>
                  <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={addHabit.step}
                    onChange={(e) =>
                      setAddHabit({ ...addHabit, step: parseFloat(e.target.value) || 1 })
                    }
                    className={TEXT_INPUT}
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL}>
                    Start at{addHabit.unit ? ` · ${addHabit.unit}` : ""}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={addHabit.step}
                    placeholder="Optional"
                    value={addHabit.startAt ?? ""}
                    onChange={(e) =>
                      setAddHabit({
                        ...addHabit,
                        startAt: e.target.value === "" ? undefined : parseFloat(e.target.value),
                      })
                    }
                    className={TEXT_INPUT}
                  />
                </div>
              </>
            )}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={saveNewHabit}
                disabled={
                  !addHabit.label.trim() ||
                  (addHabit.stage === "form-numeric" && !addHabit.unit.trim())
                }
                className={SAVE_BTN}
              >
                Add
              </button>
              <button type="button" onClick={() => setAddHabit(null)} className={CANCEL_BTN}>
                Cancel
              </button>
            </div>
          </m.div>
        )}
        </AnimatePresence>
        </div>
      </section>

      {/* ── Moments ─────────────────────────────────────────────────── */}
      <section className="mb-6">
        <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
              Moments
            </h2>
            <button
              type="button"
              onClick={() => { closeAllEditors(); setAddingTag(true); }}
              className="flex min-h-[44px] items-center text-xs text-stone-500 dark:text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
            >
              + New
            </button>
          </div>

          {/* Active tags — chip grid */}
          <div className="flex flex-wrap gap-2 py-2">
            {activeTags.map((t) =>
              editingMomentId === t.id ? (
                <div key={t.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingMomentLabel}
                    onChange={(e) => setEditingMomentLabel(e.target.value)}
                    className={`${TEXT_INPUT} w-32`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editingMomentLabel.trim()) {
                        applyConfigs({
                          ...configs,
                          moments: configs.moments.map((m) =>
                            m.id === editingMomentId ? { ...m, label: editingMomentLabel.trim() } : m
                          ),
                        });
                      }
                      setEditingMomentId(null);
                      setEditingMomentLabel("");
                    }}
                    disabled={!editingMomentLabel.trim()}
                    className={SAVE_BTN}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingMomentId(null); setEditingMomentLabel(""); }}
                    className={CANCEL_BTN}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => archiveMoment(t.id)}
                    className={ARCHIVE_BTN}
                  >
                    Archive
                  </button>
                </div>
              ) : (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    closeAllEditors();
                    setEditingMomentId(t.id);
                    setEditingMomentLabel(t.label);
                  }}
                  className="min-h-[44px] flex items-center rounded-full border border-stone-200 dark:border-stone-700 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800"
                >
                  {t.label}
                </button>
              )
            )}
          </div>

          <div className="space-y-0.5">

          {/* Archived tags */}
          {archivedTags.map((t) => (
            <div key={t.id}>
              <div className="flex items-center justify-between gap-2 py-2">
                <span className="text-sm text-stone-500 dark:text-stone-500">{t.label}</span>
                <button type="button" onClick={() => restoreTag(t.id)} className={ACTION_BTN}>
                  Restore
                </button>
              </div>
              {justArchivedId === t.id && (
                <p className="pb-1 text-xs text-stone-500 dark:text-stone-500">
                  Archived. Past entries are preserved.
                </p>
              )}
            </div>
          ))}
          </div>

          <AnimatePresence initial={false}>
          {addingTag && (
            <m.div
              className={`mt-3 ${INLINE_FORM}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <div>
                <label className={FIELD_LABEL}>Label</label>
                <input
                  type="text"
                  placeholder="e.g. Long walk"
                  value={newTagLabel}
                  onChange={(e) => setNewTagLabel(e.target.value)}
                  className={TEXT_INPUT}
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={saveNewTag}
                  disabled={!newTagLabel.trim()}
                  className={SAVE_BTN}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingTag(false);
                    setNewTagLabel("");
                  }}
                  className={CANCEL_BTN}
                >
                  Cancel
                </button>
              </div>
            </m.div>
          )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
