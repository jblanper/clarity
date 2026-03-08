#!/usr/bin/env node

/**
 * @fileoverview Tracks deltas between the current always-loaded token count and the most recent report.
 * Reads the previous report's "Always-Loaded Context Tax" line for comparison.
 *
 * Usage: node delta_tracker.js <currentAlwaysLoadedTokens>
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const reportsDir = path.join(process.cwd(), 'docs', 'claude-code-optimizer');
const currentTokens = parseInt(process.argv[2], 10);

if (isNaN(currentTokens)) {
  console.error(JSON.stringify({ error: 'Current token count argument is missing or invalid. Pass totalAlwaysLoaded from token_counter.js.' }));
  process.exit(1);
}

const delta = {
  previousReport: null,
  previousStatus: null,
  previousTokens: null,
  tokenDelta: 0,
  percentChange: 0,
  trend: 'baseline',
};

if (existsSync(reportsDir)) {
  const files = await fs.readdir(reportsDir);
  const reports = files
    .filter(f => f.startsWith('audit-claude-env-') && f.endsWith('.md'))
    .sort((a, b) => b.localeCompare(a));

  if (reports.length > 0) {
    const latestPath = path.join(reportsDir, reports[0]);
    const content = await fs.readFile(latestPath, 'utf8');

    // Match: "**Always-Loaded Context Tax:** ~12,345 tokens"
    const tokenMatch = content.match(/Always-Loaded Context Tax[^~]*~?([\d,]+)\s*tokens/i);
    if (tokenMatch) {
      const prev = parseInt(tokenMatch[1].replace(/,/g, ''), 10);
      delta.previousReport = reports[0];
      delta.previousTokens = prev;
      delta.tokenDelta = currentTokens - prev;
      delta.percentChange = parseFloat(((delta.tokenDelta / prev) * 100).toFixed(1));
      delta.trend = delta.tokenDelta < 0 ? 'improving' : delta.tokenDelta > 0 ? 'degrading' : 'stable';
    }

    const statusMatch = content.match(/\*\*Status:\*\*\s*(.+)/);
    if (statusMatch) {
      delta.previousStatus = statusMatch[1].trim();
    }
  }
}

console.log(JSON.stringify(delta, null, 2));
