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
0.5.2 DB schema 🔴                  0.5.18 Jest ✅
0.5.3 FlashList 🟡                  0.5.17 Dev tools
...                                 ...

⏭️ Next: Start 0.5.2 Database schema [M - 3-4h] 🔴
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

✅ Detected completion: 0.5.2 Implement database schema
   Evidence:
   • 6 commits in last 2 hours
   • Files: supabase/migrations/001_initial_schema.sql ✓
   • Matches task description

📊 Auto-updated:
   ✓ Task marked [x] in TASKS.md
   ✓ Phase 0.5: 6/15 → 7/15 (47%)
   ✓ Overall: 6/96 → 7/96 (7%)
   ✓ Kanban: 0.5.2 moved DOING → DONE
   ✓ Progress badge updated

⏭️ Next recommended:
   0.5.3 Install FlashList [S - 1h] 🟡
   Quick win, no dependencies

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
1. 0.5.2 Database schema (6 commits, supabase/*)
2. 0.5.3 FlashList (2 commits, package.json)

[1/2]: _
```

Just type the number. That's it.

### 2. Auto-Cascade Updates

One command updates **7 levels** automatically:

1. ✅ Task checkbox: `[ ]` → `[x]`
2. 📊 Phase progress: `6/15` → `7/15`
3. 🎯 Overall progress: `6/96` → `7/96` (badge color auto)
4. 📋 Kanban: Move DOING → DONE (auto-rotate if >5 in DONE)
5. 🗺️ Development Roadmap: Update phase tree
6. 📅 Metadata: Update "Last Updated" timestamp
7. ⏭️ Next task: Suggest from TODO based on priority + dependencies

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
if (confidence > 90%) {
  // Auto-proceed
  updateTask(mostLikelyTask)
} else if (confidence > 60%) {
  // Show evidence, ask confirmation
  askUser(`Detected: ${task}. Correct? [Y/n]`)
} else {
  // Multiple candidates
  showOptions(candidateTasks)
}
```

### Step 3: Cascade Updates
```typescript
// Update TASKS.md
markComplete(taskId)
updatePhaseProgress()
updateOverallProgress()
updateProgressBadge()
updateKanban()
updateRoadmap()
updateTimestamp()

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
⚠️ Cannot start 1.3 - Dependencies not satisfied:
   • 1.1 Create login screen (pending)
   • 1.2 Create register screen (pending)

Recommended: Complete dependencies first
Alternative: 1.4 (no blockers, similar priority)
```

---

## 🚀 Advanced Usage (Rare)

### Manual Task Specification

If auto-detect fails, you can specify:

```bash
/task-update 0.5.3    # Mark specific task complete
```

But 99% of the time, just `/task-update` is enough.

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

**Format Spec**: `.claude/lib/tasks-format-spec.md` - Validation rules
**Kanban Structure**: See TASKS.md § Kanban

---

**Version**: 2.0 (Simplified)
**Last Updated**: 2025-10-29
**Philosophy**: Maximum automation, minimum friction
