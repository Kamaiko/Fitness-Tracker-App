# Claude Instructions - Halterofit

> **Version**: 4.2
> **Last Updated**: 2025-01-30
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

**Design Philosophy:** Halterofit draws inspiration from industry-leading fitness tracking apps like Jefit, particularly their robust offline-first architecture and comprehensive exercise tracking capabilities. We aim to match their reliability while adding our unique context-aware analytics layer.

---

## 🚧 Current Phase & Next Steps

**Phase:** 0.5 - Architecture & Foundation
**Progress:** 6/98 tasks (6%)
**Version:** 0.1.0

**Next Task:** 0.5.20 - Setup EAS Build Account & CLI
**Next Phase:** Critical Corrections & Infrastructure (4 tasks remaining)

**Critical Context:**
- ✅ Development Build migration COMPLETED (Phase 0.5.B - Tasks 0.5.20-0.5.26)
- Current stack: Development Build + WatermelonDB + MMKV + Victory Native
- Early migration avoided 40-60% code rewrite later

**Reference:** See [TASKS.md § Kanban](../docs/TASKS.md#-kanban) for current priorities

---

## 🛠️ Tech Stack

**Current:** Development Build + WatermelonDB + MMKV + Victory Native (Production-ready)

**Migration Completed:** Phase 0.5.B (Tasks 0.5.20-0.5.26) ✅
- Database: WatermelonDB (reactive, offline-first)
- Storage: MMKV (encrypted, 10-30x faster)
- Charts: Victory Native (Skia-based)
- Build: EAS Development Build

**See [TECHNICAL.md](../docs/TECHNICAL.md)** for complete stack details and Architecture Decision Records (ADRs).

---

## ⚡ Commands & Workflow

**See [CONTRIBUTING.md](../docs/CONTRIBUTING.md)** for complete command reference, git workflow, and development guide.

**Quick Reference:**
- `npm start` - Start Expo dev server
- `npm run type-check` - TypeScript verification (run before commit)
- `npm test` - Run Jest tests

---

## 🧪 Testing Strategy

**Three-tier testing approach:**

| Test Type | Environment | What to Test | Tools | Status |
|-----------|-------------|--------------|-------|--------|
| **Unit** | Jest + LokiJS | CRUD, queries, relationships | Jest, @testing-library | ✅ Active (37 tests) |
| **Integration** | Expo Dev Build | Sync protocol, migrations | Real SQLite + JSI | 🚧 Phase 1 (Manual) |
| **E2E** | Real Device | Full user flows | Maestro (YAML) | 📅 Phase 3+ |

**Key Limitation**: WatermelonDB sync protocol (`_changed`, `_status`, `synchronize()`) **CANNOT** be tested in Jest with LokiJS adapter. Requires real SQLite environment.

**Current Coverage**: 60-65% database layer (Phase 0.5 foundation)

**See:**
- [Testing Overview](../docs/testing/README.md) - Complete testing strategy and navigation
- [Unit Testing Guide](../docs/testing/unit-guide.md) - Writing Jest unit tests
- [Manual E2E Guide](../docs/testing/e2e-manual.md) - Phase 1 manual testing
- [Test Infrastructure](../tests/README.md) - Helpers, fixtures, mocks

---

## 🤖 Slash Commands

Custom slash commands available in `.claude/commands/`:

- **/commit** - Smart git commit with strict commitlint validation
- **/task-update** - Auto-magic task completion with 16-level cascade updates

See individual command files for detailed usage instructions.

---

## 📚 Documentation Quick Reference

**Choose the right document for your need:**

| Document                  | When to Read                      | Purpose                                  |
| ------------------------- | --------------------------------- | ---------------------------------------- |
| **CONTRIBUTING.md** ⭐    | Setup & daily development         | Complete setup guide, workflow, commands |
| **TASKS.md** 📋           | Planning next tasks               | Roadmap (98 tasks across 6 phases)       |
| **AUDIT_FIXES.md** 🔧     | Post-migration corrections        | 8 critical corrections (blockers)        |
| **DATABASE.md** 💾        | Working with database             | WatermelonDB setup, schema, CRUD ops     |
| **ARCHITECTURE.md** 🏗️   | Understanding code structure      | Folder organization, patterns, imports   |
| **TECHNICAL.md** 🎓       | Understanding tech decisions      | Architecture Decision Records (ADRs)     |
| **TROUBLESHOOTING.md** 🆘 | When something breaks             | Common issues & solutions                |
| **testing/README.md** 🧪  | Understanding testing strategy    | Three-tier testing (unit/manual E2E/automated) |
| **PRD.md** 📄             | Understanding product vision      | Requirements, user stories, metrics      |

**Quick Navigation:**
- 🎯 **Current Phase:** See [TASKS.md § Phase 0.5](../docs/TASKS.md#phase-05-architecture--foundation-628)
- 🚀 **Next Priority:** See [TASKS.md § Kanban](../docs/TASKS.md#-kanban)

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
📍 Section: Phase 0.5.B, Task 1 (line 209)
✏️ Change: Mark checkbox [x]

Before: - [ ] 0.5.20 Setup EAS Build Account & CLI
After:  - [x] 0.5.20 Setup EAS Build Account & CLI
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

## 💬 Code Navigation & Comments

Use structured comment tags to improve code navigation and maintainability:

**Recommended Tags:**

- `// TODO:` - Planned features or improvements
  ```typescript
  // TODO: Add biometric authentication for quick login (Phase 1)
  ```

- `// FIXME:` - Known issues that need attention
  ```typescript
  // FIXME: Race condition when rapidly toggling workout state
  ```

- `// NOTE:` - Important context or explanations
  ```typescript
  // NOTE: We use Zustand persist middleware instead of service layer for simple state
  ```

- `// HACK:` - Temporary workarounds (mark for refactoring)
  ```typescript
  // HACK: Temporary null check until WatermelonDB migration complete
  ```

**Benefits:**
- IDE search functionality (`Cmd/Ctrl + F` for "TODO:")
- Quick identification of technical debt
- Clear communication of intent for future developers
- Easy tracking of areas needing attention

**Best Practices:**
- Be specific in comments (bad: "fix this", good: "validate email format before Supabase call")
- Link to TASKS.md task numbers when relevant: `// TODO(0.5.23): Migrate to Victory Native`
- Remove obsolete comments during refactoring
- Use comments to explain **why**, not **what** (code should be self-documenting for "what")

---

## 📂 .claude/ Directory Structure

```
.claude/
├── CLAUDE.md (this file)        # Project instructions
├── settings.json                # Shared hooks configuration (versioned)
├── settings.local.json          # Local permissions (NOT versioned)
├── commands/                    # Custom slash commands
│   ├── commit.md               # /commit - Smart git commits
│   └── task-update.md          # /task-update - Auto-magic task management
├── lib/                         # Specifications & formats
│   └── tasks-format-spec.md    # TASKS.md format specification v4.2
└── hooks/                       # Reserved for future automation
    └── (empty - for future use)
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
