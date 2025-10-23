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
import re
from pathlib import Path
from typing import List, Tuple

def validate_tasks_format(tasks_path: Path) -> List[Tuple[int, str, str]]:
    """Validate TASKS.md follows strict format (.claude/lib/tasks-format.md).

    Returns: List of (line_num, issue, rule_violated)
    """
    violations = []

    try:
        with open(tasks_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        for i, line in enumerate(lines, 1):
            # Rule 1: No header-style tasks (but allow subsections like 0.5.A)
            # Match only pure numeric IDs like ### 0.5bis.2 (NOT ### 0.5.A)
            if re.match(r'^###\s+\d+\.\w*\d+\s+\*\*', line):
                violations.append((
                    i,
                    "Task using header instead of checkbox",
                    "Must use: - [ ] ID **Title**"
                ))

            # Rule 2: No space after x in completed
            if re.match(r'^- \[x \]', line):
                violations.append((
                    i,
                    "Space after 'x' in checkbox",
                    "Correct: - [x] (no space)"
                ))

            # Rule 3: Task descriptions must be bold
            if re.match(r'^- \[ \] \d+\.\S+ [^*]', line):
                violations.append((
                    i,
                    "Task description not bold",
                    "Format: - [ ] ID **Description**"
                ))

    except FileNotFoundError:
        violations.append((0, "TASKS.md not found", "Check file exists at docs/TASKS.md"))
    except Exception as e:
        violations.append((0, f"Error reading TASKS.md: {str(e)}", ""))

    return violations

def main():
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)

        # Output verification instructions for Claude (stdout is added to context)
        print("═" * 60)
        print("✅ SESSION END VERIFICATION")
        print("═" * 60)
        print("")
        print("📋 RUNNING CHECKS:")
        print("")
        print("1️⃣  Uncommitted Changes:")
        print("   - Run: git status --porcelain")
        print("   - Suggest commit if files modified")
        print("")
        print("2️⃣  Progress Counter Sync:")
        print("   - Count: grep -c '^- \\[x\\]' docs/TASKS.md")
        print("   - Compare TASKS.md line 5 vs README.md")
        print("   - Report mismatch if found")
        print("")
        print("3️⃣  Format Compliance:")
        print("   - Check: grep -E '^###\\s+\\d+\\.\\d+' docs/TASKS.md")
        print("   - Should return EMPTY (no header-based tasks)")
        print("")

        # New: TASKS.md format validation
        print("4️⃣  TASKS.md Format Validation:")
        violations = validate_tasks_format(Path("docs/TASKS.md"))
        if violations:
            print("   ⚠️  VIOLATIONS DETECTED:")
            for line_num, issue, rule in violations:
                if line_num == 0:
                    print(f"   • {issue}")
                else:
                    print(f"   • Line {line_num}: {issue}")
                if rule:
                    print(f"     Rule: {rule}")
            print("   📖 See .claude/lib/tasks-format.md for complete format guide")
        else:
            print("   ✅ Format valid (all rules followed)")
        print("")

        print("⏱️  Keep verification under 60 seconds.")
        print("═" * 60)

        # Exit successfully (cannot block session end)
        sys.exit(0)

    except json.JSONDecodeError:
        sys.exit(0)
    except Exception:
        sys.exit(0)

if __name__ == '__main__':
    main()
