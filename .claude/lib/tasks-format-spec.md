# TASKS.md Format Specification v4.0

**Purpose**: Enterprise-grade task management format specification for Halterofit
**Audience**: Claude AI agents, developers, project managers
**Enforcement**: Validated by `/task-update` slash command

---

## 📐 Document Structure

### Required Sections (in order)

```yaml
1. header:
    title: "# 📋 Project Roadmap"
    metadata:
      - project_name_version
      - status_emoji_phase
      - progress_with_badge
      - timeline_dates
      - last_updated_next_milestone

2. executive_summary:
    subsections:
      - current_focus
      - recent_completions (max 5)
      - this_weeks_focus (max 3-5 tasks)

3. table_of_contents:
    auto_generated: true
    format: numbered_list_with_anchors

4. development_roadmap:
    visual_tree: ascii_art
    phase_timeline_table: markdown_table
    critical_path_note: text

5. current_sprint:
    subsections:
      - sprint_metadata
      - in_progress (tasks currently being worked)
      - up_next (prioritized queue, max 5)
      - completed_this_week
      - blocked_tasks
      - sprint_metrics

6. phases:
    count: 6 (0.5, 0.5bis, 1-5)
    format: hierarchical_sections
    task_format: enhanced_checkbox_list

7. appendix:
    subsections:
      - task_size_estimates
      - priority_levels
      - conventions (optional)
      - changelog (auto-updated, last 10 entries)
```

---

## 🎨 Visual Design System

### Status Indicators

```markdown
Task Status:
⬜ Pending      - Not started
🟦 In Progress  - Actively working
✅ Completed    - Done and verified
🔴 Blocked      - Cannot proceed (reason required)

Priority Levels:
🔴 Critical (P0) - Blocking release, must do now
🟠 High (P1)     - Important for MVP, do soon
🟡 Medium (P2)   - Nice to have, can defer
🟢 Low (P3)      - Future enhancement, backlog

Phase Status:
🔵 Not Started
🟡 In Progress
🟢 Completed
🔴 Blocked (with blocker count)
```

### Size Badges

```markdown
[S]  Small:       1-2 hours
[M]  Medium:      3-6 hours
[L]  Large:       1-2 days (8-16h)
[XL] Extra Large: 3+ days (24h+)
```

### Progress Badges

```markdown
Color coding by completion percentage:
- red:    0-24%   (early stages)
- yellow: 25-74%  (in progress)
- green:  75-100% (near completion)

Format: ![](https://img.shields.io/badge/Progress-X%25-COLOR)
```

---

## 📋 Task Format Specification

### Basic Task Format (Simple)

```markdown
- [ ] **TASK_ID** Task Title `[SIZE]` PRIORITY
```

### Enhanced Task Format (Complex/Critical)

```markdown
- [ ] **TASK_ID** Task Title
  **Size**: SIZE (EST_HOURS) • **Priority**: PRIORITY • **Assignee**: NAME
  **Dependencies**: TASK_IDS • **Blocked**: YES/NO • **Epic**: EPIC_NAME

  **Description**:
  Brief description of what this task accomplishes.

  **Acceptance Criteria**:
  - [ ] Criterion 1 (specific, measurable)
  - [ ] Criterion 2
  - [ ] Criterion 3

  **Files**: `path/to/file.ts`, `path/to/other.tsx`
  **Refs**: DOCUMENT.md § Section Name
  **Tags**: #backend #database #critical
```

### Task ID Pattern

```
Format: PHASE.SECTION.TASK or PHASE.TASK

Examples:
- 0.5.2      (Phase 0.5, Task 2)
- 0.5.A.3    (Phase 0.5, Section A, Task 3)
- 1.3        (Phase 1, Task 3)
- 0.5bis.1   (Phase 0.5 Bis, Task 1)

Rules:
- IDs must be unique across entire document
- Must match pattern: ^\d+(\.\d+)?(\.[A-Z])?(\.\d+)?$
- Hierarchical but flexible for project evolution
```

---

## 🧮 Metadata Calculation Rules

### Progress Calculation

```typescript
// Overall progress
const totalTasks = 96; // Fixed for Halterofit v0.1.0
const completedTasks = count(tasks.filter(t => t.status === 'completed'));
const overallProgress = Math.floor((completedTasks / totalTasks) * 100);

// Phase progress
const phaseTotal = count(tasks.filter(t => t.phase === currentPhase));
const phaseCompleted = count(tasks.filter(t =>
  t.phase === currentPhase && t.status === 'completed'
));
const phaseProgress = Math.floor((phaseCompleted / phaseTotal) * 100);

// Badge color
const getBadgeColor = (progress: number) => {
  if (progress < 25) return 'red';
  if (progress < 75) return 'yellow';
  return 'green';
};
```

### Velocity Calculation

```typescript
// Simple moving average (last N weeks)
const completedLastWeek = tasks.filter(t =>
  t.completedDate >= oneWeekAgo && t.completedDate <= now
).length;

const completedLast4Weeks = tasks.filter(t =>
  t.completedDate >= fourWeeksAgo && t.completedDate <= now
).length;

const velocity = {
  lastWeek: completedLastWeek,
  average4Weeks: completedLast4Weeks / 4,
  trend: completedLastWeek > (completedLast4Weeks / 4) ? 'up' : 'down'
};
```

### Timeline Estimation

```typescript
// ETA for phase completion
const remainingTasks = phaseTotal - phaseCompleted;
const avgVelocity = velocity.average4Weeks;
const weeksRemaining = Math.ceil(remainingTasks / avgVelocity);
const etaDate = new Date(now.getTime() + (weeksRemaining * 7 * 24 * 60 * 60 * 1000));
```

---

## ✅ Validation Rules

### Mandatory Checks

```yaml
structure:
  - all_required_sections_present
  - sections_in_correct_order
  - table_of_contents_matches_sections

task_format:
  - all_task_ids_unique
  - all_task_ids_match_pattern
  - checkbox_syntax_correct: "- [ ]" or "- [x]"
  - dependencies_reference_existing_tasks
  - no_circular_dependencies

progress:
  - phase_progress_counts_accurate
  - overall_progress_accurate
  - progress_badge_color_matches_percentage
  - completed_task_count_matches_checkboxes

metadata:
  - last_updated_timestamp_present
  - next_milestone_specified
  - sprint_goal_defined
  - velocity_calculated_correctly

formatting:
  - markdown_syntax_valid
  - no_broken_links
  - anchors_match_headings
  - consistent_indentation (2 spaces)
  - consistent_spacing (blank lines between sections)
```

### Warning Checks (non-blocking)

```yaml
- critical_tasks_without_acceptance_criteria
- tasks_marked_completed_without_all_criteria_checked
- blocked_tasks_without_blocker_reason
- dependencies_chain_longer_than_5_tasks
- phase_with_zero_tasks_in_progress
- sprint_older_than_1_week_without_updates
```

---

## 🔄 Auto-Update Cascade Logic

When a task status changes, the following updates MUST cascade automatically:

### Level 1: Task Itself
- Checkbox: `[ ]` → `[x]` (or vice versa)
- Timestamp: Add completion date (if not present)

### Level 2: Phase Metrics
- Phase progress count: `4/15` → `5/15`
- Phase progress percentage: `27%` → `33%`
- Phase status indicator (if phase completes): 🟡 → 🟢

### Level 3: Overall Metrics
- Overall task count: `6/96` → `7/96`
- Overall percentage: `6%` → `7%`
- Progress badge color (if threshold crossed)

### Level 4: Executive Summary
- Add to "Recent Completions" (max 5, FIFO)
- Remove from "This Week's Focus" (if present)

### Level 5: Current Sprint
- Move from "In Progress" to "Completed This Week"
- Update "Up Next" (next prioritized task)
- Unblock dependent tasks (if any)
- Recalculate sprint metrics (velocity, burndown)

### Level 6: Development Roadmap
- Update ASCII tree phase progress
- Update Phase Timeline table
- Recalculate ETAs based on new velocity

### Level 7: Metadata
- Update "Last Updated" timestamp
- Update "Next Milestone" (if milestone reached)
- Increment changelog entry count

---

## 📊 Advanced Features

### Dependency Management

```markdown
**Dependency Types**:
1. Hard Dependency: Task B cannot start until Task A completes
2. Soft Dependency: Task B should wait for Task A (recommended)
3. Resource Dependency: Tasks share same resource (developer time)

**Format in Task**:
**Dependencies**: 0.5.1 (hard), 0.5.3 (soft)
**Blocks**: 1.1, 1.2, 1.3

**Validation**:
- Circular dependency detection (A depends on B, B depends on A)
- Orphan task detection (task references non-existent dependency)
- Critical path calculation (longest dependency chain)
```

### Sprint Management

```markdown
**Sprint Duration**: 1 week (configurable)
**Sprint Planning**:
- Pull from "Up Next" based on priority + dependencies
- Consider team capacity (hours/week)
- Balance critical vs non-critical work

**Sprint Metrics**:
- Planned vs Actual (tasks committed vs completed)
- Velocity (tasks completed per sprint)
- Burndown (remaining tasks over time)
- Blocker frequency (blocked tasks per sprint)
```

### Acceptance Criteria Tracking

```markdown
**Purpose**: Define "done" objectively
**Format**: Nested checkbox list under task

**Rules**:
- Each criterion must be specific and measurable
- Use active voice ("Create file X", not "File X should be created")
- Critical tasks (P0/P1) MUST have acceptance criteria
- Medium/Low tasks (P2/P3) acceptance criteria optional

**Validation**:
- Warn if marking task complete with unchecked criteria
- Block completion if task is Critical and criteria missing
```

---

## 🎯 Best Practices

### Task Writing

```markdown
✅ GOOD:
- [ ] **0.5.2** Implement database schema in Supabase
  **Size**: M (3-4h) • **Priority**: 🔴 Critical

  **Acceptance Criteria**:
  - [ ] SQL migration file created at supabase/migrations/001_initial_schema.sql
  - [ ] 5 tables defined with correct relationships
  - [ ] RLS policies configured for user isolation
  - [ ] Test data seeded successfully

❌ BAD:
- [ ] 0.5.2 Database stuff (finish it)
```

### Progress Tracking

```markdown
✅ GOOD:
- Update immediately after completing task
- Include completion timestamp
- Add notes if implementation differed from plan

❌ BAD:
- Batch updates (updating 5 tasks at once)
- Forgetting to update cascade (phase progress, etc.)
- No notes on deviations from plan
```

### Sprint Planning

```markdown
✅ GOOD:
- Plan 3-5 tasks max per week
- Consider dependencies when prioritizing
- Balance quick wins with critical work
- Leave buffer for unexpected tasks

❌ BAD:
- Overcommit (planning 15 tasks for 1 week)
- Ignore dependencies (starting blocked tasks)
- All critical or all low-priority (no balance)
```

---

## 📚 Examples

### Example: Phase Header

```markdown
## Phase 0.5: Architecture & Foundation (6/15)

**Timeline:** Week 3 | **Priority:** 🔴 HIGHEST
**Goal:** Complete infrastructure setup and critical corrections before Phase 1

**Status**: 🟡 In Progress • **Progress:** 6/15 tasks (40%)
**ETA**: 2 weeks at current velocity (3 tasks/week)
**Blockers**: None

**Stack:** expo-sqlite + AsyncStorage + react-native-chart-kit (Expo Go)
```

### Example: Enhanced Task

```markdown
- [ ] **0.5.9** [CRITICAL] User ID Persistence
  **Size**: M (4h) • **Priority**: 🔴 Critical • **Epic**: Phase 0.5.D Critical Corrections
  **Dependencies**: None • **Blocked**: No

  **Problem**: User ID forgotten on app restart → data loss in production
  **Impact if skipped**: 🔴 DATA LOSS in production

  **Acceptance Criteria**:
  - [ ] User ID stored in AsyncStorage after login
  - [ ] User ID retrieved on app restart
  - [ ] Database queries use persisted user ID
  - [ ] Tests verify persistence across app restarts

  **Files**:
  - `src/services/auth/authStorage.ts`
  - `src/stores/authStore.ts`
  - `src/services/database/db.ts`

  **Refs**: AUDIT_FIXES.md → Correction #1
  **Tags**: #backend #auth #critical #data-integrity
```

### Example: Simple Task

```markdown
- [ ] **0.5.6** Install simple-statistics for analytics `[S - 30min]` 🟡
  - npm install simple-statistics
  - Create analytics utilities folder structure
  - Document planned algorithms in TECHNICAL.md
  - Implementation in Phase 4
```

---

## 🔧 Tooling Integration

### `/task-update` Command Compliance

The format specification is designed to be machine-readable and validated by the `/task-update` slash command:

```bash
# Command reads this spec for validation rules
/task-update complete 0.5.2

# Validates against spec:
✓ Task ID exists and is valid
✓ Task is currently pending (not already completed)
✓ Dependencies satisfied (0.5.1 is completed)
✓ Acceptance criteria present (task is critical)

# Executes cascade updates per spec:
✓ Task checkbox updated
✓ Phase progress: 6/15 → 7/15
✓ Overall progress: 6/96 → 7/96
✓ Executive Summary updated
✓ Current Sprint updated
✓ Development Roadmap updated
✓ Timestamp added
```

---

## 📝 Change Log

### v4.0 (2025-10-29)
- Complete restructure with enterprise-grade features
- Added Executive Summary section
- Renamed NEXT SESSION to Current Sprint
- Enhanced task format with acceptance criteria
- Added dependency management
- Added velocity tracking
- Added validation rules
- Added auto-cascade update logic

### v3.0 (Previous)
- Basic task tracking with progress badges
- Phase-based organization
- Simple task format

---

**Maintained by**: Claude AI `/task-update` command
**Last Updated**: 2025-10-29
**Format Version**: 4.0
