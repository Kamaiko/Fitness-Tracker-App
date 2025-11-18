# Claude Instructions - Halterofit

> **Version**: 4.3
> **Last Updated**: 2025-11-06
> **Purpose**: Project briefing and development guide

---

## 📦 Phase 0.6 Updates - Architecture Cleanup

**Completed:** 2025-11-06

### Test Structure Reorganization
- ✅ Renamed `tests/` → `__tests__/` (Jest convention)
- ✅ Centralized all unit tests in `__tests__/unit/` (no more colocation in `src/`)
- ✅ Created E2E structure: `e2e/manual/` + `e2e/maestro/` (ready for Phase 1)
- ✅ Maintained `__tests__/__helpers__/` for shared utilities

### Database Service Reorganization
- ✅ Created modular structure: `local/` (WatermelonDB) + `remote/` (Supabase sync) + `operations/` (Business logic)
- ✅ Clear separation of concerns: Storage vs Sync vs CRUD
- ✅ Improved maintainability and scalability

### Cleanup
- ✅ Removed orphan files (`types.ts.bak`)
- ✅ Updated all imports across project
- ✅ All 36 tests passing ✅
- ✅ Type check passing ✅

**Impact:** Clean architecture foundation for Phase 1 (Authentication) and beyond.

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

**Phase:** 1 - Authentication & Foundation
**Progress:** 29/76 tasks (38%)
**Version:** 0.1.0

**Next Task:** Create Login Screen UI
**Next Phase:** Auth UI & Testing Infrastructure (16 tasks total)

**Critical Context:**
- ✅ Phase 0.5 COMPLETE (Architecture & Foundation - 21/21 tasks)
- ✅ Phase 0.6 COMPLETE (UI/UX Foundation - 8/8 tasks)
- Current stack: Development Build + WatermelonDB + MMKV + Victory Native
- Ready for Phase 1: Authentication implementation

**Reference:** See [TASKS.md § Kanban](../docs/TASKS.md#-kanban) for current priorities

---

## 🛠️ Tech Stack

**Current:** Development Build + WatermelonDB + MMKV + Victory Native + React Native Reusables (Production-ready)

**Migration Completed:** Phase 0.5 ✅ | Phase 0.6 ✅
- Database: WatermelonDB (reactive, offline-first)
- Storage: MMKV (encrypted, 10-30x faster)
- Charts: Victory Native (Skia-based)
- UI Components: React Native Reusables (shadcn/ui base)
- Icons: React Native Vector Icons (Material, Ionicons, FontAwesome)
- Lists: FlashList (optimized scrolling)
- Images: expo-image (memory-disk caching)
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

**Three-tier approach:** Unit tests (Jest + LokiJS) → Manual E2E (real SQLite) → Maestro automation (Phase 3+)

**Current Status:** 36 unit tests, 60-65% database coverage

**Key Limitation:** WatermelonDB sync protocol (`_changed`, `_status`) cannot be tested in Jest - requires real SQLite environment for E2E validation.

**See [TESTING.md](../docs/TESTING.md)** for complete testing strategy, infrastructure, and practices.

---

## 🤖 Slash Commands

Custom slash commands available in `.claude/commands/`:

- **/commit** - Smart git commit with strict commitlint validation
- **/task-update** - Auto-magic task completion with 16-level cascade updates

See individual command files for detailed usage instructions.

---

## 🗄️ Database Migrations

### Supabase CLI

**Create Migration:**
```bash
supabase migration new feature_name
```

**Apply Migrations:**
```bash
supabase db push
```

**Reset DB:**
```bash
supabase db reset  # Destroys + recreates from migrations
```

### Best Practices

1. One logical change per migration
2. Test with `supabase db reset` before committing
3. Never edit applied migrations - create new one
4. Sync WatermelonDB schema version when changing Supabase schema

### WatermelonDB Sync

When changing schema:
1. Update `src/services/database/watermelon/schema.ts` (increment version)
2. Add migration in `src/services/database/watermelon/migrations.ts`

---

## 📚 Documentation Quick Reference

**Choose the right document for your need:**

| Document                  | When to Read                      | Purpose                                  |
| ------------------------- | --------------------------------- | ---------------------------------------- |
| **CONTRIBUTING.md** ⭐    | Setup & daily development         | Complete setup guide, workflow, commands |
| **TASKS.md** 📋           | Planning next tasks               | Roadmap (83 tasks: 76 active + 7 deferred) |
| **CHANGELOG.md** 📝       | Reviewing completed work          | Release notes and milestone history      |
| **PHASE1_PLAN.md** 📐     | Implementing Phase 1              | Auth implementation guide (1,000+ lines) |
| **DATABASE.md** 💾        | Working with database             | WatermelonDB setup, schema, CRUD ops     |
| **ARCHITECTURE.md** 🏗️   | Understanding code structure      | Folder organization, patterns, imports   |
| **TECHNICAL.md** 🎓       | Understanding tech decisions      | Architecture Decision Records (ADRs)     |
| **TROUBLESHOOTING.md** 🆘 | When something breaks             | Common issues & solutions                |
| **TESTING.md** 🧪         | Understanding testing strategy    | Three-tier testing (unit/manual E2E/automated) |
| **PRD.md** 📄             | Understanding product vision      | Requirements, user stories, metrics      |

**Quick Navigation:**
- 🎯 **Current Phase:** Phase 1 - Authentication & Foundation (0/16) → [TASKS.md § Phase 1](../docs/TASKS.md#phase-1-authentication--foundation-016)
- 🚀 **Next Task:** Login Screen → [PHASE1_PLAN.md](../docs/PHASE1_PLAN.md)
- 📝 **Recent Completions:** [CHANGELOG.md](../docs/CHANGELOG.md) (Phase 0.5 & 0.6)

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
📍 Section: Phase X, Task Y (line 209)
✏️ Change: Mark checkbox [x]

Before: - [ ] Task description
After:  - [x] Task description
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
- Link to TASKS.md when relevant: `// TODO: See TASKS.md Phase X for migration plan`
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
