"use client";

import Link from "next/link";
import { useState, useEffect, startTransition } from "react";
import {
  getConfigs,
  saveConfigs,
  DEFAULT_HABIT_CONFIGS,
  DEFAULT_MOMENT_CONFIGS,
  type AppConfigs,
  type HabitConfig,
  type MomentConfig,
} from "@/lib/habitConfig";

// ── Local state types ──────────────────────────────────────────────────────

interface EditingHabit {
  id: string;
  label: string;
  type: "boolean" | "numeric";
  unit: string;
  step: number;
}

interface EditingTag {
  id: string;
  label: string;
}

type AddHabitStep =
  | { stage: "type" }
  | { stage: "form-boolean"; label: string; joyByDefault: boolean }
  | { stage: "form-numeric"; label: string; unit: string; step: number };

// ── Shared style constants ─────────────────────────────────────────────────

const ACTION_BTN =
  "text-xs text-stone-500 dark:text-stone-400 underline-offset-2 hover:underline transition-colors";

const ARCHIVE_BTN =
  "text-xs text-amber-700 dark:text-amber-500 underline-offset-2 hover:underline transition-colors";

const TEXT_INPUT =
  "w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600";

const SAVE_BTN =
  "rounded-xl bg-stone-800 dark:bg-stone-200 px-4 py-2 text-xs text-white dark:text-stone-900 transition-colors hover:bg-stone-700 dark:hover:bg-stone-300 disabled:opacity-40";

const CANCEL_BTN =
  "text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors";

const INLINE_FORM =
  "mb-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 px-4 py-4 space-y-3";

const FIELD_LABEL = "mb-1 block text-xs text-stone-500 dark:text-stone-400";

const SECTION_LABEL =
  "mb-3 text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500";

// ── ManageView ─────────────────────────────────────────────────────────────

export default function ManageView() {
  // Initialise with defaults so SSR and first client render match;
  // useEffect replaces with saved configs on mount.
  const [configs, setConfigs] = useState<AppConfigs>({
    habits: DEFAULT_HABIT_CONFIGS,
    moments: DEFAULT_MOMENT_CONFIGS,
  });

  const [editingHabit, setEditingHabit] = useState<EditingHabit | null>(null);
  const [editingTag, setEditingTag] = useState<EditingTag | null>(null);
  const [addHabit, setAddHabit] = useState<AddHabitStep | null>(null);
  const [addingTag, setAddingTag] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState("");
  // Holds the ID of the most recently archived item to show the confirmation note
  const [justArchivedId, setJustArchivedId] = useState<string | null>(null);

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
    setEditingTag(null);
    setAddHabit(null);
    setAddingTag(false);
    setNewTagLabel("");
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
          archived: h.archived,
        };
      }),
    });
    setEditingHabit(null);
  }

  function archiveHabit(id: string) {
    setEditingHabit(null);
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
        : { id, label: addHabit.label.trim(), type: "numeric", unit: addHabit.unit.trim(), step: addHabit.step, archived: false };
    applyConfigs({ ...configs, habits: [...configs.habits, newHabit] });
    setAddHabit(null);
  }

  // ── Tag actions ────────────────────────────────────────────────────────

  function startEditTag(t: MomentConfig) {
    closeAllEditors();
    setJustArchivedId(null);
    setEditingTag({ id: t.id, label: t.label });
  }

  function saveEditTag() {
    if (!editingTag) return;
    applyConfigs({
      ...configs,
      moments: configs.moments.map((m) =>
        m.id === editingTag.id ? { ...m, label: editingTag.label } : m
      ),
    });
    setEditingTag(null);
  }

  function archiveTag(id: string) {
    setEditingTag(null);
    applyConfigs({
      ...configs,
      moments: configs.moments.map((m) =>
        m.id === id ? { ...m, archived: true } : m
      ),
    });
    setJustArchivedId(id);
  }

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
      <header className="mb-2 flex items-center justify-between">
        <h1 className="text-xl font-light tracking-widest text-stone-800 dark:text-stone-200">
          Manage
        </h1>
        <Link
          href="/settings"
          className="text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
        >
          ← Settings
        </Link>
      </header>

      {/* ── Jump link ───────────────────────────────────────────────── */}
      <div className="mb-10">
        <a
          href="#moments"
          className="text-xs text-stone-400 underline-offset-4 hover:underline dark:text-stone-500"
        >
          Jump to Moments ↓
        </a>
      </div>

      {/* ── Habits ──────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className={SECTION_LABEL}>Habits</h2>

        <div className="space-y-0.5">
          {/* Active habits */}
          {activeHabits.map((h) => (
            <div key={h.id}>
              <div className="flex items-center justify-between gap-2 py-2">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-stone-700 dark:text-stone-300">{h.label}</span>
                    {h.type === "numeric" && (
                      <span className="text-xs text-stone-400 dark:text-stone-500">{h.unit}</span>
                    )}
                  </div>
                  {h.type === "boolean" && (
                    <button
                      type="button"
                      onClick={() => toggleJoyByDefault(h.id)}
                      className="self-start text-left transition-colors"
                    >
                      <span className={`text-xs ${h.joyByDefault ? "text-amber-600 dark:text-amber-500" : "text-stone-400"}`}>
                        {h.joyByDefault ? "♥ Brings joy by default" : "♡ Tap to mark as joyful by default"}
                      </span>
                    </button>
                  )}
                </div>
                <div className="flex shrink-0 gap-3">
                  <button type="button" onClick={() => startEditHabit(h)} className={ACTION_BTN}>
                    Edit
                  </button>
                  <button type="button" onClick={() => archiveHabit(h.id)} className={ARCHIVE_BTN}>
                    Archive
                  </button>
                </div>
              </div>

              {/* Inline edit form */}
              {editingHabit?.id === h.id && (
                <div className={INLINE_FORM}>
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
                        <label className={FIELD_LABEL}>Step</label>
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
                </div>
              )}
            </div>
          ))}

          {/* Archived habits */}
          {archivedHabits.map((h) => (
            <div key={h.id}>
              <div className="flex items-center justify-between gap-2 py-2">
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="text-sm text-stone-400 dark:text-stone-600">{h.label}</span>
                  {h.type === "numeric" && (
                    <span className="text-xs text-stone-300 dark:text-stone-700">{h.unit}</span>
                  )}
                </div>
                <button type="button" onClick={() => restoreHabit(h.id)} className={ACTION_BTN}>
                  Restore
                </button>
              </div>
              {justArchivedId === h.id && (
                <p className="pb-1 text-xs text-stone-400 dark:text-stone-500">
                  Archived. Past entries are preserved.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Add habit flow */}
        {addHabit === null && (
          <button
            type="button"
            onClick={() => {
              closeAllEditors();
              setAddHabit({ stage: "type" });
            }}
            className="mt-3 text-sm text-stone-500 dark:text-stone-400 underline-offset-4 hover:underline transition-colors"
          >
            + Add habit
          </button>
        )}

        {addHabit?.stage === "type" && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-stone-500 dark:text-stone-400">What kind of habit?</p>
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => setAddHabit({ stage: "form-boolean", label: "", joyByDefault: false })}
                className="text-sm text-stone-600 dark:text-stone-300 underline-offset-4 hover:underline"
              >
                Boolean
              </button>
              <button
                type="button"
                onClick={() => setAddHabit({ stage: "form-numeric", label: "", unit: "", step: 1 })}
                className="text-sm text-stone-600 dark:text-stone-300 underline-offset-4 hover:underline"
              >
                Numeric
              </button>
            </div>
            <button type="button" onClick={() => setAddHabit(null)} className={CANCEL_BTN}>
              Cancel
            </button>
          </div>
        )}

        {(addHabit?.stage === "form-boolean" || addHabit?.stage === "form-numeric") && (
          <div className={`mt-3 ${INLINE_FORM}`}>
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
                  <span className={`text-xs ${addHabit.joyByDefault ? "text-amber-600 dark:text-amber-500" : "text-stone-400"}`}>
                    {addHabit.joyByDefault ? "♥ Brings joy by default" : "♡ Does not bring joy by default"}
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
                  <label className={FIELD_LABEL}>Step</label>
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
          </div>
        )}
      </section>

      {/* ── Moments ─────────────────────────────────────────────────── */}
      <section id="moments">
        <h2 className={SECTION_LABEL}>Moments</h2>

        <div className="space-y-0.5">
          {/* Active tags */}
          {activeTags.map((t) => (
            <div key={t.id}>
              <div className="flex items-center justify-between gap-2 py-2">
                <span className="text-sm text-stone-700 dark:text-stone-300">{t.label}</span>
                <div className="flex shrink-0 gap-3">
                  <button type="button" onClick={() => startEditTag(t)} className={ACTION_BTN}>
                    Edit
                  </button>
                  <button type="button" onClick={() => archiveTag(t.id)} className={ARCHIVE_BTN}>
                    Archive
                  </button>
                </div>
              </div>

              {/* Inline edit form */}
              {editingTag?.id === t.id && (
                <div className={INLINE_FORM}>
                  <div>
                    <label className={FIELD_LABEL}>Label</label>
                    <input
                      type="text"
                      value={editingTag.label}
                      onChange={(e) => setEditingTag({ ...editingTag, label: e.target.value })}
                      className={TEXT_INPUT}
                    />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={saveEditTag}
                      disabled={!editingTag.label.trim()}
                      className={SAVE_BTN}
                    >
                      Save
                    </button>
                    <button type="button" onClick={() => setEditingTag(null)} className={CANCEL_BTN}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Archived tags */}
          {archivedTags.map((t) => (
            <div key={t.id}>
              <div className="flex items-center justify-between gap-2 py-2">
                <span className="text-sm text-stone-400 dark:text-stone-600">{t.label}</span>
                <button type="button" onClick={() => restoreTag(t.id)} className={ACTION_BTN}>
                  Restore
                </button>
              </div>
              {justArchivedId === t.id && (
                <p className="pb-1 text-xs text-stone-400 dark:text-stone-500">
                  Archived. Past entries are preserved.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Add tag flow */}
        {!addingTag ? (
          <button
            type="button"
            onClick={() => {
              closeAllEditors();
              setAddingTag(true);
            }}
            className="mt-3 text-sm text-stone-500 dark:text-stone-400 underline-offset-4 hover:underline transition-colors"
          >
            + Add moment
          </button>
        ) : (
          <div className={`mt-3 ${INLINE_FORM}`}>
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
          </div>
        )}
      </section>
    </div>
  );
}
