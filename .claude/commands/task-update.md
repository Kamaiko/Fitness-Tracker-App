---
description: Auto-detect completed tasks and update TASKS.md
allowed-tools: Bash(git log:*), Bash(git diff:*), Read, Edit, Grep
argument-hint: [next|status]
---

# /task-update - Auto-Magic Task Completion

Smart task tracker that detects what you just finished and updates everything automatically.

---

## 🎯 Usage

```bash
/task-update              # Auto-detect completed task & cascade updates
/task-update next         # Suggest next task to work on
/task-update status       # Show kanban board
```

**Most common**: Just `/task-update` after finishing work.

---

## ⚡ How It Works

### Auto-Detection

Claude analyzes:

1. **Recent git commits** (last 24h) - messages, files, count
2. **Kanban DOING column** - what's in progress
3. **File patterns** - matches task "Files:" field with changed files
4. **Task descriptions** - keyword matching

Then Claude:

- ✅ Detects completed task
- ✅ Marks `[x]` in TASKS.md
- ✅ Updates Kanban (DOING → DONE)
- ✅ Updates "Last Updated" date
- ✅ Checks sub-section completion → triggers CHANGELOG migration
- ✅ Suggests next task

**Zero manual input required** 99% of the time.

---

## 📋 Example

```bash
/task-update
```

**Output:**

```
🔍 Analyzing recent work...

✅ Detected: 1.10 Create login screen UI
   Evidence: 3 commits, src/app/(auth)/login.tsx ✓

📊 Auto-updated:
   ✓ Task marked [x] in TASKS.md
   ✓ Kanban: 1.10 moved DOING → DONE
   ✓ Last Updated: 2025-11-20

⏭️ Next: 1.11 Register screen UI [M - 2h]

Start this task? [Y/n]
```

**If ambiguous:**

```
🤔 Multiple tasks detected:

Which task did you complete?
1. 1.10 Login screen (4 commits, login.tsx)
2. 1.20 Register screen (2 commits, register.tsx)

[1/2]: _
```

Just type the number.

---

## 🔄 Auto-Cascade Updates (6 Levels)

One `/task-update` command updates **6 levels automatically:**

### Core (1-2)

1. ✅ Task checkbox: `[ ]` → `[x]`
2. 📅 Last Updated: Set to current date (YYYY-MM-DD)

### Kanban (3-5)

3. 📋 DOING → DONE: Move task, remove "(started)" annotation
4. 📋 Auto-rotate DONE: Keep last 5 tasks, drop oldest if >5
5. 📋 Update TODO: Remove completed task if present

### Migration (6)

6. 🔄 Check sub-section: If 100% complete, trigger CHANGELOG migration

**Time:** All 6 updates complete in ~2 seconds.

---

## 📦 CHANGELOG Migration (Automatic)

When sub-section reaches 100% completion:

```
✅ Sub-section 1.1: Auth UI & Screens complete (5/5)

🔄 Migrating to CHANGELOG...
   ✓ Extracted 5 tasks from TASKS.md
   ✓ Created <details> collapse block
   ✓ Inserted at top of CHANGELOG (reverse chronological)
   ✓ Removed sub-section from TASKS.md

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
```

---

## 🧠 Smart Features

### Ambiguity Handling

- **Single strong match**: Auto-proceeds with confirmation
- **Multiple candidates**: Shows numbered list, user picks
- **No match**: Shows DOING column, asks which task

### Kanban Management

**DONE auto-rotation**: Keeps last 5 tasks, oldest drops automatically.

**TODO priority**: Top 5 tasks by priority, dependencies, blocking impact.

### Next Task Suggestion

`/task-update next` analyzes dependencies, blockers, priority, effort, critical path → suggests optimal next task.

---

## ⚠️ Error Handling

**No recent work:**

```
ℹ️ No recent commits (last 24h)
Still working? Or mark specific task?
```

**Task already complete:**

```
✓ Task 1.10 already marked complete (2025-11-18)
Next: 1.11 Register screen [M - 2h]
```

**Blocked dependencies:**

```
⚠️ Cannot start 1.30 - Dependencies not satisfied:
   • 1.10 Login screen (pending)
Recommended: Complete 1.10 first
```

---

## 🎯 Constraints

**Performance:**

- <5 seconds for auto-detection
- <2 seconds for cascade updates
- Git analysis: last 24h commits only

**Scope - DO:**

- Analyze git log, git diff
- Parse TASKS.md (header + phase sections)
- Update checkboxes, Kanban, Last Updated
- Trigger CHANGELOG migration when sub-section complete

**Scope - DO NOT:**

- Calculate task counters or progress percentages (Zero Counters v5.0)
- Modify git history
- Read files outside project directory

**Detection heuristics:**

- Match task ID with commit messages
- Match "Files:" field with changed files
- Match keywords in task description
- Prioritize DOING column tasks
- Simple confidence (strong/weak/none), no complex percentages

---

## 💡 Daily Workflow

```bash
# Morning
/task-update status      # See board, start task

# Work...

# After each task
/task-update             # Auto-complete, get next

# Repeat
```

**Time per update:** ~10 seconds total.

---

## 📚 Reference

**Format Spec**: `.claude/lib/tasks-format-spec.md` (v5.0 - Zero Counters, CHANGELOG migration)
**Kanban Structure**: `TASKS.md` § Kanban (TODO/DOING/DONE columns)
**CHANGELOG Format**: `CHANGELOG.md` (reverse chronological, `<details>` collapse)
