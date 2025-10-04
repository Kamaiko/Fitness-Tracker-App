# Instructions pour Claude

## Règles importantes

1. **JAMAIS écrire "Claude Code" ou mentionner Claude dans les commits**
2. **JAMAIS ajouter de signatures ou mentions d'IA dans les commits**
3. Utiliser des messages de commit simples et professionnels
4. Ne pas mentionner l'utilisation d'outils IA dans l'historique Git

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

**Application de tracking fitness intelligente pour bodybuilders sérieux**

### Stack technique
- **Frontend**: React Native 0.81.4 + Expo SDK 54 + TypeScript 5.9
- **Backend**: Supabase (PostgreSQL + Auth + Real-time + Storage)
- **State**: Zustand 5.0.8 (global) + React Query 5.90.2 (server)
- **Storage**: MMKV 3.3.3 (encrypted local storage)
- **Charts**: react-native-chart-kit 6.12.0
- **Navigation**: Expo Router 6.0.10
- **Testing**: Aucun pour MVP (sera ajouté post-MVP)

### Fonctionnalités MVP (Phase 1)
- Smart workout logging avec RPE
- Exercise library (500+ exercices)
- Basic analytics avec trends
- Rest timer intelligent
- Plateau detection
- Energy readiness score

### Fonctionnalités futures (Phase 2-3)
- Enhanced athlete tracking (cycles)
- Voice commands
- AI recommendations
- Body composition analysis
- Social features
- Coaching marketplace

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

### Documentation
- `README.md` - Vue d'ensemble du projet
- `docs/TASKS.md` - Roadmap de développement (94 tâches)
- `docs/TECHNICAL.md` - Architecture et décisions techniques (ADRs)
- `docs/CONTRIBUTING.md` - Guide de contribution et setup