# DiceBound v33 — Handoff to [RECIPIENT NAME]

**From:** [YOUR NAME]  
**To:** [RECIPIENT NAME]  
**Date:** [DATE]  
**Subject:** DiceBound project transfer — v33 GDD canonical state

---

## What you're receiving

DiceBound is a tactical turn-based grid mobile game in design/prototype stage. The GDD is at version 33 (v33), migrated 2026-04-21 across 23 structured sessions from the v31/v32 monolith.

### 15 files in this handoff package

**Upload these 13 to Claude Project Knowledge:**

| File | Role |
|---|---|
| `_INDEX.md` | META — always read first, contains Task Map |
| `_CHANGELOG.md` | Append-only history (reference only) |
| `00_vision.md` | Product vision + 5 pillars |
| `01_rules.md` | 31 rule sections (authoritative runtime rules) |
| `02_balance_values.md` | 398+ numeric IDs (authoritative numbers) |
| `03_content.md` | Entity specs + level manifests |
| `04_schema.md` | Runtime + save + event schemas |
| `05_ui_and_presentation.md` | UI pointer file + scope registry |
| `06_verification.md` | V1-V18 invariant methodology |
| `07_open_questions.md` | 3 unresolved questions |
| `gdd_lint.py` | Python validator — run before commits |
| `gdd_lint_README.md` | Lint usage guide |
| `gdd_llm_validation_suite.md` | 20-question accuracy test |

**Do NOT upload these 2 (use outside Project Knowledge):**

| File | Use |
|---|---|
| `project_instructions_v33.md` | Paste contents into Claude Project → Custom Instructions field |
| `_migration_summary_v33.md` | Read once to understand migration history |

### What makes v33 different from earlier versions

The v31 GDD was a 275 KB monolith. v32 split it into 2 parts but kept monolith style. v33 reorganizes into **concern-based separate files** with strict single-source-of-truth rules:

- Numbers → `02_balance_values.md` only (referenced via `{ID}` syntax)
- Rules → `01_rules.md` only
- Entity specs → `03_content.md` only
- Data contracts → `04_schema.md` only

This structure is LLM-friendly: you only paste the files relevant to your current task (per Task Map in `_INDEX.md` §3), not the entire GDD.

---

## Core concept — `{ID}` reference syntax

Rules and other files never hardcode numbers. They reference IDs defined in `02_balance_values.md`.

**Example:**

In `01_rules.md`:
> "Player baseline HP is `{PLAYER_HP_BASELINE}`."

In `02_balance_values.md`:
> `| PLAYER_HP_BASELINE | 200 | HP | v33 | ... |`

When you change the number, you only edit `02_balance_values.md`. All files using `{PLAYER_HP_BASELINE}` automatically stay in sync because they reference, not copy.

`gdd_lint.py` validates all references resolve.

---

## Getting started — Day 1 setup

### Step 1: Create Claude Project

1. Open Claude (web or desktop)
2. Create new Project → name it "DiceBound" (or your preferred name)
3. Click Project Knowledge → upload the 13 files from this handoff

### Step 2: Paste Custom Instructions

1. Open `project_instructions_v33.md`
2. Copy the content inside the code block (starts with "You are helping design and implement DiceBound...")
3. In Claude Project settings → Custom Instructions field → paste
4. Save

### Step 3: Verify setup works

In a new conversation in this project, ask:
> "What's the gold band for a Worm enemy?"

**Expected answer:** Claude says `GOLD_BAND_HIGH` = 13 gold, possibly referencing `02_balance_values.md`.

**If Claude says "4 gold":** Old v31 files are polluting context. Check Project Knowledge — remove any `dicebound_gdd_v31.md` or similar.

### Step 4: Run lint locally (optional but recommended)

```bash
# Put all 13 GDD files + gdd_lint.py in one folder, then:
python3 gdd_lint.py --strict
```

Expected: 0 errors, 0 warnings. If errors → something broke during handoff, contact previous owner.

### Step 5: Read the migration summary

Spend 20-30 minutes reading `_migration_summary_v33.md`. It explains:
- What was migrated from v31/v32
- Key decisions preserved
- 1 major feature correction (power-up removal) so you don't accidentally re-add it
- 3 remaining open questions
- Metrics

---

## Daily workflow — how to work with v33

### When you want Claude to answer a question

1. Start new conversation in DiceBound project (Claude auto-reads Custom Instructions + Project Knowledge)
2. Ask your question
3. Claude will state which files it's consulting per Task Map
4. Verify answer makes sense against the files

No manual file pasting needed for simple queries. Custom Instructions tell Claude which files to prioritize.

### When you want to change a rule

1. Identify which file(s) the change touches (ask Claude: "I want to change X, which files?")
2. Edit the relevant files directly (via text editor or IDE)
3. Run `python3 gdd_lint.py --strict` to verify consistency
4. Append a short entry to `_CHANGELOG.md` describing what changed
5. Update the lock marker in the edited section (change `Last changed: v33` to reflect the new version or keep v33 with updated CL reference)
6. Re-upload changed files to Project Knowledge (replace old versions)

### When you want to change a number

1. Edit ONLY `02_balance_values.md` — find the ID row, change the value
2. Run `gdd_lint.py --strict` — should pass (referencing files don't need editing)
3. If the change affects invariants (V1-V18), consult `06_verification.md` for which checks to re-run
4. Append changelog entry
5. Re-upload `02_balance_values.md`

### When you discover an ambiguity or bug

1. Check `07_open_questions.md` — is this a known issue?
2. If new: add to `07_open_questions.md` with interim answer, deferred status, or "needs decision"
3. If something in files is outright wrong: fix it, lint, changelog, re-upload

### When you want to propose a new feature

1. Read `00_vision.md` §4 — 5 pillars with feature filters
2. Ask Claude: "Does [feature X] align with the 5 pillars?"
3. If pillar-aligned, draft spec, identify which files need updating
4. If pillar-conflicting, reject or redesign
5. Never bypass the filter even for "small" features

---

## Prompt templates — common tasks

### Template 1: Balance lookup

> "What's the value of `[ID_NAME]`?"

Example:
> "What's the value of `PLAYER_HP_BASELINE`?"

### Template 2: Rule query

> "How does [mechanic X] work in v33? Reference the specific rule section."

Example:
> "How does mid-path combat resolution work in v33? Reference the specific rule section."

### Template 3: Cross-system reasoning

> "I want to change [X]. Which files need to update? Which invariants (V1-V18) might be affected? What verification should I run?"

Example:
> "I want to reduce enemy HP scaling from +10 to +8 per level. Which files need to update? Which invariants might be affected? What verification should I run?"

### Template 4: Content authoring

> "Draft a new [content type] consistent with v33 design. Files to reference: [list]."

Example:
> "Draft a new bag item (combat category) consistent with v33 design. Files to reference: `03_content.md` §4, `02_balance_values.md` §20, `01_rules.md` §18, §26."

### Template 5: Feature filter

> "Does this feature align with the 5 pillars? [describe feature]"

Example:
> "Does this feature align with the 5 pillars? I want to add a 'skip to next enemy' button that auto-routes the player toward the nearest enemy."

### Template 6: Change impact analysis

> "If I change [X from Y to Z], walk me through the cascade impact across all v33 files."

Example:
> "If I change `BAG_ACTIVE_SLOTS` from 4 to 5, walk me through the cascade impact across all v33 files."

### Template 7: Validation

> "Run the LLM validation suite from `gdd_llm_validation_suite.md` questions [list]. Score each answer against the expected facts."

Or more targeted:
> "Answer Q11 from `gdd_llm_validation_suite.md`. Show your reasoning."

---

## How to look up what changed

### For recent changes

Open `_CHANGELOG.md`. Entries are chronological (newest at top of each session block). Search for keywords like "Session 16" or "balance" or specific section names.

### For a specific rule

Each rule section in `01_rules.md` ends with a lock marker comment:
```
<!-- Locked: v33 | Last changed: v33 | CL: — -->
```

The `CL:` field points to changelog entries when the rule was modified. Empty (`—`) means no changes since v33 migration.

### For a specific number

Each ID row in `02_balance_values.md` has a `Lock` column (v33, v33-patch, etc.) and often a `Note` column explaining context or flags.

### To trace a value through the system

1. Find ID in `02_balance_values.md`
2. Search for `{ID_NAME}` across all files: `grep -n "{ID_NAME}" *.md`
3. Every match tells you which rule/content/schema/verification references this value

---

## 3 open questions to be aware of

Per `07_open_questions.md`:

1. **RT-TZ (Rune Trial timezone)** — v33 interim: local device 7:00. May revise if playtest shows issues.
2. **FUS-SLOT (Fusion slot accounting)** — v33 interim: Model X (consume 2, place 1, net +1 free slot). May revise if playtest finds inventory inflation.
3. **LOOP-2 (Tree Loop 2+ scaling)** — Deferred. 6 principles locked for future authoring in `07_open_questions.md` §3.

None of these block Test Đợt 1 playtest.

---

## 1 known historical correction

**Session 16 patch:** v31 had a "between-level power-up selection" feature (Heal+1/+2, +dmgMin/+dmgMax after Win). This was removed during v32 design iteration. Initial migration accidentally preserved it; Session 16 patch removed it.

**§28 in `01_rules.md` is an intentional placeholder** — the section number is kept for stable numbering, content explains the feature doesn't exist in v33.

**Do NOT re-add the power-up feature** unless explicitly redesigning the Win flow. v33 Win flow: `WinText → Result table → banking → Home`. No popup.

---

## Tooling reference

### `gdd_lint.py` — consistency validator

Runs 6 checks:
1. All `{ID}` references resolve to defined IDs
2. No duplicate ID definitions
3. Numeric literal heuristic (flag potential missing IDs)
4. Every rule section has lock marker
5. File headers have required fields
6. Cross-file section references resolve

Run: `python3 gdd_lint.py --strict`

Current state: 0 errors, 0 warnings.

### `gdd_llm_validation_suite.md` — LLM accuracy test

20 questions across 7 categories. Target: ≥90% accuracy (18+ correct).

Use when:
- Validating initial setup (confirm LLM reads v33 files correctly)
- After major GDD changes (confirm files still teach correctly)
- Quarterly health check

### Integration options (for future)

Pre-commit Git hook example in `gdd_lint_README.md`. CI integration with GitHub Actions example included.

---

## What is NOT in v33 scope

Per `05_ui_and_presentation.md` §2, these are handled outside GDD (art pipeline, Figma, Unity project, etc.):

- Visual design tokens (colors, fonts, spacing)
- Animation timing specifications
- Art direction (mood, theme)
- Localization
- Accessibility modes
- Asset management
- Platform-specific UI
- Narrative / worldbuilding
- Tutorial UX flow
- Social features

The 05 file is a REGISTRY of what's not in GDD so scope creep doesn't sneak these in during rule authoring.

---

## Questions to ask me before I leave

Suggested questions to close any handoff ambiguity:

1. [Any v33 rule that feels unclear in the files?]
2. [What playtest data do I have access to, if any?]
3. [What's the current Cursor prototype state, if any?]
4. [Any pending user decisions that didn't make it into 07_open_questions.md?]
5. [Who wrote the art / do we have art direction references?]
6. [What's the current Unity port timeline, if planned?]

---

## Contacts

- **Previous owner (me):** [YOUR CONTACT]
- **Project repository:** [GIT URL or N/A]
- **Playtest participants (if any):** [CONTACT]
- **Art contractor (if any):** [CONTACT]

---

## Final notes

v33 migration took 23 structured sessions. The structure is robust but not immutable. If you find a better organization, the migration workflow (concern-based reorg + `{ID}` references + lint validation) can be applied to v34.

Good luck with DiceBound.

— [YOUR NAME]
