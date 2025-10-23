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

        # Output message for Claude (stdout is added to context)
        print("═" * 60)
        print("🔍 SMART TASK DETECTION TRIGGERED")
        print("═" * 60)
        print("")
        print("📋 CRITICAL INSTRUCTIONS (EXECUTE EXACTLY):")
        print("")
        print("1. READ .claude/.actions.json (recent actions log)")
        print("2. READ docs/TASKS.md (incomplete tasks only)")
        print("3. READ .claude/lib/smart-detector.md (detection algorithm)")
        print("4. APPLY algorithm EXACTLY as specified (70% threshold)")
        print("5. REPORT matches >70% to user with confidence scores")
        print("6. ASK 'Update TASKS.md? [YES/NO]'")
        print("7. IF YES → READ .claude/agents/task-tracker.md IMMEDIATELY")
        print("8. EXECUTE 4-step update WITHOUT DEVIATION:")
        print("   - Mark checkbox")
        print("   - Update counter")
        print("   - Update NEXT SESSION")
        print("   - Sync README")
        print("")
        print("⚠️  DO NOT SKIP STEPS. FOLLOW EXACTLY.")
        print("")
        print("If NO matches found, report 'No completed tasks detected.'")
        print("")
        print("⚠️  MANDATORY: ANNOUNCE TO USER IMMEDIATELY:")
        print("   '🔍 PreCompact hook triggered - executing smart detection now...'")
        print("")
        print("═" * 60)

        # Exit successfully
        sys.exit(0)

    except json.JSONDecodeError:
        sys.exit(0)
    except Exception:
        sys.exit(0)

if __name__ == '__main__':
    main()
