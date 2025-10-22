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
        print("📋 INSTRUCTIONS:", file=sys.stderr)
        print("1. Read .claude/.actions.json (recent tool usage)", file=sys.stderr)
        print("2. Read docs/TASKS.md (incomplete tasks with pattern: - [ ] ID **Desc**)", file=sys.stderr)
        print("3. Apply algorithm from .claude/lib/smart-detector.md", file=sys.stderr)
        print("4. Extract keywords from task descriptions", file=sys.stderr)
        print("5. Match against action targets/commands", file=sys.stderr)
        print("6. Calculate confidence scores", file=sys.stderr)
        print("7. Report ANY matches >70% confidence", file=sys.stderr)
        print("", file=sys.stderr)
        print("📊 FORMAT:", file=sys.stderr)
        print("   'Detected task X.X.X complete (XX% confidence)'", file=sys.stderr)
        print("   'Actions: Edit src/file.ts, Write migrations/001.sql'", file=sys.stderr)
        print("   'Update TASKS.md? [YES/NO]'", file=sys.stderr)
        print("", file=sys.stderr)
        print("⚠️  If NO matches found, simply report 'No completed tasks detected.'", file=sys.stderr)
        print("═" * 60, file=sys.stderr)

        # Exit successfully
        sys.exit(0)

    except json.JSONDecodeError:
        sys.exit(0)
    except Exception:
        sys.exit(0)

if __name__ == '__main__':
    main()
