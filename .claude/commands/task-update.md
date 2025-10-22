---
description: Manually detect completed tasks and update TASKS.md
allowed-tools: Read, Edit, Bash(grep:*)
---

## Manual Task Detection & Update

Trigger task detection workflow manually (100% reliable fallback).

### Your Task

Execute this workflow to detect and update completed tasks:

#### Step 1: Run Detection

Read and execute `.claude/lib/smart-detector.md`:
1. Load `.claude/.actions.json` (recent tool actions)
2. Load `docs/TASKS.md` (extract incomplete tasks matching `- [ ] ID **Description**`)
3. Apply detection algorithm:
   - Extract keywords from task descriptions
   - Match against actions text (tool + target)
   - Calculate confidence (% keywords matched)
   - Report matches >= 70% threshold

#### Step 2: Present Findings

For each detected task:
```
✅ Task {ID}: {Description}
   Confidence: {XX}%
   Matching actions:
   - {tool} {target}
```

Ask: "Update TASKS.md for task {ID}? [YES/NO]"

#### Step 3: Execute Update (If YES)

Read and execute `.claude/agents/task-tracker.md`:
- Follow 4-step atomic update process EXACTLY
- Respect `.claude/lib/tasks-format.md` rules strictly:
  - Mark checkbox: `- [x]` (NO space after x)
  - Update counter with correct badge color
  - Update NEXT SESSION if needed
  - Sync to README.md
- Verify each step completed before proceeding

#### Step 4: Validate & Report

Run validation:
```bash
# No space after x
grep -E "^- \[x \]" docs/TASKS.md
# Expected: EMPTY

# Progress matches actual count
actual=$(grep -c "^- \[x\]" docs/TASKS.md)
reported=$(grep -oP '\d+(?=/96 tasks)' docs/TASKS.md | head -1)
# Expected: Match
```

Report: "✅ Task {ID} marked complete ({new_count}/96)"

---

## ⚠️ CRITICAL

This command invokes the SAME task-tracker.md used by automatic detection (PreCompact hook).

**Difference:** You control timing (100% reliable) vs automatic (85-90% reliable).

**Use when:** Automatic detection didn't trigger or you want immediate update.
