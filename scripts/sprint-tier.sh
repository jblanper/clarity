#!/usr/bin/env bash
# scripts/sprint-tier.sh — Sprint tier classifier
#
# Walks through the decision tree in docs/sprint-tier-guide.md and prints
# the exact skills to run for planning and validation.
#
# Usage: bash scripts/sprint-tier.sh

BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

divider() {
  printf "${DIM}─────────────────────────────────────────${RESET}\n"
}

section() {
  printf "\n${BOLD}%s${RESET}\n" "$1"
}

ask() {
  printf "\n  %s [y/N] " "$1"
  read -r answer
  case "$answer" in
    [yY][eE][sS]|[yY]) return 0 ;;
    *) return 1 ;;
  esac
}

printf "\n"
divider
printf "${BOLD}Sprint Tier Classifier${RESET}\n"
printf "${DIM}Answer each question. First 'yes' wins.${RESET}\n"
divider

# ── Decision tree ────────────────────────────────────────────────────────────

TIER=2
TIER_REASON="default — arch review is cheap insurance"

if ask "Does it change the data model?
     (HabitEntry, HabitState, AppConfigs, localStorage keys, export format)"; then
  TIER=1; TIER_REASON="data model change"

elif ask "Does it add new routes, navigation patterns, or new pages?"; then
  TIER=1; TIER_REASON="new routes / navigation"

elif ask "Does it introduce a new user-facing feature?
     (something that didn't exist before — not improving existing behaviour)"; then
  TIER=1; TIER_REASON="new user-facing feature"

elif ask "Does it introduce a pattern not currently in the Calma spec?
     (new visual pattern, component type, colour role, motion behaviour)"; then
  TIER=1; TIER_REASON="new Calma pattern"

elif ask "No new features, but carries risk?
     (a11y, touch targets, animation polish, compliance questions, static export risk,
      tooling with app code side-effects)"; then
  TIER=2; TIER_REASON="architectural / compliance risk"

elif ask "No new features, no risk?
     (purely docs, copy, CHANGELOG, README, skill/tooling with zero app code impact)"; then
  TIER=3; TIER_REASON="docs / copy / chore"
fi

# ── Output ───────────────────────────────────────────────────────────────────

printf "\n"
divider

case $TIER in

  1)
    printf "${BOLD}Tier 1 — Full pipeline${RESET}  ${DIM}(%s)${RESET}\n" "$TIER_REASON"
    divider

    section "PLANNING"
    printf "  1. /sprint-brief     discuss and shape scope with the PO\n"
    printf "  2. /sprint-review    runs UX + Arch in parallel\n"
    printf "        or\n"
    printf "     /sprint-ux        UX/UI design review\n"
    printf "     /sprint-arch      architecture and technical feasibility\n"
    printf "  3. /sprint-plan      produces the final executable sprint doc\n"

    section "EXECUTION"
    printf "  /sprint-kickoff      start of each coding session\n"
    printf "  [code]\n"

    section "VALIDATION"
    printf "  /sprint-arch-review  lint + tests + code review against CLAUDE.md\n"
    printf "  /sprint-validate     runs all five audits\n"
    printf "  /sprint-qa           Playwright suite + manual checklist\n"
    printf "  [manual validation by you]\n"

    section "CLOSURE"
    printf "  /calma-sync          review whether Calma spec needs updating\n"
    printf "  /deploy              full release pipeline\n"
    printf "  /sprint-retro        retrospective\n"
    ;;

  2)
    printf "${BOLD}Tier 2 — Arch-only${RESET}  ${DIM}(%s)${RESET}\n" "$TIER_REASON"
    divider

    section "PLANNING"
    printf "  1. Write sprint-NN-brief.md directly\n"
    printf "     Template: .claude/skills/sprint-brief/template.md\n"
    printf "     Keep it short: Goals · Scope · Out of scope · Open questions\n"
    printf "  2. /sprint-arch      architecture and CLAUDE.md compliance review\n"
    printf "  3. /sprint-plan      produces the final executable sprint doc\n"

    section "EXECUTION"
    printf "  /sprint-kickoff      start of each coding session\n"
    printf "  [code]\n"

    section "VALIDATION"
    printf "  /sprint-arch-review  lint + tests + code review against CLAUDE.md\n"
    printf "\n  Which domains does this sprint touch?\n"

    AUDITS=()
    ask "  Colour, contrast, or dark mode?"                            && AUDITS+=("/audit-colour")
    ask "  Typography, section labels, or spacing?"                    && AUDITS+=("/audit-typography")
    ask "  Animation, motion, or scroll behaviour?"                    && AUDITS+=("/audit-interaction")
    ask "  Copy, error messages, or UI text?"                          && AUDITS+=("/audit-microcopy")
    ask "  Components, data model, routes, or CLAUDE.md compliance?"   && AUDITS+=("/audit-arch")

    printf "\n"
    if [ ${#AUDITS[@]} -eq 0 ]; then
      printf "  No audits needed — rely on:\n"
      printf "  npm run lint && npm test && npm run build\n"
    elif [ ${#AUDITS[@]} -ge 3 ]; then
      printf "  Three or more domains — run:\n"
      for a in "${AUDITS[@]}"; do printf "  %s\n" "$a"; done
      printf "  /audit-design-overall\n"
    else
      printf "  Run:\n"
      for a in "${AUDITS[@]}"; do printf "  %s\n" "$a"; done
    fi

    printf "\n  /sprint-qa           smoke paths for changed components only\n"
    printf "  [manual validation by you]\n"

    section "CLOSURE"
    printf "  /calma-sync          only if a Calma pattern was clarified\n"
    printf "  /deploy              full release pipeline\n"
    printf "  /sprint-retro        retrospective\n"
    ;;

  3)
    printf "${BOLD}Tier 3 — No review${RESET}  ${DIM}(%s)${RESET}\n" "$TIER_REASON"
    divider

    section "PLANNING"
    printf "  No brief or review needed.\n"
    printf "  If the change warrants a doc: /sprint-plan\n"
    printf "  For a single commit: just commit directly.\n"

    section "EXECUTION"
    printf "  [code or edit docs]\n"

    section "VALIDATION"
    printf "  npm run lint && npm test && npm run build\n"
    printf "  ${DIM}If docs-only with no app code change: skip even this.${RESET}\n"

    section "CLOSURE"
    printf "  /deploy              full release pipeline\n"
    printf "  /sprint-retro        optional for very small changes\n"
    ;;

esac

printf "\n"
divider
printf "${DIM}Reference: docs/sprint-tier-guide.md${RESET}\n\n"
