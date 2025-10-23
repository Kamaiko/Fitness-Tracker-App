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
        print("🚀 SESSION START", file=sys.stderr)
        print("", file=sys.stderr)
        print("Provide the user with a session briefing that includes:", file=sys.stderr)
        print("", file=sys.stderr)
        print("1. 📊 Context Status", file=sys.stderr)
        print("   - Token usage (X,XXX / 200,000 tokens, XX%)", file=sys.stderr)
        print("   - Status: FRESH (0-25%) | MODERATE (26-60%) | HIGH (61-85%) | CRITICAL (86%+)", file=sys.stderr)
        print("   - Recommendation: Continue | Suggest compact soon | Compact NOW", file=sys.stderr)
        print("", file=sys.stderr)
        print("2. 📋 Project Status", file=sys.stderr)
        print("   - Read docs/TASKS.md to get current phase and progress", file=sys.stderr)
        print("   - Show completed tasks / total tasks", file=sys.stderr)
        print("   - Current phase name", file=sys.stderr)
        print("", file=sys.stderr)
        print("3. ⭐ Next Task", file=sys.stderr)
        print("   - Find the task marked '⭐ NEXT SESSION' in TASKS.md", file=sys.stderr)
        print("   - Show: Task ID, description, file(s) to create/modify", file=sys.stderr)
        print("   - Include any prerequisites or context needed", file=sys.stderr)
        print("", file=sys.stderr)
        print("4. 💡 Quick Actions", file=sys.stderr)
        print("   - Mention /task-update for manual task detection", file=sys.stderr)
        print("", file=sys.stderr)
        print("Keep it concise, conversational, and easy to scan.", file=sys.stderr)
        print("Use emojis, formatting, or structure that feels natural.", file=sys.stderr)

        # Exit successfully
        sys.exit(0)

    except json.JSONDecodeError:
        sys.exit(0)
    except Exception:
        sys.exit(0)

if __name__ == '__main__':
    main()
