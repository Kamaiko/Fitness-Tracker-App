---
description: Fast project familiarization (docs + contextual suggestions)
allowed-tools: Read, Bash(git status:*), Bash(git log:*)
---

# /primer - Fast Project Familiarization

**MISSION**: Execute ultra-fast session orientation (<10 seconds, <10k tokens) that familiarizes Claude with current project state and generates actionable dashboard with contextual documentation suggestions.

---

## EXECUTION ALGORITHM

### STEP 1: Data Collection (Parallel Execution)

**Execute these 3 tool calls IN ONE MESSAGE:**

#### Tool 1: Read TASKS.md Header

```
Read('docs/TASKS.md', { limit: 100 })
```

**Extract:**

- `PHASE_STATUS`: Line matching `**Status**: 🔄 Phase N - Title`
- `TODO_TASKS`: Lines in `| TODO` column of Kanban table (first task = next task)
- `DONE_TASKS`: Lines in `| DONE` column of Kanban table (last 5 tasks)

**Parsing Rules:**

- Phase number: Extract `N` from `Phase N -`
- Phase title: Extract `Title` from `Phase N - Title`
- Next task: First row in TODO column → Format: `**task_id** description \`[size]\``
- Stop reading at first `## Phase` heading (phase details not needed)

#### Tool 2: Git Status

```bash
git status
```

**Extract:**

- `MODIFIED_COUNT`: Count of files in "Changes not staged for commit"
- `MODIFIED_FILES`: List of modified file paths (first 3 files maximum)
- `BRANCH_NAME`: Current branch name

#### Tool 3: Git Log

```bash
git log -1 --format="%h - %s (%ar)"
```

**Extract:**

- `COMMIT_HASH`: First 7 characters (e.g., `5cb24ae`)
- `COMMIT_MSG`: Commit message (e.g., `refactor(config)`)
- `TIME_AGO`: Relative time (e.g., `il y a 1h`)

---

### STEP 2: Data Processing

Parse extracted data into variables:

| Variable           | Source                       | Example                                | Fallback             |
| ------------------ | ---------------------------- | -------------------------------------- | -------------------- |
| `{PHASE_NUM}`      | PHASE_STATUS                 | `1`                                    | `0`                  |
| `{PHASE_TITLE}`    | PHASE_STATUS                 | `Phase 1: Authentication & Foundation` | `Phase non détectée` |
| `{NEXT_TASK_ID}`   | TODO_TASKS (first task)      | `1.10`                                 | `—`                  |
| `{NEXT_TASK_DESC}` | TODO_TASKS (first task)      | `Login screen`                         | `Voir TASKS.md`      |
| `{NEXT_TASK_SIZE}` | TODO_TASKS (first task)      | `M`                                    | `—`                  |
| `{MODIFIED_COUNT}` | MODIFIED_COUNT               | `2`                                    | `0`                  |
| `{MODIFIED_FILES}` | MODIFIED_FILES (first 3 max) | `TASKS.md, CHANGELOG.md`               | `—`                  |
| `{COMMIT_INFO}`    | Full git log output          | `5cb24ae - refactor(config) (1h ago)`  | `Aucun commit`       |

**Emphasis Flags** (computed from `{PHASE_NUM}` via DECISION RULES):

- `{DB_EMPHASIS}`: String with emphasis marker or empty `""`
- `{TEST_EMPHASIS}`: String with emphasis marker or empty `""`
- `{ARCH_EMPHASIS}`: String with emphasis marker or empty `""`

_See DECISION RULES > Rule 2 for phase-based logic._

---

### STEP 3: Generate Output

Apply **OUTPUT TEMPLATE** with processed variables.
Apply **DECISION RULES** for conditional sections.
Output dashboard (5-7 lines).

---

## OUTPUT TEMPLATE

**Generate exactly this format:**

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

**Example Output:**

```
✅ Familiarisé avec Halterofit

📍 Phase 1: Authentication & Foundation 🔄
⏱️ Dernier commit: 954c1b1 - docs!: Restructure task management (2h ago)

⏭️ NEXT: **1.10** Login screen `[M]`

⚠️ ALERTS: 2 fichiers modifiés (TASKS.md, CHANGELOG.md)

💡 DOCS CLÉS À LIRE:
   • CLAUDE.md (briefing complet)
   • TASKS.md (roadmap + kanban)
   • DATABASE.md (WatermelonDB schema + CRUD) ← Emphasized for Phase 1
   • TESTING.md (stratégie 3-tier) ← Emphasized for Phase 1
   • ARCHITECTURE.md (structure code + patterns)
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
  {ALERTS_SECTION} = ""  (skip this line entirely)
```

### Rule 2: Phase-Based Emphasis

```
IF {PHASE_NUM} == 1:
  {DB_EMPHASIS}   = " ← Emphasized for Phase 1"
  {TEST_EMPHASIS} = " ← Emphasized for Phase 1"
  {ARCH_EMPHASIS} = ""

ELSE IF {PHASE_NUM} IN [2, 3]:
  {DB_EMPHASIS}   = " ← Emphasized for Phase 2-3"
  {TEST_EMPHASIS} = ""
  {ARCH_EMPHASIS} = " ← Emphasized for Phase 2-3"

ELSE IF {PHASE_NUM} == 4:
  {DB_EMPHASIS}   = ""
  {TEST_EMPHASIS} = ""
  {ARCH_EMPHASIS} = " ← Emphasized for Phase 4"

ELSE IF {PHASE_NUM} == 5:
  {DB_EMPHASIS}   = ""
  {TEST_EMPHASIS} = " ← Emphasized for Phase 5"
  {ARCH_EMPHASIS} = ""

ELSE:
  {DB_EMPHASIS}   = ""
  {TEST_EMPHASIS} = ""
  {ARCH_EMPHASIS} = ""
```

### Rule 3: Fallback Values

```
IF {NEXT_TASK_ID} is empty:
  Use: "⏭️ NEXT: Aucune tâche TODO (voir TASKS.md)"

IF {COMMIT_INFO} is empty OR git log fails:
  Use: "⏱️ Dernier commit: Aucun commit"

IF {PHASE_TITLE} is empty OR parsing fails:
  Use: "📍 Phase non détectée (voir TASKS.md)"
```

### Rule 4: Modified Files List

```
IF {MODIFIED_COUNT} > 3:
  Show first 3 files + "..."
  Example: "TASKS.md, CHANGELOG.md, primer.md, ..."

ELSE:
  Show all files comma-separated
  Example: "TASKS.md, CHANGELOG.md"
```

---

## CONSTRAINTS

### Performance Limits

- **Execution time**: <10 seconds total
- **Token budget**: <10,000 tokens (~5% of context window)
- **Tool calls**: Exactly 3 tools, executed in parallel in ONE message
- **File reads**: TASKS.md header only (lines 1-100, stop at first `## Phase`)

### Scope Boundaries

**DO:**

- Read TASKS.md header (Kanban + Roadmap table + Status line)
- Execute 2 git commands (status, log -1)
- Parse extracted data into variables
- Apply decision rules for conditional output
- Generate compact dashboard (5-7 lines)

**DO NOT:**

- Read TASKS.md phase details (## Phase 1, ## Phase 2 sections)
- Read any suggested documentation files (just suggest them)
- Count files in directories
- Read package.json or config files
- Execute complex git commands (diff, log --all, blame, etc.)
- Perform deep codebase analysis
- Calculate task counters or progress percentages

### Output Limits

- **Total lines**: 5-7 lines maximum (excluding blank lines)
- **Alerts**: Show only if `{MODIFIED_COUNT} > 0`
- **Modified files list**: First 3 files maximum, add `...` if more
- **Documentation suggestions**: Always exactly 6 files (core docs)
- **Emphasis markers**: Maximum 2 emphasized docs per phase

---

## IMPLEMENTATION NOTES

**For Claude AI Agent:**

1. **Parallel Execution**: Send ONE message with 3 tool uses (Read, Bash git status, Bash git log)
2. **Error Handling**: Use fallback values from Rule 3 if any tool fails
3. **Parsing Efficiency**: Stop reading TASKS.md at first `## Phase` line (header only)
4. **Variable Substitution**: Replace all `{VARIABLE}` placeholders in OUTPUT TEMPLATE
5. **Conditional Sections**: Apply DECISION RULES for `{ALERTS_SECTION}` and emphasis markers
6. **No Auto-Reading**: DO NOT read suggested docs automatically - just suggest them
7. **Zero Maintenance**: Works throughout project lifecycle (no hardcoded phase numbers in code)

**Zero Maintenance Guarantee:**

- Phase detection: Automatic from TASKS.md Status line
- Next task: Automatic from Kanban TODO column
- Emphasis: Rule-based (phase number only)
- No counter dependencies (Zero Counters v5.0 philosophy)
- No file paths maintenance (uses relative paths)
