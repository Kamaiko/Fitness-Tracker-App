#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///

"""
Post-Tool-Use Hook
Logs every tool Claude uses (Edit, Write, Bash, etc.) to .actions.json
This data feeds the smart-detector for task completion detection.

Format: {"tool": "Edit", "target": "file.ts", "time": 1736789123}
See: .claude/lib/smart-detector.md for format specification
"""

import json
import sys
import time
from pathlib import Path

def extract_action_summary(input_data: dict) -> dict:
    """Extract ONLY essential info for smart-detector (96% size reduction).

    Returns format matching smart-detector.md specification:
    {"tool": "ToolName", "target": "file/command/query", "time": timestamp}
    """
    tool_name = input_data.get('tool_name', 'Unknown')

    # Determine target based on tool type
    target = "N/A"
    if 'tool_input' in input_data:
        tool_input = input_data['tool_input']

        # Priority order for extracting meaningful target
        if 'file_path' in tool_input:  # Edit, Write, Read, NotebookEdit
            target = tool_input['file_path']
        elif 'command' in tool_input:  # Bash
            # Truncate long commands to first 100 chars
            cmd = tool_input['command']
            target = cmd if len(cmd) <= 100 else cmd[:97] + "..."
        elif 'query' in tool_input:  # WebSearch
            target = tool_input['query']
        elif 'url' in tool_input:  # WebFetch
            target = tool_input['url']
        elif 'pattern' in tool_input:  # Grep/Glob
            path = tool_input.get('path', '')
            target = f"{tool_input['pattern']} in {path}" if path else tool_input['pattern']
        elif 'todos' in tool_input:  # TodoWrite
            num_todos = len(tool_input['todos'])
            target = f"todo-update ({num_todos} items)"
        elif 'prompt' in tool_input:  # Task (agent)
            # Extract first 50 chars of prompt
            prompt = tool_input['prompt']
            target = prompt if len(prompt) <= 50 else prompt[:47] + "..."

    return {
        "tool": tool_name,
        "target": target,
        "time": int(time.time())
    }

def main():
    try:
        # Read JSON input from stdin (Claude Code passes full tool context)
        input_data = json.load(sys.stdin)

        # Ensure .claude directory exists
        claude_dir = Path('.claude')
        claude_dir.mkdir(exist_ok=True)

        # Extract ONLY essential fields (matches smart-detector.md format)
        action_summary = extract_action_summary(input_data)

        # Append action to log file (one compact JSON object per line)
        log_file = claude_dir / '.actions.json'
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(action_summary, ensure_ascii=False) + '\n')

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
