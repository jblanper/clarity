#!/usr/bin/env node

/**
 * @fileoverview Approximates per-session token load for a Claude Code environment.
 * 
 * Distinguishes "always-loaded" context (CLAUDE.md, MEMORY.md, non-disabled skill
 * descriptions) from "deferred" context (skills with disable-model-invocation: true,
 * which are only injected when explicitly invoked).
 *
 * The "always-loaded" total is the true per-session context tax.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import os from 'os';

// Rough approximation: ~4 chars per token for prose/markdown
const CHARS_PER_TOKEN = 4;

function countTokens(text) {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Parse YAML frontmatter from a SKILL.md string.
 * Returns an object of key: value pairs, or {} if no frontmatter found.
 */
function parseFrontmatter(content) {
  if (!content.startsWith('---')) return {};
  const end = content.indexOf('---', 3);
  if (end === -1) return {};
  const block = content.slice(3, end);
  const result = {};
  for (const line of block.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    result[key] = value;
  }
  return result;
}

/**
 * Extract the description from frontmatter, falling back to the first non-heading
 * paragraph of the skill body. This is what Claude Code injects into context for
 * non-disabled skills.
 */
function extractDescription(frontmatter, content) {
  if (frontmatter.description) return frontmatter.description;
  // Fall back to first paragraph after frontmatter
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  const firstParagraph = body.split('\n\n').find(p => p.trim() && !p.startsWith('#'));
  return firstParagraph?.trim() ?? '';
}

const projectRoot = process.cwd();
const globalRoot = path.join(os.homedir(), '.claude');

const alwaysLoaded = [];
const deferred = [];

// --- Always-loaded: CLAUDE.md files ---
for (const claudeMdPath of [
  path.join(projectRoot, 'CLAUDE.md'),
  path.join(globalRoot, 'CLAUDE.md'),
]) {
  if (existsSync(claudeMdPath)) {
    const content = await fs.readFile(claudeMdPath, 'utf8');
    alwaysLoaded.push({ file: path.relative(os.homedir(), claudeMdPath).replace(/^([^.])/, '~/$1'), tokens: countTokens(content), reason: 'loaded every session' });
  }
}

// --- Always-loaded: MEMORY.md files (auto-memory system) ---
const memoryGlob = path.join(globalRoot, 'projects');
if (existsSync(memoryGlob)) {
  const projectDirs = await fs.readdir(memoryGlob);
  for (const dir of projectDirs) {
    const memPath = path.join(memoryGlob, dir, 'memory', 'MEMORY.md');
    if (existsSync(memPath)) {
      const content = await fs.readFile(memPath, 'utf8');
      // Claude Code only loads the first 200 lines of MEMORY.md at start
      const lines = content.split('\n').slice(0, 200).join('\n');
      alwaysLoaded.push({ file: `~/.claude/projects/${dir}/memory/MEMORY.md`, tokens: countTokens(lines), reason: 'auto-memory index (first 200 lines loaded)' });
    }
  }
}

// --- Skills: always-loaded vs. deferred ---
for (const skillsDir of [
  path.join(projectRoot, '.claude', 'skills'),
  path.join(globalRoot, 'skills'),
]) {
  if (!existsSync(skillsDir)) continue;
  const skills = await fs.readdir(skillsDir);

  for (const skill of skills) {
    const skillFile = path.join(skillsDir, skill, 'SKILL.md');
    if (!existsSync(skillFile)) continue;

    const content = await fs.readFile(skillFile, 'utf8');
    const fm = parseFrontmatter(content);
    const isDeferred = fm['disable-model-invocation'] === 'true';
    const description = extractDescription(fm, content);
    const descTokens = countTokens(description);
    const origin = skillsDir.startsWith(globalRoot) ? '~/.claude/skills' : '.claude/skills';

    if (isDeferred) {
      deferred.push({ file: `${origin}/${skill}`, descriptionTokens: descTokens, reason: 'disable-model-invocation: true' });
    } else {
      alwaysLoaded.push({ file: `${origin}/${skill}`, tokens: descTokens, reason: 'description injected every session (no disable-model-invocation)' });
    }
  }
}

const totalAlwaysLoaded = alwaysLoaded.reduce((s, f) => s + f.tokens, 0);
const totalDeferred = deferred.reduce((s, f) => s + f.descriptionTokens, 0);

const impactLevel = totalAlwaysLoaded > 12000 ? 'High' : (totalAlwaysLoaded > 5000 ? 'Medium' : 'Low');

// Target calculation: Convert all non-disabled skills to deferred
const nonDisabledSkillTokens = alwaysLoaded
  .filter(f => f.file.includes('/skills/'))
  .reduce((s, f) => s + f.tokens, 0);
const targetAlwaysLoaded = totalAlwaysLoaded - nonDisabledSkillTokens;

console.log(JSON.stringify({
  totalAlwaysLoaded,
  totalDeferred,
  impactLevel,
  targetAlwaysLoaded,
  potentialSavingsTokens: totalAlwaysLoaded - targetAlwaysLoaded,
  potentialSavingsPercent: totalAlwaysLoaded > 0
    ? parseFloat(((nonDisabledSkillTokens / totalAlwaysLoaded) * 100).toFixed(1))
    : 0,
  alwaysLoaded,
  deferred,
}, null, 2));
