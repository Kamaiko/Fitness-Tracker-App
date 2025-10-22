# Instructions pour Claude

> **Version**: 2.0
> **Last Updated**: Automatically updated via git hooks
> **Purpose**: Session startup guide + documentation navigation

---

## 🎯 Session Startup Protocol

### 1. Read Project Status (15 seconds)

**Primary Source**: `README.md` section "Current Status"

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

| Scenario                     | Read This Document | Section               |
| ---------------------------- | ------------------ | --------------------- |
| New to project               | CONTRIBUTING.md    | Complete guide        |
| Daily development            | TASKS.md           | Current phase section |
| Database work                | DATABASE.md        | Relevant operation    |
| Fixing bugs                  | TROUBLESHOOTING.md | By component/symptom  |
| Understanding tech decisions | TECHNICAL.md       | Specific ADR          |
| Post-migration corrections   | AUDIT_FIXES.md     | TL;DR → Correction #N |
| Code structure questions     | ARCHITECTURE.md    | Relevant pattern      |

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

**Always specify:** File path, section/line, exact change (before/after)

**Example:**

```markdown
📄 File: docs/TASKS.md
📍 Section: Phase 0.5 Bis, Task 1 (line 195)
✏️ Change: Mark task checkbox [x]

Before: - [ ] 0.5bis.1 Setup EAS Build Account & CLI
After: - [x] 0.5bis.1 Setup EAS Build Account & CLI
```

**→ Complete workflows**: See [DOC_AUTOMATION_SYSTEM.md § Automatic Update Workflows](DOC_AUTOMATION_SYSTEM.md#automatic-update-workflows)

#### ❌ NEVER Duplicate:

See [DOC_AUTOMATION_SYSTEM.md § Primary Source Matrix](DOC_AUTOMATION_SYSTEM.md#primary-source-matrix) for complete ownership rules.

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
  file_path: 'docs/TASKS.md',
  old_string: '- [ ] 0.5bis.3 **Build Development Build**',
  new_string: '- [x] 0.5bis.3 **Build Development Build**',
});
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

**Complete automation details**: See [DOC_AUTOMATION_SYSTEM.md](DOC_AUTOMATION_SYSTEM.md)

Before ending session, follow this 5-phase automated workflow:

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

**→ Trigger descriptions and detection rules**: See DOC_AUTOMATION_SYSTEM.md § Trigger Types

### Phase 2: Generate Update Plan

For each detected trigger, determine exact updates needed.

**→ Complete workflows for each trigger**: See DOC_AUTOMATION_SYSTEM.md § Automatic Update Workflows

**Quick reference**:

- TASK_COMPLETE → 4 updates (checkbox, counter, badge, README sync)
- PHASE_COMPLETE → 5 updates (mark complete, move marker, update status)
- BUG_FIXED → Add to TROUBLESHOOTING.md with structured format
- TECH_DECISION → Add ADR to TECHNICAL.md
- SCHEMA_CHANGE → Update DATABASE.md + TECHNICAL.md
- FEATURE_ADDED → Update relevant docs (README, ARCHITECTURE, DATABASE)

### Phase 3: Execute Updates

Use 4-step verification process (detailed in § Pre-Update Verification):

```bash
1. Read current state (verify content and line numbers)
2. Announce EXACT changes (file, section, line, before/after)
3. Execute with exact strings (Edit tool)
4. Verify change applied (Read again)
```

**CRITICAL**: Follow precision rules from § Documentation Update Protocol

### Phase 4: Commit Documentation

Create atomic commit with conventional message:

```bash
git commit -m "docs: update progress after completing task X"
git commit -m "docs: mark Phase X complete and prepare Phase Y"
git commit -m "docs(troubleshooting): add solution for [issue]"
git commit -m "docs(technical): add ADR-XXX [decision]"
```

### Phase 5: Manual Verification

```bash
[ ] npm run type-check ✅
[ ] git status clean OR meaningful WIP commit
[ ] TASKS.md has "⭐ NEXT SESSION" marker (verified by reading file)
[ ] All doc updates committed in single atomic commit
```

---

## 📚 Documentation Map

**DO NOT duplicate content here** - just reference the docs.

| File                     | Purpose                         | When to Update                     |
| ------------------------ | ------------------------------- | ---------------------------------- |
| README.md                | Project overview, status, stack | Phase change, version bump         |
| CONTRIBUTING.md          | Setup guide, workflow           | Stack change, new commands         |
| TASKS.md                 | Roadmap (96 tasks, 6 phases)    | Task completion, phase progress    |
| AUDIT_FIXES.md           | Post-migration corrections      | Correction completion              |
| DATABASE.md              | WatermelonDB guide, schema      | Schema change, new CRUD operation  |
| ARCHITECTURE.md          | Code structure, patterns        | New pattern, folder restructure    |
| TECHNICAL.md             | ADRs, tech decisions            | New tech decision, algorithm added |
| TROUBLESHOOTING.md       | Bug solutions                   | New issue solved                   |
| PRD.md                   | Product requirements            | Rarely (feature scope change)      |
| DOC_AUTOMATION_SYSTEM.md | Trigger-based doc update system | System refinement (rare)           |

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

## 🎓 Pro Tips

1. **Start every session** by reading README.md § Current Status
2. **Find current work** in TASKS.md (look for ⭐ NEXT SESSION)
3. **Update docs as you go**, not at the end
4. **Use git grep** to find where info is documented before adding duplicate
5. **When in doubt**, check the Documentation Map table above
6. **ALWAYS verify line numbers** by reading file first
7. **Show BEFORE/AFTER** for every doc change

---

**Remember**: Documentation updates must be ULTRA-PRECISE. See [DOC_AUTOMATION_SYSTEM.md](DOC_AUTOMATION_SYSTEM.md) for complete workflows.
