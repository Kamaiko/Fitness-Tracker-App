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
- **ui**: Interface utilisateur
- **config**: Configuration et setup

### Exemples
```
feat(workout): add RPE tracking to set logger
fix(analytics): correct volume calculation for compound exercises
docs(readme): update installation instructions
style(components): format workout card component
refactor(lib): extract 1RM calculations to separate module
test(workout): add unit tests for set validation
chore(deps): update React Native to 0.72.6
```

## Commandes utiles

- `npm start` - Démarrer Expo
- `npm run android` - Run sur Android
- `npm run ios` - Run sur iOS
- `npm run type-check` - Vérification TypeScript (recommandé avant commit)

## État actuel de l'interface

⚠️ **IMPORTANT**: L'interface actuelle (tabs navigation + home screen) est **TEMPORAIRE et PLACEHOLDER**.
- Elle sert uniquement à tester la navigation et la structure de base
- **Tout sera à refaire éventuellement** avec le design final
- Ne pas investir trop de temps dans le perfectionnement de cette UI

## À propos du projet : Halterofit

**Application de tracking fitness offline-first**

### Status actuel
- **Version**: 0.2.0
- **Phase**: 0.5 (Architecture & Database Setup)
- **Progression**: 12% (10/98 tâches)

### Stack technique
- **Frontend**: React Native 0.81.4 + Expo SDK 54 + TypeScript 5.9
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Real-time)
- **State**: Zustand 5.0 + React Query 5.90
- **Storage**: AsyncStorage (→ WatermelonDB + MMKV en Phase 3 avec Dev Client)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **UI**: FlashList + expo-image + Victory Native v41
- **Navigation**: Expo Router 6
- **Code Quality**: ESLint + Prettier
- **External**: ExerciseDB API (1,300+ exercises), Sentry (monitoring)
- **Testing**: None for MVP (add pre-production)
- **Phase actuelle**: 0.5 - Compatible Expo Go (pas de modules natifs)

### Fonctionnalités MVP (Phases 1-4)
- Workout logging (RPE + RIR tracking, quick 1-2 taps)
- Exercise library (1,300+ ExerciseDB + custom exercises)
- Plate calculator
- Rest timer (background notifications)
- Analytics (volume, progression, plateau detection Mann-Kendall)
- Superset/circuit support
- Offline-first (WatermelonDB sync)

### Fonctionnalités futures (Post-MVP)
- Workout templates
- Voice commands (TBD)
- Body composition analysis
- Social features
- Coaching marketplace
- Advanced rule-based suggestions (no AI/ML)

### Structure du projet
- `src/app/` - Pages & Navigation (Expo Router)
- `src/components/` - Composants réutilisables
- `src/hooks/` - Custom React hooks
- `src/services/` - Services externes & API
- `src/stores/` - État global (Zustand)
- `src/types/` - Définitions TypeScript
- `src/utils/` - Fonctions utilitaires
- `src/constants/` - Constantes de l'app
- `docs/` - Documentation détaillée

### Décisions architecturales clés
- **Offline-first**: WatermelonDB (SQLite) sync avec Supabase
- **Performance**: FlashList (54% FPS vs FlatList), expo-image caching
- **Données**: ExerciseDB API (1,300+ exercises, économise 190h)
- **Analytics**: Scientifique (Mann-Kendall plateau detection, 1RM formulas)
- **Pas de AI/ML**: Rule-based suggestions only (pas de données training)
- **Database**: 5 tables (users, exercises, workouts, workout_exercises, exercise_sets)
- **Support**: Supersets, RIR tracking, multiple exercise types

### Documentation
- `README.md` - Vue d'ensemble (tech stack, status, liens)
- `docs/PRD.md` - Product requirements, personas, success metrics
- `docs/TASKS.md` - 98 tâches, 14 semaines, progress tracking
- `docs/TECHNICAL.md` - 12 ADRs, database schema, algorithmes
- `docs/CONTRIBUTING.md` - Setup, commit conventions, workflow