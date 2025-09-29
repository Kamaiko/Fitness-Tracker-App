# 🦾 Halterofit
**L'app de tracking fitness intelligente pour les bodybuilders sérieux**

*"Track like a scientist, train like a beast"*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.72+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Expo](https://img.shields.io/badge/Expo-49+-black.svg)

---

## 📋 Table des Matières
1. [Vision & Philosophie](#-vision--philosophie)
2. [MVP Features](#-mvp-features-phase-1---12-semaines)
3. [Architecture Technique](#️-architecture-technique-scalable)
4. [Métriques de Succès](#-métriques-de-succès)
5. [Roadmap](#️-roadmap-détaillé)
6. [Setup Instructions](#️-setup-instructions)
7. [Design System](#-design-system)

---

## 🎯 Vision & Philosophie

**Halterofit** n'est pas une autre app fitness générique. C'est un outil scientifique pour les athlètes qui prennent leur progression au sérieux.

### Mission Statement
Révolutionner le tracking fitness en combinant science du sport moderne et besoins réels des bodybuilders, pour maximiser les gains de chaque athlète.

### Valeurs Core
- **Science-Based** : Chaque feature basée sur recherche peer-reviewed
- **Privacy-First** : Données sensibles chiffrées (cycles, bloodwork)
- **Progressive Overload** : Focus sur la progression mesurable
- **Alpha Mindset** : Interface noir minimaliste, zero bullshit

### Différenciateurs Clés
1. **Intelligence Prédictive** : Anticipe plateaux et overtraining
2. **Enhanced-Friendly** : Seule app à optimiser pour enhanced athletes
3. **RPE Analytics** : Système d'effort perçu le plus avancé
4. **Scientific Rigor** : Recherche vs marketing fluff

---

## 🚀 MVP Features (Phase 1 - 12 semaines)

### Core Features

#### 1. Smart Workout Logger
- **Quick Entry** : Interface tap/swipe optimisée pour le gym
- **Auto-Timer** : Rest periods adaptatifs selon exercice et RPE
- **Voice Commands** : "15 reps à 225 pounds" (Phase 2)
- **Offline-First** : Fonctionne sans connexion internet
- **Exercise Library** : 500+ exercices avec instructions détaillées

#### 2. RPE Tracking Avancé ⚡
- **Scale 1-10** : Plus intuitive que 1-100 pour MVP
- **Visual Feedback** : Interface graphique claire
- **Pattern Recognition** : Détecte fatigue intra-workout
- **Auto-Suggestions** : "RPE élevé, réduire volume?"
- **Historical Context** : Compare aux sessions précédentes

#### 3. Performance Analytics
- **Volume Tracking** : Sets × reps × poids par muscle group
- **Strength Curves** : Progression visuelle par exercice
- **Trend Analysis** : Régression linéaire sur performances
- **Weekly/Monthly** : Comparaisons de périodes
- **Export Data** : CSV pour analyse externe

#### 4. Energy Readiness Score 🔥 *(Différenciateur)*
```typescript
// Pre-workout questionnaire (30 secondes)
interface ReadinessMetrics {
  sleepQuality: 1-10;
  stressLevel: 1-10;
  motivation: 1-10;
  energyLevel: 1-10;
  muscleSoreness: 1-10;
}

// Score 0-100 avec recommendations
interface ReadinessOutput {
  score: number;
  recommendation: 'go-hard' | 'normal' | 'light' | 'rest';
  volumeAdjustment: number; // +/- %
}
```

#### 5. Plateau Detection Engine 💪 *(Unique)*
- **Auto-Detection** : Stagnation >3 semaines identifiée
- **Confidence Score** : Probabilité statistique
- **Breaking Protocols** : Volume waves, technique variations
- **Exercise Substitutions** : Alternatives intelligentes

### Features Différenciateurs MVP
- **Rest Timer Intelligent** : S'adapte selon RPE précédent
- **Exercise Tips Contextuels** : Tips qui évoluent avec ton niveau
- **Progressive Overload Tracker** : Visualisation claire progression
- **Fatigue Management** : Détection précoce overtraining

---

## 🏗️ Architecture Technique Scalable

### Stack MVP
```typescript
{
  "frontend": {
    "framework": "React Native + Expo SDK 49+",
    "language": "TypeScript 5.0+ (strict mode)",
    "state": "Zustand + React Query",
    "ui": "NativeWind (Tailwind CSS for React Native)",
    "charts": "Victory Native + React Native Chart Kit",
    "navigation": "Expo Router (file-based routing)",
    "testing": "Jest + React Testing Library + Detox"
  },
  "backend": {
    "platform": "Supabase (BaaS)",
    "database": "PostgreSQL 15+",
    "auth": "Supabase Auth (email + OAuth)",
    "storage": "Supabase Storage (photos progress)",
    "realtime": "WebSocket subscriptions",
    "functions": "Supabase Edge Functions (Deno)"
  },
  "devops": {
    "hosting": "Expo EAS (Expo Application Services)",
    "ci_cd": "GitHub Actions",
    "monitoring": "Sentry (error tracking)",
    "analytics": "PostHog (privacy-focused)"
  }
}
```

### Architecture Évolutive
```
Phase 1 (MVP - 0-1K users):
[React Native App] → [Supabase] → [PostgreSQL]

Phase 2 (Scale - 1K-10K users):
[React Native App] → [Load Balancer] → [Supabase + Python Analytics API]

Phase 3 (Enterprise - 10K+ users):
[React Native App] → [GraphQL Gateway] → [Microservices Kubernetes]
```

### Database Schema Core (PostgreSQL)
```sql
-- Users avec profiling intelligent
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Profile Analytics
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  primary_goals JSONB, -- {"strength": true, "hypertrophy": true}
  body_metrics JSONB, -- {"weight_kg": 80, "height_cm": 180}

  -- App Preferences
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  theme TEXT DEFAULT 'dark',
  privacy_level INTEGER DEFAULT 2
);

-- Workouts avec analytics built-in
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,

  -- Pre-workout Analytics
  readiness_score INTEGER CHECK (readiness_score BETWEEN 0 AND 100),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),

  -- Session Analytics (calculated)
  total_volume_kg DECIMAL(10,2),
  average_rpe DECIMAL(3,1),
  duration_minutes INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise sets avec calculations automatiques
CREATE TABLE exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  set_number INTEGER NOT NULL,

  -- Set Data
  weight_kg DECIMAL(6,2),
  reps INTEGER,
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  rest_seconds INTEGER,

  -- Auto-calculated Analytics
  volume_load DECIMAL(10,2) GENERATED ALWAYS AS (weight_kg * reps) STORED,
  estimated_1rm DECIMAL(6,2), -- Calculated via Brzycki formula

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise Library
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'chest', 'back', 'legs', 'shoulders', 'arms'
  equipment TEXT[], -- Array: ['barbell', 'bench']

  -- Exercise Analytics
  primary_muscles TEXT[],
  secondary_muscles TEXT[],
  movement_pattern TEXT, -- 'push', 'pull', 'squat', 'hinge'
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),

  -- Content
  instructions TEXT,
  tips TEXT,
  video_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📊 Métriques de Succès

### MVP Success Criteria (12 semaines)

#### Phase 1: Validation Technique (Semaines 1-4)
```typescript
interface TechnicalKPIs {
  performance: {
    coldStartTime: "< 2s",
    crashRate: "< 0.1%",
    offlineCapability: "100%",
    memoryUsage: "< 150MB"
  },
  development: {
    featuresPerWeek: "3-5",
    bugFixTime: "< 24h",
    testCoverage: "> 60%",
    codeQuality: "TypeScript strict, ESLint"
  }
}
```

#### Phase 2: Validation Utilisateur (Semaines 5-8)
```typescript
interface UserKPIs {
  acquisition: {
    betaSignups: 100,
    signupConversion: "80%", // from landing page
    profileCompletion: "60%"
  },
  engagement: {
    D1Retention: "80%",
    D7Retention: "50%",
    D30Retention: "30%",
    workoutsPerWeek: 3.5,
    sessionDuration: "8 minutes"
  }
}
```

#### Phase 3: Product-Market Fit (Semaines 9-12)
```typescript
interface PMFKPIs {
  quality: {
    workoutCompletionRate: "85%",
    dataAccuracy: "95%",
    NPS: "> 40",
    appStoreRating: "> 4.2"
  },
  adoption: {
    timerUsage: "70%",
    rpeTracking: "60%",
    exerciseLibraryUsage: "80%",
    readinessScoreUsage: "50%"
  }
}
```

### Triggers de Scale
- **1000+ users actifs** → Migrer vers backend dédié
- **10000+ users** → Implémenter cache layer (Redis)
- **50000+ users** → Architecture microservices

---

## 🗺️ Roadmap Détaillé

### Phase 1: MVP Core (Semaines 1-12)

#### Sprint 1-2: Foundation (Semaines 1-2)
- [x] **Setup Projet**
  - Expo + TypeScript + NativeWind configuration
  - Supabase project setup + database schema
  - GitHub repo + CI/CD pipeline
  - Development environment (Android testing)

#### Sprint 3-4: Auth & Core UI (Semaines 3-4)
- [ ] **Authentication Flow**
  - Email/password + social login (Google)
  - User onboarding avec goal setting
  - Profile setup (experience level, body metrics)
- [ ] **Navigation & Theme**
  - Expo Router file-based navigation
  - Dark theme implementation
  - Core UI components library

#### Sprint 5-6: Workout Logging (Semaines 5-6)
- [ ] **Exercise Selection**
  - Exercise library avec search/filter
  - Favorites et recently used
  - Custom exercise creation
- [ ] **Set Logging**
  - Quick entry interface (weight/reps/RPE)
  - Rest timer avec notifications
  - Set modifications et deletions

#### Sprint 7-8: Analytics Core (Semaines 7-8)
- [ ] **Basic Analytics**
  - Volume calculations par muscle group
  - Workout history avec filtering
  - Progress charts (weight progression)
- [ ] **RPE System**
  - RPE entry avec visual feedback
  - RPE trends per exercise
  - Fatigue detection basique

#### Sprint 9-10: Intelligence Features (Semaines 9-10)
- [ ] **Readiness Score**
  - Pre-workout questionnaire
  - Score calculation algorithm
  - Workout recommendations
- [ ] **Plateau Detection**
  - Trend analysis per exercise
  - Stagnation detection (3+ weeks)
  - Breaking protocol suggestions

#### Sprint 11-12: Polish & Beta (Semaines 11-12)
- [ ] **Performance Optimization**
  - Code splitting et lazy loading
  - Image optimization
  - Offline sync reliability
- [ ] **Beta Preparation**
  - Beta testing avec 50 users
  - Bug fixes based on feedback
  - App store submission preparation

### Phase 2: Différenciation (Mois 4-6)
- Advanced plateau breaking protocols
- Body composition tracking avec photos
- Social features (training partners)
- Program builder avec AI recommendations
- Enhanced athlete features (cycle tracking)

### Phase 3: Scale & Monetization (Mois 7+)
- Premium subscription ($9.99/mois)
- Enhanced athlete tier ($19.99/mois)
- Coaching marketplace
- Supplement recommendations avec affiliate
- Enterprise features (gym chains)

---

## 🛠️ Setup Instructions

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
git >= 2.40.0
```

### Installation Rapide
```bash
# Clone le projet
git clone https://github.com/[username]/halterofit.git
cd halterofit

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Ajouter tes credentials Supabase dans .env

# Start development server
npm start

# Run sur Android device
npm run android

# Run sur iOS simulator (Mac seulement)
npm run ios
```

### Environment Variables (.env)
```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_APP_VERSION=0.1.0
```

### Testing
```bash
# Unit tests avec Jest
npm test

# E2E tests avec Detox
npm run test:e2e

# Test coverage report
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

### Build & Deploy
```bash
# Development build
npx eas build --platform android --profile development

# Production build
npx eas build --platform all --profile production

# Submit to stores
npx eas submit --platform all
```

---

## 🎨 Design System

### Color Palette
```scss
// Primary Colors - Alpha/Masculine Theme
$black-primary: #0A0A0A;     // Main background
$black-surface: #1A1A1A;     // Card backgrounds
$black-elevated: #2A2A2A;    // Elevated surfaces

// Text Colors
$white-primary: #FFFFFF;      // Primary text
$gray-secondary: #B3B3B3;    // Secondary text
$gray-tertiary: #666666;     // Disabled text

// Accent Colors
$red-danger: #FF3B30;        // High RPE, errors, warnings
$green-success: #34C759;     // PRs, success states
$blue-primary: #007AFF;      // Links, CTAs, info
$orange-warning: #FF9500;    // Medium RPE, cautions

// Data Visualization
$chart-primary: #4299E1;     // Primary data series
$chart-secondary: #ED8936;   // Secondary data series
$chart-tertiary: #9F7AEA;    // Tertiary data series
```

### Typography Scale
```scss
// Font Family
$font-primary: 'SF Pro Display', system-ui, sans-serif;
$font-body: 'SF Pro Text', system-ui, sans-serif;
$font-mono: 'SF Mono', 'Monaco', monospace;

// Scale (Modular Scale 1.25)
$text-xs: 12px;    // Small labels, captions
$text-sm: 14px;    // Body text, secondary
$text-base: 16px;  // Default body text
$text-lg: 18px;    // Subheadings
$text-xl: 20px;    // Card titles
$text-2xl: 24px;   // Page headers
$text-3xl: 30px;   // Dashboard metrics
$text-4xl: 36px;   // Hero numbers
```

### Component Principles
- **Touch Targets** : Minimum 44px pour accessibility
- **Spacing** : 8px grid system (8, 16, 24, 32px)
- **Border Radius** : 8px standard, 12px cards, 24px buttons
- **Shadows** : Subtle elevations, dark theme friendly
- **Animations** : 200ms standard, 300ms complex transitions

---

## 📝 Development Guidelines

### Code Style
```typescript
// Use TypeScript strict mode
interface WorkoutData {
  id: string;
  userId: string;
  exercises: ExerciseSet[];
  date: Date;
  readinessScore?: number;
}

// Prefer explicit typing
const calculateVolume = (sets: ExerciseSet[]): number => {
  return sets.reduce((total, set) => total + (set.weight * set.reps), 0);
};

// Use meaningful function names
const getWorkoutsForUser = async (userId: string): Promise<Workout[]> => {
  // Implementation
};
```

### File Organization
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI (Button, Input, etc.)
│   ├── workout/         # Workout-specific components
│   └── charts/          # Data visualization
├── screens/             # Screen components (Expo Router)
├── hooks/               # Custom React hooks
├── services/            # API calls, Supabase client
├── stores/              # Zustand stores
├── types/               # TypeScript definitions
├── utils/               # Helper functions
└── constants/           # App constants, colors, etc.
```

### Testing Strategy
```typescript
// Unit Tests - Core Logic
describe('WorkoutAnalytics', () => {
  it('calculates total volume correctly', () => {
    const sets = [
      { weight: 100, reps: 10 },
      { weight: 110, reps: 8 }
    ];
    expect(calculateTotalVolume(sets)).toBe(1880);
  });
});

// Component Tests - User Interactions
describe('WorkoutLogger', () => {
  it('allows user to log a set', () => {
    const { getByTestId } = render(<WorkoutLogger />);

    fireEvent.changeText(getByTestId('weight-input'), '225');
    fireEvent.changeText(getByTestId('reps-input'), '8');
    fireEvent.press(getByTestId('save-button'));

    expect(getByTestId('set-saved-message')).toBeTruthy();
  });
});
```

---

## 🔐 Privacy & Security

### Data Protection
- **Encryption at Rest** : Sensitive data (future cycle logs) encrypted
- **Row Level Security** : Supabase RLS policies per user
- **API Security** : Rate limiting, input validation
- **GDPR Compliance** : Data export, deletion, consent

### Enhanced Athlete Features (Phase 2)
```typescript
// Encrypted cycle tracking
interface CycleData {
  phase: 'natural' | 'cruise' | 'blast' | 'pct';
  startDate: Date;
  endDate?: Date;
  // Encrypted sensitive data
  compounds?: EncryptedData;
  dosages?: EncryptedData;
}
```

---

## 🤝 Contributing

### Workflow
1. Fork le repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Standards
- TypeScript strict mode requis
- Test coverage > 60% pour nouvelles features
- ESLint + Prettier configuration
- Conventional commits format

---

## 📄 License

MIT License - voir [LICENSE.md](LICENSE.md) pour détails.

---

## 🚀 Next Steps Immédiats

1. **Setup Development Environment**
   ```bash
   npx create-expo-app halterofit --template typescript
   cd halterofit
   npm install @supabase/supabase-js zustand
   ```

2. **Configure Supabase Project**
   - Create nouveau project sur supabase.com
   - Setup database schema initial
   - Configure authentication providers

3. **Implement Auth Flow**
   - Email/password registration
   - User profile setup
   - Navigation guards

4. **Build First Workout Screen**
   - Exercise selection interface
   - Set logging functionality
   - Rest timer implementation

---

## 💪 Ready to Build the Future of Fitness Tracking?

Ce n'est pas juste une app - c'est l'outil qui va transformer comment les bodybuilders sérieux trackent leur progression.

**Time to execute. Let's build something legendary.**

---

*Dernière mise à jour: 2025-01-XX*
*Version: MVP 0.1.0*
*Status: En développement actif*