---
description: Fast project familiarization (docs + contextual suggestions)
allowed-tools: Read, Bash(git status:*), Bash(git log:*)
---

# /primer - Fast Project Familiarization

Ultra-fast session orientation (<10 seconds) that familiarizes Claude with current project state and suggests relevant documentation.

## Usage

```bash
/primer              # Full project familiarization
```

## 🎯 What It Does

1. Reads TASKS.md header (Executive Summary + Kanban)
2. Checks git status + last commit
3. **Generates compact dashboard** with next task and contextual doc suggestions
4. **Zero maintenance required** - works throughout the project lifecycle

---

## ⚡ Execution Workflow

### Step 1: Read Project Status (TASKS.md Header Only)

**Find where phase details start:**
```bash
grep -n "^## Phase" c:/DevTools/Projects/Halterofit/docs/TASKS.md | head -1
```

**Read ONLY header (Executive Summary + Kanban):**
```typescript
// If grep returns line 152, read lines 1-151
read('c:/DevTools/Projects/Halterofit/docs/TASKS.md', { limit: <line_number - 1> })
```

**Extract:**
- Current phase & progress (e.g., "28/83 tasks (34%)")
- Phase-specific progress (e.g., "Phase 0.6: 7/8 (88%)")
- Next task from Kanban TODO column (first row)
- Recent completions (for context)

---

### Step 2: Git State (Fast Commands Only)

**Git status:**
```bash
git status
```
**Extract:** Uncommitted changes, branch state

**Last commit (single command):**
```bash
git log -1 --format="%h - %s (%ar)"
```
**Extract:** Hash, message, time ago (e.g., "24dc7e0 - fix(husky): Remove shebang (2 hours ago)")

---

### Step 3: Generate Compact Dashboard

**Format (5-6 lines, highly actionable):**

```
✅ Familiarisé avec Halterofit

📊 28/83 (34%) • Phase 0.6 • 7/8 (88%)
⏱️ Dernier commit: 24dc7e0 - fix(husky): Remove shebag (il y a 2h)

⏭️ NEXT: **0.6.8** ExerciseDB import `[L]` 🔥

⚠️ ALERTS: 2 fichiers modifiés (.claude/commands/primer.md, settings.local.json)

💡 CONTEXTE: Phase 0.6 (UI/UX) → Suggérer DATABASE.md pour ExerciseDB import

Prêt pour vos instructions.
```

---

## 📊 Dashboard Components

### Line 1: Progress Summary
- Format: `📊 X/M (X%) • Phase N • X/M (X%)`
- Source: TASKS.md Executive Summary "Progress: X/M tasks (X%)"
- Example: `📊 28/83 (34%) • Phase 0.6 • 7/8 (88%)`

### Line 2: Last Commit
- Format: `⏱️ Dernier commit: hash - message (il y a Xh)`
- Source: `git log -1 --format="%h - %s (%ar)"`
- Example: `⏱️ Dernier commit: 24dc7e0 - fix(husky): Remove shebang (il y a 2h)`

### Line 3: Next Task
- Format: `⏭️ NEXT: **task_id** description \`[size]\` priority`
- Source: TASKS.md Kanban TODO column (first task)
- Example: `⏭️ NEXT: **0.6.8** ExerciseDB import \`[L]\` 🔥`
- **DO NOT** look up task details in phase sections (too slow)

### Line 4: Alerts (conditional)
- Format: `⚠️ ALERTS: X fichiers modifiés (list)`
- Source: `git status`
- **Only show if issues exist** (uncommitted changes, merge conflicts, etc.)
- Example: `⚠️ ALERTS: 2 fichiers modifiés (.claude/commands/primer.md, settings.local.json)`

### Line 5: Contextual Suggestions
- Format: `💡 CONTEXTE: Phase N (Theme) → Suggérer DOC.md pour [reason]`
- **Smart suggestions based on context:**
  - Phase 0.6 (UI/UX) + Task 0.6.8 → Suggest DATABASE.md (ExerciseDB import)
  - Phase 1 (Auth) → Suggest DATABASE.md + TESTING.md
  - Phase 2-3 (Workouts) → Suggest DATABASE.md + ARCHITECTURE.md
  - Phase 4 (Profile) → Suggest ARCHITECTURE.md
  - Phase 5 (Polish) → Suggest TESTING.md + TROUBLESHOOTING.md
  - If uncommitted changes → Suggest `/commit` command
  - If clean tree + next task → Suggest `/task-update next`

---

## 🧠 Contextual Documentation Suggestions

**Phase-based suggestions (adapt based on current phase & next task):**

| Phase | Theme | Suggested Docs | Reason |
|-------|-------|----------------|--------|
| **0.5** | Architecture & Foundation | TECHNICAL.md, DATABASE.md | ADRs, schema setup |
| **0.6** | UI/UX Foundation | DATABASE.md, ARCHITECTURE.md | ExerciseDB, components |
| **1** | Authentication | DATABASE.md, TESTING.md | Supabase auth, test infra |
| **2-3** | Workouts & Tracking | DATABASE.md, ARCHITECTURE.md | Complex CRUD, state mgmt |
| **4** | Profile & Settings | ARCHITECTURE.md | Navigation, preferences |
| **5** | Polish & Deployment | TESTING.md, TROUBLESHOOTING.md | E2E tests, debugging |

**Task-specific triggers:**
- Task mentions "schema" or "migration" → DATABASE.md
- Task mentions "test" or "Jest" → TESTING.md
- Task mentions "component" or "UI" → ARCHITECTURE.md
- Task mentions "deploy" or "build" → TROUBLESHOOTING.md
- Task mentions "analytics" or "stats" → TECHNICAL.md (ADRs)

**Example suggestion format:**
```
💡 CONTEXTE: Phase 0.6 (UI/UX) → Lire DATABASE.md (§ ExerciseDB Import) pour task 0.6.8

Si besoin, docs disponibles :
- DATABASE.md (WatermelonDB setup, schema, CRUD, ExerciseDB)
- TESTING.md (Unit tests, manual E2E, Jest + LokiJS)
- ARCHITECTURE.md (Folder structure, patterns, imports)
- TECHNICAL.md (ADRs, tech stack decisions)
```

---

## ⚙️ Implementation Notes

**For Claude:**
- Execute git commands in parallel (status + log)
- Parse TASKS.md Kanban efficiently (no deep phase lookups)
- Dashboard must be compact (5-6 lines max)
- Only show ALERTS if issues exist
- Contextual suggestions must be smart but simple (no complex logic)
- **DO NOT read suggested docs automatically** - just suggest them

**Performance:**
- Target execution time: <10 seconds
- Token budget: ~15,000 tokens (15% of context)
- Only 2 git commands (status, log -1)
- No file counting, no momentum calc, no package.json read

**Zero Maintenance:**
- Phase detection: automatic from TASKS.md
- Next task: automatic from Kanban
- Suggestions: rule-based (phase + keywords)
- Works throughout entire project lifecycle
