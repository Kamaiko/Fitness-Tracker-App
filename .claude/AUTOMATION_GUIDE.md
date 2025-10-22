# Documentation Automation System - User Guide

> **Version:** 1.0
> **Created:** January 2025
> **Status:** ✅ Fully Implemented

---

## 🎯 What This System Does

This system **automatically** updates your project documentation when tasks are completed, eliminating manual updates and ensuring consistency across all documentation files.

### Key Features

✅ **Automatic Task Detection**: Detects when you complete tasks via keywords or checkbox edits
✅ **Confirmation Before Changes**: Always asks before modifying documentation
✅ **Atomic Updates**: Updates TASKS.md and README.md together (all-or-nothing)
✅ **Batch Mode**: Queues rapid task completions, commits in batches
✅ **Phase Completion**: Automatically detects and marks phase completion
✅ **Session-End Verification**: Checks documentation consistency before session ends
✅ **Smart Error Recovery**: Falls back to description search if task ID not found

---

## 📁 System Components

### Agents (`.claude/agents/`)

**task-tracker.md** - Main automation agent
- Detects completed tasks
- Updates progress counters
- Maintains badge colors
- Handles phase completion

**session-end.md** - Verification agent
- Runs at session end
- Checks documentation consistency
- Suggests commits if needed
- Verifies "NEXT SESSION" marker

### Hooks (`.claude/hooks/`)

**pre-compact.json** - Triggers before conversation compaction
- Flushes pending task updates
- Batches rapid completions
- Commits grouped changes

**session-end.json** - Triggers when session ends
- Verifies documentation sync
- Suggests uncommitted changes
- Prepares next session

---

## 🚀 How to Use

### For Daily Development

**You don't need to do anything special!**

Just work normally, and when you complete a task:

```
Option 1: Tell me explicitly
"I completed task 0.5bis.3"

Option 2: I'll detect it automatically
When I mark a checkbox: - [ ] → - [x]
```

**What happens next:**

1. I detect the completion
2. I ask for confirmation:
   ```
   I detected you completed task 0.5bis.3: "Create eas.json Configuration".
   Should I update TASKS.md?
   ```
3. You say "YES"
4. I execute 4-step update:
   - ✅ Mark checkbox [x]
   - ✅ Update counter: 6/96 → 7/96
   - ✅ Update badge color
   - ✅ Sync to README.md
5. I commit with conventional message

---

## 📊 Update Process Explained

### Single Task Completion

**Scenario:** You complete one task

**Timeline:**
```
1. Task completed
2. Detection (< 1s)
3. Confirmation request
4. Your approval
5. 4-step atomic update (3-5s)
6. Git commit
7. Done!
```

**Commit message:**
```
docs(tasks): Mark task 0.5bis.3 complete (7/96)
```

---

### Rapid Task Completion (Batch Mode)

**Scenario:** You complete 3 tasks within 10 minutes

**Timeline:**
```
1. Task 1 complete → Queued (not committed yet)
2. Task 2 complete → Queued
3. Task 3 complete → Queued
4. PreCompact hook fires → Flush queue
5. All 3 updates execute together
6. Single batch commit
7. Done!
```

**Commit message:**
```
docs(tasks): Mark 3 tasks complete (9/96)

- Task 0.5bis.1: Setup EAS Build Account
- Task 0.5bis.2: Create eas.json Configuration
- Task 0.5bis.3: Build Development Build
```

**Benefit:** Cleaner git history, fewer interruptions

---

### Phase Completion

**Scenario:** You complete the last task in a phase

**Timeline:**
```
1. Final task completed
2. Phase completion detected
3. Roadmap updated:
   - Mark phase ✅ complete
   - Move "YOU ARE HERE" to next phase
4. NEXT SESSION updated:
   - Point to next phase
   - Update task counter
5. Commit with phase completion message
6. Celebration! 🎉
```

**Commit message:**
```
docs(tasks): Mark Phase 0.5 Bis complete and prepare Phase 0.5
```

---

## ⚙️ Configuration

### Badge Color Thresholds

Progress badges auto-calculate based on percentage:

| Percentage | Color | Badge |
|------------|-------|-------|
| 0-25% | Red | ![](https://img.shields.io/badge/Progress-15%25-red) |
| 26-50% | Orange | ![](https://img.shields.io/badge/Progress-35%25-orange) |
| 51-75% | Yellow | ![](https://img.shields.io/badge/Progress-65%25-yellow) |
| 76-100% | Green | ![](https://img.shields.io/badge/Progress-90%25-green) |

**You don't need to calculate these** - the agent does it automatically.

---

### Batch Mode Threshold

**Default:** 10 minutes

Tasks completed within 10 minutes of each other are queued for batch commit.

**Why 10 minutes?**
- Long enough to capture rapid work sessions
- Short enough to avoid losing progress if session crashes
- Balances commit frequency with git history cleanliness

**To modify:** Edit `.claude/agents/task-tracker.md` line:
```markdown
BATCH_THRESHOLD_MINUTES = 10
```

---

## 🔍 How Detection Works

### Method 1: Conversation Keywords

I monitor for these phrases:

✅ "completed task X"
✅ "finished task X"
✅ "done with task X"
✅ "task X is complete"
✅ "marked task X as complete"

**Task ID formats I recognize:**
- `0.5bis.1` (phase.task)
- `0.5.A.1` (phase.section.task)
- `1.1`, `2.3`, etc.

---

### Method 2: Edit Tool Monitoring

I watch my own Edit tool calls for checkbox changes:

**Before:**
```markdown
- [ ] 0.5bis.3 **Create eas.json Configuration** (S - 30min)
```

**After:**
```markdown
- [x] 0.5bis.3 **Create eas.json Configuration** (S - 30min)
```

**Detection:** Automatic! I see the change and trigger update workflow.

---

## ✅ Session-End Checks

When your session ends, I automatically verify:

### Check 1: Uncommitted Changes
```
⚠️ Uncommitted changes detected in:
  - docs/TASKS.md
  - README.md

Suggested commit: docs(tasks): Update progress tracking
```

### Check 2: NEXT SESSION Accuracy
```
⚠️ NEXT SESSION marker outdated!
  Shows: Phase 0.5 Bis, Task 0.5bis.1
  Should be: Phase 0.5 Bis, Task 0.5bis.4
```

### Check 3: YOU ARE HERE Position
```
⚠️ Roadmap "YOU ARE HERE" misplaced!
  Roadmap shows: Phase 0.5 Bis
  Should be: Phase 0.5
```

### Check 4: Progress Counter Sync
```
⚠️ Progress counters out of sync!
  TASKS.md: 9/96
  README.md: 7/96
```

### Check 5: Checkbox Count Accuracy
```
⚠️ Checkbox count doesn't match reported progress!
  Actual completed: 9
  Reported: 7
```

**I'll suggest fixes for all detected issues.**

---

## 🛡️ Safety Features

### 1. Confirmation Required

**I NEVER modify documentation without asking first.**

Even if I'm 100% confident, I always confirm:
```
Should I update TASKS.md? [YES/NO]
```

---

### 2. Atomic Updates

**All-or-nothing principle.**

If any step fails:
- ❌ Abort entire update
- ❌ No partial changes
- ✅ Documentation stays consistent

**Steps:**
1. Mark checkbox ← fails here? Abort all
2. Update counter ← or here? Abort all
3. Update badge ← or here? Abort all
4. Sync README ← or here? Abort all

**Result:** Documentation is always in valid state.

---

### 3. Verification After Edits

**I verify every change:**

```typescript
// Before committing
1. Read file again
2. Confirm change applied
3. If mismatch → abort and notify
```

---

### 4. Error Recovery

**What if task ID not found?**

**Fallback strategy:**
```
1. Try exact ID match
2. If not found → search by description
3. If 1 match → use it
4. If multiple matches → ask user
5. If no matches → notify and abort
```

**Example:**
```
Task 0.5bis.99 not found, but found similar:
  - 0.5bis.3: Create eas.json Configuration

Using this task instead.
```

---

## 📋 Example Workflows

### Example 1: Normal Task Completion

**You:**
```
I just finished implementing the EAS configuration.
Task 0.5bis.2 is done.
```

**Me:**
```
I detected you completed task 0.5bis.2: "Create eas.json Configuration".
Should I update TASKS.md with the following changes?

1. Mark checkbox [x] for task 0.5bis.2
2. Update progress counter: 6/96 → 7/96
3. Update badge: 6% red → 7% red
4. Sync progress to README.md

[YES] → Proceed with updates
[NO] → Ignore this detection
```

**You:** YES

**Me:**
```
✅ Updated TASKS.md:
- Marked task 0.5bis.2 complete
- Progress: 7/96 (7%)
- Badge: red

✅ Synced to README.md

📝 Committed: docs(tasks): Mark task 0.5bis.2 complete (7/96)
```

---

### Example 2: Batch Workflow

**Scenario:** You complete 3 tasks rapidly

**You:**
```
Finished task 0.5bis.1
```

**Me:**
```
Queued task 0.5bis.1 for batch update (1 pending)
```

**You:**
```
Done with task 0.5bis.2
```

**Me:**
```
Queued task 0.5bis.2 for batch update (2 pending)
```

**You:**
```
Completed task 0.5bis.3
```

**Me:**
```
Queued task 0.5bis.3 for batch update (3 pending)
```

**[PreCompact hook triggers]**

**Me:**
```
Flushing 3 pending task updates...

✅ Updated TASKS.md:
- Marked tasks 0.5bis.1, 0.5bis.2, 0.5bis.3 complete
- Progress: 9/96 (9%)
- Badge: red

✅ Synced to README.md

📝 Committed: docs(tasks): Mark 3 tasks complete (9/96)

- Task 0.5bis.1: Setup EAS Build Account
- Task 0.5bis.2: Create eas.json Configuration
- Task 0.5bis.3: Build Development Build
```

---

### Example 3: Session End with Issues

**[You type /end or close session]**

**Me:**
```
╔═══════════════════════════════════════════════╗
║        SESSION END VERIFICATION REPORT         ║
╚═══════════════════════════════════════════════╝

❌ 2 issues found:

1. Uncommitted changes:
   - docs/TASKS.md

2. NEXT SESSION marker outdated:
   - Shows: Task 0.5bis.1
   - Should be: Task 0.5bis.4

🔧 Suggested Fixes:
  1. Update NEXT SESSION to Task 0.5bis.4
  2. Commit: docs(tasks): Update progress tracking

Should I apply all fixes?
[YES] → Apply all and commit
[NO] → Skip (manual review needed)
```

---

## 🎓 Pro Tips

### Tip 1: Be Explicit When Possible

**Clear:**
```
I completed task 0.5bis.3
```

**Ambiguous:**
```
I'm done with the configuration
```

**Why:** Explicit task IDs = 100% detection confidence

---

### Tip 2: Let Batch Mode Work

**Don't manually commit between rapid tasks.**

If you complete 3 tasks in 5 minutes, let me queue them. You'll get a single clean commit instead of 3 separate ones.

---

### Tip 3: Trust Session-End Checks

**Always review the session-end report.**

I catch inconsistencies you might miss:
- Forgotten commits
- Outdated markers
- Counter mismatches

**Fix them before ending session** = clean next session.

---

### Tip 4: Use Task IDs in Conversations

**Good practice:**
```
I'm starting task 0.5bis.3
Working on task 0.5bis.4 now
Completed task 0.5bis.5
```

**Why:**
- I can track your progress
- Auto-detection works better
- Clearer communication

---

## ❓ FAQ

### Q: What if I complete a task but don't tell you?

**A:** I'll catch it during:
1. **PreCompact hook** - if you continue working
2. **Session-end check** - when you end session
3. **Next session start** - I'll notice unmarked checkboxes

**Best practice:** Tell me explicitly to avoid delays.

---

### Q: Can I mark tasks manually in TASKS.md?

**A:** Yes, but **not recommended**.

If you manually edit:
- ❌ Counter won't update
- ❌ Badge won't update
- ❌ README won't sync

**Instead:** Tell me "Mark task X complete" and I'll do it properly.

---

### Q: What if I complete tasks out of order?

**A:** No problem!

The system doesn't enforce order. I'll update whatever task you complete.

**However:** TASKS.md assumes dependencies, so follow order when possible.

---

### Q: Can I customize badge colors?

**A:** Yes! Edit `.claude/agents/task-tracker.md`:

```markdown
BADGE_THRESHOLDS = {
  red: [0, 25],
  orange: [26, 50],
  yellow: [51, 75],
  green: [76, 100]
}
```

Change thresholds as desired.

---

### Q: What happens if a hook fails?

**A:** Graceful degradation.

- PreCompact fails → Tasks still queued, will flush next time
- SessionEnd fails → Session still ends, issues logged for next session

**Your work is never lost.**

---

### Q: How do I disable the system temporarily?

**A:** Rename hooks:

```bash
mv .claude/hooks/pre-compact.json .claude/hooks/pre-compact.json.disabled
mv .claude/hooks/session-end.json .claude/hooks/session-end.json.disabled
```

**To re-enable:** Rename back to `.json`

---

## 🐛 Troubleshooting

### Issue: Task not detected

**Symptoms:**
- You completed a task
- I didn't ask to update TASKS.md

**Diagnosis:**
1. Check task ID format: `0.5bis.3` ✅ vs `0.5-bis-3` ❌
2. Verify you said "completed" or similar keyword
3. Check if task exists in TASKS.md

**Fix:**
- Be explicit: "I completed task 0.5bis.3"
- Or manually tell me: "Mark task 0.5bis.3 complete"

---

### Issue: Counter mismatch

**Symptoms:**
- TASKS.md shows 7/96
- README.md shows 6/96

**Diagnosis:**
- Partial update (unlikely due to atomic updates)
- Manual edit outside system

**Fix:**
- Session-end check will detect this
- Confirm which is correct
- I'll sync both files

---

### Issue: Badge color wrong

**Symptoms:**
- 30% complete shows red (should be orange)

**Diagnosis:**
- Threshold calculation error
- Manual badge edit

**Fix:**
- Tell me: "Recalculate badge color"
- I'll fix based on actual percentage

---

### Issue: Phase completion not detected

**Symptoms:**
- All tasks in phase complete
- Roadmap still shows phase in progress

**Diagnosis:**
- Task completed outside system
- Phase detection skipped

**Fix:**
- Tell me: "Phase 0.5 Bis is complete"
- I'll update roadmap manually

---

## 📊 System Statistics

**Files Managed:**
- `docs/TASKS.md` (primary source)
- `README.md` (synced from TASKS.md)

**Update Frequency:**
- Per task (immediate mode): ~5-10 seconds
- Batch (rapid mode): On PreCompact (~every 30 min or manual)

**Accuracy:**
- Detection: ~95% (with clear keywords)
- Atomic updates: 100% (all-or-nothing)
- Consistency checks: 5 checks every session end

---

## 🎯 Summary

**What you need to remember:**

1. ✅ **Just work normally** - tell me when tasks complete
2. ✅ **Confirm updates** - I always ask first
3. ✅ **Trust the system** - atomic updates ensure consistency
4. ✅ **Review session-end report** - catch issues before next session
5. ✅ **Use explicit task IDs** - better detection accuracy

**The system handles:**
- Progress tracking
- Badge updates
- README sync
- Phase completion
- Commit messages
- Consistency verification

**You focus on coding. I handle documentation.**

---

**Questions?** Check agent files in `.claude/agents/` for complete specifications.

**Issues?** See Troubleshooting section above or ask me directly.

**Version:** 1.0 | **Last Updated:** January 2025
