#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///

"""
Session-End Hook
Verifies documentation consistency before session termination.
Checks: uncommitted changes, progress sync, format compliance.
"""

import json
import sys

def main():
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)

        # Output verification instructions for Claude
        print("═" * 60, file=sys.stderr)
        print("✅ SESSION END VERIFICATION", file=sys.stderr)
        print("═" * 60, file=sys.stderr)
        print("", file=sys.stderr)
        print("📋 RUNNING CHECKS:", file=sys.stderr)
        print("", file=sys.stderr)
        print("1️⃣  Uncommitted Changes:", file=sys.stderr)
        print("   - Run: git status --porcelain", file=sys.stderr)
        print("   - Suggest commit if files modified", file=sys.stderr)
        print("", file=sys.stderr)
        print("2️⃣  Progress Counter Sync:", file=sys.stderr)
        print("   - Count: grep -c '^- \\[x\\]' docs/TASKS.md", file=sys.stderr)
        print("   - Compare TASKS.md line 5 vs README.md", file=sys.stderr)
        print("   - Report mismatch if found", file=sys.stderr)
        print("", file=sys.stderr)
        print("3️⃣  Format Compliance:", file=sys.stderr)
        print("   - Check: grep -E '^###\\s+\\d+\\.\\d+' docs/TASKS.md", file=sys.stderr)
        print("   - Should return EMPTY (no header-based tasks)", file=sys.stderr)
        print("", file=sys.stderr)
        print("⏱️  Keep verification under 60 seconds.", file=sys.stderr)
        print("📝 See .claude/agents/session-end.md for details.", file=sys.stderr)
        print("═" * 60, file=sys.stderr)

        # Exit successfully (cannot block session end)
        sys.exit(0)

    except json.JSONDecodeError:
        sys.exit(0)
    except Exception:
        sys.exit(0)

if __name__ == '__main__':
    main()
