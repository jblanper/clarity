#!/usr/bin/env node

/**
 * @fileoverview Validates a Claude Code optimization report for structural and technical consistency.
 * Checks mandatory sections, date format, and unreplaced template placeholders.
 *
 * Usage: node report_validator.js <path-to-report.md>
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';

const reportPath = process.argv[2];

if (!reportPath || !existsSync(reportPath)) {
  console.error(JSON.stringify({ error: 'Report path missing or file does not exist.' }));
  process.exit(1);
}

const content = await fs.readFile(reportPath, 'utf8');
const issues = [];

// 1. Date format: YYYY-MM-DD HH:mm
if (!content.match(/\*\*Date:\*\*\s*\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)) {
  issues.push('Missing or malformed date (expected: **Date:** YYYY-MM-DD HH:mm)');
}

// 2. Mandatory sections
const mandatorySections = [
  '## Executive Summary',
  '## Always-Loaded Context Audit',
  '## Skill Audit',
  '## Semantic & Architectural Audit',
  '## Scripting Recommendations',
  '## Hook Strategy',
  '## Efficiency Metrics',
];
for (const section of mandatorySections) {
  if (!content.includes(section)) {
    issues.push(`Missing mandatory section: ${section}`);
  }
}

// 3. Unreplaced template placeholders
if (/\{\{|\}\}/.test(content)) {
  issues.push('Found unreplaced template placeholders {{ }}');
}

// 4. Hardcoded fake savings (a 60% savings claim without context is a red flag)
if (/60%\s*reduction target/i.test(content)) {
  issues.push('Contains hardcoded "60% reduction target" — replace with calculated value');
}

// 5. Deprecated Gemini-only concepts
if (/disable-model-invocation.*Gemini/i.test(content)) {
  issues.push('Report references disable-model-invocation as a Gemini concept — it is a valid Claude Code frontmatter key');
}

if (issues.length > 0) {
  console.log(JSON.stringify({ status: 'FAIL', issues }, null, 2));
} else {
  console.log(JSON.stringify({ status: 'PASS' }));
}
