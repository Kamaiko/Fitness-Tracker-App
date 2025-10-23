# TASKS.md Format Convention

> **Version**: 1.0
> **Purpose**: Strict formatting rules for automation compatibility
> **Referenced by**: smart-detector.md, task-tracker.md, session-end.md

---

## 🎯 Core Principle

**CHECKBOX-DRIVEN STRUCTURE** - Every task MUST use checkbox format.

---

## ✅ Rule 1: Task Line Format (MANDATORY)

```markdown
- [ ] ID **Description** (Size - Time) [Tags]
```

**Components:**
- `- [ ]` or `- [x]` - Checkbox (space in brackets for incomplete)
- `ID` - Task identifier (e.g., `0.5.2`, `0.5bis.1`, `1.1`)
- `**Description**` - Bold task name (REQUIRED for regex)
- `(Size - Time)` - Estimate (e.g., `(M - 3h)`)
- `[Tags]` - Optional: `[NEXT]`, `[CRITICAL]`

**Valid Examples:**
```markdown
- [ ] 0.5.2 **Implement database schema** (M - 3h) [NEXT]
- [x] 0.5.1 **Setup expo-sqlite** (M - 4h) ✅
- [ ] 1.1 **Create login screen** (M - 3h)
```

**Invalid (WILL BREAK AUTOMATION):**
```markdown
### 0.5.2 **Task**        ❌ Header not checkbox
- [ ] 0.5.2 Task           ❌ Not bold
- [] 0.5.2 **Task**        ❌ No space in []
- [x ] 0.5.2 **Task**      ❌ Space after x
```

---

## 📝 Rule 2: Task Details (Indented 2 Spaces)

```markdown
- [ ] 0.5.2 **Implement database schema** (M - 3h)
  - Create SQL migration file
  - Add RLS policies
  - Seed test data
  - File: `supabase/migrations/001_initial.sql`
```

**Guidelines:**
- Indent with 2 spaces
- Use bullet points `- ` for steps
- Keep concise (5-10 steps max)
- Use backticks for file paths/code

---

## 📋 Rule 3: Phase Headers (UNIFORM)

```markdown
## Phase 0.5: Architecture & Foundation (4/15)

**Timeline:** Week 3 | **Priority:** CRITICAL
**Goal:** Complete infrastructure setup before Phase 1
**Progress:** 4/15 tasks (27%)
```

**Forbidden:**
```markdown
## Phase 0.5 ⭐ CRITICAL            ❌ Emoji in header
## Phase 0.5 (4/15) ← YOU ARE HERE  ❌ Arrows/annotations
```

**Rules:**
- NO emojis in header line
- NO "YOU ARE HERE" text
- Task count in header, percentage in Progress line
- Progress MUST match actual checkbox count

---

## 🔖 Rule 4: Section Headers (Sub-Phases)

```markdown
### 0.5.A Infrastructure Setup (2/5)

**Goal:** Setup database and monitoring
```

**Rules:**
- Use `###` (3 hashes) for sub-phases
- Include count `(completed/total)`
- One-line goal statement
- NO freeform titles like "🔴 BLOCKERS"

---

## 🚫 Rule 5: NO Freeform Headers

**Wrong:**
```markdown
🔴 BLOCKERS FOR PHASE 1
⚠️ IMPORTANT NOTES
```

**Correct:**
```markdown
### 0.5.D Critical Corrections (0/8)

**Goal:** Blocking issues for Phase 1
```

**Every section MUST have phase ID** (e.g., `0.5.D`, `1.A`)

---

## 🔍 Automation Regex Pattern

The smart-detector uses this pattern:

```regex
/- \[\s?\] ([\d\w.]+)\s+\*\*(.+?)\*\*/
```

**Matches:**
- `- [ ]` or `- []` - Incomplete tasks
- Group 1: ID (e.g., `0.5.2`)
- Group 2: Description (must be bold)

**Won't match:**
- Headers `###`
- Non-bold text
- `[x ]` with space after x

---

## ✅ Validation Commands

Run before committing TASKS.md changes:

```bash
# 1. No header-based tasks
grep -E "^###\s+\d+\.\d+" docs/TASKS.md
# Expected: EMPTY

# 2. All incomplete tasks have bold
grep -E "^- \[ \] \d+\.\d+\s+\*\*" docs/TASKS.md | wc -l
# Expected: Count matches incomplete tasks

# 3. No space after x in completed
grep -E "^- \[x \]" docs/TASKS.md
# Expected: EMPTY

# 4. No emoji in phase headers
grep -E "^##\s+Phase.*[⭐🔴⚠️←]" docs/TASKS.md
# Expected: EMPTY
```

---

## 📊 Complete Example

```markdown
## Phase 0.5: Architecture & Foundation (4/15)

**Timeline:** Week 3 | **Priority:** CRITICAL
**Goal:** Complete infrastructure setup
**Progress:** 4/15 tasks (27%)

---

### 0.5.A Infrastructure (2/5)

**Goal:** Database and performance setup

- [x] 0.5.1 **Setup expo-sqlite** (M - 4h) ✅
  - Database service implemented
  - 5 tables created
  - CRUD operations working

- [ ] 0.5.2 **Implement Supabase schema** (M - 3h) [NEXT]
  - Create migration file
  - Add RLS policies
  - File: `supabase/migrations/001_initial.sql`
```

---

## 🔄 Benefits

✅ **100% Automation Compatible** - Regex never breaks
✅ **Uniform Structure** - Predictable, scannable
✅ **Scalable** - Add/remove tasks safely
✅ **Version-Safe** - Counters update dynamically
✅ **Grep-Friendly** - Easy filtering

---

## 🚨 Common Violations & Fixes

### Violation 1: Header-Based Tasks

**WRONG:**
```markdown
### 0.5bis.2 **Create eas.json Configuration** (S - 30min)

```
File: eas.json
...
```
```

**CORRECT:**
```markdown
- [ ] 0.5bis.2 **Create eas.json Configuration** (S - 30min)
  - Create eas.json at project root
  - Configure development profile
  - File: `eas.json`
```

**Why:** Headers break automation (smart-detector can't parse them).

---

### Violation 2: Non-Bold Task Description

**WRONG:**
```markdown
- [ ] 1.1 Create login screen UI (M - 3h)
```

**CORRECT:**
```markdown
- [ ] 1.1 **Create login screen UI** (M - 3h)
```

**Why:** Regex pattern requires `**Description**` for matching.

---

### Violation 3: Space After 'x' in Completed

**WRONG:**
```markdown
- [x ] 0.5.1 **Setup expo-sqlite** (M - 4h) ✅
```

**CORRECT:**
```markdown
- [x] 0.5.1 **Setup expo-sqlite** (M - 4h) ✅
```

**Why:** Standard markdown checkbox format (no space after x).

---

## 🔒 Automated Validation

**session-end.py Hook** validates TASKS.md format at every session end.

**Checks:**
1. No header-style tasks (`### ID **Title**`)
2. No space after 'x' in completed tasks
3. All task descriptions are bold

**Output Example (when violations found):**
```
4️⃣  TASKS.md Format Validation:
   ⚠️  VIOLATIONS DETECTED:
   • Line 220: Task using header instead of checkbox
     Rule: Must use: - [ ] ID **Title**
   • Line 255: Task using header instead of checkbox
     Rule: Must use: - [ ] ID **Title**
   📖 See .claude/lib/tasks-format.md for complete format guide
```

**Output (when format valid):**
```
4️⃣  TASKS.md Format Validation:
   ✅ Format valid (all rules followed)
```

**Benefit:** Guarantees format consistency across sessions.

---

**Version:** 1.1
**Last Updated:** 2025-01-22
**Maintained by:** Automation system
**Enforced by:** task-tracker agent + session-end.py validation
