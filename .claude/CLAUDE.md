# Claude Instructions - Halterofit

> **Version**: 3.0
> **Last Updated**: Auto-updated via git hooks
> **Purpose**: Project briefing + automation reference

---

## 🎯 What You're Building

**Halterofit** is an offline-first mobile fitness tracking app with intelligent, context-aware analytics.

**Target Users:**
- Serious bodybuilders and strength athletes
- Train 4-6 times per week consistently
- Data-driven approach to progressive overload

**Unique Value Proposition:**
- **Context-aware analytics**: Accounts for nutrition phase (bulk/cut/maintenance), exercise order, rest periods, fatigue
- **Statistical plateau detection**: Mann-Kendall test with nutritional context
- **Load management**: Acute/chronic ratios, overtraining alerts
- **Personalized 1RM**: Adjusted by RIR (proximity to failure)
- **Actionable insights**: Not just numbers - explains WHY and WHAT TO DO

**Unlike competitors (Jefit/Strong/Hevy):** We explain context, not just show raw data.

---

## 🚧 Current Phase & Next Steps

**Phase:** 0.5 - Architecture & Foundation
**Progress:** 6/96 tasks (6%)
**Version:** 0.1.0

**Next Task:** 0.5.2 - Implement database schema in Supabase
**File to create:** `supabase/migrations/001_initial_schema.sql`

**Critical Context:**
- Current stack: Expo Go + expo-sqlite + AsyncStorage + react-native-chart-kit (100% working)
- Phase 0.5 Bis (Development Build migration) is DEFERRED until after Phase 0.5 critical corrections
- **Priority**: Complete Phase 0.5 critical corrections BEFORE considering migration

**Reference:** See [TASKS.md § NEXT SESSION](../docs/TASKS.md#-next-session) for detailed task breakdown

---

## 🛠️ Tech Stack

**Current:** Expo Go + expo-sqlite + AsyncStorage + react-native-chart-kit (100% working)

**Future (Phase 0.5 Bis):** Development Build + WatermelonDB + MMKV + Victory Native

**See [TECHNICAL.md](../docs/TECHNICAL.md)** for complete stack details and Architecture Decision Records (ADRs).

---

## ⚡ Commands & Workflow

**See [CONTRIBUTING.md](../docs/CONTRIBUTING.md)** for complete command reference, git workflow, and development guide.

**Quick Reference:**
- `npm start` - Start Expo dev server
- `npm run type-check` - TypeScript verification (run before commit)
- `npm test` - Run Jest tests

---

## 🤖 Automation System

### ⚠️ CRITICAL: PreCompact Workflow Protocol

When PreCompact hook fires (context ~18000 tokens), you MUST:

1. **STOP current work immediately**
2. **READ** the hook message instructions carefully
3. **EXECUTE** smart-detector.md algorithm EXACTLY
4. **REPORT** detected tasks to user
5. **WAIT** for user confirmation
6. **IF YES** → READ task-tracker.md IMMEDIATELY (do NOT skip)
7. **EXECUTE** 4-step atomic update WITHOUT DEVIATION
8. **VALIDATE** format before reporting complete

**DO NOT:**
- Skip reading task-tracker.md after YES
- Improvise update process
- Forget validation steps

**This protocol ensures 95%+ reliability.**

### 📢 Verbose Reporting (MANDATORY)

When PreCompact fires, report progress at each step:

1. **Trigger:** "🔍 PreCompact hook triggered (context ~18000 tokens)"
2. **Reading:** "Reading .actions.json... [X actions found]"
3. **Detection:** "Running smart-detector algorithm..."
4. **Results:** "Detection complete: [N matches OR 'No completed tasks detected']"
5. **Details:** Show each match with confidence score
6. **Confirmation:** "Update TASKS.md? [YES/NO]"

This ensures user visibility into automation system.

### 🚀 SessionStart Report

**Hook:** `session-start.py` fires at session start and provides structured guidelines.

**Report Elements:** Context status, project progress, next task, quick actions.

**Format:** Follow the template provided by session-start.py hook output. Keep it conversational.

---

### Session Management is AUTOMATED

Python hooks (`.claude/hooks/*.py`) handle session lifecycle:

```
┌─────────────────────────────────────────────────┐
│  session-start.py                               │
│  → Reads TASKS.md NEXT SESSION                  │
│  → Warns if context >60%                         │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  You work on tasks...                           │
│  → Edit files, Write code, Run commands         │
└─────────────────────────────────────────────────┘
                      ↓
        🎣 post-tool-use.py (every tool)
                      ↓
┌─────────────────────────────────────────────────┐
│  .actions.json (action log)                     │
│  → {"tool":"Edit","target":"file.ts",...}       │
└─────────────────────────────────────────────────┘
                      ↓
        ⏰ Context reaches ~18000 tokens
                      ↓
        🎣 pre-compact.py (smart detection)
                      ↓
┌─────────────────────────────────────────────────┐
│  Smart Detection Algorithm                      │
│  → Analyzes actions vs TASKS.md                 │
│  → Reports matches >70% confidence               │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  session-end.py                                 │
│  → Verifies documentation consistency           │
│  → Checks uncommitted changes                   │
└─────────────────────────────────────────────────┘
```

**You don't need manual startup protocol** - hooks handle it automatically!

**Requirements:** Python 3.11+ installed on system

**Reference:** See [smart-detector.md](lib/smart-detector.md) for detection algorithm details

---

## 📚 Documentation Quick Reference

**Choose the right document for your need:**

| Document                  | When to Read                      | Purpose                                  |
| ------------------------- | --------------------------------- | ---------------------------------------- |
| **CONTRIBUTING.md** ⭐    | Setup & daily development         | Complete setup guide, workflow, commands |
| **TASKS.md** 📋           | Planning next tasks               | Roadmap (96 tasks across 6 phases)       |
| **AUDIT_FIXES.md** 🔧     | Post-migration corrections        | 8 critical corrections (blockers)        |
| **DATABASE.md** 💾        | Working with database             | expo-sqlite setup, schema, CRUD ops      |
| **ARCHITECTURE.md** 🏗️   | Understanding code structure      | Folder organization, patterns, imports   |
| **TECHNICAL.md** 🎓       | Understanding tech decisions      | Architecture Decision Records (ADRs)     |
| **TROUBLESHOOTING.md** 🆘 | When something breaks             | Common issues & solutions                |
| **PRD.md** 📄             | Understanding product vision      | Requirements, user stories, metrics      |

**Quick Navigation:**
- 🎯 **Current Phase:** See [TASKS.md § Phase 0.5](../docs/TASKS.md#phase-05-architecture--foundation-415--critical)
- 🚀 **Next Steps:** See [TASKS.md § NEXT SESSION](../docs/TASKS.md#-next-session)

---

## 📝 Documentation Update Protocol

**CRITICAL**: Be ULTRA-PRECISE with documentation updates.

**4-step process:**

1. **Read file first** - Verify content and line numbers
2. **Announce exact changes** - File, line, before/after
3. **Execute with Edit tool** - Use exact strings
4. **Verify change applied** - Read file again to confirm

**Example:**

```markdown
📄 File: docs/TASKS.md
📍 Section: Phase 0.5 Bis, Task 1 (line 210)
✏️ Change: Mark checkbox [x]

Before: - [ ] 0.5bis.1 Setup EAS Build Account
After:  - [x] 0.5bis.1 Setup EAS Build Account
```

**Never duplicate info across docs** - Each doc has single responsibility (see Documentation Map above)

---

## 🎓 Standards & Best Practices

**See [TECHNICAL.md](../docs/TECHNICAL.md)** for coding standards, performance guidelines, and testing strategy.

**See [CONTRIBUTING.md](../docs/CONTRIBUTING.md)** for pre-commit hooks, workflow, and session end checklist.

**Key Principles:**
- **TypeScript strict mode** - No `any` types
- **100% offline-first** - All features work without internet
- **Automation:** session-end.py hook verifies consistency automatically

---

## 📂 .claude/ Directory Structure

```
.claude/
├── CLAUDE.md (this file)        # Project instructions
├── settings.local.json          # Hook configuration
├── hooks/                       # Python 3.11+ automation scripts
│   ├── post-tool-use.py        # Log actions to .actions.json
│   ├── pre-compact.py          # Trigger smart detection
│   ├── session-start.py        # Load context on startup
│   └── session-end.py          # Verify consistency
├── lib/                         # Reference documentation
│   ├── smart-detector.md       # Detection algorithm
│   └── tasks-format.md         # Strict format rules
└── .actions.json               # Action log (auto-generated)
```

**Workflow:** session-start → work → post-tool-use → pre-compact → smart detection → session-end

---

## 💡 Pro Tips

1. **Update docs as you go**, not at session end
2. **Use git grep** to find where info is documented before adding duplicate
3. **When in doubt**, check Documentation Map table above
4. **Trust the hooks** - they handle session management automatically
5. **Keep context <60%** - triggers smart detection before manual compact needed
