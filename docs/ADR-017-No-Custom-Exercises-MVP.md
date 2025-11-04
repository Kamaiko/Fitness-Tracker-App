# ADR-017: Read-Only Exercise Library (No Custom Exercises in MVP)

**Date:** 2025-02-03
**Status:** ✅ ACCEPTED
**Scope:** Phase 0.6 (Task 0.6.8)

---

## Decision

MVP will use ExerciseDB exercises as **read-only library**. Custom user exercises deferred to Phase 3+ based on beta user feedback.

---

## Context

Initial architecture (schema + sync protocol) included ability for users to create custom exercises:

- `is_custom` field to distinguish system vs user exercises
- `created_by` field for ownership
- RLS policies for custom exercise access
- Sync logic to push/pull custom exercises between devices

After strategic analysis with product owner, decided to simplify MVP scope.

---

## Rationale

### ✅ Why Remove Custom Exercises from MVP

1. **Sufficient Coverage**
   - ExerciseDB provides 1,300+ exercises
   - Covers all major muscle groups, equipment types, and movement patterns
   - Sufficient for serious bodybuilders (target users)

2. **Focus on Core Value Proposition**
   - Our differentiation: Context-aware analytics, plateau detection
   - Custom exercises are NOT our unique value
   - Better to perfect analytics than half-bake features

3. **Simplified Architecture**
   - Remove `is_custom`, `created_by` fields
   - Remove custom exercise RLS policies
   - Remove custom exercise sync logic from `pull_changes()`
   - ~500 lines of code eliminated

4. **Faster MVP Delivery**
   - Less code to write/test/maintain
   - Faster iteration on core features
   - Earlier beta launch

5. **Validate Need with Users First**
   - Unknown if users truly need custom exercises
   - Beta users will tell us via feedback
   - Can add in Phase 3+ if validated

---

## Implementation

### Database Schema Changes

**BEFORE** (with custom exercises):

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY,
  exercisedb_id TEXT UNIQUE,
  name TEXT NOT NULL,
  -- ... exercise data fields
  is_custom BOOLEAN NOT NULL DEFAULT false,  -- ❌ REMOVE
  created_by UUID REFERENCES users(id),      -- ❌ REMOVE
  -- ... timestamps
);
```

**AFTER** (simplified):

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY,
  exercisedb_id TEXT UNIQUE NOT NULL,  -- All exercises from ExerciseDB
  name TEXT NOT NULL,
  -- ... exercise data fields (read-only)
  -- ... timestamps
);
```

### RLS Policies

**BEFORE** (complex):

```sql
-- Users can view system exercises OR their own custom
CREATE POLICY "Users can view exercises"
  ON exercises FOR SELECT
  USING (is_custom = false OR created_by = auth.uid());

-- Users can create custom exercises
CREATE POLICY "Users can create custom exercises"
  ON exercises FOR INSERT
  WITH CHECK (is_custom = true AND created_by = auth.uid());
```

**AFTER** (simplified):

```sql
-- All exercises are public read-only
CREATE POLICY "Anyone can view exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- NO INSERT/UPDATE/DELETE policies (read-only)
```

### Sync Protocol

**BEFORE** (pull custom exercises):

```sql
'exercises', json_build_object(
  'created', (SELECT * FROM exercises WHERE is_custom = true AND created_by = current_user_id)
)
```

**AFTER** (no exercise sync):

```sql
-- Exercises NOT included in pull_changes() at all
-- They are seeded locally from bundle, not synced
```

---

## User Experience

### What Users CAN Do

✅ Select from 1,300+ exercises (instant local search)
✅ View exercise details (GIF, instructions, muscle groups)
✅ Add exercises to workouts
✅ Log sets with weight/reps/RIR/RPE
✅ Add notes to workout_exercises (e.g., "used wide grip")

### What Users CANNOT Do (MVP Limitation)

❌ Create custom exercises
❌ Rename exercises
❌ Modify exercise data (instructions, muscle groups, etc.)

### Mitigation for Missing Exercises

If user needs an exercise not in ExerciseDB:

1. Choose closest match from library
2. Add note in workout: _"Using cable crossover (45° variant)"_
3. Track normally with sets/weights
4. Provide feedback → we evaluate for Phase 3

---

## Future-Proofing (Phase 3+)

IF beta users validate need for custom exercises:

### Step 1: Database Migration

```sql
ALTER TABLE exercises
  ADD COLUMN is_custom BOOLEAN DEFAULT false,
  ADD COLUMN created_by UUID REFERENCES users(id);

-- Backfill: All existing exercises are system
UPDATE exercises SET is_custom = false WHERE is_custom IS NULL;
```

### Step 2: Update RLS Policies

```sql
-- Users can view system + their own custom
CREATE POLICY "Users can view exercises" ...

-- Users can create/update/delete their custom exercises
CREATE POLICY "Users can manage custom exercises" ...
```

### Step 3: Update Sync Protocol

```sql
-- Add custom exercises to pull_changes()
'exercises', json_build_object(
  'created', (SELECT * FROM exercises WHERE is_custom = true AND created_by = current_user_id)
)
```

### Step 4: UI Implementation

- Add "Create Custom Exercise" button in Exercise Library
- Form: name, muscle groups, instructions, equipment
- Validation + save to WatermelonDB
- Auto-sync to Supabase (multi-device)

**Effort Estimate:** ~8-12 hours (Phase 3, Task 3.X)

---

## Alternatives Considered

### Option 1: Include Custom in MVP

- ❌ Rejected: Adds complexity without validating need
- ❌ Delays MVP delivery
- ❌ More code to maintain if feature unused

### Option 2: Allow Renaming Exercises

- ❌ Rejected: Creates sync confusion (different names on different devices)
- ❌ Breaks analytics (exercise name no longer unique identifier)

### Option 3: Notes-Only Approach

- ✅ Accepted: Users can add context via `workout_exercises.notes`
- ✅ Simple, flexible, no schema changes
- ✅ Covers 80% of custom exercise use cases

---

## Trade-offs

### Advantages

✅ **Simpler architecture** (~500 lines code removed)
✅ **Faster MVP delivery** (less to build/test)
✅ **Lower maintenance** (fewer edge cases)
✅ **Validate need first** (data-driven decision for Phase 3)
✅ **Better focus** (core value: analytics, not exercise CRUD)

### Disadvantages

⚠️ **Some users may need missing exercises**

- Mitigation: Notes + feedback → Phase 3 evaluation

⚠️ **Potential user frustration**

- Mitigation: Clear communication in onboarding
- "1,300+ exercises covering all major movements"

⚠️ **Competitor feature gap** (Strong, Hevy allow custom)

- Mitigation: Our value is analytics, not exercise library

---

## Success Criteria

### MVP Launch (Phase 2-3)

- [ ] No user requests custom exercises in first 50 beta users
- [ ] <5% of feedback mentions "missing exercise X"
- [ ] Users successfully use notes for variations

### Re-evaluation (Post-Beta)

IF ≥20% beta users request custom exercises:

- ✅ Validate need → Schedule for Phase 3
- ✅ Implement migration path (outlined above)

IF <10% beta users request custom exercises:

- ✅ Keep simplified architecture
- ✅ Custom exercises remain deferred

---

## References

- Product Requirements: [PRD.md § Exercise Library](../PRD.md)
- Database Schema: [DATABASE.md](./DATABASE.md)
- Related ADR: [ADR-013: ExerciseDB API Integration](./TECHNICAL.md#adr-013-exercisedb-api-integration)

---

## Decision Makers

**Product Owner:** Patrick Patenaude
**Technical Lead:** Claude (AI Assistant)
**Decision Date:** 2025-02-03

**Q&A Session:**

- Q1: Why remove? → A: 1,300+ ExerciseDB exercises sufficient
- Q2: Edge cases? → A: Use notes, evaluate in Phase 3 based on feedback
- Q3: Naming? → A: Fixed from ExerciseDB (no custom renaming)
- Q4: Beta validation? → A: Will validate need with actual users first
