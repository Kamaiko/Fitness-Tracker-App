# TASKS.md Format Specification

**Version**: 4.3
**Last Updated**: 2025-10-29
**Purpose**: Clean, maintainable project roadmap specification
**Philosophy**: Maximum clarity, minimal duplication, stable automation

---

## 📋 Table of Contents

1. [Task ID Format](#task-id-format)
2. [Document Structure](#document-structure)
3. [Kanban Board](#kanban-board)
4. [Table of Contents](#table-of-contents-format)
5. [Update Protocol](#update-protocol)
6. [Validation Rules](#validation-rules)
7. [Velocity Tracking](#velocity-tracking)

---

## 🏷️ Task ID Format

### Pattern

**Regex:** `^[0-9]+\.[0-9]+$`

**Format:** `X.Y`
- `X` = Phase number (0-9)
- `Y` = Task number (1-99+)

### Valid Examples

```markdown
✅ VALID:
- 0.5.1 (Phase 0.5, Task 1)
- 0.5.20 (Phase 0.5, Task 20)
- 1.3 (Phase 1, Task 3)
- 2.15 (Phase 2, Task 15)

❌ INVALID:
- 0.5bis.1 (letter suffix)
- 0.5.B.1 (subsection in ID)
- 0.5-10 (dash instead of dot)
- 0.5.1.2 (sub-levels)
```

### Rules

- ✅ Sequential numbering within phase
- ✅ Numbers can skip (e.g., 0.5.17, 0.5.18, 0.5.20)
- ❌ NO letters, dashes, or sub-levels

---

## 📐 Document Structure

### Required Sections (in order)

1. **Header** - Project metadata
2. **Executive Summary** - Quick snapshot + Recent completions
3. **Kanban** - Current work board ← BEFORE TOC for visibility
4. **Table of Contents** - Phase navigation
5. **Development Roadmap** - Visual tree
6. **Phase Sections** - Detailed task lists
7. **Appendix** - Size estimates, conventions

### Header Format

```markdown
# 📋 Project Roadmap

**Project**: Name v0.1.0
**Status**: 🟡 In Progress (Phase X)
**Progress**: N/M tasks (X%) • ![badge]
**Timeline**: N weeks • Started YYYY-MM-DD • Target YYYY-MM-DD
**Last Updated**: YYYY-MM-DD • **Next Milestone**: Description
```

### Executive Summary Format

```markdown
## 📊 Executive Summary

**Current Focus**: Phase description
**Phase Progress**: N/M tasks (X%) • **Overall**: N/Total (X%)
**Critical Blockers**: None or list

### Recent Completions ✅

1. Task ID - Description
2. Task ID - Description
3. Task ID - Description
4. Task ID - Description
5. Task ID - Description
```

**Rules:**
- Keep last 5 completed tasks
- Auto-rotate when new task completes (drop oldest)

---

## 📋 Kanban Board

### Format

```markdown
## 📋 Kanban

| 📝 TODO (Top 5) | 🔨 DOING | ✅ DONE (Last 5) |
|-----------------|----------|------------------|
| **ID** Title `[S]` 🔴 | **ID** Title (started) | **ID** Title |
| **ID** Title `[M]` 🟠 |          | **ID** Title |
| **ID** Title `[L]` 🟠 |          | **ID** Title |
| **ID** Title `[S]` 🟡 |          | **ID** Title |
| **ID** Title `[M]` 🟡 |          | **ID** Title |

**Progress**: Phase X: N/M (X%) • Overall: N/Total (X%)
**Velocity**: ~N tasks/week • **ETA**: Phase X complete in ~N weeks
**NEXT**: Task ID Title ⚡
```

### Rules

**TODO Column:**
- Keep top 5 next tasks
- Show size: `[S]` Small, `[M]` Medium, `[L]` Large
- Priority color: 🔴 HIGH, 🟠 MEDIUM, 🟡 LOW

**DOING Column:**
- Format: `**ID** Title (started)`
- NO timestamps
- Auto-added when user confirms task start

**DONE Column:**
- Keep last 5 completed tasks
- Auto-rotate: When 6th task completes, drop oldest
- Format: `**ID** Title` (no emoji, no size)

**Progress Line:**
- Update both phase and overall counts
- Auto-calculate percentages

**NEXT Line:**
- Single task + ⚡ emoji
- Auto-update when current completes

---

## 📖 Table of Contents Format

### Structure

```markdown
## 📖 Table of Contents

1. [📊 Executive Summary](#-executive-summary)
2. [📋 Kanban](#-kanban)
3. [🗺️ Development Roadmap](#development-roadmap)
4. [Phase 0.5: Architecture & Foundation](#phase-05)
5. [Phase 1: Authentication & Foundation](#phase-1)
6. [Phase 2: Workout Logging](#phase-2)
...
10. [Task Size Estimates & Priority Levels](#task-size-estimates--priority-levels)
```

### Key Principles

1. **NO progress counts** - Eliminates duplication
2. **Stable anchors** - Links never break
3. **One entry per phase** - No subsections

### Phase Header Pattern

```markdown
<a id="phase-N"></a>

## Phase N: Title (X/M)
```

**Benefits:**
- ✅ TOC links to `#phase-N` (permanent)
- ✅ Header shows `(X/M)` (dynamic, visible)
- ✅ No broken links when counts change
- ✅ Simpler automation

### Anchor Naming

- Phase 0.5 → `#phase-05`
- Phase 1 → `#phase-1`
- Phase 2 → `#phase-2`
- etc.

---

## 🔄 Update Protocol

### When Task Completes

Apply 15-level cascade automatically:

#### Core Updates (1-3)
1. Mark checkbox: `[ ]` → `[x]`
2. Update phase progress: `N/M` → `(N+1)/M`
3. Update overall progress: `N/Total` → `(N+1)/Total`

#### Visual Updates (4-9)
4. Move task from DOING → DONE
5. Auto-rotate DONE (keep last 5)
6. Update Kanban progress line
7. Update Kanban NEXT line
8. Update progress badge percentage
9. Update Development Roadmap tree

#### Metadata Updates (10-13)
10. Set "Last Updated" to current date
11. Rotate Recent Completions (add new, drop oldest)
12. Update subsection progress `(X/M)`
13. Update subsection emoji if complete

#### Strategic Updates (14-15)
14. Update Phase Timeline table if phase complete
15. Recalculate velocity & ETA

**Note:** TOC does NOT need updates (stable anchors)

---

## ✅ Validation Rules

### CRITICAL (Must Fix)

- Task IDs match pattern `^[0-9]+\.[0-9]+$`
- All task IDs unique (no duplicates)
- Checkbox syntax exact: `- [ ]` or `- [x]`
- Each phase has anchor: `<a id="phase-N"></a>`

### WARNINGS (Should Fix)

- Progress counts match actual checkboxes
- Kanban has ≤ 5 tasks per column
- Phase counts sum correctly to total
- Recent Completions has ≤ 5 entries

### IGNORED (Not Validated)

- File paths existence
- Time estimates accuracy
- Task dependencies
- Commit references

**Validation Strategy:**
Show warnings but DON'T block updates.

---

## 📈 Velocity Tracking

### Formula

```
Velocity = Tasks completed in last 4 weeks ÷ 4
ETA (weeks) = Tasks remaining ÷ Velocity
```

### Rules

- Count only completed tasks (checkboxes with [x])
- Use git log to find completion dates
- If < 4 weeks of data, use available data
- Round to nearest whole number
- Update after each task completion

### Example

```markdown
**Velocity**: ~3 tasks/week
**ETA**: Phase 0.5 complete in ~7 weeks
```

**Interpretation:**
- Velocity varies naturally
- Use as rough guide, not promise
- Adjusts automatically as work continues

---

## 📝 Change Log

### v4.3 (2025-10-29) - Simplified TOC
- **BREAKING**: Removed progress counts from TOC
- Added stable HTML anchors for phases
- Reduced cascade: 16 → 15 levels
- Eliminated TOC sync complexity
- Zero broken links guarantee

### v4.2 (2025-10-29) - Rigorous
- Added Task ID regex validation
- Moved Kanban before TOC
- Enhanced DOING format
- Expanded cascade to 16 levels
- Added validation tiers

### v4.1 (2025-10-29) - Simplified
- Removed complex sprint management
- Simple Kanban-based workflow
- Focus on automation

---

## 🔗 Related Documents

- **Usage**: See `.claude/commands/task-update.md` for slash command
- **Implementation**: This spec defines TASKS.md format
- **Project**: See `CLAUDE.md` for project overview

---

**End of Specification**
