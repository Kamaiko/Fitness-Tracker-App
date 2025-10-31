---
description: Familiarize with project by reading docs, code structure, and recent changes
allowed-tools: Read, Grep, Glob, Bash(git status:*), Bash(git log:*), Bash(git diff:*)
---

# /primer - Project Familiarization

Smart session orientation that familiarizes Claude with the project automatically.

## Usage

```bash
/primer              # Full project familiarization
```

## 🎯 What It Does

1. Reads core documentation (CLAUDE.md, TASKS.md header)
2. Scans code structure (src/ directories)
3. Analyzes recent work (git history)
4. Verifies local state (git status, package.json)
5. **Generates dashboard summary** with metrics, next task, and readiness

---

## ⚡ Execution Workflow

### Step 1: Read Core Documentation

**CLAUDE.md:**
```typescript
read('c:/DevTools/Projects/Halterofit/.claude/CLAUDE.md')
```

Extract:
- Mission, vision, target users
- Current phase & progress
- Tech stack
- Development standards
- Documentation map

**TASKS.md Header Only:**
```bash
# Find where phase details start (dynamic detection)
bash('grep -n "^## Phase" c:/DevTools/Projects/Halterofit/docs/TASKS.md | head -1')
# Returns line number (e.g., "127:## Phase 0.5...")

# Read only header: Status + Kanban + Roadmap + Timeline
# Without loading 1000+ lines of phase details
read('c:/DevTools/Projects/Halterofit/docs/TASKS.md', { limit: <line_number - 1> })
```

Extract:
- Current phase & progress (from header "Progress: N/M tasks (X%)")
- Recent completions (from § Recent Completions ✅)
- Kanban board (TODO, DOING, DONE)
- Velocity & ETA

---

### Step 2: Scan Code Structure

```bash
glob('src/**/*.{ts,tsx}')
```

**Group mentally by directory:**
- `src/app/` → screens (expo-router)
- `src/components/` → UI components
- `src/services/` → business logic
- `src/stores/` → state management (Zustand)
- `src/hooks/` → custom React hooks

Build mental map of architecture **without reading every file**.

---

### Step 3: Analyze Recent Work

```bash
git log --oneline -10
git log --name-only -5 --pretty=format:""
```

**Identify:**
- Recently modified files (names only, no content read)
- Commit patterns
- Active development areas

Correlate with TASKS.md Recent Completions.

---

### Step 4: Verify Local State

```bash
git status                                      # Check uncommitted changes
read('c:/DevTools/Projects/Halterofit/package.json')  # Verify dependencies
```

---

### Step 5: Generate Dashboard Summary

**Format (compact, 1 ligne par section, NO double newlines needed):**

```
✅ Familiarisé avec Halterofit

📊 17/26 tasks (65%) • Phase 0.5 • ~4 tasks/semaine • ETA: 2.5 semaines

🔥 Momentum: Excellent (4 tasks dernière semaine vs 2.8 avg précédentes)
⏱️  Dernière activité: il y a 2h (74e509b - fix(claude): Improve /primer formatting)

⏭️  NEXT TASK:
    0.5.27 - Implement Supabase sync schema [L - 4-6h] 🟠 CRITICAL
    └─ Bloque 5 tasks Phase 1 • Aucune dépendance • Migration complete, infra ready

⚠️  ALERTS:
    • Modified: .claude/settings.local.json (uncommitted)

💡 QUICK ACTIONS:
    /task-update next → Start 0.5.27
    /commit → Commit local changes first

---

Prêt pour vos instructions.
```

**How to extract dashboard data:**

**Line 1: Status compact**
- Format: `📊 X/M tasks (X%) • Phase N • ~N tasks/semaine • ETA: N semaines`
- From TASKS.md header: "Phase 0.5: Architecture & Foundation (17/26)"
- From Kanban: "Velocity: ~4 tasks/week", "ETA: Phase 0.5 complete in ~2.5 weeks"

**Line 2: Momentum (dynamic calculation)**
- Count tasks completed last 7 days (from git log)
- Compare to average of previous 3 weeks
- If trending up: "🔥 Momentum: Excellent (4 tasks dernière semaine vs 2.8 avg précédentes)"
- If trending down: "⚠️ Momentum: Ralenti (2 tasks vs 4 avg précédentes)"
- If stable: "📊 Momentum: Stable (3-4 tasks/semaine)"

**Line 3: Dernière activité (freshness check)**
- Get last commit: `git log -1 --format="%h - %s"`
- Calculate time since: `git log -1 --format="%ar"`
- Format: `⏱️  Dernière activité: il y a 2h (74e509b - fix(claude): Improve /primer)`
- If > 24h: Add warning emoji: `⚠️ Dernière activité: il y a 3 jours (attention: stale)`

**Line 4-5: NEXT TASK (first from Kanban TODO)**
- From TASKS.md § Kanban → TODO column (first task)
- Parse: "**0.5.27** Supabase schema `[L]` 🟠"
- Look up task details in Phase sections for:
  - Dependencies (check "Blocked by:" or "Dependencies:")
  - Impact (how many tasks does this unblock?)
  - Context (why this task now? e.g., "Migration complete, infra ready")
- Format:
  ```
  task_id - description [size] priority
  └─ Impact • Dependencies • Context
  ```

**Line 6: ALERTS (conditional - only if issues exist)**
- Check git status for uncommitted changes
- Check for merge conflicts
- Check if branch is behind origin
- Check for TODO/FIXME in recently modified files
- Only show if alerts exist

**Line 7: QUICK ACTIONS (context-aware suggestions)**
- If uncommitted changes: `/commit → Commit local changes first`
- If clean working tree: `/task-update next → Start [next_task_id]`
- Always show: Quick actions based on current state

**Tone:** Dashboard-style, compact, actionable, visual.

---

## 🎯 Halterofit Project Principles

These principles are **immuable** and guide all work:

### Mission & Vision

**What:** Offline-first mobile fitness app with intelligent, context-aware analytics

**Target Users:**
- Serious bodybuilders and strength athletes
- Train 4-6 times per week consistently
- Data-driven approach to progressive overload

**Unique Value:** Context-aware analytics that explain WHY (not just raw numbers)

### Collaboration Model

**User Profile:**
- NOT a technical expert
- Validates decisions and choices
- Needs clear explanations

**Workflow:**
- Always: Plan → Validate → Execute
- Work one task at a time (unless logically groupable)
- Be communicative - share suggestions and alternatives
- Ask questions when anything is unclear
- Never improvise solutions that could backfire later

### Development Standards

**Code Quality:**
- ✅ Best practices over "hotfixes"
- ✅ Clean, reusable, scalable code
- ❌ No quick fixes that create tech debt

**Technical Requirements:**
- TypeScript strict mode (no `any` types)
- 100% offline-first capability
- All features work without internet

**Source of Truth:**
- TASKS.md = Project roadmap and next steps
- User may work outside TASKS.md scope (that's OK)

### Documentation Map

| Document | Purpose |
|----------|---------|
| **CLAUDE.md** ⭐ | Project overview, conventions, standards |
| **TASKS.md** 📋 | Roadmap (96 tasks across 6 phases) |
| **TECHNICAL.md** 🎓 | Architecture Decision Records (ADRs) |
| **CONTRIBUTING.md** 🛠️ | Commands, workflow, git conventions |
| **DATABASE.md** 💾 | WatermelonDB setup, schema, operations |
| **ARCHITECTURE.md** 🏗️ | Folder organization, patterns, imports |
| **TROUBLESHOOTING.md** 🆘 | Common issues & solutions |
| **PRD.md** 📄 | Requirements, user stories, metrics |
