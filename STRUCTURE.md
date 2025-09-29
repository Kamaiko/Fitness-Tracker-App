# 📁 Structure du Projet Halterofit

Structure de dossier professionnel React Native avec TypeScript, optimisé pour le développement en équipe et la scalabilité.

## 🏗️ Structure Complète

```
Fitness-Tracker-App/
├── 📁 src/                          # Code source principal
│   ├── 📁 app/                      # Expo Router - Pages & Navigation
│   │   ├── 📁 auth/                 # Pages d'authentification
│   │   ├── 📁 tabs/                 # Navigation principale (tabs)
│   │   └── 📁 modals/               # Pages modales
│   │
│   ├── 📁 components/               # Composants réutilisables
│   │   ├── 📁 ui/                   # Composants UI de base
│   │   ├── 📁 workout/              # Composants spécifiques workout
│   │   ├── 📁 analytics/            # Composants analytics
│   │   ├── 📁 charts/               # Composants de visualisation
│   │   ├── 📁 forms/                # Composants de formulaires
│   │   └── 📁 navigation/           # Composants de navigation
│   │
│   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── 📁 auth/                 # Hooks d'authentification
│   │   ├── 📁 workout/              # Hooks de workout
│   │   ├── 📁 analytics/            # Hooks d'analytics
│   │   └── 📁 ui/                   # Hooks UI utilitaires
│   │
│   ├── 📁 services/                 # Services externes & API
│   │   ├── 📁 api/                  # Clients API
│   │   ├── 📁 storage/              # Stockage local
│   │   ├── 📁 notifications/        # Notifications
│   │   └── 📁 analytics/            # Services d'analytics
│   │
│   ├── 📁 stores/                   # État global (Zustand)
│   │   ├── 📁 auth/                 # Store d'authentification
│   │   ├── 📁 workout/              # Store de workout
│   │   ├── 📁 settings/             # Store des paramètres
│   │   └── 📁 analytics/            # Store d'analytics
│   │
│   ├── 📁 types/                    # Définitions TypeScript
│   │   ├── 📁 api/                  # Types API
│   │   ├── 📁 database/             # Types base de données
│   │   ├── 📁 user/                 # Types utilisateur
│   │   └── 📁 workout/              # Types workout
│   │
│   ├── 📁 utils/                    # Fonctions utilitaires
│   │   ├── 📁 calculations/         # Calculs métiers
│   │   ├── 📁 formatting/           # Formatage données
│   │   ├── 📁 validation/           # Validation données
│   │   └── 📁 constants/            # Constantes utilitaires
│   │
│   └── 📁 constants/                # Constantes de l'app
│       ├── 📄 colors.ts             # Palette de couleurs
│       ├── 📄 typography.ts         # Styles typographiques
│       ├── 📄 layout.ts             # Constantes de layout
│       ├── 📄 config.ts             # Configuration app
│       └── 📄 index.ts              # Export centralisé
│
├── 📁 assets/                       # Ressources statiques
│   ├── 📁 images/                   # Images (PNG, JPG, WebP)
│   ├── 📁 icons/                    # Icônes (SVG)
│   └── 📁 fonts/                    # Polices personnalisées
│
├── 📁 docs/                         # Documentation
│   ├── 📄 MVP_ROADMAP.md            # Roadmap MVP détaillé
│   ├── 📄 ARCHITECTURE.md           # Architecture technique
│   └── 📄 METRICS.md                # KPIs et métriques
│
├── 📁 __tests__/                    # Tests organisés
│   ├── 📁 components/               # Tests de composants
│   ├── 📁 hooks/                    # Tests de hooks
│   ├── 📁 services/                 # Tests de services
│   └── 📁 utils/                    # Tests d'utilitaires
│
├── 📁 scripts/                      # Scripts de développement
├── 📁 config/                       # Configurations diverses
│
├── 📄 package.json                  # Dépendances & scripts
├── 📄 tsconfig.json                 # Configuration TypeScript
├── 📄 .eslintrc.js                  # Configuration ESLint
├── 📄 .prettierrc.js                # Configuration Prettier
├── 📄 jest.config.js                # Configuration Jest
├── 📄 jest.setup.js                 # Setup des tests
├── 📄 babel.config.js               # Configuration Babel
├── 📄 metro.config.js               # Configuration Metro
├── 📄 app.config.ts                 # Configuration Expo
├── 📄 eas.json                      # Configuration EAS Build
├── 📄 .env.example                  # Variables d'environnement
├── 📄 .gitignore                    # Fichiers ignorés Git
├── 📄 README.md                     # Documentation principale
├── 📄 PROJECT_PLAN.md               # Plan projet complet
└── 📄 STRUCTURE.md                  # Ce fichier
```

## 🎯 Principes d'Organisation

### 📱 Structure App (Expo Router)
- **File-based routing** : Chaque fichier dans `src/app/` devient une route
- **Layout groupés** : `(auth)`, `(tabs)` pour organiser les groupes de pages
- **Type-safe navigation** : Navigation typée automatiquement

### 🧩 Composants
- **ui/** : Composants de base réutilisables (Button, Input, Card, etc.)
- **workout/** : Composants spécifiques au domaine fitness
- **analytics/** : Composants de visualisation et statistiques
- **Isolation** : Chaque composant dans son dossier avec tests et stories

### 🪝 Hooks Personnalisés
- **Logique métier** isolée dans des hooks réutilisables
- **Séparation par domaine** : auth, workout, analytics, ui
- **Tests unitaires** pour chaque hook

### 🔧 Services
- **api/** : Clients API (Supabase, externe)
- **storage/** : Gestion du stockage local (MMKV, AsyncStorage)
- **notifications/** : Push notifications, alertes
- **analytics/** : Tracking utilisateur, métriques

### 📊 État Global (Zustand)
- **Stores séparés** par domaine fonctionnel
- **Actions typées** avec TypeScript
- **Persistance** configurée selon les besoins

### 🎨 Constantes Design System
- **colors.ts** : Palette complète, thème dark-first
- **typography.ts** : Styles de texte, tailles, weights
- **layout.ts** : Spacing, dimensions, breakpoints
- **config.ts** : Configuration app, feature flags

## 🛠️ Configuration Professionnelle

### TypeScript Strict
```json
{
  "strict": true,
  "noImplicitAny": true,
  "noImplicitReturns": true,
  "exactOptionalPropertyTypes": true
}
```

### ESLint + Prettier
- **Configuration complète** : React Native + TypeScript
- **Import sorting** automatique
- **Code formatting** uniforme
- **Pre-commit hooks** (futur)

### Testing Setup
- **Jest** avec React Native Testing Library
- **Coverage reports** configurés
- **Mocks** pour modules natifs
- **Test utilities** globales

### Build Configuration
- **EAS Build** pour production
- **Multiple environments** (dev, staging, prod)
- **Automatic versioning**
- **CI/CD ready**

## 🚀 Scripts Disponibles

```bash
# Développement
npm start                    # Démarrer Expo
npm run android             # Run sur Android
npm run ios                 # Run sur iOS

# Tests
npm test                    # Tests unitaires
npm run test:watch          # Tests en mode watch
npm run test:coverage       # Rapport de couverture
npm run test:e2e            # Tests E2E (Detox)

# Code Quality
npm run lint                # ESLint
npm run lint:fix            # ESLint avec correction auto
npm run type-check          # Vérification TypeScript
npm run format              # Prettier formatting

# Build & Deploy
npm run build:android       # Build Android
npm run build:ios          # Build iOS
npm run build:all          # Build toutes plateformes
```

## 📈 Scalabilité

Cette structure est conçue pour :

1. **Équipes multiples** : Séparation claire des responsabilités
2. **Croissance rapide** : Ajout facile de nouvelles features
3. **Maintenance** : Code organisé et testé
4. **Performance** : Lazy loading, code splitting ready
5. **Qualité** : Linting, formatting, tests automatisés

## 🔄 Prochaines Étapes

1. **Initialiser le projet Expo** avec cette structure
2. **Configurer Supabase** et les variables d'environnement
3. **Implémenter les premiers composants UI**
4. **Setup des tests** et CI/CD
5. **Commencer le développement MVP**

---

*Structure créée le 2025-01-XX pour Halterofit MVP*