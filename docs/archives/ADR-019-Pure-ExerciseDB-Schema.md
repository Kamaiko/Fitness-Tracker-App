# ADR-019: Pure ExerciseDB Schema (No Analytics Fields)

**Date:** 2025-02-03
**Status:** ✅ Accepted
**Supersedes:** ADR-018 (partially - removes Halterofit-specific fields)
**Deciders:** Patrick Patenaude (Product Owner), Claude (Technical Advisor)
**Phase:** 0.6 - UI/UX Foundation (ExerciseDB Import Planning)

---

## Context

During ExerciseDB import planning (Phase 0.6, Task 0.6.8), we initially aligned the exercises schema with ExerciseDB nomenclature (ADR-018) but retained two "Halterofit-specific" fields for future analytics:

- `movement_pattern: 'compound' | 'isolation'`
- `difficulty: 'beginner' | 'intermediate' | 'advanced'`

These fields were intended for:

- Context-aware analytics (compound exercises = higher fatigue)
- UI filters ("Show only beginner exercises")
- Personalized recommendations

However, upon deeper review, we identified these fields as **premature optimization** and **YAGNI violations** (You Aren't Gonna Need It).

---

## Decision

**Remove ALL Halterofit-specific fields from the exercises table.**

The exercises schema will now contain **ONLY the 14 fields provided by ExerciseDB**, achieving true 1:1 mapping with zero custom logic.

### Final Exercise Schema (14 Fields - Pure ExerciseDB)

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY,

  -- ExerciseDB fields (1:1 mapping)
  exercisedb_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  body_parts JSONB NOT NULL,           -- ["Chest", "Shoulders"]
  target_muscles JSONB NOT NULL,       -- ["Pectoralis Major"]
  secondary_muscles JSONB NOT NULL,    -- ["Triceps", "Deltoids"]
  equipments JSONB NOT NULL,           -- ["Barbell", "Bench"]
  exercise_type TEXT NOT NULL,         -- "weight_reps" | "cardio" | "duration" | "stretching"
  instructions JSONB NOT NULL,         -- ["Step 1...", "Step 2..."]
  exercise_tips JSONB NOT NULL,        -- ["Keep elbows tucked...", "Control descent..."]
  variations JSONB NOT NULL,           -- ["Incline bench press", "Dumbbell press"]
  overview TEXT,                       -- "Compound chest exercise..."
  image_url TEXT,                      -- URL to exercise image
  video_url TEXT,                      -- URL to exercise video
  keywords JSONB NOT NULL,             -- ["chest", "barbell", "pressing"]

  -- Timestamps
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,

  -- Sync protocol
  _changed BIGINT NOT NULL,
  _status TEXT
);
```

**Removed fields:**

- ❌ `movement_pattern` (compound/isolation)
- ❌ `difficulty` (beginner/intermediate/advanced)

---

## Rationale

### 1. YAGNI Principle

**"You Aren't Gonna Need It"**

- Neither `movement_pattern` nor `difficulty` are used in MVP (Phases 0-2)
- Analytics features (Phase 4) are 12+ weeks away
- Requirements may change based on beta user feedback
- Building features before validation = wasted effort

### 2. Zero Mapping Logic

**Before (ADR-018):**

```typescript
// Import script needs custom logic
const movementPattern = deriveMovementPattern(exercise); // ← Custom logic
const difficulty = deriveDifficulty(exercise); // ← Custom logic

await db.insert({
  ...exerciseDBData,
  movement_pattern: movementPattern,
  difficulty: difficulty,
});
```

**After (ADR-019 - This Decision):**

```typescript
// Import script = pure passthrough
await db.insert(exerciseDBData); // ← Zero transformation
```

**Impact:**

- Faster import (no derivation logic)
- Fewer bugs (no custom mapping errors)
- Simpler maintenance (ExerciseDB = single source of truth)

### 3. Analytics Can Derive At Query-Time

If analytics features ARE validated in Phase 4, we can derive these fields dynamically:

**Movement Pattern (compound vs isolation):**

```typescript
// Runtime derivation (no DB field needed)
const movementPattern = exercise.bodyParts.length > 1 ? 'compound' : 'isolation';
// OR
const movementPattern = exercise.targetMuscles.length > 2 ? 'compound' : 'isolation';
```

**Difficulty:**

```typescript
// Runtime derivation based on equipments
const difficulty = exercise.equipments.includes('body weight')
  ? 'beginner'
  : exercise.equipments.includes('barbell')
    ? 'intermediate'
    : 'intermediate'; // default
```

**Advantages of runtime derivation:**

- No database storage needed
- Logic can evolve without migrations
- Different derivation strategies can be A/B tested

### 4. Simplicity > Premature Optimization

**Complexity Cost of Halterofit Fields:**

- SQL migration to add columns
- WatermelonDB schema update (version bump)
- Import script derivation logic (compound/isolation classification)
- Test data factories need to generate these fields
- Documentation overhead
- Maintenance burden (what if ExerciseDB adds their own difficulty field?)

**Benefit:**

- Hypothetical analytics features 12+ weeks away
- Zero users requesting these features (pre-MVP)
- Unknown if logic will even be correct

**Conclusion:** Cost >> Benefit → Remove fields

### 5. ExerciseDB Already Provides Rich Data

The 14 ExerciseDB fields provide sufficient data for MVP and beyond:

- `body_parts` → Filter by anatomy ("chest exercises")
- `target_muscles` → Precise muscle targeting
- `secondary_muscles` → Load management analytics
- `equipments` → Filter by available equipment
- `exercise_type` → Distinguish strength vs cardio
- `keywords` → Powerful search capability

Adding custom fields dilutes this richness with guesswork.

---

## Consequences

### ✅ Positive

1. **Simpler Import Script**
   - Pure 1:1 passthrough from ExerciseDB → Supabase
   - No derivation logic = fewer bugs
   - Faster import execution

2. **Cleaner Schema**
   - 14 fields instead of 16
   - Every field has ExerciseDB documentation
   - Zero "magic" custom fields

3. **Easier Maintenance**
   - Quarterly ExerciseDB re-imports = trivial
   - No need to backfill custom fields
   - Single source of truth (ExerciseDB)

4. **Flexibility**
   - Analytics requirements validated with users first
   - Derivation logic can evolve without migrations
   - Can add fields later if truly needed (Phase 4+)

5. **Philosophical Alignment**
   - YAGNI principle (build features when needed)
   - Lean MVP (minimum viable product)
   - Data-driven decisions (validate with beta users first)

### ⚠️ Potential Drawbacks

1. **No Pre-Computed Fields**
   - If Phase 4 analytics DO need movement_pattern, must derive at query-time
   - Mitigation: Modern databases handle this easily, negligible performance impact

2. **UI Filters**
   - Can't filter "Show beginner exercises" directly from DB
   - Mitigation: Derive client-side or use ExerciseDB fields (e.g., filter by `equipments`)

3. **Future Migration**
   - If fields ARE needed in Phase 4+, require migration + backfill
   - Mitigation: Simple ALTER TABLE + UPDATE with derivation logic

**Net Impact:** Positive. Drawbacks are hypothetical; benefits are immediate.

---

## Alternatives Considered

### A. Keep Halterofit Fields (ADR-018 Approach)

**Rejected because:**

- Violates YAGNI (not needed in MVP)
- Adds complexity to import script
- Requires custom derivation logic
- May be incorrect (guessing compound/isolation)
- Maintenance burden for quarterly re-imports

### B. Partial Removal (Keep `difficulty`, Remove `movement_pattern`)

**Rejected because:**

- Inconsistent approach (why keep one but not the other?)
- Difficulty is even less critical than movement_pattern
- ExerciseDB doesn't provide difficulty → still requires guesswork

### C. Pure ExerciseDB Schema (CHOSEN - This ADR)

**Accepted because:**

- ✅ Simplest solution (YAGNI)
- ✅ Zero custom logic
- ✅ True 1:1 mapping with ExerciseDB
- ✅ Flexible for future evolution
- ✅ Validates requirements with users first

---

## Implementation

### Changes Required

1. **SQL Migration** (`supabase/migrations/20251104000000_remove_halterofit_specific_fields.sql`)

   ```sql
   ALTER TABLE public.exercises DROP COLUMN movement_pattern;
   ALTER TABLE public.exercises DROP COLUMN difficulty;
   DROP INDEX IF EXISTS idx_exercises_movement_pattern;
   ```

2. **WatermelonDB Schema** (`src/services/database/watermelon/schema.ts`)
   - Remove `{ name: 'movement_pattern', type: 'string', isIndexed: true }`
   - Remove `{ name: 'difficulty', type: 'string' }`

3. **Exercise Model** (`src/services/database/watermelon/models/Exercise.ts`)
   - Remove `@field('movement_pattern') movementPattern!: ...`
   - Remove `@field('difficulty') difficulty!: ...`

4. **TypeScript Types** (`src/services/database/types.ts`)
   - Remove `movement_pattern: 'compound' | 'isolation';`
   - Remove `difficulty: 'beginner' | 'intermediate' | 'advanced';`

5. **Test Updates**
   - Update test factories to remove these fields
   - Update test assertions to not check these fields

6. **Documentation**
   - Update ADR-018 to note superseded fields
   - Update ExerciseDB-Import-QA.md to reflect final schema

### Migration Path (If Fields Needed in Phase 4+)

```sql
-- Step 1: Add columns
ALTER TABLE exercises
  ADD COLUMN movement_pattern TEXT,
  ADD COLUMN difficulty TEXT;

-- Step 2: Backfill with derivation logic
UPDATE exercises SET
  movement_pattern = CASE
    WHEN jsonb_array_length(body_parts) > 1 THEN 'compound'
    ELSE 'isolation'
  END,
  difficulty = CASE
    WHEN equipments @> '["body weight"]' THEN 'beginner'
    WHEN equipments @> '["barbell"]' THEN 'intermediate'
    ELSE 'intermediate'
  END;

-- Step 3: Add constraints
ALTER TABLE exercises
  ALTER COLUMN movement_pattern SET NOT NULL,
  ALTER COLUMN difficulty SET NOT NULL;
```

**Effort:** ~2 hours (if truly needed in Phase 4+)

---

## Success Criteria

### Phase 0-3 (MVP)

- [x] Import script has zero custom derivation logic
- [x] Schema contains only ExerciseDB fields
- [x] Type-check and tests pass
- [ ] ExerciseDB import completes successfully (1,300+ exercises)

### Phase 4+ (Analytics Validation)

IF beta users request:

- "Filter by compound/isolation exercises"
- "Show only beginner exercises"
- "Analytics need movement pattern classification"

THEN:

- ✅ Implement runtime derivation OR
- ✅ Add fields via migration (backfill with logic)

IF beta users DON'T request these features:

- ✅ Decision validated: YAGNI was correct
- ✅ Avoided wasted engineering effort

---

## Related Decisions

- **ADR-017:** No Custom Exercises in MVP (read-only library)
- **ADR-018:** Align Exercise Schema with ExerciseDB (initial approach with Halterofit fields)
- **ADR-019 (This):** Pure ExerciseDB Schema (removes Halterofit fields from ADR-018)

---

## References

- YAGNI Principle: https://martinfowler.com/bliki/Yagni.html
- Lean MVP: https://leanstack.com/minimum-viable-product/
- ExerciseDB API: https://github.com/ExerciseDB/exercisedb-api

---

**Decision Date:** 2025-02-03
**Implemented:** 2025-02-03
**Last Updated:** 2025-02-03
