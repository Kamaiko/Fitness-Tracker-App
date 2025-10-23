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
        print("=" * 80)
        print("SESSION-START HOOK OUTPUT")
        print("=" * 80)
        print("")
        print("CRITICAL INSTRUCTION: You MUST output EXACTLY this template.")
        print("Replace ALL [placeholders] with actual values. DO NOT deviate from this format.")
        print("")
        print("--- BEGIN REQUIRED OUTPUT ---")
        print("")
        print("🚀 SESSION START")
        print("")
        print("📊 Context Status")
        print("- Token usage: [X,XXX] / 200,000 tokens ([XX]%)")
        print("- Status: [FRESH|MODERATE|HIGH|CRITICAL]")
        print("- Recommendation: [Continue|Suggest compact soon|Compact NOW]")
        print("")
        print("📋 Project Status")
        print("- [X]/96 tasks completed ([XX]%)")
        print("- Phase: [X.X - Name]")
        print("")
        print("⭐ Next Task")
        print("- Task [X.X.X]: [description]")
        print("- File(s): [files to create/modify]")
        print("- Prerequisites: [prereqs or 'None']")
        print("")
        print("💡 Quick Actions")
        print("- /task-update for manual task detection")
        print("")
        print("--- END REQUIRED OUTPUT ---")
        print("")
        print("INSTRUCTIONS:")
        print("1. READ docs/TASKS.md to find '⭐ NEXT SESSION' task and count completed tasks")
        print("2. CALCULATE token usage from your context window")
        print("3. OUTPUT the template above with [placeholders] replaced")
        print("4. DO NOT add any other sections, explanations, or content")
        print("")
        print("=" * 80)

        # Exit successfully
        sys.exit(0)

    except json.JSONDecodeError:
        sys.exit(0)
    except Exception:
        sys.exit(0)

if __name__ == '__main__':
    main()
