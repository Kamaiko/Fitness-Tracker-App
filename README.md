# Halterofit

**Intelligent fitness tracking for serious bodybuilders**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.72+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Expo](https://img.shields.io/badge/Expo-49+-black.svg)

---

## Table of Contents
1. [Vision & Philosophy](#-vision--philosophy)
2. [MVP Features](#-mvp-features-phase-1---12-weeks)
3. [Technical Architecture](#️-technical-architecture)
4. [Success Metrics](#-success-metrics)
5. [Roadmap](#️-roadmap)
6. [Setup Instructions](#️-setup-instructions)
7. [Design System](#-design-system)

---

## 🎯 Vision & Philosophy

**Halterofit** is a data-driven fitness tracking platform built specifically for serious bodybuilders who want to optimize their training through science and analytics.

### Mission Statement
Revolutionize fitness tracking by combining modern exercise science with real athlete needs, maximizing gains through intelligent data analysis.

### Core Values
- **Science-Based**: Every feature backed by peer-reviewed research
- **Privacy-First**: Sensitive data encrypted (cycles, bloodwork)
- **Progressive Overload**: Focus on measurable progression
- **Clean Interface**: Minimal dark UI, zero bullshit

### Key Differentiators
1. **Predictive Intelligence**: Anticipates plateaus and overtraining
2. **Enhanced-Friendly**: Only app optimized for enhanced athletes
3. **Advanced RPE Analytics**: Most sophisticated effort tracking system
4. **Scientific Rigor**: Research-backed vs marketing fluff

---

## 🚀 MVP Features (Phase 1 - 12 weeks)

### Core Features

#### 1. Smart Workout Logger
- **Quick Entry**: Tap/swipe interface optimized for gym use
- **Auto Timer**: Adaptive rest periods based on exercise and RPE
- **Offline-First**: Full functionality without internet connection
- **Exercise Library**: 500+ exercises with proper instructions
- **Gesture Controls**: Swipe to adjust weights, tap to increment

#### 2. RPE Tracking System ⭐
- **1-10 Scale**: Intuitive effort rating system
- **Visual Feedback**: Clear color-coded RPE interface
- **Pattern Recognition**: "RPE higher than usual for this weight"
- **Smart Alerts**: "High RPE 3 sets in a row, consider rest"

#### 3. Performance Analytics
- **Strength Progression**: Clean charts per exercise
- **Volume Trends**: Weekly/monthly progression tracking
- **Plateau Detection**: Automatic stagnation identification (>3 weeks)
- **Export Data**: CSV export for external analysis

#### 4. Energy Readiness Score
- **Quick Assessment**: 30-second pre-workout questionnaire
- **Adaptive Recommendations**: Modify training based on readiness
- **Historical Correlation**: Track readiness vs performance

#### 5. Program Templates
- **Push/Pull/Legs**: 3, 4, 5, 6 day variations
- **Upper/Lower**: 2x and 3x frequency options
- **Full Body**: Beginner-friendly programs
- **Custom Builder**: Simple creation with volume guidelines

---

## 🏗️ Technical Architecture

### Stack Overview
```typescript
// Frontend
React Native 0.72+
Expo SDK 49+
TypeScript 5.0+ (Strict Mode)
NativeWind (Tailwind for RN)

// Backend
Supabase (PostgreSQL + Auth + Real-time)
Row Level Security
Edge Functions

// State Management
Zustand (Lightweight Redux alternative)
React Query (Server state)

// UI/Visualization
Victory Native (Charts)
Expo Router (File-based routing)

// Testing
Jest + React Testing Library
Detox (E2E testing)

// Development
ESLint + Prettier
Husky (Git hooks)
```

### Database Schema (Core Tables)
```sql
-- Users with privacy levels
users (id, email, enhanced_status, privacy_level)

-- Workout sessions
workouts (id, user_id, date, readiness_score, total_volume)

-- Exercise library
exercises (id, name, category, muscle_groups, instructions)

-- Individual sets
exercise_sets (id, workout_id, exercise_id, weight, reps, rpe)

-- Performance analytics
performance_metrics (id, user_id, date, volume_by_muscle, fatigue_index)
```

### Security & Privacy
- **End-to-End Encryption**: Sensitive cycle data
- **Anonymous Analytics**: Aggregate insights without identification
- **Row Level Security**: User data isolation
- **GDPR Compliance**: Complete data control and deletion

---

## 📊 Success Metrics

### MVP Success Criteria (3 months)
- **100 beta users** actively logging workouts
- **50% D7 retention** (industry benchmark: 25%)
- **NPS > 40** (satisfaction score)
- **3.5 workouts/week** per active user

### Business Metrics (12 months)
- **2,000 registered users**
- **500 weekly actives**
- **$5,000 MRR** (Monthly Recurring Revenue)
- **4.0+ app store rating**

### Technical KPIs
- **<2 second load times** on 3G
- **99.9% uptime**
- **<0.1% crash rate**
- **95% workout completion rate**

---

## 🗓️ Roadmap

### Phase 1: MVP (Months 1-3)
**Goal**: Validate product-market fit with core features

**Sprint 1-2: Foundation**
- Project setup (React Native + Expo + TypeScript)
- Supabase configuration and auth
- Core database schema implementation
- Basic workout logging interface

**Sprint 3-4: Analytics**
- RPE tracking system
- Basic performance charts
- Plateau detection algorithm
- Data export functionality

**Sprint 5-6: Polish**
- Dark theme implementation
- Offline functionality
- Performance optimization
- Beta user testing

### Phase 2: Intelligence (Months 4-6)
**Goal**: Advanced analytics and social features

- Advanced program builder with auto-periodization
- Voice commands for logging
- Social features (leaderboards, progress sharing)
- Wearable device integration (HRV, sleep)

### Phase 3: Enhanced Platform (Months 7+)
**Goal**: Unique differentiators and monetization

- Enhanced athlete ecosystem (cycle tracking)
- AI coaching recommendations
- Body composition analysis
- Coaching marketplace

---

## ⚙️ Setup Instructions

### Prerequisites
```bash
Node.js 18+
npm or yarn
Expo CLI
iOS Simulator / Android Studio (for development)
```

### Installation
```bash
# Clone repository
git clone https://github.com/username/halterofit.git
cd halterofit

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Add your Supabase credentials

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Environment Variables
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_API_BASE_URL=your_api_url
```

### Development Scripts
```bash
npm start                # Start Expo development server
npm test                 # Run tests
npm run lint             # ESLint code checking
npm run type-check       # TypeScript validation
npm run format           # Prettier formatting
npm run build:android    # Build Android APK
npm run build:ios        # Build iOS IPA
```

---

## 🎨 Design System

### Color Palette
```typescript
// Dark theme (primary)
background: '#0f1419'     // Deep black
surface: '#1a202c'        // Card backgrounds
primary: '#4299e1'        // Brand blue
success: '#38a169'        // Progress green
warning: '#d69e2e'        // Caution amber
danger: '#e53e3e'         // Critical red
text: '#e2e8f0'          // Light text
```

### Typography
```typescript
// Font families
primary: 'SF Pro Display'  // Headers
body: 'SF Pro Text'        // Body text
mono: 'SF Mono'           // Numbers, data

// Scale (1.25 modular scale)
xs: 12px, sm: 14px, base: 16px
lg: 18px, xl: 20px, 2xl: 24px
3xl: 30px, 4xl: 36px, 5xl: 48px
```

### Component Guidelines
- **Touch Targets**: Minimum 44px for accessibility
- **Spacing**: 8px grid system (4, 8, 16, 24, 32px)
- **Shadows**: Subtle elevation for cards and modals
- **Animations**: 200ms duration for smooth interactions

---

## 🚀 Future Vision (Phase 2-3)

### Enhanced Athlete Features
- **Cycle Tracking**: Discrete blast/cruise/PCT monitoring
- **Biomarker Analysis**: Anonymous bloodwork trend analysis
- **Performance Correlation**: Dosage vs gains statistical insights
- **Health Monitoring**: Discrete side effect tracking

### AI Coaching Platform
- **Plateau Breaking**: Advanced algorithmic protocols
- **Personalized Programming**: AI-generated workout plans
- **Recovery Optimization**: Multi-source data integration
- **Performance Prediction**: 3-6-12 month projections

### Platform Ecosystem
- **Coaching Marketplace**: Expert-created programs
- **Research Contribution**: Anonymous data for exercise science
- **API Access**: Third-party integrations
- **Enterprise Features**: Gym chain partnerships

---

## 📄 Documentation

### Technical Documentation
- [Project Plan](docs/PROJECT_PLAN.md) - Complete development strategy and vision
- [Architecture Guide](docs/ARCHITECTURE.md) - Detailed technical architecture
- [MVP Roadmap](docs/MVP_ROADMAP.md) - Sprint-by-sprint development plan
- [Success Metrics](docs/METRICS.md) - KPIs and measurement strategy
- [Project Structure](docs/STRUCTURE.md) - Folder organization guide

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Target Users

### Primary: Serious Natural Lifters
- **Experience**: 2-5 years serious training
- **Goals**: Break plateaus, track progression
- **Pain Points**: Generic apps, lack of intelligence
- **Value**: "Finally an app that understands serious lifting"

### Secondary: Natural Competitors
- **Experience**: Competitive bodybuilding/physique
- **Goals**: Periodization, competition prep optimization
- **Pain Points**: Complex periodization, fatigue detection
- **Value**: "Analytics that understand comp prep"

### Future: Enhanced Athletes (Phase 2)
- **Experience**: 5+ years, enhanced protocols
- **Goals**: Optimize cycles, maximize gains, health monitoring
- **Pain Points**: No tools for enhanced athletes
- **Value**: "The only enhanced-friendly app in the world"

---

**Built for serious athletes who want to optimize their training through data and science.**