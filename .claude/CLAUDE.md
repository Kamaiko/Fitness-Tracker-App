# Instructions pour Claude

> **Version**: 2.0
> **Last Updated**: Automatically updated via git hooks
> **Purpose**: Session startup guide + documentation navigation

---

## 🎯 Session Startup (AUTOMATED)

**Automated by SessionStart hook** (`.claude/hooks/session-start.py`)

The Python hook automatically:
- Reads TASKS.md → NEXT SESSION section
- Identifies next task to work on
- Warns if context >60% (suggests manual compact to avoid mid-task interruption)

**Requirements:** Python 3.11+ must be installed on your system.

**You don't need to explicitly follow a manual protocol** - the hook handles it!

**Key files by scenario:**

| Scenario                     | Read This Document | Section               |
| ---------------------------- | ------------------ | --------------------- |
| New to project               | CONTRIBUTING.md    | Complete guide        |
| Database work                | DATABASE.md        | Relevant operation    |
| Fixing bugs                  | TROUBLESHOOTING.md | By component/symptom  |
| Understanding tech decisions | TECHNICAL.md       | Specific ADR          |
| Post-migration corrections   | AUDIT_FIXES.md     | TL;DR → Correction #N |
| Code structure questions     | ARCHITECTURE.md    | Relevant pattern      |

---

## 📝 Documentation Update Protocol (MANDATORY)

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

**Never duplicate info across docs** - each doc has a single responsibility (see Documentation Map below)

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

## 🔄 Session End Checklist

Before ending session:

```bash
[ ] Update docs using 4-step process (see § Documentation Update Protocol)
[ ] Commit with conventional message
[ ] npm run type-check ✅
[ ] Verify NEXT SESSION section in TASKS.md accurate
```

**Automation:** SessionEnd hook (`.claude/hooks/session-end.py`) verifies documentation consistency automatically.

**System Requirements:** Python 3.11+ installed

---

## 📚 Documentation Map

| File                | Purpose                         | When to Update                     |
| ------------------- | ------------------------------- | ---------------------------------- |
| README.md           | Project overview, status, stack | Phase change, version bump         |
| CONTRIBUTING.md     | Setup guide, workflow           | Stack change, new commands         |
| TASKS.md            | Roadmap (96 tasks, 6 phases)    | Task completion, phase progress    |
| AUDIT_FIXES.md      | Post-migration corrections      | Correction completion              |
| DATABASE.md         | WatermelonDB guide, schema      | Schema change, new CRUD operation  |
| ARCHITECTURE.md     | Code structure, patterns        | New pattern, folder restructure    |
| TECHNICAL.md        | ADRs, tech decisions            | New tech decision, algorithm added |
| TROUBLESHOOTING.md  | Bug solutions                   | New issue solved                   |
| PRD.md              | Product requirements            | Rarely (feature scope change)      |

---

## 🎓 Pro Tips

1. **Update docs as you go**, not at the end
2. **Use git grep** to find where info is documented before adding duplicate
3. **When in doubt**, check the Documentation Map table above

---

## 📂 .claude/ File Index

**Quick reference:**

| File | Purpose | Format |
|------|---------|--------|
| hooks/post-tool-use.py | Log every Claude action | Python 3.11+ |
| hooks/pre-compact.py | Trigger smart detection | Python 3.11+ |
| hooks/session-start.py | Load context on startup | Python 3.11+ |
| hooks/session-end.py | Verify consistency | Python 3.11+ |
| lib/tasks-format.md | Strict format rules | Markdown |
| lib/smart-detector.md | Detection algorithm | Markdown |
| agents/task-tracker.md | Update execution | Markdown |
| agents/session-end.md | Consistency checks | Markdown |

**Workflow:**
```
Action → post-tool-use.py → .actions.json
  ↓
PreCompact → pre-compact.py → Claude reads smart-detector.md
  ↓
Detection >70% → Confirmation → task-tracker.md → Update TASKS.md
```

**Requirements:** Python 3.11+ must be installed
