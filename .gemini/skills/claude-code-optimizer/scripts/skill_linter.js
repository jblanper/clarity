#!/usr/bin/env node

/**
 * @fileoverview Lints Claude Code skills for architectural standards.
 * Verifies YAML frontmatter, conversational fillers, and the disable-model-invocation flag.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const claudeDir = path.join(process.cwd(), '.claude', 'skills');
const results = {
  groups: { Audits: 0, Sprints: 0, General: 0 },
  issues: []
};

try {
  if (existsSync(claudeDir)) {
    const skills = await fs.readdir(claudeDir);
    
    for (const skill of skills) {
      // Categorize
      if (skill.startsWith('audit-')) {
        results.groups.Audits++;
      } else if (skill.startsWith('sprint-')) {
        results.groups.Sprints++;
      } else {
        results.groups.General++;
      }

      const skillPath = path.join(claudeDir, skill, 'SKILL.md');
      if (existsSync(skillPath)) {
        const content = await fs.readFile(skillPath, 'utf8');
        
        // 1. Check for YAML frontmatter
        if (!content.startsWith('---')) {
          results.issues.push({ skill, issue: "Missing YAML frontmatter" });
        } else {
          // 2. Check for token-saving flag
          if (!content.includes('disable-model-invocation: true')) {
            results.issues.push({ 
              skill, 
              issue: "Missing disable-model-invocation: true (High Token Impact)" 
            });
          }
        }

        // 3. Check for conversational filler
        const fillers = ["please", "i will", "now let's", "let's try"];
        for (const filler of fillers) {
          if (content.toLowerCase().includes(filler)) {
            results.issues.push({ skill, issue: `Contains conversational filler: "${filler}"` });
          }
        }
      }
    }
  }

  console.log(JSON.stringify(results, null, 2));
} catch (error) {
  console.error('Critical error in skill linter:', error.message);
  process.exit(1);
}
