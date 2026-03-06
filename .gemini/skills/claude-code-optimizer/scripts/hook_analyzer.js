#!/usr/bin/env node

/**
 * @fileoverview Analyzes the Claude Code settings.json for defined hooks.
 * Extracts and prints the hooks for further auditing and performance evaluation.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), '.claude', 'settings.json');

if (!existsSync(settingsPath)) {
  console.log(JSON.stringify({ error: "No settings.json found" }));
  process.exit(0);
}

try {
  const settingsData = await fs.readFile(settingsPath, 'utf8');
  const settings = JSON.parse(settingsData);
  const hooks = settings.hooks || {};

  // Note: Claude Code settings.json can have different structures, 
  // this is a simplified analysis based on observed patterns.
  console.log(JSON.stringify({ hooks }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ error: "Failed to parse settings.json", details: error.message }));
  process.exit(1);
}
