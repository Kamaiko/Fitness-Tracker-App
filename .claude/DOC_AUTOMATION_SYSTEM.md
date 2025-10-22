# 🤖 Documentation Automation System

> **Purpose**: Automatic documentation updates based on triggers
> **Goal**: Claude updates docs systematically without manual direction

---

## 🎯 Philosophy

**Problem**: Manual documentation updates are:

- Time-consuming (5-10 min per session)
- Error-prone (easy to forget)
- Inconsistent (different formats)
- Boring (repetitive work)

**Solution**: Event-driven automatic updates

```
Code Event → Trigger → Automatic Doc Update → Commit
```

---

## 📋 Trigger-Based Update System

### Trigger 1: Task Completion ✅

**Event**: Any task from TASKS.md is completed

**Automatic Updates**:

```markdown
## Documentation Updates (Automatic)

### Update 1: Mark task complete

📄 File: docs/TASKS.md
📍 Section: Current phase, specific task
✏️ Action: Change [ ] to [x]

### Update 2: Increment progress counter

📄 File: docs/TASKS.md
📍 Section: ## 📊 Current Status (line ~56)
✏️ Action: Increment "X completed / 96 total tasks"

### Update 3: Update progress badge

📄 File: docs/TASKS.md
📍 Section: Top of file (line 5)
✏️ Action: Calculate new percentage, update badge

### Update 4: Sync to README.md

📄 File: README.md
📍 Section: ## 🎯 Current Status (line ~102)
✏️ Action: Update "X/96 tasks (Y%)"
```

**Implementation**:

```typescript
// WHEN: After completing ANY task
function onTaskComplete(taskId: string) {
  const updates = [
    { file: 'docs/TASKS.md', action: 'mark_checkbox', taskId },
    { file: 'docs/TASKS.md', action: 'increment_progress' },
    { file: 'docs/TASKS.md', action: 'update_badge' },
    { file: 'README.md', action: 'sync_progress' },
  ];

  executeDocUpdates(updates);
  commitDocs('docs: update progress after completing task ' + taskId);
}
```

---

### Trigger 2: Phase Completion 🎉

**Event**: All tasks in a phase are complete

**Automatic Updates**:

```markdown
## Documentation Updates (Automatic)

### Update 1: Mark phase complete in roadmap

📄 File: docs/TASKS.md
📍 Section: ## 🗺️ Development Roadmap (line ~58)
✏️ Action: Add ✅ COMPLETE marker

### Update 2: Move "YOU ARE HERE" marker

📄 File: docs/TASKS.md
📍 Section: Roadmap diagram
✏️ Action: Move to next phase

### Update 3: Add "NEXT SESSION" to next phase

📄 File: docs/TASKS.md
📍 Section: Next phase heading
✏️ Action: Add ⭐ NEXT SESSION marker

### Update 4: Update current status

📄 File: README.md
📍 Section: ## 🎯 Current Status (line 102)
✏️ Action: Update "Phase: X.X - Name"

### Update 5: Update TECHNICAL.md header

📄 File: docs/TECHNICAL.md
📍 Section: Top header (line 3-5)
✏️ Action: Update **Status:** Phase X
```

**Detection Logic**:

```typescript
// WHEN: Checking if phase is complete
function detectPhaseComplete(phase: string) {
  const tasks = getTasksForPhase(phase);
  const completed = tasks.filter((t) => t.checked).length;

  if (completed === tasks.length) {
    onPhaseComplete(phase);
  }
}
```

---

### Trigger 3: Bug Fixed 🐛

**Event**: Bug is solved during session

**Automatic Updates**:

```markdown
## Documentation Updates (Automatic)

### Update: Add to TROUBLESHOOTING.md

📄 File: docs/TROUBLESHOOTING.md
📍 Section: Under appropriate category (by component)
✏️ Action: Add new section

### [Bug Title]

**Symptoms:**

- [Auto-extracted from error]

**Cause:**

- [Root cause explanation]

**Solution:**
[Code/commands used to fix]
```

**Implementation**:

```typescript
// WHEN: After fixing a bug
function onBugFixed(bug: { title; symptoms; cause; solution }) {
  const category = detectCategory(bug); // WatermelonDB, MMKV, Metro, etc.

  addToTroubleshooting({
    file: 'docs/TROUBLESHOOTING.md',
    category,
    content: formatBugSection(bug),
  });

  commitDocs('docs(troubleshooting): add solution for ' + bug.title);
}
```

---

### Trigger 4: Tech Decision Made 🎓

**Event**: Making an architectural decision

**Automatic Updates**:

```markdown
## Documentation Updates (Automatic)

### Update: Add ADR to TECHNICAL.md

📄 File: docs/TECHNICAL.md
📍 Section: After last ADR
✏️ Action: Add new ADR section

### ADR-XXX: [Decision Name]

**Decision:** [What was decided]

**Rationale:** [Why this choice]

**Trade-offs:** [Pros and cons]

**Status:** ✅ Implemented / 📋 Planned
```

**Implementation**:

```typescript
// WHEN: Making a tech decision
function onTechDecision(decision: ADR) {
  const adrNumber = getNextADRNumber();

  addADR({
    file: 'docs/TECHNICAL.md',
    number: adrNumber,
    content: formatADR(decision),
  });

  commitDocs('docs(technical): add ADR-' + adrNumber + ' ' + decision.name);
}
```

---

### Trigger 5: Schema Change 🗄️

**Event**: Database schema modified

**Automatic Updates**:

```markdown
## Documentation Updates (Automatic)

### Update: Sync schema in DATABASE.md

📄 File: docs/DATABASE.md
📍 Section: Relevant table section
✏️ Action: Update schema definition

### Update: Sync schema in TECHNICAL.md

📄 File: docs/TECHNICAL.md
📍 Section: ## 🗄️ Database Schema
✏️ Action: Update schema reference
```

---

### Trigger 6: New Feature Added ✨

**Event**: Feature implementation complete

**Automatic Updates**:

```markdown
## Documentation Updates (Automatic)

### Update 1: Add to README features list

📄 File: README.md
📍 Section: ## 🎯 What Makes Halterofit Different
✏️ Action: Add feature if user-facing

### Update 2: Update ARCHITECTURE.md if needed

📄 File: docs/ARCHITECTURE.md
📍 Section: Relevant pattern section
✏️ Action: Document new pattern/component

### Update 3: Add usage example to DATABASE.md

📄 File: docs/DATABASE.md
📍 Section: ## 💡 Usage Examples
✏️ Action: Add real-world example if DB-related
```

---

## 🔄 Automatic Update Workflow

### Step 1: Detect Trigger

```typescript
// Claude automatically detects:
if (taskCompleted) trigger = 'TASK_COMPLETE';
if (phaseCompleted) trigger = 'PHASE_COMPLETE';
if (bugFixed) trigger = 'BUG_FIXED';
if (techDecision) trigger = 'TECH_DECISION';
if (schemaChanged) trigger = 'SCHEMA_CHANGE';
if (featureAdded) trigger = 'FEATURE_ADDED';
```

### Step 2: Generate Update Plan

```typescript
const updatePlan = generateUpdatesForTrigger(trigger, context);
// Returns precise list of files/sections/changes
```

### Step 3: Execute Updates

```typescript
for (const update of updatePlan) {
  // 1. Read current state
  const current = Read(update.file, update.offset, update.limit);

  // 2. Verify expected content
  assert(current.includes(update.expectedContent));

  // 3. Make precise edit
  Edit({
    file_path: update.file,
    old_string: update.oldContent,
    new_string: update.newContent,
  });

  // 4. Verify change applied
  const updated = Read(update.file, update.offset, update.limit);
  assert(updated.includes(update.newContent));
}
```

### Step 4: Commit with Convention

```typescript
commitDocs(generateCommitMessage(trigger, updates));
// Examples:
// "docs: update progress after completing task 0.5bis.3"
// "docs: mark Phase 0.5 Bis complete and prepare Phase 1"
// "docs(troubleshooting): add solution for WatermelonDB sync error"
// "docs(technical): add ADR-013 ExerciseDB integration"
```

---

## 📊 Primary Source Matrix

**Prevents duplication by defining ownership:**

**Terminology:**

- **Primary Source** (authoritative, write here first)
- **Synchronized Mirror** (auto-updated copy, never write directly)
- **Reference** (link only, no duplication)

| Information         | Owner File                 | Sync To                       | Update Frequency |
| ------------------- | -------------------------- | ----------------------------- | ---------------- |
| **Current Phase**   | README.md § Current Status | TECHNICAL.md header           | Phase change     |
| **Progress (X/96)** | README.md § Current Status | TASKS.md § Current Status     | Task complete    |
| **Task List**       | TASKS.md                   | NOWHERE                       | Never duplicate  |
| **Tech Stack**      | README.md § Tech Stack     | NOWHERE                       | Stack change     |
| **Setup Guide**     | CONTRIBUTING.md            | NOWHERE                       | Stack change     |
| **ADRs**            | TECHNICAL.md               | NOWHERE                       | New decision     |
| **Database Schema** | DATABASE.md                | TECHNICAL.md (reference only) | Schema change    |
| **Troubleshooting** | TROUBLESHOOTING.md         | NOWHERE                       | Bug fixed        |

**Rules:**

- ✅ One Primary Source per piece of information
- ✅ Mirrors must be auto-synchronized (never manually updated)
- ✅ Use References (links) instead of Mirrors when possible
- ❌ Never duplicate changing information manually

---

## 🎯 Update Conventions

### Convention 1: Progress Updates

**ALWAYS update together** (atomic operation):

```typescript
// When task completes:
updates = [
  'docs/TASKS.md → Mark checkbox [x]',
  'docs/TASKS.md → Increment counter',
  'docs/TASKS.md → Update badge %',
  'README.md → Sync progress',
];

// Execute all or none (atomic)
```

### Convention 2: Phase Transitions

**ALWAYS update in this order**:

```typescript
// When phase completes:
updates = [
  '1. docs/TASKS.md → Mark phase complete',
  '2. docs/TASKS.md → Move YOU ARE HERE',
  '3. docs/TASKS.md → Add NEXT SESSION',
  '4. README.md → Update current phase',
  '5. docs/TECHNICAL.md → Update status',
];

// Order matters for consistency
```

### Convention 3: Documentation Headers

**AVOID obsolete timestamps**:

```markdown
❌ WRONG (becomes obsolete):
**Last Updated:** January 2025
**Version:** 0.2.0
**Phase:** 0.5 Bis

✅ CORRECT (always current):
**Last Updated:** See [README.md § Current Status](../README.md#current-status)
**Current Phase:** See [README.md](../README.md#current-status)
```

### Convention 4: Feature Documentation

**WHEN adding a feature**:

```typescript
// Automatic checklist:
✅ Mark task [x] in TASKS.md
✅ Update progress counters
✅ Add to TROUBLESHOOTING.md if solved bugs
✅ Add ADR to TECHNICAL.md if tech decision
✅ Update DATABASE.md if schema changed
✅ Add usage example if user-facing
```

---

**Remember**: Good documentation system = Automatic, consistent, trigger-based.
