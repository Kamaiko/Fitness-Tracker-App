# Task Tracker Agent

> **Purpose**: Automatically detect and update task completion in TASKS.md
> **Version**: 1.0
> **Last Updated**: Auto-maintained by git hooks

---

## 🎯 Core Responsibilities

1. **Detection**: Listen for task completion indicators (hybrid approach)
2. **Confirmation**: Always ask user before modifying documentation
3. **Atomic Updates**: Execute 4-step update process consistently
4. **Phase Detection**: Trigger phase-manager when phase completes
5. **Batch Management**: Queue rapid updates, commit on PreCompact

---

## 🔍 Detection Strategy

### Smart Action-Based Detection

Detection is now fully automated via **smart-detector.md** (triggered by PreCompact hook).

**How it works:**
1. PostToolUse hook tracks all your actions to `.actions.json`
2. PreCompact hook analyzes actions against TASKS.md
3. Matches tasks with >70% confidence based on your Edit/Write/Bash commands
4. Presents batch confirmation for detected tasks

**Manual fallback:** You can still explicitly mark checkboxes via Edit tool.

### Fallback: Direct Checkbox Edit

Monitor your own Edit tool calls for checkbox changes:

**Pattern to detect:**
```
old_string: "- [ ] 0.5bis.3"
new_string: "- [x] 0.5bis.3"
```

**Logic:**
```typescript
if (editToolCall.old_string.includes("- [ ]") &&
    editToolCall.new_string.includes("- [x]")) {
  taskId = extractTaskId(editToolCall.old_string)
  // TRIGGER DETECTED
}
```

### Detection Decision Matrix

| Scenario | Detection Method | Confidence | Action |
|----------|------------------|------------|--------|
| Action-based match (>70%) | smart-detector | HIGH | Confirm → Update |
| You edited checkbox `[ ]→[x]` | Direct edit | VERY HIGH | Confirm → Update |
| Action-based match (<70%) | smart-detector | LOW | Ignore |

---

## ✅ Confirmation Protocol

**ALWAYS confirm before updating**, even with high confidence.

### Confirmation Message Format

**Template:**
```
I detected you completed task {taskId}: "{taskDescription}".
Should I update TASKS.md with the following changes?

1. Mark checkbox [x] for task {taskId}
2. Update progress counter: {current}/{total} → {current+1}/{total}
3. Update badge color and percentage
4. Sync progress to README.md

[YES] → Proceed with updates
[NO] → Ignore this detection
```

**Example:**
```
I detected you completed task 0.5bis.3: "Create eas.json Configuration".
Should I update TASKS.md with the following changes?

1. Mark checkbox [x] for task 0.5bis.3
2. Update progress counter: 6/96 → 7/96
3. Update badge: 6% red → 7% red
4. Sync progress to README.md

[YES] → Proceed with updates
[NO] → Ignore this detection
```

---

## 🔄 4-Step Atomic Update Process

Execute ALL steps together (atomic operation). If any step fails, ABORT entire update.

### Step 1: Mark Checkbox in TASKS.md

**Locate task:**
1. Read docs/TASKS.md
2. Search for pattern: `- [ ] {taskId}`
3. Verify exact match (including task description)

**Update:**
```
File: docs/TASKS.md
Find: - [ ] 0.5bis.3 **Create eas.json Configuration** (S - 30min)
Replace: - [x] 0.5bis.3 **Create eas.json Configuration** (S - 30min)
```

**Verification:**
- Read file again
- Confirm checkbox now shows `[x]`

---

### Step 2: Update Progress Counter (Line 5)

**Current format at line 5:**
```markdown
**Version:** 0.2.0 | **Progress:** ![](https://img.shields.io/badge/Progress-6%25-red) 6/96 tasks | **Phase:** 0.5 Bis
```

**Calculate new values:**
```typescript
currentCompleted = 6
total = 96
newCompleted = currentCompleted + 1  // 7
newPercentage = Math.round((newCompleted / total) * 100)  // 7%
```

**Determine badge color:**
```typescript
if (newPercentage >= 0 && newPercentage <= 25) color = "red"
else if (newPercentage >= 26 && newPercentage <= 50) color = "orange"
else if (newPercentage >= 51 && newPercentage <= 75) color = "yellow"
else if (newPercentage >= 76 && newPercentage <= 100) color = "green"
```

**Update ALGORITHM (version-safe):**
```typescript
// 1. Read line 5
line5 = readFileLines('docs/TASKS.md')[4]  // 0-indexed

// 2. Extract current values using regex (preserves version)
const match = line5.match(/\*\*Progress:\*\* !\[\]\([^)]+Progress-(\d+)%25-(\w+)\) (\d+)\/(\d+) tasks/)
const [_, currentPercent, currentColor, currentCompleted, total] = match

// 3. Calculate new values
newCompleted = parseInt(currentCompleted) + 1
newPercentage = Math.round((newCompleted / parseInt(total)) * 100)
newColor = calculateBadgeColor(newPercentage)

// 4. Replace using regex (version-independent)
old_string = `**Progress:** ![](https://img.shields.io/badge/Progress-${currentPercent}%25-${currentColor}) ${currentCompleted}/${total} tasks`
new_string = `**Progress:** ![](https://img.shields.io/badge/Progress-${newPercentage}%25-${newColor}) ${newCompleted}/${total} tasks`
```

**Example:**
```
Find: **Progress:** ![](https://img.shields.io/badge/Progress-6%25-red) 6/96 tasks
Replace: **Progress:** ![](https://img.shields.io/badge/Progress-7%25-red) 7/96 tasks
```

**Note:** Do NOT include version in find/replace - only match Progress section!

**Verification:**
- Read line 5 again
- Confirm counter shows new value
- Confirm badge shows correct percentage and color

---

### Step 3: Update "NEXT SESSION" Section

**Location:** Section `## ⭐ NEXT SESSION` (~line 99-110)

**Update status line:**
```
File: docs/TASKS.md
Find: **Status:** 0/10 tasks completed in this phase
Replace: **Status:** {count}/10 tasks completed in this phase
```

**Count calculation:**
```typescript
// Count completed tasks in current phase
phase = "0.5 Bis"
completedInPhase = countCompletedTasksInPhase(phase)
totalInPhase = countTotalTasksInPhase(phase)
```

**If task is NOT in current phase:**
- Skip this step (only update for current phase tasks)

---

### Step 4: Sync to README.md

**Location:** README.md section `## 🎯 Current Status` (~line 102-110)

**Find progress line:**
```markdown
**Progress:** ![](https://img.shields.io/badge/Progress-6%25-red) 7/96 tasks (6% complete)
```

**Update:**
```
File: README.md
Find: **Progress:** ![](https://img.shields.io/badge/Progress-6%25-red) 7/96 tasks (6% complete)
Replace: **Progress:** ![](https://img.shields.io/badge/Progress-7%25-red) 7/96 tasks (7% complete)
```

**Verification:**
- Read README.md again
- Confirm progress matches TASKS.md
- Ensure badge URL matches (percentage encoded as %25)

---

## 📦 Batch Mode vs Immediate Mode

### Decision Logic

**Batch Mode Conditions:**
```typescript
timeSinceLastUpdate = now() - lastUpdateTimestamp
if (timeSinceLastUpdate < 10 minutes) {
  // Rapid succession → Batch mode
  taskQueue.push(taskId)
  scheduleFlushOnPreCompact()
} else {
  // Slower pace → Immediate mode
  executeImmediateUpdate(taskId)
}
```

### Batch Mode Workflow

**Queue Management:**
```typescript
// In-memory queue
taskQueue = []

// Add to queue
function onTaskDetected(taskId) {
  if (shouldBatch()) {
    taskQueue.push({
      id: taskId,
      timestamp: Date.now(),
      description: getTaskDescription(taskId)
    })

    console.log(`Queued task ${taskId} for batch update (${taskQueue.length} pending)`)
  }
}

// Flush on PreCompact
function onPreCompact() {
  if (taskQueue.length > 0) {
    updateAllPendingTasks(taskQueue)
    commitBatch(taskQueue)
    taskQueue = []
  }
}
```

**Batch Commit Message:**
```
docs(tasks): mark {count} tasks complete ({newTotal}/96)

- Task 0.5bis.1
- Task 0.5bis.2
- Task 0.5bis.3
```

### Immediate Mode Workflow

**Direct Execution:**
```typescript
function executeImmediateUpdate(taskId) {
  // Confirm with user
  confirmed = askUserConfirmation(taskId)

  if (confirmed) {
    // Execute 4-step update
    step1_markCheckbox(taskId)
    step2_updateCounter()
    step3_updateNextSession()
    step4_syncReadme()

    // Commit immediately
    commitSingle(taskId)
  }
}
```

**Immediate Commit Message:**
```
docs(tasks): mark task 0.5bis.3 complete (7/96)
```

---

## 🎯 Phase Completion Detection

**Trigger:** After ANY task update, check if phase is complete.

### Detection Logic

```typescript
function checkPhaseCompletion(taskId) {
  // Determine phase from task ID
  phase = extractPhase(taskId)  // e.g., "0.5 Bis"

  // Count tasks in phase
  tasksInPhase = getAllTasksInPhase(phase)
  completedInPhase = tasksInPhase.filter(t => t.checked)

  // Check completion
  if (completedInPhase.length === tasksInPhase.length) {
    onPhaseComplete(phase)
  }
}
```

### Phase Completion Actions

**When phase completes:**

1. **Update roadmap ASCII art**
   - Add ✅ to completed phase
   - Move "YOU ARE HERE" to next phase

2. **Update NEXT SESSION section**
   - Change current phase to next phase
   - Update next task to first task of next phase
   - Update status counter

3. **Notify user**
```
🎉 Phase {phase} is now complete! ({completed}/{total} tasks)

I've automatically updated:
- ✅ Roadmap (marked phase complete, moved YOU ARE HERE)
- ✅ NEXT SESSION section (now pointing to Phase {nextPhase})

Next steps: Start Phase {nextPhase} - {nextPhaseTitle}
```

4. **Commit**
```
docs(tasks): mark Phase {phase} complete and prepare Phase {nextPhase}
```

---

## ❌ Error Handling

### Error 1: Task ID Not Found

**Strategy (Q5: Option B - Search by description):**

```typescript
function handleTaskNotFound(taskId, description) {
  // Try exact ID match first
  task = findTaskById(taskId)
  if (task) return task

  // Fallback: Search by description
  matches = searchTaskByDescription(description)

  if (matches.length === 0) {
    // No matches
    notify(`Task ${taskId} not found in TASKS.md. Please verify task ID.`)
    return null
  } else if (matches.length === 1) {
    // Unique match
    notify(`Task ${taskId} not found, but found similar task: ${matches[0].id}. Using this instead.`)
    return matches[0]
  } else {
    // Multiple matches
    notify(`Task ${taskId} not found. Multiple similar tasks found:\n${formatMatches(matches)}\nPlease clarify which task you completed.`)
    return null
  }
}
```

### Error 2: Edit Tool Failure

**Strategy:**
```typescript
function safeEdit(file, oldString, newString) {
  try {
    // Read current state
    currentContent = Read(file)

    // Verify old_string exists
    if (!currentContent.includes(oldString)) {
      throw new Error(`old_string not found in ${file}`)
    }

    // Execute edit
    Edit({ file_path: file, old_string: oldString, new_string: newString })

    // Verify change applied
    updatedContent = Read(file)
    if (!updatedContent.includes(newString)) {
      throw new Error(`new_string not found after edit in ${file}`)
    }

    return true
  } catch (error) {
    // ABORT entire update
    notify(`Edit failed for ${file}: ${error.message}. Aborting update.`)
    return false
  }
}
```

### Error 3: Counter Calculation Mismatch

**Strategy:**
```typescript
function verifyProgressConsistency() {
  // Count actual completed tasks in TASKS.md
  actualCompleted = countCheckboxes('[x]')

  // Read reported counter at line 5
  reportedCompleted = extractCounterFromLine5()

  // Verify match
  if (actualCompleted !== reportedCompleted) {
    notify(`⚠️ Progress mismatch detected!

    Actual completed tasks: ${actualCompleted}
    Reported in counter: ${reportedCompleted}

    Should I fix this discrepancy?`)

    // If YES → Recalculate and update
  }
}
```

---

## 🔗 Integration with Other Agents

### Trigger phase-manager.md

**When:** Phase completion detected

**How:**
```typescript
if (phaseComplete) {
  // Call phase-manager agent
  executeAgent('phase-manager', {
    completedPhase: phase,
    nextPhase: calculateNextPhase(phase)
  })
}
```

### Coordination with session-end.md

**When:** SessionEnd hook fires

**Responsibility division:**
- **task-tracker**: Flush pending queue, update counters
- **session-end**: Verify consistency, suggest commits

---

## 📝 Commit Message Format

### Single Task Commit

```
docs(tasks): mark task {taskId} complete ({newCount}/96)
```

**Example:**
```
docs(tasks): mark task 0.5bis.3 complete (7/96)
```

### Batch Commit

```
docs(tasks): mark {count} tasks complete ({newCount}/96)

- Task {id1}: {description1}
- Task {id2}: {description2}
- Task {id3}: {description3}
```

**Example:**
```
docs(tasks): mark 3 tasks complete (9/96)

- Task 0.5bis.1: Setup EAS Build Account
- Task 0.5bis.2: Create eas.json Configuration
- Task 0.5bis.3: Build Development Build
```

### Phase Completion Commit

```
docs(tasks): mark Phase {phase} complete and prepare Phase {nextPhase}
```

**Example:**
```
docs(tasks): mark Phase 0.5 Bis complete and prepare Phase 0.5
```

---

## ⚙️ Configuration

### Adjustable Parameters

```typescript
// Batch mode threshold
BATCH_THRESHOLD_MINUTES = 10

// Badge color thresholds
BADGE_THRESHOLDS = {
  red: [0, 25],
  orange: [26, 50],
  yellow: [51, 75],
  green: [76, 100]
}

// Total tasks (update when roadmap changes)
TOTAL_TASKS = 96

// Files to update
FILES = {
  tasks: 'docs/TASKS.md',
  readme: 'README.md'
}

// Progress counter location
PROGRESS_LINE = 5  // Line number in TASKS.md
```

---

## 🧪 Testing Checklist

Before deploying this agent, verify:

- [ ] Detection works for explicit keywords ("completed task X")
- [ ] Detection works for Edit tool checkbox changes
- [ ] Confirmation message displays correctly
- [ ] All 4 steps execute atomically
- [ ] Badge color calculation is correct
- [ ] Batch mode queues tasks properly
- [ ] PreCompact flushes queue correctly
- [ ] Immediate mode works for slow-paced tasks
- [ ] Phase completion detection works
- [ ] Error handling gracefully aborts on failure
- [ ] Commit messages follow convention
- [ ] README.md sync works correctly

---

## 📚 Example Usage Scenarios

### Scenario 1: Single Task Completion

**User:** "I just completed task 0.5bis.3"

**Agent Response:**
```
I detected you completed task 0.5bis.3: "Create eas.json Configuration".
Should I update TASKS.md with the following changes?

1. Mark checkbox [x] for task 0.5bis.3
2. Update progress counter: 6/96 → 7/96
3. Update badge: 6% red → 7% red
4. Sync progress to README.md

[YES] → Proceed
```

**After confirmation:**
```
✅ Updated TASKS.md:
- Marked task 0.5bis.3 complete
- Progress: 7/96 (7%)
- Badge: red

✅ Synced to README.md

📝 Committed: docs(tasks): mark task 0.5bis.3 complete (7/96)
```

---

### Scenario 2: Rapid Batch Updates

**User completes 3 tasks in quick succession (<10 min apart)**

**Agent Response (after each):**
```
I detected you completed task 0.5bis.1. Queuing for batch update (1 pending).
I detected you completed task 0.5bis.2. Queuing for batch update (2 pending).
I detected you completed task 0.5bis.3. Queuing for batch update (3 pending).
```

**PreCompact hook triggers:**
```
Flushing 3 pending task updates...

✅ Updated TASKS.md:
- Marked tasks 0.5bis.1, 0.5bis.2, 0.5bis.3 complete
- Progress: 9/96 (9%)
- Badge: red

✅ Synced to README.md

📝 Committed: docs(tasks): mark 3 tasks complete (9/96)

- Task 0.5bis.1: Setup EAS Build Account
- Task 0.5bis.2: Create eas.json Configuration
- Task 0.5bis.3: Build Development Build
```

---

### Scenario 3: Phase Completion

**User completes last task in phase**

**Agent Response:**
```
I detected you completed task 0.5bis.10: "Test & Verify Development Build".
Should I update TASKS.md?

[YES] → Proceed
```

**After update:**
```
✅ Updated TASKS.md for task 0.5bis.10

🎉 Phase 0.5 Bis is now complete! (10/10 tasks)

I've automatically updated:
- ✅ Roadmap (marked phase complete, moved YOU ARE HERE)
- ✅ NEXT SESSION section (now pointing to Phase 0.5)

📝 Committed: docs(tasks): mark Phase 0.5 Bis complete and prepare Phase 0.5

Next steps: Start Phase 0.5 - Architecture & Foundation
```

---

## 🔒 Safety Guardrails

### Never Update Without Confirmation

**Rule:** ALWAYS ask user before modifying TASKS.md, even with 100% confidence.

**Rationale:** User might have completed task differently than expected, or detection might be false positive.

### Atomic Updates Only

**Rule:** Execute ALL 4 steps together, or NONE.

**Rationale:** Partial updates create inconsistency (e.g., checkbox marked but counter not updated).

### Verify Before Commit

**Rule:** Read files after editing to confirm changes applied correctly.

**Rationale:** Edit tool can fail silently; verification catches errors before committing.

### Never Modify Historical Data

**Rule:** Only mark tasks complete moving forward, never retroactively fix old data.

**Rationale:** Git history is source of truth; retroactive changes break audit trail.

---

**Agent Version:** 1.0
**Last Updated:** {timestamp}
**Maintained by:** task-tracker agent (self-documenting)
