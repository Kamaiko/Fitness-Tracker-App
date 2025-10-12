# 🔧 Troubleshooting Guide

Common issues and solutions for Halterofit development.

> **Note:** This document will grow as we encounter and fix issues. Add new problems here as you solve them!

---

## 📱 Expo & Metro Bundler Issues

### Metro Bundler Won't Start

**Symptoms:**
- `npm start` fails
- Port already in use error
- Metro bundler shows errors

**Solutions:**

```bash
# 1. Clear Metro cache
npx expo start -c

# 2. Kill process using port 8081
# Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8081 | xargs kill -9

# 3. Clear watchman cache (if installed)
watchman watch-del-all

# 4. Nuclear option - full clean
rm -rf node_modules
npm install
npx expo start -c --clear
```

---

### App Won't Load / White Screen

**Symptoms:**
- White screen on device
- "Unable to connect" error
- App opens but crashes immediately

**Solutions:**

```bash
# 1. Ensure Metro bundler is running
npm start

# 2. Check that device and computer are on same WiFi

# 3. Clear Expo cache
npx expo start -c

# 4. Reload app
# Shake device → Reload
# Or close app completely and reopen

# 5. Check for JavaScript errors in Metro logs
# Look for red errors in terminal
```

**Checklist:**
- [ ] Computer and phone on same WiFi network
- [ ] No VPN blocking connection
- [ ] Firewall not blocking port 8081
- [ ] Metro bundler running (see terminal output)

---

### "Invariant Violation" or Module Import Errors

**Symptoms:**
- `Invariant Violation: Module AppRegistry is not a registered callable module`
- Import errors for newly installed packages

**Solutions:**

```bash
# 1. Restart Metro with cache clear
npx expo start -c

# 2. If still failing, reinstall
rm -rf node_modules
npm install

# 3. Check import paths (should use @/ alias)
# ❌ Bad: import { foo } from '../../../utils/foo';
# ✅ Good: import { foo } from '@/utils/foo';
```

---

## 💾 Database Issues

### "Database is Locked" Error

**Symptoms:**
- `Error: database is locked`
- Operations hanging
- App freezes on database operations

**Causes:**
- Multiple database connections open
- Transaction not completed
- App crashed mid-operation

**Solutions:**

```typescript
// 1. Always close database connections
const db = getDatabase();
// ... do operations
await db.closeAsync(); // Important!

// 2. Use transactions properly
try {
  await db.execAsync('BEGIN');
  // ... operations
  await db.execAsync('COMMIT');
} catch (error) {
  await db.execAsync('ROLLBACK');
  throw error;
}

// 3. Restart app if locked
// Kill app completely, reopen
```

**Prevention:**
- Use the database service functions (don't create manual connections)
- Always wrap multi-step operations in transactions
- Never keep connections open longer than needed

---

### Database Schema Outdated

**Symptoms:**
- `no such column` errors
- Type errors on database operations
- Missing tables or fields

**Cause:**
- Schema changed but old database still exists

**Solutions:**

```bash
# Option 1: Delete app data (iOS/Android)
# Uninstall app from device, reinstall

# Option 2: Manual reset (development only!)
# Add this code temporarily in app/_layout.tsx:
import { resetDatabase } from '@/services/database';

useEffect(() => {
  resetDatabase().then(() => {
    console.log('Database reset!');
  });
}, []);

# Then remove the code and reload
```

**⚠️ WARNING:** `resetDatabase()` deletes ALL data. Use only in development!

---

### Query Returns `null` or Empty Array

**Symptoms:**
- `getWorkoutById()` returns `null`
- `getUserWorkouts()` returns `[]`
- Data exists but queries fail

**Common Causes:**

```typescript
// 1. Wrong user_id (user not authenticated)
const userId = await getPersistedUserId();
if (!userId) {
  // User not logged in!
  console.log('User not authenticated');
}

// 2. Wrong data type
await db.runAsync('SELECT * FROM workouts WHERE id = ?', [123]);
// ❌ id is TEXT, not number

await db.runAsync('SELECT * FROM workouts WHERE id = ?', ['123']);
// ✅ Correct

// 3. Checking wrong field
const workout = await getWorkoutById('abc');
if (!workout) {
  // Workout doesn't exist OR query failed
  console.log('Workout not found or error');
}
```

**Debugging:**

```typescript
// Enable query logging
const db = getDatabase();
db.addChangeListener((event) => {
  console.log('DB Change:', event);
});

// Check if data exists
const all = await db.getAllAsync('SELECT * FROM workouts');
console.log('Total workouts:', all.length);
```

---

## 🎨 Styling & UI Issues

### Tailwind Classes Not Working

**Symptoms:**
- `className="..."` has no effect
- Styles not applied
- Layout broken

**Solutions:**

```bash
# 1. Ensure NativeWind is configured
# Check metro.config.js, tailwind.config.js, babel.config.js

# 2. Restart Metro with cache clear
npx expo start -c

# 3. Check class names are valid
# ❌ Bad: className="bg-[#ff0000]" (arbitrary values not fully supported)
# ✅ Good: className="bg-primary"

# 4. Verify global.css is imported
# In app/_layout.tsx:
import '../../global.css';
```

**Common Mistakes:**

```typescript
// ❌ Wrong: Using style prop with className
<View style={{ padding: 20 }} className="bg-primary" />

// ✅ Right: Use Tailwind classes
<View className="p-5 bg-primary" />

// ❌ Wrong: Invalid class names
<View className="padding-20" /> // Not a valid Tailwind class

// ✅ Right: Use correct Tailwind syntax
<View className="p-5" /> // p-5 = padding 1.25rem
```

---

### Colors Not Matching / Theme Issues

**Symptoms:**
- Colors look wrong
- Chart colors don't match theme
- Inconsistent styling

**Cause:**
- `src/constants/colors.ts` not matching `tailwind.config.js`

**Solution:**

```typescript
// src/constants/colors.ts
export const Colors = {
  primary: {
    DEFAULT: '#4299e1', // MUST match tailwind.config.js
  }
};

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4299e1', // MUST match Colors.ts
        }
      }
    }
  }
};
```

**Check:**
- [ ] Colors match between `colors.ts` and `tailwind.config.js`
- [ ] Using `Colors` not `COLORS` (naming changed)
- [ ] Importing from `@/constants` not `@/constants/colors`

---

## 🔐 Authentication Issues

### User Lost on App Restart

**Symptoms:**
- User logged in, app restart → logged out
- `useAuthStore.getState().user` is `null` after reload

**Cause:**
- Zustand not persisted (will be fixed in Correction #2)
- AsyncStorage not saving user

**Temporary Workaround:**

```typescript
// Check AsyncStorage manually
import { storage } from '@/services/storage';

const userId = await storage.get('auth:user_id');
console.log('Persisted user ID:', userId);
```

**Permanent Fix:**
- See [AUDIT_FIXES.md](./AUDIT_FIXES.md) → Correction #1 & #2

---

### Supabase "Invalid API Key" Error

**Symptoms:**
- `Supabase client error: Invalid API key`
- Auth operations fail

**Solutions:**

```bash
# 1. Check .env file exists
ls -la .env

# 2. Verify credentials are correct
# Go to Supabase Dashboard → Settings → API
# Copy EXACT values (no spaces, quotes, etc.)

# 3. Restart Metro (env changes require restart)
# Kill Metro (Ctrl+C)
npx expo start -c

# 4. Check env is loaded
# In app/_layout.tsx temporarily:
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
```

**Common Mistakes:**

```bash
# ❌ Wrong: Quotes in .env
EXPO_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"

# ✅ Right: No quotes
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

# ❌ Wrong: Missing EXPO_PUBLIC_ prefix
SUPABASE_URL=https://xxx.supabase.co

# ✅ Right: Correct prefix
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
```

---

## 📦 npm / Dependency Issues

### "Cannot Find Module" After npm install

**Symptoms:**
- `Error: Cannot find module 'some-package'`
- Package installed but not found

**Solutions:**

```bash
# 1. Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# 2. Check package.json
# Ensure package is listed in dependencies

# 3. Restart Metro
npx expo start -c
```

---

### Peer Dependency Warnings

**Symptoms:**
- `npm install` shows peer dependency warnings
- Different React versions

**Solutions:**

```bash
# Use --legacy-peer-deps flag
npm install --legacy-peer-deps

# For Expo, this is usually safe
# Expo manages React Native version internally
```

---

## 🐛 TypeScript Errors

### "Cannot find name" or Import Errors

**Symptoms:**
- TypeScript can't find imports
- `Cannot find name 'Colors'`
- VSCode shows red squiggles

**Solutions:**

```bash
# 1. Restart TypeScript server (VSCode)
# Cmd+Shift+P (macOS) or Ctrl+Shift+P (Windows)
# → "TypeScript: Restart TS Server"

# 2. Check tsconfig.json paths
# Ensure @/* alias is configured

# 3. Run type check
npm run type-check

# 4. Check import paths
# ❌ Bad: import { Colors } from '@/constants/colors';
# ✅ Good: import { Colors } from '@/constants';
```

---

### Type Errors After Correction Implementations

**After implementing audit fixes:**

```bash
# Always run type-check after changes
npm run type-check

# Common issues:
# 1. Missing exports in index.ts
# 2. Incorrect type imports (type vs regular)
# 3. Circular dependencies
```

---

## 🚀 Performance Issues

### App Slow / Laggy

**Symptoms:**
- UI feels sluggish
- Animations choppy
- Long loading times

**Debugging:**

```typescript
// 1. Enable performance monitoring
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions(() => {
  console.log('Interactions complete');
});

// 2. Profile renders (React DevTools)
// Install React Native Debugger

// 3. Check database query times
const start = Date.now();
await getWorkoutById(id);
console.log('Query took:', Date.now() - start, 'ms');
```

**Common Causes:**
- Slow database queries (missing indexes → see Correction #6)
- Too many re-renders
- Large lists without FlashList
- Unoptimized images

---

## 📝 Adding New Issues to This Guide

When you encounter and fix a new issue:

1. **Add a new section** with:
   - Clear symptoms
   - Root cause
   - Solution (code/commands)
   - Prevention tips

2. **Use this template:**

```markdown
### Issue Name

**Symptoms:**
- What you see/experience

**Cause:**
- Why it happens

**Solutions:**
[bash/typescript code blocks]

**Prevention:**
- How to avoid in future
```

3. **Commit the change:**
```bash
git add docs/TROUBLESHOOTING.md
git commit -m "docs(troubleshooting): add solution for [issue]"
```

---

## 🆘 Still Stuck?

If issue not listed here:

1. **Check Git commits** for similar fixes:
   ```bash
   git log --grep="fix" --oneline
   ```

2. **Search Metro logs** carefully - error messages often explain the issue

3. **Review [AUDIT_FIXES.md](./AUDIT_FIXES.md)** - your issue might be a known problem with planned correction

4. **Add it to this guide** once solved - help future you! 🚀
