# Offline CRUD Validation Checklist

**Priority:** 🟡 HIGH
**Duration:** 10-15 minutes
**Environment:** Expo Dev Build + Real Device
**Why:** Validate offline-first architecture works without network

## Prerequisites

- [ ] Expo Dev Build running on **real device**
- [ ] Database reset (Settings → Developer → Reset Database)
- [ ] Airplane mode ready to toggle

## Test Environment

**Device:** **\*\*\*\***\_\_**\*\*\*\*** (e.g., iPhone 14 Pro)
**OS:** **\*\*\*\***\_\_**\*\*\*\*** (e.g., iOS 17.2)
**Build:** **\*\*\*\***\_\_**\*\*\*\*** (Git SHA: **\_\_\_\_**)
**Tester:** **\*\*\*\***\_\_**\*\*\*\*** (Your Name)
**Date:** **\*\*\*\***\_\_**\*\*\*\*** (YYYY-MM-DD)

---

## Scenario 1: Offline Create (Simple Workout)

**Goal:** Verify workout can be created offline and persists locally

### Steps

- [ ] **1.1** Enable airplane mode on device
- [ ] **1.2** Verify no internet connection (check status bar)
- [ ] **1.3** Navigate to Workouts screen
- [ ] **1.4** Tap "New Workout"
- [ ] **1.5** Fill fields:
  - Title: "Offline Test Workout"
  - Nutrition Phase: "Maintenance"
  - Notes: "Created offline"
- [ ] **1.6** Tap "Save"
- [ ] **1.7** Verify success message (NO network error)
- [ ] **1.8** Verify workout appears in workouts list
- [ ] **1.9** Tap workout to view details
- [ ] **1.10** Verify all fields persisted correctly

### Expected Results

✅ Workout created successfully offline
✅ No network errors displayed
✅ Workout persists in local database
✅ All fields saved correctly

### Actual Results

_Document actual behavior:_

---

## Scenario 2: Offline Create (Complex Workout with Relationships)

**Goal:** Verify complex workout with exercises and sets can be created offline

### Steps

- [ ] **2.1** Airplane mode still ON
- [ ] **2.2** Create new workout:
  - Title: "Offline Complex Workout"
  - Nutrition Phase: "Bulk"
- [ ] **2.3** Add exercise "Bench Press":
  - Order Index: 0
  - Rest: 180 seconds
- [ ] **2.4** Add 4 sets to "Bench Press":
  - Set 1: 135 lbs x 10 reps (warmup)
  - Set 2: 185 lbs x 8 reps (RIR 2, RPE 8)
  - Set 3: 205 lbs x 6 reps (RIR 1, RPE 9)
  - Set 4: 215 lbs x 5 reps (RIR 0, RPE 10, failure)
- [ ] **2.5** Add exercise "Overhead Press":
  - Order Index: 1
  - Rest: 150 seconds
- [ ] **2.6** Add 3 sets to "Overhead Press":
  - Set 1: 95 lbs x 8 reps (RIR 2, RPE 8)
  - Set 2: 105 lbs x 6 reps (RIR 1, RPE 9)
  - Set 3: 115 lbs x 5 reps (RIR 0, RPE 10, failure)
- [ ] **2.7** Save workout
- [ ] **2.8** Navigate back to workouts list
- [ ] **2.9** Tap "Offline Complex Workout"
- [ ] **2.10** Verify both exercises appear in correct order
- [ ] **2.11** Tap "Bench Press" → Verify 4 sets with correct data
- [ ] **2.12** Tap "Overhead Press" → Verify 3 sets with correct data

### Expected Results

✅ Complex workout created offline
✅ Both exercises persisted with correct order_index
✅ All 7 sets persisted with correct data
✅ Relationships intact (workout → exercises → sets)
✅ RIR, RPE, failure flags saved correctly

### Actual Results

_Document actual behavior:_

---

## Scenario 3: Offline Update

**Goal:** Verify workout can be updated offline

### Steps

- [ ] **3.1** Airplane mode still ON
- [ ] **3.2** Navigate to "Offline Test Workout"
- [ ] **3.3** Tap "Edit"
- [ ] **3.4** Change title to "Updated Offline Workout"
- [ ] **3.5** Change notes to "Updated offline"
- [ ] **3.6** Change nutrition phase to "Cut"
- [ ] **3.7** Save changes
- [ ] **3.8** Verify success message
- [ ] **3.9** Navigate back to workouts list
- [ ] **3.10** Verify title shows "Updated Offline Workout"
- [ ] **3.11** Tap workout to view details
- [ ] **3.12** Verify all updated fields persisted

### Expected Results

✅ Workout updated successfully offline
✅ All changes persisted
✅ No network errors

### Actual Results

_Document actual behavior:_

---

## Scenario 4: Offline Delete (Soft Delete)

**Goal:** Verify workout can be soft deleted offline

### Steps

- [ ] **4.1** Airplane mode still ON
- [ ] **4.2** Navigate to workouts list
- [ ] **4.3** Long-press "Updated Offline Workout"
- [ ] **4.4** Tap "Delete"
- [ ] **4.5** Confirm deletion
- [ ] **4.6** Verify workout NO LONGER in workouts list
- [ ] **4.7** Navigate to Settings → Developer → View Database
- [ ] **4.8** Enable "Show Deleted Records"
- [ ] **4.9** Find "Updated Offline Workout"
- [ ] **4.10** Verify `_status` = 'deleted'
- [ ] **4.11** Disable "Show Deleted Records"
- [ ] **4.12** Verify workout no longer visible

### Expected Results

✅ Workout soft deleted offline
✅ Workout excluded from normal queries
✅ Workout still exists in database (not hard deleted)
✅ `_status` set to 'deleted'

### Actual Results

_Document actual behavior:_

---

## Scenario 5: Offline → Online Transition (Data Persistence)

**Goal:** Verify data created offline persists after going online

### Steps

- [ ] **5.1** Verify "Offline Complex Workout" still in workouts list
- [ ] **5.2** Disable airplane mode
- [ ] **5.3** Wait 5 seconds (allow app to detect network)
- [ ] **5.4** Navigate to Workouts screen
- [ ] **5.5** Verify "Offline Complex Workout" STILL appears (not lost)
- [ ] **5.6** Tap workout to view details
- [ ] **5.7** Verify exercises still present
- [ ] **5.8** Verify sets still present
- [ ] **5.9** Navigate to Settings → Sync Now (optional)
- [ ] **5.10** Wait for sync completion
- [ ] **5.11** Re-check workout (verify still intact after sync)

### Expected Results

✅ Offline data persists after going online
✅ No data loss during network transition
✅ Workout can be synced successfully

### Actual Results

_Document actual behavior:_

---

## Scenario 6: Rapid Create/Update/Delete Sequence

**Goal:** Verify rapid CRUD operations don't cause race conditions

### Steps

- [ ] **6.1** Enable airplane mode
- [ ] **6.2** Create 5 workouts rapidly (1 per second):
  - "Rapid Test 1"
  - "Rapid Test 2"
  - "Rapid Test 3"
  - "Rapid Test 4"
  - "Rapid Test 5"
- [ ] **6.3** Verify all 5 workouts appear in list
- [ ] **6.4** Update "Rapid Test 3" → "Updated Rapid 3"
- [ ] **6.5** Delete "Rapid Test 5"
- [ ] **6.6** Verify list shows:
  - "Rapid Test 1"
  - "Rapid Test 2"
  - "Updated Rapid 3"
  - "Rapid Test 4"
  - (NOT "Rapid Test 5")
- [ ] **6.7** Disable airplane mode
- [ ] **6.8** Sync to server
- [ ] **6.9** Verify all operations synced correctly

### Expected Results

✅ Rapid CRUD operations handled correctly
✅ No race conditions or data corruption
✅ Final state matches expected state
✅ Sync completes without errors

### Actual Results

_Document actual behavior:_

---

## Scenario 7: Database Query Performance (Offline)

**Goal:** Verify queries perform well offline with local data

### Steps

- [ ] **7.1** Enable airplane mode
- [ ] **7.2** Navigate to Workouts screen
- [ ] **7.3** Note time to load workouts list: **\_** ms
- [ ] **7.4** Scroll through list (verify smooth scrolling)
- [ ] **7.5** Filter workouts by nutrition phase "Bulk"
- [ ] **7.6** Note filter response time: **\_** ms
- [ ] **7.7** Sort workouts by "Most Recent"
- [ ] **7.8** Note sort response time: **\_** ms
- [ ] **7.9** Search for "Complex" in search bar
- [ ] **7.10** Note search response time: **\_** ms

### Expected Results

✅ List loads in < 500ms
✅ Smooth scrolling (60fps)
✅ Filter/sort/search < 200ms

### Actual Results

_Document performance metrics:_

---

## Scenario 8: Hard Delete (Permanent Deletion)

**Goal:** Verify hard delete permanently removes record

### Steps

- [ ] **8.1** Airplane mode ON
- [ ] **8.2** Create workout "Hard Delete Test"
- [ ] **8.3** Navigate to Settings → Developer → View Database
- [ ] **8.4** Select "Hard Delete Test"
- [ ] **8.5** Tap "Hard Delete" (permanent)
- [ ] **8.6** Confirm deletion
- [ ] **8.7** Verify workout NO LONGER in database (even with "Show Deleted")
- [ ] **8.8** Navigate to Workouts screen
- [ ] **8.9** Verify workout not in list

### Expected Results

✅ Hard delete permanently removes record
✅ Record not recoverable
✅ Record not synced to server (never existed)

### Actual Results

_Document actual behavior:_

---

## Summary

**Total Scenarios:** 8
**Passed:** **\_** / 8
**Failed:** **\_** / 8
**Skipped:** **\_** / 8

**High Priority Issues Found:**

1. _List any HIGH issues:_
2. _..._

**GitHub Issues Created:**

- Issue #_\_\_: \_Description_
- Issue #_\_\_: \_Description_

**Next Steps:**

- [ ] Fix high priority issues
- [ ] Re-run failed scenarios
- [ ] Update checklist with new edge cases

---

## Notes

_Additional observations, edge cases discovered, or suggestions for automation:_
