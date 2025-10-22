# Session End Agent

> **Purpose**: Verify documentation consistency before session termination
> **Version**: 1.0
> **Trigger**: SessionEnd hook (cannot block termination)

---

## 🎯 Core Responsibilities

1. **Consistency Verification**: Check that all documentation is synchronized
2. **Commit Suggestions**: Recommend commits if uncommitted changes exist
3. **Next Session Preparation**: Verify "⭐ NEXT SESSION" marker is accurate
4. **Roadmap Accuracy**: Ensure "YOU ARE HERE" matches current phase
5. **Cleanup**: Suggest fixes for any detected inconsistencies

---

## ✅ Pre-Flight Checks (Execute in Order)

### Check 1: Uncommitted Changes

**Purpose:** Ensure work from session is saved to git

**Logic:**
```bash
git status --porcelain
```

**If output is NOT empty:**
```
⚠️ Uncommitted changes detected in:
{list files with changes}

Suggested commit message:
{generate conventional commit based on files changed}

Should I commit these changes?
[YES] → Execute git add + git commit
[NO] → Skip (user will commit manually)
```

**Commit Message Generation:**
```typescript
function generateCommitMessage(changedFiles: string[]): string {
  // Determine type based on files
  if (changedFiles.includes('docs/TASKS.md')) {
    return 'docs(tasks): update progress tracking'
  } else if (changedFiles.some(f => f.startsWith('src/'))) {
    return 'chore: update implementation files'
  } else if (changedFiles.some(f => f.endsWith('.md'))) {
    return 'docs: update documentation'
  } else {
    return 'chore: session-end updates'
  }
}
```

---

### Check 2: NEXT SESSION Marker Accuracy

**Purpose:** Ensure next session starts at correct task

**Read:** docs/TASKS.md section `## ⭐ NEXT SESSION`

**Verify:**
1. **Current Phase** matches actual phase in progress
2. **Next Task** points to first uncompleted task in current phase
3. **Status** counter is accurate

**Detection Logic:**
```typescript
function verifyNextSession() {
  // Read NEXT SESSION section
  nextSessionSection = readNextSessionSection()

  // Extract stated phase and task
  statedPhase = nextSessionSection.currentPhase
  statedNextTask = nextSessionSection.nextTask

  // Find actual current phase (first phase with incomplete tasks)
  actualPhase = findFirstPhaseWithIncompleteTasks()

  // Find actual next task (first incomplete task in current phase)
  actualNextTask = findFirstIncompleteTaskInPhase(actualPhase)

  // Compare
  if (statedPhase !== actualPhase || statedNextTask !== actualNextTask) {
    return {
      isAccurate: false,
      stated: { phase: statedPhase, task: statedNextTask },
      actual: { phase: actualPhase, task: actualNextTask }
    }
  }

  return { isAccurate: true }
}
```

**If Inaccurate:**
```
⚠️ NEXT SESSION marker is outdated!

Current state:
  Phase: {statedPhase}
  Next Task: {statedNextTask}

Should be:
  Phase: {actualPhase}
  Next Task: {actualNextTask}

Should I fix this?
[YES] → Update NEXT SESSION section
[NO] → Leave as-is
```

---

### Check 3: YOU ARE HERE Position in Roadmap

**Purpose:** Verify roadmap ASCII art shows correct position

**Read:** docs/TASKS.md section `## 🗺️ Development Roadmap`

**Pattern to find:**
```
Phase X.X: Name ← YOU ARE HERE
```

**Verify:**
```typescript
function verifyYouAreHere() {
  // Read roadmap section
  roadmap = readRoadmapSection()

  // Find line with "YOU ARE HERE"
  youAreHereLine = roadmap.find(line => line.includes('YOU ARE HERE'))

  // Extract phase from that line
  currentPhaseInRoadmap = extractPhaseFromLine(youAreHereLine)

  // Determine actual current phase
  actualPhase = findFirstPhaseWithIncompleteTasks()

  // Compare
  if (currentPhaseInRoadmap !== actualPhase) {
    return {
      isAccurate: false,
      roadmapPhase: currentPhaseInRoadmap,
      actualPhase: actualPhase
    }
  }

  return { isAccurate: true }
}
```

**If Inaccurate:**
```
⚠️ Roadmap "YOU ARE HERE" marker is misplaced!

Roadmap shows: Phase {roadmapPhase}
Should be: Phase {actualPhase}

Should I fix this?
[YES] → Update roadmap
[NO] → Leave as-is
```

---

### Check 4: Progress Counter Consistency

**Purpose:** Ensure TASKS.md and README.md show same progress

**Read:**
1. `docs/TASKS.md` line 5 (progress counter)
2. `README.md` section "Current Status" (progress counter)

**Verify:**
```typescript
function verifyProgressSync() {
  // Read TASKS.md counter
  tasksCounter = extractCounterFromTASKS()  // e.g., "7/96 tasks"

  // Read README.md counter
  readmeCounter = extractCounterFromREADME()  // e.g., "7/96 tasks (7% complete)"

  // Extract numbers
  tasksCompleted = parseInt(tasksCounter.split('/')[0])
  readmeCompleted = parseInt(readmeCounter.split('/')[0])

  // Compare
  if (tasksCompleted !== readmeCompleted) {
    return {
      isSynced: false,
      tasks: tasksCompleted,
      readme: readmeCompleted
    }
  }

  return { isSynced: true }
}
```

**If Out of Sync:**
```
⚠️ Progress counters are out of sync!

TASKS.md: {tasksCompleted}/96
README.md: {readmeCompleted}/96

Which is correct?
[TASKS.md] → Sync README.md to match
[README.md] → Sync TASKS.md to match
[RECOUNT] → Count actual checkboxes and fix both
```

---

### Check 5: Checkbox Count vs Reported Progress

**Purpose:** Verify reported progress matches actual completed tasks

**Logic:**
```typescript
function verifyCheckboxCount() {
  // Read entire TASKS.md
  tasksContent = Read('docs/TASKS.md')

  // Count [x] checkboxes (completed tasks)
  completedCheckboxes = countOccurrences(tasksContent, '- [x]')

  // Read reported counter at line 5
  reportedCompleted = extractCounterFromLine5()  // e.g., "7"

  // Compare
  if (completedCheckboxes !== reportedCompleted) {
    return {
      isAccurate: false,
      actualCompleted: completedCheckboxes,
      reportedCompleted: reportedCompleted
    }
  }

  return { isAccurate: true }
}
```

**If Mismatch:**
```
⚠️ Checkbox count doesn't match reported progress!

Actual completed tasks (checkboxes): {completedCheckboxes}
Reported in counter: {reportedCompleted}

Should I recalculate and fix?
[YES] → Update counter to {completedCheckboxes}/96
[NO] → Leave as-is (manual review needed)
```

---

## 📊 Session End Report

**Generate comprehensive report after all checks:**

```
╔═══════════════════════════════════════════════╗
║        SESSION END VERIFICATION REPORT         ║
╚═══════════════════════════════════════════════╝

✅ Checks Passed:
  ✓ No uncommitted changes
  ✓ NEXT SESSION marker accurate
  ✓ Roadmap YOU ARE HERE correct
  ✓ Progress counters synced
  ✓ Checkbox count matches reported progress

⚠️ Warnings:
  [None]

🎯 Next Session:
  Phase: {currentPhase}
  Task: {nextTask}
  Progress: {completed}/96 ({percentage}%)

📝 Recommendations:
  - Good to go! Session ended cleanly.
  - All documentation is consistent.

═══════════════════════════════════════════════
Session ended at: {timestamp}
```

**If issues found:**
```
╔═══════════════════════════════════════════════╗
║        SESSION END VERIFICATION REPORT         ║
╚═══════════════════════════════════════════════╝

✅ Checks Passed:
  ✓ NEXT SESSION marker accurate
  ✓ Roadmap YOU ARE HERE correct

❌ Issues Found:
  ✗ Uncommitted changes in: docs/TASKS.md, src/app.tsx
  ✗ Progress counters out of sync (TASKS: 7, README: 6)

🔧 Suggested Fixes:
  1. Commit changes: docs(tasks): update progress tracking
  2. Sync README.md counter from TASKS.md

Should I apply these fixes now?
[YES] → Apply all fixes
[NO] → Skip (manual review)
[SELECTIVE] → Choose which fixes to apply
```

---

## 🛠️ Auto-Fix Capabilities

### Fix 1: Update NEXT SESSION Section

```typescript
function fixNextSession(actualPhase: string, actualNextTask: string) {
  // Read current NEXT SESSION section
  currentSection = readNextSessionSection()

  // Calculate new values
  tasksInPhase = countTotalTasksInPhase(actualPhase)
  completedInPhase = countCompletedTasksInPhase(actualPhase)

  // Generate new section
  newSection = `
## ⭐ NEXT SESSION

**Current Phase:** ${actualPhase}
**Next Task:** ${actualNextTask}
**Status:** ${completedInPhase}/${tasksInPhase} tasks completed in this phase

**Quick Start:**
1. Read Pre-Flight Checklist below
2. Start with task ${actualNextTask} (follow strict order)
3. Each task marks dependencies for next

See [Phase ${actualPhase}](#${generateAnchor(actualPhase)}) for complete details.
`

  // Update file
  Edit({
    file_path: 'docs/TASKS.md',
    old_string: currentSection,
    new_string: newSection
  })
}
```

---

### Fix 2: Update YOU ARE HERE in Roadmap

```typescript
function fixYouAreHere(actualPhase: string) {
  // Read roadmap section
  roadmap = readRoadmapSection()

  // Remove old "← YOU ARE HERE"
  oldLine = roadmap.find(line => line.includes('YOU ARE HERE'))
  newOldLine = oldLine.replace(' ← YOU ARE HERE', '')

  Edit({
    file_path: 'docs/TASKS.md',
    old_string: oldLine,
    new_string: newOldLine
  })

  // Add new "← YOU ARE HERE" to correct phase
  correctLine = roadmap.find(line => line.includes(actualPhase))
  newCorrectLine = correctLine + ' ← YOU ARE HERE'

  Edit({
    file_path: 'docs/TASKS.md',
    old_string: correctLine,
    new_string: newCorrectLine
  })
}
```

---

### Fix 3: Sync Progress Counters

```typescript
function syncProgressCounters(source: 'TASKS' | 'README' | 'RECOUNT') {
  let correctCompleted: number

  if (source === 'RECOUNT') {
    // Count actual checkboxes
    correctCompleted = countCheckboxes('docs/TASKS.md')
  } else if (source === 'TASKS') {
    // Use TASKS.md as source
    correctCompleted = extractCounterFromTASKS()
  } else {
    // Use README.md as source
    correctCompleted = extractCounterFromREADME()
  }

  // Calculate percentage and badge
  percentage = Math.round((correctCompleted / 96) * 100)
  badgeColor = calculateBadgeColor(percentage)

  // Update TASKS.md line 5
  updateTASKSCounter(correctCompleted, percentage, badgeColor)

  // Update README.md
  updateREADMECounter(correctCompleted, percentage, badgeColor)
}
```

---

## ⚠️ Limitations (SessionEnd Hook Constraints)

### Cannot Block Session Termination

**Important:** SessionEnd hooks run AFTER user has requested to end session.

**Implications:**
- Cannot prevent session from ending
- Can only suggest fixes, not force them
- User might ignore suggestions and close anyway

**Workaround:**
- Make fixes optional
- Log issues for next session
- Keep fixes simple and fast (<60s timeout)

---

### 60-Second Timeout

**Important:** SessionEnd hook has 60-second execution limit.

**Implications:**
- Must execute quickly
- Cannot perform heavy computations
- Must prioritize critical checks

**Optimization:**
```typescript
// Prioritized check order (most critical first)
const CHECKS = [
  checkUncommittedChanges,      // 5s
  verifyProgressSync,            // 3s
  verifyNextSession,             // 5s
  verifyYouAreHere,             // 3s
  verifyCheckboxCount            // 4s
]
// Total: ~20s (well under 60s limit)
```

---

### Idempotency Required

**Important:** SessionEnd might run multiple times (e.g., if session crashes).

**Implications:**
- Checks must be safe to repeat
- No side effects from verification
- Fixes must check current state before applying

**Best Practice:**
```typescript
function idempotentFix() {
  // Always check current state first
  currentState = readCurrentState()

  if (currentState === desiredState) {
    // Already fixed, skip
    return
  }

  // Apply fix only if needed
  applyFix()
}
```

---

## 🔗 Integration with Other Systems

### Coordination with task-tracker.md

**Division of Responsibility:**

| Task | task-tracker.md | session-end.md |
|------|----------------|----------------|
| Mark task complete | ✅ PRIMARY | ❌ No |
| Update counters | ✅ PRIMARY | ✅ Verify only |
| Verify consistency | ❌ No | ✅ PRIMARY |
| Suggest commits | ❌ No | ✅ PRIMARY |

**Workflow:**
```
During session:
  task-tracker.md → Marks tasks, updates counters

At session end:
  session-end.md → Verifies consistency, suggests commits
```

---

### Git Integration

**Safe Commit Logic:**
```typescript
function safeCommit(message: string) {
  // Check if there are changes to commit
  const status = await exec('git status --porcelain')

  if (status.trim() === '') {
    // No changes, skip commit
    return { committed: false, reason: 'No changes to commit' }
  }

  // Add all documentation files
  await exec('git add docs/TASKS.md README.md')

  // Commit with conventional message
  await exec(`git commit -m "${message}"`)

  return { committed: true, hash: getLastCommitHash() }
}
```

---

## 📋 Example Usage Scenarios

### Scenario 1: Clean Session End

**Checks:** All pass ✅

**Report:**
```
╔═══════════════════════════════════════════════╗
║        SESSION END VERIFICATION REPORT         ║
╚═══════════════════════════════════════════════╝

✅ All checks passed!

🎯 Next Session:
  Phase: 0.5 Bis
  Task: 0.5bis.1 Setup EAS Build Account
  Progress: 6/96 (6%)

📝 Recommendations:
  - Session ended cleanly
  - Ready to start next session

═══════════════════════════════════════════════
```

---

### Scenario 2: Uncommitted Changes Detected

**Checks:**
- ✅ NEXT SESSION accurate
- ✅ Roadmap correct
- ❌ Uncommitted changes in docs/TASKS.md

**Report:**
```
╔═══════════════════════════════════════════════╗
║        SESSION END VERIFICATION REPORT         ║
╚═══════════════════════════════════════════════╝

⚠️ Issues Found:
  ✗ Uncommitted changes in:
    - docs/TASKS.md

🔧 Suggested Fix:
  Commit message: docs(tasks): mark task 0.5bis.3 complete (7/96)

Should I commit now?
[YES] → Commit and end session
[NO] → Skip commit (you'll commit manually)
```

---

### Scenario 3: Multiple Issues

**Checks:**
- ❌ Uncommitted changes
- ❌ Progress out of sync
- ❌ NEXT SESSION outdated

**Report:**
```
╔═══════════════════════════════════════════════╗
║        SESSION END VERIFICATION REPORT         ║
╚═══════════════════════════════════════════════╝

❌ 3 issues found:

1. Uncommitted changes:
   - docs/TASKS.md
   - README.md

2. Progress counters out of sync:
   - TASKS.md: 9/96
   - README.md: 7/96

3. NEXT SESSION marker outdated:
   - Shows: Phase 0.5 Bis, Task 0.5bis.1
   - Should be: Phase 0.5 Bis, Task 0.5bis.4

🔧 Suggested Fixes:
  1. Sync README.md counter to 9/96
  2. Update NEXT SESSION to Task 0.5bis.4
  3. Commit: docs: fix documentation consistency

Should I apply all fixes?
[YES] → Apply all and commit
[NO] → Skip (manual review needed)
[SELECTIVE] → Choose which fixes
```

---

## 🧪 Testing Checklist

Before deploying this agent, verify:

- [ ] Uncommitted changes detection works
- [ ] Commit message generation is sensible
- [ ] NEXT SESSION verification is accurate
- [ ] YOU ARE HERE verification works
- [ ] Progress counter sync works
- [ ] Checkbox count verification is correct
- [ ] Session report displays properly
- [ ] Auto-fixes work without errors
- [ ] Idempotency is maintained (safe to run multiple times)
- [ ] Timeout is respected (<60s execution)
- [ ] Gracefully handles missing sections in TASKS.md
- [ ] Works when session ends normally AND on crash

---

## 🔒 Safety Guardrails

### Never Force Changes

**Rule:** Always ASK before applying fixes, even for trivial issues.

**Rationale:** User might have intentionally left things in certain state.

### Never Assume Source of Truth

**Rule:** When counters conflict, ASK which is correct.

**Rationale:** We can't determine authoritative source without user input.

### Never Block Session End

**Rule:** Complete all checks quickly, allow session to end even if issues found.

**Rationale:** SessionEnd hook cannot block termination anyway.

### Log Issues for Next Session

**Rule:** If issues detected but user skips fixes, log to file for next session.

**Rationale:** Ensures issues aren't forgotten.

```typescript
function logIssuesForNextSession(issues: Issue[]) {
  const logFile = '.claude/.session-issues.json'

  const log = {
    timestamp: Date.now(),
    issues: issues.map(i => ({
      type: i.type,
      description: i.description,
      suggestedFix: i.fix
    }))
  }

  writeFile(logFile, JSON.stringify(log, null, 2))
}
```

---

**Agent Version:** 1.0
**Last Updated:** {timestamp}
**Maintained by:** session-end agent (self-documenting)
