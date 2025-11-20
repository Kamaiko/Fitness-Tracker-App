# List Components - FlashList Wrappers

**Purpose:** Performance-optimized list components using FlashList for efficient view recycling.

**Phase:** 0.5.3 (Infrastructure preparation for Phase 2+)

**Dependencies:** `@shopify/flash-list: 2.2.0`

---

## Quick Reference

```typescript
import { WorkoutList } from '@/components/lists';

<WorkoutList
  workouts={workouts}
  onWorkoutPress={(workout) => router.push(`/workout/${workout.id}`)}
  emptyMessage="No workouts yet. Start your first workout!"
/>
```

---

## Available Components

### 1. WorkoutList

**Purpose:** Display list of workouts (workout history, templates, etc.)

**Use Cases:**

- Workout history screen (Phase 2.6.4)
- Workout templates list (Phase 5)
- Search results for workouts

**Props:**

```typescript
interface WorkoutListProps {
  workouts: Workout[]; // Array of workouts to display
  onWorkoutPress?: (workout: Workout) => void; // Optional press handler
  loading?: boolean; // Show loading spinner
  emptyMessage?: string; // Custom empty state message
}
```

**Performance:**

- Optimized for 100-200+ workouts
- `estimatedItemSize: 88px` (based on WorkoutListItem height)
- Memoized renderItem and keyExtractor
- Smooth 60 FPS scrolling

**Example:**

```typescript
import { useState, useEffect } from 'react';
import { WorkoutList } from '@/components/lists';
import { getUserWorkouts } from '@/services/database/workouts';
import { useAuthStore } from '@/stores/auth/authStore';

export default function WorkoutHistoryScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?.id) return;

    getUserWorkouts(user.id, 100) // Get last 100 workouts
      .then(setWorkouts)
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <WorkoutList
      workouts={workouts}
      loading={loading}
      onWorkoutPress={(workout) => {
        // Navigate to workout details
        console.log('Navigate to:', workout.id);
      }}
    />
  );
}
```

---

## Future Components (Roadmap)

### 2. ExerciseList (Phase 3.11.2)

**Purpose:** Display exercise library with 1,300+ exercises from ExerciseDB

**Performance Requirements:**

- FlashList ESSENTIAL (1,300+ items)
- `estimatedItemSize: ~100px` (exercise with image)
- Support for real-time search filtering
- Support for muscle group / equipment filters

**Planned Props:**

```typescript
interface ExerciseListProps {
  exercises: Exercise[];
  onExercisePress?: (exercise: Exercise) => void;
  showImages?: boolean; // Show exercise GIF/images
  searchQuery?: string; // Real-time search filter
  filters?: ExerciseFilters; // Muscle group, equipment, etc.
}
```

### 3. ExerciseSelector (Phase 2.7.1)

**Purpose:** Modal for selecting exercises during active workout

**Performance Requirements:**

- FlashList ESSENTIAL (1,300+ items)
- Real-time search (debounced 300ms)
- Recently used exercises at top
- Favorited exercises starred

**Planned Props:**

```typescript
interface ExerciseSelectorProps {
  visible: boolean;
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
  recentExercises?: Exercise[]; // Show at top
  favoriteIds?: string[]; // Starred exercises
}
```

### 4. TemplateList (Phase 5)

**Purpose:** Display saved workout templates

**Performance:**

- Moderate (20-50 templates expected)
- FlashList beneficial for consistency

---

## Performance Guidelines

### When to Use FlashList

✅ **USE FlashList when:**

- List has 50+ items
- Items have consistent/similar heights
- Performance is critical (UX sensitive)
- List may grow over time

❌ **DON'T use FlashList when:**

- List has <20 items (ScrollView is fine)
- Items have wildly different heights (FlatList better)
- Simple static list (overhead not worth it)

### Configuration Best Practices

**1. estimatedItemSize**

- Measure actual item height (use React DevTools)
- Set estimatedItemSize close to actual (±10px)
- Affects initial render and scroll performance

**2. Memoization**

- ALWAYS memoize renderItem with `useCallback`
- ALWAYS memoize keyExtractor with `useCallback`
- Memoize child components with `memo()` if heavy

**3. Item Components**

- NO `key` prop in item components (FlashList handles recycling)
- Keep item components lightweight
- Avoid inline styles (use NativeWind classes)

**Example:**

```typescript
// ✅ GOOD: Memoized callbacks
const renderItem = useCallback(
  ({ item }: { item: Workout }) => <WorkoutListItem item={item} onPress={handlePress} />,
  [handlePress]
);

const keyExtractor = useCallback((item: Workout) => item.id, []);

<FlashList
  data={data}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  estimatedItemSize={88}
/>

// ❌ BAD: Inline callbacks (re-created every render)
<FlashList
  data={data}
  renderItem={({ item }) => <WorkoutListItem item={item} />}
  keyExtractor={(item) => item.id}
  estimatedItemSize={88}
/>
```

---

## Testing

### Test Screen

**Location:** [src/app/debug/flashlist-test.tsx](../../app/debug/flashlist-test.tsx)

**Purpose:** Validate FlashList performance with 120+ mock workouts

**How to Test:**

1. Run app: `npm start`
2. Navigate to: `/debug/flashlist-test` (URL bar)
3. Scroll through list - should be smooth at 60 FPS
4. Tap items to verify press handling
5. Check footer stats for configuration details

**Expected Results:**

- Smooth scrolling with 120+ items
- No visible lag or janky animations
- Items recycle correctly (no duplicate keys warnings)
- Press handling works reliably

### Fixtures

**Location:** [tests/fixtures/database/workouts.json](../../../../tests/fixtures/database/workouts.json)

**Section:** `simpleWorkouts`

**Usage:**

```typescript
import workoutFixtures from '@tests/fixtures/database/workouts.json';

const templates = Object.values(workoutFixtures.simpleWorkouts);
// Use templates to generate mock data for testing
```

---

## Phase 2 Integration Checklist

When integrating WorkoutList into workout history screen (Phase 2.6.4):

- [ ] Replace test data with WatermelonDB `.observe()` reactive queries
- [ ] Add pagination (Q.take/Q.skip)
- [ ] Add pull-to-refresh
- [ ] Add swipe actions (Repeat, Delete)
- [ ] Add filters (date range, nutrition phase)
- [ ] Add empty state CTA ("Start Workout" button)
- [ ] Add loading state for initial fetch
- [ ] Add error handling for database errors

**Example (Phase 2.6.4):**

```typescript
import { Q } from '@nozbe/watermelondb';
import { database } from '@/services/database/watermelon';
import { useEffect, useState } from 'react';

export default function WorkoutHistoryScreen() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    // Reactive query - auto-updates when data changes
    const subscription = database
      .get('workouts')
      .query(
        Q.where('user_id', userId),
        Q.sortBy('started_at', Q.desc),
        Q.take(50) // Pagination
      )
      .observe()
      .subscribe((data) => {
        setWorkouts(data.map(workoutToPlain));
      });

    return () => subscription.unsubscribe();
  }, [userId]);

  return <WorkoutList workouts={workouts} />;
}
```

---

## Troubleshooting

### Issue: Scroll is janky

**Possible Causes:**

1. `estimatedItemSize` too far from actual height
2. Item components not memoized
3. Heavy computations in renderItem

**Solutions:**

```typescript
// 1. Measure actual item height
// - Use React DevTools to inspect WorkoutListItem
// - Adjust estimatedItemSize to match (±10px)

// 2. Memoize item component
const WorkoutListItem = memo(({ item, onPress }) => {
  // ...
});

// 3. Move heavy logic outside renderItem
const processedData = useMemo(() => {
  return data.map((item) => ({
    ...item,
    formatted: heavyComputation(item), // Pre-compute
  }));
}, [data]);
```

### Issue: Items not recycling correctly

**Possible Causes:**

1. Using `key` prop in item component
2. keyExtractor returns non-unique keys
3. Item component using index as dependency

**Solutions:**

```typescript
// ✅ GOOD: Stable unique key
const keyExtractor = useCallback((item: Workout) => item.id, []);

// ❌ BAD: Using index (unstable)
const keyExtractor = useCallback((item, index) => `${index}`, []);

// ❌ BAD: Non-unique keys
const keyExtractor = useCallback((item: Workout) => item.title, []); // Titles not unique!
```

### Issue: Blank space at top/bottom

**Possible Causes:**

1. FlashList needs minimum height estimate
2. Container View has incorrect flex

**Solutions:**

```typescript
// Ensure FlashList has proper container
<View style={{ flex: 1 }}> {/* NOT height: '100%' */}
  <FlashList ... />
</View>

// Adjust estimatedItemSize if needed
<FlashList estimatedItemSize={88} />
```

---

## References

- **FlashList Docs:** https://shopify.github.io/flash-list/
- **Performance Guide:** https://shopify.github.io/flash-list/docs/fundamentals/performant-components
- **WatermelonDB Queries:** https://watermelondb.dev/docs/Query
- **Project Testing:** [tests/README.md](../../../../tests/README.md)

---

## Decision Records

### Why FlashList over FlatList?

**Answer:** 10x better performance with view recycling

**Benefits:**

- Recycles views (FlatList creates/destroys)
- Handles 1,000+ items smoothly
- Lower memory footprint
- Same API as FlatList (easy migration)

**Drawbacks:**

- Slightly more complex setup (estimatedItemSize required)
- Less flexible with dynamic heights (getItemType helps)

**Conclusion:** Benefits FAR outweigh drawbacks for lists >50 items.

### Why component-specific wrappers vs generic GenericList<T>?

**Answer:** Type safety + UX-specific optimizations

**Rationale:**

- WorkoutList has workout-specific UX (nutrition icons, duration)
- ExerciseList will have exercise-specific UX (images, muscle groups)
- Generic component would sacrifice type safety or UX quality
- Can extract common logic to hooks if pattern emerges (YAGNI)

**Example:**

```typescript
// ✅ GOOD: Specific component with type safety
<WorkoutList workouts={workouts} /> // TypeScript ensures Workout[]

// ❌ BAD: Generic loses type information
<GenericList<Workout> items={workouts} renderItem={...} /> // More boilerplate
```

---

## Maintenance Notes

**Created:** 2025-01-31

**Next Review:** Phase 2.6.4 (When creating workout history screen)

**Future Enhancements:**

- Add ExerciseList component (Phase 3.11.2)
- Add ExerciseSelector modal (Phase 2.7.1)
- Add TemplateList component (Phase 5)
- Consider GenericList abstraction if pattern emerges (YAGNI)
