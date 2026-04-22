# DiceBound v33 GDD Lint — Usage

Quick reference for `gdd_lint.py`.

## Requirements

- Python 3.8+
- No external dependencies (stdlib only)

## Basic usage

```bash
# Run in current directory (assumes v33 GDD files are here)
python3 gdd_lint.py

# Run pointing at specific directory
python3 gdd_lint.py /path/to/v33/gdd/

# Strict mode — treat warnings as errors
python3 gdd_lint.py --strict
```

## Exit codes

- `0` — all checks passed, no errors or warnings
- `1` — warnings found (non-blocking by default)
- `2` — errors found (blocking) OR warnings with `--strict`

## What it checks

1. **ID reference validation** — every `{ID}` in non-balance files resolves to a defined ID in `02_balance_values.md`
2. **Duplicate ID check** — no ID is defined twice in `02_balance_values.md`
3. **Numeric literal heuristic** — flag numeric patterns in `01_rules.md` that may need to be balance IDs (warnings, reviewable)
4. **Section lock markers** — every `## N.` section in `01_rules.md` has a lock marker comment
5. **File header consistency** — all files have required header fields (Version, Last updated, Status, Authoritative for)
6. **Cross-file section references** — `filename.md §N.M` references resolve to existing sections

## Integration suggestions

### Pre-commit hook (Git)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
cd "$(git rev-parse --show-toplevel)/path/to/gdd"
python3 gdd_lint.py --strict
```

Make executable: `chmod +x .git/hooks/pre-commit`.

### Cursor / AI Dev workflow

Run lint after any GDD edit before pasting into Cursor prompt — ensures the files Cursor sees don't have drift.

### CI pipeline

```yaml
# GitHub Actions example
- name: Lint GDD files
  run: python3 gdd_lint.py --strict ./gdd/
```

## Customization

Edit `gdd_lint.py` constants at top of file:

- `ID_WHITELIST` — IDs to exclude from reference check (doc placeholders)
- `NUMERIC_PATTERNS` — numeric patterns to flag in rules
- `NUMERIC_ACCEPTABLE_CONTEXT` — substrings that mark "this number is OK as a literal" (add new architectural constants here)

## Current v33 state (2026-04-21)

All 6 checks PASS:
- 398 defined IDs loaded
- 282 references across 7 content files, all resolve
- 0 duplicate IDs
- 31 sections with lock markers
- 8 files with valid headers
- 72 cross-file section references resolve

## When to re-run

- Before committing any GDD change
- After Cursor/LLM writes new content
- Before major playtest (confirm files consistent)
- Before archiving v33 → v34 migration

## Not covered (manual review still needed)

- Semantic correctness of rules (does the rule say what you intended?)
- Value plausibility (is `PLAYER_HP_BASELINE = 200` appropriate?)
- Cross-system design coherence (do invariants actually protect what they claim?)
- Content balance (do Lv1-Lv8 manifests hit their win-rate targets?)

For these, run LLM validation test suite (Session 22) or manual playtest.
