#!/usr/bin/env node

/**
 * @fileoverview Estimates latency impact of Claude Code hooks from both project and global settings.
 * Uses a weight-based scoring system to categorize hook performance impact.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';

const projectRoot = process.cwd();
const globalRoot = path.join(os.homedir(), '.claude');

// Weight map: approximate additional latency contribution (0–10 scale)
const WEIGHT_MAP = {
  'tsc': 10,
  'git status': 1,
  'git branch': 1,
  'bash -c': 2,
  'npm': 5,
  'npx': 5,
  'node': 2,
  'python': 3,
};

function estimateWeight(hookStr) {
  const lower = hookStr.toLowerCase();
  let weight = 0;
  for (const [key, val] of Object.entries(WEIGHT_MAP)) {
    if (lower.includes(key)) weight += val;
  }
  return weight;
}

async function analyzeSettings(settingsPath, origin) {
  if (!existsSync(settingsPath)) return [];
  try {
    const data = await fs.readFile(settingsPath, 'utf8');
    const settings = JSON.parse(data);
    const hooks = settings.hooks ?? {};
    const results = [];

    for (const [event, eventHooks] of Object.entries(hooks)) {
      const hookList = Array.isArray(eventHooks) ? eventHooks : [eventHooks];
      for (const hook of hookList) {
        const hookStr = JSON.stringify(hook);
        const weight = estimateWeight(hookStr);
        results.push({
          origin,
          event,
          estimatedLatency: weight > 7 ? 'High' : weight > 3 ? 'Medium' : 'Low',
          weight,
          snippet: hookStr.slice(0, 100),
        });
      }
    }
    return results;
  } catch (err) {
    return [];
  }
}

const [projectHooks, globalHooks] = await Promise.all([
  analyzeSettings(path.join(projectRoot, '.claude', 'settings.json'), 'project'),
  analyzeSettings(path.join(globalRoot, 'settings.json'), 'global'),
]);

const all = [...projectHooks, ...globalHooks];
const totalWeight = all.reduce((sum, l) => sum + l.weight, 0);

console.log(JSON.stringify({ latencies: all, totalWeight }, null, 2));
