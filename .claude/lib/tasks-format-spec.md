# TASKS.md Format Specification v5.0

**Purpose**: Clean, maintainable project roadmap with CHANGELOG migration
**Philosophy**: Zero counters, zero duplication, maximum clarity

---

## 🏷️ Task ID Format

### Valid Pattern

**Regex:** `^[0-9]+\.[0-9]+$`

**Format:** `X.Y0` where:

- `X` = Phase number (0-9)
- `Y0` = Task number in **multiples of 10** (10, 20, 30, 40...)
- Insert between tasks using Y1-Y9 or Y5 (e.g., 1.15, 1.11-1.19)

**Rationale:** Spacing by 10 allows insertion of up to 9 tasks between any two existing tasks without renumbering chaos.

**Rules:**

- ✅ Use multiples of 10 for initial task numbering (1.10, 1.20, 1.30...)
- ✅ Insert between tasks with intermediate numbers (1.15, 1.25, 1.11-1.19)
- ✅ Scalable: Up to 90 tasks per phase (1.10 through 1.900)
- ✅ Examples: `1.10`, `1.20`, `2.100`, `3.15` (inserted)
- ❌ NO letter suffixes: `0.5bis`, `0.5b`, `0.5a`
- ❌ NO sub-levels: `0.5.10.1`, `0.5.B.1`
- ❌ NO dashes: `0.5-10`, `1-3`

**Examples:**

```markdown
✅ VALID (Initial numbering):

- [ ] **1.10** Create login screen UI
- [ ] **1.20** Create register screen UI
- [ ] **1.30** Implement Supabase Auth
- [ ] **1.40** Password reset flow

✅ VALID (Insertion between tasks):
Initial state:

- [ ] **1.10** Create login screen
- [ ] **1.20** Create register screen
- [ ] **1.30** Implement auth

Add task between 1.20 and 1.30:

- [ ] **1.10** Create login screen
- [ ] **1.20** Create register screen
- [ ] **1.25** Add password validation (NEW - inserted)
- [ ] **1.30** Implement auth

✅ VALID (Multiple insertions):

- [ ] **1.10** Create login screen
- [ ] **1.11** Add email validation (inserted)
- [ ] **1.12** Add password strength meter (inserted)
- [ ] **1.13** Add form error handling (inserted)
- [ ] **1.20** Create register screen

❌ INVALID:

- [ ] **1.5** (not multiple of 10 for initial numbering)
- [ ] **0.5bis.1** (letter suffix)
- [ ] **0.5.B.1** (subsection in ID)
- [ ] **0.5-10** (dash instead of dot)
```

---

## 📐 Document Structure

### Required Sections (in order)

1. **Header** - Title + Metadata (simplified)
2. **Kanban** - Current work board
3. **Development Roadmap** - Visual overview
4. **Phase Timeline** - Effort estimates
5. **Phases** - Detailed task lists

**Note:** Executive Summary removed. Kanban provides current status.

---

## 🎨 Visual Design System

### Status Indicators

```
⬜ Pending      - Not started
🟦 In Progress  - Actively working
✅ Completed    - Done (migrated to CHANGELOG)
🔴 Blocked      - Cannot proceed
```

### Priority Levels

```
🔴 Critical (P0) - MVP blocker, must do now
🟠 High (P1)     - Important, do soon
🟡 Medium (P2)   - Nice to have, can defer
🟢 Low (P3)      - Future, backlog
```

### Size Estimates

```
[XS] Extra Small: <1h
[S]  Small:  1-2h
[M]  Medium: 3-6h
[L]  Large:  1-2 days
[XL] Extra:  3+ days
```

---

## 📋 Kanban Format

Simple 3-column table with auto-rotation:

```markdown
## Kanban

| TODO (Top 5)                   | DOING                  | DONE (Last 5)     |
| ------------------------------ | ---------------------- | ----------------- |
| **ID** Title `[Size]` Priority | **ID** Title (started) | **ID** Title      |
| ...                            | ...                    | ... (auto-rotate) |

**Recent Milestones**: See [CHANGELOG.md](./CHANGELOG.md) for completed phases
```

**Rules**:

- **TODO**: Top 5 prioritized tasks (manual or auto-sorted)
- **DOING**: Current active tasks
  - Format: `**ID** Title (started)`
  - NO timestamp - keep it simple
  - Auto-added when user says "Y" to start
  - Auto-removed when task completes
- **DONE**: Last 5 completed (auto-drops oldest when 6th added)
- **NO Progress lines** - removed to eliminate counter maintenance
- **NO NEXT line** - first TODO task is implicit next

---

## 📝 Task Format

### Simple Format (Default)

```markdown
- [ ] **ID** Task Title `[Size]` Priority
      Brief description
      Files: path/to/file.ts
```

### Enhanced Format (Critical Tasks)

```markdown
- [ ] **ID** Task Title

  **Size**: M (4h) • **Priority**: 🔴 Critical

  Description of what and why.

  **Acceptance Criteria**:
  - [ ] Specific criterion 1
  - [ ] Specific criterion 2

  **Files**: `path/to/file.ts`
  **Refs**: DOCUMENT.md § Section
```

**Use enhanced format when**:

- Priority is Critical (🔴) or High (🟠)
- Task affects multiple files/components
- "Done" needs objective criteria

---

## 📦 Completed Phase Management

### Sub-Section Numbering Convention

**Format:** `X.Y` where:

- `X` = Phase number (1, 2, 3...)
- `Y` = Sub-section number (1, 2, 3... NOT 0.1, 0.2)

**Examples:**

```markdown
## Phase 1: Authentication & Foundation

### 1.1: Auth UI & Screens

- [ ] 1.10 Create login screen
- [ ] 1.20 Create register screen

### 1.2: Testing Infrastructure

- [ ] 1.21 Test infrastructure
- [ ] 1.22 Auth tests

### 1.3: Database Enhancements

- [ ] 1.30 Cascading deletes
- [ ] 1.31 User model enhancements
```

**Task IDs within sub-sections:**

- 1.10, 1.20, 1.30 (multiples of 10)
- Insert: 1.15, 1.25, 1.11-1.19

### Migration Trigger

**When to migrate to CHANGELOG.md:**

- When a sub-section is 100% complete (e.g., Phase 1.1 = all tasks `[x]`)
- When a full phase is complete if no sub-sections exist

**Migration Process:**

1. Detect completion (all checkboxes `[x]` in sub-section)
2. Ask user: "Migrate to CHANGELOG? [Y/n]"
3. Extract entire sub-section from TASKS.md
4. Format with `<details>` collapse in CHANGELOG
5. Insert at TOP of CHANGELOG (reverse chronological)
6. Remove from TASKS.md completely (no summary left)
7. Update "Last Updated" date

### CHANGELOG Format

```markdown
## YYYY-MM-DD - Phase X.Y: Title ✅

**Status**: Complete
**Stack**: Technologies used (e.g., React Native Reusables, WatermelonDB)

<details>
<summary>📋 Completed Tasks (N - Click to expand)</summary>

### X.Y.1: Sub-section Title

- [x] **X.Y.Z** Task title (Size - Time) _YYYY-MM-DD_
      Full description (if available)
      **Files:** paths
      **Acceptance Criteria:**
  - Criterion 1

</details>

**Key Achievements:** (3-5 bullet points summarizing impact)

**Deferred Tasks:** (if any were deferred)

---
```

**Order**: Reverse chronological (newest at top)

**Example:**

```markdown
## 2025-11-06 - Phase 0.6: UI/UX Foundation ✅

**Status**: Complete
**Stack**: React Native Reusables + @expo/vector-icons + NativeWind v4

<details>
<summary>📋 Completed Tasks (8 - Click to expand)</summary>

### 0.6.1: Component Library Setup

- [x] **0.6.1.1** Install React Native Reusables (M - 2h) _2025-01-30_
- [x] **0.6.1.2** Configure @expo/vector-icons (S - 30min) _2025-01-30_

### 0.6.2: Core Components Installation

- [x] **0.6.2.1** Install Phase 1 Components (M - 1.5h) _2025-01-30_

</details>

**Key Achievements:**

- UI components ready for Phase 1 Auth screens
- Design system documented with UX patterns

---
```

---

## 🔄 Update Cascade (6 Levels)

When marking task complete:

### Core Updates (1-2)

1. **Task checkbox**: `[ ]` → `[x]`
2. **Last Updated**: Current date (YYYY-MM-DD)

### Kanban Updates (3-5)

3. **DOING → DONE**: Move task, remove "(started)"
4. **Auto-rotate DONE**: If > 5, drop oldest
5. **Update TODO**: Remove completed task from TODO if present

### Migration Check (6)

6. **Check sub-section complete**: If 100%, trigger CHANGELOG migration
   - Move entire sub-section to CHANGELOG
   - Use `<details>` collapse format
   - Remove from TASKS.md

**Time:** All 6 updates complete in ~2 seconds

**Note:** No counter updates needed - eliminated to reduce maintenance burden

---

## ✅ Validation Checklist

### Format (Must Fix)

- [ ] Task IDs match pattern `^[0-9]+\.[0-9]+$`
- [ ] Unique task IDs (no duplicates)
- [ ] Checkboxes: `- [ ]` or `- [x]` (space required)
- [ ] TOC links point to existing headers

### Content (Should Fix)

- [ ] "Last Updated" is valid date (YYYY-MM-DD)
- [ ] Kanban DONE ≤ 5 tasks
- [ ] All required sections present (Header, Kanban, Roadmap, Timeline, Phases)

**Note:** Manual validation only. No automated git hooks (removed to eliminate counter validation errors).

---

## 📊 Kanban Management Rules

### TODO Column

**Priority sorting** (recommended):

1. All Critical (🔴) tasks first
2. Then High (🟠)
3. Then satisfied dependencies
4. Then blocking impact

**Manual override**: OK to reorder for strategic reasons

### DOING Column

**Typical**: 1-2 tasks max (focus)
**Multiple tasks OK if**:

- Waiting on external (API, review, etc.)
- Context switching intentional
- Different time blocks (morning/afternoon)

### DONE Column

**Auto-rotation**: Keeps last 5

- Task 6 completes → Task 1 drops off
- Newest always at top
- No manual cleanup needed

**Historical tracking**: Use CHANGELOG.md or git history

```bash
git log --all -- docs/CHANGELOG.md
```

---

## 🎯 Best Practices

### Task Writing

**✅ GOOD**:

```markdown
- [ ] **1.10** Implement database schema in Supabase `[M]` 🔴
      Create SQL migration matching SQLite schema.
      Files: supabase/migrations/001_initial_schema.sql
```

**❌ BAD**:

```markdown
- [ ] 1.10 Do database stuff
```

### Kanban Updates

**Auto via /task-update**:

```bash
/task-update              # Detects completion, updates all
```

**Manual (if needed)**:

- Move task ID between columns in markdown table
- Keep DONE ≤ 5 tasks
- Keep table aligned

### Zero Counter Maintenance

**Philosophy:**

- Counters become outdated quickly
- Manual sync is error-prone
- Validation scripts block productivity
- **Solution:** Eliminate counters entirely

**What was removed:**

- Progress lines (X/Y tasks, %)
- Velocity tracking (~N tasks/week)
- ETA calculations
- Phase completion percentages
- Task count summaries

**What remains:**

- Phase headers (title only)
- Task checkboxes ([x] or [ ])
- Last Updated date
- Kanban status

---

## 📖 Table of Contents Sync Rules

### Format Standard

```markdown
N. [Phase Title](#anchor-link)
```

### Sync Rules

1. **Anchor link** must be lowercase, spaces → hyphens, remove special chars
2. **One entry per phase** - no subsections in TOC
3. **Remove obsolete entries** - delete if phase migrated to CHANGELOG
4. **Update on completion** - remove phase entry when migrated

### Example Correct TOC

```markdown
## Table of Contents

1. [Kanban](#kanban)
2. [Development Roadmap](#development-roadmap)
3. [Phase Timeline & Effort](#phase-timeline--effort)
4. [Phase 1: Authentication & Foundation](#phase-1-authentication--foundation)
5. [Phase 2: Workout Plans & Navigation](#phase-2-workout-plans--navigation)
```

### Common Errors

```markdown
❌ BAD: 4. [Phase 0.5: Architecture](#...) ← Phase complete, should be removed 5. [Phase 1: Auth (0/16)](#...) ← No counters in TOC

✅ GOOD: 4. [Phase 1: Authentication & Foundation](#phase-1-authentication--foundation)
```

---

## 📚 Examples

### Header Example

```markdown
# Project Roadmap

**Project**: Halterofit v0.1.0
**Status**: 🔄 Phase 1 - Authentication & Foundation
**Last Updated**: 2025-11-20
```

### Kanban Example

```markdown
## Kanban

| TODO (Top 5)                      | DOING | DONE (Last 5)               |
| --------------------------------- | ----- | --------------------------- |
| **1.10** Login screen `[M]`       |       | **0.6.8** ExerciseDB import |
| **1.11** Register screen `[M]`    |       | **0.6.10** Schema fix 🔥    |
| **1.14** Supabase auth `[M]`      |       | **0.6.9** Design system     |
| **1.13** Protected routes `[S]`   |       | **0.6.6** Environment vars  |
| **1.15** Auth test infra `[S]` 🔥 |       | **0.6.4** Core components   |

**Recent Milestones**: See [CHANGELOG.md](./CHANGELOG.md) for completed phases
```

### Phase Example (Sub-sections)

```markdown
## Phase 1: Authentication & Foundation

**Timeline:** Weeks 9-11 | **Priority:** HIGH
**Goal:** Login/Register basics + Testing infrastructure + Database enhancements

**Est. Time:** ~40h (3 weeks)

**Dependencies:** Phase 0.6 complete (UI components ready)

**Architecture Decision:**
Auth follows **Hooks + Services + Store** pattern for optimal testability.

---

### 1.1: Auth UI & Screens

- [ ] 1.10 **Create login screen UI** (M - 2h) `[src/app/(auth)/login.tsx]`
  - Email/password inputs with validation
  - Login button with loading state
  - Uses: Button, Input, Label, Alert (React Native Reusables)

- [ ] 1.11 **Create register screen UI** (M - 2h) `[src/app/(auth)/register.tsx]`
  - Email/password inputs with confirmation field
  - Validation: email format, password ≥8 chars

### 1.2: Testing Infrastructure

- [ ] 1.15 **Create auth test infrastructure** (S - 2h) 🔥 HIGH
  - Reusable test utilities for auth testing
  - Deliverables: `__tests__/__helpers__/auth/`
```

---

## 🔧 /task-update Integration

This format is designed for `/task-update` command automation:

```bash
# Command reads this spec for:
1. Validation rules (task ID format, checkbox syntax)
2. Update cascade logic (6 levels)
3. Kanban management (auto-rotation)
4. CHANGELOG migration trigger (sub-section complete)
```

See `.claude/commands/task-update.md` for command usage.

---

## 📝 Change Log

### v5.0 (2025-11-20) - Zero Counters

- **BREAKING**: Removed ALL task counters (progress, %, velocity, ETA)
- **BREAKING**: Removed Executive Summary section
- **BREAKING**: Removed validation git hooks
- Added: CHANGELOG migration workflow with `<details>` collapse
- Added: Sub-section numbering convention (X.1, X.2, X.3)
- Added: "Completed Phase Management" section
- Simplified: Kanban (removed Progress/Velocity/NEXT lines)
- Simplified: Update cascade (16 → 6 levels)
- Simplified: Validation (no counter checks)
- Rationale: Eliminate counter maintenance burden, zero duplication with CHANGELOG

### v4.2 (2025-10-29) - Rigorous

- Added Task ID Format section with regex validation
- Moved Kanban before TOC for immediate visibility
- Expanded cascade updates: 7 → 16 levels
- Restructured validation: CRITICAL/WARNINGS/IGNORED levels

---

**Version**: 5.0 (Zero Counters)
**Last Updated**: 2025-11-20
**Philosophy**: Zero counters, zero duplication, maximum clarity
