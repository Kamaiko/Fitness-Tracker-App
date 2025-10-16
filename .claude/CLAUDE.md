# Instructions pour Claude

## Règles importantes

1. **JAMAIS écrire "Claude Code" ou mentionner Claude dans les commits**
2. **JAMAIS ajouter de signatures ou mentions d'IA dans les commits**
3. Utiliser des messages de commit simples et professionnels
4. Ne pas mentionner l'utilisation d'outils IA dans l'historique Git
5. **TOUJOURS faire un audit complet après des changements majeurs**
6. **TOUJOURS écrire du code clean, scalable et maintenable**

## Convention de nommage des commits

### Format standard

```
<type>(<scope>): <description>

[optional body]
```

### Types de commits

- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Documentation seulement
- **style**: Changements de formatage (spaces, virgules, etc.)
- **refactor**: Refactoring de code (ni feat ni fix)
- **test**: Ajout ou modification de tests
- **chore**: Maintenance (build, dépendances, config)

### Scopes suggérés

- **workout**: Fonctionnalités de workout
- **exercises**: Bibliothèque d'exercices
- **analytics**: Graphiques et statistiques
- **auth**: Authentification
- **db**: Database (WatermelonDB, models, schema)
- **ui**: Interface utilisateur
- **config**: Configuration et setup

### Exemples

```
feat(workout): add RPE tracking to set logger
fix(analytics): correct volume calculation for compound exercises
docs(readme): update installation instructions for dev build
style(components): format workout card component
refactor(lib): extract 1RM calculations to separate module
test(workout): add unit tests for set validation
chore(deps): update React Native to 0.82.0
```

## Commandes utiles

### Daily Development

- `npm start` - Démarrer Metro bundler
- `npm start -- --clear` - Démarrer avec cache clear
- `npm run type-check` - Vérification TypeScript (recommandé avant commit)

### Building (when adding native modules)

- `eas build --profile development --platform android` - Build dev pour Android
- `eas build --profile development --platform ios` - Build dev pour iOS

## État actuel de l'interface

⚠️ **IMPORTANT**: L'interface actuelle (tabs navigation + home screen) est **TEMPORAIRE et PLACEHOLDER**.

- Elle sert uniquement à tester la navigation et la structure de base
- **Tout sera à refaire éventuellement** avec le design final
- Ne pas investir trop de temps dans le perfectionnement de cette UI

## À propos du projet : Halterofit

**Application de tracking fitness offline-first**

### Status actuel

- **Version**: 0.2.0
- **Phase**: 0.5 Bis (Development Build Migration)
- **Progression**: 6% (6/96 tâches)

### Stack technique (Development Build)

- **Frontend**: React Native 0.82.0 + Expo SDK 54 + TypeScript 5.9
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Real-time)
- **State**: Zustand 5.0 + React Query 5.90
- **Database**: WatermelonDB (offline-first, reactive queries)
- **Storage**: MMKV (10-30x faster than AsyncStorage, encrypted)
- **Styling**: NativeWind v4 (Tailwind CSS 3.4)
- **UI**: FlashList + expo-image + Victory Native
- **Navigation**: Expo Router 6
- **Code Quality**: ESLint + Prettier + Husky + lint-staged + commitlint
- **Testing**: Jest + React Native Testing Library
- **External**: ExerciseDB API (1,300+ exercises), Sentry (monitoring)
- **Build**: EAS Build (Development Build required)

### Development Build Strategy

**Decision**: Use Development Build from Day 1 (not Expo Go)

**Why?**

- ✅ WatermelonDB (reactive database, better than expo-sqlite)
- ✅ MMKV (10-30x faster + encrypted vs AsyncStorage)
- ✅ Victory Native (professional charts vs basic charts)
- ✅ No future migration (avoid 1-2 weeks refactoring later)

**Daily Workflow**:

```bash
# ONE-TIME SETUP (3-4 hours)
eas build --profile development --platform android

# DAILY DEVELOPMENT (same as Expo Go!)
npm start
# Hot reload works normally ✅

# ONLY rebuild if:
# - Installing new native module (rare, ~1-2x/week max)
```

**See [docs/TECHNICAL.md](../docs/TECHNICAL.md#adr-012-development-build-strategy) for complete rationale.**

### Fonctionnalités MVP (Phases 0-6)

- Workout logging (RPE + RIR tracking, quick 1-2 taps)
- Exercise library (1,300+ ExerciseDB + custom exercises)
- Plate calculator
- Rest timer (background notifications)
- Analytics (volume, progression, plateau detection Mann-Kendall)
- Superset/circuit support
- Offline-first (WatermelonDB + Supabase sync)

### Fonctionnalités futures (Post-MVP)

- Workout templates
- Voice commands (TBD)
- Body composition analysis
- Social features
- Coaching marketplace
- Advanced rule-based suggestions (no AI/ML)

### Structure du projet

- `src/app/` - Pages & Navigation (Expo Router)
- `src/components/` - Composants réutilisables (feature-organized)
- `src/hooks/` - Custom React hooks
- `src/services/` - Services externes & API
  - `src/services/database/watermelon/` - WatermelonDB setup, models, schema
  - `src/services/storage/` - MMKV wrapper
  - `src/services/supabase/` - Supabase client
- `src/stores/` - État global (Zustand)
- `src/types/` - Définitions TypeScript
- `src/utils/` - Fonctions utilitaires
- `src/constants/` - Constantes de l'app
- `docs/` - Documentation détaillée

### Décisions architecturales clés

- **Offline-first**: WatermelonDB (reactive queries) + Supabase sync protocol
- **Performance**: FlashList (54% FPS vs FlatList), expo-image caching, MMKV storage
- **Données**: ExerciseDB API (1,300+ exercises, économise 190h)
- **Analytics**: Scientifique (Mann-Kendall plateau detection, 1RM formulas)
- **Pas de AI/ML**: Rule-based suggestions only (pas de données training)
- **Database**: 5 tables (users, exercises, workouts, workout_exercises, exercise_sets)
- **Support**: Supersets, RIR tracking, multiple exercise types
- **Build**: Development Build from Day 1 (WatermelonDB, MMKV, Victory Native)

### Documentation

- `README.md` - Vue d'ensemble (tech stack, status, liens)
- `docs/PRD.md` - Product requirements, personas, success metrics
- `docs/TASKS.md` - 96 tâches, 6 phases, progress tracking
- `docs/TECHNICAL.md` - ADRs, database schema, algorithmes
- `docs/ARCHITECTURE.md` - Code organization, patterns, data flow
- `docs/DATABASE.md` - WatermelonDB setup, schema, CRUD operations, sync protocol
- `docs/AUDIT_FIXES.md` - 4 corrections critiques (adaptées pour WatermelonDB/MMKV)
- `docs/CONTRIBUTING.md` - Setup, commit conventions, dev build workflow
