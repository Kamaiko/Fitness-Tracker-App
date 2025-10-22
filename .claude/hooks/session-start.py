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
        print("═" * 60, file=sys.stderr)

        # Exit successfully
        sys.exit(0)

    except json.JSONDecodeError:
        sys.exit(0)
    except Exception:
        sys.exit(0)

if __name__ == '__main__':
    main()
