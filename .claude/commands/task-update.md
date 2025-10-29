# /task-update - Intelligent Task Management System

**Description**: Professional task progress tracker with auto-validation and smart cascade updates

---

## 🎯 Usage

### Basic Commands

```bash
/task-update complete 0.5.2              # Mark task as completed
/task-update start 1.3                   # Mark task as in progress
/task-update block 2.1 "waiting on API"  # Mark task as blocked with reason
/task-update unblock 2.1                 # Remove blocker from task
```

### Advanced Commands

```bash
/task-update status                      # Show current sprint dashboard
/task-update velocity                    # Calculate velocity metrics
/task-update next                        # Suggest next task to work on
/task-update validate                    # Validate TASKS.md format
```

---

## ⚡ Intelligent Features

### 1. Smart Validation ✓
- Verifies task ID exists in TASKS.md
- Detects unsatisfied dependencies before allowing completion
- Warns if marking task complete without acceptance criteria checked
- Prevents circular dependency creation
- Validates all file references exist

### 2. Auto-Cascade Updates 🔄
When you complete a task, the system automatically updates:
- ✅ Task status: `[ ]` → `[x]`
- 📊 Phase progress: `6/15` → `7/15` (40% → 47%)
- 🎯 Overall progress: `6/96` → `7/96` (6% → 7%)
- 🏆 Executive Summary: Add to "Recent Completions"
- ⏭️ Current Sprint: Move to "Completed This Week"
- 🗺️ Development Roadmap: Update phase tree visualization
- 🔓 Unblock dependent tasks automatically
- 📅 Update timeline estimates based on velocity
- ⚡ Recalculate velocity metrics

### 3. Smart Insights 💡
After each update, displays:
```
✅ Task 0.5.2 marked complete

📊 Impact Analysis:
   Phase 0.5: 6/15 → 7/15 (40% → 47%)
   Overall: 6/96 → 7/96 (6% → 7%)
   Phase 0.5 ETA: ~2 weeks (based on current velocity)

🔓 Unblocked Tasks:
   • 0.5.3 can now start (dependency 0.5.2 resolved)

⏭️ Next Recommended:
   1. 0.5.3 Install FlashList (0 blockers, 1h, 🟡 Medium)
   2. 0.5.6 Install simple-statistics (0 blockers, 30min, 🟡 Medium)

⚡ Velocity: 3.5 tasks/week (last 2 weeks)
📈 Trend: ▲ Improving (was 2.5 tasks/week)
```

### 4. Conflict Detection ⚠️
- Warns if task already completed
- Detects circular dependencies (A → B → A)
- Alerts if marking blocked task as complete
- Verifies timeline coherence
- Checks for orphaned tasks (referencing non-existent dependencies)

---

## 🔧 Execution Protocol

**CRITICAL**: Follow these steps EXACTLY in order. Do NOT skip steps.

### Step 1: Parse & Read

```markdown
1. Parse command arguments:
   - action: complete|start|block|unblock|status|velocity|next|validate
   - taskId: e.g., "0.5.2"
   - options: additional parameters (e.g., blocker reason)

2. Read required files:
   - docs/TASKS.md (complete file)
   - .claude/lib/tasks-format-spec.md (validation rules)

3. Extract current state:
   - Total tasks count (should be 96 for Halterofit v0.1.0)
   - Completed tasks count
   - Phase-specific progress
   - Current sprint data
   - Recent completions list
```

### Step 2: Validate

```markdown
**Pre-flight validation checks**:

✓ Task ID Format:
  - Matches pattern: ^\d+(\.\d+)?(\.[A-Z])?(\.\d+)?$
  - Examples: 0.5.2, 0.5.A.3, 1.3, 0.5bis.1

✓ Task Exists:
  - Task ID found in TASKS.md
  - Task has proper checkbox format: - [ ] or - [x]

✓ Action Validity:
  - complete: Task must be [ ] (pending) or 🟦 (in progress)
  - start: Task must be [ ] (pending)
  - block: Task must not already be blocked
  - unblock: Task must currently be blocked

✓ Dependencies:
  - All dependencies exist as valid task IDs
  - All dependencies are completed (if action is 'complete')
  - No circular dependencies detected

✓ Acceptance Criteria (if task is Critical 🔴):
  - Acceptance criteria section present
  - Warn if marking complete without all criteria checked
  - Block if critical task missing acceptance criteria
```

### Step 3: Execute Update

```markdown
**Update task status**:

FOR action = 'complete':
1. Change checkbox: - [ ] → - [x]
2. Add completion timestamp (if not present)
3. Check all acceptance criteria (if present)

FOR action = 'start':
1. Change status indicator: ⬜ → 🟦
2. Move to "In Progress" in Current Sprint
3. Add start timestamp

FOR action = 'block':
1. Change status indicator: current → 🔴
2. Add blocker reason to task
3. Move to "Blocked Tasks" in Current Sprint
4. Alert about impact on dependent tasks

FOR action = 'unblock':
1. Remove 🔴 status indicator
2. Clear blocker reason
3. Move back to "Up Next" in Current Sprint
```

### Step 4: Cascade Updates

```markdown
**Calculate and apply cascading changes**:

Level 1 - Phase Metrics:
  completed = count([x] checkboxes in phase)
  total = count(all tasks in phase)
  progress = floor((completed / total) * 100)

  Update: "Phase X.Y: A/B tasks" → "Phase X.Y: (A±1)/B tasks"
  Update: "(X%)" → "((X±N)%)"

Level 2 - Overall Metrics:
  completedOverall = count([x] checkboxes in entire document)
  totalOverall = 96  // Fixed for Halterofit v0.1.0
  progressOverall = floor((completedOverall / totalOverall) * 100)

  Update: "X/96 tasks (Y%)" → "(X±1)/96 tasks ((Y±N)%)"

  Badge color:
    if progressOverall < 25: color = 'red'
    elif progressOverall < 75: color = 'yellow'
    else: color = 'green'

  Update badge: ![](https://img.shields.io/badge/Progress-X%25-COLOR)

Level 3 - Executive Summary:
  Add to "Recent Completions" (max 5, FIFO):
    - "TASK_ID - Task title"

  Remove from "This Week's Focus" (if present)

Level 4 - Current Sprint:
  IF action = 'complete':
    Move from "In Progress" to "Completed This Week"
    Update "Up Next" (next prioritized task)

  IF action = 'start':
    Move from "Up Next" to "In Progress"

  Unblock dependent tasks:
    FOR each task WITH dependencies including completedTaskId:
      IF all dependencies now satisfied:
        Remove 🔴 blocker
        Add to "Unblocked Tasks" in report

Level 5 - Development Roadmap:
  Update ASCII tree:
    "Phase X.Y: Architecture & Foundation (A/B tasks)"
    → "Phase X.Y: Architecture & Foundation ((A±1)/B tasks)"

Level 6 - Sprint Metrics:
  Velocity calculation:
    completedThisWeek = count(tasks in "Completed This Week")
    completedLast4Weeks = count(tasks completed in last 28 days)
    avgVelocity = completedLast4Weeks / 4

  ETA calculation:
    remainingTasksInPhase = phaseTotal - phaseCompleted
    weeksRemaining = ceil(remainingTasksInPhase / avgVelocity)

  Update: "ETA: X weeks" → "ETA: Y weeks"

Level 7 - Metadata:
  Update "Last Updated": YYYY-MM-DD

  IF phase completed:
    Update "Next Milestone": next phase name
```

### Step 5: Validate Format

```markdown
**Post-update validation**:

✓ Markdown syntax valid:
  - No broken checkbox syntax
  - Headings properly formatted
  - Lists properly indented

✓ Links and anchors:
  - Table of contents anchors match section headings
  - All internal links resolve
  - No broken references

✓ Counts accurate:
  - Phase progress matches actual checkboxes
  - Overall progress matches actual checkboxes
  - "Recent Completions" count ≤ 5

✓ Consistency:
  - All metadata timestamps updated
  - Sprint metrics recalculated
  - Badge color matches percentage
```

### Step 6: Generate Report

```markdown
**Output smart insights**:

Display formatted report:
  ✅ Task TASK_ID marked [ACTION]

  📊 Impact Analysis:
     Phase X.Y: A/B → C/D (X% → Y%)
     Overall: E/F → G/H (M% → N%)
     Phase X.Y ETA: ~Z weeks

  🔓 Unblocked Tasks: (if any)
     • TASK_ID description (dependency resolved)

  ⏭️ Next Recommended:
     1. TASK_ID Title (blockers, est, priority)
     2. TASK_ID Title (blockers, est, priority)

  ⚡ Velocity: X.Y tasks/week
  📈 Trend: ▲/▼/➡️ [Improving/Declining/Stable]

  🔴 Warnings: (if any)
     • Acceptance criteria not all checked
     • Task was blocked, verify resolution
```

---

## 📚 Advanced Commands

### `/task-update status`

Shows current sprint dashboard:

```
⭐ Current Sprint Status

Sprint Goal: Complete Phase 0.5 Infrastructure Setup
Duration: Week of 2025-10-29 (Day 3/7)
Capacity: 1 developer • 20h/week • 12h used (60%)

🟦 In Progress (1):
  • 0.5.2 Implement database schema (started 2 days ago)

⬜ Up Next (3):
  1. 0.5.3 Install FlashList (0 blockers, 1h)
  2. 0.5.6 Install simple-statistics (0 blockers, 30min)
  3. 0.5.4 Install expo-image (0 blockers, 1h)

✅ Completed This Week (5):
  • 0.5.1, 0.5.7, 0.5.8, 0.5.17, 0.5.18

🔴 Blocked (0):
  None

📊 Sprint Metrics:
  Velocity: 5 tasks this week (avg 3.5/week)
  Burndown: 6/15 done (40%), 9 remaining
  ETA: Sprint on track to complete in 2 weeks
```

### `/task-update velocity`

Shows velocity analytics:

```
⚡ Velocity Analytics

Last 7 days:   5 tasks completed
Last 30 days:  14 tasks completed
Average:       3.5 tasks/week

By Size:
  [S] Small:  avg 1.5h actual vs 1.5h estimated (100%)
  [M] Medium: avg 4.2h actual vs 4.5h estimated (93%)
  [L] Large:  avg 12h actual vs 12h estimated (100%)

Trend: ▲ Improving
  Week 1: 2 tasks
  Week 2: 3 tasks
  Week 3: 5 tasks ← current

Phase 0.5 ETA: 2 weeks (9 tasks @ 3.5/week)
Overall MVP ETA: 13 weeks (90 tasks @ 7/week projected)
```

### `/task-update next`

Suggests optimal next task:

```
⏭️ Recommended Next Task

**0.5.2** Implement database schema in Supabase
  Priority: 🔴 Critical
  Size: [M] 3-4h
  Dependencies: 0.5.1 ✅ (satisfied)
  Blocks: 12 tasks in Phase 1+ (high impact)

  Why this task?
  • Critical priority (P0)
  • All dependencies satisfied
  • Blocks most future work
  • Estimated within sprint capacity (8h remaining)

Alternative tasks (if blocked):
  1. 0.5.6 Install simple-statistics [S - 30min] 🟡
  2. 0.5.3 Install FlashList [S - 1h] 🟡
```

### `/task-update validate`

Validates TASKS.md format:

```
🔍 Validating TASKS.md format...

✓ Structure: All required sections present
✓ Task IDs: All unique and valid format
✓ Dependencies: No circular or orphaned dependencies
✓ Progress: Counts accurate (6/96 = 6%)
✓ Metadata: Timestamps and badges up-to-date
✓ Markdown: Syntax valid, no broken links

⚠️ Warnings (2):
  • Task 0.5.9 is Critical but missing acceptance criteria
  • Sprint last updated 3 days ago (update recommended)

✅ Format validation passed (2 warnings)
```

---

## 🚨 Error Handling

### Common Errors

**Error**: Task ID not found
```
❌ Error: Task ID "0.5.99" not found in TASKS.md

Suggestions:
  • Check task ID format (e.g., 0.5.2, not 05.2)
  • Verify task exists in correct phase section
  • Use /task-update validate to see all tasks
```

**Error**: Dependencies not satisfied
```
❌ Error: Cannot complete task 1.3

Reason: Unresolved dependencies
  • 1.1 (pending) - must complete first
  • 1.2 (in progress) - must complete first

Suggestion: Complete dependencies or remove dependency link
```

**Error**: Circular dependency detected
```
❌ Error: Circular dependency detected

Chain: 0.5.2 → 0.5.3 → 0.5.5 → 0.5.2

Action: Cannot add dependency. Would create infinite loop.

Suggestion: Review dependency chain and remove circular reference
```

**Error**: Task already completed
```
❌ Error: Task 0.5.1 is already marked complete

Completed: 2025-10-25
Action: No update needed

Suggestion: Use /task-update validate to see current status
```

---

## 🎓 Best Practices

### When to Update

```markdown
✅ DO:
- Update immediately after completing work
- Mark "in progress" when starting task
- Add blocker as soon as identified
- Include notes on deviations from plan

❌ DON'T:
- Batch updates (updating multiple tasks at once)
- Forget cascade updates (let command handle it)
- Mark complete without testing
- Skip validation step
```

### Task Completion Checklist

```markdown
Before marking task complete:

1. ✓ All acceptance criteria satisfied
2. ✓ Files created/modified as specified
3. ✓ Tests pass (if applicable)
4. ✓ Code committed to git
5. ✓ Documentation updated (if needed)
6. ✓ No known blockers remaining

Then run: /task-update complete TASK_ID
```

### Sprint Planning

```markdown
Start of week:
1. Run /task-update status
2. Review "Up Next" queue
3. Move top 3-5 tasks to "In Progress"
4. Verify no blockers
5. Estimate hours vs capacity

End of week:
1. Run /task-update velocity
2. Review completed vs planned
3. Adjust next week's plan
4. Update sprint goal if needed
```

---

## 📖 Reference

**Format Specification**: See `.claude/lib/tasks-format-spec.md` for complete validation rules and format standards.

**Task Templates**: See `.claude/lib/task-templates/` for reusable task templates.

**Analytics**: See `.claude/lib/task-analytics.md` for velocity formulas and metrics definitions.

---

**Version**: 1.0
**Last Updated**: 2025-10-29
**Maintained by**: Claude AI + Halterofit Team
