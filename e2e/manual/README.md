# Manual E2E Testing Guide

Manual testing documentation for critical user flows.

## When to Use Manual Testing

- ✅ Before automating a flow (validate behavior first)
- ✅ Exploratory testing (discover edge cases)
- ✅ Complex scenarios (too fragile to automate)
- ✅ Quick validation during development

## Testing Checklists

### Phase 0.6 - Foundation

- [ ] App launches successfully
- [ ] Database initializes correctly
- [ ] No console errors on startup

### Phase 1 - Authentication

- [ ] Login flow (email + password)
- [ ] Registration flow
- [ ] Password reset
- [ ] Logout

### Phase 2 - Workout Plans

- [ ] Browse pre-made plans
- [ ] View plan details
- [ ] Start workout from plan

### Phase 3 - Active Workout

- [ ] Log sets (weight, reps, RIR)
- [ ] Rest timer
- [ ] Complete workout
- [ ] Workout history

### Phase 4 - Profile & Settings

- [ ] View profile
- [ ] Edit profile
- [ ] Change units (kg/lbs)
- [ ] Logout

## Test Environment

### Development Build

```bash
npm start
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
```

### Production Build

```bash
# Build production app
eas build --platform android --profile production

# Install on device
# Test on real hardware
```

## Reporting Issues

When you find a bug during manual testing:

1. **Document the issue:**
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/videos

2. **Create GitHub issue:**
   - Label: `bug`
   - Assign to developer
   - Link to test checklist

3. **Update checklist:**
   - Mark test as ❌ Failed
   - Add reference to GitHub issue

## Tips

- **Test on multiple devices** (iOS + Android)
- **Test offline scenarios** (airplane mode)
- **Test edge cases** (empty states, errors)
- **Test performance** (large datasets, slow network)
