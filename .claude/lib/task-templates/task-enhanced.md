# Enhanced Task Template

Use this template for critical/complex tasks (any size, High/Critical priority).

---

## Template

```markdown
- [ ] **TASK_ID** Task Title
  **Size**: SIZE (TIME) • **Priority**: PRIORITY • **Epic**: EPIC_NAME
  **Dependencies**: TASK_IDS • **Blocked**: NO • **Assignee**: TBD

  **Description**:
  Clear description of what this task accomplishes and why it's important.

  **Acceptance Criteria**:
  - [ ] Specific, measurable criterion 1
  - [ ] Specific, measurable criterion 2
  - [ ] Specific, measurable criterion 3

  **Files**:
  - `path/to/primary/file.ts`
  - `path/to/secondary/file.tsx`

  **Refs**: DOCUMENT.md § Section Name
  **Tags**: #tag1 #tag2 #tag3
```

---

## Example

```markdown
- [ ] **0.5.9** [CRITICAL] User ID Persistence
  **Size**: M (4h) • **Priority**: 🔴 Critical • **Epic**: Phase 0.5.D Critical Corrections
  **Dependencies**: None • **Blocked**: No • **Assignee**: TBD

  **Description**:
  Implement persistent user ID storage to prevent data loss on app restart.
  Currently, user ID is lost when app closes, causing all workout data to
  become orphaned.

  **Acceptance Criteria**:
  - [ ] User ID stored in AsyncStorage after successful login
  - [ ] User ID automatically retrieved on app startup
  - [ ] All database queries use persisted user ID
  - [ ] Tests verify persistence across app restarts (close + reopen)
  - [ ] Error handling for missing/corrupt user ID

  **Files**:
  - `src/services/auth/authStorage.ts`
  - `src/stores/authStore.ts`
  - `src/services/database/db.ts`
  - `src/services/database/__tests__/persistence.test.ts`

  **Refs**: AUDIT_FIXES.md § Correction #1, DATABASE.md § User Context
  **Tags**: #backend #auth #critical #data-integrity #mvp-blocker
```

---

## Fields

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| **TASK_ID** | Unique identifier | `0.5.9` or `1.3.A.2` |
| **Task Title** | Clear, action-oriented title | "User ID Persistence" |
| **Size** | Effort estimate | `M (4h)` |
| **Priority** | Priority with emoji | `🔴 Critical` |
| **Dependencies** | Task IDs or "None" | `0.5.1, 0.5.2` or `None` |
| **Blocked** | Yes/No | `No` or `Yes (reason)` |

### Recommended Fields

| Field | Description | Example |
|-------|-------------|---------|
| **Epic** | Feature grouping | `Phase 0.5.D Critical Corrections` |
| **Assignee** | Who's responsible | `TBD` or `@username` |
| **Description** | Context and why | "Fixes data loss bug..." |
| **Acceptance Criteria** | Definition of done | Checkbox list |
| **Files** | Affected file paths | `src/services/auth/*.ts` |
| **Refs** | Documentation links | `AUDIT_FIXES.md § #1` |
| **Tags** | Categorization | `#backend #critical` |

---

## Acceptance Criteria Guidelines

### ✅ Good Criteria

```markdown
**Specific and Measurable**:
- [ ] User ID stored in AsyncStorage with key 'userId'
- [ ] Retrieve function getUserId() returns string | null
- [ ] Tests cover: first login, app restart, corrupted data

**Action-Oriented**:
- [ ] Create authStorage.ts service file
- [ ] Implement setUserId() and getUserId() functions
- [ ] Add error handling for AsyncStorage failures

**Testable**:
- [ ] Unit tests achieve 90%+ code coverage
- [ ] Integration test verifies persistence across app restart
- [ ] Manual QA checklist: close app → reopen → verify user still logged in
```

### ❌ Bad Criteria

```markdown
**Too Vague**:
- [ ] Fix the user ID thing
- [ ] Make it work properly
- [ ] Test everything

**Not Measurable**:
- [ ] Code should be clean
- [ ] Performance should be good
- [ ] User experience improved

**Not Actionable**:
- [ ] Think about edge cases
- [ ] Consider future scalability
- [ ] Review with team
```

---

## When to Use

Use this template when:
- ✅ Task is Critical (P0) or High (P1) priority
- ✅ Task has multiple dependencies or blocks other tasks
- ✅ Task affects critical path or MVP launch
- ✅ Task requires detailed specifications
- ✅ Task needs objective "done" criteria
- ✅ Task complexity is Medium, Large, or XL
- ✅ Task affects data integrity or security
- ✅ Multiple files/components affected

---

## When NOT to Use

Use **task-simple.md** template instead if:
- Task is straightforward (obvious implementation)
- Task is low priority (P2/P3)
- Task is very small ([S] - 1-2h)
- Task has clear, single file change
- No ambiguity about "done"

---

## Tips

### Writing Good Descriptions

```markdown
✅ GOOD:
"Implement persistent user ID storage to prevent data loss on app restart.
Currently, user ID is lost when app closes, causing workout data to become
orphaned. This is a critical MVP blocker affecting all users."

❌ BAD:
"Fix user ID bug."
```

### Choosing Priority

```markdown
🔴 Critical (P0):
- Blocks MVP launch
- Data loss / security issue
- App crashes / unusable
- Affects all users

🟠 High (P1):
- Important for MVP
- Affects core features
- Should have before launch

🟡 Medium (P2):
- Nice to have
- Can defer post-MVP
- Quality of life improvement

🟢 Low (P3):
- Future enhancement
- Backlog item
- Low user impact
```

### Identifying Dependencies

```markdown
**Hard Dependency** (must complete first):
Dependencies: 0.5.1, 0.5.2

**Soft Dependency** (recommended to complete first):
Dependencies: 0.5.3 (recommended)

**No Dependencies**:
Dependencies: None
```

---

## Validation Checklist

Before adding task to TASKS.md:

- [ ] Task ID is unique (not already used)
- [ ] Task ID follows pattern (X.Y or X.Y.Z)
- [ ] Title is clear and action-oriented
- [ ] Size and time estimate are realistic
- [ ] Priority matches impact/urgency
- [ ] All dependencies are valid task IDs
- [ ] Acceptance criteria are specific and measurable
- [ ] File paths are accurate (files exist or will be created)
- [ ] References point to correct documentation sections
- [ ] Tags are relevant and consistent with project conventions

---

**Version**: 1.0
**Last Updated**: 2025-10-29
