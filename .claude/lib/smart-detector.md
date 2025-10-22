# Smart Task Detector

> **Purpose**: Detect completed tasks by analyzing Claude's actions against TASKS.md
> **Version**: 2.0 (simplified)
> **Trigger**: PreCompact hook (`.claude/hooks/pre-compact.py`)
> **References**: [tasks-format.md](./tasks-format.md)

---

## 🎯 Core Algorithm

### Step 1: Parse Incomplete Tasks

**Read TASKS.md in real-time:**

```typescript
function extractIncompleteTasks(tasksContent: string) {
  const tasks = []
  const lines = tasksContent.split('\n')

  for (const line of lines) {
    // Match: "- [ ] ID **Description**"
    const match = line.match(/- \[\s?\] ([\d\w.]+)\s+\*\*(.+?)\*\*/)

    if (match) {
      tasks.push({
        id: match[1],           // e.g., "0.5.2"
        description: match[2],  // e.g., "Implement database schema"
        fullLine: line
      })
    }
  }

  return tasks
}
```

---

### Step 2: Load Recent Actions

```typescript
function loadRecentActions(hours: number = 6) {
  // Read .claude/.actions.json (created by post-tool-use.py)
  const actionsFile = readFile('.claude/.actions.json')
  const lines = actionsFile.split('\n').filter(l => l.trim())

  const cutoff = Date.now() - (hours * 60 * 60 * 1000)
  const actions = []

  for (const line of lines) {
    try {
      const action = JSON.parse(line)
      if (action.time >= cutoff) {
        actions.push(action)
      }
    } catch (e) {
      continue  // Skip malformed lines
    }
  }

  return actions
}
```

**Example `.actions.json`:**
```json
{"tool":"Write","target":"supabase/migrations/001_initial.sql","time":1736789123}
{"tool":"Edit","target":"src/models/Workout.ts","time":1736789234}
{"tool":"Bash","target":"npm install @supabase/supabase-js","time":1736789345}
```

---

### Step 3: Match Actions to Tasks

```typescript
function detectCompletedTasks() {
  // 1. Get incomplete tasks
  const tasksContent = readFile('docs/TASKS.md')
  const tasks = extractIncompleteTasks(tasksContent)

  // 2. Get recent actions (last 6 hours)
  const actions = loadRecentActions(6)

  // 3. Match each task
  const matches = []
  for (const task of tasks) {
    const score = calculateMatchScore(task.description, actions)

    if (score >= 0.7) {  // 70% threshold
      matches.push({
        taskId: task.id,
        description: task.description,
        confidence: score,
        actions: actions.map(a => `${a.tool} ${a.target}`)
      })
    }
  }

  return matches
}

function calculateMatchScore(description: string, actions: Action[]): number {
  // Extract keywords from task description
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
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'to', 'of', 'in', 'on', 'at']

  return description
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')  // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !stopWords.includes(word))
}
```

---

## 💡 Example Detection

**Scenario:** Working on task 0.5.2 "Implement database schema in Supabase"

**TASKS.md:**
```markdown
- [ ] 0.5.2 **Implement database schema in Supabase** (M - 3h)
```

**Actions during session:**
```json
{"tool":"Write","target":"supabase/migrations/001_initial.sql","time":...}
{"tool":"Edit","target":"README.md","time":...}
{"tool":"Bash","target":"supabase db reset","time":...}
```

**Detection:**
1. Keywords: `["implement", "database", "schema", "supabase"]`
2. Actions text: `"write supabase/migrations/001_initial.sql edit readme.md bash supabase db reset"`
3. Matches:
   - "implement" → ❌ not found (0)
   - "database" → ❌ not found (0)
   - "schema" → ❌ not found (0)
   - "supabase" → ✅ found 2 times (1)
4. Basic score: 1/4 = 25%
5. **Enhanced:** "supabase" appears in filename + bash command → boost to 75%
6. **Result:** 75% > 70% threshold → **DETECTED!**

---

## 📊 Configuration

```typescript
const CONFIG = {
  CONFIDENCE_THRESHOLD: 0.7,      // 70%
  ACTION_WINDOW_HOURS: 6,         // Last 6 hours
  ACTIONS_RETENTION_DAYS: 7,      // Keep 7 days
  KEYWORD_MIN_LENGTH: 2,
  STOP_WORDS: ['the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'to', 'of', 'in', 'on', 'at']
}
```

---

## 🔄 Workflow

```
1. Claude uses Edit/Write/Bash tools
   ↓
2. post-tool-use.py logs to .actions.json
   ↓
3. PreCompact hook fires (~20 min or manual /compact)
   ↓
4. pre-compact.py triggers detection
   ↓
5. Claude reads this file (smart-detector.md)
   ↓
6. Claude applies algorithm above
   ↓
7. Claude reports matches >70%
   ↓
8. User confirms YES/NO
   ↓
9. If YES → call task-tracker.md to update TASKS.md
```

---

## 🛡️ Error Handling

**Fail-safe parsing:**
```typescript
try {
  const tasks = extractIncompleteTasks(tasksContent)
  if (tasks.length === 0) {
    return []  // No incomplete tasks found
  }
} catch (error) {
  return []  // Graceful degradation
}
```

**Malformed actions:**
```typescript
for (const line of lines) {
  try {
    const action = JSON.parse(line)
    actions.push(action)
  } catch (e) {
    continue  // Skip bad lines
  }
}
```

---

## 🔍 Debugging

```bash
# View recent actions
tail -10 .claude/.actions.json

# Check incomplete tasks
grep "- \[" docs/TASKS.md | grep -v "\[x\]"

# Count actions
wc -l .claude/.actions.json
```

---

## ✅ Format Requirements

**See [tasks-format.md](./tasks-format.md) for complete rules.**

**Key requirements:**
- Tasks MUST use checkbox format: `- [ ] ID **Desc**`
- NO header-based tasks: `### ID **Task**`
- Description MUST be bold: `**text**`
- IDs can be flexible: `0.5.2`, `0.5bis.1`, etc.

---

**Version:** 2.0 (simplified)
**Last Updated:** Auto-maintained
**Maintained by:** Smart detection system
