#!/usr/bin/env node

/**
 * @fileoverview Archives an audit or report file before it is overwritten.
 * Copies <source-path> to <archive-dir>/<basename-without-ext>-<YYYY-MM-DD><ext>.
 * Safe to call even when the source does not exist (exits 0, reports no-op).
 *
 * Usage:
 *   node .claude/skills/scripts/archive_audit.js <source-path> <YYYY-MM-DD> [<archive-dir>]
 *
 * Arguments:
 *   source-path   Path to the file to archive (e.g. docs/audits/audit-colour.md)
 *   YYYY-MM-DD    Date string to embed in the archived filename
 *   archive-dir   (optional) Destination directory. Defaults to docs/audits/archive/
 *
 * Output (stdout, always JSON):
 *   Success:  { "archived": true,  "source": "...", "destination": "..." }
 *   No-op:    { "archived": false, "source": "...", "reason": "source file does not exist" }
 *   Error:    { "error": "..." }   — exit 1
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const [sourcePath, dateStr, archiveDirArg] = process.argv.slice(2);

if (!sourcePath || !dateStr) {
  console.error(JSON.stringify({ error: 'Usage: archive_audit.js <source-path> <YYYY-MM-DD> [<archive-dir>]' }));
  process.exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
  console.error(JSON.stringify({ error: `Date argument must be YYYY-MM-DD, got: ${dateStr}` }));
  process.exit(1);
}

const archiveDir = archiveDirArg ?? 'docs/audits/archive';
const ext = path.extname(sourcePath);
const base = path.basename(sourcePath, ext);
const destination = path.join(archiveDir, `${base}-${dateStr}${ext}`);

if (!existsSync(sourcePath)) {
  console.log(JSON.stringify({ archived: false, source: sourcePath, reason: 'source file does not exist' }));
  process.exit(0);
}

try {
  await fs.mkdir(archiveDir, { recursive: true });
  await fs.copyFile(sourcePath, destination);
  console.log(JSON.stringify({ archived: true, source: sourcePath, destination }));
} catch (err) {
  console.error(JSON.stringify({ error: err.message }));
  process.exit(1);
}
