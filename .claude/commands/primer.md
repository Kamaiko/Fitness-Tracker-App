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

1. Reads TASKS.md header (Kanban + current phase)
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

**Read ONLY header (Kanban + Roadmap):**

```typescript
// If grep returns line 83, read lines 1-82
read('c:/DevTools/Projects/Halterofit/docs/TASKS.md', { limit: <line_number - 1> })
```

**Extract:**

- Current phase & status (e.g., "Phase 1 - Authentication")
- Next task from Kanban TODO column (first row)
- Recent completions from DONE column

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

**Extract:** Hash, message, time ago (e.g., "5cb24ae - refactor(config) (il y a 1h)")

---

### Step 3: Generate Compact Dashboard

**Format (5-7 lines, highly actionable):**

```
✅ Familiarisé avec Halterofit

📍 Phase 1: Authentication & Foundation 🔄
⏱️ Dernier commit: 5cb24ae - refactor(config) (il y a 1h)

⏭️ NEXT: **1.10** Login screen `[M]`

⚠️ ALERTS: 2 fichiers modifiés (TASKS.md, CHANGELOG.md)

💡 DOCS CLÉS À LIRE:
   • CLAUDE.md (briefing complet)
   • TASKS.md (roadmap + kanban)
   • DATABASE.md (WatermelonDB schema + CRUD)
   • TESTING.md (stratégie 3-tier)
   • ARCHITECTURE.md (structure code + patterns)
   • TECHNICAL.md (ADRs + stack decisions)

Prêt pour vos instructions.
```

---

## 📊 Dashboard Components

### Line 1: Phase Status

- Format: `📍 Phase N: Title 🔄`
- Source: TASKS.md Header "Status:" line
- Example: `📍 Phase 1: Authentication & Foundation 🔄`

### Line 2: Last Commit

- Format: `⏱️ Dernier commit: hash - message (il y a Xh)`
- Source: `git log -1 --format="%h - %s (%ar)"`
- Example: `⏱️ Dernier commit: 5cb24ae - refactor(config) (il y a 1h)`

### Line 3: Next Task

- Format: `⏭️ NEXT: **task_id** description \`[size]\``
- Source: TASKS.md Kanban TODO column (first task)
- Example: `⏭️ NEXT: **1.10** Login screen \`[M]\``
- **DO NOT** look up task details in phase sections (too slow)

### Line 4: Alerts (conditional)

- Format: `⚠️ ALERTS: X fichiers modifiés (list)`
- Source: `git status`
- **Only show if uncommitted changes exist**
- Example: `⚠️ ALERTS: 2 fichiers modifiés (TASKS.md, CHANGELOG.md)`

### Line 5: Contextual Docs

- Format: `💡 DOCS CLÉS À LIRE:` followed by bullet list
- **Always suggest core docs:**
  - CLAUDE.md (project briefing)
  - TASKS.md (current roadmap)
  - DATABASE.md (WatermelonDB operations)
  - TESTING.md (test strategy)
  - ARCHITECTURE.md (code structure)
  - TECHNICAL.md (tech stack decisions)

- **Add phase-specific suggestions:**
  - Phase 1 (Auth): Emphasize DATABASE.md, TESTING.md
  - Phase 2-3 (Workouts): Emphasize DATABASE.md, ARCHITECTURE.md
  - Phase 4 (Profile): Emphasize ARCHITECTURE.md
  - Phase 5 (Polish): Emphasize TESTING.md

---

## 🧠 Contextual Documentation Suggestions

**Phase-based suggestions:**

| Phase   | Theme               | Emphasized Docs               | Reason                    |
| ------- | ------------------- | ----------------------------- | ------------------------- |
| **1**   | Authentication      | DATABASE.md, TESTING.md       | Supabase auth, test infra |
| **2-3** | Workouts & Tracking | DATABASE.md, ARCHITECTURE.md  | Complex CRUD, state mgmt  |
| **4**   | Profile & Settings  | ARCHITECTURE.md, TECHNICAL.md | Navigation, preferences   |
| **5**   | Polish & Deployment | TESTING.md                    | E2E tests, debugging      |

**Task-specific triggers (if time permits):**

- Task mentions "schema" or "migration" → Emphasize DATABASE.md
- Task mentions "test" or "Jest" → Emphasize TESTING.md
- Task mentions "component" or "UI" → Emphasize ARCHITECTURE.md

**Always suggest core 6 docs:**

1. CLAUDE.md (project briefing)
2. TASKS.md (roadmap + kanban)
3. DATABASE.md (WatermelonDB)
4. TESTING.md (test strategy)
5. ARCHITECTURE.md (code structure)
6. TECHNICAL.md (tech stack + ADRs)

**Example suggestion:**

```
💡 DOCS CLÉS À LIRE:
   • CLAUDE.md (briefing complet)
   • TASKS.md (roadmap + kanban)
   • DATABASE.md (WatermelonDB schema + CRUD) ← Emphasized for Phase 1
   • TESTING.md (stratégie 3-tier) ← Emphasized for Phase 1
   • ARCHITECTURE.md (structure code + patterns)
   • TECHNICAL.md (ADRs + stack decisions)
```

---

## ⚙️ Implementation Notes

**For Claude:**

- Execute git commands in parallel (status + log)
- Parse TASKS.md Kanban efficiently (no deep phase lookups)
- Dashboard must be compact (5-7 lines max)
- Only show ALERTS if issues exist
- Always suggest core 6 docs
- Contextual suggestions based on phase (simple rules, no complex logic)
- **DO NOT read suggested docs automatically** - just suggest them

**Performance:**

- Target execution time: <10 seconds
- Token budget: ~10,000 tokens (10% of context)
- Only 2 git commands (status, log -1)
- No file counting, no package.json read
- Read TASKS.md header only (lines 1-82 typically)

**Zero Maintenance:**

- Phase detection: automatic from TASKS.md
- Next task: automatic from Kanban
- Suggestions: rule-based (phase only, always suggest core 6)
- Works throughout entire project lifecycle
- No counter dependencies (eliminated in v5.0)
