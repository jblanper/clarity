"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { exportEntries, importEntries } from "@/lib/transferData";

type ImportStatus =
  | { kind: "idle" }
  | { kind: "ready"; file: File }
  | { kind: "success"; imported: number; skipped: number }
  | { kind: "error"; message: string };

type ExportStatus = "idle" | "error";

export default function SettingsView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>({ kind: "idle" });
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");

  // ── Export ────────────────────────────────────────────────────────

  const handleExport = () => {
    try {
      exportEntries();
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
      const { imported, skipped } = await importEntries(importStatus.file);
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
        <Link
          href="/"
          aria-label="Back to check-in"
          className="text-stone-400 transition-colors hover:text-stone-600"
        >
          ←
        </Link>
        <h1 className="text-xl font-light tracking-widest text-stone-800">
          Settings
        </h1>
      </header>

      {/* ── Export ────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-400">
          Export
        </h2>
        <p className="mb-4 text-sm text-stone-500">
          Download all your habit entries as a JSON backup file.
        </p>
        <button
          onClick={handleExport}
          className="w-full rounded-2xl border border-stone-200 bg-white py-4 text-sm tracking-widest text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 active:bg-stone-100"
        >
          Export backup
        </button>
        {exportStatus === "error" && (
          <p className="mt-3 text-center text-sm text-red-400">
            Nothing to export yet. Start tracking first.
          </p>
        )}
      </section>

      <div className="mb-10 border-t border-stone-100" />

      {/* ── Import ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-1 text-xs uppercase tracking-widest text-stone-400">
          Import
        </h2>
        <p className="mb-4 text-sm text-stone-500">
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
            className="w-full rounded-2xl border border-stone-200 bg-white py-4 text-sm tracking-widest text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 active:bg-stone-100"
          >
            Choose file
          </button>
        )}

        {importStatus.kind === "ready" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
              <span className="truncate text-sm text-stone-600">
                {importStatus.file.name}
              </span>
              <button
                onClick={resetImport}
                aria-label="Remove selected file"
                className="ml-3 flex-shrink-0 text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>
            <button
              onClick={handleImport}
              className="w-full rounded-2xl bg-stone-800 py-4 text-sm tracking-widest text-white transition-colors hover:bg-stone-700 active:bg-stone-900"
            >
              Import
            </button>
          </div>
        )}

        {importStatus.kind === "success" && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-600">
              <p>
                <span className="font-medium text-stone-800">
                  {importStatus.imported}{" "}
                  {importStatus.imported === 1 ? "entry" : "entries"} imported.
                </span>
              </p>
              {importStatus.skipped > 0 && (
                <p className="mt-1 text-stone-400">
                  {importStatus.skipped}{" "}
                  {importStatus.skipped === 1 ? "entry" : "entries"} already
                  existed and were kept.
                </p>
              )}
            </div>
            <button
              onClick={resetImport}
              className="w-full rounded-2xl border border-stone-200 bg-white py-4 text-sm tracking-widest text-stone-700 transition-colors hover:bg-stone-50"
            >
              Import another file
            </button>
          </div>
        )}

        {importStatus.kind === "error" && (
          <div className="space-y-3">
            <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">
              {importStatus.message}
            </p>
            <button
              onClick={resetImport}
              className="w-full rounded-2xl border border-stone-200 bg-white py-4 text-sm tracking-widest text-stone-700 transition-colors hover:bg-stone-50"
            >
              Try again
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
