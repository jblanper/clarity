#!/usr/bin/env node

/**
 * @fileoverview Analyzes Claude Code hooks from both project and global settings.json.
 * Merges results and summarizes event coverage.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';

const projectRoot = process.cwd();
const globalRoot = path.join(os.homedir(), '.claude');

async function loadHooks(settingsPath, origin) {
  if (!existsSync(settingsPath)) return { origin, hooks: {}, error: null };
  try {
    const data = await fs.readFile(settingsPath, 'utf8');
    const settings = JSON.parse(data);
    return { origin, hooks: settings.hooks ?? {}, error: null };
  } catch (err) {
    return { origin, hooks: {}, error: err.message };
  }
}

const [projectResult, globalResult] = await Promise.all([
  loadHooks(path.join(projectRoot, '.claude', 'settings.json'), 'project'),
  loadHooks(path.join(globalRoot, 'settings.json'), 'global'),
]);

// Merge hooks by event, preserving origin label
const mergedHooks = {};
for (const { origin, hooks } of [projectResult, globalResult]) {
  for (const [event, eventHooks] of Object.entries(hooks)) {
    if (!mergedHooks[event]) mergedHooks[event] = [];
    const hookList = Array.isArray(eventHooks) ? eventHooks : [eventHooks];
    for (const hook of hookList) {
      mergedHooks[event].push({ origin, ...hook });
    }
  }
}

const knownEvents = ['SessionStart', 'PreToolUse', 'PostToolUse', 'Stop'];
const missingEvents = knownEvents.filter(e => !mergedHooks[e]);
const coveredEvents = knownEvents.filter(e => mergedHooks[e]);

console.log(JSON.stringify({
  coveredEvents,
  missingEvents,
  mergedHooks,
  errors: [projectResult.error, globalResult.error].filter(Boolean),
}, null, 2));
