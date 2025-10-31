# Testing Documentation

**Context:** Modular testing guides for Halterofit (Phase 0.5.28 refactor)
**Purpose:** Developer-friendly testing documentation (complements AI-optimized test READMEs)
**Audience:** Human developers + AI agents

## Navigation

### Quick Start

- **Just Want to Run Tests?** → [Unit Testing Guide](./unit-guide.md#running-tests)
- **Writing First Test?** → [Unit Testing Guide](./unit-guide.md#writing-tests)
- **Manual E2E Testing?** → [Manual E2E Guide](./e2e-manual.md)
- **Need to Mock Something?** → [Mocking Patterns](./mocks-guide.md)

### By Test Type

| Test Type       | Doc                                | Status       | Coverage                  |
| --------------- | ---------------------------------- | ------------ | ------------------------- |
| **Unit Tests**  | [unit-guide.md](./unit-guide.md)   | ✅ Active    | 60-65% database layer     |
| **Manual E2E**  | [e2e-manual.md](./e2e-manual.md)   | 🚧 Phase 1   | Sync protocol validation  |
| **Maestro E2E** | [e2e-maestro.md](./e2e-maestro.md) | 📅 Phase 3+  | Automation (future)       |
| **Mocking**     | [mocks-guide.md](./mocks-guide.md) | ✅ Reference | Native modules + services |

### By Role

**I'm a Developer Writing Unit Tests:**

1. Read [Unit Testing Guide](./unit-guide.md)
2. Reference [Mocking Patterns](./mocks-guide.md) for external dependencies
3. Use helpers from [tests/support/database/](../../tests/support/database/)

**I'm QA Testing Sync Protocol:**

1. Read [Manual E2E Guide](./e2e-manual.md)
2. Follow checklists in [tests/e2e/manual/](../../tests/e2e/manual/)
3. Document results in GitHub issues

**I'm Setting Up E2E Automation:**

1. Read [Maestro E2E Guide](./e2e-maestro.md)
2. Install Maestro CLI
3. Create YAML flows in [tests/e2e/maestro/](../../tests/e2e/maestro/)

## Testing Philosophy

### Three-Tier Strategy

```
┌─────────────────────────────────────────────────────────────┐
│ Unit Tests (Jest + LokiJS)                                  │
│ ✅ Active: 37 tests passing                                 │
│ 📍 Coverage: 60-65% database layer                          │
│ ⚡ Fast: ~50-100ms per test                                 │
│ 🎯 What: CRUD, queries, relationships                       │
│ ❌ Cannot: Test sync protocol (_changed, _status)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Manual E2E Tests (Expo Dev Build)                           │
│ 🚧 Phase 1: Manual checklists                               │
│ 📍 Environment: Real device + SQLite + JSI                  │
│ ⚡ Slow: ~15-20 min per checklist                           │
│ 🎯 What: Sync protocol, migrations, offline CRUD            │
│ ✅ Can: Test EVERYTHING (real environment)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Maestro E2E Tests (YAML automation)                         │
│ 📅 Phase 3+: Future automation                              │
│ 📍 Environment: Real device + Maestro Cloud                 │
│ ⚡ Moderate: ~2-5 min per flow                              │
│ 🎯 What: Complete user journeys (create → sync → verify)    │
│ ✅ Can: Automate validated manual tests                     │
└─────────────────────────────────────────────────────────────┘
```

### Key Principle: Progressive Validation

1. **Unit Tests (Fast Feedback)**
   - Run on every commit (pre-commit hook)
   - Catch regressions immediately
   - Test individual functions/models

2. **Manual E2E (Validate Unknown)**
   - Run before major releases
   - Discover edge cases
   - Learn what to automate

3. **Maestro E2E (Automate Known)**
   - Run on CI/CD (PR + main branch)
   - Prevent regressions in critical flows
   - Save QA time on repetitive tests

## Testing Infrastructure

### Test Helpers ([tests/support/](../../tests/support/))

- **Database:** [tests/support/database/README.md](../../tests/support/database/README.md)
  - `test-database.ts` - LokiJS setup
  - `factories.ts` - Test data generators
  - `assertions.ts` - Query/sync/time utilities

### Test Fixtures ([tests/fixtures/](../../tests/fixtures/))

- **Database:** [tests/fixtures/database/](../../tests/fixtures/database/) - Sample workouts/exercises
- **Users:** [tests/fixtures/users/](../../tests/fixtures/users/) - Test user personas

### Mocks ([**mocks**/](../../__mocks__/))

- **Native Modules:** expo-asset, react-native-mmkv
- **Services:** @supabase/supabase-js

### E2E Tests ([tests/e2e/](../../tests/e2e/))

- **Manual:** [tests/e2e/manual/](../../tests/e2e/manual/) - Phase 1 checklists
- **Maestro:** [tests/e2e/maestro/](../../tests/e2e/maestro/) - Phase 3+ automation

## Test Coverage

### Current Coverage (Phase 0.5)

**Database Layer: 60-65%**

- ✅ CRUD operations (create, read, update, delete)
- ✅ Queries (filtering, sorting, pagination)
- ✅ Relationships (workout → exercises → sets)
- ✅ Timestamps (created_at, updated_at)
- ❌ Sync protocol (\_changed, \_status) - **Manual E2E only**

**Models Tested:**

- ✅ Workout (15 tests)
- ✅ Exercise (10 tests)
- ✅ ExerciseSet (12 tests)
- 🚧 WorkoutExercise (TODO - Phase 0.5.29)
- 🚧 User (TODO - Phase 0.5.29)

### Coverage Goals

**Phase 0.5 (Foundation) - CURRENT:**

- Target: 60-65% database layer
- Status: ✅ Achieved (37 tests)

**Phase 1 (Manual E2E):**

- Target: Sync protocol validated manually
- Status: 🚧 In progress (checklists ready)

**Phase 2 (Component Tests):**

- Target: 70-80% UI components
- Status: 📅 Planned (Q2 2025)

**Phase 3+ (E2E Automation):**

- Target: Critical user flows automated
- Status: 📅 Planned (Q3 2025)

## Running Tests

### Quick Commands

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- workouts.test.ts

# Run with coverage
npm test -- --coverage

# Type check (run before commit)
npm run type-check

# Lint check
npm run lint

# Format check
npm run format:check
```

### Pre-Commit Checklist

```bash
# 1. Type check
npm run type-check

# 2. Run tests
npm test

# 3. Lint
npm run lint:fix

# 4. Format
npm run format

# 5. Commit (use /commit slash command for smart commits)
/commit
```

## Troubleshooting

### Common Issues

#### "Cannot find module '@tests/support/database/...'"

**Cause:** `@tests` alias not configured in jest.config.js
**Fix:** Verify `moduleNameMapper` in jest.config.js:

```javascript
moduleNameMapper: {
  '^@tests/(.*)': '<rootDir>/tests/$1',
}
```

#### "LokiJS: Table not found"

**Cause:** Database not initialized in test
**Fix:** Ensure `createTestDatabase()` called in beforeEach:

```typescript
beforeEach(() => {
  database = createTestDatabase();
  resetTestIdCounter();
});
```

#### "Test passes but sync protocol doesn't work in prod"

**Cause:** LokiJS cannot test sync protocol
**Fix:** Add manual E2E test to validate sync:

```markdown
<!-- tests/e2e/manual/sync-checklist.md -->

- [ ] Create workout
- [ ] Sync (Settings → Sync Now)
- [ ] Verify in Supabase dashboard
```

#### "Mock not being used"

**Cause:** Mock file location incorrect
**Fix:** Ensure mock at `__mocks__/module-name.js` (exact match)

## Decision Records

### Why Three-Tier Testing?

**Question:** Why not just E2E tests for everything?

**Answer:** Speed vs Confidence Trade-off

**Unit Tests:**

- ✅ Fast: 37 tests run in ~5 seconds
- ✅ Focused: Test one function at a time
- ❌ Limited: Cannot test sync protocol

**Manual E2E:**

- ✅ Complete: Tests real environment
- ✅ Flexible: Can test anything
- ❌ Slow: 15-20 min per checklist
- ❌ Manual: Requires human execution

**Maestro E2E:**

- ✅ Automated: Run on CI/CD
- ✅ Reliable: Real device testing
- ❌ Setup cost: Initial investment
- ❌ Maintenance: Flows break on UI changes

**Strategy:** Use all three in progression (unit → manual E2E → automated E2E)

### Why Jest + LokiJS (not Real SQLite)?

**Question:** Why not test with real SQLite in Jest?

**Answer:** SQLite Requires React Native JSI (not available in Node.js)

**Reasoning:**

1. Jest runs in Node.js (not React Native environment)
2. SQLite adapter requires React Native JSI (JavaScript Interface)
3. LokiJS is in-memory, works in Node.js
4. Production uses SQLite, tests use LokiJS (adapter pattern)

**Limitation:** LokiJS cannot test sync protocol (\_changed, \_status)
**Mitigation:** Manual E2E tests on real device with real SQLite

## Cross-References

### Test Infrastructure

- **Test Root:** [tests/README.md](../../tests/README.md) - Architecture overview
- **Database Helpers:** [tests/support/database/README.md](../../tests/support/database/README.md)
- **Fixtures:** [tests/fixtures/README.md](../../tests/fixtures/README.md)
- **Mocks:** [**mocks**/README.md](../../__mocks__/README.md)
- **E2E Strategy:** [tests/e2e/README.md](../../tests/e2e/README.md)

### Project Docs

- **Database Guide:** [docs/DATABASE.md](../DATABASE.md) - WatermelonDB setup
- **Architecture:** [docs/ARCHITECTURE.md](../ARCHITECTURE.md) - Code structure
- **Technical Decisions:** [docs/TECHNICAL.md](../TECHNICAL.md) - ADRs
- **Contributing:** [docs/CONTRIBUTING.md](../CONTRIBUTING.md) - Development workflow

## Resources

**Jest:**

- Official Docs: https://jestjs.io/
- React Native Testing: https://jestjs.io/docs/tutorial-react-native
- Mocking: https://jestjs.io/docs/mock-functions

**WatermelonDB:**

- Testing Guide: https://nozbe.github.io/WatermelonDB/Advanced/Testing.html
- Sync Protocol: https://nozbe.github.io/WatermelonDB/Advanced/Sync.html

**Maestro:**

- Getting Started: https://maestro.mobile.dev/getting-started
- React Native: https://maestro.mobile.dev/platform-support/react-native
- YAML Reference: https://maestro.mobile.dev/api-reference/commands

**React Native Testing Library:**

- Docs: https://callstack.github.io/react-native-testing-library/
- Cheatsheet: https://testing-library.com/docs/react-testing-library/cheatsheet
