# ADR-018: Align Exercise Schema with ExerciseDB Nomenclature

**Date:** 2025-02-03
**Status:** ✅ Accepted (Partially Superseded by ADR-019)
**Deciders:** Patrick Patenaude (Product Owner), Claude (Technical Advisor)
**Phase:** 0.5 - Architecture & Foundation

---

## Context

During ExerciseDB integration planning (Phase 0.6), we identified significant misalignment between our current database schema and ExerciseDB's data structure. Our placeholder schema used custom field names (`muscle_groups`, `category`, `equipment`) that don't match ExerciseDB's nomenclature (`bodyParts`, `targetMuscles`, `exerciseType`, `equipments`).

### Current Schema Problems

1. **Semantic Confusion:**
   - Our `muscle_groups` → ExerciseDB has BOTH `bodyParts` (anatomy) AND `targetMuscles` (specific muscles)
   - Our `category` (compound/isolation) → ExerciseDB doesn't have this concept
   - Our `equipment` (singular) → ExerciseDB uses `equipments` (plural array)

2. **Missing Valuable Data:**
   - No `videoUrl` field (ExerciseDB provides exercise videos)
   - No `exerciseTips` field (safety and technique recommendations)
   - No `variations` field (alternative exercise versions)
   - No `secondaryMuscles` field (supporting muscles for analytics)
   - No `overview` field (descriptive summary)
   - No `keywords` field (search optimization)

3. **Import/Sync Complexity:**
   - Complex mapping logic required during import
   - Field name translations needed
   - Data transformation overhead
   - Maintenance burden for quarterly re-imports

### Why Now?

- **Phase 0.5 (6% complete):** Optimal time for architectural changes
- **Pre-import:** No ExerciseDB data loaded yet
- **37 tests:** Manageable test update scope
- **No production users:** Zero user impact

---

## Decision

**⚠️ UPDATE (2025-02-03):** This ADR is partially superseded by [ADR-019](./ADR-019-Pure-ExerciseDB-Schema.md). The Halterofit-specific fields (`movement_pattern` and `difficulty`) described below have been removed. The exercises table now contains ONLY the 14 ExerciseDB fields for true 1:1 mapping.

**We will refactor the `exercises` table schema to match ExerciseDB nomenclature exactly**, while adding Halterofit-specific fields only where necessary for our unique analytics features.

### New Schema Structure

**Adopt from ExerciseDB (1:1 mapping):**

- `exercisedb_id` → `exerciseId` (keep our name for clarity)
- `name` → `name` ✅
- `body_parts` → `bodyParts` (JSON array: anatomical regions)
- `target_muscles` → `targetMuscles` (JSON array: primary muscles)
- `secondary_muscles` → `secondaryMuscles` (JSON array: supporting muscles)
- `equipments` → `equipments` (JSON array: required equipment)
- `exercise_type` → `exerciseType` ("weight_reps" | "cardio" | "duration" | "stretching")
- `instructions` → `instructions` (JSON array: step-by-step)
- `exercise_tips` → `exerciseTips` (JSON array: safety/technique) **NEW**
- `variations` → `variations` (JSON array: exercise alternatives) **NEW**
- `overview` → `overview` (string: descriptive summary) **NEW**
- `image_url` → `imageUrl` (string: exercise image)
- `video_url` → `videoUrl` (string: exercise video) **NEW**
- `keywords` → `keywords` (JSON array: search terms) **NEW**

**Halterofit-specific fields (analytics):**

- `movement_pattern` (string: "compound" | "isolation") - Derived from ExerciseDB data
- `difficulty` (string: "beginner" | "intermediate" | "advanced") - Assigned during import

### Field Renaming Summary

| Old Field Name   | New Field Name                                        | Type Change         | Rationale                                                    |
| ---------------- | ----------------------------------------------------- | ------------------- | ------------------------------------------------------------ |
| `muscle_groups`  | `body_parts` + `target_muscles` + `secondary_muscles` | Split into 3 fields | ExerciseDB separates anatomy, primary, and secondary muscles |
| `category`       | `movement_pattern`                                    | Rename              | Avoid confusion with `exerciseType`                          |
| `primary_muscle` | `target_muscles[0]`                                   | Removed (redundant) | First element of `target_muscles` array                      |
| `equipment`      | `equipments`                                          | Singular → Plural   | ExerciseDB uses array for multiple equipment                 |
| `exercise_type`  | `exercise_type`                                       | Values changed      | Adopt ExerciseDB values ("weight_reps" vs "strength")        |
| N/A              | `video_url`                                           | Added               | ExerciseDB provides exercise videos                          |
| N/A              | `exercise_tips`                                       | Added               | Safety and technique guidance                                |
| N/A              | `variations`                                          | Added               | Alternative exercise versions                                |
| N/A              | `secondary_muscles`                                   | Added               | Supporting muscles for analytics                             |
| N/A              | `overview`                                            | Added               | Descriptive summary for UX                                   |
| N/A              | `keywords`                                            | Added               | Search optimization                                          |

---

## Consequences

### ✅ Positive

1. **Zero-friction Import:**
   - 1:1 field mapping with ExerciseDB API
   - No transformation logic during import
   - Quarterly re-imports become trivial

2. **Richer Data:**
   - Exercise videos improve UX
   - Tips enhance safety guidance
   - Variations support progression planning
   - Keywords enable better search

3. **Industry-standard Nomenclature:**
   - Recognizable by any fitness developer
   - Easier onboarding for future contributors
   - Aligns with ExerciseDB documentation

4. **Better Analytics:**
   - `secondary_muscles` enables more accurate load management
   - `movement_pattern` preserves compound/isolation distinction for context-aware analytics
   - Clearer semantic meaning for each field

5. **Maintainability:**
   - Single source of truth (ExerciseDB)
   - Reduced custom mapping logic
   - Simpler documentation

### ⚠️ Negative

1. **Migration Work:**
   - Schema changes (SQL migration + WatermelonDB schema)
   - Model updates (Exercise.ts with @json decorators)
   - TypeScript types update
   - Test factory updates (37 tests)
   - Estimated: 2-3 hours

2. **Breaking Changes:**
   - All existing Exercise references need updates
   - Database queries using old field names will break
   - Test data regeneration required

3. **Storage Increase:**
   - Additional fields (videos, tips, variations) increase row size
   - ~1,300 exercises × ~500 bytes extra = ~650 KB total (negligible)

### 🔄 Mitigation

- **Timing:** Phase 0.5 (pre-production) minimizes impact
- **Testing:** Comprehensive type-check + unit tests before commit
- **Documentation:** Update DATABASE.md with new schema
- **ADR:** This document serves as reference for future decisions

---

## Implementation Plan

### 1. Database Schema (SQL + WatermelonDB)

```typescript
// schema.ts - New exercises table
tableSchema({
  name: 'exercises',
  columns: [
    // ExerciseDB fields (exact match)
    { name: 'exercisedb_id', type: 'string', isIndexed: true },
    { name: 'name', type: 'string', isIndexed: true },
    { name: 'body_parts', type: 'string' }, // JSON array
    { name: 'target_muscles', type: 'string' }, // JSON array
    { name: 'secondary_muscles', type: 'string' }, // JSON array
    { name: 'equipments', type: 'string' }, // JSON array
    { name: 'exercise_type', type: 'string' }, // ExerciseDB values
    { name: 'instructions', type: 'string' }, // JSON array
    { name: 'exercise_tips', type: 'string' }, // JSON array
    { name: 'variations', type: 'string' }, // JSON array
    { name: 'overview', type: 'string', isOptional: true },
    { name: 'image_url', type: 'string', isOptional: true },
    { name: 'video_url', type: 'string', isOptional: true },
    { name: 'keywords', type: 'string' }, // JSON array

    // Halterofit-specific
    { name: 'movement_pattern', type: 'string', isIndexed: true },
    { name: 'difficulty', type: 'string' },

    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});
```

### 2. Exercise Model (@json decorators)

```typescript
@json('body_parts', sanitizeStringArray) bodyParts!: string[];
@json('target_muscles', sanitizeStringArray) targetMuscles!: string[];
@json('secondary_muscles', sanitizeStringArray) secondaryMuscles!: string[];
@json('equipments', sanitizeStringArray) equipments!: string[];
@json('instructions', sanitizeStringArray) instructions!: string[];
@json('exercise_tips', sanitizeStringArray) exerciseTips!: string[];
@json('variations', sanitizeStringArray) variations!: string[];
@json('keywords', sanitizeStringArray) keywords!: string[];

@field('exercise_type') exerciseType!: string;
@field('movement_pattern') movementPattern!: 'compound' | 'isolation';
@field('difficulty') difficulty!: 'beginner' | 'intermediate' | 'advanced';
@field('overview') overview?: string;
@field('image_url') imageUrl?: string;
@field('video_url') videoUrl?: string;
```

### 3. Migration Strategy

**Supabase Migration:**

```sql
-- Rename columns
ALTER TABLE exercises RENAME COLUMN muscle_groups TO target_muscles;
ALTER TABLE exercises RENAME COLUMN category TO movement_pattern;
ALTER TABLE exercises RENAME COLUMN primary_muscle TO body_parts;
ALTER TABLE exercises RENAME COLUMN equipment TO equipments;

-- Add new columns
ALTER TABLE exercises ADD COLUMN secondary_muscles JSONB DEFAULT '[]';
ALTER TABLE exercises ADD COLUMN exercise_tips JSONB DEFAULT '[]';
ALTER TABLE exercises ADD COLUMN variations JSONB DEFAULT '[]';
ALTER TABLE exercises ADD COLUMN overview TEXT;
ALTER TABLE exercises ADD COLUMN video_url TEXT;
ALTER TABLE exercises ADD COLUMN keywords JSONB DEFAULT '[]';

-- Update exercise_type values to match ExerciseDB
UPDATE exercises SET exercise_type = 'weight_reps' WHERE exercise_type = 'strength';
```

**WatermelonDB:** Schema version bump triggers local migration on app start.

---

## Alternatives Considered

### A. Keep Current Schema + Complex Mapping

**Rejected because:**

- Perpetual mapping logic maintenance
- Confusion between our terms and ExerciseDB terms
- Lost data (videos, tips, variations)
- Import complexity

### B. Partial Alignment (rename some fields)

**Rejected because:**

- Inconsistency confuses developers
- Half-measure doesn't solve core problem
- Still requires mapping logic for some fields

### C. Full Alignment (CHOSEN)

**Accepted because:**

- Complete clarity and consistency
- Zero mapping logic needed
- Access to all ExerciseDB features
- Industry-standard nomenclature
- Timing is optimal (Phase 0.5)

---

## Related Decisions

- **ADR-017:** No Custom Exercises in MVP - Simplified architecture enabling this refactor
- **Future ADR:** ExerciseDB Import Strategy (will reference this schema)

---

## References

- ExerciseDB API: https://github.com/ExerciseDB/exercisedb-api
- ExerciseDB Docs: https://dub.sh/JTgJoq2
- WatermelonDB @json decorator: https://watermelondb.dev/docs/Model#raw-field-access
- Industry exercise classification: https://www.physio-pedia.com/Compound_Exercises

---

**Decision Date:** 2025-02-03
**Implemented:** 2025-02-03
**Last Updated:** 2025-02-03
