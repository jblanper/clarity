"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { exportBackup, importBackup } from "@/lib/transferData";
import ManageSection from "@/components/ManageSection";
import { getTheme, setTheme, type Theme } from "@/lib/theme";

type ImportStatus =
  | { kind: "idle" }
  | { kind: "ready"; file: File }
  | { kind: "success"; imported: number; skipped: number }
  | { kind: "error"; message: string };

type ExportStatus = "idle" | "error";

export default function SettingsView() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>({ kind: "idle" });
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const [currentTheme, setCurrentTheme] = useState<Theme>("light");

  // Read the saved theme on mount to reflect the active selection
  useEffect(() => {
    setCurrentTheme(getTheme());
  }, []);

  // ── Theme ─────────────────────────────────────────────────────────

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
  };

  // ── Export ────────────────────────────────────────────────────────

  const handleExport = () => {
    try {
      exportBackup();
      setExportStatus("idle");
    } catch (err) {
      setExportStatus("error");
      // Log for debugging; the error message is shown in the UI
      console.error(err);
    }
  };

  // ── Import ────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportStatus({ kind: "ready", file });
    }
  };

  const handleImport = async () => {
    if (importStatus.kind !== "ready") return;
    try {
      const { imported, skipped } = await importBackup(importStatus.file);
      setImportStatus({ kind: "success", imported, skipped });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setImportStatus({ kind: "error", message });
    }
    // Reset the file input so the same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetImport = () => {
    setImportStatus({ kind: "idle" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mx-auto max-w-md px-5 pb-12 pt-10">

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="mb-10 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"
        >
          ←
        </button>
        <h1 className="text-xl font-light tracking-widest text-stone-800 dark:text-stone-200">
          Settings
        </h1>
      </header>

      {/* ── Theme ─────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-4 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          Theme
        </h2>
        <div className="flex gap-6">
          <button
            onClick={() => handleThemeChange("light")}
            className={`text-sm transition-colors ${
              currentTheme === "light"
                ? "font-medium text-stone-900 dark:text-stone-100"
                : "text-stone-500 dark:text-stone-400"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className={`text-sm transition-colors ${
              currentTheme === "dark"
                ? "font-medium text-stone-900 dark:text-stone-100"
                : "text-stone-500 dark:text-stone-400"
            }`}
          >
            Dark
          </button>
        </div>
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Manage ────────────────────────────────────────────────── */}
      <div className="mb-10">
        <ManageSection />
      </div>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Export ────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          Export
        </h2>
        <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
          Download all your habit entries as a JSON backup file.
        </p>
        <button
          onClick={handleExport}
          className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 py-4 text-sm tracking-widest text-stone-700 dark:text-stone-300 transition-colors hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 active:bg-stone-100 dark:active:bg-stone-800"
        >
          Export backup
        </button>
        {exportStatus === "error" && (
          <p className="mt-3 text-center text-sm text-red-700 dark:text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
      </section>

      <div className="mb-10 border-t border-stone-100 dark:border-stone-800" />

      {/* ── Import ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
          Import
        </h2>
        <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
          Restore entries from a backup file. Dates that already have an entry
          will not be overwritten.
        </p>

        {/* Hidden file input — triggered by the styled button below */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Choose a backup file"
        />

        {importStatus.kind === "idle" && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 py-4 text-sm tracking-widest text-stone-700 dark:text-stone-300 transition-colors hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 active:bg-stone-100 dark:active:bg-stone-800"
          >
            Choose file
          </button>
        )}

        {importStatus.kind === "ready" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3">
              <span className="truncate text-sm text-stone-600 dark:text-stone-400">
                {importStatus.file.name}
              </span>
              <button
                onClick={resetImport}
                aria-label="Remove selected file"
                className="ml-3 flex-shrink-0 text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              >
                ✕
              </button>
            </div>
            <button
              onClick={handleImport}
              className="w-full rounded-2xl bg-stone-800 dark:bg-stone-200 py-4 text-sm tracking-widest text-white dark:text-stone-900 transition-colors hover:bg-stone-700 dark:hover:bg-stone-300 active:bg-stone-900 dark:active:bg-stone-100"
            >
              Import
            </button>
          </div>
        )}

        {importStatus.kind === "success" && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-4 text-sm text-stone-600 dark:text-stone-400">
              <p>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {importStatus.imported}{" "}
                  {importStatus.imported === 1 ? "entry" : "entries"} imported.
                </span>
              </p>
              {importStatus.skipped > 0 && (
                <p className="mt-1 text-stone-500 dark:text-stone-500">
                  {importStatus.skipped}{" "}
                  {importStatus.skipped === 1 ? "entry" : "entries"} already
                  existed and were kept.
                </p>
              )}
            </div>
            <button
              onClick={resetImport}
              className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 py-4 text-sm tracking-widest text-stone-700 dark:text-stone-300 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              Import another file
            </button>
          </div>
        )}

        {importStatus.kind === "error" && (
          <div className="space-y-3">
            <p className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {importStatus.message}
            </p>
            <button
              onClick={resetImport}
              className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 py-4 text-sm tracking-widest text-stone-700 dark:text-stone-300 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              Try again
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
