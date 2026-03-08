#!/usr/bin/env node

/**
 * @fileoverview Lints Claude Code skills for architectural standards.
 *
 * Checks both project (.claude/skills/) and global (~/.claude/skills/) skill dirs.
 * Groups skills by common naming prefix (discovered dynamically, not hardcoded).
 * Verifies YAML frontmatter, disable-model-invocation, allowed-tools, and conversational filler.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';

const projectRoot = process.cwd();
const globalRoot = path.join(os.homedir(), '.claude');

const FILLERS = ['please', 'i will', "now let's", "let's try", 'feel free', 'of course'];

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('---', 3);
  if (end === -1) return null;
  const block = content.slice(3, end);
  const result = {};
  for (const line of block.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    result[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return result;
}

/**
 * Infer prefix groups dynamically from skill names.
 * A prefix is the part before the first '-', if shared by 2+ skills.
 */
function discoverGroups(skillNames) {
  const prefixCount = {};
  for (const name of skillNames) {
    const prefix = name.includes('-') ? name.split('-')[0] : '__standalone__';
    prefixCount[prefix] = (prefixCount[prefix] ?? 0) + 1;
  }
  return prefixCount;
}

const allSkills = [];

for (const [origin, skillsDir] of [
  ['project', path.join(projectRoot, '.claude', 'skills')],
  ['global', path.join(globalRoot, 'skills')],
]) {
  if (!existsSync(skillsDir)) continue;
  const entries = await fs.readdir(skillsDir);

  for (const skill of entries) {
    const skillPath = path.join(skillsDir, skill, 'SKILL.md');
    if (!existsSync(skillPath)) continue;

    const content = await fs.readFile(skillPath, 'utf8');
    const fm = parseFrontmatter(content);
    const issues = [];

    if (!fm) {
      issues.push({ severity: 'error', message: 'Missing YAML frontmatter' });
    } else {
      if (!fm['name']) {
        issues.push({ severity: 'error', message: 'Frontmatter missing `name` key' });
      }
      if (!fm['description']) {
        issues.push({ severity: 'warning', message: 'Frontmatter missing `description` — Claude will read the first paragraph instead (less predictable)' });
      }
      if (fm['disable-model-invocation'] !== 'true') {
        issues.push({ severity: 'warning', message: 'Missing `disable-model-invocation: true` — description is injected into every session context (High Token Impact)' });
      }
      if (!fm['allowed-tools']) {
        issues.push({ severity: 'info', message: 'No `allowed-tools` constraint — skill can use all tools (determinism and security gap)' });
      }
    }

    for (const filler of FILLERS) {
      if (content.toLowerCase().includes(filler)) {
        issues.push({ severity: 'info', message: `Contains conversational filler: "${filler}"` });
      }
    }

    allSkills.push({ skill, origin, issues });
  }
}

const skillNames = allSkills.map(s => s.skill);
const groups = discoverGroups(skillNames);

const summary = {
  total: allSkills.length,
  groups,
  errors: allSkills.flatMap(s => s.issues.filter(i => i.severity === 'error')).length,
  warnings: allSkills.flatMap(s => s.issues.filter(i => i.severity === 'warning')).length,
  infos: allSkills.flatMap(s => s.issues.filter(i => i.severity === 'info')).length,
};

console.log(JSON.stringify({ summary, skills: allSkills }, null, 2));
