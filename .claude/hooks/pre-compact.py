#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///

"""
Pre-Compact Hook
Triggers before context compaction to analyze recent actions and detect completed tasks.
Runs smart-detector algorithm to match actions against TASKS.md incomplete tasks.
"""

import json
import sys

def main():
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)

        # Output message for Claude (stderr is visible in Claude Code)
        print("═" * 60, file=sys.stderr)
        print("🔍 SMART TASK DETECTION TRIGGERED", file=sys.stderr)
        print("═" * 60, file=sys.stderr)
        print("", file=sys.stderr)
        print("📋 CRITICAL INSTRUCTIONS (EXECUTE EXACTLY):", file=sys.stderr)
        print("", file=sys.stderr)
        print("1. READ .claude/.actions.json (recent actions log)", file=sys.stderr)
        print("2. READ docs/TASKS.md (incomplete tasks only)", file=sys.stderr)
        print("3. READ .claude/lib/smart-detector.md (detection algorithm)", file=sys.stderr)
        print("4. APPLY algorithm EXACTLY as specified (70% threshold)", file=sys.stderr)
        print("5. REPORT matches >70% to user with confidence scores", file=sys.stderr)
        print("6. ASK 'Update TASKS.md? [YES/NO]'", file=sys.stderr)
        print("7. IF YES → READ .claude/agents/task-tracker.md IMMEDIATELY", file=sys.stderr)
        print("8. EXECUTE 4-step update WITHOUT DEVIATION:", file=sys.stderr)
        print("   - Mark checkbox", file=sys.stderr)
        print("   - Update counter", file=sys.stderr)
        print("   - Update NEXT SESSION", file=sys.stderr)
        print("   - Sync README", file=sys.stderr)
        print("", file=sys.stderr)
        print("⚠️  DO NOT SKIP STEPS. FOLLOW EXACTLY.", file=sys.stderr)
        print("", file=sys.stderr)
        print("If NO matches found, report 'No completed tasks detected.'", file=sys.stderr)
        print("", file=sys.stderr)
        print("⚠️  MANDATORY: ANNOUNCE TO USER IMMEDIATELY:", file=sys.stderr)
        print("   '🔍 PreCompact hook triggered - executing smart detection now...'", file=sys.stderr)
        print("", file=sys.stderr)
        print("═" * 60, file=sys.stderr)

        # Exit successfully
        sys.exit(0)

    except json.JSONDecodeError:
        sys.exit(0)
    except Exception:
        sys.exit(0)

if __name__ == '__main__':
    main()
