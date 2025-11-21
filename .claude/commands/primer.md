---
description: Fast project familiarization (docs + contextual suggestions)
allowed-tools: Read, Bash(git status:*), Bash(git log:*)
---

# /primer - Fast Project Familiarization

**MISSION**: Ultra-fast session orientation (<10s, <10k tokens) - familiarize with project state, generate actionable dashboard with contextual doc suggestions.

---

## EXECUTION ALGORITHM

### STEP 1: Parallel Data Collection

**Execute these 3 tools IN ONE MESSAGE:**

```typescript
Read('docs/TASKS.md', { limit: 100 });
Bash('git status');
Bash('git log -1 --format="%h - %s (%ar)"');
```

**Extract from TASKS.md:**

- `PHASE_STATUS`: Line `**Status**: 🔄 Phase N - Title`
- `NEXT_TASK`: First row in `| TODO` column → `**id** description \`[size]\``

**Extract from git status:**

- `MODIFIED_COUNT`: Count of changed files
- `MODIFIED_FILES`: File paths (first 3 max)

**Extract from git log:**

- `COMMIT_INFO`: Full output (hash, message, time)

---

### STEP 2: Parse Variables

Extract these values with fallbacks:

- `{PHASE_NUM}` from "Phase N -" (fallback: `0`)
- `{PHASE_TITLE}` full status line (fallback: `"Phase non détectée"`)
- `{NEXT_TASK_ID}` from TODO (fallback: `"—"`)
- `{NEXT_TASK_DESC}` from TODO (fallback: `"Voir TASKS.md"`)
- `{NEXT_TASK_SIZE}` from TODO (fallback: `"—"`)
- `{MODIFIED_COUNT}` from status (fallback: `0`)
- `{MODIFIED_FILES}` from status, max 3 files
- `{COMMIT_INFO}` from log (fallback: `"Aucun commit"`)

Compute emphasis markers from `{PHASE_NUM}` (see Rule 2).

---

### STEP 3: Generate Dashboard

1. Replace `{VARIABLES}` in OUTPUT TEMPLATE
2. Apply DECISION RULES for conditional sections
3. Output 5-7 line dashboard

---

## OUTPUT TEMPLATE

```
✅ Familiarisé avec Halterofit

📍 {PHASE_TITLE} 🔄
⏱️ Dernier commit: {COMMIT_INFO}

⏭️ NEXT: **{NEXT_TASK_ID}** {NEXT_TASK_DESC} `[{NEXT_TASK_SIZE}]`

{ALERTS_SECTION}

💡 DOCS CLÉS À LIRE:
   • CLAUDE.md (briefing complet)
   • TASKS.md (roadmap + kanban)
   • DATABASE.md (WatermelonDB schema + CRUD){DB_EMPHASIS}
   • TESTING.md (stratégie 3-tier){TEST_EMPHASIS}
   • ARCHITECTURE.md (structure code + patterns){ARCH_EMPHASIS}
   • TECHNICAL.md (ADRs + stack decisions)

Prêt pour vos instructions.
```

---

## DECISION RULES

### Rule 1: Alerts Section

```
IF {MODIFIED_COUNT} > 0:
  {ALERTS_SECTION} = "⚠️ ALERTS: {MODIFIED_COUNT} fichiers modifiés ({MODIFIED_FILES})\n"
ELSE:
  {ALERTS_SECTION} = "" (skip line)
```

If >3 files, show first 3 + `"..."`

---

### Rule 2: Phase-Based Emphasis

| Phase      | DB_EMPHASIS    | TEST_EMPHASIS | ARCH_EMPHASIS  |
| ---------- | -------------- | ------------- | -------------- |
| **1**      | ` ← Phase 1`   | ` ← Phase 1`  | —              |
| **2 or 3** | ` ← Phase 2-3` | —             | ` ← Phase 2-3` |
| **4**      | —              | —             | ` ← Phase 4`   |
| **5**      | —              | ` ← Phase 5`  | —              |
| **Else**   | —              | —             | —              |

_Emphasis text format: `" ← Emphasized for Phase N"`_

---

### Rule 3: Fallback Values

```
IF {NEXT_TASK_ID} is empty:  → "⏭️ NEXT: Aucune tâche TODO (voir TASKS.md)"
IF {COMMIT_INFO} is empty:   → "⏱️ Dernier commit: Aucun commit"
IF {PHASE_TITLE} is empty:   → "📍 Phase non détectée (voir TASKS.md)"
```

---

## CONSTRAINTS

**Performance:**

- <10 seconds execution
- <10,000 tokens
- Exactly 3 parallel tools in ONE message
- Read TASKS.md header only (100 lines max)

**Scope - DO:**

- Read TASKS.md header (Kanban + Status)
- Execute `git status` + `git log -1`
- Parse into variables, apply rules

**Scope - DO NOT:**

- Read TASKS.md phase details (`## Phase` sections)
- Read suggested docs (just suggest)
- Count files, read package.json
- Complex git commands
- Deep analysis, calculate counters

**Output:**

- 5-7 lines max
- Always 6 docs suggested
- Max 2 emphasis markers per phase

---

## IMPLEMENTATION NOTES

1. **Parallel**: ONE message with 3 tool calls
2. **Errors**: Use Rule 3 fallbacks if tools fail
3. **Parsing**: Stop reading TASKS.md at first `## Phase`
4. **Variables**: Replace all `{VARIABLE}` in template
5. **Conditionals**: Apply Rules 1-3
6. **No Auto-Read**: Suggest docs, don't read them
7. **Zero Maintenance**: Auto-detects phase/tasks from TASKS.md
