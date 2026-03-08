#!/usr/bin/env node

/**
 * @fileoverview Maps dependencies between Claude Code skills by analyzing their content.
 * Identifies entry points, orphaned internal skills, and shared utilities.
 *
 * "Dead skill" definition (revised): a skill that has disable-model-invocation: true
 * AND is not referenced by any other skill. It can only be invoked by typing
 * /skill-name explicitly — useful to flag but NOT necessarily a problem.
 * True orphans are internal skills (user-invocable: false) with no callers.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';

const projectRoot = process.cwd();
const globalRoot = path.join(os.homedir(), '.claude');

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return {};
  const end = content.indexOf('---', 3);
  if (end === -1) return {};
  const block = content.slice(3, end);
  const result = {};
  for (const line of block.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    result[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return result;
}

const skillContents = {};
const skillMeta = {};

for (const skillsDir of [
  path.join(projectRoot, '.claude', 'skills'),
  path.join(globalRoot, 'skills'),
]) {
  if (!existsSync(skillsDir)) continue;
  const entries = await fs.readdir(skillsDir);

  for (const skill of entries) {
    const skillPath = path.join(skillsDir, skill, 'SKILL.md');
    if (!existsSync(skillPath)) continue;
    const content = await fs.readFile(skillPath, 'utf8');
    skillContents[skill] = content;
    const fm = parseFrontmatter(content);
    skillMeta[skill] = {
      isDeferred: fm['disable-model-invocation'] === 'true',
      isInternal: fm['user-invocable'] === 'false',
      name: fm['name'] ?? skill,
    };
  }
}

const skillNames = Object.keys(skillContents);
const dependencyMap = {};

for (const skill of skillNames) {
  const content = skillContents[skill];
  const deps = new Set();

  for (const other of skillNames) {
    if (skill === other) continue;
    const patterns = [
      new RegExp(`/${other}\\b`, 'g'),
      new RegExp(`\\.claude/skills/${other}\\b`, 'g'),
      new RegExp(`@\\.claude/skills/${other}\\b`, 'g'),
      new RegExp(`\\[.*?\\]\\(.*?${other}.*?\\)`, 'g'),
      new RegExp(`\\b${other}\\.md\\b`, 'gi'),
    ];
    if (patterns.some(p => p.test(content))) {
      deps.add(other);
    }
  }

  dependencyMap[skill] = Array.from(deps);
}

// Entry points: not called by any other skill
const entryPoints = skillNames.filter(s =>
  !Object.values(dependencyMap).some(deps => deps.includes(s))
);

// Shared utilities: called by 3+ skills
const sharedUtilities = skillNames.filter(s => {
  const callerCount = Object.values(dependencyMap).filter(deps => deps.includes(s)).length;
  return callerCount >= 3;
});

// True orphans: internal (user-invocable: false) AND not called by anyone
const trueOrphans = skillNames.filter(s =>
  skillMeta[s].isInternal &&
  !Object.values(dependencyMap).some(deps => deps.includes(s))
);

// Standalone deferred: deferred (disable-model-invocation) AND not referenced by anyone
// These require explicit /name invocation. Flag for awareness, not necessarily a problem.
const standaloneDeferredEntries = entryPoints.filter(s =>
  skillMeta[s].isDeferred && dependencyMap[s].length === 0
);

// Depth calculation (max chain length from entry point)
function computeDepth(skill, visited = new Set()) {
  if (visited.has(skill)) return 0;
  visited.add(skill);
  const deps = dependencyMap[skill] ?? [];
  if (deps.length === 0) return 1;
  return 1 + Math.max(...deps.map(d => computeDepth(d, new Set(visited))));
}

const depthMap = {};
for (const skill of skillNames) {
  depthMap[skill] = computeDepth(skill);
}

console.log(JSON.stringify({
  totalSkills: skillNames.length,
  dependencyMap,
  entryPoints,
  sharedUtilities,
  trueOrphans,
  standaloneDeferredEntries,
  depthMap,
}, null, 2));
