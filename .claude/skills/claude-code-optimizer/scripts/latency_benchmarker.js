#!/usr/bin/env node

/**
 * @fileoverview Estimates latency impact of Claude Code hooks from both project and global settings.
 *
 * Weight-based heuristic — higher weight = more likely to add latency. Weights are
 * calibrated to rough real-world ms ranges, not exact measurements.
 *
 * Conditional hooks (using if/grep/git diff guards) incur latency only when triggered,
 * so they're flagged separately as lower actual impact.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';

const projectRoot = process.cwd();
const globalRoot = path.join(os.homedir(), '.claude');

// Weight map: approximate additional latency contribution (0–10 scale)
const WEIGHT_MAP = {
  'tsc': 10,          // TypeScript full compile: 3–10s
  'cargo': 9,         // Rust compile: similar range
  'mvn': 9,           // Maven builds
  'gradle': 9,
  'npm run build': 8,
  'npm install': 7,   // Dependency install: unpredictable
  'pip install': 7,
  'docker': 7,        // Container ops: varies wildly
  'npx': 5,           // On-demand package execution
  'npm run': 4,       // Script execution
  'python': 3,        // Script: usually fast but unknown
  'node': 2,          // Node script: usually fast
  'bash -c': 2,       // Shell script: varies
  'git log': 2,       // Git reads: usually fast
  'git status': 1,
  'git branch': 1,
  'git diff': 1,
  'echo': 0,
  'ls': 0,
};

function estimateWeight(hookStr) {
  const lower = hookStr.toLowerCase();
  let weight = 0;
  for (const [cmd, w] of Object.entries(WEIGHT_MAP)) {
    if (lower.includes(cmd)) weight += w;
  }
  return weight;
}

function isConditional(hookStr) {
  return /\bif\b|grep\s+-q|--name-only|hash\b/.test(hookStr);
}

function weightToLabel(weight, conditional) {
  if (conditional) return 'Conditional (reduced actual impact)';
  if (weight >= 8) return 'High';
  if (weight >= 4) return 'Medium';
  return 'Low';
}

async function analyzeSettings(settingsPath, origin) {
  if (!existsSync(settingsPath)) return [];
  const data = await fs.readFile(settingsPath, 'utf8');
  const settings = JSON.parse(data);
  const hooks = settings.hooks ?? {};
  const results = [];

  for (const [event, eventHooks] of Object.entries(hooks)) {
    const hookList = Array.isArray(eventHooks) ? eventHooks : [eventHooks];
    for (const hook of hookList) {
      const hookStr = JSON.stringify(hook);
      const weight = estimateWeight(hookStr);
      const conditional = isConditional(hookStr);
      results.push({
        origin,
        event,
        estimatedLatency: weightToLabel(weight, conditional),
        weight,
        conditional,
        snippet: hookStr.slice(0, 120),
      });
    }
  }
  return results;
}

const [projectHooks, globalHooks] = await Promise.all([
  analyzeSettings(path.join(projectRoot, '.claude', 'settings.json'), 'project').catch(() => []),
  analyzeSettings(path.join(globalRoot, 'settings.json'), 'global').catch(() => []),
]);

const all = [...projectHooks, ...globalHooks];
const totalWeight = all.reduce((s, h) => s + h.weight, 0);
const highLatencyHooks = all.filter(h => h.estimatedLatency === 'High');

console.log(JSON.stringify({
  totalWeight,
  highLatencyHooks,
  all,
}, null, 2));
