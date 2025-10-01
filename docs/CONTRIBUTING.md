# 🤝 Contributing Guide

Welcome! This guide will help you set up the project and start contributing.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Expo Go** app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
- **Git** ([Download](https://git-scm.com/))

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kamaiko/Fitness-Tracker-App.git
   cd Fitness-Tracker-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env and add your Supabase credentials
   EXPO_PUBLIC_SUPABASE_URL=your_url_here
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open on your phone**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Make sure your phone and computer are on the same WiFi network

---

## 📁 Project Structure

```
Fitness-Tracker-App/
├── src/                    # Source code
│   ├── app/                # Expo Router screens
│   ├── components/         # Reusable components
│   ├── services/           # External services
│   ├── stores/             # State management
│   └── theme/              # Design system
├── docs/                   # Documentation
├── assets/                 # Images, fonts, etc.
├── .env                    # Environment variables (gitignored)
├── package.json            # Dependencies
└── README.md               # Project overview
```

See [STRUCTURE.md](./STRUCTURE.md) for detailed structure documentation.

---

## 🛠️ Development Workflow

### 1. Pick a Task
- Check [TASKS.md](./TASKS.md) for the next priority task
- Look for tasks marked as "Current Focus"
- Start with tasks in Phase 1 if you're new

### 2. Create a Feature Branch
```bash
git checkout -b feature/task-description
# or
git checkout -b fix/bug-description
```

### 3. Make Changes
- Follow the coding standards in [TECHNICAL.md](./TECHNICAL.md)
- Keep changes focused on the task
- Test your changes on a real device

### 4. Commit Your Changes
Follow the commit convention from `.claude/CLAUDE.md`:

```bash
# Format: <type>(<scope>): <description>

git add .
git commit -m "feat(auth): add login screen UI"
```

**Commit Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code formatting (no logic change)
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance (deps, config)

**Examples:**
```bash
git commit -m "feat(workout): add RPE tracking to set logger"
git commit -m "fix(analytics): correct volume calculation"
git commit -m "docs(readme): update installation instructions"
```

### 5. Push and Create PR
```bash
git push origin feature/task-description
```

Then create a Pull Request on GitHub.

---

## 🧪 Testing Your Changes

### Manual Testing Checklist
- [ ] App builds without errors (`npm start`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Feature works on Android
- [ ] No console errors or warnings
- [ ] Dark theme is applied correctly
- [ ] Navigation still works

### Before Committing
1. Remove all `console.log()` statements
2. Check for TypeScript errors
3. Test on a real device (not just simulator)
4. Make sure the app doesn't crash

---

## 📝 Coding Standards

### TypeScript
```typescript
// ✅ DO: Use strict typing
interface User {
  id: string;
  email: string;
}

function getUser(id: string): User | null {
  // ...
}

// ❌ DON'T: Use 'any'
function getUser(id: any): any {
  // ...
}
```

### React Components
```typescript
// ✅ DO: Define props interface
interface ButtonProps {
  title: string;
  onPress: () => void;
}

export function Button({ title, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}

// ❌ DON'T: Use any for props
export function Button(props: any) {
  // ...
}
```

### Styling
```typescript
// ✅ DO: Use theme values
import { Colors, Spacing } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
});

// ❌ DON'T: Use hardcoded values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 16,
  },
});
```

### Imports
```typescript
// ✅ DO: Use relative imports (for now)
import { Colors } from '../theme/colors';
import { useAuthStore } from '../stores/authStore';

// ❌ DON'T: Use @ aliases (not configured yet)
import { Colors } from '@/theme/colors';
```

---

## 🎨 Design Guidelines

### Colors
- Always use colors from `src/theme/colors.ts`
- Never use hardcoded hex values
- Follow dark theme design

### Spacing
- Use 8px grid system from `src/theme/spacing.ts`
- Values: xs(4), sm(8), md(16), lg(24), xl(32), xxl(48), xxxl(64)

### Typography
- Use typography scale from `src/theme/typography.ts`
- Sizes: xs(12), sm(14), base(16), lg(18), xl(20), xxl(24), xxxl(30), xxxxl(36)
- Weights: regular(400), medium(500), semibold(600), bold(700)

---

## 🐛 Debugging

### Common Issues

**1. "Cannot find module" errors**
- Run `npm install` again
- Clear Metro cache: `npm start -- --clear`
- Restart Expo Go app on phone

**2. App crashes on start**
- Check for TypeScript errors: `npx tsc --noEmit`
- Look for console errors in terminal
- Try clearing cache and restarting

**3. QR code not working**
- Make sure phone and computer are on same WiFi
- Try manual connection in Expo Go
- Check firewall settings

**4. Slow performance**
- Clear Metro cache: `npm start -- --clear`
- Close other apps on phone
- Restart development server

### Debugging Tools
- **Console logs:** Check terminal where `npm start` is running
- **React DevTools:** Not configured yet
- **Expo DevTools:** Opens in browser when you run `npm start`

---

## 📚 Useful Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start -- --clear

# Run on Android (if emulator is running)
npm run android

# Run on iOS (macOS only, if simulator is running)
npm run ios

# Check TypeScript errors
npx tsc --noEmit

# Format code (if prettier is installed)
npm run format
```

---

## 🤔 Getting Help

### Resources
1. Check [TASKS.md](./TASKS.md) for what needs to be done
2. Read [TECHNICAL.md](./TECHNICAL.md) for architecture details
3. See [STRUCTURE.md](./STRUCTURE.md) for code organization
4. Look at existing code for examples

### When Stuck
1. Check the terminal for error messages
2. Search the error message online
3. Check Expo docs: https://docs.expo.dev/
4. Check React Native docs: https://reactnative.dev/

---

## ✅ PR Checklist

Before submitting a pull request:

- [ ] Code follows TypeScript best practices
- [ ] Uses theme values (colors, spacing, typography)
- [ ] No console.log statements
- [ ] TypeScript compiles without errors
- [ ] Tested on Android device
- [ ] Commit messages follow convention
- [ ] Updated TASKS.md to mark task as complete
- [ ] Updated documentation if needed

---

## 🎯 Tips for Success

1. **Start small** - Pick easy tasks first to learn the codebase
2. **Test frequently** - Check your changes on a real device often
3. **Ask questions** - Better to ask than to make assumptions
4. **Follow patterns** - Look at existing code and follow the same patterns
5. **Keep it simple** - Don't over-engineer solutions
6. **Update docs** - Keep TASKS.md and other docs up to date

---

## 📄 License

This project is private. All rights reserved.

---

**Happy Coding! 🚀**

If you have any questions, check the documentation or reach out to the team.
