# TASKS.md Format Specification v4.1 (Simplified)

**Purpose**: Clean, maintainable project roadmap format
**Philosophy**: Maximum clarity, minimum overhead

---

## 📐 Document Structure

### Required Sections (in order)

1. **Header** - Title + Metadata
2. **Executive Summary** - Quick snapshot
3. **Table of Contents** - Navigation
4. **Development Roadmap** - Visual overview
5. **Kanban** - Current work board
6. **Phases** - Detailed task lists
7. **Appendix** - Size estimates, conventions

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
| **ID** Title `[Size]` Priority | **ID** Title | **ID** Title |
| ...             | ...      | ... (auto-rotate) |

**Progress**: Phase X: N/M (X%) • Overall: N/96 (X%)
**Velocity**: ~N tasks/week • **ETA**: Phase done in ~N weeks
```

**Rules**:
- TODO: Top 5 prioritized tasks (manual or auto-sorted)
- DOING: Current active tasks (1-2 typically)
- DONE: Last 5 completed (auto-drops oldest when 6th added)
- Progress line: Auto-calculated from checkboxes

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

// Overall progress (Halterofit = 96 tasks total)
overallCompleted = count([x] in entire doc)
overallPercent = floor((overallCompleted / 96) * 100)

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

### Must-Have

- [ ] All required sections present
- [ ] Task IDs unique (format: X.Y or X.Y.Z)
- [ ] Checkboxes correct syntax: `- [ ]` or `- [x]`
- [ ] Progress counts match actual checkboxes
- [ ] Kanban has max 5 in TODO/DONE
- [ ] Table of contents links work

### Nice-to-Have

- [ ] Critical tasks have acceptance criteria
- [ ] File paths in tasks are accurate
- [ ] Dependencies reference valid task IDs
- [ ] Last Updated timestamp current

---

## 🔄 Update Protocol (Auto via /task-update)

When task completes, cascade updates:

**Level 1**: Task itself
- Checkbox: `[ ]` → `[x]`

**Level 2**: Phase metrics
- Phase count: `6/15` → `7/15`
- Phase percent: `40%` → `47%`

**Level 3**: Overall metrics
- Overall count: `6/96` → `7/96`
- Overall percent: `6%` → `7%`
- Badge color (if threshold crossed)

**Level 4**: Kanban
- Move task: DOING → DONE
- Auto-rotate if DONE > 5 tasks
- Update progress line

**Level 5**: Roadmap
- Update phase tree progress

**Level 6**: Metadata
- Update "Last Updated" timestamp

**Level 7**: Suggestions
- Suggest next task from TODO

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

### Velocity Tracking

**Simple average works**:
- Track completed last 4 weeks
- Divide by 4 = avg per week
- Use for ETA estimates

**Don't overthink**: Velocity varies, estimates are guides not contracts

---

## 📚 Examples

### Header Example

```markdown
# 📋 Project Roadmap

**Project**: Halterofit v0.1.0
**Status**: 🟡 In Progress (Phase 0.5)
**Progress**: 6/96 tasks (6%) • ![](https://img.shields.io/badge/Progress-6%25-red)
**Timeline**: 14 weeks • Started 2025-01-20 • Target 2025-04-28
**Last Updated**: 2025-10-29 • **Next Milestone**: Phase 0.5 Complete
```

### Kanban Example

```markdown
## 📋 Kanban

| 📝 TODO (Top 5) | 🔨 DOING | ✅ DONE (Last 5) |
|-----------------|----------|------------------|
| **0.5.2** Database schema `[M]` 🔴 | **0.5.1** Expo-sqlite ✅ | **0.5.18** Jest |
| **0.5.3** FlashList `[S]` 🟡 | | **0.5.17** Dev tools |
| **0.5.6** Statistics `[S]` 🟡 | | **0.5.8** Audit |
| **0.5.4** Expo-image `[S]` 🟡 | | **0.5.7** Architecture |
| **0.5.5** Sentry `[M]` 🟠 | | _(auto-rotate)_ |

**Progress**: Phase 0.5: 6/15 (40%) • Overall: 6/96 (6%)
**Velocity**: ~3 tasks/week • **ETA**: Phase 0.5 complete in ~2 weeks
```

### Phase Example

```markdown
## Phase 0.5: Architecture & Foundation (6/15)

**Timeline**: Week 3 | **Priority**: 🔴 HIGHEST
**Status**: 🟡 In Progress • **Progress**: 6/15 (40%)

---

### 0.5.A Infrastructure Setup (2/5)

- [x] 0.5.1 **Setup expo-sqlite** (M - 4h) ✅
  - Implemented in commit abc123

- [ ] 0.5.2 **Implement database schema** `[M - 3-4h]` 🔴
  Create Supabase migration matching SQLite.
  Files: supabase/migrations/001_initial_schema.sql
  Refs: DATABASE.md § Supabase Sync

- [ ] 0.5.3 **Install FlashList** `[S - 1h]` 🟡
  npm install @shopify/flash-list
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

**Version**: 4.1 (Simplified)
**Last Updated**: 2025-10-29
**Philosophy**: Keep it simple, automate the rest
