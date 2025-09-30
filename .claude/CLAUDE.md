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
- `npm test` - Tests unitaires
- `npm run lint` - ESLint
- `npm run type-check` - Vérification TypeScript
- `npm run format` - Prettier formatting

## À propos du projet : Halterofit

**Application de tracking fitness intelligente pour bodybuilders sérieux**

### Stack technique
- **Frontend**: React Native + Expo + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State**: Zustand + React Query
- **UI**: NativeWind (Tailwind pour RN)
- **Charts**: Victory Native
- **Testing**: Jest + React Testing Library + Detox

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
- `README.md` - Plan MVP complet
- `docs/PROJECT_PLAN.md` - Plan de développement complet
- `docs/MVP_ROADMAP.md` - Roadmap 12 semaines
- `docs/ARCHITECTURE.md` - Architecture technique
- `docs/METRICS.md` - KPIs et métriques
- `docs/STRUCTURE.md` - Guide structure dossiers