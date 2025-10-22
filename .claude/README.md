# .claude/ Directory Structure

> **Purpose**: Claude Code configuration, agents, hooks, and automation system
> **Version**: 1.0
> **Last Updated**: January 2025

---

## 📁 Directory Structure

```
.claude/
├── agents/                      # AI agents for automation
│   ├── task-tracker.md         # Task completion detection & updates
│   └── session-end.md          # Session-end consistency checks
├── hooks/                       # Claude Code lifecycle hooks
│   ├── pre-compact.json        # Runs before conversation compaction
│   └── session-end.json        # Runs when session ends
├── AUTOMATION_GUIDE.md         # User guide for automation system
├── CLAUDE.md                   # Session startup protocol
├── DOC_AUTOMATION_SYSTEM.md    # Automation system architecture
├── README.md                   # This file
└── settings.local.json         # Local Claude Code settings
```

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

### Automation System

**DOC_AUTOMATION_SYSTEM.md**
- **Purpose**: Architecture documentation for automation triggers
- **Read by**: Developers and Claude when designing agents
- **Contains**:
  - 6 trigger types (Task Complete, Phase Complete, etc.)
  - Primary Source Matrix (prevents duplication)
  - Update conventions
  - Theoretical design (implemented in agents/)

**AUTOMATION_GUIDE.md**
- **Purpose**: End-user guide for documentation automation
- **Read by**: You (the project owner)
- **Contains**:
  - How the system works
  - Daily usage workflows
  - Configuration options
  - Troubleshooting guide
  - FAQ

---

### Agents (Autonomous AI Assistants)

**agents/task-tracker.md**
- **Purpose**: Detects and processes task completions
- **Triggers**:
  - Conversation keywords ("completed task X")
  - Edit tool checkbox changes (`[ ] → [x]`)
- **Actions**:
  1. Confirms with user
  2. Marks checkbox in TASKS.md
  3. Updates progress counter
  4. Calculates badge color
  5. Syncs to README.md
  6. Commits with conventional message
- **Features**:
  - Batch mode (<10min apart)
  - Immediate mode (>10min apart)
  - Phase completion detection
  - Error recovery with description search

**agents/session-end.md**
- **Purpose**: Verifies documentation consistency at session end
- **Triggers**: SessionEnd hook
- **Checks**:
  1. Uncommitted changes
  2. NEXT SESSION marker accuracy
  3. YOU ARE HERE position in roadmap
  4. Progress counter sync (TASKS.md vs README.md)
  5. Checkbox count vs reported progress
- **Actions**:
  - Generates session-end report
  - Suggests fixes for detected issues
  - Cannot block session termination (cleanup only)

---

### Hooks (Lifecycle Event Triggers)

**hooks/pre-compact.json**
- **Event**: PreCompact (before conversation compaction)
- **Timing**: Auto at ~95% context capacity OR manual `/compact`
- **Action**: Triggers task-tracker agent to flush pending updates
- **Purpose**: Batch commit rapid task completions before context loss

**hooks/session-end.json**
- **Event**: SessionEnd (when session terminates)
- **Timing**: User closes session or types `/end`
- **Action**: Triggers session-end agent for consistency checks
- **Purpose**: Ensure clean documentation state for next session

---

## 🔄 How It All Works Together

### Normal Workflow

```
1. User completes task
2. task-tracker.md detects completion
3. Confirms with user
4. Updates TASKS.md + README.md (atomic)
5. Commits with conventional message
```

### Batch Workflow (Rapid Tasks)

```
1. User completes task 1 → Queued
2. User completes task 2 → Queued
3. User completes task 3 → Queued
4. PreCompact hook fires
5. task-tracker.md flushes queue
6. All updates in single commit
```

### Session End Workflow

```
1. User ends session (/end or closes)
2. SessionEnd hook fires
3. session-end.md runs 5 checks
4. Reports issues + suggests fixes
5. Session ends (cannot be blocked)
```

---

## 🎯 Key Principles

### 1. Separation of Concerns

| File | Responsibility |
|------|----------------|
| CLAUDE.md | Human-readable startup guide |
| DOC_AUTOMATION_SYSTEM.md | Theoretical architecture |
| agents/*.md | Actual implementation logic |
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

The system is ready to use immediately. Just:

1. Read [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md)
2. Start working on tasks
3. Tell Claude when you complete tasks
4. Confirm documentation updates

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

1. **AUTOMATION_GUIDE.md** ← START HERE (user guide)
2. **README.md** ← This file (directory structure)
3. **DOC_AUTOMATION_SYSTEM.md** (theoretical architecture)
4. **agents/task-tracker.md** (implementation details)
5. **agents/session-end.md** (implementation details)
6. **CLAUDE.md** (daily startup protocol)

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
| Agents | 2 (task-tracker, session-end) |
| Hooks | 2 (pre-compact, session-end) |
| Triggers | 6 types (see DOC_AUTOMATION_SYSTEM.md) |
| Checks | 5 (session-end verification) |
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

1. ✅ **Be explicit** with task IDs in conversation
2. ✅ **Review session-end reports** before closing
3. ✅ **Let batch mode work** (don't manual commit rapid tasks)
4. ✅ **Trust atomic updates** (consistency guaranteed)
5. ✅ **Read AUTOMATION_GUIDE.md** for complete workflows

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

**Questions?** Read [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md) for detailed usage instructions.

**Issues?** Check Troubleshooting section above or consult agent .md files.

**Version:** 1.0 | **Last Updated:** January 2025
