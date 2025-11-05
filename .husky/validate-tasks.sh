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

# Validation results
ERRORS=0
WARNINGS=0

# ============================================================================
# PHASE VALIDATION (Auto-Discovery - Future-Proof)
# Dynamically discovers ALL phases from TOC and validates counters
# ============================================================================
echo "🔍 Validating phase counters (TOC vs Headers)..."

# Extract all phase identifiers from TOC (e.g., "0.5", "0.6", "1", "2", ...)
# Format: "5. [Phase 0.5: Architecture & Foundation (21/21)]"
TOC_PHASES=$(grep -oP '^\d+\. \[Phase \K[0-9.]+(?=:)' "$TASKS_FILE")

if [ -z "$TOC_PHASES" ]; then
  echo "${YELLOW}⚠️  WARNING${NC}: No phases found in TOC"
  WARNINGS=$((WARNINGS + 1))
fi

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

# Validate each phase found
if [ -n "$TOC_PHASES" ]; then
  phase_count=0
  while IFS= read -r phase; do
    phase_count=$((phase_count + 1))

    # Extract counter from TOC (first occurrence of this phase)
    TOC_COUNTER=$(grep -m 1 "Phase $phase:" "$TASKS_FILE" | grep -oP '\(\d+/\d+\)' || echo "")

    # Extract counter from Header (lines starting with ##)
    HEADER_COUNTER=$(grep "^## Phase $phase:" "$TASKS_FILE" | grep -oP '\(\d+/\d+\)' || echo "")

    # Validate: Check if both counters exist
    if [ -z "$TOC_COUNTER" ] || [ -z "$HEADER_COUNTER" ]; then
      echo "${YELLOW}⚠️  WARNING${NC}: Phase $phase has missing counter"
      echo "   TOC counter: ${TOC_COUNTER:-<missing>}"
      echo "   Header counter: ${HEADER_COUNTER:-<missing>}"
      WARNINGS=$((WARNINGS + 1))
    # Validate: Check if counters match
    elif [ "$TOC_COUNTER" != "$HEADER_COUNTER" ]; then
      echo "${YELLOW}⚠️  WARNING${NC}: Phase $phase TOC out of sync"
      echo "   TOC says: $TOC_COUNTER"
      echo "   Header says: $HEADER_COUNTER"
      echo "   ${YELLOW}Fix: Update TOC to match header${NC}"
      WARNINGS=$((WARNINGS + 1))
    else
      echo "${GREEN}✓${NC} Phase $phase TOC synced ($TOC_COUNTER)"
    fi
  done <<< "$TOC_PHASES"

  echo "${GREEN}✓${NC} Validated $phase_count phase(s)"
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
