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

        # Output startup message for Claude (stdout is added to context)
        print("🚀 SESSION START")
        print("")
        print("Provide the user with a session briefing that includes:")
        print("")
        print("1. 📊 Context Status")
        print("   - Token usage (X,XXX / 200,000 tokens, XX%)")
        print("   - Status: FRESH (0-25%) | MODERATE (26-60%) | HIGH (61-85%) | CRITICAL (86%+)")
        print("   - Recommendation: Continue | Suggest compact soon | Compact NOW")
        print("")
        print("2. 📋 Project Status")
        print("   - Read docs/TASKS.md to get current phase and progress")
        print("   - Show completed tasks / total tasks")
        print("   - Current phase name")
        print("")
        print("3. ⭐ Next Task")
        print("   - Find the task marked '⭐ NEXT SESSION' in TASKS.md")
        print("   - Show: Task ID, description, file(s) to create/modify")
        print("   - Include any prerequisites or context needed")
        print("")
        print("4. 💡 Quick Actions")
        print("   - Mention /task-update for manual task detection")
        print("")
        print("Keep it concise, conversational, and easy to scan.")
        print("Use emojis, formatting, or structure that feels natural.")

        # Exit successfully
        sys.exit(0)

    except json.JSONDecodeError:
        sys.exit(0)
    except Exception:
        sys.exit(0)

if __name__ == '__main__':
    main()
