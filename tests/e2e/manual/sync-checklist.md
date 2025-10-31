# Sync Protocol Validation Checklist

**Priority:** 🔴 CRITICAL
**Duration:** 15-20 minutes
**Environment:** Expo Dev Build + Real Device
**Why:** LokiJS (Jest) CANNOT test sync protocol - requires real SQLite + JSI

## Prerequisites

- [ ] Expo Dev Build running on **real device** (not simulator)
- [ ] Database reset (Settings → Developer → Reset Database)
- [ ] Internet connection available (will toggle airplane mode during test)
- [ ] Supabase backend accessible
- [ ] Test user account created

## Test Environment

**Device:** **\*\*\*\***\_\_**\*\*\*\*** (e.g., iPhone 14 Pro)
**OS:** **\*\*\*\***\_\_**\*\*\*\*** (e.g., iOS 17.2)
**Build:** **\*\*\*\***\_\_**\*\*\*\*** (Git SHA: **\_\_\_\_**)
**Tester:** **\*\*\*\***\_\_**\*\*\*\*** (Your Name)
**Date:** **\*\*\*\***\_\_**\*\*\*\*** (YYYY-MM-DD)

---

## Scenario 1: Create Offline → Sync → Verify Remote

**Goal:** Verify workout created offline syncs to Supabase with correct `_changed` timestamp

### Steps

- [ ] **1.1** Enable airplane mode on device
- [ ] **1.2** Create new workout:
  - Title: "Offline Leg Day"
  - Nutrition Phase: "Bulk"
  - Notes: "Created offline for sync test"
- [ ] **1.3** Add exercise "Barbell Squat":
  - Order Index: 0
  - Rest: 180 seconds
  - 3 sets: 135x10 (warmup), 225x8 (RIR 2), 245x6 (RIR 1)
- [ ] **1.4** Complete workout
- [ ] **1.5** Navigate to: Settings → Developer → View Database
- [ ] **1.6** Select workout "Offline Leg Day"
- [ ] **1.7** Verify `_changed` timestamp is set (non-zero number)
- [ ] **1.8** Note `_changed` value: **\*\*\*\***\_\_**\*\*\*\***
- [ ] **1.9** Disable airplane mode
- [ ] **1.10** Navigate to: Settings → Sync Now
- [ ] **1.11** Wait for sync completion message
- [ ] **1.12** Open Supabase dashboard → Table Editor → workouts
- [ ] **1.13** Find workout "Offline Leg Day"
- [ ] **1.14** Verify `_changed` matches value from step 1.8
- [ ] **1.15** Verify workout exercises synced (3 exercise_sets records)

### Expected Results

✅ `_changed` timestamp set on creation
✅ Sync completes without errors
✅ Workout appears in Supabase with matching `_changed`
✅ Relationships synced (exercise_sets linked to workout_exercises)

### Actual Results

_Document actual behavior (PASS/FAIL + screenshots if failure):_

---

## Scenario 2: Update → Sync → Verify Timestamp Update

**Goal:** Verify updating workout updates `_changed` timestamp and syncs

### Steps

- [ ] **2.1** Select existing workout "Offline Leg Day"
- [ ] **2.2** Tap "Edit"
- [ ] **2.3** Change title to "Updated Leg Day"
- [ ] **2.4** Change notes to "Updated for sync test"
- [ ] **2.5** Save changes
- [ ] **2.6** Navigate to: Settings → Developer → View Database
- [ ] **2.7** Select workout "Updated Leg Day"
- [ ] **2.8** Note NEW `_changed` value: **\*\*\*\***\_\_**\*\*\*\***
- [ ] **2.9** Verify NEW `_changed` > OLD `_changed` (from step 1.8)
- [ ] **2.10** Navigate to: Settings → Sync Now
- [ ] **2.11** Wait for sync completion
- [ ] **2.12** Open Supabase dashboard → Table Editor → workouts
- [ ] **2.13** Find workout (may need to refresh)
- [ ] **2.14** Verify title is "Updated Leg Day"
- [ ] **2.15** Verify notes are "Updated for sync test"
- [ ] **2.16** Verify `_changed` matches NEW value from step 2.8

### Expected Results

✅ `_changed` increments on update
✅ Sync pushes updated fields to Supabase
✅ Remote `_changed` matches local timestamp

### Actual Results

_Document actual behavior:_

---

## Scenario 3: Soft Delete → Sync → Verify Status

**Goal:** Verify soft delete sets `_status='deleted'` and syncs correctly

### Steps

- [ ] **3.1** Navigate to Workouts list
- [ ] **3.2** Long-press workout "Updated Leg Day"
- [ ] **3.3** Tap "Delete"
- [ ] **3.4** Confirm deletion
- [ ] **3.5** Verify workout NO LONGER appears in workouts list
- [ ] **3.6** Navigate to: Settings → Developer → View Database
- [ ] **3.7** Enable "Show Deleted Records" toggle
- [ ] **3.8** Find workout "Updated Leg Day"
- [ ] **3.9** Verify `_status` = 'deleted'
- [ ] **3.10** Note `_changed` value: **\*\*\*\***\_\_**\*\*\*\***
- [ ] **3.11** Navigate to: Settings → Sync Now
- [ ] **3.12** Wait for sync completion
- [ ] **3.13** Open Supabase dashboard → Table Editor → workouts
- [ ] **3.14** Find workout (filter by `_status = 'deleted'` if needed)
- [ ] **3.15** Verify `_status` = 'deleted' in Supabase
- [ ] **3.16** Verify `_changed` matches value from step 3.10

### Expected Results

✅ Soft delete sets `_status = 'deleted'`
✅ Deleted workout excluded from normal queries
✅ Deleted workout still exists in database (NOT hard deleted)
✅ Sync pushes deletion status to Supabase
✅ Related records (exercise_sets) also marked deleted

### Actual Results

_Document actual behavior:_

---

## Scenario 4: Pull Changes from Server

**Goal:** Verify device can pull changes created elsewhere

### Prerequisites for this scenario:

- **Second device** OR **Supabase dashboard access to manually insert**

### Steps (using Supabase dashboard)

- [ ] **4.1** Open Supabase dashboard → Table Editor → workouts
- [ ] **4.2** Click "Insert row"
- [ ] **4.3** Fill fields:
  - `id`: "remote-workout-123" (UUID format)
  - `user_id`: (your test user ID)
  - `title`: "Remote Push Day"
  - `nutrition_phase`: "cut"
  - `started_at`: (current timestamp)
  - `completed_at`: null
  - `_changed`: (current timestamp in milliseconds)
  - `_status`: "synced"
- [ ] **4.4** Click "Save"
- [ ] **4.5** On mobile device: Navigate to Settings → Sync Now
- [ ] **4.6** Wait for sync completion
- [ ] **4.7** Navigate to Workouts list
- [ ] **4.8** Verify "Remote Push Day" appears in list
- [ ] **4.9** Tap to open workout
- [ ] **4.10** Verify all fields match Supabase data

### Expected Results

✅ Sync pulls remote workout to local device
✅ Workout appears in workouts list
✅ All fields match remote data
✅ No errors during pull sync

### Actual Results

_Document actual behavior:_

---

## Scenario 5: Conflict Resolution (Optional - Advanced)

**Goal:** Verify conflict handling when same workout modified on multiple devices

### Prerequisites:

- **Two devices** with same user logged in

### Steps

- [ ] **5.1** Device A: Create workout "Conflict Test"
- [ ] **5.2** Device A: Sync to server
- [ ] **5.3** Device B: Pull sync (verify "Conflict Test" appears)
- [ ] **5.4** **Both devices offline** (airplane mode)
- [ ] **5.5** Device A: Update title to "Conflict Test - Device A"
- [ ] **5.6** Device B: Update title to "Conflict Test - Device B"
- [ ] **5.7** Device A: Go online, sync
- [ ] **5.8** Device B: Go online, sync
- [ ] **5.9** Verify conflict resolution:
  - Last write wins? OR
  - Conflict detected? OR
  - User prompted to resolve?

### Expected Results

✅ Conflict detected OR last-write-wins behavior
✅ No data loss
✅ Sync completes without crashes

### Actual Results

_Document conflict resolution behavior:_

---

## Summary

**Total Scenarios:** 5
**Passed:** **\_** / 5
**Failed:** **\_** / 5
**Skipped:** **\_** / 5

**Critical Issues Found:**

1. _List any CRITICAL issues:_
2. _..._

**GitHub Issues Created:**

- Issue #_\_\_: \_Description_
- Issue #_\_\_: \_Description_

**Next Steps:**

- [ ] Fix critical issues
- [ ] Re-run failed scenarios
- [ ] Update checklist with new edge cases discovered

---

## Notes

_Additional observations, edge cases discovered, or suggestions for automation:_
