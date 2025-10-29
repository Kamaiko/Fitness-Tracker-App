# Simple Task Template

Use this template for straightforward tasks (S/M size, Medium/Low priority).

---

## Template

```markdown
- [ ] **TASK_ID** Task Title `[SIZE - TIME]` PRIORITY
  - Brief bullet point description
  - What needs to be done
  - Files: `path/to/file.ts`
```

---

## Example

```markdown
- [ ] **0.5.6** Install simple-statistics for analytics `[S - 30min]` 🟡
  - npm install simple-statistics
  - Create analytics utilities folder structure
  - Document planned algorithms in TECHNICAL.md
  - Implementation happens in Phase 4
```

---

## Fields

| Field | Description | Example |
|-------|-------------|---------|
| **TASK_ID** | Unique identifier | `0.5.6` or `1.3` |
| **Task Title** | Clear, action-oriented title | "Install simple-statistics" |
| **SIZE** | Effort estimate | `[S]`, `[M]`, `[L]`, `[XL]` |
| **TIME** | Hours estimate | `30min`, `3-4h`, `1-2d` |
| **PRIORITY** | Priority level | 🔴 🟠 🟡 🟢 |

---

## When to Use

- Non-critical tasks (P2/P3)
- Clear scope, no ambiguity
- Few or no dependencies
- Implementation straightforward
- No need for detailed acceptance criteria

---

## When NOT to Use

Use **task-enhanced.md** template instead if:
- Task is Critical (P0) or High (P1) priority
- Task has complex dependencies
- Task blocks multiple other tasks
- Task needs detailed acceptance criteria
- Task affects critical path
