#!/usr/bin/env node

/**
 * @fileoverview Tracks deltas between current audit results and the most recent report.
 * Compares "Always-Loaded Context Tax" to provide progress metrics.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const reportsDir = path.join(process.cwd(), 'docs', 'claude-code-optimizer');
const currentTokens = parseInt(process.argv[2], 10);

if (isNaN(currentTokens)) {
  console.error(JSON.stringify({ error: "Current token count is missing or invalid" }));
  process.exit(1);
}

try {
  let delta = {
    previousReport: null,
    tokenDelta: 0,
    percentChange: 0,
    statusChange: "stable",
    previousStatus: null
  };

  if (existsSync(reportsDir)) {
    const files = await fs.readdir(reportsDir);
    const reports = files
      .filter(f => f.startsWith('audit-claude-env-') && f.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a)); // Sort descending

    if (reports.length > 0) {
      const latestReportPath = path.join(reportsDir, reports[0]);
      const content = await fs.readFile(latestReportPath, 'utf8');
      
      // Parse tokens: "Always-Loaded Context Tax: ~12,345 tokens"
      const tokenMatch = content.match(/Always-Loaded Context Tax:[^~]*~?([\d,]+)\s*tokens/i);
      if (tokenMatch) {
        const prevTokens = parseInt(tokenMatch[1].replace(/,/g, ''), 10);
        delta.previousReport = reports[0];
        delta.tokenDelta = currentTokens - prevTokens;
        delta.percentChange = parseFloat(((delta.tokenDelta / prevTokens) * 100).toFixed(1));
      }

      // Parse status: "**Status:** 🔴 Critical Bloat"
      const statusMatch = content.match(/\*\*Status:\*\*\s*(.+)/);
      if (statusMatch) {
        delta.previousStatus = statusMatch[1].trim();
      }
    }
  }

  console.log(JSON.stringify(delta, null, 2));
} catch (error) {
  console.error(JSON.stringify({ error: "Failed to track delta", details: error.message }));
  process.exit(1);
}
