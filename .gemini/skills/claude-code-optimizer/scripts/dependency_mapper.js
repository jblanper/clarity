#!/usr/bin/env node

/**
 * @fileoverview Maps dependencies between Claude Code skills by analyzing their content.
 * Identifies entry points, dead skills, and shared utilities based on cross-references.
 * Supports detection of slash commands, relative paths, and @-prefixed paths.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const claudeDir = path.join(process.cwd(), '.claude', 'skills');
const results = {
  dependencyMap: {},
  entryPoints: [],
  deadSkills: [],
  sharedUtilities: [],
  totalSkills: 0
};

try {
  if (existsSync(claudeDir)) {
    const skills = await fs.readdir(claudeDir);
    const skillContents = {};

    for (const skill of skills) {
      const skillPath = path.join(claudeDir, skill, 'SKILL.md');
      if (existsSync(skillPath)) {
        skillContents[skill] = await fs.readFile(skillPath, 'utf8');
        results.totalSkills++;
      }
    }

    const skillNames = Object.keys(skillContents);

    for (const skill of skillNames) {
      const content = skillContents[skill];
      const dependencies = new Set();

      for (const otherSkill of skillNames) {
        if (skill === otherSkill) continue;

        // Expanded detection patterns
        const patterns = [
          new RegExp(`/${otherSkill}\\b`, 'g'),                       // Slash command: /my-skill
          new RegExp(`\\.claude/skills/${otherSkill}\\b`, 'g'),       // Relative path: .claude/skills/my-skill
          new RegExp(`@\\.claude/skills/${otherSkill}\\b`, 'g'),      // Alias path: @.claude/skills/my-skill
          new RegExp(`\\[.*?\\]\\(.*?${otherSkill}.*?\\)`, 'g'),      // Markdown link: [Title](path/my-skill)
          new RegExp(`\\b${otherSkill}\\.md\\b`, 'gi')                // Filename reference: my-skill.md
        ];

        if (patterns.some(p => p.test(content))) {
          dependencies.add(otherSkill);
        }
      }

      results.dependencyMap[skill] = Array.from(dependencies);
    }

    // Entry Points: Skills that are not called by any other skill
    results.entryPoints = skillNames.filter(s => 
      !Object.values(results.dependencyMap).some(deps => deps.includes(s))
    );

    // Shared Utilities: Skills called by 3 or more other skills
    results.sharedUtilities = skillNames.filter(s => {
      const callers = Object.values(results.dependencyMap).filter(deps => deps.includes(s));
      return callers.length >= 3;
    });

    // Dead Skills: Entry points that don't call any other skills
    results.deadSkills = results.entryPoints.filter(s => results.dependencyMap[s].length === 0);
  }

  console.log(JSON.stringify(results, null, 2));
} catch (error) {
  console.error('Critical error in dependency mapper:', error.message);
  process.exit(1);
}
