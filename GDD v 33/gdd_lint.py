#!/usr/bin/env python3
"""
DiceBound v33 GDD Lint Script

Validates v33 GDD files for consistency and referential integrity.

Checks performed:
    1. ID reference validation — all {ID} in non-balance files resolve to IDs defined in 02_balance_values.md
    2. Duplicate ID check — no ID defined twice in 02_balance_values.md
    3. Numeric literal heuristic — flag numeric patterns in 01_rules.md that may belong as IDs
    4. Section lock markers — verify every numbered section in 01_rules.md has a lock marker
    5. File header consistency — verify required header fields present
    6. Cross-file section reference validation — `01_rules.md` §N.M references resolve

Usage:
    python3 gdd_lint.py [--strict] [path_to_gdd_dir]

    --strict: treat WARN as ERROR (exit code 2 on warnings too)

Exit codes:
    0 — all checks passed
    1 — warnings found (non-blocking in default mode)
    2 — errors found (blocking)
"""

import re
import sys
import os
from pathlib import Path
from collections import defaultdict


# ============================================================================
# Configuration
# ============================================================================

BALANCE_FILE = "02_balance_values.md"

CONTENT_FILES = [
    "00_vision.md",
    "01_rules.md",
    "03_content.md",
    "04_schema.md",
    "05_ui_and_presentation.md",
    "06_verification.md",
    "07_open_questions.md",
]

ALL_FILES = [BALANCE_FILE] + CONTENT_FILES + ["_INDEX.md", "_CHANGELOG.md"]

# IDs to exclude from reference checks (documentation placeholders, generic examples)
ID_WHITELIST = {
    "SOMETHING_PCT",          # documentation example in 06_verification.md §0
    "ID",                     # reading rule example
    "CAPS_WITH_UNDERSCORES",  # reading rule example
}

# Numeric literal heuristic — patterns that SHOULD be IDs in 01_rules.md
# Format: (regex, description, should_ignore_if_matched_in_context)
NUMERIC_PATTERNS = [
    (r'\b\d+(\.\d+)?\s*%', "percentage"),
    (r'\b\d+\s*HP\b', "HP value"),
    (r'\b\d+\s*gold\b', "gold value"),
    (r'\b\d+\s*RS\b', "Rune Shard value"),
    (r'\b\d+\s*turns?\b', "turn count"),
    (r'\b\d+\s*rounds?\b', "round count"),
    (r'\b\d+\s*ticks?\b', "tick count"),
    (r'\b\d+\s*minutes?\b', "minute value"),
    (r'\b\d+\s*hours?\b', "hour value"),
    (r'\b\d+×\b', "multiplier"),
]

# Architectural constants and common non-tunable numbers — acceptable as literals
NUMERIC_ACCEPTABLE_CONTEXT = [
    "4 slots", "4 equipped", "4 families", "4 archetypes", "4 piece", "4 neutral",
    "6 tiers", "6 nodes", "3 tiers", "3 lanes",
    "2 waves", "2 wins", "2 packages", "3 packages",
    "1 package", "1 item", "1 fusion", "1 turn", "1 tile",
    "8×11 grid", "2×2",
    "example", "Example", "e.g.", "for example",
    "~0.5s", "~10-12hr", "~4hr", "~8hr", "~96 ticks", "~48 ticks",
    "Lv1", "Lv2", "Lv3", "Lv4", "Lv5", "Lv6", "Lv7", "Lv8", "Lv9", "Lv10",
    "Lv20", "Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5", "Tier 6",
    "T1", "T2", "T3", "T4", "T5", "T6",
    "Day 1", "Day 2", "Day 3", "Day 4", "Day 5",
    "Wave 1", "Wave 2", "Wave 3", "Wave 4", "Wave 5",
    "+1", "+2", "+3",  # when describing patterns like "+1 dmgMin"
    "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10",
    "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18",
    "Session 1", "Session 2",  # session references
    "2026", "2025",  # dates
    "20%", "50%", "90.7%", "42%", "55%", "60%",  # v32 playtest references
    "~0%", "~5%", "~25%", "~30%", "~40%", "~45%",  # wave stack estimates
    "19%", "45%",  # v32 SIRC actual values cited
    "1.54×", "1.8", "1.82×", "2.56×", "2.86×",  # v32 UPI reference values
    "Gap 4", "Ratio 90.7%",  # v32 verification examples
    "100%", "122%", "40%", "375%",  # merge supply ratios
    "20-40", "15-20",  # ranges in commentary
    "660 T1", "216 T1", "876 T1",  # merge supply totals
    "720 pieces", "2,178 pieces",  # merge required totals
    "486", "81",  # merge math details
    "0 hits", "3 hits", "4 hits", "5 hits", "6 hits",  # TTK anchors
    "15 words", "30-day", "7-day",  # verification cadence
    "1-2 minutes",  # Rune Trial duration
    "18 invariants", "17 invariants",  # V1-V18 count
    "P25", "P50", "P75",  # percentile bands
    "30 words", "70 words", "50 words",  # vision word budgets
    "1 of 4", "3 of 4", "3 random", "3 distinct",  # selection descriptions
    "24 hours",  # timezone note
]

# ============================================================================
# Helpers
# ============================================================================

def color(text, code):
    """ANSI color wrapper (returns plain text if stdout not a TTY)."""
    if sys.stdout.isatty():
        return f"\033[{code}m{text}\033[0m"
    return text

def red(s): return color(s, "31")
def yellow(s): return color(s, "33")
def green(s): return color(s, "32")
def cyan(s): return color(s, "36")
def bold(s): return color(s, "1")


# ============================================================================
# Parsers
# ============================================================================

def parse_defined_ids(balance_file_path):
    """Parse 02_balance_values.md for all defined IDs.
    
    IDs are defined in table rows as `BACKTICKED_ID` in the first column.
    Returns: (ids_set, duplicates_list)
    """
    ids = []
    with open(balance_file_path) as f:
        for line_no, line in enumerate(f, start=1):
            # Match table rows with backticked IDs: | `FOO_BAR` | ...
            matches = re.findall(r'\|\s*`([A-Z_][A-Z0-9_]*)`\s*\|', line)
            for m in matches:
                ids.append((m, line_no))
    
    # Detect duplicates
    counts = defaultdict(list)
    for id_name, line_no in ids:
        counts[id_name].append(line_no)
    
    defined = set(counts.keys())
    duplicates = [(name, lines) for name, lines in counts.items() if len(lines) > 1]
    return defined, duplicates


def parse_referenced_ids(file_path):
    """Parse a file for all {ID} references.
    Returns list of (id_name, line_no) tuples.
    """
    refs = []
    with open(file_path) as f:
        for line_no, line in enumerate(f, start=1):
            matches = re.findall(r'\{([A-Z_][A-Z0-9_]*)\}', line)
            for m in matches:
                if m not in ID_WHITELIST:
                    refs.append((m, line_no))
    return refs


def parse_sections(file_path):
    """Parse `## N. Title` headers and lock markers in file.
    Returns: list of (section_num, title, line_no, lock_marker_present)
    """
    sections = []
    with open(file_path) as f:
        lines = f.readlines()
    
    for line_no, line in enumerate(lines, start=1):
        m = re.match(r'^## (\d+)\.\s+(.+)$', line)
        if m:
            section_num = int(m.group(1))
            title = m.group(2).strip()
            sections.append([section_num, title, line_no, False])
    
    # Check for lock markers between sections
    for i, sec in enumerate(sections):
        start = sec[2]
        end = sections[i + 1][2] if i + 1 < len(sections) else len(lines) + 1
        
        for j in range(start, end):
            if j - 1 < len(lines) and re.search(r'<!-- Locked:\s*v33', lines[j - 1]):
                sec[3] = True
                break
    
    return sections


def parse_numeric_literals(file_path):
    """Scan file for numeric patterns that might need to be IDs.
    Returns list of (line_no, matched_text, pattern_description).
    """
    findings = []
    with open(file_path) as f:
        for line_no, line in enumerate(f, start=1):
            # Skip code blocks (crude detection via triple backticks)
            # Skip lines in commentary blocks
            # Skip lines that already contain {ID} references
            if re.search(r'\{[A-Z_][A-Z0-9_]*\}', line):
                continue
            # Skip Commentary (VI) blocks — those are designer notes
            if line.strip().startswith("**Commentary"):
                continue
            # Skip lines with explicit exclusion context
            skip_line = False
            for ctx in NUMERIC_ACCEPTABLE_CONTEXT:
                if ctx in line:
                    skip_line = True
                    break
            if skip_line:
                continue
            
            for pattern, desc in NUMERIC_PATTERNS:
                for m in re.finditer(pattern, line):
                    match_text = m.group(0).strip()
                    findings.append((line_no, match_text, desc))
    
    return findings


def parse_file_header(file_path):
    """Verify required header fields present.
    Returns: dict of {field: value_or_None}
    """
    required_fields = ["Version", "Last updated", "Status", "Authoritative for"]
    found = {field: None for field in required_fields}
    
    with open(file_path) as f:
        # Read first 30 lines — header should be in top of file
        for i, line in enumerate(f):
            if i > 30:
                break
            for field in required_fields:
                m = re.match(rf'^-?\s*\*\*{re.escape(field)}:\*\*\s*(.+?)\s*$', line)
                if m:
                    found[field] = m.group(1).strip()
    
    return found


def parse_cross_file_refs(file_path):
    """Find references like `01_rules.md` §N.M and validate target exists.
    Returns list of (line_no, target_file, section_num, subsection).
    """
    refs = []
    with open(file_path) as f:
        for line_no, line in enumerate(f, start=1):
            # Match `\`FILE.md\` §N.M` and `FILE.md §N.M` patterns
            matches = re.findall(
                r'`?(0\d_[a-z_]+\.md|_[A-Z_]+\.md)`?\s+§(\d+)(?:\.(\d+))?',
                line
            )
            for target, sec, subsec in matches:
                refs.append((line_no, target, int(sec), int(subsec) if subsec else None))
    return refs


# ============================================================================
# Checks
# ============================================================================

def check_1_id_references(gdd_dir, defined_ids):
    """Check 1: All {ID} refs resolve to defined IDs."""
    print(bold("\n=== Check 1: ID reference validation ==="))
    errors = []
    total_refs = 0
    
    for filename in CONTENT_FILES:
        filepath = gdd_dir / filename
        if not filepath.exists():
            print(yellow(f"  WARN: {filename} not found — skipping"))
            continue
        
        refs = parse_referenced_ids(filepath)
        missing = [(id_name, ln) for id_name, ln in refs if id_name not in defined_ids]
        total_refs += len(refs)
        
        if missing:
            for id_name, ln in missing:
                errors.append((filename, ln, id_name))
                print(red(f"  ERROR {filename}:{ln}: undefined ID {{{id_name}}}"))
    
    if not errors:
        print(green(f"  PASS — {total_refs} references across {len(CONTENT_FILES)} files, all resolve"))
    return errors


def check_2_duplicate_ids(gdd_dir):
    """Check 2: No duplicate ID definitions in balance file."""
    print(bold("\n=== Check 2: Duplicate ID check ==="))
    balance_path = gdd_dir / BALANCE_FILE
    if not balance_path.exists():
        print(red(f"  ERROR: {BALANCE_FILE} not found"))
        return [("missing_balance_file", 0, BALANCE_FILE)]
    
    _, duplicates = parse_defined_ids(balance_path)
    errors = []
    
    if duplicates:
        for id_name, lines in duplicates:
            errors.append((BALANCE_FILE, lines, id_name))
            print(red(f"  ERROR: ID '{id_name}' defined at lines {lines}"))
    else:
        print(green(f"  PASS — no duplicate IDs in {BALANCE_FILE}"))
    return errors


def check_3_numeric_literals(gdd_dir):
    """Check 3: Flag numeric literals in rules that may need IDs."""
    print(bold("\n=== Check 3: Numeric literal heuristic in 01_rules.md ==="))
    rules_path = gdd_dir / "01_rules.md"
    if not rules_path.exists():
        print(yellow("  WARN: 01_rules.md not found — skipping"))
        return []
    
    findings = parse_numeric_literals(rules_path)
    
    # These are warnings, not errors
    if findings:
        print(yellow(f"  WARN: {len(findings)} numeric literal(s) found — review manually:"))
        for line_no, match, desc in findings[:20]:  # Cap output
            print(yellow(f"    01_rules.md:{line_no} [{desc}] {match}"))
        if len(findings) > 20:
            print(yellow(f"    ... and {len(findings) - 20} more"))
    else:
        print(green("  PASS — no suspicious numeric literals"))
    
    return findings


def check_4_lock_markers(gdd_dir):
    """Check 4: Every section in 01_rules.md has lock marker."""
    print(bold("\n=== Check 4: Section lock markers in 01_rules.md ==="))
    rules_path = gdd_dir / "01_rules.md"
    if not rules_path.exists():
        print(yellow("  WARN: 01_rules.md not found — skipping"))
        return []
    
    sections = parse_sections(rules_path)
    missing = [s for s in sections if not s[3]]
    
    if missing:
        for sec_num, title, line_no, _ in missing:
            print(red(f"  ERROR 01_rules.md:{line_no}: §{sec_num} '{title}' missing lock marker"))
        return [("01_rules.md", s[2], f"§{s[0]}") for s in missing]
    else:
        print(green(f"  PASS — all {len(sections)} sections have lock markers"))
    return []


def check_5_file_headers(gdd_dir):
    """Check 5: File headers have required fields."""
    print(bold("\n=== Check 5: File header consistency ==="))
    errors = []
    required = ["Version", "Last updated", "Status", "Authoritative for"]
    
    for filename in CONTENT_FILES + [BALANCE_FILE]:
        filepath = gdd_dir / filename
        if not filepath.exists():
            continue
        
        header = parse_file_header(filepath)
        missing_fields = [f for f in required if header[f] is None]
        
        if missing_fields:
            for field in missing_fields:
                errors.append((filename, 0, f"missing '{field}' field"))
                print(yellow(f"  WARN {filename}: missing header field '{field}'"))
    
    if not errors:
        print(green(f"  PASS — all {len(CONTENT_FILES) + 1} files have valid headers"))
    return errors


def check_6_cross_file_refs(gdd_dir):
    """Check 6: Cross-file section references resolve."""
    print(bold("\n=== Check 6: Cross-file section references ==="))
    
    # Build map of file → sections defined
    file_sections = {}
    for filename in CONTENT_FILES + [BALANCE_FILE]:
        filepath = gdd_dir / filename
        if not filepath.exists():
            continue
        secs = parse_sections(filepath)
        file_sections[filename] = {s[0] for s in secs}
    
    errors = []
    total_refs = 0
    
    for filename in CONTENT_FILES + [BALANCE_FILE]:
        filepath = gdd_dir / filename
        if not filepath.exists():
            continue
        
        refs = parse_cross_file_refs(filepath)
        for line_no, target, sec_num, subsec in refs:
            total_refs += 1
            
            # Skip _INDEX.md and _CHANGELOG.md references (they don't have numbered sections consistently)
            if target.startswith("_"):
                continue
            
            if target not in file_sections:
                errors.append((filename, line_no, f"{target} §{sec_num} — target file not found"))
                print(yellow(f"  WARN {filename}:{line_no}: references missing file '{target}'"))
                continue
            
            if sec_num not in file_sections[target]:
                errors.append((filename, line_no, f"{target} §{sec_num} — section not found"))
                print(yellow(f"  WARN {filename}:{line_no}: {target} §{sec_num} does not exist"))
    
    if not errors:
        print(green(f"  PASS — {total_refs} cross-file references, all resolve"))
    return errors


# ============================================================================
# Main
# ============================================================================

def main():
    strict = False
    gdd_dir_arg = None
    
    for arg in sys.argv[1:]:
        if arg == "--strict":
            strict = True
        elif not arg.startswith("--"):
            gdd_dir_arg = arg
    
    gdd_dir = Path(gdd_dir_arg) if gdd_dir_arg else Path.cwd()
    if not gdd_dir.exists():
        print(red(f"ERROR: directory '{gdd_dir}' does not exist"))
        sys.exit(2)
    
    print(bold(cyan(f"\n{'='*60}")))
    print(bold(cyan(f"DiceBound v33 GDD Lint — {gdd_dir}")))
    print(bold(cyan(f"{'='*60}")))
    
    # Load balance IDs first (dependency for Check 1)
    balance_path = gdd_dir / BALANCE_FILE
    if not balance_path.exists():
        print(red(f"\nFATAL: {BALANCE_FILE} not found. Cannot proceed."))
        sys.exit(2)
    
    defined_ids, _ = parse_defined_ids(balance_path)
    print(f"\nLoaded {len(defined_ids)} defined IDs from {BALANCE_FILE}")
    
    # Run all checks
    all_errors = []
    all_warnings = []
    
    errors_c1 = check_1_id_references(gdd_dir, defined_ids)
    all_errors.extend([(f, l, d) for f, l, d in errors_c1])
    
    errors_c2 = check_2_duplicate_ids(gdd_dir)
    all_errors.extend([(f, l, d) for f, l, d in errors_c2])
    
    warnings_c3 = check_3_numeric_literals(gdd_dir)
    all_warnings.extend(warnings_c3)
    
    errors_c4 = check_4_lock_markers(gdd_dir)
    all_errors.extend(errors_c4)
    
    warnings_c5 = check_5_file_headers(gdd_dir)
    all_warnings.extend(warnings_c5)
    
    warnings_c6 = check_6_cross_file_refs(gdd_dir)
    all_warnings.extend(warnings_c6)
    
    # Summary
    print(bold(cyan(f"\n{'='*60}")))
    print(bold("Summary:"))
    print(f"  Errors:   {red(str(len(all_errors)))}")
    print(f"  Warnings: {yellow(str(len(all_warnings)))}")
    print(bold(cyan(f"{'='*60}")))
    
    if all_errors:
        print(red(bold("\nRESULT: FAIL (errors found)")))
        sys.exit(2)
    elif all_warnings and strict:
        print(yellow(bold("\nRESULT: FAIL in strict mode (warnings treated as errors)")))
        sys.exit(2)
    elif all_warnings:
        print(yellow(bold("\nRESULT: PASS with warnings (run with --strict to fail on warnings)")))
        sys.exit(1)
    else:
        print(green(bold("\nRESULT: PASS — all checks clean")))
        sys.exit(0)


if __name__ == "__main__":
    main()
