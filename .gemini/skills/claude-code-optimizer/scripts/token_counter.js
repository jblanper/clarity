#!/usr/bin/env node

/**
 * @fileoverview Approximates token counts for Claude Code memory and skills.
 * Provides efficiency metrics including impact level and savings targets.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Simple token approximation (4 characters per token)
const CHARS_PER_TOKEN = 4;

/**
 * Counts approximate tokens in a string.
 * @param {string} text - The text to analyze.
 * @returns {number} - Approximate token count.
 */
function countTokens(text) {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

const claudeDir = path.join(process.cwd(), '.claude');
const claudeMd = path.join(process.cwd(), 'CLAUDE.md');

let totalTokens = 0;
const fileReports = [];

try {
  if (existsSync(claudeMd)) {
    const content = await fs.readFile(claudeMd, 'utf8');
    const tokens = countTokens(content);
    totalTokens += tokens;
    fileReports.push({ file: 'CLAUDE.md', tokens });
  }

  if (existsSync(claudeDir)) {
    const skillsDir = path.join(claudeDir, 'skills');
    if (existsSync(skillsDir)) {
      const skills = await fs.readdir(skillsDir);
      
      for (const skill of skills) {
        const skillFile = path.join(skillsDir, skill, 'SKILL.md');
        if (existsSync(skillFile)) {
          const content = await fs.readFile(skillFile, 'utf8');
          const tokens = countTokens(content);
          totalTokens += tokens;
          fileReports.push({ file: `.claude/skills/${skill}/SKILL.md`, tokens });
        }
      }
    }
  }

  // Logic for Template data
  const impactLevel = totalTokens > 15000 ? "High" : (totalTokens > 8000 ? "Medium" : "Low");
  const targetTokens = Math.ceil(totalTokens * 0.4); // 60% reduction target
  const savingsPercent = 60;

  console.log(JSON.stringify({ 
    totalTokens, 
    impactLevel,
    targetTokens,
    savingsPercent,
    files: fileReports 
  }, null, 2));
} catch (error) {
  console.error('Critical error in token counter:', error.message);
  process.exit(1);
}
