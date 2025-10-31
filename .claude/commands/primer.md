---
description: Familiarize with project by reading docs, code structure, and recent changes
allowed-tools: Read, Grep, Glob, Bash(git status:*), Bash(git log:*), Bash(git diff:*)
---

# /primer - Project Familiarization

**Smart session orientation that familiarizes Claude with the project automatically.**

---

## 🎯 What It Does

When you type `/primer`, Claude automatically:

1. **Reads core documentation** (CLAUDE.md, TASKS.md) to understand project vision, standards, and current state
2. **Scans code structure** (src/ directories) to comprehend architecture organization
3. **Analyzes recent work** (git history + modified files) to grasp current context
4. **Verifies local state** (git status, package.json) for sanity checks
5. **Summarizes understanding** with current phase, recent work, and readiness confirmation

**Purpose:** Get Claude oriented and ready to work WITHOUT suggesting what to do next (you decide the task).

**Philosophy:** TASKS.md is the source of truth for roadmap, but `/primer` prepares Claude for ANY work (even outside TASKS.md scope).

---

## 📋 Usage

```bash
/primer              # Full project familiarization
```

That's it! Claude reads everything silently and confirms readiness.

---

## ⚡ Familiarization Workflow

When you run `/primer`, Claude follows this checklist:

### Step 1: Read Core Documentation

**CLAUDE.md** - Project overview
- Mission, vision, target users
- Current phase & progress
- Tech stack decisions
- Development standards & conventions
- Documentation map

**TASKS.md** - Roadmap & current state
- Header: Project status, phase, overall progress
- Kanban: Recent completions (DONE column)
- Current focus (phase description)

**Purpose:** Understand project principles (immuable) + current state (dynamic).

---

### Step 2: Understand Code Structure

**Scan project directories** with Glob:

```
src/app/**/*.tsx           # Expo Router screens
src/components/**/*.tsx    # UI components
src/services/**/*.ts       # Business logic & APIs
src/stores/**/*.ts         # State management (Zustand)
src/hooks/**/*.ts          # Custom React hooks
src/utils/**/*.ts          # Utilities & helpers
```

**Purpose:** Comprehend architecture organization without reading every file.

---

### Step 3: Analyze Recent Work

**Git history** (last 10 commits):
```bash
git log --oneline -10
```

**Recently modified files** (last 5 commits):
```bash
git log --name-only -5 --pretty=format:""
```

**Read recently modified files** to understand:
- What was worked on last session
- Current implementation patterns
- Active development areas

**Purpose:** Contextualize recent work to understand project momentum.

---

### Step 4: Verify Local State

**Git status** - Check for uncommitted changes:
```bash
git status
```

**Package.json** - Verify main dependencies:
- Read `package.json` → dependencies section
- Identify core stack (WatermelonDB, MMKV, Victory Native, etc.)

**Purpose:** Sanity checks for clean working state.

---

### Step 5: Summarize Understanding

Generate concise summary with **proper markdown spacing** (use double newlines `\n\n` between sections):

```
✅ Familiarisé avec Halterofit (Phase X.X, N/M tasks - X%)

**Dernier travail :**
  • Task ID - Description
  • Task ID - Description

**Stack actuel :**
Key dependencies with versions

**Structure projet :**
  • src/app/ - N screens (expo-router)
  • src/components/ - N components
  • src/services/ - Main services
  • src/stores/ - State stores

**État local :**
Clean / Uncommitted changes detected

---

Prêt pour vos instructions.
```

**IMPORTANT:** Use double newlines between each section to create readable paragraphs in markdown.

**Tone:** Contextual but concise (Option 2 style).

---

## 🎯 Halterofit Project Principles

These principles are **immuable** and should guide all work:

### Mission & Vision

**What:** Offline-first mobile fitness app with intelligent, context-aware analytics

**Target Users:**
- Serious bodybuilders and strength athletes
- Train 4-6 times per week consistently
- Data-driven approach to progressive overload

**Unique Value:** Context-aware analytics that explain WHY (not just raw numbers)

---

### Collaboration Model

**User Profile:**
- NOT a technical expert
- Validates decisions and choices
- Needs clear explanations

**Workflow:**
- **Always** present plan → validate → execute
- Work **one task at a time** (unless logically groupable)
- Be **communicative** - share suggestions and alternatives
- **Ask questions** when anything is unclear or ambiguous
- **Never improvise** solutions that could backfire later

**Role:** Act as a methodical, reliable collaborator who understands before acting.

---

### Development Standards

**Code Quality:**
- ✅ Bonnes pratiques over "hotfixes"
- ✅ Clean, reusable, scalable code
- ✅ Clear, maintainable structure
- ❌ No quick fixes that create tech debt

**Technical Requirements:**
- TypeScript strict mode (no `any` types)
- 100% offline-first capability
- All features work without internet

**Source of Truth:**
- **TASKS.md** - Project roadmap and next steps
- Always check TASKS.md for current phase and priorities
- User may work outside TASKS.md scope (that's OK)

---

### Documentation Map

Know which document to reference for what:

| Document | When to Use | Purpose |
|----------|-------------|---------|
| **CLAUDE.md** ⭐ | Project overview, daily workflow | Complete guide, conventions, standards |
| **TASKS.md** 📋 | Planning next tasks | Roadmap (96 tasks across 6 phases) |
| **TECHNICAL.md** 🎓 | Understanding tech decisions | Architecture Decision Records (ADRs) |
| **CONTRIBUTING.md** 🛠️ | Setup & development | Commands, workflow, git conventions |
| **DATABASE.md** 💾 | Working with database | WatermelonDB setup, schema, operations |
| **ARCHITECTURE.md** 🏗️ | Understanding code structure | Folder organization, patterns, imports |
| **TROUBLESHOOTING.md** 🆘 | When something breaks | Common issues & solutions |
| **PRD.md** 📄 | Understanding product vision | Requirements, user stories, metrics |

**Quick Rule:** When in doubt, check CLAUDE.md § Documentation Map.

---

## 🤖 Implementation Instructions for Claude

When user runs `/primer`, execute this workflow **silently** (no verbose logging):

**⚡ Performance Note:** This workflow is optimized to minimize token usage:
- **TASKS.md:** Read header only (~120 lines) using dynamic grep detection
- **Recent files:** Names only, no content reading
- **Code scan:** Single glob pattern instead of 5 separate calls
- **Impact:** ~30k tokens saved (70k total vs 102k before optimization)

### Phase 1: Documentation Deep Dive

```typescript
// Read core project documentation
read('c:/DevTools/Projects/Halterofit/.claude/CLAUDE.md')

// Read TASKS.md header only (dynamically detect where phase details start)
// Step 1: Find line number where first "## Phase" section begins
bash('grep -n "^## Phase" c:/DevTools/Projects/Halterofit/docs/TASKS.md | head -1 | cut -d: -f1')
// → Returns line number (e.g., 127)

// Step 2: Read until that line - 1 to get: Header + Kanban + Roadmap + Timeline
// Without loading 1000+ lines of detailed phase descriptions
read('c:/DevTools/Projects/Halterofit/docs/TASKS.md', { limit: <detected_line - 1> })

// This approach is future-proof:
// - Works even if header grows from 120 to 200 lines
// - Works when Phase 0.5 completes and Phase 1 becomes current
// - No manual adjustment needed

// Extract key info:
- Current phase (from TASKS.md header "Progress: N/M tasks (X%)")
- Overall progress (18/96 tasks)
- Recent completions (from TASKS.md § Recent Completions ✅)
- Current focus (from TASKS.md § Executive Summary)
```

### Phase 2: Code Structure Scan

```typescript
// Scan project structure (don't read every file, just list)
// Use single glob pattern for efficiency (~1k tokens saved vs 5 separate globs)
glob('src/**/*.{ts,tsx}')
// Lists all TS/TSX files, mentally group by directory when summarizing:
// - src/app/ → screens
// - src/components/ → UI components
// - src/services/ → business logic
// - src/stores/ → state management
// - src/hooks/ → custom hooks

// Build mental map of architecture
```

### Phase 3: Recent Context Analysis

```typescript
// Analyze recent git activity
bash('git log --oneline -10')
bash('git log --name-only -5 --pretty=format:""')

// Identify recently modified files (names only, no content read)
// Seeing file names is sufficient for context orientation
// This saves ~2-3k tokens per session

// Correlate with TASKS.md Recent Completions
```

### Phase 4: Local State Verification

```typescript
// Check git status
bash('git status')
// → Detect uncommitted changes (warn if present)

// Read package.json for stack verification
read('c:/DevTools/Projects/Halterofit/package.json')
// → Extract key dependencies (WatermelonDB, MMKV, Victory Native, etc.)
```

### Phase 5: Generate Summary

```typescript
// Output format (concise but contextual)
// IMPORTANT: Use double newlines between sections for proper markdown spacing

✅ Familiarisé avec Halterofit (Phase {phase}, {completed}/{total} tasks - {percentage}%)

**Dernier travail :**
  • {task_id} - {task_description}
  • {task_id} - {task_description}

**Stack actuel :**
{key_dependencies_with_versions}

**Structure projet :**
  • src/app/ - {screen_count} screens (expo-router)
  • src/components/ - {component_count} components
  • src/services/ - {services_identified}
  • src/stores/ - {stores_identified}

**État local :**
{git_status_summary}

---

Prêt pour vos instructions.
```

---

## 🚨 Important Notes

### What `/primer` Does NOT Do

❌ **Does NOT suggest next task** - User decides what to work on
❌ **Does NOT update TASKS.md** - Read-only command
❌ **Does NOT commit changes** - Pure familiarization
❌ **Does NOT run builds/tests** - Just reads and understands

### What Makes It Zero-Maintenance

✅ **No hardcoded data** - Everything read dynamically
✅ **Adapts to project evolution** - Works at any phase
✅ **References docs** - Doesn't duplicate info
✅ **Immuable principles** - Core values don't change
✅ **Smart header reading** - Dynamically detects where phase details begin
✅ **Scales with project** - Works whether header is 80 or 200 lines
✅ **Token-efficient** - Reads ~120 lines instead of 1300+ lines (~30k tokens saved)

### When to Use `/primer`

**Ideal scenarios:**
- 🌅 Starting a new session
- 🔄 Returning after days/weeks away
- 🤔 Feeling lost or uncertain
- 🎯 Before tackling complex task
- 🔀 Switching context from other projects

**Not needed if:**
- Already working in same session
- Just completed a task and continuing
- Context is fresh (< 1 hour)

---

## 💡 Pro Tips

### Combine with Other Commands

```bash
/primer              # Familiarize first
# ... user gives task ...
/task-update next    # If working from TASKS.md
/commit              # When task complete
```

### Trust the Process

The `/primer` workflow is designed to give Claude complete context efficiently. Trust that the silent background reading is comprehensive.

### Use Anytime

There's no cost to running `/primer` multiple times. If you feel Claude lost context or you're starting fresh, just run it again.

---

## 📚 Reference

**Format Spec:** `.claude/lib/tasks-format-spec.md` - TASKS.md structure
**Project Docs:** See CLAUDE.md § Documentation Map

---

**Version**: 1.0
**Last Updated**: 2025-01-31
**Philosophy**: Comprehensive orientation, zero maintenance, user-directed work

**Key Insight:** Familiarization enables effective collaboration. A well-oriented Claude is a productive Claude.
