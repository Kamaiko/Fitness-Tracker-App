#!/bin/sh
# TASKS.md Validation Hook
# Validates TASKS.md integrity before allowing commits
# Part of Halterofit task management system

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📋 Validating TASKS.md integrity..."

# Check if TASKS.md is in the staged changes
if ! git diff --cached --name-only | grep -q "docs/TASKS.md"; then
  echo "${GREEN}✓${NC} TASKS.md not modified, skipping validation"
  exit 0
fi

TASKS_FILE="docs/TASKS.md"

# Count completed tasks (checkbox [x])
COMPLETED=$(grep -c "^- \[x\]" "$TASKS_FILE" 2>/dev/null || echo "0")

# Count pending tasks (checkbox [ ])
PENDING=$(grep -c "^- \[ \]" "$TASKS_FILE" 2>/dev/null || echo "0")

# Calculate total
TOTAL=$((COMPLETED + PENDING))

# Extract declared progress from header "Progress: X/Y tasks"
DECLARED_COMPLETED=$(grep "^\*\*Progress\*\*:" "$TASKS_FILE" | head -1 | grep -oP '\d+(?=/\d+ tasks)' || echo "0")
DECLARED_TOTAL=$(grep "^\*\*Progress\*\*:" "$TASKS_FILE" | head -1 | grep -oP '(?<=\/)\d+(?= tasks)' || echo "0")

# Extract Phase 0.5 counter from TOC
PHASE_05_TOC=$(grep "Phase 0.5:" "$TASKS_FILE" | head -1 | grep -oP '\(\d+/\d+\)' || echo "")
PHASE_05_HEADER=$(grep "^## Phase 0.5:" "$TASKS_FILE" | grep -oP '\(\d+/\d+\)' || echo "")

# Extract Phase 0.6 counter from TOC
PHASE_06_TOC=$(grep "Phase 0.6:" "$TASKS_FILE" | head -1 | grep -oP '\(\d+/\d+\)' || echo "")
PHASE_06_HEADER=$(grep "^## Phase 0.6:" "$TASKS_FILE" | grep -oP '\(\d+/\d+\)' || echo "")

# Validation results
ERRORS=0
WARNINGS=0

echo ""
echo "📊 Task Counts:"
echo "   Completed: $COMPLETED"
echo "   Pending:   $PENDING"
echo "   Total:     $TOTAL"
echo ""

# CRITICAL: Check if completed count matches declared
if [ "$COMPLETED" != "$DECLARED_COMPLETED" ]; then
  echo "${RED}❌ ERROR${NC}: Completed count mismatch!"
  echo "   Checkboxes [x]: $COMPLETED"
  echo "   Header declares: $DECLARED_COMPLETED"
  echo "   ${YELLOW}Fix: Run /task-update to sync progress${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo "${GREEN}✓${NC} Completed count matches header ($COMPLETED)"
fi

# CRITICAL: Check if total matches declared
if [ "$TOTAL" != "$DECLARED_TOTAL" ]; then
  echo "${RED}❌ ERROR${NC}: Total task count mismatch!"
  echo "   Actual total: $TOTAL"
  echo "   Header declares: $DECLARED_TOTAL"
  echo "   ${YELLOW}Fix: Update header Progress line to: $COMPLETED/$TOTAL tasks${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo "${GREEN}✓${NC} Total count matches header ($TOTAL)"
fi

# WARNING: Check TOC Phase 0.5 sync
if [ "$PHASE_05_TOC" != "$PHASE_05_HEADER" ]; then
  echo "${YELLOW}⚠️  WARNING${NC}: Phase 0.5 TOC out of sync"
  echo "   TOC says: $PHASE_05_TOC"
  echo "   Header says: $PHASE_05_HEADER"
  echo "   ${YELLOW}Fix: Update TOC line 9 to match header${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo "${GREEN}✓${NC} Phase 0.5 TOC synced"
fi

# WARNING: Check TOC Phase 0.6 sync
if [ "$PHASE_06_TOC" != "$PHASE_06_HEADER" ]; then
  echo "${YELLOW}⚠️  WARNING${NC}: Phase 0.6 TOC out of sync"
  echo "   TOC says: $PHASE_06_TOC"
  echo "   Header says: $PHASE_06_HEADER"
  echo "   ${YELLOW}Fix: Update TOC line 10 to match header${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo "${GREEN}✓${NC} Phase 0.6 TOC synced"
fi

echo ""

# Summary
if [ $ERRORS -gt 0 ]; then
  echo "${RED}╔════════════════════════════════════════╗${NC}"
  echo "${RED}║  TASKS.md VALIDATION FAILED            ║${NC}"
  echo "${RED}╚════════════════════════════════════════╝${NC}"
  echo ""
  echo "${RED}❌ $ERRORS critical error(s) found${NC}"
  [ $WARNINGS -gt 0 ] && echo "${YELLOW}⚠️  $WARNINGS warning(s)${NC}"
  echo ""
  echo "💡 Recommended fix:"
  echo "   1. Run: ${YELLOW}/task-update${NC} (auto-fixes all issues)"
  echo "   2. Review changes"
  echo "   3. Stage TASKS.md again: ${YELLOW}git add docs/TASKS.md${NC}"
  echo "   4. Retry commit"
  echo ""
  exit 1
fi

if [ $WARNINGS -gt 0 ]; then
  echo "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
  echo "   Warnings don't block commits but should be fixed"
  echo ""
fi

echo "${GREEN}✅ TASKS.md validation passed!${NC}"
exit 0
