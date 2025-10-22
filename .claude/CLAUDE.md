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

**Phase:** 0.5 Bis - Development Build Migration
**Progress:** 6/96 tasks (6%)
**Version:** 0.2.0

**Next Task:** 0.5bis.2 - Implement database schema in Supabase
**File to create:** `supabase/migrations/001_initial_schema.sql`

**Critical Context:**
- Migrating from Expo Go → Development Build (native modules required)
- Stack changes: expo-sqlite → WatermelonDB, AsyncStorage → MMKV, chart-kit → Victory Native
- **Blocker**: Must complete Phase 0.5 Bis before Phase 1 (Authentication) can start

**Reference:** See [TASKS.md § NEXT SESSION](../docs/TASKS.md#-next-session) for detailed task breakdown

---

## 🛠️ Tech Stack - Critical Decisions

### Why Development Build (Not Expo Go)?

Native modules required for production-grade performance:

| Component       | Choice             | Why                                              | NOT            |
| --------------- | ------------------ | ------------------------------------------------ | -------------- |
| **Database**    | WatermelonDB       | Reactive queries, offline-first, built-in sync   | expo-sqlite    |
| **Storage**     | MMKV               | 10-30x faster, native encryption                 | AsyncStorage   |
| **Charts**      | Victory Native     | Skia rendering, advanced gestures, professional  | chart-kit      |
| **Build**       | Development Build  | Required for WatermelonDB/MMKV/Victory           | Expo Go        |

**Key Insight:** Building with production tools from Day 1 avoids costly 1-2 week refactoring later.

### Current Stack Overview

| Layer         | Technologies                                         |
| ------------- | ---------------------------------------------------- |
| **Frontend**  | Expo SDK 54, React Native 0.82, TypeScript 5.9       |
| **Navigation**| Expo Router 6                                        |
| **Styling**   | NativeWind v4 (Tailwind CSS 3.4)                     |
| **State**     | Zustand 5.0 + React Query 5.90                       |
| **Database**  | WatermelonDB + Supabase PostgreSQL                   |
| **Storage**   | MMKV (encrypted, fast)                               |
| **UI**        | FlashList + expo-image + Victory Native              |
| **Backend**   | Supabase (Auth + Database + Storage + Realtime)      |
| **Analytics** | simple-statistics (Mann-Kendall, regressions)        |
| **Testing**   | Jest + React Native Testing Library                  |
| **Build**     | EAS Build (cloud builds for native modules)          |

**Reference:** See [TECHNICAL.md](TECHNICAL.md) for Architecture Decision Records (ADRs)

---

## 🎯 Performance Targets & Constraints

**Critical Performance Requirements:**

| Metric                  | Target       | Why                                    |
| ----------------------- | ------------ | -------------------------------------- |
| **Cold start time**     | <2s          | User experience standard               |
| **Screen transitions**  | 60fps        | Sweaty hands in gym - needs smooth UX  |
| **Set logging latency** | <50ms        | Instant feedback for workout flow      |
| **Data loss incidents** | 0%           | Zero tolerance - offline-first promise |
| **Sync success rate**   | >99%         | Exponential backoff for reliability    |
| **Chart render time**   | <500ms       | 1000+ data points (2 years of data)    |

**Offline-First Architecture:**
- 100% functionality offline (log entire workout in airplane mode)
- Automatic bidirectional sync when connection restored
- Conflict resolution: last write wins with timestamp
- Guaranteed data integrity (foreign key constraints both DBs)

---

## ⚡ Common Commands

### Daily Development

```bash
npm start                    # Start Expo dev server
npm run type-check          # TypeScript verification (run before commit)
npm test                    # Run Jest tests
npm run lint                # ESLint check
npm run format              # Prettier format
```

### EAS Build (Development Build)

```bash
eas build --profile development --platform android   # Build dev client (~15-20 min)
eas build --profile development --platform ios       # iOS dev client
eas build --profile production --platform android    # Production build
eas whoami                                           # Verify EAS login
```

### Database Operations

```bash
# Supabase (cloud)
supabase db reset           # Reset database to migrations
supabase db push            # Push local migrations to remote
supabase migration new <name>   # Create new migration

# WatermelonDB (local)
# Operations handled in code via database.write() / database.read()
```

### Git Workflow

```bash
git status                  # Check uncommitted changes
git add -A                  # Stage all changes
git commit -m "feat(scope): description"   # Conventional commit
git push origin master      # Push to remote
```

**Commit Convention:** `<type>(<scope>): <description>`
**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
**Scopes:** `workout`, `exercises`, `analytics`, `auth`, `db`, `ui`, `config`

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
| **DATABASE.md** 💾        | Working with database             | WatermelonDB setup, schema, CRUD ops     |
| **ARCHITECTURE.md** 🏗️   | Understanding code structure      | Folder organization, patterns, imports   |
| **TECHNICAL.md** 🎓       | Understanding tech decisions      | Architecture Decision Records (ADRs)     |
| **TROUBLESHOOTING.md** 🆘 | When something breaks             | Common issues & solutions                |
| **PRD.md** 📄             | Understanding product vision      | Requirements, user stories, metrics      |

**Quick Navigation:**
- 🎯 **Current Phase:** See [TASKS.md § Phase 0.5 Bis](../docs/TASKS.md#phase-05-bis-development-build-migration-010)
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

### Code Quality

- **TypeScript strict mode** - No `any` types
- **ESLint enforced** - Fix before commit
- **Prettier formatting** - Automatic via pre-commit hook
- **100% offline-first** - All features work without internet

### Testing

- **Unit tests** for critical paths (calculations, validators, formatters)
- **Integration tests** for database operations and sync
- **Target coverage:** 60%+ for critical business logic
- **Framework:** Jest + React Native Testing Library

### Performance

- **FlashList** for all long lists (54% FPS improvement vs FlatList)
- **expo-image** for aggressive caching (1,300+ exercise GIFs)
- **React.memo** for expensive components (charts, list items)
- **Code splitting** for analytics (defer heavy features)

### Pre-commit Hooks (Automated)

```bash
# Runs automatically on git commit (via Husky + lint-staged)
- Type-check (TypeScript)
- Lint (ESLint)
- Format (Prettier)
- Commit message validation (commitlint)
```

**If commit blocked:** Fix errors, then commit again. Hooks prevent broken code.

---

## 🔄 Session End Checklist

Before ending session:

```bash
[ ] Update relevant docs (TASKS.md, TECHNICAL.md, etc.)
[ ] Commit with conventional message
[ ] npm run type-check ✅
[ ] Verify NEXT SESSION marker in TASKS.md is accurate
```

**Automation:** `session-end.py` hook verifies consistency automatically.

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
