#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///

"""
Session-Start Hook
Executes when session starts/resumes to load project context and identify next task.
Warns if context usage is high to prevent mid-task interruption.
"""

import json
import sys

def main():
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)

        # Output startup message for Claude
        print("═" * 60, file=sys.stderr)
        print("🚀 SESSION START", file=sys.stderr)
        print("═" * 60, file=sys.stderr)
        print("", file=sys.stderr)
        print("📋 CONTEXT LOADING:", file=sys.stderr)
        print("1. Reading docs/TASKS.md → section '⭐ NEXT SESSION'", file=sys.stderr)
        print("2. Identifying next incomplete task", file=sys.stderr)
        print("3. Checking context usage", file=sys.stderr)
        print("", file=sys.stderr)
        print("⚠️  IMPORTANT:", file=sys.stderr)
        print("   If context >60-70%, suggest MANUAL COMPACT NOW", file=sys.stderr)
        print("   to avoid auto-compact mid-implementation.", file=sys.stderr)
        print("", file=sys.stderr)
        print("🎯 Ready to work on next task!", file=sys.stderr)
        print("", file=sys.stderr)
        print("⚠️  MANDATORY: RESPOND WITH EXACT FORMAT BELOW:", file=sys.stderr)
        print("", file=sys.stderr)
        print("═══════════════════════════════════════════════", file=sys.stderr)
        print("🚀 SESSION START REPORT", file=sys.stderr)
        print("═══════════════════════════════════════════════", file=sys.stderr)
        print("", file=sys.stderr)
        print("📊 **Context Status**", file=sys.stderr)
        print("   - Tokens Used: [X,XXX / 200,000] (XX%)", file=sys.stderr)
        print("   - Status: [FRESH | MODERATE | HIGH | CRITICAL]", file=sys.stderr)
        print("   - Recommendation: [Continue | Compact soon | Compact NOW]", file=sys.stderr)
        print("", file=sys.stderr)
        print("📋 **Current Progress** (from docs/TASKS.md)", file=sys.stderr)
        print("   - Completed: [XX/96 tasks]", file=sys.stderr)
        print("   - Current Phase: [Phase X.X - Name]", file=sys.stderr)
        print("   - Phase Progress: [XX% complete]", file=sys.stderr)
        print("", file=sys.stderr)
        print("⭐ **Next Task** (marked ⭐ NEXT SESSION in TASKS.md)", file=sys.stderr)
        print("   - ID: [X.X.X]", file=sys.stderr)
        print("   - Description: [Full task description]", file=sys.stderr)
        print("   - Prerequisites: [Any dependencies or context needed]", file=sys.stderr)
        print("", file=sys.stderr)
        print("🔧 **Quick Actions**", file=sys.stderr)
        print("   - `/task-update` - Manually detect completed tasks", file=sys.stderr)
        print("   - `/compact` - Compact conversation if needed", file=sys.stderr)
        print("", file=sys.stderr)
        print("═══════════════════════════════════════════════", file=sys.stderr)
        print("", file=sys.stderr)
        print("⚠️  USE EXACT FORMAT ABOVE. NO DEVIATION.", file=sys.stderr)
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
