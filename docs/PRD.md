# Product Requirements Document: Halterofit

**Version:** 1.0
**Last Updated:** October 2025
**Document Status:** Draft
**Target Release:** MVP - 14 weeks from project start

---

## Product overview

### Document purpose

This product requirements document defines the scope, features, and technical requirements for Halterofit MVP, an offline-first fitness tracking mobile application for serious bodybuilders and strength athletes. This document serves as the single source of truth for the development team during the 14-week MVP development cycle.

### Product summary

Halterofit is a mobile fitness tracking application designed for serious lifters who demand intelligent progression analytics. Unlike existing apps that only track raw data, Halterofit provides context-aware analysis that accounts for exercise order, rest periods, nutrition phase (bulk/cut/maintenance), RIR/RPE, and training fatigue to deliver actionable insights for breaking plateaus and optimizing progression.

**Core value proposition:** Intelligent workout tracking with scientific analytics that understand context, not just numbers.

**Target market:** Serious bodybuilders, strength athletes, and powerlifters who train 3-6 times per week and require data-driven insights for progressive overload.

**Competitive differentiation:** Context-aware analytics (nutrition phase, exercise position, fatigue modeling), statistical plateau detection (Mann-Kendall test), advanced load tracking (acute/chronic ratios), personalized 1RM estimation adjusted by RIR, and comprehensive performance feedback (Workout Reports, Weekly Summaries).

---

## Goals

### Business goals

**Primary goal:** Validate product-market fit with 500+ active users within 6 months of MVP launch.

**Secondary goals:**

- Achieve <0.5% crash rate and <2s cold start time for production-quality user experience
- Build foundation for freemium monetization model ($6.99/month) post-MVP
- Establish technical architecture that scales to 10,000+ users without major refactoring
- Create comprehensive exercise library through ExerciseDB integration, saving 190 hours of manual work

**Success criteria:**

- Users complete 80%+ of started workouts (low abandonment rate)
- Average 4+ workouts logged per user per week
- 60%+ weekly retention rate after 4 weeks
- <1% data loss incidents (zero acceptable due to offline-first architecture)

### User goals

**Primary user goals:**

- Log workouts quickly (1-2 taps per set) with guaranteed data reliability
- Track progressive overload through context-aware metrics (weight, volume, intensity, fatigue)
- Detect training plateaus early using statistical analysis
- Understand progression in context of nutrition phase (bulk/cut/maintenance) and training variables

**Secondary user goals:**

- Understand which muscle groups need more volume for balanced development
- Calculate required plates for target weight (essential gym utility)
- Manage rest periods with background timer and notifications
- Track RPE/RIR for autoregulation and fatigue management

### Non-goals

**Explicitly excluded from MVP:**

- AI-based recommendations (no training data at launch; use rule-based suggestions)
- Energy readiness score (requires wearable integration for HRV/sleep data)
- Social features, workout sharing, or community elements
- Recovery optimization tools (need wearable data)
- Nutrition tracking or meal planning
- Video form analysis or coaching features
- Integration with third-party fitness trackers (post-MVP)

---

## User personas

### Primary persona: Serious bodybuilder

**Demographics:**

- Age: 22-45 years old
- Gender: All genders
- Experience: Intermediate to advanced lifters (2+ years consistent training)
- Training frequency: 4-6 workouts per week
- Primary goal: Hypertrophy and progressive overload

**Behaviors:**

- Tracks every set with precision (weight, reps, perceived difficulty, context)
- Plans workouts in advance or follows structured programs
- Adjusts training expectations based on nutrition phase (bulk, cut, or maintenance)
- Uses phone during rest periods (email, social media, workout tracking)
- Values context-aware analytics that explain why performance changes

**Pain points:**

- Current apps show raw numbers without context (no nutrition phase awareness, exercise order impact, fatigue modeling)
- No RIR/RPE tracking or intelligent analytics based on proximity to failure
- Analytics are basic: only show 1RM/weight charts without trends, regressions, or plateau alerts
- No load management (acute/chronic load ratios, overtraining detection)
- Excessive tapping required to log sets (7+ taps in some apps)
- Difficult to identify plateaus without manual analysis or understand WHY they happen

**Needs from the product:**

- Quick set logging with context tracking (RIR, exercise position, rest periods)
- Science-based analytics: statistical plateau detection (Mann-Kendall), load management (acute/chronic ratios), personalized 1RM with RIR adjustment
- Nutrition phase tracking to contextualize performance (bulk/cut/maintenance)
- Actionable insights: "Why am I plateauing? What should I change?"
- Weekly summaries and workout reports with fatigue indicators
- Reliable data capture without network dependency

### Secondary persona: Strength athlete

**Demographics:**

- Age: 25-50 years old
- Experience: Advanced lifters, competitive powerlifters or Olympic weightlifters
- Training frequency: 3-5 highly structured workouts per week
- Primary goal: Strength gains and peaking for competitions

**Behaviors:**

- Follows periodized training programs with precise loading schemes
- Tracks 1RM progression and training percentages
- Uses RPE/RIR scales for autoregulation (adjust daily based on readiness)
- Monitors fatigue and adjusts intensity based on science-backed indicators
- Reviews training logs to identify weak points and adjust programming

**Pain points:**

- Basic 1RM formulas don't account for RIR or individual response curves
- Difficult to track RPE/RIR trends and relate them to performance outcomes
- No fatigue modeling (acute vs chronic load ratios)
- Cannot analyze volume distribution across movement patterns
- Existing apps don't contextualize performance within training phases

**Needs from the product:**

- Personalized 1RM calculations adjusted by RIR and historical accuracy
- RPE/RIR tracking with trends and fatigue indicators
- Load management metrics (acute/chronic load, fatigue ratio, overtraining alerts)
- Volume analysis by lift type and movement pattern
- Science-based recommendations for deload, intensity adjustments
- Export data for coach review or personal analysis

### Role-based access

**MVP scope:** Single-user application only. No multi-user features, team accounts, or coach-client relationships.

**Post-MVP consideration:** Potential coach tier with client workout review capabilities and program assignment features.

---

## Functional requirements

### Authentication and user management

**Priority:** HIGH
**Phase:** 1 (Weeks 4-5)

**Requirements:**

- Email/password authentication via Supabase Auth with JWT tokens
- User registration with email verification
- Password reset flow via email
- Secure session management with AsyncStorage (via Supabase SDK)
- Automatic session refresh (30-day validity)
- Row-Level Security policies ensuring users only access their own data

**Acceptance criteria:**

- User can register with email and password (minimum 8 characters)
- User receives verification email and can verify account
- User can log in and session persists across app restarts
- User can reset password via email link
- User is automatically redirected to login screen if session expires
- Failed authentication attempts show clear, actionable error messages

### Offline-first architecture

**Priority:** CRITICAL
**Phase:** 0.5 (Week 3)

**Requirements:**

- expo-sqlite offline-first database for all workout data (100% Expo Go compatible)
- Automatic bidirectional sync with Supabase when internet available
- Conflict resolution using "last write wins" strategy
- Sync queue indicator in UI showing pending changes
- Workout data persists locally with guaranteed reliability

**Acceptance criteria:**

- User can log entire workout offline without interruption
- Data automatically syncs to Supabase when connection restored
- Sync indicator shows pending/syncing/synced states clearly
- Conflict resolution works correctly when same workout edited on multiple devices
- Database schema matches exactly between expo-sqlite and Supabase PostgreSQL
- Zero data loss guarantee regardless of network conditions

### Workout logging

**Priority:** CRITICAL
**Phase:** 2 (Weeks 6-8)

**Requirements:**

- Start workout from empty template or repeat last workout
- Add exercises via search/filter interface (search 1,300+ exercises locally)
- Log sets with weight, reps, and optional RPE/RIR
- Auto-fill weight and reps from previous workout for same exercise
- Quick weight adjustment buttons (+5kg, +2.5kg, -2.5kg, -5kg or lbs equivalent)
- Plate calculator showing required plates per side for target weight
- Automatic rest timer starting after set completion with background support
- Workout duration timer with background persistence
- Save workout with optional title and notes
- Edit or delete past workouts from history

**Acceptance criteria:**

- User can start workout with maximum 2 taps
- Logging a set requires maximum 2 taps when using auto-filled values
- Plate calculator accurately displays Olympic bar (20kg/45lbs) and standard bar (15kg) configurations
- Rest timer continues running when app minimized and sends notification when complete
- Workout history loads in <1 second with pagination (20 workouts per page)
- All workout data saves immediately to local database (no "save" button required)
- User can repeat previous workout with all exercises pre-populated

### Exercise library

**Priority:** HIGH
**Phase:** 3 (Weeks 9-10)

**Requirements:**

- Pre-seeded library of 1,300+ exercises from ExerciseDB API
- Exercise details: name, category, muscle groups, equipment, instructions, GIF demonstration
- Real-time search with 300ms debounce (searches local database, no API calls)
- Filter by muscle group, equipment, difficulty, and exercise type
- Create custom exercises with user-defined properties
- Mark exercises as favorites for quick access
- Exercise history showing past performance (weight progression, volume, PRs)

**Acceptance criteria:**

- Search returns results in <300ms for local database queries
- FlashList renders 500+ exercise library smoothly at 60fps on mid-range Android devices
- Exercise GIFs load from cache in <200ms using expo-image
- Custom exercises save to both Supabase and expo-sqlite with is_custom flag
- Favorites persist in AsyncStorage and sync across devices
- Exercise detail screen shows personal history if user has logged that exercise

### Analytics and progression tracking

**Priority:** HIGH
**Phase:** 4 (Weeks 11-12)

**Requirements:**

- **Context-aware metrics:** Nutrition phase tracking (bulk/cut/maintenance), exercise order impact, rest time analysis, set type classification (warmup/working/drop set)
- **Load management:** Acute Load (7-day volume), Chronic Load (28-day average), Fatigue Ratio (AL/CL), overtraining alerts
- **Advanced analytics:** Personalized 1RM adjusted by RIR and historical accuracy, plateau detection (Mann-Kendall test), regression analysis with trend lines
- **Performance feedback:** Post-workout reports (performance score, fatigue estimate, recommendations), weekly summaries (volume trends, PR highlights, deload suggestions)
- **Volume tracking:** By week/month/muscle group/movement pattern, visualized with trend lines and smoothing
- **Progression visualization:** Multi-exercise comparisons, rolling metrics, phase-based analysis (mesocycle tracking)

**Acceptance criteria:**

- Nutrition phase contextualization: "Performance stable in cut is expected, not a plateau"
- Personalized 1RM uses RIR data: "100kg × 8 @ RIR2 = higher e1RM than 105kg × 6 @ RIR0"
- Fatigue ratio alerts: "AL/CL = 1.5 → Consider deload this week"
- Plateau detection with context: "No progress + nutrition = maintenance. No progress + bulk = true plateau"
- Workout reports display within 2s of completing workout
- Charts support zoom/pan, render 1000+ points in <500ms, show trend lines/regressions
- Weekly summaries generated automatically every Monday morning

### User experience features

**Priority:** HIGH
**Phase:** Multiple phases

**Requirements:**

- Rest timer with background execution, notifications, and quick actions (+15s, Done)
- Plate calculator modal accessible from weight input field
- Superset/circuit support via exercise grouping
- RPE tracking (1-10 scale) with optional per-set or end-of-workout entry
- RIR tracking (0-5 scale) with non-intrusive UI (optional inline or summary)
- Set history display showing last 3-5 sets from previous workouts
- Rule-based weight suggestions (e.g., if RIR=0-1, suggest +2.5kg)
- Workout templates: save, edit, and start from template
- Dark theme optimized for gym lighting with high contrast

**Acceptance criteria:**

- Rest timer sends notification when complete even if app killed by system
- Plate calculator supports user-configurable available plates in settings
- Supersets display grouped exercises with clear visual indicators
- RPE/RIR entry does not block set completion (always optional)
- Set history loads instantly from expo-sqlite indexed queries
- Weight suggestions appear as subtle hints, not forced recommendations
- Templates save with exercise order, target sets/reps, and superset grouping

---

## User experience

### Entry points

**Unauthenticated users:**

- App launch → Login screen
- "Create account" link → Registration screen
- "Forgot password" link → Password reset flow

**Authenticated users:**

- App launch → Home/Workout tab (if active workout exists, show resume option)
- Bottom tab navigation: Workout | Exercises | Analytics | Profile
- Deep links (post-MVP): Workout detail, exercise detail, analytics chart

### Core user flows

#### Flow 1: Log a workout

**Scenario:** User arrives at gym and wants to start leg day workout.

**Steps:**

1. User opens app → Home/Workout tab displays "Start Workout" button
2. User taps "Start Workout" → Modal shows options: "Empty Workout" or "Repeat Last"
3. User selects "Repeat Last" → App loads previous leg workout with all exercises
4. Active workout screen displays first exercise (Squat) with last workout's sets pre-filled
5. User performs set, taps checkmark → Set logged with auto-filled 100kg × 8 reps
6. Rest timer auto-starts (3 minutes based on historical average)
7. User adjusts weight using "+5kg" button → Weight updates to 105kg
8. User taps plate calculator icon → Modal shows "Add per side: 20kg + 10kg + 2.5kg"
9. User performs set, logs with 105kg × 6 reps, taps "RIR: 2"
10. User completes all exercises, taps "End Workout"
11. Workout saves to expo-sqlite, queues for Supabase sync
12. Summary screen shows volume, duration, PRs achieved

**Success criteria:**

- Total time to log typical 5-exercise, 20-set workout: <3 minutes of interaction time
- Zero data loss even if WiFi unavailable entire workout
- Rest timer continues running during phone lock or app switching

#### Flow 2: Find and add new exercise

**Scenario:** User wants to add Romanian Deadlifts but cannot remember exact name.

**Steps:**

1. During active workout, user taps "Add Exercise" button
2. Exercise selector modal opens with search bar focused
3. User types "romanian" → Real-time results filter to matching exercises (<300ms)
4. Results show "Romanian Deadlift (Barbell)" with GIF thumbnail
5. User taps exercise → Exercise added to workout at current position
6. Set logging interface appears with empty weight/reps (no history for this exercise)
7. User logs first set → Future workouts will auto-fill from this baseline

**Success criteria:**

- Search returns results in <300ms for 1,300+ exercise database
- Exercise GIFs load from cache instantly (expo-image caching)
- No network requests during search (all data local)

#### Flow 3: Analyze progression and identify plateau

**Scenario:** User suspects bench press progress has stalled.

**Steps:**

1. User navigates to Analytics tab
2. Dashboard shows weekly volume chart, recent PRs, plateau alerts
3. Alert badge indicates "Bench Press: Potential Plateau Detected"
4. User taps alert → Exercise detail screen displays:
   - Strength progression chart (last 8 weeks)
   - Trend line showing flat slope
   - Statistical analysis: "No significant improvement detected (p=0.23)"
   - Suggestion: "Consider deload week or increase volume"
5. User taps volume distribution chart → Pie chart shows chest volume 15% below back volume
6. User reviews suggestion: "Increase chest volume by 20% to balance push/pull ratio"
7. User navigates to workout templates, adjusts Push Day template to add 2 sets

**Success criteria:**

- Plateau detection uses Mann-Kendall test with minimum 4 weeks of data
- Charts render smoothly with zoom/pan gestures for detailed analysis
- Suggestions are actionable and based on validated training principles

### Advanced features

**Workout templates:**

- Save current workout as reusable template with name and description
- Template stores exercise order, target sets/reps, superset grouping
- Start workout from template with all exercises pre-populated
- Edit templates to adjust exercises or targets

**Data export (GDPR compliance):**

- Export all user data as structured JSON file
- Includes profile, workouts, exercises, sets, analytics history
- Share via system share sheet or email

**Account management:**

- Delete account with cascade deletion of all data
- Change email address with re-verification
- Update password with current password confirmation
- Configure units (kg/lbs, km/miles) and preferences

### UI and UX highlights

**Dark theme for gym environment:**

- Deep black background (#0A0A0A) reduces eye strain in bright gym lighting
- High contrast text (#e2e8f0) for readability on treadmill or from distance
- 8px grid system ensures consistent spacing across all screens

**Mobile-first design patterns:**

- Large tap targets (44×44pt minimum) for sweaty hands or gloves
- One-handed mode support for phone usage on bench
- Landscape orientation support for video watching during rest
- Haptic feedback on critical actions (set completion, PR achieved)

**Performance optimizations:**

- FlashList for all long lists (54% FPS improvement vs FlatList)
- expo-image for aggressive GIF caching (1,300+ exercise images)
- Skeleton screens during initial load (<2s cold start target)
- expo-sqlite lazy loading (data loaded on demand, not at startup)

---

## Narrative

I am a dedicated bodybuilder training 5 times per week, currently in a cutting phase. I open Halterofit for my Push Day workout and tap "Repeat Last Workout" to load my previous session. The app instantly shows Bench Press with my last weight and reps pre-filled, along with a suggestion based on my last RIR: "Last set: 100kg × 8 @ RIR2 → Try 102.5kg for progressive overload." I perform my first set at 102.5kg × 7 @ RIR2, tap the checkmark, and my rest timer automatically starts with a 3-minute countdown. I log all my sets quickly, tracking RIR on each one.

After completing the workout, I get an immediate Workout Report: "Performance Score: 8.5/10 | Fatigue: Moderate | Volume slightly below average due to cut phase - this is expected. Consider maintaining intensity rather than pushing for PRs this week." The report also shows my Acute/Chronic Load ratio is 1.2 (healthy range), and I'm on track with my weekly volume targets given my nutrition phase.

Later that evening, I check the Analytics tab and see my Bench Press progression chart. Despite weight being stable for 3 weeks, the app doesn't flag a plateau - instead it contextualizes: "Maintaining strength during cut phase is excellent progress. Your personalized 1RM (adjusted by RIR data) actually increased 2kg." I also review my Weekly Summary showing volume distribution by muscle group, my consistency streak (23 workouts, 92% completion rate), and a recommendation: "Consider a deload week in 2 weeks based on cumulative fatigue indicators." I adjust my training plan accordingly, confident that my data tells the full story, not just raw numbers.

---

## Success metrics

### User-centric metrics

**Engagement:**

- Average workouts logged per user per week: Target 4+ (serious lifters train 4-6x/week)
- Workout completion rate: Target 80%+ (started → completed with "End Workout")
- Average sets logged per workout: Target 15-25 sets (typical bodybuilding session)
- Session duration: Target 60-90 minutes (actual workout time)

**Retention:**

- Day 1 retention: Target 80% (user completes onboarding and logs first workout)
- Week 1 retention: Target 70% (user logs 3+ workouts in first week)
- Week 4 retention: Target 60% (user establishes habit, logs 12+ workouts)
- Month 3 retention: Target 40% (product-market fit indicator)

**Feature adoption:**

- Rest timer usage: Target 70%+ of workouts use timer
- Plate calculator usage: Target 50%+ of workouts access calculator
- RPE/RIR tracking: Target 40%+ of users enable tracking
- Analytics screen views: Target 30%+ of weekly active users view analytics weekly

### Business metrics

**Growth (MVP Phase - 6 months):**

- Total registered users: Target 2,000 users
- Weekly active users: Target 500 users (25% of registered base)
- Monthly active users: Target 800 users (40% of registered base)
- Viral coefficient: Target 0.3 (each user refers 0.3 new users organically)

**Engagement quality:**

- Average lifetime workouts per user: Target 50+ workouts (12+ weeks of consistent training)
- Exercises logged per user: Target 300+ sets lifetime
- Data export requests: <5% (low indicates users trust app, not migrating away)

**Monetization readiness (Post-MVP):**

- Users hitting 30-day history limit: Target 40% (indicates need for Pro upgrade)
- Template usage: Target 30% (Pro feature candidate)
- Advanced analytics views: Target 25% (Pro feature candidate)

### Technical metrics

**Performance:**

- Cold start time: <2 seconds (app launch → first interactive screen)
- Set logging latency: <50ms (tap checkmark → set saved to database)
- Exercise search latency: <300ms (keystroke → results displayed)
- Chart render time: <500ms (1,000+ data points)
- Screen transition animations: 60fps consistently

**Reliability:**

- Crash rate: <0.5% crash-free sessions (industry standard: 99.5%+)
- ANR rate (Android): <1% (Application Not Responding errors)
- Data loss incidents: 0% (zero tolerance due to offline-first architecture)
- Sync success rate: >99% (failed syncs retry with exponential backoff)
- API error rate: <2% (Supabase API calls when online)

**Infrastructure:**

- Database query time (95th percentile): <200ms
- expo-sqlite sync duration: <5 seconds for typical user dataset (100 workouts)
- Bundle size: <10MB (initial download)
- Memory usage: <150MB during active workout
- Battery drain: <5% per hour of active use

---

## Technical considerations

### Integration points

**Supabase (Backend-as-a-Service):**

- PostgreSQL database for cloud storage and cross-device sync
- Supabase Auth for JWT-based authentication with Row-Level Security
- Supabase Storage for future user-uploaded exercise images/videos
- Supabase Realtime for future collaborative features (coach-client)
- Custom sync implementation with expo-sqlite for offline-first architecture

**ExerciseDB API:**

- One-time seed operation: Fetch 1,300+ exercises from ExerciseDB v2 API
- Transform exercise data to match internal schema (exercises table)
- Bulk insert to Supabase, sync to expo-sqlite local database
- No runtime API calls (all exercise data stored locally after seed)
- Mark exercises as is_custom = false to distinguish from user-created exercises

**Sentry (Error Monitoring):**

- Production-only error tracking and crash reporting
- Performance monitoring: screen load times, API latency, database queries
- User context attachment (user ID, session ID, no PII)
- Alert thresholds: crash rate >0.5%, error rate >5%
- Free tier supports 5,000 errors/month (sufficient for MVP)

**Expo services:**

- Expo Go for development testing (QR code workflow)
- EAS Build for production iOS and Android builds
- Expo Notifications for rest timer push notifications
- Expo Haptics for tactile feedback on critical actions
- expo-image for aggressive GIF caching (1,300+ exercise images)

### Data storage and privacy

**Three-tier storage architecture:**

**Tier 1 - expo-sqlite (Local SQLite):**

- Purpose: Offline-first relational data (workouts, exercises, sets)
- Tables: users, exercises, workouts, workout_exercises, exercise_sets
- Sync: Bidirectional sync with Supabase using custom sync logic
- Performance: Optimized for relational queries, sufficient for MVP scale
- Encryption: Available via SQLCipher if needed for sensitive data

**Tier 2 - AsyncStorage (Local Key-Value):**

- Purpose: Local-only settings and preferences (no sync to cloud)
- Data: Auth tokens, user preferences, favorites, onboarding state
- Performance: Sufficient for MVP settings/preferences storage
- Encryption: Auth tokens stored securely via Supabase SDK
- Size: <1MB typical usage

**Tier 3 - Zustand (In-Memory State):**

- Purpose: Temporary UI state during app session
- Data: Active workout state, form inputs, navigation state
- Persistence: Selected slices persisted to AsyncStorage via middleware
- Reset: State cleared on app close (except persisted slices)

**Data privacy compliance:**

- GDPR: Data export (JSON), deletion (cascade via foreign keys), consent tracking
- CCPA: User data access requests, opt-out of analytics
- App Store Privacy Manifest (iOS 17+): Declare required reason APIs
- Data minimization: Only collect essential data (email, workouts, preferences)
- No PII in logs: User identified by UUID in Sentry, never email/name

**Row-Level Security policies:**

```sql
-- Users can only access their own workouts
CREATE POLICY "Users see own workouts"
  ON workouts FOR ALL
  USING (auth.uid() = user_id);

-- Exercise library is public to all authenticated users
CREATE POLICY "Exercises are public"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);
```

### Scalability and performance

**Database scaling strategy:**

- Supabase free tier: 500MB database, 50K monthly active users (sufficient for MVP)
- expo-sqlite local storage: <50MB per user for 2 years of workout data
- Pagination: Load 20 workouts at a time, lazy load older history
- Indexes: Indexed columns for user_id, started_at, exercise_id for fast queries
- Aggregations: Pre-calculate weekly/monthly volume in background jobs (post-MVP)

**Mobile performance optimizations:**

- FlashList for all lists: 54% FPS improvement, 82% CPU reduction vs FlatList
- expo-image caching: Aggressive disk cache for 1,300 exercise GIFs
- Lazy loading: Components loaded on-demand (React.lazy, code splitting)
- Memoization: React.memo for expensive components (charts, exercise list items)
- Bundle optimization: <10MB initial bundle, code splitting for analytics charts

**Offline-first architecture benefits:**

- Zero network latency during workout logging (all writes to local database)
- Works in airplane mode, basement gyms, poor WiFi environments
- Sync queue batches changes, syncs when connection available
- Conflict resolution: Last write wins with \_changed timestamp
- Data integrity: Foreign key constraints in both SQLite and PostgreSQL

### Potential technical challenges

**Challenge 1: expo-sqlite sync implementation**

- Risk: Custom sync logic requires careful handling of conflicts and edge cases
- Mitigation: Implement comprehensive logging, "last write wins" strategy, thorough testing
- Contingency: If sync issues arise, add conflict detection and user resolution UI

**Challenge 2: Android low-end device performance**

- Risk: Mid-range Android devices (2-3 year old) struggle with 60fps animations
- Mitigation: FlashList for lists, expo-image for caching, aggressive memoization
- Testing: Test on Samsung Galaxy A52 (representative mid-range device from 2021)

**Challenge 3: Background rest timer reliability**

- Risk: iOS/Android may kill background timer to save battery
- Mitigation: Use expo-background-fetch for background execution, local notifications
- Fallback: If timer killed, show "Timer may have stopped" warning when app reopened

**Challenge 4: ExerciseDB API rate limits**

- Risk: Free tier may have rate limits for 1,300+ exercise fetch
- Mitigation: One-time seed operation, cache all data locally, no runtime calls
- Contingency: Paid tier ($9.99/month) or split seed operation into batches

**Challenge 5: Chart performance with large datasets**

- Risk: Rendering 1,000+ data points (2 years of daily workouts) may lag
- Mitigation: react-native-chart-kit sufficient for MVP, downsample data for long time ranges
- Optimization: Show last 3 months by default, "View All" loads full dataset

---

## Testing & quality assurance strategy

### Manual testing (continuous throughout MVP)

- **Platform testing:** Android via Expo Go during development
- **User acceptance testing:** Developer self-testing each feature after implementation
- **Beta testing:** Phase 5 (internal TestFlight/Play Store testing before public launch)

### Automated testing (Phase 3+)

- **Unit tests:** Core business logic (calculations, validators, formatters) - Phase 3
- **Integration tests:** Database operations, Supabase sync - Phase 3+
- **Test framework:** Jest + React Native Testing Library
- **Coverage target:** 60%+ for critical paths (workout CRUD, sync logic, analytics calculations)
- **Strategy:** Start with highest-risk areas (data persistence, sync conflicts, 1RM calculations)

### CI/CD pipeline (Phase 1 end)

- **Setup:** GitHub Actions workflow
- **Quality gates:** TypeScript type-check, ESLint, Prettier format-check
- **Automated checks:** Run on every push/PR to prevent broken commits reaching main
- **Test execution:** Run unit/integration tests when they exist (Phase 3+)
- **Value:** Catches errors before merge even if pre-commit hooks bypassed

### Pre-commit hooks (Phase 0.5 - immediate)

- **Tools:** Husky + lint-staged + commitlint
- **Checks:** Type-check, lint, format on staged files only
- **Commit convention:** Enforce conventional commits (feat/fix/docs/refactor/test/chore)
- **Value:** Prevents committing broken code, maintains clean git history

### Quality standards

- **Type safety:** TypeScript strict mode, no `any` types
- **Code quality:** ESLint rules enforced, Prettier formatting
- **Error handling:** Sentry monitoring in production (Phase 0.5)
- **Performance:** <2s cold start, 60fps interactions on mid-range Android

---

## Milestones and sequencing

### Project timeline

**Total duration:** 14 weeks
**Team size:** 1 developer (solo project)
**Methodology:** Phased delivery with critical path prioritization

### Phase breakdown

**Phase 0: Foundation Setup (Weeks 1-2) - COMPLETED**

- Expo SDK 54 project initialization with TypeScript strict mode
- Supabase project creation and client configuration
- AsyncStorage setup for settings and preferences
- Zustand state management (auth, workout stores)
- Dark theme system (colors, spacing, typography)
- Expo Router navigation structure

**Phase 0.5: Architecture and Foundation (Week 3) - IN PROGRESS**

- expo-sqlite setup with Supabase sync (COMPLETED ✓)
- Database schema implementation (5 tables: users, exercises, workouts, workout_exercises, exercise_sets)
- FlashList installation and configuration
- expo-image setup for GIF caching
- Sentry error monitoring integration
- simple-statistics library for analytics algorithms
- Jest testing infrastructure (COMPLETED ✓)
- Professional dev tools: Husky, lint-staged, commitlint (COMPLETED ✓)

**Phase 1: Authentication and Foundation (Weeks 4-5)**

- Login, registration, password reset screens
- Supabase Auth integration with JWT session management
- Form validation utilities (email format, password strength)
- Core UI components (Button, Input, Card)
- Tab navigation structure (Workout, Exercises, Analytics, Profile)
- TypeScript type definitions for database schema

**Phase 2: Workout Logging (Weeks 6-8)**

- Workout session state management with auto-save to expo-sqlite
- Active workout screen with set logger (1-2 tap workflow)
- Rest timer with background execution and notifications
- Exercise selection modal with real-time search
- Plate calculator with configurable available plates
- Workout history and detail screens
- RPE/RIR tracking with non-intrusive UX
- Workout templates (save, edit, start from template)

**Phase 3: Exercise Library (Weeks 9-10)**

- ExerciseDB API integration and Supabase seed operation
- Exercise list screen with FlashList and real-time search
- Exercise detail screen with GIF, instructions, personal history
- Custom exercise creation with user-defined properties
- Filter panel (muscle group, equipment, difficulty)
- Favorites system with AsyncStorage persistence

**Phase 4: Analytics and Smart Features (Weeks 11-12)**

- Analytics dashboard with react-native-chart-kit
- Volume tracking by week, month, muscle group
- Strength progression charts with trend lines
- Plateau detection using Mann-Kendall statistical test
- 1RM calculations (Epley, Brzycki, Lombardi formulas)
- Personal records tracking and badge system
- Rule-based weight suggestions (non-AI)

**Phase 5: Polish and Beta Launch (Weeks 13-14)**

- Performance optimization (bundle size, cold start, memory)
- Privacy Policy and Terms of Service creation
- Data export (GDPR compliance) and account deletion
- User analytics setup (PostHog or Mixpanel)
- Onboarding flow with preferences setup
- Beta testing guide and TestFlight/Play Store internal testing
- App Store compliance checklist (privacy manifest, screenshots, descriptions)

### Critical path dependencies

**Blockers for Phase 1:**

- Phase 0.5 critical corrections must complete (user persistence, error handling)
- Database schema implementation in Supabase must finalize before auth

**Blockers for Phase 2:**

- Phase 1 authentication must complete (workout data tied to user_id)
- Exercise selection requires Phase 3 ExerciseDB seed (can work with minimal seed data)

**Blockers for Phase 4:**

- Requires workout data from Phase 2 (analytics calculate on existing workouts)
- simple-statistics library from Phase 0.5 for plateau detection

**Parallel work opportunities:**

- UI components (Phase 1) can develop alongside database work (Phase 0.5)
- Analytics algorithms (Phase 4) can develop and test with mock data
- Exercise library frontend (Phase 3) can develop while ExerciseDB seed runs

### Post-MVP Performance Optimizations

**Context:** The current tech stack (expo-sqlite, AsyncStorage, react-native-chart-kit) is designed to handle MVP scale efficiently while maintaining 100% Expo Go compatibility. The following optimizations may be considered post-MVP IF performance metrics indicate bottlenecks.

**Optimization Strategy (Conservative, Metric-Driven):**

**1. Database: expo-sqlite → WatermelonDB**

- **Trigger conditions:**
  - 1000+ active users AND
  - Query performance degradation (>200ms at 95th percentile) OR
  - Sync issues at scale (failed syncs >2%)
- **Benefits:**
  - Reactive queries (automatic UI updates)
  - Optimized sync protocol
  - Better performance with large datasets
  - More mature sync solution
- **Requirements:** Development Build (native SQLite optimizations)
- **Migration effort:** 2-3 days (database abstraction layer exists)
- **Risks:** Increased complexity, native build workflow, longer iteration cycles

**2. Storage: AsyncStorage → MMKV**

- **Trigger conditions:**
  - 1000+ users AND
  - Storage operations become measurable bottleneck OR
  - User complaints about settings/preferences lag
- **Benefits:**
  - 10-30x faster read/write operations
  - Synchronous API (simpler code)
  - Built-in encryption for sensitive data
- **Requirements:** Development Build (native C++ module)
- **Migration effort:** 2-4 hours (abstraction layer ready in codebase)
- **Risks:** Low (simple API, well-tested library)

**3. Charts: react-native-chart-kit → Victory Native**

- **Trigger conditions:**
  - User feature requests for advanced interactions OR
  - Performance issues with 1000+ data points OR
  - Need for multi-line comparisons (>3 exercises)
- **Benefits:**
  - Advanced gestures (zoom, pan, pinch)
  - Better animations and interactivity
  - Skia-based rendering (better performance)
  - Interactive tooltips with full customization
- **Requirements:** Development Build (react-native-skia native module)
- **Migration effort:** 3-6 hours (chart abstraction layer exists)
- **Risks:** More dependencies, larger bundle size, Skia complexity

**Decision Framework:**

1. **Measure:** Collect performance metrics (query times, sync success rate, user complaints)
2. **Analyze:** Determine if current stack is bottleneck vs other factors
3. **Cost-benefit:** Weigh optimization gains vs Development Build complexity
4. **Decide:** Only migrate if data clearly justifies the investment
5. **Implement:** Phased rollout with thorough testing
6. **Validate:** Confirm improvements match expectations

**Development Build Note:**

Creating a Development Build (custom native build via EAS Build or local) replaces the Expo Go workflow with native Xcode/Android Studio builds. This:

- ✅ Unlocks native modules (WatermelonDB, MMKV, Victory Native/Skia)
- ❌ Increases iteration time (rebuild required for native changes)
- ❌ Adds complexity (native dependency management, platform-specific configs)
- ❌ Requires Mac for iOS builds (or EAS Build cloud service)

**Only pursue Development Build when:**

- MVP has validated product-market fit
- User base justifies optimization investment (1000+ users)
- Performance data proves need (not speculation)
- Team ready for increased complexity

**Current status:** No migration planned. MVP stack is sufficient for target scale (500-1000 users). Will revisit based on production metrics post-launch.

---

## User stories

### Authentication and account management

**US-001: User registration**

- As a new user, I want to create an account with email and password so that my workout data is saved and accessible across devices.
- Acceptance criteria:
  - Registration form validates email format and requires password ≥8 characters
  - User receives verification email from Supabase Auth
  - Successful registration creates user record in database with default preferences (kg units)
  - User redirected to onboarding flow after successful registration

**US-002: User login**

- As a returning user, I want to log in with my credentials so that I can access my workout history.
- Acceptance criteria:
  - Login form accepts email and password with validation
  - Successful login stores JWT token securely via Supabase SDK in AsyncStorage
  - Session persists across app restarts for 30 days
  - Failed login shows clear error message ("Invalid email or password")
  - User redirected to Home/Workout tab after successful login

**US-003: Password reset**

- As a user who forgot my password, I want to reset it via email so that I can regain access to my account.
- Acceptance criteria:
  - Reset flow sends email with secure reset link from Supabase
  - Reset link expires after 1 hour
  - New password must meet strength requirements (≥8 characters)
  - Successful reset invalidates old session, requires new login
  - Clear success message displayed after reset

**US-004: Account deletion**

- As a user concerned about privacy, I want to permanently delete my account and all associated data.
- Acceptance criteria:
  - "Delete Account" button in Profile/Settings with destructive styling
  - Confirmation dialog warns "This action cannot be undone. All workouts will be permanently deleted."
  - Deletion cascades to all tables (workouts, workout_exercises, exercise_sets) via foreign keys
  - expo-sqlite local database cleared, AsyncStorage reset
  - User logged out and redirected to login screen

**US-005: Data export**

- As a user, I want to export all my workout data as a file for backup or analysis purposes.
- Acceptance criteria:
  - "Export My Data" button in Profile/Settings
  - Export generates structured JSON file with profile, workouts, exercises, sets
  - File includes metadata: export_date, user_id, total_workouts, total_sets
  - Share via system share sheet (email, cloud storage, messaging)
  - Export completes in <10 seconds for 2 years of workout data (500 workouts)

### Workout logging

**US-006: Start empty workout**

- As a user, I want to start a new workout without any pre-filled exercises so that I can create a spontaneous training session.
- Acceptance criteria:
  - "Start Workout" button on Home/Workout tab
  - Tapping button creates new workout record in expo-sqlite with started_at timestamp
  - Active workout screen displays with empty exercise list and "Add Exercise" button
  - Workout duration timer starts immediately
  - Workout saves to database without internet connection

**US-007: Repeat last workout**

- As a user, I want to quickly load my previous workout with all exercises pre-populated so that I can save time and ensure consistency.
- Acceptance criteria:
  - "Repeat Last Workout" option when starting workout
  - Fetches most recent completed workout from expo-sqlite
  - Creates new workout with same exercises, order, and superset grouping
  - Pre-fills target sets and reps from previous workout
  - Last weight and reps displayed for each exercise for easy reference
  - User can modify exercises before or during workout

**US-008: Log a set**

- As a user, I want to log a set with weight and reps in 1-2 taps so that I can quickly return to my workout.
- Acceptance criteria:
  - Weight and reps input fields pre-filled from last set or last workout
  - Quick adjustment buttons: +5kg, +2.5kg, -2.5kg, -5kg (or lbs equivalent)
  - Tapping checkmark immediately saves set to expo-sqlite
  - Set save latency <50ms (no loading spinner required)
  - Rest timer auto-starts after set completion
  - Set history shows last 3-5 sets from previous workouts below input

**US-009: Track RPE**

- As a user, I want to optionally log RPE (Rate of Perceived Exertion) for each set to track intensity and manage fatigue.
- Acceptance criteria:
  - RPE selector with 1-10 scale visible as optional buttons
  - Color-coded: green (1-5), yellow (6-7), orange (8-9), red (10)
  - Tapping RPE value saves to set record, can be changed after set completion
  - RPE is optional - set can be completed without selecting RPE
  - Setting toggle in Profile/Settings to enable/disable RPE tracking

**US-010: Track RIR**

- As a user, I want to log RIR (Reps in Reserve) to gauge proximity to failure without making RPE calculations.
- Acceptance criteria:
  - RIR selector with 0-5 scale (0=failure, 5=very easy)
  - Non-intrusive UI: small inline button or end-of-workout summary prompt
  - User can enable RIR tracking in settings (default: disabled for simplicity)
  - RIR saves to exercise_sets.rir field in database
  - Analytics can display RIR trends over time for progressive overload analysis

**US-011: Use rest timer**

- As a user, I want an automatic rest timer that runs in the background and notifies me when rest is complete.
- Acceptance criteria:
  - Timer auto-starts after set completion with duration from historical average (default 90 seconds)
  - Timer continues when app minimized or phone locked
  - Push notification sent when timer reaches 0:00 with sound and vibration
  - Notification quick actions: "+15s" (add time), "Done" (dismiss)
  - Haptic feedback at 10s, 5s, 0s countdown
  - User can skip timer, add time, or manually start/stop via UI controls

**US-012: Use plate calculator**

- As a user, I want to see which plates to load on each side of the barbell for my target weight.
- Acceptance criteria:
  - Small calculator icon next to weight input field
  - Tapping icon opens modal showing plate breakdown per side
  - Example: "100kg total → Bar: 20kg + Per side: 20kg, 10kg, 10kg"
  - Supports Olympic bar (20kg/45lbs) and standard bar (15kg/35lbs)
  - User can configure available plates in settings (default: 20, 15, 10, 5, 2.5, 1.25 kg)
  - Calculator accounts for bar weight correctly

**US-013: Add exercise to workout**

- As a user, I want to add exercises to my active workout by searching the exercise library.
- Acceptance criteria:
  - "Add Exercise" button during active workout
  - Opens exercise selector modal with search bar auto-focused
  - Real-time search filters 1,300+ exercises locally in <300ms
  - Recently used exercises appear at top of list
  - Favorited exercises marked with star icon
  - Tapping exercise adds to workout, closes modal, shows set logging interface

**US-014: Complete workout**

- As a user, I want to finish my workout and review a summary of my session.
- Acceptance criteria:
  - "End Workout" button in active workout screen header
  - Tapping button sets completed_at timestamp and calculates total duration_seconds
  - Summary screen displays: total duration, exercises completed, sets logged, volume (kg × reps × sets)
  - Personal records achieved highlighted with badge icons
  - Option to add workout notes before final save
  - Workout immediately saved to expo-sqlite, queued for Supabase sync

**US-015: View workout history**

- As a user, I want to see a list of my past workouts sorted by date so that I can review my training consistency.
- Acceptance criteria:
  - History screen displays workouts in reverse chronological order (newest first)
  - Each item shows: date, duration, number of exercises, total volume
  - Pagination loads 20 workouts at a time with "Load More" button
  - Swipe actions: "Repeat" (start new workout from template), "Delete" (with confirmation)
  - Tapping workout opens detail screen with full exercise and set breakdown
  - History loads in <1 second using expo-sqlite indexed query

**US-016: Edit past workout**

- As a user, I want to edit a previously logged workout to correct mistakes or add missing sets.
- Acceptance criteria:
  - "Edit" button in workout detail screen
  - Edit mode allows modifying sets (weight, reps, RPE, RIR), adding/removing exercises
  - Changes save to expo-sqlite immediately, queue for Supabase sync
  - Edited workouts show "Last edited: [timestamp]" in detail screen
  - Cannot edit completed_at timestamp (prevents cheating on consistency metrics)

### Exercise library

**US-017: Search exercises**

- As a user, I want to search for exercises by name or muscle group so that I can quickly find what I need.
- Acceptance criteria:
  - Search bar with placeholder "Search 1,300+ exercises..."
  - Real-time filtering with 300ms debounce (prevents lag on every keystroke)
  - Searches exercise name and muscle_groups array fields
  - Fuzzy matching tolerates typos (e.g., "romanian" matches "Romanian Deadlift")
  - Results display exercise name, primary muscle, equipment, and GIF thumbnail
  - Search returns results from local expo-sqlite (no API calls)

**US-018: Filter exercises**

- As a user, I want to filter exercises by muscle group, equipment, and difficulty to narrow down options.
- Acceptance criteria:
  - Filter button opens bottom sheet modal with filter options
  - Multiple selection checkboxes for muscle groups (Chest, Back, Shoulders, Legs, Arms, Core, Full body)
  - Multiple selection for equipment (Barbell, Dumbbell, Machine, Bodyweight, Cable, Other)
  - Single selection for difficulty (Beginner, Intermediate, Advanced)
  - Active filters show count badge on filter button (e.g., "3 active")
  - Filters apply immediately to exercise list with FlashList re-render

**US-019: View exercise details**

- As a user, I want to view detailed information about an exercise including instructions and demonstration.
- Acceptance criteria:
  - Tapping exercise in library opens detail screen
  - Detail screen displays: exercise name, GIF/video demonstration, target muscles highlighted, equipment needed, step-by-step instructions, difficulty level
  - If user has logged this exercise before, show personal history: last workout, max weight, max reps, estimated 1RM
  - Actions: "Add to Favorites" (star icon), "Add to Workout" (if workout active), "View Full History"
  - GIF loads from expo-image cache in <200ms

**US-020: Create custom exercise**

- As a user, I want to create my own exercises for movements not in the library so that I can track specialized training.
- Acceptance criteria:
  - "Create Custom Exercise" button in exercise library
  - Form fields: name (required), type (strength/cardio/timed/bodyweight), category (compound/isolation), muscle groups (multi-select), equipment (select), instructions (text area), difficulty
  - Optional image upload (expo-image-picker) saved to Supabase Storage
  - Custom exercise marked with is_custom = true, created_by = user_id
  - Saves to Supabase exercises table, syncs to expo-sqlite
  - Custom exercises appear in search/filter alongside ExerciseDB exercises

**US-021: Favorite exercises**

- As a user, I want to mark exercises as favorites so that I can quickly access my most-used movements.
- Acceptance criteria:
  - Star icon in exercise list items and detail screen
  - Tapping star toggles favorite state with haptic feedback
  - Favorites stored in AsyncStorage as array of exercise IDs (fast access)
  - Syncs to Supabase for cross-device consistency
  - Filter option "Show Favorites Only" displays only favorited exercises
  - Favorited exercises appear at top of exercise selector during workout

### Analytics and progression

**US-022: View analytics dashboard**

- As a user, I want to see an overview of my training progress with charts and key metrics.
- Acceptance criteria:
  - Analytics tab displays dashboard with sections: weekly volume chart (bar chart), strength progression (line chart for selected exercises), workout frequency (calendar heatmap), personal records (list with badges), body part volume distribution (pie chart)
  - Charts render in <500ms using react-native-chart-kit with 1,000+ data points
  - Default time range: last 3 months (user can adjust to 1 month, 6 months, 1 year, all time)
  - Tapping chart sections navigates to detailed views

**US-023: Track volume progression**

- As a user, I want to see my weekly and monthly training volume to ensure I am progressively overloading.
- Acceptance criteria:
  - Volume calculation: Σ (sets × reps × weight) per week/month
  - Compound exercises weighted 1.5x (squat, deadlift, bench press)
  - Bar chart shows volume by week with trend line (linear regression)
  - Color-coded bars: green (volume increase), yellow (same volume), red (volume decrease)
  - Breakdown by muscle group available (toggle between total and per-muscle-group)

**US-024: Analyze strength progression**

- As a user, I want to see charts showing my strength gains over time for specific exercises.
- Acceptance criteria:
  - Select up to 3 exercises to compare on same chart
  - Line chart shows max weight lifted per week over selected time range
  - Estimated 1RM plotted alongside actual weight (calculated using Epley, Brzycki, Lombardi average)
  - Trend line shows overall progression direction with slope annotation
  - Personal records marked with badge icons on chart
  - Zoom/pan gestures supported for detailed inspection

**US-025: Detect plateaus**

- As a user, I want the app to notify me when my progress has stalled so that I can adjust my training.
- Acceptance criteria:
  - Plateau detection runs Mann-Kendall statistical test on 4-8 week rolling window
  - Algorithm identifies plateau when slope <0.5 kg/week AND p-value >0.05 (no significant trend)
  - Alert badge appears on Analytics dashboard: "Bench Press: Plateau Detected"
  - Tapping alert shows chart with flat trend line and statistical summary
  - Suggestion provided: "Consider deload week, increase volume, or change exercise variation"
  - Plateau detection requires minimum 4 weeks of consistent data (2+ workouts/week)

**US-026: View personal records**

- As a user, I want to see my personal bests for each exercise so that I can celebrate achievements.
- Acceptance criteria:
  - Personal records tracked per exercise: max weight, max reps, max volume (sets × reps × weight), estimated 1RM
  - Records list sortable by date achieved, exercise name, muscle group
  - Badge icons displayed when PR achieved during workout summary
  - Tapping PR opens workout detail where record was set
  - Records sync across devices via Supabase

**US-027: Calculate estimated 1RM**

- As a user, I want to see my estimated 1-rep max for exercises even if I never test it directly.
- Acceptance criteria:
  - 1RM calculated using average of three validated formulas: Epley [weight × (1 + reps/30)], Brzycki [weight × (36 / (37 - reps))], Lombardi [weight × reps^0.1]
  - Calculation most accurate for 1-10 rep range, shows warning for 10+ reps ("Estimate less accurate for high reps")
  - Estimated 1RM displayed in exercise detail screen and analytics charts
  - Historical 1RM progression chart shows trend over time

**US-028: Analyze volume distribution**

- As a user, I want to see how my training volume is distributed across muscle groups to ensure balanced development.
- Acceptance criteria:
  - Pie chart or horizontal bar chart showing volume % per muscle group (Chest, Back, Shoulders, Legs, Arms, Core)
  - Calculation based on last 4 weeks of training
  - Suggestions displayed if imbalance detected: "Chest volume 15% below back. Consider adding 2-3 sets per week."
  - Comparison view: current month vs previous month to track changes

### Settings and preferences

**US-029: Configure unit preferences**

- As a user, I want to set my preferred units (kg/lbs, km/miles) so that all data displays in my preferred system.
- Acceptance criteria:
  - Settings screen with toggles: Weight (kg/lbs), Distance (km/miles)
  - Changing units converts all existing data for display (database stores original units)
  - Unit preference saves to users.preferred_unit and users.preferred_distance_unit in Supabase
  - Syncs across devices via user profile sync

**US-030: Configure rest timer defaults**

- As a user, I want to set default rest timer durations for different exercise types so that the timer auto-starts with appropriate times.
- Acceptance criteria:
  - Settings for: Compound exercises (default 180s), Isolation exercises (default 90s), Cardio (default 60s)
  - Override option: "Use historical average" (calculates average rest from past workouts)
  - Settings save to AsyncStorage for instant access during workouts

**US-031: Configure plate calculator**

- As a user, I want to customize which plates are available at my gym so that the plate calculator shows accurate recommendations.
- Acceptance criteria:
  - Settings screen lists standard plates: 25kg, 20kg, 15kg, 10kg, 5kg, 2.5kg, 1.25kg (or lbs equivalents)
  - Checkboxes to enable/disable each plate size
  - Bar type selection: Olympic (20kg/45lbs), Standard (15kg/35lbs), Custom (user enters bar weight)
  - Settings save to AsyncStorage, immediately reflected in plate calculator

**US-032: Manage data and privacy**

- As a user, I want control over my data including export, deletion, and privacy settings.
- Acceptance criteria:
  - Data section in settings with options: "Export My Data" (JSON file), "Delete My Account" (destructive action with confirmation), "Privacy Policy" (opens web view or in-app text), "Terms of Service" (opens web view or in-app text)
  - Analytics opt-out toggle (disables PostHog/Mixpanel event tracking)
  - All privacy controls clearly labeled with explanations

### Onboarding and help

**US-033: Complete onboarding**

- As a new user, I want to be guided through initial setup so that the app is configured to my preferences.
- Acceptance criteria:
  - Onboarding flow shows on first launch only (tracked in AsyncStorage)
  - Screens: Welcome (app overview), Feature highlights (3-4 screens with images), Preferences setup (units, experience level, goals)
  - Skip button available on all screens except welcome
  - Completion saves preferences to user profile and marks onboarding_complete in AsyncStorage
  - User redirected to Home/Workout tab after completion

**US-034: Access help documentation**

- As a user, I want to access help articles or FAQs when I have questions about features.
- Acceptance criteria:
  - Help section in Profile/Settings with topics: "How to log a workout", "Understanding RPE and RIR", "Reading analytics charts", "Plate calculator guide", "Offline mode explained"
  - Each topic opens in-app text screen with instructions and screenshots
  - "Contact Support" button opens email client with pre-filled subject

**US-035: Provide feedback**

- As a user, I want to report bugs or request features so that the app can improve.
- Acceptance criteria:
  - Feedback form in Profile/Settings with fields: Type (Bug Report, Feature Request, General Feedback), Description (text area), Screenshot (optional attachment)
  - Submission sends email via Supabase Edge Function to support address
  - Confirmation message: "Thanks for your feedback! We'll review it soon."
  - Anonymous option available (no user email attached)
