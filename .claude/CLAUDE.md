# Instructions pour Claude

> **Version**: 2.0
> **Last Updated**: Automatically updated via git hooks
> **Purpose**: Session startup guide + documentation navigation

---

## 🎯 Session Startup Protocol

### 1. Read Project Status (15 seconds)

**Single Source of Truth**: `README.md` section "Current Status"

```bash
# Current info is ALWAYS in README.md:
- Version
- Progress (X/96 tasks)
- Current Phase
```

**DO NOT duplicate status info here** - it becomes obsolete.

### 2. Navigate to Current Work (30 seconds)

**Follow this decision tree:**

```
Is this first session on project?
├─ YES → Read CONTRIBUTING.md (setup guide)
└─ NO  → Read TASKS.md section for current phase
          ↓
          Find section marked "⭐ NEXT SESSION"
          ↓
          Read Pre-Flight Checklist if present
          ↓
          Execute tasks in order
```

**Key files by scenario:**

| Scenario                        | Read This Document       | Section                |
| ------------------------------- | ------------------------ | ---------------------- |
| New to project                  | CONTRIBUTING.md          | Complete guide         |
| Daily development               | TASKS.md                 | Current phase section  |
| Database work                   | DATABASE.md              | Relevant operation     |
| Fixing bugs                     | TROUBLESHOOTING.md       | By component/symptom   |
| Understanding tech decisions    | TECHNICAL.md             | Specific ADR           |
| Post-migration corrections      | AUDIT_FIXES.md           | TL;DR → Correction #N  |
| Code structure questions        | ARCHITECTURE.md          | Relevant pattern       |

### 3. Documentation Update Protocol (MANDATORY)

**CRITICAL**: Be ULTRA-PRECISE with documentation updates.

#### 📍 Precision Rules

**NEVER say vague things like:**
❌ "I'll update the documentation"
❌ "Let me update TASKS.md"
❌ "I'll add this to the docs"

**ALWAYS specify EXACTLY:**
✅ Which file (full path)
✅ Which section (exact heading or line number)
✅ What change (add/remove/replace)
✅ Show the exact edit

**Example of PRECISE documentation update:**

```markdown
I will update:
📄 File: README.md
📍 Section: ## 🎯 Current Status (line 100)
✏️ Change: Replace progress "6/96 tasks (6%)" with "16/96 tasks (17%)"

Before:
**Progress:** 6/96 tasks (6%) | **Phase:** 0.5 Bis

After:
**Progress:** 16/96 tasks (17%) | **Phase:** 1
```

#### ✅ DO Update (with precision):

**When completing a task:**
```markdown
📄 File: docs/TASKS.md
📍 Section: Phase X, Task Y (line N)
✏️ Change: Mark task checkbox [x]

Example:
- [ ] 0.5bis.1 Setup EAS Build Account & CLI
→
- [x] 0.5bis.1 Setup EAS Build Account & CLI
```

**When phase changes:**
```markdown
📄 File 1: README.md
📍 Section: ## 🎯 Current Status (line ~100)
✏️ Changes:
  1. Update Progress: "6/96" → "16/96" (17%)
  2. Update Phase: "0.5 Bis" → "1"

📄 File 2: docs/TASKS.md
📍 Section: ## 📊 Current Status (line ~52)
✏️ Changes:
  1. Update Progress badge: 6% → 17%
  2. Update "YOU ARE HERE" marker from Phase 0.5 to Phase 1

📄 File 3: docs/TASKS.md
📍 Section: Phase 1 heading (line ~520)
✏️ Change: Add "⭐ NEXT SESSION" marker
```

**When adding a solved bug:**
```markdown
📄 File: docs/TROUBLESHOOTING.md
📍 Section: After line N (under appropriate category)
✏️ Action: Add new subsection

### [Bug Title]

**Symptoms:**
- [Description]

**Cause:**
- [Root cause]

**Solution:**
[Code/commands]
```

#### ❌ NEVER Duplicate:

- **Status/Progress** → Only in README.md § Current Status + TASKS.md § Current Status
- **Tech Stack** → Only in README.md § Tech Stack table
- **Setup Instructions** → Only in CONTRIBUTING.md
- **Phase Details** → Only in TASKS.md
- **ADRs** → Only in TECHNICAL.md

#### 🎯 Update Workflow Template

**Use this template EVERY TIME you update docs:**

```markdown
## Documentation Updates Required

### Update 1: [Description]
📄 **File**: [path/to/file.md]
📍 **Section**: [Section Name] (line X-Y)
✏️ **Action**: [add/remove/replace]
📝 **Content**:
```
[exact content to add/replace]
```

### Update 2: [Description]
[repeat structure]

---
**Total files affected**: N
**Estimated time**: X minutes
```

#### 🔄 Common Update Scenarios

**Scenario 1: Task Completed**
```markdown
## Documentation Updates Required

### Update 1: Mark task complete
📄 **File**: docs/TASKS.md
📍 **Section**: Phase 0.5 Bis, Task 0.5bis.3 (line ~195)
✏️ **Action**: Replace checkbox
📝 **Content**:
BEFORE: - [ ] 0.5bis.3 **Build Development Build**
AFTER:  - [x] 0.5bis.3 **Build Development Build**

### Update 2: Update progress counter
📄 **File**: docs/TASKS.md
📍 **Section**: ## 📊 Current Status (line 54)
✏️ **Action**: Replace progress numbers
📝 **Content**:
BEFORE: **Total:** 6 completed / 96 total tasks
AFTER:  **Total:** 7 completed / 96 total tasks

### Update 3: Update progress badge
📄 **File**: docs/TASKS.md
📍 **Section**: Top of file (line 5)
✏️ **Action**: Replace badge percentage
📝 **Content**:
BEFORE: ![](https://img.shields.io/badge/Progress-6%25-red)
AFTER:  ![](https://img.shields.io/badge/Progress-7%25-red)
```

**Scenario 2: Phase Completed**
```markdown
## Documentation Updates Required

### Update 1: Update current status
📄 **File**: README.md
📍 **Section**: ## 🎯 Current Status (line 100)
✏️ **Action**: Replace entire section
📝 **Content**:
**Version:** 0.2.0 | **Progress:** 16/96 tasks (17%) | **Phase:** 1 - Authentication

### Update 2: Move "YOU ARE HERE" marker
📄 **File**: docs/TASKS.md
📍 **Section**: Roadmap diagram (line 61)
✏️ **Action**: Replace marker
📝 **Content**:
BEFORE:
Phase 0.5: Architecture & Foundation (15/15 tasks)
Phase 1: Authentication & Foundation (0/14 tasks) ← YOU ARE HERE

AFTER:
Phase 0.5: Architecture & Foundation (15/15 tasks) ✅
Phase 1: Authentication & Foundation (0/14 tasks) ← YOU ARE HERE

### Update 3: Update "NEXT SESSION" marker
📄 **File**: docs/TASKS.md
📍 **Section**: Phase 1 heading (line ~520)
✏️ **Action**: Add marker
📝 **Content**:
## 📋 Phase 1: Authentication & Foundation (0/14) ⭐ NEXT SESSION
```

**Scenario 3: New Feature Added**
```markdown
## Documentation Updates Required

### Update 1: Add to TROUBLESHOOTING.md
📄 **File**: docs/TROUBLESHOOTING.md
📍 **Section**: After ## WatermelonDB Issues (line ~122)
✏️ **Action**: Add new subsection
📝 **Content**:
### "Sync Failed" Error

**Symptoms:**
- Sync returns error
- Changes not appearing in Supabase

**Solutions:**
[code block]

### Update 2: Add ADR to TECHNICAL.md
📄 **File**: docs/TECHNICAL.md
📍 **Section**: After ADR-012 (line ~XXX)
✏️ **Action**: Add new ADR section
📝 **Content**:
### ADR-013: Sync Error Handling Strategy
[complete ADR]
```

---

## 📋 Commit Convention

### Format
```
<type>(<scope>): <description>

[optional body]
```

### Types
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation seulement
- `style`: Formatage (spaces, virgules)
- `refactor`: Refactoring (ni feat ni fix)
- `test`: Tests
- `chore`: Maintenance (build, deps, config)

### Scopes (common)
- `workout`, `exercises`, `analytics`, `auth`
- `db`, `ui`, `config`

### Examples
```bash
feat(workout): add RPE tracking to set logger
fix(analytics): correct volume calculation for compound exercises
docs(readme): update installation instructions for dev build
refactor(lib): extract 1RM calculations to separate module
chore(deps): update React Native to 0.82.0
```

---

## 🚫 Critical Rules

1. **NEVER mention "Claude" or "AI" in commits**
2. **NEVER add AI signatures in commits**
3. Use professional, simple commit messages
4. **NEVER duplicate info across docs**
5. **ALWAYS update docs when tasks complete**
6. **ALWAYS run `npm run type-check` before commit**

---

## 🔍 Pre-Update Verification (MANDATORY)

**BEFORE making ANY documentation change:**

### Step 1: Read Current State
```bash
# ALWAYS read the file first to verify current content
Read(file_path="docs/TASKS.md", limit=100)

# Verify line numbers are correct
# Verify section exists
# Verify content matches expectation
```

### Step 2: Announce EXACT Changes
```markdown
I will make the following changes:

📄 File: docs/TASKS.md
📍 Location: Line 195 (verified by reading file)
✏️ Current content:
- [ ] 0.5bis.3 **Build Development Build**

✏️ New content:
- [x] 0.5bis.3 **Build Development Build**

✏️ Tool: Edit(file_path, old_string, new_string)
```

### Step 3: Execute with Exact Strings
```typescript
// Use EXACT strings from verification step
Edit({
  file_path: "docs/TASKS.md",
  old_string: "- [ ] 0.5bis.3 **Build Development Build**",
  new_string: "- [x] 0.5bis.3 **Build Development Build**"
})
```

### Step 4: Verify Change Applied
```bash
# Read file again to confirm change
Read(file_path="docs/TASKS.md", offset=190, limit=10)

# Confirm change is present
✅ "- [x] 0.5bis.3 **Build Development Build**"
```

**NEVER skip verification steps!**

---

## 🔄 Session End Checklist (AUTOMATED)

**See [DOC_AUTOMATION_SYSTEM.md](DOC_AUTOMATION_SYSTEM.md) for complete automation details.**

Before ending session, automatically detect triggers and execute documentation updates:

### Phase 1: Detect Triggers

Check which events occurred during this session:

```bash
[ ] TASK_COMPLETE - Any task from TASKS.md completed?
[ ] PHASE_COMPLETE - All tasks in current phase finished?
[ ] BUG_FIXED - Bug solved and solution documented?
[ ] TECH_DECISION - Architectural decision made?
[ ] SCHEMA_CHANGE - Database schema modified?
[ ] FEATURE_ADDED - New feature implementation complete?
```

### Phase 2: Generate Update Plan

For each detected trigger, generate precise updates:

**TASK_COMPLETE Trigger:**
```markdown
Automatic updates:
1. docs/TASKS.md → Mark checkbox [x] (exact line)
2. docs/TASKS.md → Increment progress counter (line 56)
3. docs/TASKS.md → Update badge % (line 5)
4. README.md → Sync progress (line 102)
```

**PHASE_COMPLETE Trigger:**
```markdown
Automatic updates:
1. docs/TASKS.md → Mark phase complete (add ✅)
2. docs/TASKS.md → Move "YOU ARE HERE" marker
3. docs/TASKS.md → Add "⭐ NEXT SESSION" to next phase
4. README.md → Update current phase (line 102)
5. docs/TECHNICAL.md → Update status header (line 5)
```

**BUG_FIXED Trigger:**
```markdown
Automatic updates:
1. docs/TROUBLESHOOTING.md → Add new section under appropriate category
   Format:
   ### [Bug Title]
   **Symptoms:** [Auto-extracted from error]
   **Cause:** [Root cause]
   **Solution:** [Code/commands used]
```

**TECH_DECISION Trigger:**
```markdown
Automatic updates:
1. docs/TECHNICAL.md → Add ADR-XXX after last ADR
   Format:
   ### ADR-XXX: [Decision Name]
   **Decision:** [What was decided]
   **Rationale:** [Why this choice]
   **Trade-offs:** [Pros/cons]
   **Status:** ✅ Implemented
```

**SCHEMA_CHANGE Trigger:**
```markdown
Automatic updates:
1. docs/DATABASE.md → Update schema definition (relevant table)
2. docs/TECHNICAL.md → Update schema reference (if needed)
```

**FEATURE_ADDED Trigger:**
```markdown
Automatic updates:
1. README.md → Add to features list (if user-facing)
2. docs/ARCHITECTURE.md → Document new pattern (if architectural)
3. docs/DATABASE.md → Add usage example (if DB-related)
```

### Phase 3: Execute Updates (4-Step Process)

For each update in the plan:

```typescript
// Step 1: Read current state
Read(file_path, offset, limit);

// Step 2: Verify expected content
assert(current.includes(expectedContent));

// Step 3: Make precise edit
Edit({
  file_path,
  old_string: exactCurrentString,
  new_string: exactNewString
});

// Step 4: Verify change applied
Read(file_path, offset, limit);
assert(updated.includes(newContent));
```

### Phase 4: Commit Documentation

Atomic commit with conventional message:

```bash
# Examples:
git commit -m "docs: update progress after completing task 0.5bis.3"
git commit -m "docs: mark Phase 0.5 Bis complete and prepare Phase 1"
git commit -m "docs(troubleshooting): add solution for WatermelonDB sync error"
git commit -m "docs(technical): add ADR-013 ExerciseDB integration"
```

### Phase 5: Manual Verification

```bash
[ ] npm run type-check ✅
[ ] git status clean OR meaningful WIP commit
[ ] TASKS.md has "⭐ NEXT SESSION" marker (verified)
[ ] All doc updates committed in single atomic commit
```

---

## 📚 Documentation Map

**DO NOT duplicate content here** - just reference the docs.

| File                    | Purpose                          | When to Update                     |
| ----------------------- | -------------------------------- | ---------------------------------- |
| README.md               | Project overview, status, stack  | Phase change, version bump         |
| CONTRIBUTING.md         | Setup guide, workflow            | Stack change, new commands         |
| TASKS.md                | Roadmap (96 tasks, 6 phases)     | Task completion, phase progress    |
| AUDIT_FIXES.md          | Post-migration corrections       | Correction completion              |
| DATABASE.md             | WatermelonDB guide, schema       | Schema change, new CRUD operation  |
| ARCHITECTURE.md         | Code structure, patterns         | New pattern, folder restructure    |
| TECHNICAL.md            | ADRs, tech decisions             | New tech decision, algorithm added |
| TROUBLESHOOTING.md      | Bug solutions                    | New issue solved                   |
| PRD.md                  | Product requirements             | Rarely (feature scope change)      |
| DOC_AUTOMATION_SYSTEM.md| Trigger-based doc update system  | System refinement (rare)           |

---

## 🛠️ Quick Commands

**Daily Development:**
```bash
npm start                 # Start dev server
npm start -- --clear      # Clear cache + start
npm run type-check        # TypeScript validation
```

**Building (only when adding native modules):**
```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

---

## 💡 Smart Documentation Strategy

**Instead of updating multiple docs, use this hierarchy:**

1. **README.md** = Single source of truth for status
2. **TASKS.md** = Single source of truth for roadmap
3. **Other docs** = Reference README/TASKS, don't duplicate

**Example of GOOD references:**
```markdown
<!-- In TECHNICAL.md -->
**Current Phase**: See [README.md § Current Status](../README.md#-current-status)

<!-- In CONTRIBUTING.md -->
**Roadmap**: See [TASKS.md](TASKS.md) for complete task list
```

**Example of BAD duplication:**
```markdown
<!-- ❌ NEVER do this in multiple files -->
**Current Phase**: 0.5 Bis - Development Build Migration
**Progress**: 6/96 tasks (6%)
```

---

## 🎓 Pro Tips

1. **Start every session** by reading README.md § Current Status
2. **Find current work** in TASKS.md (look for ⭐ NEXT SESSION)
3. **Update docs as you go**, not at the end
4. **Use git grep** to find where info is documented before adding duplicate
5. **When in doubt**, check the Documentation Map table above
6. **ALWAYS verify line numbers** by reading file first
7. **Show BEFORE/AFTER** for every doc change

---

## 📖 Real Examples from This Project

**Example 1: Marking Task Complete (CORRECT ✅)**

```markdown
## Documentation Update Plan

### Update 1: Mark task 0.5bis.1 complete
📄 **File**: docs/TASKS.md
📍 **Section**: Phase 0.5 Bis (line ~177)
✏️ **Action**: Mark checkbox [x]

**Verification Step**:
Read(file_path="docs/TASKS.md", offset=170, limit=20)

**Current content** (verified):
```
### 0.5bis.1 **Setup EAS Build Account & CLI** (S - 30min)

- [ ] Create free Expo account at https://expo.dev/signup
```

**Change**:
Edit({
  old_string: "### 0.5bis.1 **Setup EAS Build Account & CLI** (S - 30min)",
  new_string: "### 0.5bis.1 **Setup EAS Build Account & CLI** (S - 30min) ✅"
})
```

**Example 2: Updating Progress (CORRECT ✅)**

```markdown
## Documentation Update Plan

### Update 1: Update progress in README.md
📄 **File**: README.md
📍 **Section**: ## 🎯 Current Status (line 100)
✏️ **Action**: Replace progress stats

**Verification Step**:
Read(file_path="README.md", offset=95, limit=15)

**Current content** (verified at line 102):
**Version:** 0.2.0 | **Progress:** 6/96 tasks (6%) | **Phase:** 0.5 Bis

**Change**:
Edit({
  old_string: "**Version:** 0.2.0 | **Progress:** 6/96 tasks (6%) | **Phase:** 0.5 Bis",
  new_string: "**Version:** 0.2.0 | **Progress:** 10/96 tasks (10%) | **Phase:** 0.5 Bis"
})

### Update 2: Update progress in TASKS.md
📄 **File**: docs/TASKS.md
📍 **Section**: ## 📊 Current Status (line 52-56)
✏️ **Action**: Replace total tasks counter

**Verification Step**:
Read(file_path="docs/TASKS.md", offset=50, limit=10)

**Current content** (verified at line 56):
**Total:** 6 completed / 96 total tasks

**Change**:
Edit({
  old_string: "**Total:** 6 completed / 96 total tasks",
  new_string: "**Total:** 10 completed / 96 total tasks"
})
```

**Example 3: Phase Completion (CORRECT ✅)**

```markdown
## Documentation Update Plan

### Update 1: Mark Phase 0.5 Bis complete
📄 **File**: README.md
📍 **Section**: ## 🎯 Current Status (line 102)
✏️ **Action**: Update to Phase 1

**Verification**:
Read(file_path="README.md", offset=95, limit=15)

**Change**:
Edit({
  old_string: "**Version:** 0.2.0 | **Progress:** 10/96 tasks (10%) | **Phase:** 0.5 Bis - Development Build Migration",
  new_string: "**Version:** 0.2.0 | **Progress:** 16/96 tasks (17%) | **Phase:** 1 - Authentication"
})

### Update 2: Move "YOU ARE HERE" in TASKS.md
📄 **File**: docs/TASKS.md
📍 **Section**: Roadmap (line 61-73)
✏️ **Action**: Replace roadmap section

**Verification**:
Read(file_path="docs/TASKS.md", offset=58, limit=20)

**Current** (verified):
Phase 0.5: Architecture & Foundation (4/15 tasks) ← YOU ARE HERE
Phase 1: Authentication & Foundation (0/14 tasks)

**Change**:
Edit({
  old_string: "Phase 0.5: Architecture & Foundation (4/15 tasks) ← YOU ARE HERE\n   ├─ Database setup ✅\n   ├─ Dev tools setup ✅\n   ├─ Architecture refactor ✅\n   ├─ Audit analysis ✅\n   └─ 8 CRITICAL corrections ⚠️ BLOCKERS\n        ↓\nPhase 1: Authentication & Foundation (0/14 tasks)",
  new_string: "Phase 0.5: Architecture & Foundation (15/15 tasks) ✅ COMPLETE\n        ↓\nPhase 1: Authentication & Foundation (0/14 tasks) ← YOU ARE HERE"
})

### Update 3: Add "NEXT SESSION" marker to Phase 1
📄 **File**: docs/TASKS.md
📍 **Section**: Phase 1 heading (line ~520)
✏️ **Action**: Add marker

**Verification**:
Read(file_path="docs/TASKS.md", offset=515, limit=10)

**Current** (verified at line 520):
## 📋 Phase 1: Authentication & Foundation (0/14)

**Change**:
Edit({
  old_string: "## 📋 Phase 1: Authentication & Foundation (0/14)",
  new_string: "## 📋 Phase 1: Authentication & Foundation (0/14) ⭐ NEXT SESSION"
})
```

---

## ⚠️ Common Mistakes to Avoid

**❌ WRONG - Vague update:**
```
"I'll update the progress in TASKS.md"
```

**✅ CORRECT - Precise update:**
```markdown
📄 File: docs/TASKS.md
📍 Line 56 (verified by Read tool)
✏️ Old: "**Total:** 6 completed / 96 total tasks"
✏️ New: "**Total:** 7 completed / 96 total tasks"
```

**❌ WRONG - No verification:**
```
Edit(file="TASKS.md", old="Phase 0.5", new="Phase 1")
```

**✅ CORRECT - With verification:**
```markdown
1. Read(file="docs/TASKS.md", offset=50, limit=20)
2. Verify line 56 contains expected text
3. Edit with EXACT string from read
4. Read again to confirm change
```

**❌ WRONG - Multiple changes in one edit:**
```
Edit({
  old_string: "Phase 0.5 ... [100 lines] ... Phase 1",
  new_string: "Phase 0.5 ... [100 lines changed] ... Phase 1"
})
```

**✅ CORRECT - One focused change:**
```markdown
Update 1: Line 56
Update 2: Line 102
Update 3: Line 520
(3 separate Edit calls)
```

---

**Remember**:
- ✅ Read → Verify → Announce → Edit → Verify
- ✅ One source of truth per piece of information
- ✅ EXACT strings, EXACT line numbers, EXACT changes
