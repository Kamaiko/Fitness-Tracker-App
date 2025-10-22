# Session End Agent

> **Purpose**: Verify documentation consistency before session termination
> **Version**: 2.0 (simplified)
> **Trigger**: SessionEnd hook (cannot block termination)
> **References**: [tasks-format.md](../lib/tasks-format.md)

---

## 🎯 Core Responsibilities

1. **Uncommitted Changes**: Suggest commit if work not saved
2. **Progress Sync**: Verify TASKS.md ↔ README.md counters match
3. **Format Compliance**: Check TASKS.md follows strict format
4. **Fast Execution**: Complete in <60s

---

## ✅ Verification Checks

### Check 1: Uncommitted Changes

**Command:**
```bash
git status --porcelain
```

**If NOT empty:**
```
⚠️ Uncommitted changes in: {list files}

Suggested commit:
- docs/TASKS.md → 'docs(tasks): update progress'
- src/** → 'chore: update implementation'

Commit now? [YES/NO]
```

---

### Check 2: Progress Counter Sync

**Verify:**
1. TASKS.md line 5: `**Progress:** ... X/96 tasks`
2. README.md "Current Status": `X/96 tasks`
3. Actual checkbox count: `grep -c "^- \[x\]" docs/TASKS.md`

**If mismatch:**
```
⚠️ Progress counters out of sync!

TASKS.md: X/96
README.md: Y/96
Actual checkboxes: Z

Recount and fix? [YES/NO]
```

---

### Check 3: Format Compliance

**Validate using tasks-format.md rules:**

```bash
# Check 1: No header-based tasks
grep -E "^###\s+\d+\.\d+" docs/TASKS.md
# Should return EMPTY

# Check 2: No emoji in phase headers
grep -E "^##\s+Phase.*[⭐🔴⚠️←]" docs/TASKS.md
# Should return EMPTY
```

**If violations found:**
```
⚠️ Format violations detected!

See .claude/lib/tasks-format.md for strict rules.
Run validation commands to identify issues.
```

---

## 📊 Session End Report

**Success:**
```
✅ SESSION END VERIFICATION

Checks Passed:
  ✓ No uncommitted changes
  ✓ Progress counters synced
  ✓ Format compliant

Next Task: {nextTask from TASKS.md}
Progress: {X}/96 ({percentage}%)

Session ended cleanly.
```

**Issues Found:**
```
⚠️ SESSION END VERIFICATION

Issues:
  ✗ Uncommitted: docs/TASKS.md
  ✗ Progress mismatch (TASKS: 7, README: 6)

Fixes Available:
  1. Commit changes
  2. Sync counters

Apply fixes? [YES/NO/SELECTIVE]
```

---

## 🛠️ Auto-Fix: Sync Progress Counters

```typescript
function syncProgressCounters() {
  // 1. Count actual checkboxes
  const completed = countCheckboxes('docs/TASKS.md')  // grep -c "^- \[x\]"
  const total = 96
  const percentage = Math.round((completed / total) * 100)

  // 2. Calculate badge color
  let color = 'red'
  if (percentage >= 76) color = 'green'
  else if (percentage >= 51) color = 'yellow'
  else if (percentage >= 26) color = 'orange'

  // 3. Update TASKS.md (version-safe - no hardcoded version)
  const oldLine = extractProgressLine('docs/TASKS.md')  // Current line
  const newLine = `**Progress:** ![](https://img.shields.io/badge/Progress-${percentage}%25-${color}) ${completed}/${total} tasks`

  Edit({
    file_path: 'docs/TASKS.md',
    old_string: oldLine,
    new_string: newLine
  })

  // 4. Sync to README.md (similar logic)
  updateREADMECounter(completed, percentage, color)
}
```

---

## ⚠️ Constraints

**Cannot block termination:**
- SessionEnd hook runs AFTER user requests to end
- Can only suggest fixes, not force them
- User might close before fixes apply

**60-second timeout:**
- Must execute quickly
- Prioritize critical checks
- Skip optional validations if time limited

**Idempotency required:**
- Safe to run multiple times
- Check current state before applying fixes
- No destructive operations

---

## 🔗 Coordination

**With task-tracker.md:**
- task-tracker → PRIMARY (updates during session)
- session-end → VERIFY (checks at end)

**With tasks-format.md:**
- session-end validates format rules
- References tasks-format.md for validation commands

---

## 🧪 Testing Checklist

- [ ] Uncommitted changes detection works
- [ ] Progress counter sync is accurate
- [ ] Format validation catches violations
- [ ] Executes in <60s
- [ ] Idempotent (safe to retry)
- [ ] Handles missing sections gracefully

---

**Version:** 2.0 (simplified)
**Last Updated:** Auto-maintained
