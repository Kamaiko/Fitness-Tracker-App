# Dependency Overrides

> **Purpose**: Document npm package overrides and their rationale
> **Last Updated**: 2025-11-06

---

## Overview

This project uses npm `overrides` in `package.json` to resolve peer dependency conflicts. This file documents each override and when it can be removed.

## Current Overrides

### 1. `@babel/runtime` → `^7.26.10`

**Why**: Expo SDK 54 compatibility fix
**Added**: Phase 0.5
**Can remove when**: Already at latest stable version, keep indefinitely

---

### 2. `@nozbe/with-observables` → Force React 19 Types

```json
"@nozbe/with-observables": {
  "react": "$react",
  "@types/react": "$@types/react"
}
```

**Why**:

- `@nozbe/with-observables@1.6.0` (published 2023-06-12) only declares peer dependency support for React 16-18
- Our project uses React 19.2.0
- Without this override, npm throws `ERESOLVE unable to resolve dependency tree` error
- The package actually works fine with React 19 - it's just the peer dependency declaration that's outdated

**Impact**:

- ✅ Zero runtime impact - package works correctly with React 19
- ✅ WatermelonDB observables fully functional
- ⚠️ Bypasses npm's peer dependency validation for this specific package

**Can remove when**:

1. Check for newer versions: `npm view @nozbe/with-observables versions`
2. If a version `>1.6.0` adds React 19 support in peer deps, update and remove override
3. Alternatively, if WatermelonDB team releases update to `@nozbe/with-observables`

**Tracking**:

- Package last updated: 2023-06-12 (2+ years old)
- Check quarterly for updates

---

## Alternative Approaches (Not Used)

### ❌ `.npmrc` with `legacy-peer-deps=true`

**Why not used**:

- Too broad - affects ALL packages, not just the problematic one
- Hidden - not visible in package.json
- Can mask real dependency problems
- Harder to track and remove later

### ❌ `--legacy-peer-deps` flag

**Why not used**:

- Requires every developer to remember the flag
- CI/CD needs special configuration
- Not declarative

### ✅ `overrides` (Current approach)

**Why preferred**:

- Surgical - targets only the specific package
- Visible in package.json
- Works automatically for all developers and CI/CD
- Self-documenting with this file

---

## 📦 Deprecated Dependencies (Transitive)

These warnings appear during `npm install` but are **low priority** - they come from indirect dependencies we don't control directly.

### Current Warnings (2025-11-06)

| Package              | Used By                           | Impact                             | When Fixed                         |
| -------------------- | --------------------------------- | ---------------------------------- | ---------------------------------- |
| `inflight@1.0.6`     | Jest 29 (via glob@7)              | 🟡 Minor memory leak in tests only | When jest-expo migrates to Jest 30 |
| `rimraf@3.0.2`       | Expo CLI (chromium-edge-launcher) | 🟡 Outdated API                    | Expo SDK 55+ update                |
| `glob@7.2.3`         | Jest 29, Expo CLI                 | 🟡 Outdated version                | Auto-fixed with above              |
| `abab@2.0.6`         | jsdom@20 (test env)               | 🟢 None (tests only)               | jsdom v21+                         |
| `domexception@4.0.0` | jsdom@20 (test env)               | 🟢 None (tests only)               | jsdom v21+                         |

### 🎯 Action Plan

**Phase 0-1 (Now)**: ✅ Document and ignore

- No security vulnerabilities (`npm audit` clean)
- Only affect dev/test environment
- Will be fixed upstream automatically

**Phase 2+**: Monitor for updates

- Check after Expo SDK 55+ release
- Check after jest-expo updates to Jest 30

**DO NOT**:

- ❌ Force override transitive dependencies (dangerous)
- ❌ Manually update indirect dependencies (breaks compatibility)

---

## How to Test Overrides

When modifying overrides:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Verify no peer dependency warnings
npm ls --depth=0

# 3. Run type checking
npm run type-check

# 4. Run tests
npm test
```

---

## Maintenance Checklist

**Quarterly Review** (every 3 months):

- [ ] Check for updates: `npm outdated`
- [ ] Check `@nozbe/with-observables` for new versions
- [ ] Test removing overrides one by one
- [ ] Update this document if changes made

**Before Major Upgrades** (React, Expo SDK, etc.):

- [ ] Review all overrides
- [ ] Test compatibility
- [ ] Update or remove obsolete overrides
