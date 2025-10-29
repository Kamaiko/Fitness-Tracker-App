---
description: Smart git commit with strict commitlint validation
allowed-tools: Bash(git status:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*), Bash(git diff:*), Read, Grep
---

# /commit - Smart Commit with Strict Validation

Analyzes changed files, suggests a commit message following strict conventions, and asks for confirmation before committing.

## Usage

```bash
/commit              # Analyze changes → Suggest message → Confirm → Commit
/commit --no-verify  # Skip pre-commit hooks (emergency only)
```

## 🎯 How It Works

1. **Analyze** - Run `git status` and `git diff` to see all changes
2. **Suggest** - Generate commit message based on:
   - Changed files (suggest scope if clear)
   - Nature of changes (feat/fix/refactor/etc)
   - Strict commitlint rules
3. **Confirm** - Show suggested message and ask for approval
4. **Commit** - Execute commit with validated message

---

## ⚠️ CRITICAL: Commitlint Rules

This project uses **STRICT** commitlint configuration. Commits will be **REJECTED** if they don't follow these rules:

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
- **scope**: Optional but recommended
- **Subject**: Sentence-case, concise (<72 chars)
- **Body**: Optional, separated by blank line

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

**Pre-commit hooks:** Will run automatically if configured (Husky/lint-staged)
**Skip hooks:** `/commit --no-verify` (emergency only)

---

## 🤖 Implementation Instructions for Claude

When user runs `/commit`, follow this workflow:

### Step 1: Analyze Changes
```bash
git status              # See all changed files
git diff --staged       # See staged changes (if any)
git diff                # See unstaged changes (if none staged)
git log -1 --oneline    # See last commit for style reference
```

### Step 2: Determine Commit Type

Analyze the changes and determine the appropriate type:

- **feat** - New feature, component, or functionality added
- **fix** - Bug fix, error correction
- **docs** - Documentation only (no code changes)
- **style** - Formatting, whitespace (no logic changes)
- **refactor** - Code restructuring (no functional changes)
- **test** - Adding or updating tests
- **chore** - Config, dependencies, tooling

### Step 3: Suggest Scope (Optional)

Based on changed files, suggest a scope if it makes sense:
- Look at file paths and suggest logical grouping
- If changes span multiple areas, suggest the most dominant one
- Scope is optional - can be omitted if unclear

### Step 4: Generate Message

Format: `type(scope): Subject` or `type: Subject`

**Rules:**
- Subject must start with uppercase letter (sentence-case)
- Subject max 72 characters
- No emojis
- Be specific and actionable
- Describe WHAT changed, not HOW

**Examples:**
```
feat(auth): Add login screen
fix(database): Resolve user ID persistence issue
docs: Update installation instructions
refactor: Simplify timer logic
chore(deps): Update dependencies
```

### Step 5: Show Summary & Confirm

Present the suggested commit to the user:

```
📝 Suggested commit message:
[type](scope): Subject line

📂 Files to be committed:
  M  path/to/file1.tsx
  A  path/to/file2.ts
  D  path/to/file3.md

✅ Proceed with this commit? (yes/no)
```

If user says no, ask if they want to:
- Modify the message
- Cancel the commit
- Stage different files

### Step 6: Execute Commit

If user confirms:
```bash
git add -A                              # Stage all changes
git commit -m "[type](scope): Subject"  # Commit
git status                              # Show result
```

**If commit fails:**
- Show the error message
- If it's a hook failure (ESLint/Prettier/TypeScript):
  - Suggest running `npm run lint:fix` or `npm run format`
  - Offer to commit with `--no-verify` (explain risks)
- If it's commitlint validation:
  - Explain which rule was violated
  - Suggest corrected message

### Step 7: Offer Next Action

After successful commit, ask if user wants to:
- Push to remote
- Continue working
- Create another commit
