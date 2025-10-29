---
description: Smart git commit with strict commitlint validation
allowed-tools: Bash(git status:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*), Bash(git diff:*), Read, Grep
---

# /commit - Smart Commit with Strict Validation

Analyzes changes, suggests commit messages, and ensures 100% commitlint compliance.

## Usage

```bash
/commit              # Standard commit with validation
/commit --no-verify  # Skip pre-commit hooks (emergency only)
```

---

## ⚠️ CRITICAL: Commitlint Rules

Halterofit uses **STRICT** commitlint configuration. Commits will be **REJECTED** if they don't follow these rules:

### Rule 1: Allowed Types (7 ONLY)

```
✅ feat     - New feature
✅ fix      - Bug fix
✅ docs     - Documentation changes
✅ style    - Code style (formatting, missing semicolons, etc)
✅ refactor - Code refactoring (no functional changes)
✅ test     - Adding or updating tests
✅ chore    - Tooling, configuration, dependencies
```

**All other types are REJECTED** (build, ci, perf, revert, etc.)

### Rule 2: Subject Must Be Sentence-Case

```
✅ feat(auth): Add login screen
❌ feat(auth): add login screen     # REJECTED - lowercase first letter
❌ feat(auth): ADD LOGIN SCREEN     # REJECTED - all caps
```

**First letter MUST be uppercase, rest lowercase (except proper nouns).**

### Rule 3: NO Emojis

```
✅ feat(workout): Add rest timer
❌ ✨ feat(workout): Add rest timer  # REJECTED - emoji
❌ feat(workout): Add rest timer ⏱️  # REJECTED - emoji
```

**Commitlint will reject any emoji in the message.**

### Rule 4: Format Structure

```
type(scope): Subject line

Optional body with more details.
Can be multiline.
```

- **type**: One of the 7 allowed types
- **scope**: Optional but recommended (see scope guide below)
- **Subject**: Sentence-case, concise (<72 chars)
- **Body**: Optional, separated by blank line

---

## 📋 Common Scopes

**Auto-detected from file paths:**

```
Core:        app, components, hooks, services, stores, types, utils
Features:    workout, analytics, auth, database, ui, forms, navigation
Automation:  automation, hooks, claude
Docs:        docs, architecture
Config:      settings, git, deps
```

---

## 🎯 Commit Types (7 allowed)

```
feat      - New feature, component, or functionality
fix       - Bug fix, error correction
docs      - Documentation only (no code changes)
style     - Formatting, whitespace (no logic changes)
refactor  - Code restructuring (no functional changes)
test      - Add or update tests
chore     - Config, dependencies, tooling
```

**Examples:**
```bash
feat(workout): Add rest timer component
fix(database): Correct user ID persistence on app restart
docs(architecture): Translate French sections to English
refactor(hooks): Add strict template format to session-start hook
chore(deps): Update Expo SDK to 54.0.12
```

---

## 🚀 Pre-Commit Automation

**Husky + lint-staged runs automatically on commit:**
- ESLint --fix, Prettier, TypeScript type-check
- Commit fails if: TypeScript errors, unfixable lint errors, invalid commit message

```bash
npm run type-check    # Check before committing
npm run lint          # Fix issues first
```

---

## 🚨 Common Mistakes

| ❌ REJECTED | ✅ ACCEPTED | Why |
|------------|-------------|-----|
| `perf(db): Optimize queries` | `refactor(database): Optimize queries` | "perf" not allowed |
| `feat(workout): add timer` | `feat(workout): Add timer` | Subject must be sentence-case |
| `✨ feat(auth): Add login` | `feat(auth): Add login screen` | No emojis |
| `feat: Add timer and fix bug` | Split into 2 commits | Mixed concerns |
| `fix: Update code` | `fix(workout): Resolve timer bug` | Be specific |

---

## 📚 Quick Reference

**Format:** `type(scope): Subject` + optional body

**7 Types:** feat, fix, docs, style, refactor, test, chore
**Sentence-case:** First letter uppercase
**No emojis:** Ever
**Atomic:** One logical change per commit

**Pre-commit runs:** ESLint, Prettier, TypeScript
**Skip hooks:** `/commit --no-verify` (emergency only)
