# 📊 Métriques & KPIs - Halterofit
**Système de mesure complet pour le succès du MVP**

---

## 📋 Table des Matières
1. [Philosophy & Objectifs](#-philosophy--objectifs)
2. [Métriques MVP](#-métriques-mvp)
3. [Analytics Framework](#-analytics-framework)
4. [User Journey Metrics](#-user-journey-metrics)
5. [Feature-Specific KPIs](#️-feature-specific-kpis)
6. [Business Metrics](#-business-metrics)
7. [Technical Performance](#⚡-technical-performance)
8. [Monitoring Setup](#-monitoring-setup)
9. [Dashboard & Reporting](#-dashboard--reporting)

---

## 🎯 Philosophy & Objectifs

### Measurement Philosophy
- **Data-Driven Decisions** : Chaque feature decision basée sur métriques
- **User-Centric Focus** : Success = user satisfaction + retention
- **Leading vs Lagging** : Track leading indicators pour prédire success
- **Actionable Insights** : Métriques qui drive des actions concrètes

### Success Definition Hierarchy
```typescript
interface SuccessDefinition {
  northStar: "Monthly Active Users (MAU) growth rate";
  primary: [
    "User Retention (D1, D7, D30)",
    "Feature Adoption Rate",
    "User Engagement Depth"
  ];
  secondary: [
    "Technical Performance",
    "User Satisfaction (NPS)",
    "Content Quality"
  ];
  business: [
    "Customer Acquisition Cost (CAC)",
    "Lifetime Value (LTV)",
    "Revenue Metrics"
  ];
}
```

---

## 🎯 Métriques MVP

### Core Success Criteria (12 weeks)

#### Phase 1: Technical Validation (Semaines 1-4)
```typescript
interface TechnicalValidationKPIs {
  performance: {
    coldStartTime: {
      target: "< 2000ms";
      measurement: "App launch to first interactive screen";
      tools: ["Flipper", "React Native Performance"];
    };
    crashRate: {
      target: "< 0.1%";
      measurement: "Crashes per session";
      tools: ["Sentry", "Crashlytics"];
    };
    memoryUsage: {
      target: "< 150MB";
      measurement: "Peak RAM usage during typical workout";
      tools: ["Flipper", "Xcode Instruments"];
    };
    batteryDrain: {
      target: "< 5% per hour";
      measurement: "Battery consumption during active use";
      tools: ["Device monitoring"];
    };
  };

  development: {
    featuresDelivered: {
      target: "3-5 per week";
      measurement: "Completed user stories per sprint";
      tools: ["GitHub", "Linear"];
    };
    bugFixTime: {
      target: "< 24h for critical";
      measurement: "Time from bug report to resolution";
      tools: ["Sentry", "GitHub Issues"];
    };
    testCoverage: {
      target: "> 70%";
      measurement: "Code coverage percentage";
      tools: ["Jest", "Codecov"];
    };
    buildTime: {
      target: "< 10 minutes";
      measurement: "CI/CD pipeline execution time";
      tools: ["GitHub Actions", "EAS Build"];
    };
  };
}
```

#### Phase 2: User Validation (Semaines 5-8)
```typescript
interface UserValidationKPIs {
  acquisition: {
    betaSignups: {
      target: 100;
      measurement: "Total registered beta users";
      source: "Supabase Analytics";
    };
    signupConversion: {
      target: "80%";
      measurement: "Landing page visit → successful signup";
      source: "PostHog funnel analysis";
    };
    onboardingCompletion: {
      target: "70%";
      measurement: "Users completing full onboarding flow";
      source: "PostHog event tracking";
    };
    profileCompletion: {
      target: "60%";
      measurement: "Users filling complete profile information";
      source: "Database analytics";
    };
  };

  engagement: {
    D1Retention: {
      target: "80%";
      measurement: "Users returning day after signup";
      calculation: "Users active D1 / Total signups";
    };
    D7Retention: {
      target: "50%";
      measurement: "Users active 7 days after signup";
      calculation: "Users active D7 / Total signups";
    };
    D30Retention: {
      target: "30%";
      measurement: "Users active 30 days after signup";
      calculation: "Users active D30 / Total signups";
    };
    sessionDuration: {
      target: "8 minutes average";
      measurement: "Average time per workout session";
      source: "App analytics + workout duration tracking";
    };
    workoutsPerWeek: {
      target: "3.5 per active user";
      measurement: "Weekly workout frequency for engaged users";
      calculation: "Total workouts / Active users / Weeks";
    };
  };

  quality: {
    workoutCompletionRate: {
      target: "85%";
      measurement: "Started workouts that are completed";
      calculation: "Completed workouts / Started workouts";
    };
    dataAccuracy: {
      target: "95%";
      measurement: "Sets logged without errors/corrections";
      source: "User correction patterns";
    };
    supportTickets: {
      target: "< 2% of users";
      measurement: "Users submitting support requests";
      calculation: "Support requests / Total users";
    };
  };
}
```

#### Phase 3: Product-Market Fit (Semaines 9-12)
```typescript
interface PMFValidationKPIs {
  satisfaction: {
    NPS: {
      target: "> 40";
      measurement: "Net Promoter Score";
      survey: "How likely are you to recommend Halterofit?";
      frequency: "Bi-weekly survey to active users";
    };
    appStoreRating: {
      target: "> 4.2";
      measurement: "Average rating on app stores";
      source: "App Store Connect + Play Console";
    };
    featureSatisfaction: {
      target: "> 7/10 average";
      measurement: "Individual feature satisfaction scores";
      survey: "Rate usefulness of each feature 1-10";
    };
  };

  adoption: {
    timerUsage: {
      target: "70%";
      measurement: "Users who use rest timer feature";
      calculation: "Users with timer events / Total users";
    };
    rpeTracking: {
      target: "60%";
      measurement: "Users consistently tracking RPE";
      calculation: "Users with >80% sets having RPE / Active users";
    };
    exerciseLibraryUsage: {
      target: "80%";
      measurement: "Users browsing exercise library";
      calculation: "Users with library views / Total users";
    };
    readinessScoreUsage: {
      target: "50%";
      measurement: "Users completing readiness assessment";
      calculation: "Users with readiness scores / Active users";
    };
    plateauDetectionEngagement: {
      target: "70%";
      measurement: "Users acting on plateau notifications";
      calculation: "Users modifying workout after plateau alert";
    };
  };

  growth: {
    organicGrowth: {
      target: "20% monthly";
      measurement: "Month-over-month user growth";
      calculation: "(New users this month / Users last month) - 1";
    };
    referralRate: {
      target: "15%";
      measurement: "Users acquired through referrals";
      calculation: "Referred users / Total new users";
    };
    viralCoefficient: {
      target: "0.3";
      measurement: "Average referrals per user";
      calculation: "Total referrals / Total users";
    };
  };
}
```

---

## 📈 Analytics Framework

### Event Tracking Structure

#### User Lifecycle Events
```typescript
interface UserLifecycleEvents {
  // Acquisition
  "user_signup_started": {
    source: string; // "landing_page", "referral", "app_store"
    utm_campaign?: string;
  };

  "user_signup_completed": {
    signup_method: "email" | "google" | "apple";
    time_to_complete: number; // seconds
  };

  // Onboarding
  "onboarding_started": { user_id: string };
  "onboarding_step_completed": {
    step: "goals" | "experience" | "body_metrics" | "preferences";
    time_spent: number;
  };
  "onboarding_completed": { total_time: number };
  "onboarding_abandoned": { last_step: string };

  // Activation
  "first_workout_started": { user_id: string };
  "first_workout_completed": {
    duration: number;
    exercises_count: number;
    sets_count: number;
  };
}
```

#### Feature Usage Events
```typescript
interface FeatureUsageEvents {
  // Workout Logging
  "workout_started": {
    workout_name: string;
    readiness_score?: number;
    planned_duration?: number;
  };

  "exercise_added": {
    exercise_name: string;
    muscle_group: string;
    selection_method: "search" | "favorite" | "recent" | "browse";
  };

  "set_logged": {
    exercise_name: string;
    weight: number;
    reps: number;
    rpe?: number;
    set_number: number;
    time_to_log: number; // seconds from previous set
  };

  "rest_timer_used": {
    duration_set: number; // seconds
    duration_actual: number; // seconds
    auto_suggested: boolean;
  };

  "workout_completed": {
    total_duration: number;
    total_volume: number;
    exercises_count: number;
    sets_count: number;
    average_rpe: number;
  };

  // Analytics Usage
  "analytics_viewed": {
    chart_type: "progress" | "volume" | "rpe_trends";
    time_period: "1M" | "3M" | "6M" | "1Y";
  };

  "export_data": {
    format: "csv" | "pdf";
    data_type: "workouts" | "analytics" | "all";
  };

  // Intelligence Features
  "readiness_assessment_completed": {
    score: number;
    recommendation: "go_hard" | "normal" | "light" | "rest";
    time_to_complete: number;
  };

  "plateau_detected": {
    exercise_name: string;
    confidence: number;
    duration_weeks: number;
  };

  "plateau_recommendation_followed": {
    recommendation_type: "volume_increase" | "exercise_variation" | "deload";
    exercise_name: string;
  };
}
```

### Cohort Analysis Structure
```typescript
interface CohortMetrics {
  cohort: string; // "2025-01-W1"
  size: number;
  retention: {
    day1: number;
    day7: number;
    day14: number;
    day30: number;
  };
  engagement: {
    avgWorkoutsPerWeek: number;
    avgSessionDuration: number;
    featureAdoptionRate: Record<string, number>;
  };
  progression: {
    avgVolumeIncrease: number;
    plateausDetected: number;
    plateausResolved: number;
  };
}
```

---

## 🛤️ User Journey Metrics

### Onboarding Funnel
```typescript
interface OnboardingFunnel {
  stages: {
    "landing_page_visit": { users: number; conversion: "100%" };
    "signup_started": { users: number; conversion: "60%" };
    "signup_completed": { users: number; conversion: "85%" };
    "onboarding_started": { users: number; conversion: "95%" };
    "goals_completed": { users: number; conversion: "90%" };
    "experience_completed": { users: number; conversion: "85%" };
    "body_metrics_completed": { users: number; conversion: "75%" };
    "onboarding_finished": { users: number; conversion: "90%" };
    "first_workout_started": { users: number; conversion: "60%" };
    "first_workout_completed": { users: number; conversion: "85%" };
  };

  dropoffPoints: {
    stage: string;
    dropoffRate: number;
    commonReasons: string[];
    improvementActions: string[];
  }[];
}
```

### Workout Journey Metrics
```typescript
interface WorkoutJourneyMetrics {
  // Pre-workout
  readinessAssessmentRate: number; // % users completing assessment
  recommendationFollowRate: number; // % following recommendations

  // During workout
  avgTimePerSet: number;
  rpeCompletionRate: number; // % sets with RPE logged
  timerUsageRate: number;
  workoutAbandonmentRate: number;

  // Post-workout
  workoutCompletionRate: number;
  notesAdditionRate: number; // % users adding workout notes

  // Analytics engagement
  progressCheckRate: number; // % users viewing progress after workout
  analyticsEngagementTime: number; // Time spent in analytics section
}
```

---

## 🛠️ Feature-Specific KPIs

### Smart Workout Logger
```typescript
interface WorkoutLoggerKPIs {
  efficiency: {
    avgTimeToLogSet: {
      target: "< 30 seconds";
      measurement: "Time from set completion to logging";
    };
    errorRate: {
      target: "< 5%";
      measurement: "Sets requiring correction after logging";
    };
    gestureUsageRate: {
      target: "> 40%";
      measurement: "Users using swipe/tap shortcuts";
    };
  };

  adoption: {
    offlineUsageRate: {
      target: "> 80%";
      measurement: "Workouts completed offline";
    };
    voiceCommandUsage: {
      target: "> 20%"; // Phase 2 feature
      measurement: "Sets logged via voice";
    };
  };
}
```

### RPE Tracking System
```typescript
interface RPETrackingKPIs {
  consistency: {
    rpeCompletionRate: {
      target: "> 70%";
      measurement: "Sets with RPE recorded";
    };
    rpeAccuracy: {
      target: "Variance < 1.5";
      measurement: "RPE consistency for same weight/reps";
    };
  };

  intelligence: {
    fatigueDetectionAccuracy: {
      target: "> 75%";
      measurement: "Correct fatigue pattern identification";
    };
    recommendationAccuracy: {
      target: "> 65%";
      measurement: "User acceptance of RPE-based suggestions";
    };
  };
}
```

### Plateau Detection Engine
```typescript
interface PlateauDetectionKPIs {
  accuracy: {
    truePositiveRate: {
      target: "> 80%";
      measurement: "Correctly identified plateaus";
      validation: "User confirmation + subsequent progress";
    };
    falsePositiveRate: {
      target: "< 20%";
      measurement: "Incorrectly flagged plateaus";
      validation: "User feedback + continued progress";
    };
  };

  impact: {
    plateauResolutionRate: {
      target: "> 60%";
      measurement: "Plateaus resolved within 4 weeks";
    };
    recommendationFollowRate: {
      target: "> 50%";
      measurement: "Users implementing plateau-breaking protocols";
    };
  };
}
```

### Energy Readiness Score
```typescript
interface ReadinessScoreKPIs {
  usability: {
    completionTime: {
      target: "< 30 seconds";
      measurement: "Time to complete assessment";
    };
    completionRate: {
      target: "> 70%";
      measurement: "Assessments completed vs started";
    };
  };

  predictiveAccuracy: {
    performanceCorrelation: {
      target: "r > 0.6";
      measurement: "Correlation between score and actual performance";
    };
    recommendationEffectiveness: {
      target: "> 60%";
      measurement: "Users reporting improved sessions after following advice";
    };
  };
}
```

---

## 💰 Business Metrics

### MVP Phase Business KPIs
```typescript
interface BusinessKPIs {
  // Cost Structure
  customerAcquisitionCost: {
    target: "< $20";
    measurement: "Total marketing spend / New users";
    channels: ["organic", "paid_social", "referral", "content"];
  };

  // User Value
  userLifetimeValue: {
    target: "> $60"; // 3x CAC minimum
    measurement: "Predicted revenue per user over 24 months";
    factors: ["retention_rate", "subscription_conversion", "upgrade_rate"];
  };

  // Growth
  monthlyGrowthRate: {
    target: "20%";
    measurement: "Month-over-month active user growth";
    breakdown: ["new_signups", "reactivated_users", "churned_users"];
  };

  // Engagement Quality
  engagementScore: {
    target: "> 7/10";
    measurement: "Composite score of user activity";
    components: [
      "session_frequency",
      "feature_usage_breadth",
      "session_duration",
      "ugc_creation"
    ];
  };
}
```

### Conversion Funnel (Future Monetization)
```typescript
interface ConversionFunnel {
  freeToTrial: {
    target: "25%";
    measurement: "Free users starting premium trial";
    triggers: ["feature_limit_hit", "advanced_analytics_view", "export_attempt"];
  };

  trialToPaid: {
    target: "40%";
    measurement: "Trial users converting to paid";
    factors: ["trial_duration", "feature_usage", "onboarding_quality"];
  };

  monthlyChurnRate: {
    target: "< 5%";
    measurement: "Paid users canceling per month";
    segmentation: ["subscription_tier", "usage_level", "tenure"];
  };
}
```

---

## ⚡ Technical Performance

### App Performance KPIs
```typescript
interface TechnicalKPIs {
  performance: {
    coldStartTime: {
      measurement: "App launch to first interactive screen";
      target: {
        iOS: "< 1.5s";
        Android: "< 2.0s";
      };
      monitoring: "Real device testing + Flipper";
    };

    hotReloadTime: {
      measurement: "Code change to app update";
      target: "< 3s";
      monitoring: "Development environment";
    };

    navigationTime: {
      measurement: "Tab switch or screen transition";
      target: "< 200ms";
      monitoring: "Performance profiler";
    };

    chartRenderTime: {
      measurement: "Analytics chart generation";
      target: "< 1s";
      monitoring: "Custom performance hooks";
    };
  };

  reliability: {
    crashRate: {
      measurement: "App crashes per session";
      target: "< 0.1%";
      monitoring: "Sentry error tracking";
    };

    apiErrorRate: {
      measurement: "Failed API requests";
      target: "< 1%";
      monitoring: "Supabase + custom error tracking";
    };

    dataLossRate: {
      measurement: "Workouts lost due to sync failure";
      target: "< 0.01%";
      monitoring: "Offline sync monitoring";
    };

    uptime: {
      measurement: "Backend availability";
      target: "> 99.9%";
      monitoring: "Supabase status + custom health checks";
    };
  };

  resource_usage: {
    memoryFootprint: {
      measurement: "Peak RAM usage during workout";
      target: "< 150MB";
      monitoring: "Flipper memory profiler";
    };

    batteryDrain: {
      measurement: "Battery consumption per hour of use";
      target: "< 3%";
      monitoring: "Device energy impact tools";
    };

    storageUsage: {
      measurement: "Local data storage footprint";
      target: "< 100MB after 3 months use";
      monitoring: "App analytics";
    };

    networkUsage: {
      measurement: "Data consumption per session";
      target: "< 1MB per workout";
      monitoring: "Network profiling tools";
    };
  };
}
```

### Backend Performance
```typescript
interface BackendKPIs {
  supabase: {
    queryResponseTime: {
      target: "< 200ms p95";
      measurement: "Database query execution time";
    };

    realtimeLatency: {
      target: "< 100ms";
      measurement: "WebSocket message delivery time";
    };

    storageUploadTime: {
      target: "< 5s for 10MB";
      measurement: "File upload completion time";
    };
  };

  edgeFunctions: {
    coldStartTime: {
      target: "< 1s";
      measurement: "Function initialization time";
    };

    executionTime: {
      target: "< 500ms";
      measurement: "Analytics calculation completion";
    };
  };
}
```

---

## 📊 Monitoring Setup

### Real-Time Monitoring Stack
```typescript
interface MonitoringStack {
  errorTracking: {
    tool: "Sentry";
    config: {
      environment: ["development", "staging", "production"];
      sampleRate: 1.0; // 100% in development, adjust for production
      beforeSend: "filter_sensitive_data";
    };
    alerts: [
      "error_rate_spike",
      "new_error_type",
      "performance_regression"
    ];
  };

  analytics: {
    tool: "PostHog";
    config: {
      autocapture: false; // Manual event tracking only
      session_recording: true; // Beta users only
      feature_flags: true;
    };
    events: [
      "user_lifecycle",
      "feature_usage",
      "performance_metrics"
    ];
  };

  performance: {
    tools: ["Flipper", "React Native Performance"];
    metrics: [
      "render_time",
      "memory_usage",
      "network_requests",
      "bundle_size"
    ];
  };

  infrastructure: {
    tool: "Supabase Dashboard + Grafana";
    metrics: [
      "database_performance",
      "api_response_times",
      "user_connections",
      "storage_usage"
    ];
  };
}
```

### Alerting Configuration
```typescript
interface AlertingConfig {
  critical: {
    // P0 - Immediate response required
    app_crash_rate: { threshold: "1%", window: "5m" };
    api_error_rate: { threshold: "5%", window: "5m" };
    database_connection_failure: { threshold: "1", window: "1m" };
  };

  high: {
    // P1 - Response within 1 hour
    performance_degradation: { threshold: "50% slower", window: "15m" };
    user_signup_failure: { threshold: "10%", window: "10m" };
    offline_sync_failure: { threshold: "5%", window: "30m" };
  };

  medium: {
    // P2 - Response within 4 hours
    feature_adoption_drop: { threshold: "20% decrease", window: "1d" };
    user_retention_decline: { threshold: "10% decrease", window: "1w" };
  };

  low: {
    // P3 - Response within 24 hours
    storage_usage_growth: { threshold: "80% capacity", window: "1d" };
    api_rate_limit_approaching: { threshold: "80% limit", window: "1h" };
  };
}
```

---

## 📋 Dashboard & Reporting

### Executive Dashboard
```typescript
interface ExecutiveDashboard {
  kpis: {
    userGrowth: {
      current: number;
      target: number;
      trend: "up" | "down" | "stable";
      period: "monthly";
    };

    retention: {
      d1: number;
      d7: number;
      d30: number;
      trend: "improving" | "declining" | "stable";
    };

    engagement: {
      workoutsPerWeek: number;
      sessionDuration: number;
      featureAdoption: Record<string, number>;
    };

    quality: {
      nps: number;
      appStoreRating: number;
      supportTicketRate: number;
    };
  };

  alerts: {
    priority: "critical" | "high" | "medium" | "low";
    message: string;
    action: string;
    timestamp: Date;
  }[];

  insights: {
    type: "opportunity" | "risk" | "achievement";
    title: string;
    description: string;
    recommendedAction: string;
  }[];
}
```

### Product Team Dashboard
```typescript
interface ProductDashboard {
  featurePerformance: {
    [featureName: string]: {
      adoptionRate: number;
      satisfactionScore: number;
      usageFrequency: number;
      retentionImpact: number;
    };
  };

  userJourney: {
    onboardingFunnel: FunnelData;
    workoutFunnel: FunnelData;
    engagementFunnel: FunnelData;
  };

  cohortAnalysis: {
    retentionByMonth: CohortMetrics[];
    engagementByMonth: CohortMetrics[];
    featureAdoptionByMonth: CohortMetrics[];
  };

  feedbackSummary: {
    npsBreakdown: Record<string, number>;
    featureRequests: { feature: string; votes: number }[];
    bugReports: { category: string; count: number }[];
    userQuotes: { quote: string; user: string; context: string }[];
  };
}
```

### Development Team Dashboard
```typescript
interface DevelopmentDashboard {
  buildHealth: {
    buildSuccessRate: number;
    testCoverage: number;
    codeQuality: number;
    technicalDebt: number;
  };

  performance: {
    appPerformance: TechnicalKPIs;
    apiPerformance: BackendKPIs;
    errorRates: Record<string, number>;
  };

  productivity: {
    featuresDelivered: number;
    bugFixTime: number;
    codeReviewTime: number;
    deploymentFrequency: number;
  };

  infrastructure: {
    serverStatus: "healthy" | "warning" | "critical";
    databasePerformance: Record<string, number>;
    storageUsage: number;
    networkLatency: number;
  };
}
```

### Automated Reporting
```typescript
interface AutomatedReporting {
  daily: {
    recipients: ["product_team", "engineering_lead"];
    content: [
      "user_activity_summary",
      "error_summary",
      "performance_overview"
    ];
    time: "09:00 UTC";
  };

  weekly: {
    recipients: ["executives", "product_team", "engineering_team"];
    content: [
      "kpi_progress",
      "user_feedback_summary",
      "feature_performance",
      "technical_health"
    ];
    time: "Monday 10:00 UTC";
  };

  monthly: {
    recipients: ["board", "executives", "all_hands"];
    content: [
      "growth_metrics",
      "retention_analysis",
      "business_kpis",
      "roadmap_progress"
    ];
    time: "First Monday 15:00 UTC";
  };

  adhoc: {
    triggers: [
      "milestone_reached",
      "target_missed",
      "critical_issue",
      "significant_growth"
    ];
    automation: "immediate_notification";
  };
}
```

---

## 🎯 Success Thresholds & Actions

### Green Zone (Exceeding Targets)
```typescript
interface GreenZoneActions {
  condition: "All primary KPIs > 110% of target";
  actions: [
    "accelerate_feature_development",
    "expand_beta_program",
    "prepare_monetization_features",
    "increase_growth_investment"
  ];
}
```

### Yellow Zone (Meeting Targets)
```typescript
interface YellowZoneActions {
  condition: "Primary KPIs 90-110% of target";
  actions: [
    "maintain_current_pace",
    "optimize_underperforming_features",
    "gather_more_user_feedback",
    "monitor_closely"
  ];
}
```

### Red Zone (Below Targets)
```typescript
interface RedZoneActions {
  condition: "Any primary KPI < 90% of target";
  actions: [
    "immediate_investigation",
    "user_research_sprint",
    "feature_usage_analysis",
    "consider_pivot_options"
  ];
}
```

---

*Dernière mise à jour: 2025-01-XX*
*Version: Metrics Framework 1.0*
*Status: Ready for implementation*