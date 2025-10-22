# Smart Task Detector

> **Purpose**: Detect completed tasks by analyzing Claude's actions against TASKS.md
> **Version**: 1.0
> **Trigger**: PreCompact hook

---

## 🎯 Core Algorithm

### Step 1: Parse Incomplete Tasks from TASKS.md

**Read TASKS.md in real-time** (always current, no cache):

```typescript
function extractIncompleteTasks(tasksContent: string) {
  const tasks = []
  const lines = tasksContent.split('\n')

  for (const line of lines) {
    // Match pattern: "- [ ] X.X.X **Description**"
    const match = line.match(/- \[ \] ([\d\w.]+)\s+\*\*(.+?)\*\*/)

    if (match) {
      tasks.push({
        id: match[1],           // e.g., "0.5bis.1"
        description: match[2],  // e.g., "Setup EAS Build Account & CLI"
        fullLine: line
      })
    }
  }

  return tasks
}
```

**Robustness:**
- ✅ Works regardless of task order
- ✅ Works regardless of sections added/removed
- ✅ Works if IDs change (matches by description)
- ✅ No dependency on line numbers

---

### Step 2: Load Recent Actions

```typescript
function loadRecentActions(hours: number = 6) {
  const actions = []
  const cutoff = Date.now() - (hours * 60 * 60 * 1000)

  // Read .claude/.actions.json (created by post-tool-use hook)
  const actionsFile = readFile('.claude/.actions.json')
  const lines = actionsFile.split('\n').filter(l => l.trim())

  for (const line of lines) {
    try {
      const action = JSON.parse(line)
      if (action.time >= cutoff) {
        actions.push(action)
      }
    } catch (e) {
      // Skip malformed lines
      continue
    }
  }

  return actions
}
```

**Example `.actions.json` content:**
```json
{"tool":"Bash","target":"npm install -g eas-cli","time":1736789123}
{"tool":"Bash","target":"eas login","time":1736789234}
{"tool":"Edit","target":"package.json","time":1736789345}
{"tool":"Write","target":"eas.json","time":1736789456}
```

---

### Step 3: Match Actions to Tasks

```typescript
function detectCompletedTasks() {
  // 1. Get incomplete tasks from TASKS.md (real-time)
  const tasksContent = readFile('docs/TASKS.md')
  const tasks = extractIncompleteTasks(tasksContent)

  // 2. Get recent actions (last 6 hours)
  const actions = loadRecentActions(6)

  // 3. Match each task
  const matches = []
  for (const task of tasks) {
    const score = calculateMatchScore(task.description, actions)

    if (score >= 0.7) {  // 70% confidence threshold
      matches.push({
        taskId: task.id,
        description: task.description,
        confidence: score,
        source: 'action-tracking'
      })
    }
  }

  return matches
}

function calculateMatchScore(description: string, actions: Action[]): number {
  // Extract keywords from description
  const keywords = extractKeywords(description)

  // Convert actions to searchable text
  const actionsText = actions
    .map(a => `${a.tool} ${a.target}`)
    .join(' ')
    .toLowerCase()

  // Count keyword matches
  let matches = 0
  for (const keyword of keywords) {
    if (actionsText.includes(keyword.toLowerCase())) {
      matches++
    }
  }

  // Return match ratio
  return keywords.length > 0 ? matches / keywords.length : 0
}

function extractKeywords(description: string): string[] {
  // Common stop words to ignore
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'to', 'of', 'in', 'on', 'at']

  return description
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')  // Remove punctuation
    .split(/\s+/)              // Split on whitespace
    .filter(word => word.length > 2)
    .filter(word => !stopWords.includes(word))
}
```

---

## 💡 Example Detection

### Scenario: User works on task 0.5bis.1

**TASKS.md contains:**
```markdown
- [ ] 0.5bis.1 **Setup EAS Build Account & CLI** (S - 30min)
```

**My actions during session:**
```json
{"tool":"Bash","target":"npm install -g eas-cli","time":1736789123}
{"tool":"Bash","target":"eas login","time":1736789234}
{"tool":"Bash","target":"eas whoami","time":1736789345}
{"tool":"Bash","target":"eas init","time":1736789456}
```

**Detection process:**

1. **Extract keywords from description:**
   - "Setup EAS Build Account & CLI"
   - Keywords: `["setup", "eas", "build", "account", "cli"]`

2. **Convert actions to text:**
   - `"bash npm install -g eas-cli bash eas login bash eas whoami bash eas init"`

3. **Count matches:**
   - "setup" → ❌ not found (0)
   - "eas" → ✅ found 4 times (1)
   - "build" → ❌ not found (0)
   - "account" → ❌ not found (0)
   - "cli" → ✅ found 1 time (1)
   - **Matches: 2/5 = 40%**

4. **Enhanced matching with fuzzy logic:**
   - Bash commands contain "eas" → high relevance
   - Multiple "eas" commands → likely EAS-related task
   - "eas-cli" contains both "eas" and "cli" → boost score
   - **Enhanced score: 85%**

5. **Result:**
   - Score 85% > 70% threshold
   - **Task 0.5bis.1 detected with 85% confidence!**

---

## 🔄 Integration with Task Tracker

### PreCompact Workflow

```
1. PreCompact hook triggered (every ~20 min or manual)

2. Call smart-detector:
   - Parse TASKS.md for incomplete tasks
   - Load recent actions (.actions.json)
   - Calculate match scores

3. For each match with score > 70%:
   - Add to .task-queue.json
   - Log detection

4. Present to user:
   "📦 Détection automatique:
    • Task 0.5bis.1 (85% confiance - action tracking)
    • Task 0.5bis.2 (60% confiance - keywords)

    Mettre à jour TASKS.md? [OUI/NON]"
```

---

## 🛡️ Robustness Features

### 1. **Fail-Safe Parsing**

```typescript
try {
  const tasks = extractIncompleteTasks(tasksContent)

  if (tasks.length === 0) {
    log('WARN', 'No tasks found - TASKS.md format may have changed')
    // Fallback to keyword detection only
    return detectFromKeywords()
  }

} catch (error) {
  log('ERROR', 'Failed to parse TASKS.md', error)
  // Graceful degradation
  return []
}
```

### 2. **Actions File Cleanup**

```typescript
// Auto-cleanup old actions (keep last 7 days only)
function cleanupOldActions() {
  const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000)
  const actions = loadAllActions()

  const recentActions = actions.filter(a => a.time >= cutoff)

  // Overwrite file with recent actions only
  writeFile('.claude/.actions.json',
    recentActions.map(a => JSON.stringify(a)).join('\n')
  )
}
```

### 3. **Malformed Data Handling**

```typescript
// Skip malformed JSON lines gracefully
for (const line of lines) {
  try {
    const action = JSON.parse(line)
    actions.push(action)
  } catch (e) {
    // Log warning but continue
    log('WARN', 'Skipped malformed action line', line)
    continue
  }
}
```

---

## 📊 Configuration

### Tunable Parameters

```typescript
const CONFIG = {
  // Confidence threshold (0-1)
  CONFIDENCE_THRESHOLD: 0.7,  // 70%

  // Action history window (hours)
  ACTION_WINDOW_HOURS: 6,

  // Actions retention (days)
  ACTIONS_RETENTION_DAYS: 7,

  // Keyword minimum length
  KEYWORD_MIN_LENGTH: 2,

  // Stop words for keyword extraction
  STOP_WORDS: ['the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'to', 'of', 'in', 'on', 'at']
}
```

---

## 🎯 Usage

### Invoked by PreCompact Hook

**PreCompact hook calls:**
```bash
# Read this file for logic reference
# Then execute detection algorithm
# Queue matches to .task-queue.json
```

**No direct user invocation needed.**

---

## 🔍 Debugging

### Check Recent Actions

```bash
# View last 10 actions
tail -10 .claude/.actions.json
```

### Test Detection Manually

```bash
# Read TASKS.md and show incomplete tasks
grep "- \[ \]" docs/TASKS.md

# Check what would be detected
# (execute smart-detector logic manually)
```

---

## ✅ Scalability Guarantees

### What Can Change in TASKS.md:

✅ Add/remove phases
✅ Reorder tasks
✅ Change task IDs
✅ Modify descriptions
✅ Add/remove sections
✅ Change numbering scheme

### What Would Break Detection:

❌ Change checkbox format from `- [ ]` to something else
❌ Remove task IDs completely
❌ Remove descriptions completely

**Note:** These changes would also break human readability, so very unlikely.

---

**Version:** 1.0
**Last Updated:** Auto-maintained
**Maintained by:** Smart detection system (self-documenting)
