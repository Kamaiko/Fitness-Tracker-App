# Claude Instructions - Halterofit

> **Version**: 4.0
> **Last Updated**: 2025-10-29
> **Purpose**: Project briefing and development guide

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

## 🤖 Slash Commands

Custom slash commands available in `.claude/commands/`:

- **/commit** - Smart git commit with strict commitlint validation

See individual command files for detailed usage instructions.

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

---

## 📂 .claude/ Directory Structure

```
.claude/
├── CLAUDE.md (this file)        # Project instructions
├── settings.json                # Shared hooks configuration (versioned)
├── settings.local.json          # Local permissions (NOT versioned)
├── commands/                    # Custom slash commands
│   └── commit.md               # /commit command
└── hooks/                       # Reserved for future automation
    ├── post-tool-use.py        # (empty)
    ├── pre-compact.py          # (empty)
    ├── session-start.py        # (empty)
    └── session-end.py          # (empty)
```

**Configuration:**
- `settings.json` - Hooks and shared config (checked into git)
- `settings.local.json` - Machine-specific permissions (gitignored)

---

## 💡 Pro Tips

1. **Update docs as you go**, not at session end
2. **Use git grep** to find where info is documented before adding duplicate
3. **When in doubt**, check Documentation Map table above
4. **Use /commit** for proper conventional commits
