# Instructions pour Claude

> **Version**: 2.0
> **Last Updated**: Automatically updated via git hooks
> **Purpose**: Session startup guide + documentation navigation

---

## 🎯 Session Startup Protocol

### 1. Read Project Status (15 seconds)

**Primary Source**: `README.md` section "Current Status"

```bash
# Current info is ALWAYS in README.md:
- Version
- Progress (X/96 tasks)
- Current Phase
```

**DO NOT duplicate status info here** - it becomes obsolete.

### 2. Navigate to Current Work (30 seconds)

**Follow this decision tree:**

```
Is this first session on project?
├─ YES → Read CONTRIBUTING.md (setup guide)
└─ NO  → Read TASKS.md section for current phase
          ↓
          Find section marked "⭐ NEXT SESSION"
          ↓
          Read Pre-Flight Checklist if present
          ↓
          Execute tasks in order
```

**Key files by scenario:**

| Scenario                     | Read This Document | Section               |
| ---------------------------- | ------------------ | --------------------- |
| New to project               | CONTRIBUTING.md    | Complete guide        |
| Daily development            | TASKS.md           | Current phase section |
| Database work                | DATABASE.md        | Relevant operation    |
| Fixing bugs                  | TROUBLESHOOTING.md | By component/symptom  |
| Understanding tech decisions | TECHNICAL.md       | Specific ADR          |
| Post-migration corrections   | AUDIT_FIXES.md     | TL;DR → Correction #N |
| Code structure questions     | ARCHITECTURE.md    | Relevant pattern      |

### 3. Documentation Update Protocol (MANDATORY)

**CRITICAL**: Be ULTRA-PRECISE with documentation updates.

**Always specify:**
✅ File path (exact)
✅ Section/line number (verified by reading file first)
✅ Exact change (before/after)

**Example:**

```markdown
📄 File: docs/TASKS.md
📍 Section: Phase 0.5 Bis, Task 1 (line 195)
✏️ Change: Mark checkbox [x]

Before: - [ ] 0.5bis.1 Setup EAS Build Account
After: - [x] 0.5bis.1 Setup EAS Build Account
```

**4-step process:**

1. Read file first (verify content)
2. Announce exact changes (file, line, before/after)
3. Execute with Edit tool (exact strings)
4. Verify change applied (read again)

**Never duplicate info across docs** - see [Primary Source Matrix](DOC_AUTOMATION_SYSTEM.md#primary-source-matrix)

**Complete workflows**: [DOC_AUTOMATION_SYSTEM.md](DOC_AUTOMATION_SYSTEM.md)

---

## 📋 Commit Convention

Suivre les règles **commitlint** (conventional commits):

```
<type>(<scope>): <description>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
**Scopes communs**: `workout`, `exercises`, `analytics`, `auth`, `db`, `ui`, `config`

**Exemple**: `feat(workout): add RPE tracking to set logger`

---

## 🚫 Critical Rules

1. **NEVER mention "Claude" or "AI" in commits**
2. **NEVER add AI signatures in commits**
3. Use professional, simple commit messages
4. **ALWAYS update docs when tasks complete**
5. **ALWAYS run `npm run type-check` before commit**

---

## 🔄 Session End Checklist

Before ending session:

```bash
[ ] Detect triggers (task complete, phase complete, bug fixed, etc.)
[ ] Update docs using 4-step process (see § Documentation Update Protocol)
[ ] Commit with conventional message
[ ] npm run type-check ✅
[ ] Verify "⭐ NEXT SESSION" marker in TASKS.md
```

**Complete automation workflow**: [DOC_AUTOMATION_SYSTEM.md](DOC_AUTOMATION_SYSTEM.md)

---

## 📚 Documentation Map

| File                     | Purpose                         | When to Update                     |
| ------------------------ | ------------------------------- | ---------------------------------- |
| README.md                | Project overview, status, stack | Phase change, version bump         |
| CONTRIBUTING.md          | Setup guide, workflow           | Stack change, new commands         |
| TASKS.md                 | Roadmap (96 tasks, 6 phases)    | Task completion, phase progress    |
| AUDIT_FIXES.md           | Post-migration corrections      | Correction completion              |
| DATABASE.md              | WatermelonDB guide, schema      | Schema change, new CRUD operation  |
| ARCHITECTURE.md          | Code structure, patterns        | New pattern, folder restructure    |
| TECHNICAL.md             | ADRs, tech decisions            | New tech decision, algorithm added |
| TROUBLESHOOTING.md       | Bug solutions                   | New issue solved                   |
| PRD.md                   | Product requirements            | Rarely (feature scope change)      |
| DOC_AUTOMATION_SYSTEM.md | Trigger-based doc update system | System refinement (rare)           |

---

## 🛠️ Quick Commands

**Daily Development:**

```bash
npm start                 # Start dev server
npm start -- --clear      # Clear cache + start
npm run type-check        # TypeScript validation
```

**Building (only when adding native modules):**

```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

---

## 🎓 Pro Tips

1. **Start every session** by reading README.md § Current Status
2. **Find current work** in TASKS.md (look for ⭐ NEXT SESSION)
3. **Update docs as you go**, not at the end
4. **Use git grep** to find where info is documented before adding duplicate
5. **When in doubt**, check the Documentation Map table above
6. **ALWAYS verify line numbers** by reading file first
7. **Show BEFORE/AFTER** for every doc change

---

**Remember**: Documentation updates must be ULTRA-PRECISE. See [DOC_AUTOMATION_SYSTEM.md](DOC_AUTOMATION_SYSTEM.md) for complete workflows.
