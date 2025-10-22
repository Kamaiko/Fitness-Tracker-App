# Instructions pour Claude

> **Version**: 2.0
> **Last Updated**: Automatically updated via git hooks
> **Purpose**: Session startup guide + documentation navigation

---

## 🎯 Session Startup Protocol

### 1. Read Project Status (15 seconds)

**Single Source of Truth**: `README.md` section "Current Status"

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

| Scenario                        | Read This Document       | Section                |
| ------------------------------- | ------------------------ | ---------------------- |
| New to project                  | CONTRIBUTING.md          | Complete guide         |
| Daily development               | TASKS.md                 | Current phase section  |
| Database work                   | DATABASE.md              | Relevant operation     |
| Fixing bugs                     | TROUBLESHOOTING.md       | By component/symptom   |
| Understanding tech decisions    | TECHNICAL.md             | Specific ADR           |
| Post-migration corrections      | AUDIT_FIXES.md           | TL;DR → Correction #N  |
| Code structure questions        | ARCHITECTURE.md          | Relevant pattern       |

### 3. Documentation Update Rules

**CRITICAL**: Prevent documentation rot

#### ✅ DO Update:
- Mark tasks `[x]` in TASKS.md when complete
- Update README.md "Current Status" when phase changes
- Add new issues to TROUBLESHOOTING.md when solved
- Commit doc changes with task completion

#### ❌ NEVER Duplicate:
- **Status/Progress** → Only in README.md § Current Status
- **Tech Stack** → Only in README.md § Tech Stack table
- **Setup Instructions** → Only in CONTRIBUTING.md
- **Phase Details** → Only in TASKS.md
- **ADRs** → Only in TECHNICAL.md

#### 🔄 How to Keep Docs Fresh:

**After completing a phase:**
```bash
# 1. Update TASKS.md - mark tasks [x]
# 2. Update README.md - Current Status section
# 3. Commit both together
git add README.md docs/TASKS.md
git commit -m "docs: update status after Phase X completion"
```

**After adding a feature:**
```bash
# If you solved a bug → Add to TROUBLESHOOTING.md
# If you made a tech decision → Add ADR to TECHNICAL.md
# If you changed DB schema → Update DATABASE.md
```

---

## 📋 Commit Convention

### Format
```
<type>(<scope>): <description>

[optional body]
```

### Types
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation seulement
- `style`: Formatage (spaces, virgules)
- `refactor`: Refactoring (ni feat ni fix)
- `test`: Tests
- `chore`: Maintenance (build, deps, config)

### Scopes (common)
- `workout`, `exercises`, `analytics`, `auth`
- `db`, `ui`, `config`

### Examples
```bash
feat(workout): add RPE tracking to set logger
fix(analytics): correct volume calculation for compound exercises
docs(readme): update installation instructions for dev build
refactor(lib): extract 1RM calculations to separate module
chore(deps): update React Native to 0.82.0
```

---

## 🚫 Critical Rules

1. **NEVER mention "Claude" or "AI" in commits**
2. **NEVER add AI signatures in commits**
3. Use professional, simple commit messages
4. **NEVER duplicate info across docs**
5. **ALWAYS update docs when tasks complete**
6. **ALWAYS run `npm run type-check` before commit**

---

## 🔄 Session End Checklist

Before ending session:

```bash
# 1. Mark completed tasks in TASKS.md
[ ] Tasks marked [x]

# 2. Update status if phase changed
[ ] README.md § Current Status updated

# 3. Type check passes
[ ] npm run type-check ✅

# 4. Committed work
[ ] git status clean OR meaningful WIP commit

# 5. Next session prepared
[ ] TASKS.md has clear "⭐ NEXT SESSION" marker
```

---

## 📚 Documentation Map

**DO NOT duplicate content here** - just reference the docs.

| File                | Purpose                          | When to Update                     |
| ------------------- | -------------------------------- | ---------------------------------- |
| README.md           | Project overview, status, stack  | Phase change, version bump         |
| CONTRIBUTING.md     | Setup guide, workflow            | Stack change, new commands         |
| TASKS.md            | Roadmap (96 tasks, 6 phases)     | Task completion, phase progress    |
| AUDIT_FIXES.md      | Post-migration corrections       | Correction completion              |
| DATABASE.md         | WatermelonDB guide, schema       | Schema change, new CRUD operation  |
| ARCHITECTURE.md     | Code structure, patterns         | New pattern, folder restructure    |
| TECHNICAL.md        | ADRs, tech decisions             | New tech decision, algorithm added |
| TROUBLESHOOTING.md  | Bug solutions                    | New issue solved                   |
| PRD.md              | Product requirements             | Rarely (feature scope change)      |

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

## 💡 Smart Documentation Strategy

**Instead of updating multiple docs, use this hierarchy:**

1. **README.md** = Single source of truth for status
2. **TASKS.md** = Single source of truth for roadmap
3. **Other docs** = Reference README/TASKS, don't duplicate

**Example of GOOD references:**
```markdown
<!-- In TECHNICAL.md -->
**Current Phase**: See [README.md § Current Status](../README.md#-current-status)

<!-- In CONTRIBUTING.md -->
**Roadmap**: See [TASKS.md](TASKS.md) for complete task list
```

**Example of BAD duplication:**
```markdown
<!-- ❌ NEVER do this in multiple files -->
**Current Phase**: 0.5 Bis - Development Build Migration
**Progress**: 6/96 tasks (6%)
```

---

## 🎓 Pro Tips

1. **Start every session** by reading README.md § Current Status
2. **Find current work** in TASKS.md (look for ⭐ NEXT SESSION)
3. **Update docs as you go**, not at the end
4. **Use git grep** to find where info is documented before adding duplicate
5. **When in doubt**, check the Documentation Map table above

---

**Remember**: Good documentation = One source of truth per piece of information.
