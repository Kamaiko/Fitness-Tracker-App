# TASKS.md Format Specification v4.2 (Rigorous)

**Purpose**: Clean, maintainable project roadmap with strict validation
**Philosophy**: Maximum clarity, rigorous automation, minimum friction

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
- ✅ Examples: `0.5.10`, `1.20`, `2.100`, `3.15` (inserted)
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

**Migration Note:** Phases 0.5 and 0.6 retain original numbering (0.5.1, 0.5.20, etc.) as they are already complete/in-progress. New phases (1-5) use spacing-by-10 convention.

---

## 📐 Document Structure

### Required Sections (in order)

1. **Header** - Title + Metadata
2. **Executive Summary** - Quick snapshot
3. **Kanban** - Current work board (MOVED UP)
4. **Table of Contents** - Navigation
5. **Development Roadmap** - Visual overview
6. **Phases** - Detailed task lists
7. **Appendix** - Size estimates, conventions

**Note:** Kanban moved before TOC for immediate visibility of current work.

---

## 🎨 Visual Design System

### Status Indicators

```
⬜ Pending      - Not started
🟦 In Progress  - Actively working
✅ Completed    - Done
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
[S]  Small:  1-2h
[M]  Medium: 3-6h
[L]  Large:  1-2 days
[XL] Extra:  3+ days
```

---

## 📋 Kanban Format

Simple 3-column table with auto-rotation:

```markdown
## 📋 Kanban

| 📝 TODO (Top 5) | 🔨 DOING | ✅ DONE (Last 5) |
|-----------------|----------|------------------|
| **ID** Title `[Size]` Priority | **ID** Title (started) | **ID** Title |
| ...             | ...      | ... (auto-rotate) |

**Progress**: Phase X: N/M (X%) • Overall: N/98 (X%)
**Velocity**: ~N tasks/week • **ETA**: ~N weeks
**NEXT**: Task ID Title ⚡
```

**Rules**:
- **TODO**: Top 5 prioritized tasks (manual or auto-sorted)
- **DOING**: Current active tasks
  - Format: `**ID** Title (started)`
  - NO timestamp - keep it simple
  - Auto-added when user says "Y" to start
  - Auto-removed when task completes
- **DONE**: Last 5 completed (auto-drops oldest when 6th added)
- **Progress line**: Auto-calculated from checkboxes (98 total)
- **NEXT line**: Shows immediate next priority with ⚡ emoji

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

## 🧮 Auto-Calculations

### Progress Tracking

```typescript
// Phase progress
phaseCompleted = count([x] in phase)
phaseTotal = count(all tasks in phase)
phasePercent = floor((phaseCompleted / phaseTotal) * 100)

// Overall progress (Halterofit MVP = 58 tasks)
// Note: Changed from 119 to 58 after scope refinement (Feb 2025)
// Post-MVP features moved to backlog (not counted in total)
overallCompleted = count([x] in entire doc, excluding Post-MVP section)
overallTotal = 58  // MVP scope only
overallPercent = floor((overallCompleted / 58) * 100)

// Badge color
if (percent < 25) color = 'red'
else if (percent < 75) color = 'yellow'
else color = 'green'
```

### Velocity (Simple Average)

```typescript
// Tasks completed last N weeks
velocity = completedLast4Weeks / 4

// ETA for phase
remainingTasks = phaseTotal - phaseCompleted
weeksRemaining = ceil(remainingTasks / velocity)
```

---

## ✅ Validation Checklist

### CRITICAL (Must Fix - But Don't Block)

These are errors that MUST be fixed, but `/task-update` will show warnings and continue:

- [ ] Task IDs match pattern `^[0-9]+\.[0-9]+$`
- [ ] All task IDs unique (no duplicates)
- [ ] Checkboxes exact syntax: `- [ ]` or `- [x]` (space required)
- [ ] TOC links point to existing headers (no 404s)
- [ ] All required sections present (header, summary, kanban, toc, phases)

### WARNINGS (Should Fix)

These show warnings but are not critical:

- [ ] Progress counts match checkbox counts exactly
- [ ] Kanban TODO/DONE ≤ 5 tasks (show if > 5)
- [ ] Phase counts sum to overall count (show diff)
- [ ] "Recent Completions" has 5 items (show actual count)
- [ ] Progress badge % matches overall progress
- [ ] "Last Updated" is valid ISO date (YYYY-MM-DD)

### IGNORED (Not Validated)

These are nice-to-have but not enforced:

- File paths in tasks (assume correct)
- Task time estimates (not validated)
- Dependencies reference valid IDs (assume correct)
- Acceptance criteria completeness

---

## 🔄 Complete Update Cascade (16 Levels)

When `/task-update` marks task complete, update ALL of these:

### Core Updates (Levels 1-3)
1. **Task checkbox**: `[ ]` → `[x]` in phase section
2. **Phase progress**: `N/M` → `(N+1)/M` in phase header
3. **Overall progress**: `N/98` → `(N+1)/98` in document header

### Visual Updates (Levels 4-7)
4. **Kanban DOING → DONE**: Move task, remove "(started)"
5. **Kanban auto-rotate**: If DONE > 5, drop oldest
6. **Kanban progress line**: Update counts
7. **Kanban NEXT line**: Update with new next task
8. **Progress badge**: Update % in `![badge](url)` (color if threshold)
9. **Development Roadmap**: Update phase tree visual

### Metadata Updates (Levels 10-12)
10. **"Last Updated"**: Set to current date (YYYY-MM-DD)
11. **"Recent Completions"**: Add task to list (keep last 5, rotate)
12. **Subsection progress**: Update `0.5.B (X/M)` → `(X+1/M)`
13. **Subsection emoji**: Change `⚡ NEXT` → `✅ COMPLETE` if all done

### Strategic Updates (Levels 14-16)
14. **Table of Contents**: Sync phase counts `(X/M)`
15. **Phase Timeline table**: Mark `✅ COMPLETE` if phase done, update STATUS
16. **Velocity & ETA**: Recalculate simple average, update ETA

**Time:** All 16 updates complete in ~2 seconds

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

**Historical tracking**: Use git history
```bash
git log --grep="task-update" --oneline
```

---

## 🎯 Best Practices

### Task Writing

**✅ GOOD**:
```markdown
- [ ] **0.5.2** Implement database schema in Supabase `[M]` 🔴
  Create SQL migration matching SQLite schema.
  Files: supabase/migrations/001_initial_schema.sql
```

**❌ BAD**:
```markdown
- [ ] 0.5.2 Do database stuff
```

### Kanban Updates

**Auto via /task-update**:
```bash
/task-update              # Detects completion, updates all
```

**Manual (if needed)**:
- Move task ID between columns in markdown table
- Update progress line
- Keep counts accurate

### Velocity Tracking (Simplified)

**Simple average** (no complex formulas):

```
Velocity = Tasks completed last 4 weeks ÷ 4
ETA (weeks) = Tasks remaining ÷ Velocity
```

**Example:**
- Completed last 4 weeks: 12 tasks
- Velocity: 12 ÷ 4 = 3 tasks/week
- Remaining in phase: 22 tasks
- ETA: 22 ÷ 3 = ~7 weeks

**Update frequency:** Recalculate after each task completion

**Note:** Velocity varies naturally - use as rough guide, not promise

---

## 📖 Table of Contents Sync Rules

### Format Standard
```markdown
N. [Phase Title (X/M)](#anchor-link)
```

### Sync Rules
1. **Phase progress `(X/M)`** must match phase header exactly
2. **Anchor link** must be lowercase, spaces → hyphens, remove special chars
3. **One entry per phase** - no subsections in TOC (subsections are internal grouping only)
4. **Remove obsolete entries** - delete if phase renamed/merged
5. **Update on task completion** - if phase progress changes

### Example Correct TOC
```markdown
## 📖 Table of Contents

1. [📊 Executive Summary](#-executive-summary)
2. [📋 Kanban](#-kanban)
3. [🗺️ Development Roadmap](#development-roadmap)
4. [Phase 0.5: Architecture & Foundation (6/28)](#phase-05-architecture--foundation-628)
5. [Phase 1: Authentication & Foundation (0/14)](#phase-1-authentication--foundation-014)
```

### Common Errors
```markdown
❌ BAD:
4. [Phase 0.5 Bis: Migration](#phase-05-bis...)  ← Obsolete, should be removed
5. [Phase 0.5: Architecture](#phase-05...)        ← Duplicate, keep ONE only

❌ BAD (wrong count):
4. [Phase 0.5: Architecture (7/28)](#...)  ← Says 7 but actual is 6

✅ GOOD:
4. [Phase 0.5: Architecture & Foundation (6/28)](#phase-05-architecture--foundation-628)
```

---

## 📚 Examples

### Header Example

```markdown
# 📋 Project Roadmap

**Project**: Halterofit v0.1.0
**Status**: 🟡 In Progress (Phase 0.6)
**Progress**: 27/58 tasks (47%) • MVP Scope Refined
**Timeline**: 10-12 weeks • Started 2025-01-20 • Target 2025-04-15
**Last Updated**: 2025-02-04 • **Next Milestone**: Complete ExerciseDB Import (Phase 0.6)
```

### Kanban Example

```markdown
## 📋 Kanban

| 📝 TODO (Top 5) | 🔨 DOING | ✅ DONE (Last 5) |
|-----------------|----------|------------------|
| **0.6.8** ExerciseDB import `[L]` 🔥 | | **0.6.6** Environment vars ✅ |
| **1.10** Login screen `[M]` 🟠 | | **0.6.4** Core components ✅ |
| **1.20** Register screen `[M]` 🟠 | | **0.6.3** Dark theme ✅ |
| **1.30** Supabase auth `[M]` 🟠 | | **0.6.9** Design system ✅ |
| **1.40** Password reset `[M]` | | **0.6.2** @expo/vector-icons ✅ |

**Progress**: Phase 0.5: 21/26 (81%) • Phase 0.6: 6/8 (75%) • Overall: 27/58 (47%)
**Velocity**: ~5 tasks/week • **ETA**: Phase 0.6 complete in 1 day, MVP in 10-12 weeks
**NEXT**: 0.6.8 ExerciseDB Import 🔥 (3-4h) → Phase 1 Auth screens
```

### Phase Example (New Convention - Spacing by 10)

```markdown
## Phase 1: Authentication & Foundation (0/6)

**Timeline**: Weeks 9-10 | **Priority**: HIGH
**Goal**: Login/Register basics + Maestro E2E setup

**Progress**: 0/6 tasks (0%) | **Est. Time**: ~15h (2 weeks)

**Dependencies**: Phase 0.6 complete (UI components ready)

---

- [ ] 1.10 **Create login screen UI** (M - 2h) `[src/app/(auth)/login.tsx]`
  - Email/password inputs (Input component from 0.6.4)
  - Login button (Button component)
  - "Forgot password" link → 1.40
  - Loading state, error handling

- [ ] 1.20 **Create register screen UI** (M - 2h) `[src/app/(auth)/register.tsx]`
  - Email/password inputs with validation
  - Register button
  - Link back to login (1.10)

- [ ] 1.30 **Implement Supabase Auth integration** (M - 3h) `[src/services/auth/]`
  - Sign up/in/out functionality
  - Session management (JWT tokens in MMKV)
```

---

## 🔧 /task-update Integration

This format is designed for `/task-update` command automation:

```bash
# Command reads this spec for:
1. Validation rules (task ID format, checkbox syntax)
2. Update cascade logic (what to update when task completes)
3. Kanban management (auto-rotation, priority sorting)
4. Progress calculation (formulas)
```

See `.claude/commands/task-update.md` for command usage.

---

## 📝 Change Log

### v4.2 (2025-10-29) - Rigorous
- Added Task ID Format section with regex validation (`^[0-9]+\.[0-9]+$`)
- Moved Kanban before TOC for immediate visibility
- Enhanced DOING column format: `**ID** Title (started)` (no timestamps)
- Expanded cascade updates: 7 → 16 levels
- Restructured validation: CRITICAL/WARNINGS/IGNORED levels
- Simplified velocity calculation (basic average only)
- Added TOC Sync Rules section
- Removed "This Week's Focus" section

### v4.1 (2025-10-29) - Simplified
- Reduced from 500 → 200 lines
- Removed complex sprint management
- Replaced "Current Sprint" with simple Kanban
- Removed task templates (integrated into spec)
- Simplified validation rules
- Focus on automation via /task-update

### v4.0 (2025-10-29) - Enterprise Edition
- Initial professional format
- Complex sprint tracking (removed in 4.1)
- Multiple task templates (simplified in 4.1)

---

**Version**: 4.2 (Rigorous)
**Last Updated**: 2025-10-29
**Philosophy**: Maximum clarity, rigorous automation, minimum friction
