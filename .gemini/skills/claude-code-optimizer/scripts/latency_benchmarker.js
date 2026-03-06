#!/usr/bin/env node

/**
 * @fileoverview Estimates latency impact of Claude Code hooks based on command complexity.
 * Uses a weight-based scoring system to categorize hook performance impact.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), '.claude', 'settings.json');

if (!existsSync(settingsPath)) {
  console.log(JSON.stringify({ hooks: [], score: 0 }));
  process.exit(0);
}

try {
  const settingsData = await fs.readFile(settingsPath, 'utf8');
  const settings = JSON.parse(settingsData);
  const hooks = settings.hooks || {};
  const latencies = [];

  const weightMap = {
    'tsc': 10,
    'git status': 1,
    'git branch': 1,
    'bash -c': 2,
    'npm': 5,
    'npx': 5
  };

  for (const [event, eventHooks] of Object.entries(hooks)) {
    const hookList = Array.isArray(eventHooks) ? eventHooks : [eventHooks];
    
    for (const hook of hookList) {
      const cmdStr = JSON.stringify(hook).toLowerCase();
      let estimatedLatency = "Low";
      let weight = 0;

      for (const [key, val] of Object.entries(weightMap)) {
        if (cmdStr.includes(key)) {
          weight += val;
        }
      }

      if (weight > 7) {
        estimatedLatency = "High";
      } else if (weight > 3) {
        estimatedLatency = "Medium";
      }

      latencies.push({ event, command: cmdStr, estimatedLatency, weight });
    }
  }

  const totalWeight = latencies.reduce((sum, l) => sum + l.weight, 0);
  console.log(JSON.stringify({ latencies, totalWeight }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ error: "Failed to parse settings.json", details: error.message }));
  process.exit(1);
}
