# .claude/ Directory Structure

> **Purpose**: Claude Code configuration, agents, hooks, and automation system
> **Version**: 1.0
> **Last Updated**: January 2025

---

## 📁 Directory Structure

```
.claude/
├── agents/                      # AI agents (execution logic)
│   ├── task-tracker.md         # Execute TASKS.md updates (541 lines)
│   └── session-end.md          # Verify documentation consistency (704 lines)
├── hooks/                       # Lifecycle event triggers (40 lines total)
│   ├── post-tool-use.json      # Log every Claude action
│   ├── pre-compact.json        # Trigger smart task detection
│   ├── session-end.json        # Verify consistency on exit
│   └── session-start.json      # Auto-initialize session
├── lib/                         # Reference documentation
│   ├── smart-detector.md       # Detection algorithm (365 lines)
│   └── tasks-format.md         # Strict format rules (206 lines)
├── CLAUDE.md                   # Session startup guide (114 lines)
├── README.md                   # This file - Architecture documentation
└── settings.local.json         # Local settings (git-ignored)
```

**Total:** ~2000 lines (optimized for minimal token usage)

---

## 📄 File Descriptions

### Core Configuration

**CLAUDE.md**
- **Purpose**: Session startup protocol and navigation guide
- **Read by**: Claude at start of every session
- **Contains**:
  - Session startup checklist
  - Documentation navigation map
  - Commit conventions
  - Session end checklist

**settings.local.json**
- **Purpose**: Local Claude Code settings (user-specific)
- **Git**: Ignored (not committed)
- **Contains**: User preferences, API keys, local overrides

---

### Library (Reference Documentation)

**lib/tasks-format.md** (206 lines)
- **Purpose**: Single source of truth for TASKS.md format rules
- **Referenced by**: smart-detector, task-tracker, session-end
- **Contains**:
  - Strict checkbox format rules
  - Phase/section header conventions
  - Validation commands
  - Complete examples (correct vs incorrect)
- **Why separate**: DRY principle - referenced by all other files

**lib/smart-detector.md** (365 lines)
- **Purpose**: Algorithm for detecting completed tasks via action analysis
- **Triggered by**: PreCompact hook
- **How it works**:
  1. Reads `.actions.json` (tracked by post-tool-use hook)
  2. Parses incomplete tasks from TASKS.md
  3. Matches actions vs tasks (keyword extraction)
  4. Returns matches >70% confidence
- **Features**:
  - Regex pattern: `/- \[\s?\] ([\d\w.]+)\s+\*\*(.+?)\*\*/`
  - Keyword-based scoring
  - Fallback to manual detection

---

### Agents (Execution Logic)

**agents/task-tracker.md** (541 lines)
- **Purpose**: Execute atomic updates to TASKS.md/README.md
- **Called by**: User confirmation after smart-detector match
- **Actions** (4-step atomic):
  1. Mark checkbox in TASKS.md
  2. Update progress counter (version-safe algorithm)
  3. Update NEXT SESSION section
  4. Sync to README.md
- **Features**:
  - Batch mode (<10min) vs immediate mode
  - Phase completion detection
  - Error handling (abort if any step fails)
  - Conventional commit messages
- **References**: tasks-format.md, smart-detector.md

**agents/session-end.md** (704 lines)
- **Purpose**: Verify documentation consistency at session end
- **Triggered by**: SessionEnd hook
- **Checks**:
  1. Uncommitted changes
  2. NEXT SESSION marker accuracy
  3. Progress counter sync
  4. Checkbox count validation
- **Actions**:
  - Generate consistency report
  - Suggest fixes
  - Cannot block termination
- **References**: tasks-format.md

---

### Hooks (Lifecycle Triggers)

**hooks/post-tool-use.json**
- **Event**: After EVERY tool Claude uses (Edit, Write, Bash, etc.)
- **Action**: Log action to `.claude/.actions.json`
- **Format**: `{tool, target, time}`
- **Purpose**: Feed data to smart-detector for task detection

**hooks/pre-compact.json**
- **Event**: Before conversation compaction (~95% context)
- **Action**: Trigger smart-detector algorithm
- **Purpose**: Detect completed tasks, batch updates before context loss

**hooks/session-start.json**
- **Event**: Session startup (3 matchers: startup/resume/clear)
- **Action**: Read TASKS.md NEXT SESSION, warn if context >60%
- **Purpose**: Auto-initialize session, prevent mid-task compact

**hooks/session-end.json**
- **Event**: Session termination
- **Action**: Trigger session-end agent
- **Purpose**: Verify consistency, suggest commits

---

## 🔄 How It All Works Together

### Action Tracking (Continuous)

```
1. Claude uses Edit/Write/Bash tool
2. post-tool-use hook fires
3. Logs to .claude/.actions.json
   → {tool: "Edit", target: "src/models/Workout.ts", time: 1736789123}
```

### Task Detection (Every ~20 min)

```
1. PreCompact hook fires (~95% context or manual)
2. smart-detector.md reads:
   - .claude/.actions.json (recent actions)
   - docs/TASKS.md (incomplete tasks)
3. Matches actions vs tasks (keyword extraction)
4. Returns tasks with >70% confidence
5. Presents to user: "Detected task 0.5.2 complete (85%). Update? [YES/NO]"
```

### Task Update (User Confirms)

```
1. User confirms: YES
2. task-tracker.md executes 4-step atomic update:
   - Mark checkbox in TASKS.md
   - Update progress counter
   - Update NEXT SESSION
   - Sync to README.md
3. Commits with conventional message
```

### Session End (Cleanup)

```
1. User ends session (/end or closes)
2. SessionEnd hook fires
3. session-end.md runs checks:
   - Uncommitted changes?
   - NEXT SESSION correct?
   - Progress counters synced?
4. Reports issues + suggests fixes
5. Session ends (non-blocking)
```

---

## 🎯 Key Principles

### 1. Separation of Concerns

| File | Responsibility |
|------|----------------|
| CLAUDE.md | Session startup guide |
| lib/*.md | Reference documentation (format rules, algorithms) |
| agents/*.md | Execution logic (updates, verification) |
| hooks/*.json | Event trigger configuration |

**Benefit**: Clear boundaries, easy to maintain

---

### 2. Idempotency

**All agents are idempotent** - safe to run multiple times.

Example:
```typescript
if (currentState === desiredState) {
  skip() // Already done
} else {
  applyFix()
}
```

**Benefit**: Crash-safe, retry-safe

---

### 3. Atomic Updates

**All documentation updates are atomic** - all-or-nothing.

Example:
```typescript
// Execute ALL steps or NONE
step1_markCheckbox()  // ← fails here? Abort all
step2_updateCounter() // ← or here? Abort all
step3_updateBadge()   // ← or here? Abort all
step4_syncReadme()    // ← or here? Abort all
```

**Benefit**: Documentation always consistent

---

### 4. Confirmation Required

**No changes without user approval.**

Even with 100% confidence, agents always ask:
```
Should I update TASKS.md? [YES/NO]
```

**Benefit**: User maintains control

---

## 🔧 Configuration

### Adjustable Parameters

**task-tracker.md:**
```markdown
BATCH_THRESHOLD_MINUTES = 10  # Batch mode cutoff

BADGE_THRESHOLDS = {
  red: [0, 25],
  orange: [26, 50],
  yellow: [51, 75],
  green: [76, 100]
}

TOTAL_TASKS = 96  # Update when roadmap changes
```

**session-end.md:**
```markdown
# Timeout: 60 seconds (hook limit)
# Checks: 5 consistency verifications
# Mode: Non-blocking (cleanup only)
```

---

## 🚀 Getting Started

### First Time Setup

**No setup required!**

The system is ready to use immediately. The automation works automatically:

1. Claude tracks your actions (post-tool-use hook)
2. Every ~20min, smart-detector analyzes actions
3. Detects completed tasks (>70% confidence)
4. Asks for confirmation before updating

---

### Daily Usage

**Read this at session start:**

1. Open [CLAUDE.md](CLAUDE.md)
2. Follow "Session Startup Protocol"
3. Navigate to current work
4. Use automation system naturally

**At session end:**

1. Review session-end report
2. Apply suggested fixes
3. Commit uncommitted changes

---

## 📚 Documentation Hierarchy

**Read in this order to understand the system:**

1. **README.md** ← START HERE (this file - architecture overview)
2. **CLAUDE.md** ← Daily startup protocol
3. **lib/tasks-format.md** ← Format rules reference
4. **lib/smart-detector.md** ← Detection algorithm
5. **agents/task-tracker.md** ← Update execution logic
6. **agents/session-end.md** ← Consistency verification

---

## 🐛 Troubleshooting

### Issue: Hooks not firing

**Diagnosis:**
```bash
# Check if hooks directory exists
ls .claude/hooks/

# Verify JSON syntax
cat .claude/hooks/pre-compact.json
```

**Fix:**
- Ensure files are named exactly: `pre-compact.json`, `session-end.json`
- Verify JSON is valid (no trailing commas, etc.)

---

### Issue: Agent not detecting tasks

**Diagnosis:**
- Check task ID format: `0.5bis.3` ✅ vs `0.5-bis-3` ❌
- Verify keyword usage: "completed task X"
- Read agent logs for detection attempts

**Fix:**
- Be explicit with task IDs
- Use recognized keywords
- Tell Claude directly: "Mark task X complete"

---

### Issue: Documentation out of sync

**Diagnosis:**
```bash
# Check actual checkbox count
grep -c '\- \[x\]' docs/TASKS.md

# Check reported count
grep 'Progress:' docs/TASKS.md
```

**Fix:**
- Session-end agent will detect mismatch
- Confirm correct count
- Agent will sync both files

---

## 🔒 Security & Privacy

### Local Settings

**settings.local.json** is git-ignored for security:
- Never committed to repository
- Contains user-specific preferences
- May contain API keys or tokens

**To share settings:** Create `settings.example.json` with placeholder values.

---

### Agent Permissions

Agents can only:
✅ Read documentation files
✅ Edit with user confirmation
✅ Commit with conventional messages

Agents cannot:
❌ Access system files outside project
❌ Make network requests
❌ Execute arbitrary code
❌ Modify files without confirmation

---

## 📊 Statistics

**System Coverage:**

| Metric | Value |
|--------|-------|
| Files automated | 2 (TASKS.md, README.md) |
| Library docs | 2 (tasks-format, smart-detector) |
| Agents | 2 (task-tracker, session-end) |
| Hooks | 4 (post-tool-use, pre-compact, session-start, session-end) |
| Checks | 4 (session-end verification) |
| Update steps | 4 (atomic operation) |

**Performance:**

| Operation | Time |
|-----------|------|
| Task detection | < 1s |
| Confirmation wait | User-dependent |
| 4-step update | 3-5s |
| Git commit | 1-2s |
| Total per task | ~5-10s |

---

## 🎓 Best Practices

### For Users

1. ✅ **Let automation work** (actions tracked automatically)
2. ✅ **Confirm detections** when prompted
3. ✅ **Review session-end reports** before closing
4. ✅ **Trust atomic updates** (consistency guaranteed)
5. ✅ **Manual compact at 70%** to avoid mid-task interruption

### For Developers

1. ✅ **Keep agents idempotent** (safe to retry)
2. ✅ **Maintain atomic updates** (all-or-nothing)
3. ✅ **Always confirm** before modifying docs
4. ✅ **Document changes** in agent .md files
5. ✅ **Version control hooks** with the project

---

## 🔄 Version History

**Version 1.0** (January 2025)
- Initial implementation
- task-tracker.md agent
- session-end.md agent
- PreCompact and SessionEnd hooks
- Restructured TASKS.md with strict format
- Comprehensive documentation

---

## 📖 Additional Resources

**Claude Code Documentation:**
- [Hooks Reference](https://docs.claude.com/en/docs/claude-code/hooks)
- [Agents Guide](https://docs.claude.com/en/docs/claude-code/agents)
- [Best Practices](https://docs.claude.com/en/docs/claude-code/best-practices)

**Project Documentation:**
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Setup guide
- [TASKS.md](../docs/TASKS.md) - Task roadmap
- [README.md](../README.md) - Project overview

---

**Questions?** Read agent .md files for implementation details.

**Issues?** Check Troubleshooting section above or consult hooks/*.json for configuration.

**Version:** 1.0 | **Last Updated:** January 2025
