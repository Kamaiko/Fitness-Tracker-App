#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///

"""
Post-Tool-Use Hook
Logs every tool Claude uses (Edit, Write, Bash, etc.) to .actions.json
This data feeds the smart-detector for task completion detection.
"""

import json
import sys
from pathlib import Path

def main():
    try:
        # Read JSON input from stdin (Claude passes tool data automatically)
        input_data = json.load(sys.stdin)

        # Ensure .claude directory exists
        claude_dir = Path('.claude')
        claude_dir.mkdir(exist_ok=True)

        # Append action to log file (one JSON object per line)
        log_file = claude_dir / '.actions.json'
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(input_data) + '\n')

        # Exit successfully (don't block tool execution)
        sys.exit(0)

    except json.JSONDecodeError:
        # Handle malformed JSON gracefully
        sys.exit(0)
    except Exception:
        # Exit cleanly on any error (don't block Claude)
        sys.exit(0)

if __name__ == '__main__':
    main()
