#!/usr/bin/env node

/**
 * @fileoverview Validates the Claude Code optimization reports for structural and technical consistency.
 * Checks for mandatory sections, correct date formatting, and resolved placeholders.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const reportPath = process.argv[2];

if (!reportPath || !existsSync(reportPath)) {
  console.error(JSON.stringify({ error: "Report path missing or invalid" }));
  process.exit(1);
}

try {
  const content = await fs.readFile(reportPath, 'utf8');
  const checks = [];

  // 1. Check for valid timestamp in title or metadata
  const dateLine = content.match(/\*\*Date:\*\* \d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
  if (!dateLine) {
    checks.push("Missing or invalid date format (YYYY-MM-DD HH:mm)");
  }

  // 2. Check for Scripting Recommendations consistency (.js preference)
  // Since we refactored to ESM, we now prefer .js (or .mjs) over .cjs
  if (content.includes(".cjs")) {
    checks.push("Found .cjs reference; update to modern ESM (.js) naming convention");
  }

  // 3. Check for mandatory sections
  const mandatorySections = [
    "## Executive Summary",
    "## Skill Audit",
    "## Semantic & Architectural Audit",
    "## Scripting Recommendations",
    "## Hook Strategy",
    "## Efficiency Metrics"
  ];

  for (const section of mandatorySections) {
    if (!content.includes(section)) {
      checks.push(`Missing mandatory section: ${section}`);
    }
  }

  // 4. Check for unreplaced placeholders
  if (content.includes("{{") || content.includes("}}")) {
    checks.push("Found unreplaced placeholders {{ }}");
  }

  if (checks.length > 0) {
    console.log(JSON.stringify({ status: "FAIL", issues: checks }, null, 2));
  } else {
    console.log(JSON.stringify({ status: "PASS" }, null, 2));
  }
} catch (error) {
  console.error('Critical error in report validator:', error.message);
  process.exit(1);
}
