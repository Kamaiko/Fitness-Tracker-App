# ExerciseDB Import - Q&A Session

**Date:** 2025-02-03
**Participants:** Patrick Patenaude (Product Owner), Claude (Technical Advisor)
**Context:** Planning Task 0.6.8 - Bulk Import ExerciseDB Library (1,300+ exercises)
**Goal:** Ensure zero refactoring needed post-import by making all architectural decisions upfront

---

## 🎯 Session Summary

**Status:** ✅ 95% Complete - Pure ExerciseDB schema finalized (ADR-019)
**Decisions Made:** 9/10 (Q9 obsolete, Q8 resolved)
**Commits Created:** 2 (ADR-017, ADR-018)
**Next Steps:** Finalize remaining 3 decisions + implement import script

---

## ✅ RESOLVED QUESTIONS

### Q1: Type de données `muscle_groups` (CRITICAL)

**Problem:** Incohérence entre Supabase (`JSONB`) et WatermelonDB (`string`)

**Decision:** Option B - @json decorator (COMPLETED ✅)

**Implementation:**

- Schéma refactorisé complètement (ADR-018)
- Séparation en 3 champs : `body_parts`, `target_muscles`, `secondary_muscles`
- Tous avec `@json` decorator pour parsing automatique
- Migration Supabase créée avec indexes GIN pour performance

**Commit:** `a211ad0` - refactor(exercises): Align schema with ExerciseDB nomenclature

---

### Q2: Instructions Format

**Problem:** ExerciseDB fournit array `["Step 1", "Step 2"]`, schéma original était `TEXT`

**Decision:** Option B - JSON array avec @json decorator (COMPLETED ✅)

**Rationale:**

- Structured data meilleure pour display flexible
- Numérotation automatique possible : `instructions.map((step, i) => ...)`
- Aligné avec ExerciseDB (pas de transformation)

**Implementation:**

```typescript
@json('instructions', sanitizeStringArray) instructions!: string[];
```

**Commit:** `a211ad0` - Inclus dans ADR-018

---

### Q3: Mapping `category` (bodyPart vs compound/isolation)

**Problem:** ExerciseDB fournit `bodyPart` (anatomie), schéma original voulait `category` (compound/isolation)

**Decision:** Option B - Dual fields (COMPLETED ✅)

**Implementation:**

- `body_parts` → Directement depuis ExerciseDB (anatomie: "Chest", "Back")
- `movement_pattern` → Halterofit-specific (analytics: "compound" | "isolation")
- `movement_pattern` sera dérivé lors de l'import via logique custom

**Rationale:**

- Garde les 2 dimensions (anatomie + pattern)
- `body_parts` pour filtres UI ("exercices pour chest")
- `movement_pattern` pour analytics context-aware (compound = fatigue++)

**Commit:** `a211ad0` - Inclus dans ADR-018

---

### Q4: Exercices Custom

**Problem:** MVP devrait-il permettre custom exercises ?

**Decision:** NON - Read-only MVP (COMPLETED ✅)

**Rationale:**

- ExerciseDB fournit 1,300+ exercices (suffisant)
- Focus sur core value: analytics, pas exercise CRUD
- Validation avec beta users avant d'ajouter (Phase 3+)
- Simplifie architecture (~500 lignes code éliminées)

**Documentation:** ADR-017 - Read-Only Exercise Library

**Commit:** `fcbe937` - refactor(exercises): Remove custom exercises from MVP

---

### Q5: Ownership des exercices (`created_by`)

**Problem:** Qui "possède" les exercices ExerciseDB ?

**Decision:** Aucun ownership - Read-only (COMPLETED ✅)

**Implementation:**

- Champs `is_custom` et `created_by` supprimés
- Tous les exercices sont publics (RLS policy simplifiée)
- Pas de sync Supabase pour exercices (seed local uniquement)

**Commit:** `fcbe937` - Inclus dans ADR-017

---

### Q6: Sync Protocol WatermelonDB

**Problem:** Exercices devraient-ils être syncés via Supabase ?

**Decision:** NON - Seed local uniquement (COMPLETED ✅)

**Rationale:**

- 1,300 exercices × tous les users = trafic énorme
- Exercices sont identiques pour tous (read-only)
- Bundle local dans l'app (assets/data/exercises-seed.json)
- Supabase sync uniquement pour workouts/sets (user data)

**Implementation:**

- `pull_changes()` Supabase n'inclut PAS les exercices
- Seed script génère JSON bundle local
- Premier launch app → seed WatermelonDB depuis bundle

**Commit:** `fcbe937` - Migration 20250203 updated pull_changes()

---

### Q7: Champs Manquants (secondaryMuscles, videos, tips, etc.)

**Problem:** ExerciseDB fournit plus de data que notre schéma original

**Decision:** Ajouter TOUS les champs ExerciseDB (COMPLETED ✅)

**New Fields Added:**

- `secondary_muscles` - Muscles secondaires pour analytics
- `video_url` - Démonstrations vidéo
- `exercise_tips` - Conseils sécurité/technique
- `variations` - Variantes alternatives
- `overview` - Description résumé
- `keywords` - Termes recherche

**Rationale:**

- Richer UX (videos, tips)
- Better analytics (secondary muscles = load management)
- Better search (keywords)
- Zero-friction import (1:1 mapping)

**Commit:** `a211ad0` - ADR-018 complete refactor

---

## ⚠️ PENDING QUESTIONS

### Q8: Equipment Normalization

**Problem:** ExerciseDB utilise des valeurs comme `"body weight"` (avec espace), votre ancien schema avait `"bodyweight"` (sans espace)

**Status:** ⏳ NEEDS DECISION

**Options:**

A) **Utiliser valeurs ExerciseDB telles quelles**

- Pro: Pas de mapping, 1:1 direct
- Con: Valeurs incohérentes ("body weight" vs "barbell")

B) **Normaliser avec mapping dictionary**

```typescript
const EQUIPMENT_MAP = {
  'body weight': 'bodyweight',
  barbell: 'barbell',
  dumbbell: 'dumbbell',
  // ...
};
```

- Pro: Valeurs consistantes
- Con: Logique mapping à maintenir

C) **Stocker les deux (raw + normalized)**

- `equipments_raw` = valeurs ExerciseDB originales
- `equipments` = valeurs normalisées
- Pro: Traçabilité + consistance
- Con: Redondance data

**Question:** Quelle option préférez-vous ? (A, B, ou C)

---

### Q9: Difficulty Assignment

**Problem:** ExerciseDB NE FOURNIT PAS le champ `difficulty`. Votre schéma a : `difficulty: 'beginner' | 'intermediate' | 'advanced'`

**Status:** ⏳ NEEDS DECISION

**Options:**

A) **Algorithme dérivation basique**

```typescript
if (equipments.includes('bodyweight')) return 'beginner';
if (equipments.includes('barbell')) return 'intermediate';
return 'intermediate'; // default
```

B) **Mapping manuel (fichier config)**

- Créer `exercisedb-difficulty-overrides.json`
- Assigner manuellement ~50 exercices populaires
- Reste = "intermediate" par défaut

C) **Tout mettre "intermediate"**

- Plus simple
- Peut être affiné en Phase 3 avec user feedback

D) **Utiliser un LLM pour classifier**

- GPT-4 analyse name + bodyParts + equipments → difficulty
- Batch processing pendant import
- Cost: ~$0.50 pour 1,300 exercises

**Question:** Quelle approche pour `difficulty` ? (A, B, C, ou D)

---

### Q10: Images/GIFs Storage Strategy

**Problem:** ExerciseDB fournit `gifUrl` (GIF animés ~500KB chacun). 1,300 × 500KB = **650MB total**

**Status:** ⏳ NEEDS DECISION

**Options:**

A) **URLs uniquement (lazy load)**

- Stocker juste les URLs dans DB
- Download on-demand avec `expo-image` cache
- Pro: Bundle app petit, cache géré par expo-image
- Con: Nécessite internet première fois

B) **Bundle dans l'app**

- Download tous les GIFs, inclure dans app
- Pro: 100% offline dès install
- Con: App size +650MB (Apple/Google stores vont refuser)

C) **Supabase Storage**

- Upload GIFs vers Supabase Storage bucket
- CDN Supabase pour performance
- Pro: Contrôle total, bon CDN
- Con: Coûts storage ($0.021/GB/mois = ~$0.15/mois)

D) **Hybrid: URLs + selective bundle**

- Bundle top 50 exercices populaires (~25MB)
- Reste = URLs lazy load
- Pro: Balance offline/app size
- Con: Plus complexe

**Question:** Stratégie pour les GIFs ? (A, B, C, ou D)

**Recommendation:** Option A (URLs only) pour MVP, Option D si beta users se plaignent de lag

---

## 📋 DECISIONS MATRIX

| #   | Question                | Status      | Decision                                    | Commit  |
| --- | ----------------------- | ----------- | ------------------------------------------- | ------- |
| 1   | muscle_groups data type | ✅ DONE     | @json decorator with split fields           | a211ad0 |
| 2   | instructions format     | ✅ DONE     | JSON array with @json                       | a211ad0 |
| 3   | category mapping        | ✅ DONE     | Dual fields (body_parts + movement_pattern) | a211ad0 |
| 4   | Custom exercises        | ✅ DONE     | NO - Read-only MVP                          | fcbe937 |
| 5   | Exercise ownership      | ✅ DONE     | No ownership (public)                       | fcbe937 |
| 6   | Sync protocol           | ✅ DONE     | Local seed only (no Supabase sync)          | fcbe937 |
| 7   | Missing fields          | ✅ DONE     | Add ALL ExerciseDB fields                   | a211ad0 |
| 8   | Equipment normalization | ✅ DONE     | Keep ExerciseDB values as-is                | -       |
| 9   | Difficulty assignment   | ❌ OBSOLETE | Removed (ADR-019)                           | -       |
| 10  | Images/GIFs storage     | ⏳ PENDING  | -                                           | -       |

---

## 🚀 NEXT STEPS

1. **Answer Q8-Q10** (3 remaining questions)
2. **Create import script** (`scripts/seed-exercisedb.ts`)
3. **Test import** with 10 exercises first
4. **Validate data quality** (check fields populated correctly)
5. **Full import** (1,300+ exercises)
6. **Update TASKS.md** (mark 0.6.8 complete)

---

## 📚 References

- **ADR-017:** No Custom Exercises in MVP ([docs/ADR-017-No-Custom-Exercises-MVP.md](./ADR-017-No-Custom-Exercises-MVP.md))
- **ADR-018:** Align Exercise Schema with ExerciseDB ([docs/ADR-018-Align-Exercise-Schema-ExerciseDB.md](./ADR-018-Align-Exercise-Schema-ExerciseDB.md))
- **ExerciseDB API:** https://github.com/ExerciseDB/exercisedb-api
- **Migration SQL:** `supabase/migrations/20251103233000_align_exercises_with_exercisedb.sql`
- **Exercise Model:** `src/services/database/watermelon/models/Exercise.ts`

---

**Last Updated:** 2025-02-03 23:45 EST
