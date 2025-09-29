# 🏗️ Architecture Technique - Halterofit
**Documentation technique détaillée**

---

## 📋 Table des Matières
1. [Vue d'Ensemble](#-vue-densemble)
2. [Architecture Frontend](#-architecture-frontend)
3. [Architecture Backend](#-architecture-backend)
4. [Base de Données](#️-base-de-données)
5. [Sécurité](#-sécurité)
6. [Performance](#⚡-performance)
7. [Déploiement](#-déploiement)
8. [Monitoring](#-monitoring)
9. [Architecture Évolutive](#-architecture-évolutive)

---

## 🎯 Vue d'Ensemble

### Architecture Philosophy
- **Mobile-First** : Optimisé pour l'expérience mobile
- **Offline-First** : Fonctionne sans connexion internet
- **Performance-First** : <2s cold start, 60fps animations
- **Security-First** : Privacy by design, encryption au repos
- **Scale-Ready** : Architecture évolutive dès le MVP

### Technology Stack

```typescript
interface TechStack {
  frontend: {
    framework: "React Native 0.72+";
    runtime: "Expo SDK 49+";
    language: "TypeScript 5.0+ (strict mode)";
    bundler: "Metro (Expo optimized)";
  };
  backend: {
    platform: "Supabase (PostgreSQL + Edge Functions)";
    database: "PostgreSQL 15+";
    auth: "Supabase Auth (JWT + RLS)";
    storage: "Supabase Storage";
    realtime: "WebSocket subscriptions";
  };
  devops: {
    hosting: "Expo EAS (mobile) + Vercel (web)";
    ci_cd: "GitHub Actions";
    monitoring: "Sentry + PostHog";
    testing: "Jest + Detox + Cypress";
  };
}
```

---

## 📱 Architecture Frontend

### Component Architecture

```
src/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Auth group layout
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/            # Main app tabs
│   │   ├── workout/
│   │   ├── analytics/
│   │   ├── library/
│   │   └── profile/
│   └── _layout.tsx        # Root layout
├── components/
│   ├── ui/                # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── workout/           # Workout-specific
│   │   ├── ExerciseCard.tsx
│   │   ├── SetLogger.tsx
│   │   ├── RestTimer.tsx
│   │   └── RPESelector.tsx
│   ├── charts/            # Data visualization
│   │   ├── ProgressChart.tsx
│   │   ├── VolumeChart.tsx
│   │   └── RPEHeatmap.tsx
│   └── forms/             # Form components
├── hooks/                 # Custom React hooks
│   ├── useWorkout.ts
│   ├── useAuth.ts
│   ├── useAnalytics.ts
│   └── useTimer.ts
├── services/              # API & external services
│   ├── supabase.ts
│   ├── analytics.ts
│   ├── storage.ts
│   └── notifications.ts
├── stores/                # Zustand stores
│   ├── authStore.ts
│   ├── workoutStore.ts
│   └── settingsStore.ts
├── types/                 # TypeScript definitions
│   ├── database.ts
│   ├── workout.ts
│   └── user.ts
├── utils/                 # Helper functions
│   ├── calculations.ts
│   ├── formatting.ts
│   └── validation.ts
└── constants/
    ├── colors.ts
    ├── typography.ts
    └── layout.ts
```

### State Management Strategy

#### Global State (Zustand)
```typescript
// stores/workoutStore.ts
interface WorkoutState {
  // Current workout session
  currentWorkout: Workout | null;
  isWorkoutActive: boolean;

  // Exercise library
  exercises: Exercise[];
  favoriteExercises: string[];

  // Actions
  startWorkout: (name: string) => void;
  endWorkout: () => void;
  addSet: (exerciseId: string, set: ExerciseSet) => void;
  updateSet: (setId: string, updates: Partial<ExerciseSet>) => void;
}

const useWorkoutStore = create<WorkoutState>((set, get) => ({
  currentWorkout: null,
  isWorkoutActive: false,
  exercises: [],
  favoriteExercises: [],

  startWorkout: (name) => {
    set({
      currentWorkout: {
        id: generateId(),
        name,
        date: new Date(),
        exercises: [],
        startTime: new Date(),
      },
      isWorkoutActive: true,
    });
  },

  endWorkout: () => {
    const { currentWorkout } = get();
    if (currentWorkout) {
      // Save to Supabase
      saveWorkout({
        ...currentWorkout,
        endTime: new Date(),
      });
    }
    set({
      currentWorkout: null,
      isWorkoutActive: false,
    });
  },

  addSet: (exerciseId, set) => {
    set((state) => ({
      currentWorkout: state.currentWorkout ? {
        ...state.currentWorkout,
        exercises: state.currentWorkout.exercises.map(ex =>
          ex.id === exerciseId
            ? { ...ex, sets: [...ex.sets, set] }
            : ex
        ),
      } : null,
    }));
  },
}));
```

#### Server State (React Query)
```typescript
// hooks/useWorkouts.ts
export const useWorkouts = (userId: string) => {
  return useQuery({
    queryKey: ['workouts', userId],
    queryFn: () => supabase
      .from('workouts')
      .select('*, exercise_sets(*)')
      .eq('user_id', userId)
      .order('date', { ascending: false }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workout: CreateWorkoutInput) =>
      supabase.from('workouts').insert(workout),
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
    },
  });
};
```

### Offline Strategy

#### Local Storage with SQLite
```typescript
// services/offline.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('halterofit.db');

// Initialize offline database
export const initOfflineDB = () => {
  db.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS offline_workouts (
        id TEXT PRIMARY KEY,
        data TEXT,
        created_at INTEGER,
        synced INTEGER DEFAULT 0
      );
    `);
  });
};

// Save workout offline
export const saveWorkoutOffline = (workout: Workout) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO offline_workouts (id, data, created_at) VALUES (?, ?, ?)',
      [workout.id, JSON.stringify(workout), Date.now()]
    );
  });
};

// Sync when online
export const syncOfflineData = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM offline_workouts WHERE synced = 0',
        [],
        async (_, { rows }) => {
          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            try {
              await supabase.from('workouts').insert(JSON.parse(item.data));

              // Mark as synced
              tx.executeSql(
                'UPDATE offline_workouts SET synced = 1 WHERE id = ?',
                [item.id]
              );
            } catch (error) {
              console.error('Sync failed:', error);
            }
          }
          resolve(true);
        }
      );
    });
  });
};
```

---

## 🗄️ Architecture Backend

### Supabase Configuration

#### Database Schema
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Custom types
CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE workout_status AS ENUM ('planned', 'in_progress', 'completed');
CREATE TYPE set_type AS ENUM ('warmup', 'working', 'drop', 'cluster', 'rest_pause');
```

#### Row Level Security Policies
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Workouts access
CREATE POLICY "Users can view own workouts" ON workouts
  FOR ALL USING (auth.uid() = user_id);

-- Exercise sets access
CREATE POLICY "Users can manage own exercise sets" ON exercise_sets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = exercise_sets.workout_id
      AND workouts.user_id = auth.uid()
    )
  );
```

#### Edge Functions (Deno)
```typescript
// supabase/functions/calculate-analytics/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, period } = await req.json();

    // Calculate volume progression
    const { data: workouts } = await supabase
      .from('workouts')
      .select('*, exercise_sets(*)')
      .eq('user_id', userId)
      .gte('date', period.start)
      .lte('date', period.end);

    const analytics = calculateVolumeProgression(workouts);

    return new Response(
      JSON.stringify(analytics),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    );
  }
});

function calculateVolumeProgression(workouts: any[]) {
  // Complex analytics calculations
  const weeklyVolume = {};
  const muscleGroupVolume = {};

  workouts.forEach(workout => {
    const week = getWeekOfYear(workout.date);
    if (!weeklyVolume[week]) weeklyVolume[week] = 0;

    workout.exercise_sets.forEach(set => {
      const volume = set.weight_kg * set.reps;
      weeklyVolume[week] += volume;

      // Add to muscle group tracking
      const muscleGroup = getMuscleGroup(set.exercise_name);
      if (!muscleGroupVolume[muscleGroup]) muscleGroupVolume[muscleGroup] = 0;
      muscleGroupVolume[muscleGroup] += volume;
    });
  });

  return {
    weeklyVolume,
    muscleGroupVolume,
    totalVolume: Object.values(weeklyVolume).reduce((a, b) => a + b, 0),
  };
}
```

### Real-time Features
```typescript
// services/realtime.ts
export const subscribeToWorkoutUpdates = (
  userId: string,
  onUpdate: (payload: any) => void
) => {
  return supabase
    .channel('workout_updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'workouts',
        filter: `user_id=eq.${userId}`,
      },
      onUpdate
    )
    .subscribe();
};

// Real-time training partner updates (Phase 2)
export const subscribeToPartnerWorkout = (
  partnerId: string,
  onUpdate: (workout: Workout) => void
) => {
  return supabase
    .channel(`partner_${partnerId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'workouts',
        filter: `user_id=eq.${partnerId}`,
      },
      (payload) => onUpdate(payload.new)
    )
    .subscribe();
};
```

---

## 🗃️ Base de Données

### Schema Détaillé

```sql
-- =============================================
-- USERS MANAGEMENT
-- =============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Profile Information
  first_name TEXT,
  last_name TEXT,
  age INTEGER CHECK (age BETWEEN 13 AND 100),
  gender TEXT CHECK (gender IN ('M', 'F', 'O')),

  -- Body Metrics
  weight_kg DECIMAL(5,2) CHECK (weight_kg BETWEEN 30 AND 300),
  height_cm INTEGER CHECK (height_cm BETWEEN 100 AND 250),
  body_fat_percentage DECIMAL(4,2) CHECK (body_fat_percentage BETWEEN 3 AND 50),

  -- Experience & Goals
  experience_level experience_level DEFAULT 'beginner',
  years_training INTEGER DEFAULT 0,
  primary_goals JSONB, -- {"strength": true, "hypertrophy": true, "endurance": false}

  -- App Preferences
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
  privacy_level INTEGER DEFAULT 2 CHECK (privacy_level BETWEEN 1 AND 3),

  -- Subscription
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'elite')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,

  -- Analytics & ML
  timezone TEXT DEFAULT 'UTC',
  preferred_workout_times JSONB, -- [{"day": "monday", "time": "18:00"}]

  CONSTRAINT valid_goals CHECK (jsonb_typeof(primary_goals) = 'object')
);

-- =============================================
-- EXERCISE LIBRARY
-- =============================================

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'chest', 'back', 'legs', 'shoulders', 'arms', 'core'
  subcategory TEXT, -- 'quads', 'hamstrings', 'biceps', 'triceps'

  -- Equipment & Setup
  equipment TEXT[] NOT NULL, -- ['barbell', 'bench', 'rack']
  setup_instructions TEXT,

  -- Biomechanics
  primary_muscles TEXT[] NOT NULL, -- ['pectoralis_major', 'anterior_deltoid']
  secondary_muscles TEXT[], -- ['triceps_brachii']
  movement_pattern TEXT NOT NULL, -- 'push', 'pull', 'squat', 'hinge', 'carry'
  plane_of_motion TEXT, -- 'sagittal', 'frontal', 'transverse'

  -- Difficulty & Progression
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5),
  progression_type TEXT DEFAULT 'weight', -- 'weight', 'reps', 'time', 'distance'
  beginner_friendly BOOLEAN DEFAULT false,

  -- Content
  description TEXT,
  instructions TEXT NOT NULL,
  tips TEXT,
  common_mistakes TEXT,
  video_url TEXT,
  demonstration_gif TEXT,

  -- Analytics
  popularity_score INTEGER DEFAULT 0,
  effectiveness_rating DECIMAL(3,2), -- Based on user progress data

  -- Metadata
  created_by UUID REFERENCES users(id),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- WORKOUT TRACKING
-- =============================================

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id),

  -- Basic Information
  name TEXT NOT NULL,
  notes TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,

  -- Pre-Workout Assessment
  readiness_score INTEGER CHECK (readiness_score BETWEEN 0 AND 100),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  sleep_duration_hours DECIMAL(3,1),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  muscle_soreness INTEGER CHECK (muscle_soreness BETWEEN 1 AND 10),

  -- Session Metrics (Calculated)
  total_volume_kg DECIMAL(10,2),
  total_sets INTEGER,
  total_reps INTEGER,
  average_rpe DECIMAL(3,1),
  max_rpe INTEGER,
  duration_minutes INTEGER GENERATED ALWAYS AS (
    CASE
      WHEN start_time IS NOT NULL AND end_time IS NOT NULL
      THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 60
      ELSE NULL
    END
  ) STORED,

  -- Analytics
  estimated_calories_burned INTEGER,
  muscle_groups_trained TEXT[], -- Calculated from exercises
  workout_intensity DECIMAL(3,2), -- RPE-based calculation

  -- Status & Metadata
  status workout_status DEFAULT 'planned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- EXERCISE SETS
-- =============================================

CREATE TABLE exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),

  -- Set Information
  set_number INTEGER NOT NULL CHECK (set_number > 0),
  set_type set_type DEFAULT 'working',

  -- Performance Data
  weight_kg DECIMAL(6,2) CHECK (weight_kg >= 0),
  reps INTEGER CHECK (reps >= 0),
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  tempo TEXT, -- "3-1-2-1" (eccentric-pause-concentric-pause)

  -- Timing
  rest_seconds INTEGER CHECK (rest_seconds >= 0),
  time_under_tension INTEGER, -- Seconds

  -- Calculated Fields
  volume_load DECIMAL(10,2) GENERATED ALWAYS AS (
    CASE
      WHEN weight_kg IS NOT NULL AND reps IS NOT NULL
      THEN weight_kg * reps
      ELSE NULL
    END
  ) STORED,

  estimated_1rm DECIMAL(6,2), -- Calculated using Brzycki formula
  relative_intensity DECIMAL(4,2), -- % of estimated 1RM

  -- Notes & Context
  notes TEXT,
  technique_rating INTEGER CHECK (technique_rating BETWEEN 1 AND 10),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(workout_id, exercise_id, set_number)
);

-- =============================================
-- PROGRAMS & TEMPLATES
-- =============================================

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id),

  -- Program Structure
  duration_weeks INTEGER CHECK (duration_weeks BETWEEN 1 AND 52),
  sessions_per_week INTEGER CHECK (sessions_per_week BETWEEN 1 AND 7),
  program_type TEXT, -- 'ppl', 'upper_lower', 'full_body', 'bro_split'
  experience_level experience_level NOT NULL,

  -- Program Data (Flexible JSON structure)
  template_json JSONB NOT NULL,

  -- Analytics
  is_public BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) CHECK (rating BETWEEN 1 AND 5),
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(3,2), -- Based on user completion and progress

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_template CHECK (jsonb_typeof(template_json) = 'object')
);

-- =============================================
-- ANALYTICS TABLES
-- =============================================

CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Time Period
  date DATE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),

  -- Volume Metrics
  total_volume DECIMAL(12,2),
  volume_by_muscle JSONB, -- {"chest": 2500.5, "back": 3200.0}
  volume_trend DECIMAL(5,2), -- % change from previous period

  -- Intensity Metrics
  average_rpe DECIMAL(3,1),
  max_rpe INTEGER,
  intensity_distribution JSONB, -- RPE histogram
  time_under_tension_total INTEGER,

  -- Frequency Metrics
  sessions_count INTEGER,
  exercises_count INTEGER,
  unique_exercises_count INTEGER,

  -- Calculated Analytics
  fatigue_index DECIMAL(4,2), -- Proprietary calculation
  progression_rate DECIMAL(5,2), -- % improvement rate
  consistency_score DECIMAL(3,2), -- Based on session frequency

  -- Recovery Metrics
  average_readiness_score DECIMAL(3,1),
  sleep_quality_average DECIMAL(3,1),
  stress_level_average DECIMAL(3,1),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, date, period_type)
);

-- =============================================
-- PLATEAU DETECTION
-- =============================================

CREATE TABLE plateau_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),

  -- Plateau Information
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  plateau_start_date DATE NOT NULL,
  plateau_duration_days INTEGER NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),

  -- Performance Context
  last_pr_date DATE,
  last_pr_value DECIMAL(6,2),
  current_average DECIMAL(6,2),
  performance_metric TEXT, -- 'weight', 'reps', 'volume', '1rm'

  -- Plateau Analysis
  probable_causes TEXT[], -- ['volume_too_low', 'frequency_insufficient', 'recovery_poor']

  -- Recommendations
  recommended_protocols JSONB, -- Structured recommendations

  -- Status Tracking
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_positive')),
  resolution_strategy TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,

  -- User Feedback
  user_acknowledged BOOLEAN DEFAULT false,
  user_feedback JSONB,

  UNIQUE(user_id, exercise_id, plateau_start_date)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_expires_at);

-- Workout queries
CREATE INDEX idx_workouts_user_date ON workouts(user_id, date DESC);
CREATE INDEX idx_workouts_status ON workouts(user_id, status);

-- Exercise set queries
CREATE INDEX idx_exercise_sets_workout ON exercise_sets(workout_id);
CREATE INDEX idx_exercise_sets_exercise ON exercise_sets(exercise_id);
CREATE INDEX idx_exercise_sets_performance ON exercise_sets(exercise_id, weight_kg DESC, reps DESC);

-- Exercise library
CREATE INDEX idx_exercises_category ON exercises(category, difficulty_level);
CREATE INDEX idx_exercises_muscles ON exercises USING GIN(primary_muscles);
CREATE INDEX idx_exercises_equipment ON exercises USING GIN(equipment);

-- Analytics
CREATE INDEX idx_performance_metrics_user_period ON performance_metrics(user_id, period_type, date DESC);
CREATE INDEX idx_plateau_detections_user_active ON plateau_detections(user_id, status) WHERE status = 'active';

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Update workout metrics when exercise sets change
CREATE OR REPLACE FUNCTION update_workout_metrics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE workouts SET
    total_volume_kg = (
      SELECT COALESCE(SUM(volume_load), 0)
      FROM exercise_sets
      WHERE workout_id = COALESCE(NEW.workout_id, OLD.workout_id)
    ),
    total_sets = (
      SELECT COUNT(*)
      FROM exercise_sets
      WHERE workout_id = COALESCE(NEW.workout_id, OLD.workout_id)
    ),
    total_reps = (
      SELECT COALESCE(SUM(reps), 0)
      FROM exercise_sets
      WHERE workout_id = COALESCE(NEW.workout_id, OLD.workout_id)
    ),
    average_rpe = (
      SELECT ROUND(AVG(rpe), 1)
      FROM exercise_sets
      WHERE workout_id = COALESCE(NEW.workout_id, OLD.workout_id)
      AND rpe IS NOT NULL
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.workout_id, OLD.workout_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_workout_metrics
  AFTER INSERT OR UPDATE OR DELETE ON exercise_sets
  FOR EACH ROW EXECUTE FUNCTION update_workout_metrics();

-- Calculate estimated 1RM using Brzycki formula
CREATE OR REPLACE FUNCTION calculate_estimated_1rm()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.weight_kg IS NOT NULL AND NEW.reps IS NOT NULL AND NEW.reps BETWEEN 1 AND 12 THEN
    NEW.estimated_1rm = ROUND(NEW.weight_kg * (36 / (37 - NEW.reps)), 2);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_1rm
  BEFORE INSERT OR UPDATE ON exercise_sets
  FOR EACH ROW EXECUTE FUNCTION calculate_estimated_1rm();
```

---

## 🔐 Sécurité

### Authentication & Authorization

#### JWT Token Management
```typescript
// services/auth.ts
export class AuthService {
  private static instance: AuthService;
  private refreshTimer: NodeJS.Timeout | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Setup automatic token refresh
    this.setupTokenRefresh(data.session);

    return data;
  }

  private setupTokenRefresh(session: Session) {
    const expiresIn = session.expires_in * 1000; // Convert to milliseconds
    const refreshTime = expiresIn - (5 * 60 * 1000); // Refresh 5 minutes before expiry

    this.refreshTimer = setTimeout(async () => {
      await this.refreshSession();
    }, refreshTime);
  }

  private async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      // Handle refresh failure - redirect to login
      this.signOut();
      return;
    }

    this.setupTokenRefresh(data.session);
  }

  async signOut() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    await supabase.auth.signOut();
  }
}
```

#### Row Level Security Implementation
```sql
-- Advanced RLS for enhanced features
CREATE POLICY "Enhanced athletes can access cycle data" ON cycle_logs
  FOR ALL USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND subscription_tier IN ('pro', 'elite')
    )
  );

-- Share workout with training partners
CREATE POLICY "Shared workouts visible to partners" ON workouts
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM training_partners tp
      WHERE tp.partner_id = auth.uid()
      AND tp.user_id = workouts.user_id
      AND tp.can_view_workouts = true
    )
  );
```

### Data Encryption

#### Sensitive Data Encryption
```typescript
// utils/encryption.ts
import CryptoJS from 'crypto-js';

export class EncryptionService {
  private static getEncryptionKey(): string {
    // Derive key from user's authentication token + device ID
    const userToken = supabase.auth.session()?.access_token;
    const deviceId = getUniqueId();
    return CryptoJS.SHA256(userToken + deviceId).toString();
  }

  static encrypt(data: any): string {
    const key = this.getEncryptionKey();
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return encrypted;
  }

  static decrypt(encryptedData: string): any {
    const key = this.getEncryptionKey();
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
}

// Enhanced athlete data encryption
export const saveCycleData = async (cycleData: CycleData) => {
  const encryptedData = EncryptionService.encrypt(cycleData);

  await supabase.from('cycle_logs').insert({
    user_id: getCurrentUserId(),
    encrypted_data: encryptedData,
    // Only non-sensitive metadata in plaintext
    cycle_type: cycleData.type,
    start_date: cycleData.startDate,
  });
};
```

### API Security

#### Rate Limiting
```typescript
// supabase/functions/rate-limiter/index.ts
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (userId: string, limit: number = 100, windowMs: number = 60000) => {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimiter.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
};
```

---

## ⚡ Performance

### Frontend Optimization

#### Bundle Optimization
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Bundle splitting for analytics
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Optimize images
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Tree shaking for chart libraries
config.resolver.alias = {
  'victory-native': 'victory-native/lib/index',
  'react-native-chart-kit': 'react-native-chart-kit/dist/index',
};

module.exports = config;
```

#### Component Optimization
```typescript
// components/workout/ExerciseCard.tsx
import React, { memo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: (exerciseId: string) => void;
}

export const ExerciseCard = memo<ExerciseCardProps>(({ exercise, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(exercise.id);
  }, [exercise.id, onPress]);

  return (
    <Pressable onPress={handlePress}>
      <View>
        <Text>{exercise.name}</Text>
        <Text>{exercise.primaryMuscles.join(', ')}</Text>
      </View>
    </Pressable>
  );
});

ExerciseCard.displayName = 'ExerciseCard';
```

#### Lazy Loading Strategy
```typescript
// app/(tabs)/analytics/index.tsx
import React, { Suspense } from 'react';
import { View } from 'react-native';

// Lazy load heavy chart components
const ProgressChart = React.lazy(() => import('../../../components/charts/ProgressChart'));
const VolumeChart = React.lazy(() => import('../../../components/charts/VolumeChart'));

export default function AnalyticsScreen() {
  return (
    <View>
      <Suspense fallback={<ChartSkeleton />}>
        <ProgressChart />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <VolumeChart />
      </Suspense>
    </View>
  );
}
```

### Backend Performance

#### Database Query Optimization
```sql
-- Materialized view for expensive analytics
CREATE MATERIALIZED VIEW user_progress_summary AS
SELECT
  u.id as user_id,
  COUNT(DISTINCT w.id) as total_workouts,
  COALESCE(SUM(w.total_volume_kg), 0) as total_volume,
  ROUND(AVG(w.average_rpe), 2) as avg_rpe,
  ARRAY_AGG(DISTINCT UNNEST(w.muscle_groups_trained)) as trained_muscles
FROM users u
LEFT JOIN workouts w ON u.id = w.user_id
WHERE w.date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY u.id;

-- Refresh strategy
CREATE OR REPLACE FUNCTION refresh_progress_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_progress_summary;
END;
$$ LANGUAGE plpgsql;

-- Scheduled refresh (once daily)
SELECT cron.schedule('refresh-progress', '0 2 * * *', 'SELECT refresh_progress_summary();');
```

#### Caching Strategy
```typescript
// services/cache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class CacheService {
  private static readonly CACHE_PREFIX = 'halterofit_';
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await AsyncStorage.getItem(this.CACHE_PREFIX + key);
      if (!cachedData) return null;

      const { data, expiresAt } = JSON.parse(cachedData);

      if (Date.now() > expiresAt) {
        await this.remove(key);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  static async set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): Promise<void> {
    const cacheItem = {
      data,
      expiresAt: Date.now() + ttl,
    };

    await AsyncStorage.setItem(
      this.CACHE_PREFIX + key,
      JSON.stringify(cacheItem)
    );
  }

  static async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(this.CACHE_PREFIX + key);
  }
}

// Usage in workout service
export const getWorkouts = async (userId: string): Promise<Workout[]> => {
  const cacheKey = `workouts_${userId}`;

  // Try cache first
  const cached = await CacheService.get<Workout[]>(cacheKey);
  if (cached) return cached;

  // Fetch from API
  const { data } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId);

  // Cache the result
  await CacheService.set(cacheKey, data, 10 * 60 * 1000); // 10 minutes

  return data;
};
```

---

## 🚀 Déploiement

### Environment Configuration

#### Environment Variables
```bash
# .env.production
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
EXPO_PUBLIC_POSTHOG_KEY=your-posthog-key

# .env.development
EXPO_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
EXPO_PUBLIC_APP_ENV=development
```

#### EAS Build Configuration
```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "ENVIRONMENT": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "ENVIRONMENT": "preview"
      }
    },
    "production": {
      "env": {
        "ENVIRONMENT": "production"
      },
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id",
        "ascAppId": "your-asc-app-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./android-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/build-and-deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build-preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Build preview
        run: eas build --platform all --profile preview --non-interactive

  build-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Build production
        run: eas build --platform all --profile production --non-interactive

      - name: Submit to stores
        run: eas submit --platform all --non-interactive
```

---

## 📊 Monitoring

### Error Tracking with Sentry
```typescript
// services/monitoring.ts
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_APP_ENV,
  enableInExpoDevelopment: false,
});

export const logError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('error_context', context);
    }
    Sentry.captureException(error);
  });
};

export const logPerformance = (operation: string, duration: number) => {
  Sentry.addBreadcrumb({
    message: `Performance: ${operation}`,
    data: { duration },
    level: 'info',
  });
};
```

### Analytics with PostHog
```typescript
// services/analytics.ts
import PostHog from 'posthog-react-native';

PostHog.setup(process.env.EXPO_PUBLIC_POSTHOG_KEY, {
  host: 'https://app.posthog.com',
});

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  PostHog.capture(event, properties);
};

export const trackWorkoutCompleted = (workout: Workout) => {
  trackEvent('workout_completed', {
    duration_minutes: workout.durationMinutes,
    total_volume: workout.totalVolume,
    exercises_count: workout.exercises.length,
    average_rpe: workout.averageRPE,
  });
};

export const trackPlateauDetected = (exercise: string, confidence: number) => {
  trackEvent('plateau_detected', {
    exercise,
    confidence,
    user_experience_level: getCurrentUser()?.experienceLevel,
  });
};
```

---

## 🔮 Architecture Évolutive

### Phase 2: Scale Architecture (1K-10K users)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Load Balancer │    │   Supabase      │
│   Mobile App    │────│   (Cloudflare)  │────│   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ├─────────────────────────────────┐
                                │                                 │
                       ┌─────────────────┐              ┌─────────────────┐
                       │   Python API    │              │   Redis Cache   │
                       │   (FastAPI)     │──────────────│   (ElastiCache) │
                       └─────────────────┘              └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   ML Pipeline   │
                       │   (SageMaker)   │
                       └─────────────────┘
```

### Phase 3: Enterprise Architecture (10K+ users)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   GraphQL       │    │   Auth Service  │
│   Mobile App    │────│   Gateway       │────│   (Cognito)     │
└─────────────────┘    │   (AppSync)     │    └─────────────────┘
                       └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
       ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
       │   Workout API   │ │  Analytics API  │ │   Social API    │
       │   (Lambda)      │ │   (Lambda)      │ │   (Lambda)      │
       └─────────────────┘ └─────────────────┘ └─────────────────┘
                │               │               │
       ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
       │   PostgreSQL    │ │   ClickHouse    │ │   DynamoDB      │
       │   (RDS)         │ │   (Analytics)   │ │   (Social)      │
       └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Migration Strategy

#### Database Migration Plan
```typescript
// migrations/001_add_enhanced_features.sql
-- Phase 2 additions
CREATE TABLE IF NOT EXISTS cycle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cycle_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  encrypted_data TEXT, -- Sensitive cycle information
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 3 additions
CREATE TABLE IF NOT EXISTS training_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  relationship_type TEXT DEFAULT 'partner',
  can_view_workouts BOOLEAN DEFAULT false,
  can_view_progress BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, partner_id)
);
```

#### Service Decomposition
```typescript
// Phase 2: Add Python analytics service
interface AnalyticsService {
  calculatePlateauProbability(userId: string, exerciseId: string): Promise<number>;
  generateWorkoutRecommendations(readinessScore: number): Promise<WorkoutRecommendation[]>;
  detectAnomalies(userId: string): Promise<Anomaly[]>;
}

// Phase 3: Microservices architecture
interface ServiceRegistry {
  auth: AuthService;
  workouts: WorkoutService;
  analytics: AnalyticsService;
  social: SocialService;
  notifications: NotificationService;
  ai: AIService;
}
```

---

*Dernière mise à jour: 2025-01-XX*
*Version: Architecture 1.0*
*Status: Ready for implementation*