# Scripts Documentation

Utility scripts for Halterofit development and maintenance.

---

## ExerciseDB Import

**Purpose:** Import 1,300+ exercises from ExerciseDB API → Supabase → WatermelonDB

**Strategy:** One-time import, quarterly updates

---

### Quick Start

```bash
# Test import (no data written)
npm run import-exercisedb -- --dry-run

# Run actual import
npm run import-exercisedb

# Rollback (delete all exercises)
npm run rollback-exercisedb
```

---

### Prerequisites

**Environment Variables (`.env`):**

```env
# Supabase (get from: https://supabase.com/dashboard/project/_/settings/api)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...  # NEW format (June 2025+)

# ExerciseDB API (get from: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
EXERCISEDB_API_KEY=your_rapidapi_key_here
EXERCISEDB_API_HOST=exercisedb.p.rapidapi.com
```

**See:** [`.env.example`](../.env.example) for complete reference

---

### Dry-Run Mode

**Use dry-run to test without modifying database:**

```bash
npm run import-exercisedb -- --dry-run
```

**Output:**

```
🔍 DRY RUN MODE: No data will be written to Supabase
📦 Received 1,324 exercises from ExerciseDB
✅ Validation: 1,324/1,324 exercises valid

📋 Sample exercise (first record):
{
  "exercisedb_id": "0001",
  "name": "3/4 Sit-Up",
  "body_parts": ["Waist"],
  ...
}

✅ Dry run complete. Remove --dry-run flag to perform actual import.
```

---

### Zod Runtime Validation

**Script validates ExerciseDB API responses to prevent breaking changes:**

```typescript
// Define expected API schema
const ExerciseDBSchema = z.object({
  exerciseId: z.string().min(1),
  name: z.string().min(1),
  bodyParts: z.array(z.string()).default([]),
  targetMuscles: z.array(z.string()).default([]),
  // ...14 total fields
});

// Validate each exercise
rawExercises.forEach((item) => {
  const result = ExerciseDBSchema.safeParse(item);
  if (result.success) {
    validated.push(result.data);
  } else {
    errors.push({ index, error: result.error.message });
  }
});
```

**Why Zod?**

- ✅ Detects API schema changes (e.g., field renamed)
- ✅ Graceful degradation (skips invalid exercises, doesn't crash)
- ✅ Detailed error logging (know exactly what failed)
- ✅ Future-proof (API changes don't break app)

**See:** [docs/TECHNICAL.md § Runtime Validation](../docs/TECHNICAL.md#runtime-validation--type-safety)

---

### Update Frequency

**Quarterly (every 3 months)** - ExerciseDB adds ~10-20 exercises/month

```bash
# Re-run import (upserts new, updates existing)
npm run import-exercisedb

# Users get updates automatically via WatermelonDB sync
```

---

### Troubleshooting

| Error                            | Fix                                                                       |
| -------------------------------- | ------------------------------------------------------------------------- |
| **Missing Supabase credentials** | Check `.env` has `SUPABASE_SECRET_KEY` in NEW format (`sb_secret_...`)    |
| **ExerciseDB API 401**           | Verify `EXERCISEDB_API_KEY` in `.env`, check RapidAPI subscription active |
| **Supabase insert error**        | Run migrations first: `supabase db push`                                  |
| **Validation errors**            | Check ExerciseDB API schema hasn't changed (Zod will log specifics)       |

**Supabase New API Keys:** If you only see legacy keys (JWT starting with `eyJ...`), see [GitHub discussion](https://github.com/orgs/supabase/discussions/29260)

---

## Why Separate `tsconfig.json`?

Scripts run in **Node.js** (not React Native), requiring different TypeScript configuration.

| Config          | Root `tsconfig.json`         | `scripts/tsconfig.json`    |
| --------------- | ---------------------------- | -------------------------- |
| **Environment** | React Native (mobile)        | Node.js (server-side)      |
| **Modules**     | ESNext (ES modules)          | CommonJS (require/exports) |
| **Decorators**  | ✅ (WatermelonDB needs them) | ❌ (not needed)            |

**Without separate config:**

```typescript
import { createClient } from '@supabase/supabase-js';
// ❌ ERROR: "Cannot use import statement outside a module"
```

**Solution (`scripts/tsconfig.json`):**

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "commonjs" // Node.js compatible
  }
}
```

**Industry Standard:** Next.js, NestJS, Nx monorepos all use this pattern.

---

**Last Updated:** 2025-02-04
