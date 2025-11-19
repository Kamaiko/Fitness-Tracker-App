# DevOps Pipeline Documentation

This document defines the complete CI/CD pipeline configuration, including git hooks, GitHub Actions workflows, Dependabot automation, and branch protection rules. Use this as the single source of truth for all DevOps behavior.

## 📑 Table of Contents

1. [Pipeline Overview](#pipeline-overview)
2. [Git Hooks (Husky)](#git-hooks-husky)
3. [GitHub Actions Workflows](#github-actions-workflows)
4. [Dependabot Configuration](#dependabot-configuration)
5. [Branch Protection Rules](#branch-protection-rules)
6. [Troubleshooting Guide](#troubleshooting-guide)

---

## Pipeline Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEVELOPER WORKFLOW                          │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        GIT HOOKS (Husky)                            │
│  • pre-commit: validate-tasks.sh, check-schema-version.sh, lint    │
│  • commit-msg: commitlint (Conventional Commits)                    │
│  • pre-push: type-check, tests (prevents CI failures)              │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      GITHUB ACTIONS CI/CD                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Code Quality │  │ Unit Tests   │  │ Security     │             │
│  │ (TypeScript, │  │ (Jest)       │  │ Scan         │             │
│  │  ESLint,     │  │              │  │ (npm audit)  │             │
│  │  Prettier)   │  │              │  │              │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                   │                                 │
│                                   ▼                                 │
│                        ┌──────────────────┐                        │
│                        │ Dependabot       │                        │
│                        │ Auto-Merge       │                        │
│                        └──────────────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT (Future Phases)                       │
│  • Preview Builds (Phase 2+)                                        │
│  • Production Builds (Phase 3+)                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component          | Technology     | Purpose                              |
| ------------------ | -------------- | ------------------------------------ |
| Git Hooks          | Husky          | Pre-commit/commit-msg validation     |
| Commit Linting     | commitlint     | Conventional Commits enforcement     |
| Code Formatting    | Prettier       | Code style consistency               |
| Linting            | ESLint         | Code quality checks                  |
| Type Checking      | TypeScript     | Static type validation               |
| Testing            | Jest           | Unit/integration tests               |
| CI/CD              | GitHub Actions | Automated testing and deployment     |
| Dependency Updates | Dependabot     | Automated dependency version updates |
| Security Scanning  | npm audit      | Vulnerability detection              |

> **Note:** For current versions, see [package.json](../package.json)

---

## Git Hooks (Husky)

### Directory Structure

```
.husky/
├── pre-commit                       # Fast checks: lint + format (staged files only)
├── commit-msg                       # Commit message validation (Conventional Commits)
├── pre-push                         # Slow checks: type-check + tests (prevents CI wait)
├── validate-tasks.sh                # TASKS.md integrity checker
├── check-schema-version.sh          # Database schema version validator
└── _/                               # Husky internal files (auto-generated)
```

### Hook Execution Order

```
git commit -m "message"
    │
    ├─► pre-commit hook (FAST - staged files only)
    │   ├─► 1. validate-tasks.sh (if TASKS.md staged)
    │   ├─► 2. check-schema-version.sh (if SQL migration staged)
    │   └─► 3. lint-staged (format + lint staged files)
    │
    ├─► commit-msg hook
    │   └─► commitlint (validate message format)
    │
    └─► Commit created ✅

git push
    │
    └─► pre-push hook (SLOW - prevents CI failures)
        ├─► 1. npm run type-check (TypeScript validation)
        └─► 2. npm run test (Jest unit tests)
```

---

## validate-tasks.sh

**File:** `.husky/validate-tasks.sh`
**Purpose:** Ensures TASKS.md integrity before commits
**Language:** POSIX Shell (sh)
**Execution:** Only when `docs/TASKS.md` is staged

### Design Philosophy

- **Future-proof:** Auto-discovers phases dynamically (no hardcoded phase numbers)
- **Zero maintenance:** Works for any number of phases (0.5, 0.6, 1, 2, ..., 100)
- **Fast-fail:** Blocks commit immediately if validation fails
- **Clear feedback:** Color-coded output with actionable error messages

### Validation Rules

#### 1. Completed Task Count Validation (CRITICAL)

**Rule:** Number of `[x]` checkboxes MUST match declared count in header

**Example:**

```markdown
**Progress**: 28/84 tasks (33%)
```

**Validation:**

```bash
COMPLETED=$(grep -c "^- \[x\]" "$TASKS_FILE")
DECLARED_COMPLETED=$(grep "^\*\*Progress\*\*:" "$TASKS_FILE" | grep -oP '\d+(?=/\d+ tasks)')

if [ "$COMPLETED" != "$DECLARED_COMPLETED" ]; then
  # CRITICAL ERROR - Blocks commit
fi
```

#### 2. Total Task Count Validation (CRITICAL)

**Rule:** Sum of `[x]` + `[ ]` checkboxes MUST match declared total

**Example:**

```markdown
**Progress**: 28/84 tasks (33%)
```

**Validation:**

```bash
PENDING=$(grep -c "^- \[ \]" "$TASKS_FILE")
TOTAL=$((COMPLETED + PENDING))
DECLARED_TOTAL=$(grep "^\*\*Progress\*\*:" "$TASKS_FILE" | grep -oP '(?<=\/)\d+(?= tasks)')

if [ "$TOTAL" != "$DECLARED_TOTAL" ]; then
  # CRITICAL ERROR - Blocks commit
fi
```

#### 3. Phase Counter Validation (WARNING)

**Rule:** TOC phase counters MUST match Header phase counters

**Future-Proof Algorithm:**

```bash
# Step 1: Auto-discover ALL phases from TOC
# Matches: "5. [Phase 0.5: Architecture & Foundation (21/21)]"
TOC_PHASES=$(grep -oP '^\d+\. \[Phase \K[0-9.]+(?=:)' "$TASKS_FILE")

# Step 2: For each discovered phase, validate TOC vs Header
while IFS= read -r phase; do
  # Extract counter from TOC (first occurrence)
  TOC_COUNTER=$(grep -m 1 "Phase $phase:" "$TASKS_FILE" | grep -oP '\(\d+/\d+\)')

  # Extract counter from Header (lines starting with ##)
  HEADER_COUNTER=$(grep "^## Phase $phase:" "$TASKS_FILE" | grep -oP '\(\d+/\d+\)')

  # Compare
  if [ "$TOC_COUNTER" != "$HEADER_COUNTER" ]; then
    # WARNING - Doesn't block commit
  fi
done <<< "$TOC_PHASES"
```

**Why Future-Proof:**

- No hardcoded phase numbers (0.5, 0.6)
- Regex dynamically detects ANY phase number/identifier
- Works for 0.5, 1, 2, 99, 100 without code changes
- Scales from 1 phase to 1000+ phases

### Example Output

#### Success Case

```
📋 Validating TASKS.md integrity...
🔍 Validating phase counters (TOC vs Headers)...

📊 Task Counts:
   Completed: 28
   Pending:   56
   Total:     84

✓ Completed count matches header (28)
✓ Total count matches header (84)
✓ Phase 0.5 TOC synced (21/21)
✓ Phase 0.6 TOC synced (7/8)
✓ Validated 2 phase(s)

✅ TASKS.md validation passed!
```

#### Failure Case

```
📋 Validating TASKS.md integrity...
🔍 Validating phase counters (TOC vs Headers)...

📊 Task Counts:
   Completed: 29
   Pending:   56
   Total:     85

❌ ERROR: Completed count mismatch!
   Checkboxes [x]: 29
   Header declares: 28
   Fix: Run /task-update to sync progress

❌ ERROR: Total task count mismatch!
   Actual total: 85
   Header declares: 84
   Fix: Update header Progress line to: 29/85 tasks

╔════════════════════════════════════════╗
║  TASKS.md VALIDATION FAILED            ║
╚════════════════════════════════════════╝

❌ 2 critical error(s) found

💡 Recommended fix:
   1. Run: /task-update (auto-fixes all issues)
   2. Review changes
   3. Stage TASKS.md again: git add docs/TASKS.md
   4. Retry commit
```

### Integration with /task-update

**Workflow:**

```
Developer modifies TASKS.md
    │
    ├─► Manually updates checkboxes
    │
    ├─► git add docs/TASKS.md
    │
    ├─► git commit -m "..."
    │
    ├─► validate-tasks.sh detects mismatch
    │   └─► BLOCKS commit
    │
    ├─► Developer runs: /task-update
    │   └─► Auto-corrects all counters
    │
    ├─► git add docs/TASKS.md
    │
    └─► git commit -m "..." ✅ SUCCESS
```

### Edge Cases Handled

1. **No phases in TOC:** Warning (doesn't block)
2. **Phase in TOC but not in Headers:** Warning
3. **Phase in Headers but not in TOC:** Warning
4. **Missing counter format:** Warning
5. **Empty TASKS.md:** Skips validation
6. **TASKS.md not staged:** Skips validation

---

## check-schema-version.sh

**File:** `.husky/check-schema-version.sh`
**Purpose:** Ensures WatermelonDB schema version is incremented when Supabase migrations are created
**Language:** POSIX Shell (sh)
**Execution:** Only when `supabase/migrations/*.sql` is staged

### Validation Rule

**Rule:** If SQL migration file staged → `schema.version` MUST be incremented

**Files Monitored:**

- `supabase/migrations/*.sql` (trigger)
- `src/services/database/watermelon/schema.ts` (validation target)

### Algorithm

```bash
# Step 1: Check if any SQL migration is staged
if git diff --cached --name-only | grep -qE "supabase/migrations/.*\.sql"; then

  # Step 2: Check if schema.ts was modified AND version changed
  if ! git diff --cached src/services/database/watermelon/schema.ts | grep -qE "^\+.*version:"; then
    echo "❌ Migration SQL detected but schema.version not incremented"
    exit 1  # Block commit
  fi

  echo "✅ Migration SQL + schema.version updated"
fi
```

### Example Output

#### Success Case

```
✅ Migration SQL + schema.version updated
```

#### Failure Case

```
❌ Migration SQL detected but schema.version not incremented

📋 Action required:
   1. Open: src/services/database/watermelon/schema.ts
   2. Increment version: version: X → version: X+1

📚 Documentation: docs/CONTRIBUTING.md § Database Schema Changes (step 5)

⚠️  Bypass (if migration doesn't change schema): git commit --no-verify
```

### Why This Validation Exists

**Problem:** WatermelonDB requires schema version increment to trigger client-side migrations.

**Without validation:**

```
Developer creates Supabase migration
    ↓
Forgets to increment WatermelonDB schema.version
    ↓
App breaks (schema mismatch)
```

**With validation:**

```
Developer creates Supabase migration
    ↓
Commits changes
    ↓
Hook detects missing schema.version increment
    ↓
Blocks commit + shows clear instructions
    ↓
Developer increments version
    ↓
Commit succeeds ✅
```

---

## Commitlint Configuration

**File:** `.commitlintrc.json`
**Purpose:** Enforce Conventional Commits format for consistency and AI context
**Library:** [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint)

### Configuration Philosophy

**Optimized for:** Solo developer + AI-assisted development (Claude Code)

**Design Decisions:**

- ✅ **Header length: 100 chars** (vs default 72) → More space for context
- ✅ **Body/Footer: Unlimited** → Detailed explanations for AI agents
- ✅ **Subject case: Flexible** → No strict sentence-case enforcement
- ✅ **All Conventional types** → feat, fix, docs, style, refactor, test, chore, build, ci, perf, revert

### Current Configuration

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore", "build", "ci", "perf", "revert"]
    ],
    "scope-empty": [0],
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
    "body-max-length": [0],
    "body-max-line-length": [0],
    "footer-max-length": [0],
    "footer-max-line-length": [0]
  }
}
```

### Message Format

**Structure:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example (short):**

```
feat(auth): add biometric login support
```

**Example (detailed for AI):**

```
refactor(database): migrate from AsyncStorage to MMKV

Motivation:
- AsyncStorage is slow (300-500ms per read)
- MMKV provides 10-30x performance improvement
- Enables encryption for sensitive data (auth tokens)

Implementation:
- Created storage abstraction layer (src/services/storage/storage.ts)
- Migrated Zustand persist middleware to MMKV adapter
- Updated Supabase auth storage to use MMKV

Testing:
- Unit tests for storage abstraction (100% coverage)
- Manual E2E verification on iOS/Android

References:
- ADR-006: Storage Performance Optimization
- TASKS.md § Phase 0.5.25
```

### Validation Rules

| Rule                     | Level | Value    | Rationale                                      |
| ------------------------ | ----- | -------- | ---------------------------------------------- |
| `header-max-length`      | error | 100      | Descriptive headers without truncation         |
| `body-max-length`        | off   | Infinity | Unlimited AI context                           |
| `body-max-line-length`   | off   | Infinity | Long URLs, stack traces, code snippets         |
| `footer-max-length`      | off   | Infinity | Unlimited references                           |
| `footer-max-line-length` | off   | Infinity | Long links to docs/issues                      |
| `subject-case`           | off   | -        | Flexible capitalization                        |
| `scope-empty`            | off   | -        | Scope optional (solo dev, no strict structure) |

### Integration with Husky

**Hook:** `.husky/commit-msg`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

**Execution:** Runs automatically after `git commit` (before commit is finalized)

**Behavior:**

- ✅ Valid format → Commit succeeds
- ❌ Invalid format → Commit blocked with clear error message

**Example error:**

```bash
⧗   input: Add login feature
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
✖   found 2 problems, 0 warnings
```

---

## pre-push Hook

**File:** `.husky/pre-push`
**Purpose:** Run expensive checks (type-check + tests) before push to prevent CI failures
**Philosophy:** Commit often (fast), push when validated (slow)

### Why pre-push Instead of pre-commit?

**Best Practice for Solo Developer (2025):**

| Hook         | Checks                 | Speed    | Frequency              | Purpose                 |
| ------------ | ---------------------- | -------- | ---------------------- | ----------------------- |
| pre-commit   | lint + format          | FAST     | Every commit (~10s)    | Maintain code style     |
| **pre-push** | **type-check + tests** | **SLOW** | **Before push (~30s)** | **Prevent CI failures** |
| CI (GitHub)  | Full validation        | SLOW     | After push (~2-3min)   | Safety net              |

**Benefits:**

- ✅ Commit frequently without interruption (pre-commit is fast)
- ✅ Detect TypeScript/test errors locally (30s vs 2-3min CI wait)
- ✅ Reduces CI failures by 80%+ (errors caught before push)
- ✅ Faster feedback loop (local = instant, CI = waiting)

### Implementation

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo ""
echo "🔍 Running type-check..."
npm run type-check || exit 1

echo ""
echo "🧪 Running tests..."
npm run test || exit 1

echo ""
echo "✅ All checks passed! Pushing..."
```

### Bypass (Emergency Only)

```bash
# Skip pre-push hook (NOT recommended)
git push --no-verify
```

**When to use:** Emergency hotfix when you know checks will fail but need to push anyway (e.g., WIP branch for collaboration)

---

## GitHub Actions Workflows

### Workflow Files

```
.github/workflows/
├── ci.yml              # Main CI pipeline (active - runs on push/PR)
├── cd-preview.yml      # Preview builds (disabled - Phase 2+)
└── cd-production.yml   # Production builds (disabled - Phase 3+)
```

---

## CI Workflow (ci.yml)

**File:** `.github/workflows/ci.yml`
**Triggers:** `push` to `master`, `pull_request` to `master`
**Concurrency:** Cancel in-progress runs when new commit pushed

### Job Dependency Graph

```
┌──────────────────┐
│  code-quality    │
│  unit-tests      │──┐
│  security-scan   │  │
└──────────────────┘  │
                      │
                      ▼
         ┌────────────────────────┐
         │ dependabot-auto-merge  │
         │ (Only if Dependabot PR)│
         └────────────────────────┘
```

### Job 1: Code Quality

**Purpose:** TypeScript type-check, ESLint, Prettier
**Runner:** ubuntu-latest
**Timeout:** 5 minutes

**Steps:**

1. Checkout code (SHA-pinned actions)
2. Setup Node.js with npm cache
3. Install dependencies (`npm ci`)
4. Cache TypeScript `.tsbuildinfo` for incremental builds
5. Cache ESLint `.eslintcache` for faster linting
6. TypeScript type-check (`npm run type-check`)
7. ESLint with cache (`npm run lint -- --cache`)
8. Prettier format check (`npm run format:check`)

**Caching Strategy:**

- TypeScript: `${{ hashFiles('**/tsconfig.json', 'src/**/*.ts', 'src/**/*.tsx') }}`
- ESLint: `${{ hashFiles('**/.eslintrc.json', 'src/**/*.ts', 'src/**/*.tsx') }}`

### Job 2: Unit Tests

**Purpose:** Jest tests with coverage
**Runner:** ubuntu-latest
**Timeout:** 5 minutes

**Steps:**

1. Checkout code
2. Setup Node.js with npm cache
3. Install dependencies (`npm ci`)
4. Cache Jest `.jest-cache`
5. Run tests with coverage (`npm run test:ci`)
6. Upload coverage reports

**Coverage Threshold (Commented Out - Phase 1+):**

```yaml
# TODO(Phase 1): Uncomment when coverage reaches 40%
# - name: Check coverage threshold
#   run: |
#     lines=$(node -e "console.log(require('./coverage/coverage-summary.json').total.lines.pct)")
#     if [ $lines -lt 40 ]; then exit 1; fi
```

### Job 3: Security Scan

**Purpose:** npm audit for vulnerabilities
**Runner:** ubuntu-latest
**Timeout:** 3 minutes

**Steps:**

1. Checkout code
2. Setup Node.js with npm cache
3. Install dependencies (`npm ci`)
4. Run npm audit (`npm audit --audit-level=critical`)
5. Fail only on CRITICAL vulnerabilities

**Rationale for `--audit-level=critical`:**

- HIGH severity vulnerabilities in CLI-only dependencies (e.g., glob) don't affect React Native runtime
- Mobile app never executes CLI commands at runtime
- Prevents false positives from blocking CI
- CRITICAL vulnerabilities still block (security maintained)

### Job 4: Dependabot Auto-Merge

**Purpose:** Automatically merge safe Dependabot PRs
**Runner:** ubuntu-latest
**Condition:** `github.actor == 'dependabot[bot]' && github.event_name == 'pull_request'`
**Dependencies:** Requires `code-quality`, `unit-tests`, `security-scan` to pass
**Permissions:** `contents: write`, `pull-requests: write`

**Metadata Fetched:**

- `dependency-names`: Package(s) being updated
- `update-type`: `semver-patch`, `semver-minor`, `semver-major`
- `package-ecosystem`: `npm`, `github_actions`
- `dependency-type`: `direct:production`, `direct:development`

**Auto-Merge Rules:**

#### Rule 1: GitHub Actions (ALL versions)

```yaml
if: steps.metadata.outputs.package-ecosystem == 'github_actions'
run: gh pr merge --auto --squash "$PR_URL"
```

**Rationale:** CI infrastructure updates. Safe to auto-merge after tests pass.

#### Rule 2: Dev Dependencies (Minor + Patch)

```yaml
if: |
  steps.metadata.outputs.dependency-type == 'direct:development' &&
  steps.metadata.outputs.update-type != 'version-update:semver-major'
run: gh pr merge --auto --squash "$PR_URL"
```

**Examples:**

- ✅ `eslint 9.38.0 → 9.39.0` (minor)
- ✅ `prettier 3.6.0 → 3.6.1` (patch)
- ❌ `typescript 5.x → 6.x` (major - manual review)

#### Rule 3: Runtime Dependencies (Patch + Minor)

```yaml
if: |
  steps.metadata.outputs.dependency-type == 'direct:production' &&
  (steps.metadata.outputs.update-type == 'version-update:semver-patch' ||
   steps.metadata.outputs.update-type == 'version-update:semver-minor')
run: gh pr merge --auto --squash "$PR_URL"
```

**Examples:**

- ✅ `react-native 0.81.5 → 0.81.6` (patch)
- ✅ `expo 54.0.0 → 54.1.0` (minor)
- ❌ `react 19.x → 20.x` (major - manual review)

#### Rule 4: Major Updates (Comment + Manual Review)

```yaml
if: |
  steps.metadata.outputs.dependency-type == 'direct:production' &&
  steps.metadata.outputs.update-type == 'version-update:semver-major'
run: gh pr comment "$PR_URL" --body "🚨 MAJOR UPDATE - Breaking Changes Expected..."
```

**Comment Template:**

```markdown
🚨 **MAJOR UPDATE - Breaking Changes Expected**

This is a version-update:semver-major update for a runtime dependency.

**Required actions before merging:**

1. Read the changelog and migration guide
2. Review all breaking changes
3. Test the app thoroughly on both iOS and Android
4. Check for required code changes

⚠️ Do NOT auto-merge this PR without careful review!
```

### Enhanced Logging (v1.0 - 2025-01-05)

**New Step (before auto-merge):**

```yaml
- name: Log merge details
  run: |
    echo "📦 Package(s): ${{ steps.metadata.outputs.dependency-names }}"
    echo "🔄 Update type: ${{ steps.metadata.outputs.update-type }}"
    echo "🏷️  Ecosystem: ${{ steps.metadata.outputs.package-ecosystem }}"
    echo "📋 Dependency type: ${{ steps.metadata.outputs.dependency-type }}"
```

**Purpose:** Improves debugging and visibility in GitHub Actions logs.

---

## CD Workflows (Preview & Production)

### CD Preview Workflow (cd-preview.yml)

**Status:** DISABLED (workflow_dispatch only)
**Planned Activation:** Phase 2+
**Purpose:** Build EAS Development/Preview builds for QA testing

**Current Configuration:**

- **Trigger:** Manual only (`workflow_dispatch`)
- **Platforms:** Android, iOS, or both
- **Timeout:** 45 minutes

**Why Disabled:**

- Infrastructure still changing frequently (Phase 0.5)
- Would waste EAS build limits (30 builds/month free tier)
- Manual builds (`eas build`) sufficient for now

**When to Enable (Phase 2+):**

- Features stable enough for regular QA testing
- Suggested frequency: 2-3 builds/week max (not every commit)
- Will auto-trigger on PRs with label `needs-qa`
- Posts QR code in PR comments for device installation

### CD Production Workflow (cd-production.yml)

**Status:** DISABLED (workflow_dispatch only)
**Planned Activation:** Phase 3+
**Purpose:** Build EAS Production builds for App Store/Play Store submission

**Current Configuration:**

- **Trigger:** Manual only (`workflow_dispatch`)
- **Platforms:** Android, iOS, or both
- **Submit to stores:** Optional boolean input
- **Timeout:** 60 minutes

**Why Disabled:**

- App not production-ready (still in infrastructure phase)
- No features implemented for end users
- Store deployment requires app review process

**When to Enable (Phase 3+):**

- MVP features complete and ready for beta/production
- After manual testing and QA approval
- Ready to submit to App Store/Play Store
- Will auto-trigger on version tags (`v1.0.0`, `v2.1.3`, etc.)
- Generates release notes from commits

**Planned Features (Phase 3+):**

- Automatic submission to stores (optional)
- Release notes generation from git commits
- Sentry source map upload for crash reporting
- Version bump automation

---

## Dependabot Configuration

**File:** `.github/dependabot.yml`
**Version:** 2
**Schedule:** Weekly (Monday 09:00 EST)

### NPM Dependencies

**Configuration:**

```yaml
package-ecosystem: 'npm'
directory: '/'
schedule:
  interval: 'weekly'
  day: 'monday'
  time: '09:00'
  timezone: 'America/New_York'
open-pull-requests-limit: 8
```

> **Increased from 5 to 8:** Dependabot groups reduce PR noise, higher limit allows more concurrent updates

### Dependency Groups

#### Group 1: dev-dependencies (Auto-merged minor/patch)

**Patterns:** TypeScript types, ESLint, Prettier, Jest, Commitlint, Testing Library
**Update types:** Minor + Patch
**Auto-merge:** ✅ (after CI passes)

#### Group 2: runtime-patches (Auto-merged patch only)

**Patterns:** All runtime dependencies (excluding dev tools and critical packages)
**Excludes:** Expo, React, React Native, WatermelonDB, Supabase
**Update types:** Patch only
**Auto-merge:** ✅ (after CI passes)

#### Group 3: react-ecosystem (Auto-merged minor/patch)

**Patterns:** `react`, `@types/react`, `react-test-renderer`
**Update types:** Minor + Patch
**Auto-merge:** ✅ (after CI passes)

> **See:** [.github/dependabot.yml](../.github/dependabot.yml) for complete patterns and exclusions

### Ignored Dependencies

**Critical packages locked to specific versions:**

1. **Tailwind CSS v4**: Incompatible with NativeWind v4 (requires NativeWind v5 preview)
2. **React Native**: Locked to Expo SDK version (never upgrade independently)
3. **Expo SDK**: Only patch updates auto-allowed (minor/major require migration guide review)
4. **React Native ecosystem**: Major updates blocked (follow Expo SDK compatibility)

> **See:** [.github/dependabot.yml](../.github/dependabot.yml) for complete ignore rules

### GitHub Actions

**Configuration:**

```yaml
package-ecosystem: 'github-actions'
directory: '/'
schedule:
  interval: 'weekly'
  day: 'monday'
  time: '09:00'
  timezone: 'America/New_York'
open-pull-requests-limit: 3
```

**Auto-merge:** ALL versions (patch, minor, major)
**Rationale:** SHA-pinned actions are secure + non-breaking

---

## Branch Protection Rules

**Branch:** `master`
**Updated:** 2025-01-05

### Required Status Checks

**Strict:** ✅ (Require branches to be up to date before merging)

**Required Checks:**

1. `Code Quality (TypeScript, ESLint, Prettier)`
2. `Unit Tests (Jest)`
3. `Security Scan (npm audit)`

### Other Rules

- **Required linear history:** ✅ (No merge commits)
- **Enforce admins:** ❌ (Admins can bypass)
- **Allow force pushes:** ❌ (Disabled)
- **Allow deletions:** ❌ (Branch cannot be deleted)
- **Required reviews:** ❌ (Not configured)
- **Required signatures:** ❌ (Not configured)

---

## Troubleshooting Guide

### Dependabot PRs Not Auto-Merging

**Symptoms:**

- PRs have `auto-merge` enabled by bot
- All CI checks pass (green)
- PRs stuck in `BLOCKED` or `BEHIND` state

**Diagnosis:**

```bash
# Check PR merge status
gh pr view <PR_NUMBER> --json mergeStateStatus,autoMergeRequest,statusCheckRollup

# Check branch protection
gh api repos/OWNER/REPO/branches/master/protection
```

**Common Causes:**

1. **Obsolete required status checks**

   ```json
   {
     "required_status_checks": {
       "contexts": ["Old Check Name That Doesn't Exist"]
     }
   }
   ```

   **Fix:** Update branch protection with current job names

2. **PR behind master**

   ```json
   {
     "mergeStateStatus": "BEHIND"
   }
   ```

   **Fix:** Rebase PR (comment `@dependabot rebase`)

3. **Merge conflicts**
   ```json
   {
     "mergeStateStatus": "DIRTY"
   }
   ```
   **Fix:** Resolve conflicts manually or close PR (Dependabot will recreate)

### validate-tasks.sh Failures

**Symptom:** Commit blocked with "TASKS.md validation failed"

**Fix:**

```bash
# Option 1: Auto-fix with /task-update (recommended)
/task-update

# Option 2: Bypass validation (if intentional)
git commit --no-verify

# Option 3: Manual fix
# 1. Count completed tasks: grep -c "^- \[x\]" docs/TASKS.md
# 2. Count pending tasks: grep -c "^- \[ \]" docs/TASKS.md
# 3. Update header **Progress**: line with correct counts
```

### check-schema-version.sh Failures

**Symptom:** Commit blocked with "schema.version not incremented"

**Fix:**

```bash
# Option 1: Increment schema version (recommended)
# Edit src/services/database/watermelon/schema.ts
# Change: version: 5
# To: version: 6

# Option 2: Bypass validation (if migration doesn't affect schema)
git commit --no-verify
```

### CI Failures: npm audit

**Symptom:** Security Scan job fails with vulnerabilities

**Diagnosis:**

```bash
# Run locally (same level as CI)
npm audit --audit-level=critical

# Check all vulnerabilities
npm audit
```

**Fix:**

```bash
# Try automatic fix
npm audit fix

# If fix not available
# 1. Check if vulnerability is in dev dependency (low risk)
# 2. Check if patch available (update manually)
# 3. Check if vulnerability exploitable in your use case
# 4. Document decision in commit message if accepting risk
```

---

## Maintenance Checklist

### When Adding New Phases to TASKS.md

**No action required** - `validate-tasks.sh` auto-discovers phases dynamically.

**Test:**

```bash
# Add new phase to TOC
5. [Phase 1: Authentication & Foundation (0/15)]

# Add corresponding header
## Phase 1: Authentication & Foundation (0/15)

# Stage and commit
git add docs/TASKS.md
git commit -m "docs(tasks): Add Phase 1"

# validate-tasks.sh will automatically detect and validate Phase 1
```

### When Changing CI Job Names

**Action required:** Update branch protection rules

**Steps:**

```bash
# 1. Update .github/workflows/ci.yml job names
# 2. Push changes
# 3. Run workflow once to create new check
# 4. Update branch protection
gh api repos/OWNER/REPO/branches/master/protection/required_status_checks \
  -X PATCH \
  -f contexts[]='New Job Name 1' \
  -f contexts[]='New Job Name 2' \
  -F strict=true
```

### When Adding New Workflows

**Action required:** None (unless required for merging)

**Optional:** Add to branch protection if should block merges

---

## References

- [Husky Documentation](https://typicode.github.io/husky/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Configuration Reference](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [npm audit Documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)

---

## AI Agent Instructions

### How to Use This Document

**When modifying TASKS.md:**

1. Read § validate-tasks.sh validation rules
2. Understand task count validation (CRITICAL errors)
3. Understand phase counter validation (WARNING)
4. If adding new phase: No code changes needed (auto-discovered)

**When modifying CI/CD:**

1. Read § GitHub Actions Workflows
2. Update corresponding workflow file (.github/workflows/\*.yml)
3. If changing job names: Update branch protection rules
4. Test locally first: `npm run type-check && npm run lint && npm test`

**When debugging Dependabot:**

1. Read § Dependabot Auto-Merge rules
2. Check PR metadata: `gh pr view <PR> --json ...`
3. Check branch protection: `gh api repos/.../protection`
4. Read § Troubleshooting Guide

**When adding new validation:**

1. Create script in `.husky/` (prefer TypeScript over bash for complex logic)
2. Add call to `.husky/pre-commit` or `.husky/commit-msg`
3. Document in this file (new section under § Git Hooks)
4. Add troubleshooting entry

### Quick Reference

**CI Job Names (must match branch protection):**

1. `Code Quality (TypeScript, ESLint, Prettier)`
2. `Unit Tests (Jest)`
3. `Security Scan (npm audit)`

**Dependabot Auto-Merge Rules:**

- ✅ GitHub Actions: ALL versions
- ✅ Dev dependencies: Minor + Patch
- ✅ Runtime dependencies: Patch + Minor
- 💬 Runtime dependencies: Major (comment only, manual review required)

**Required Status Checks:**

- Branch: `master`
- Strict: ✅ (must be up to date)
- Checks: All 3 CI jobs above
