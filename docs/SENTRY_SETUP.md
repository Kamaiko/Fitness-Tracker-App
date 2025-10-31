# Sentry Setup Guide

This guide explains how to configure Sentry for production error monitoring in Halterofit.

---

## 🎯 What is Sentry?

Sentry is a production error monitoring service that:

- Captures crashes and errors in production
- Provides detailed error context (stack traces, breadcrumbs)
- Tracks performance issues
- Alerts you when errors occur

**Important:** Sentry is **disabled in development** (`__DEV__ = true`). Only production builds send errors to Sentry.

---

## 🚀 Step 1: Create Sentry Account (Free)

1. Go to: https://sentry.io/signup/
2. Create a free account (Developer plan - 5k errors/month free)
3. Verify your email

---

## 📱 Step 2: Create React Native Project

1. After login, click **"Create Project"**
2. Select platform: **React Native**
3. Set Alert frequency: **Alert me on every new issue**
4. Project name: `halterofit` (or your preferred name)
5. Team: Default (or create new)
6. Click **"Create Project"**

---

## 🔑 Step 3: Get Your DSN

After creating the project:

1. Copy the **DSN** (looks like: `https://abc123@sentry.io/456789`)
2. Open your `.env` file
3. Add the DSN:
   ```bash
   EXPO_PUBLIC_SENTRY_DSN=https://your-actual-dsn@sentry.io/your-project-id
   ```
4. Save the file

**Note:** The DSN is in `.env` (gitignored). Never commit it to git!

---

## ✅ Step 4: Verify Installation

Sentry is already integrated in the codebase. You just need the DSN!

**Files already configured:**

- ✅ `src/utils/sentry.ts` - Sentry configuration
- ✅ `app/_layout.tsx` - Initialization at app startup
- ✅ `src/hooks/ui/useErrorHandler.ts` - Automatic error reporting

---

## 🧪 Step 5: Test in Development

### Test 1: Verify Sentry is Disabled in Dev

```bash
npm start
# In Metro console, you should see:
# [Sentry] Disabled in development mode
```

✅ **Expected:** Sentry logs that it's disabled (errors NOT sent)

### Test 2: Test Error Handling (Local)

In any component:

```typescript
import { useErrorHandler } from '@/hooks/ui/useErrorHandler';

const { handleError } = useErrorHandler();

// Trigger test error
handleError(new Error('Test error'), 'testContext');
```

✅ **Expected:**

- Alert shown to user
- Error logged to console
- NOT sent to Sentry (dev mode)

---

## 🚀 Step 6: Test in Production Build

### Build Production Version

```bash
# Android
eas build --platform android --profile production

# iOS (requires macOS + Apple Developer account)
eas build --platform ios --profile production
```

### Test Production Errors

1. Install the production build on your device
2. Trigger a test error (e.g., try to create workout while signed out)
3. Check Sentry dashboard: https://sentry.io/organizations/[your-org]/issues/

✅ **Expected:** Error appears in Sentry dashboard within ~30 seconds

---

## 📊 Step 7: Monitoring in Production

### Viewing Errors

1. Go to: https://sentry.io
2. Select your project: `halterofit`
3. Click **"Issues"** tab
4. See all production errors with:
   - Full stack traces
   - User context (user ID)
   - Device info
   - Breadcrumbs (event trail)

### Understanding Error Details

Each error includes:

- **User Message:** Simple, user-friendly message
- **Developer Message:** Technical details
- **Error Code:** AUTH_ERROR, DATABASE_ERROR, etc.
- **Context:** Function/component where error occurred
- **Stack Trace:** Full error location
- **Breadcrumbs:** User actions leading to error

### Performance Monitoring

Go to **"Performance"** tab to see:

- Screen load times
- Database query durations
- API call latencies

---

## 🔧 Configuration Options

### Adjust Sample Rate

In `src/utils/sentry.ts`, adjust:

```typescript
tracesSampleRate: 1.0, // 100% of transactions
// Change to 0.1 for 10% (high traffic apps)
```

### Add Custom Breadcrumbs

```typescript
import { addSentryBreadcrumb } from '@/utils/sentry';

addSentryBreadcrumb('User started workout', 'user', 'info');
```

### Capture Custom Exceptions

```typescript
import { captureSentryException } from '@/utils/sentry';

try {
  // risky operation
} catch (error) {
  captureSentryException(error, { customField: 'value' });
}
```

---

## 🔒 Privacy & Security

**User Privacy:**

- Emails are scrubbed (see `beforeSend` in sentry.ts)
- Only user IDs are sent (no PII)
- IP addresses are NOT stored

**Security:**

- DSN is public (safe to expose in client code)
- Service role key stays on server (Supabase)
- Sentry uses HTTPS for all data

---

## 💰 Pricing

**Free Tier:**

- 5,000 errors/month
- 10,000 performance units/month
- 1 user seat
- 30-day retention

**Upgrade if needed:**

- Team plan: $26/month (50k errors)
- Business plan: $80/month (unlimited)

For MVP: Free tier is more than enough!

---

## 🆘 Troubleshooting

### "Sentry not capturing errors"

1. Check DSN is set: `echo $EXPO_PUBLIC_SENTRY_DSN`
2. Verify production build (not dev mode)
3. Check network connectivity
4. Look for console errors

### "Too many events (quota exceeded)"

1. Lower `tracesSampleRate` in sentry.ts
2. Add filters in `beforeSend` function
3. Upgrade Sentry plan

### "Can't see error details"

1. Ensure source maps are uploaded (auto with EAS)
2. Check Sentry project settings
3. Verify error wasn't filtered by `beforeSend`

---

## 📚 Resources

- **Sentry Docs:** https://docs.sentry.io/platforms/react-native/
- **Sentry Dashboard:** https://sentry.io
- **React Native SDK:** https://github.com/getsentry/sentry-react-native

---

**Need Help?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or open an issue!
