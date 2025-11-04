---
description: Auto-detect completed tasks and update TASKS.md
allowed-tools: Bash(git log:*), Bash(git diff:*), Read, Edit, Grep
argument-hint: [next|status]
---

# /task-update - Auto-Magic Task Completion

**Smart task tracker that detects what you just finished and updates everything automatically.**

---

## 🎯 Usage

```bash
/task-update              # Auto-detect completed task & update
/task-update next         # Suggest next task to work on
/task-update status       # Show kanban board
```

That's it! 99% of the time, you just type `/task-update` and everything happens automatically.

---

## ⚡ How It Works

### Auto-Detection Magic

When you run `/task-update`, Claude analyzes:

1. **Recent git commits** (last 24 hours)
   - Commit messages
   - Files changed
   - Number of commits

2. **Kanban DOING column** (what's currently in progress)

3. **File patterns** from task descriptions
   - Matches changed files with task "Files:" field

4. **Task descriptions** (keywords matching recent work)

**Then Claude:**
- ✅ Detects which task you completed
- ✅ Marks it `[x]` in TASKS.md
- ✅ Updates all progress counters automatically
- ✅ Moves task from DOING → DONE in Kanban
- ✅ Suggests next task from TODO

---

## 📋 Example Workflow

### Morning (Start Work)

```bash
/task-update status
```

**Output:**
```
📋 Kanban Board

TODO (5):           DOING (0):      DONE (5):
0.6.8 ExerciseDB 🔥                 0.6.6 Env vars ✅
1.10 Login screen 🟠                0.6.4 Components ✅
...                                 ...

⏭️ Next: Start 0.6.8 ExerciseDB import [L - 3-4h] 🔥
   No blockers, critical priority

Start this task? [Y/n]
```

Type `Y` → Task moves to DOING column

### After Coding (Finish Task)

```bash
/task-update
```

**Output:**
```
🔍 Analyzing recent work...

✅ Detected completion: 0.6.8 Bulk import ExerciseDB library
   Evidence:
   • 3 commits in last 2 hours
   • Files: scripts/seed-exercisedb.ts ✓
   • Matches task description

📊 Auto-updated (16 levels):
   ✓ Task marked [x] in TASKS.md
   ✓ Phase 0.6: 6/8 → 7/8 (88%)
   ✓ Overall: 27/58 → 28/58 (48%)
   ✓ Kanban: 0.6.8 moved DOING → DONE
   ✓ Progress badge updated
   ✓ Table of Contents synced
   ✓ Velocity & ETA recalculated

⏭️ Next recommended:
   1.10 Create login screen UI [M - 2h] 🟠
   Phase 1 ready to start, UI components installed

Start this task? [Y/n]
```

**Zero manual input required** ✨

---

## 🧠 Smart Features

### 1. Ambiguity Handling

If Claude detects multiple possible completions:

```
🤔 Multiple tasks detected:

Which task did you complete?
1. 1.10 Create login screen UI (4 commits, src/app/(auth)/login.tsx)
2. 1.20 Create register screen UI (2 commits, src/app/(auth)/register.tsx)

[1/2]: _
```

Just type the number. That's it.

### 2. Auto-Cascade Updates

One command updates **16 levels** automatically:

#### Core Updates (1-3)
1. ✅ Task checkbox: `[ ]` → `[x]`
2. 📊 Phase progress: `6/8` → `7/8`
3. 🎯 Overall progress: `27/58` → `28/58` (MVP scope = 58 tasks)

#### Visual Updates (4-9)
4. 📋 Kanban DOING → DONE: Move task, remove "(started)"
5. 📋 Kanban auto-rotate: If DONE > 5, drop oldest
6. 📋 Kanban progress line: Update counts
7. 📋 Kanban NEXT line: Update with new next task
8. 📛 Progress badge: Update % in badge (color if threshold)
9. 🗺️ Development Roadmap: Update phase tree visual

#### Metadata Updates (10-13)
10. 📅 "Last Updated": Set to current date (YYYY-MM-DD)
11. 📋 "Recent Completions": Add task to list (keep last 5, rotate)
12. 📊 Subsection progress: Update `0.5.B (X/M)` → `(X+1/M)`
13. ✅ Subsection emoji: Change `⚡ NEXT` → `✅ COMPLETE` if all done

#### Strategic Updates (14-16)
14. 📖 Table of Contents: Sync phase counts `(X/M)`
15. 📅 Phase Timeline table: Mark `✅ COMPLETE` if phase done, update STATUS
16. 📈 Velocity & ETA: Recalculate simple average, update ETA

**Time:** All 16 updates complete in ~2 seconds

### 3. Smart Suggestions

`/task-update next` analyzes:

- ✅ Dependencies satisfied?
- ✅ No blockers?
- ✅ Priority level
- ✅ Estimated time vs your capacity
- ✅ Critical path impact

**Suggests optimal next task** based on all factors.

---

## 📐 Update Protocol (Behind the Scenes)

When you run `/task-update`, Claude follows this protocol automatically:

### Step 1: Analyze Recent Work
```typescript
// Parse git log
const commits = git.log('--since="24 hours ago"')
const changedFiles = git.diff('--name-only HEAD~5..HEAD')

// Find tasks in DOING column
const doingTasks = kanban.DOING

// Match evidence
const mostLikelyTask = match(commits, changedFiles, doingTasks)
```

### Step 2: Confirm or Ask
```typescript
// Simple heuristics (no complex confidence %)
if (singleMatchWithStrongEvidence) {
  // Auto-proceed with confirmation
  showEvidence()
  askUser(`Detected: ${task}. Correct? [Y/n]`)
} else if (multipleCandidates) {
  // Show options
  showOptions(candidateTasks)
} else {
  // No match - ask user
  showKanbanDoing()
  askUser('Which task did you complete?')
}
```

### Step 3: Cascade Updates (16 Levels)
```typescript
// Core (1-3)
markComplete(taskId)
updatePhaseProgress()
updateOverallProgress()

// Visual (4-9)
moveKanbanDoingToDone()
rotateKanbanDone()
updateKanbanProgressLine()
updateKanbanNext()
updateProgressBadge()
updateRoadmapTree()

// Metadata (10-13)
updateLastUpdatedDate()
rotateRecentCompletions()
updateSubsectionProgress()
updateSubsectionEmoji()

// Strategic (14-16)
syncTableOfContents()
updatePhaseTimeline()
recalculateVelocityETA()

// Show report
displayImpact()
suggestNext()
```

---

## 🎨 Kanban Auto-Management

### DONE Column (Auto-Rotate)

Keeps last 5 completed tasks. When 6th task completes:

```markdown
Before:
DONE: [Task1, Task2, Task3, Task4, Task5]

After completing Task6:
DONE: [Task6, Task1, Task2, Task3, Task4]  ← Task5 auto-removed
```

**No manual cleanup needed** - oldest task automatically drops off.

### TODO Priority Queue

Top 5 tasks sorted by:
1. Priority (🔴 Critical > 🟠 High > 🟡 Medium > 🟢 Low)
2. Dependencies satisfied
3. Blocking impact (tasks blocked by this task)

Auto-refreshes when tasks complete.

---

## ⚠️ Error Handling

### No Recent Work
```
ℹ️ No recent commits detected (last 24h)

Still working on current task?
Or mark a specific task? (advanced)
```

### Task Already Complete
```
✓ Task 0.5.2 is already marked complete (2025-10-28)

Next task: 0.5.3 Install FlashList [S - 1h]
Start this task? [Y/n]
```

### Blocked Dependencies
```
⚠️ Cannot start 1.30 - Dependencies not satisfied:
   • 1.10 Create login screen (pending)
   • 1.20 Create register screen (pending)

Recommended: Complete dependencies first
Alternative: 1.40 (no blockers, similar priority)
```

---

## 🚀 Advanced Usage (Rare)

### Manual Task Specification

If auto-detect fails, you can specify:

```bash
/task-update 1.20    # Mark specific task complete
```

But 99% of the time, just `/task-update` is enough.

### Task ID Convention (New in v5.0)

**Numbering by 10s (scalable):**
- Initial tasks use multiples of 10: **1.10**, **1.20**, **1.30**, **1.40**
- Insert tasks between existing ones: **1.15**, **1.25**, **1.11-1.19**
- Example workflow:
  ```
  Initial:  1.10 Login, 1.20 Register, 1.30 Auth
  Add task: 1.10 Login, 1.20 Register, 1.25 Validation (NEW), 1.30 Auth
  ```

**Benefit:** No renumbering chaos when adding/removing tasks mid-phase

**Migration Note:** Phases 0.5 and 0.6 retain original numbering (already complete/in-progress). New phases (1-5) use spacing-by-10.

---

## 💡 Pro Tips

### Daily Workflow

```bash
# Morning
/task-update status      # See board, start task

# Work...

# After each task
/task-update             # Auto-complete, get next

# Repeat
```

**Total time**: ~10 seconds per task update

### Working on Multiple Tasks?

Kanban DOING column shows all active tasks:

```markdown
DOING:
• 0.5.2 Database schema (started 2 days ago)
• 0.5.3 FlashList (started today)
```

`/task-update` detects which one you just finished based on recent commits.

### Want to See Progress?

```bash
/task-update status
```

Shows full kanban + metrics in <2 seconds.

---

## 📚 Reference

**Format Spec**: `.claude/lib/tasks-format-spec.md` (v5.0 - MVP scope 58 tasks, spacing by 10)
**Kanban Structure**: See TASKS.md § Kanban
