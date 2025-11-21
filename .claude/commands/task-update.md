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

That's it! 99% of the time, just `/task-update` and everything happens automatically.

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
- ✅ Updates Kanban automatically (DOING → DONE)
- ✅ Checks if sub-section is complete → triggers CHANGELOG migration
- ✅ Updates "Last Updated" date
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
1.10 Login screen                   0.6.8 ExerciseDB ✅
1.11 Register      screen                   0.6.10 Schema fix ✅
...                                 ...

⏭️ Next: Start 1.10 Login screen [M - 2h]
   No blockers, high priority

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

✅ Detected completion: 1.10 Create login screen UI
   Evidence:
   • 3 commits in last 2 hours
   • Files: src/app/(auth)/login.tsx ✓
   • Matches task description

📊 Auto-updated:
   ✓ Task marked [x] in TASKS.md
   ✓ Kanban: 1.10 moved DOING → DONE
   ✓ Last Updated: 2025-11-20

⏭️ Next recommended:
   1.11 Create register screen UI [M - 2h]
   Similar task, UI components ready

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

### 2. Auto-Cascade Updates (6 Levels)

One command updates **6 levels** automatically:

#### Core Updates (1-2)

1. ✅ Task checkbox: `[ ]` → `[x]`
2. 📅 Last Updated: Set to current date (YYYY-MM-DD)

#### Kanban Updates (3-5)

3. 📋 Kanban DOING → DONE: Move task, remove "(started)"
4. 📋 Kanban auto-rotate: If DONE > 5, drop oldest
5. 📋 Update TODO: Remove completed task if present

#### Migration Check (6)

6. 🔄 Check sub-section complete: If 100%, trigger CHANGELOG migration

**Time:** All 6 updates complete in ~2 seconds

### 3. CHANGELOG Migration (Automatic)

When a sub-section completes:

```
✅ Sub-section 1.1: Auth UI & Screens complete (5/5)

🔄 Migrating to CHANGELOG...
   ✓ Extracted 5 tasks from TASKS.md
   ✓ Created collapse block with <details>
   ✓ Inserted in CHANGELOG (top, reverse chronological)
   ✓ Removed sub-section from TASKS.md
   ✓ Updated Last Updated date

📋 CHANGELOG.md updated
🗑️  TASKS.md cleaned

⏭️ Next: Phase 1.2 Testing Infrastructure (0/8)
```

**Migration format:**

```markdown
## 2025-11-20 - Phase 1.1: Auth UI & Screens ✅

**Status**: Complete
**Stack**: React Native Reusables, Supabase Auth

<details>
<summary>📋 Completed Tasks (5 - Click to expand)</summary>

- [x] **1.10** Create login screen UI (M - 2h) _2025-11-18_
- [x] **1.11** Create register screen UI (M - 2h) _2025-11-18_
      ...

</details>

**Key Achievements:**

- Login/Register screens implemented
- Form validation with error handling
- Loading states and navigation

---
```

### 4. Smart Suggestions

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
const commits = git.log('--since="24 hours ago"');
const changedFiles = git.diff('--name-only HEAD~5..HEAD');

// Find tasks in DOING column
const doingTasks = kanban.DOING;

// Match evidence
const mostLikelyTask = match(commits, changedFiles, doingTasks);
```

### Step 2: Confirm or Ask

```typescript
// Simple heuristics (no complex confidence %)
if (singleMatchWithStrongEvidence) {
  // Auto-proceed with confirmation
  showEvidence();
  askUser(`Detected: ${task}. Correct? [Y/n]`);
} else if (multipleCandidates) {
  // Show options
  showOptions(candidateTasks);
} else {
  // No match - ask user
  showKanbanDoing();
  askUser('Which task did you complete?');
}
```

### Step 3: Cascade Updates (6 Levels)

```typescript
// Core (1-2)
markComplete(taskId);
updateLastUpdatedDate();

// Kanban (3-5)
moveKanbanDoingToDone();
rotateKanbanDone();
updateKanbanTODO();

// Migration (6)
if (isSubSectionComplete()) {
  migrateToChangelog();
  removeFromTasks();
}

// Show report
displayImpact();
suggestNext();
```

---

## 🎨 Kanban Auto-Management

### DONE Column (Auto-Rotate)

Keeps last 5 completed tasks. When 6th task completes:

```markdown
Before:
DONE: [Task1, Task2, Task3, Task4, Task5]

After completing Task6:
DONE: [Task6, Task1, Task2, Task3, Task4] ← Task5 auto-removed
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
✓ Task 1.10 is already marked complete (2025-11-18)

Next task: 1.11 Register screen UI [M - 2h]
Start this task? [Y/n]
```

### Blocked Dependencies

```
⚠️ Cannot start 1.30 - Dependencies not satisfied:
   • 1.10 Create login screen (pending)
   • 1.11 Create register screen (pending)

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
• 1.10 Login screen (started)
• 1.11 Register screen (started)
```

`/task-update` detects which one you just finished based on recent commits.

### Want to See Progress?

```bash
/task-update status
```

Shows full kanban in <2 seconds.

---

## 📚 Reference

**Format Spec**: `.claude/lib/tasks-format-spec.md` (v5.0 - Zero Counters, CHANGELOG migration)
**Kanban Structure**: See TASKS.md § Kanban
