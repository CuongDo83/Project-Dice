# DiceBound v33 — Anti-Hallucination Rules

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 24 — post-migration addendum)
- **Audience:** DiceBound project owner + future recipients. NOT Claude-instructions (those live in `project_instructions_v33.md`).
- **Purpose:** Detect, prevent, and recover from LLM hallucination when working with v33 GDD.

---

## Why this file exists

LLMs confabulate. Claude, GPT, Gemini — all of them. They fill gaps with plausible-sounding text pulled from training data or pattern-matched from context. For a GDD that will directly drive implementation, one confabulated number or rule can cascade into wasted prototype time or worse.

This file is your **user-side safety protocol**. `project_instructions_v33.md` tells Claude how to behave; this file tells YOU how to verify Claude behaved correctly.

---

## Table of contents

1. Red flags — how to spot hallucination
2. Verification checklist — 3-step double-check
3. Common hallucination patterns specific to DiceBound
4. Recovery protocol — what to do when you catch one
5. Prompt patterns that reduce risk
6. Integration with tooling (lint + validation suite)
7. When to distrust Claude completely

---

## 1. Red flags — how to spot hallucination

When Claude answers a question about DiceBound, check for these signals. If you see ≥1, verify against files.

### Citation red flags

- **Value stated without ID:** "Player HP is 200." → Should be "Player HP is `PLAYER_HP_BASELINE` (200)." Missing ID = uncertain source.
- **Rule stated without §:** "Combat resolves crit before block." → Should cite "per `01_rules.md` §8.1" or similar.
- **File referenced without section:** "As defined in `01_rules.md`..." without section number.

### Language red flags

- "Generally speaking..."
- "Typically..."
- "In most cases..."
- "It's common for..."
- "You'd usually..."
- "Around 200 HP" (rounding — real values are exact)
- "Approximately..."
- "Something like..."

DiceBound v33 values are **locked and exact**. If Claude hedges, it's inferring, not reading.

### Structural red flags

- Answer cites `v31`, `v32`, or any archived file — should ONLY cite v33 files.
- Answer mentions "between-level power-up", "Heal +1/+2 selection" — these were REMOVED in v32. If Claude brings them up, it's pulling from training data.
- Answer mentions gold bands "Wind 1, Slime 2, Worm 4, Fire 4" — v31 values, deprecated. v33 = 3/8/13/13.
- Answer says "Gold Tech Tree has 8 nodes" — v31. v33 has 6 nodes × multi-loop.
- Answer mentions "power item" — v31 term. v33 uses "bag item" exclusively.

### Behavioral red flags

- Claude confidently answers a question with NO mention of checking files.
- Answer is suspiciously long and polished for a simple factual query (real lookups are terse).
- Claude volunteers information you didn't ask for (maybe generated, maybe valid — verify).
- Same question asked twice → different answers. Files don't change; Claude's reading should be deterministic for lookup questions.

---

## 2. Verification checklist — 3-step double-check

Run this checklist any time a Claude answer will drive implementation or a decision.

### Step 1: Source check

- [ ] Does Claude cite the specific file? (`01_rules.md`, `02_balance_values.md`, etc.)
- [ ] Does Claude cite the specific section? (`§N.M`)
- [ ] If the answer has a number, does it cite the `{ID}`?
- [ ] If you grep the file for the claimed content, does it appear?

Quick grep:
```bash
cd /path/to/v33/gdd/
grep -n "claimed phrase or ID" *.md
```

### Step 2: Consistency check

- [ ] Does the answer conflict with any other file's content? (cross-file inconsistency = something's wrong)
- [ ] Does the answer violate any V1-V18 invariant? (check `01_rules.md` §31)
- [ ] Does the answer violate any of the 5 pillars? (check `00_vision.md` §4)

### Step 3: Plausibility check

- [ ] Does the claimed value match the scale of other values?
- [ ] Is the rule consistent with DiceBound's design philosophy?
- [ ] If you ask Claude the same question in a fresh conversation, does it give the same answer?

### Pass threshold

- **All 3 steps pass** → trust the answer.
- **1 step fails** → ask Claude to re-verify with explicit file citation.
- **2+ steps fail** → treat answer as hallucinated, follow Recovery Protocol (§4).

---

## 3. Common hallucination patterns specific to DiceBound

These are the patterns I (previous owner / migration author) observed during 23 migration sessions. Future owners should expect these.

### Pattern A: Stale v31 info leak

**Symptom:** Claude uses values/features from v31 despite being told v33 is canonical.

**Triggers:**
- Question wording that matches v31 phrasing more than v33
- Old GDD files accidentally left in Project Knowledge
- Claude's training data contains v31 patterns

**Examples:**
- Q: "How much gold does a Worm enemy drop?"
  - WRONG: "4 gold" (v31)
  - RIGHT: "`GOLD_BAND_HIGH` = 13 gold" (v33)
  
- Q: "What happens after Win?"
  - WRONG: "Between-level power-up selection" (v31 feature, removed)
  - RIGHT: "Result table → banking → return to Home" (v33)

**Prevention:**
- Confirm v31/v32/framework files NOT in Project Knowledge (run Q20 from validation suite)
- Start prompts with "In v33..." to prime context
- Ask Claude to quote the specific v33 file source

### Pattern B: Value rounding / estimation

**Symptom:** Claude states "around X" or rounds to nearest "nice" number.

**Example:**
- Q: "What's `BAG_GUARD_CREST_LV3_PCT`?"
  - WRONG: "About 20%" or "20%"
  - RIGHT: The exact value from `02_balance_values.md` §20

**Prevention:**
- Force exact value: "State the exact value from `02_balance_values.md`, not an approximation."
- If Claude doesn't know, it should say "I don't see this value in the files — can you confirm the ID?"

### Pattern C: Rule invention

**Symptom:** Claude states a rule that sounds reasonable but doesn't exist in files.

**Example:**
- Q: "When does the bag reset?"
  - PARTLY WRONG: "Bag resets at the end of every wave." (not a rule — bag resets per RUN, not per wave)
  - RIGHT: "Bag resets on Win or Lose per `01_rules.md` §15.3."

**Prevention:**
- Ask for the exact section reference
- If Claude can't cite it, the rule doesn't exist

### Pattern D: Pillar / invariant confusion

**Symptom:** Claude mixes up pillars (e.g., confuses Pillar 2 "readable board" with Pillar 3 "never sits still") or invariants (V14 SIRC vs V18 Idle out-of-run).

**Example:**
- Q: "Why is SIRC threshold 50% not 30%?"
  - WRONG: "Because `OUT_OF_RUN_IDLE_CEILING_PCT` is 30% and SIRC caps at 50%." (conflates)
  - RIGHT: "V14 SIRC measures daily gold flow with framework-fixed 50% threshold (not stored as ID). V18 measures 30-day UPI accumulation with `OUT_OF_RUN_IDLE_CEILING_PCT` = 30%. Different concepts, both must pass."

**Prevention:**
- For any invariant question, ask: "Show me the exact wording from `01_rules.md` §31 or `06_verification.md` §5."

### Pattern E: Deferred-vs-locked confusion

**Symptom:** Claude answers about a deferred item as if it's locked.

**Example:**
- Q: "What are Loop 2 tree costs?"
  - WRONG: Claude invents values (Loop 1 × 1.5 or similar)
  - RIGHT: "Loop 2 is DEFERRED per `07_open_questions.md` LOOP-2. Only 6 principles are locked; exact values not yet authored."

**Prevention:**
- Check `07_open_questions.md` if the answer feels "new"
- Ask: "Is this locked, interim, or deferred?"

### Pattern F: "Creative" cascade

**Symptom:** When you ask Claude to propose a change, it suggests MORE changes than necessary (scope creep via creativity).

**Example:**
- Q: "I want to reduce Slime HP at Lv5."
  - OVERREACH: "I'll also adjust Wind and Worm proportionally, update the wave stacking formula, and revise level manifests for Lv5-8."
  - CORRECT: "This change affects `02_balance_values.md` §7. Cascade: may need V3 TTK re-check. Do you want me to propose additional changes or stop here?"

**Prevention:**
- Explicit scope: "Only change X. Identify cascade impact but do NOT propose additional changes unless I ask."

---

## 4. Recovery protocol — what to do when you catch hallucination

Follow this sequence. Don't panic, don't just re-prompt.

### Step 1: Stop and isolate

Don't accept the answer. Don't build on top of it. Save the hallucinated response in a note (even screenshot) for later diagnosis.

### Step 2: Identify pattern

Check against §3 patterns A-F. Which pattern is it?

### Step 3: Correct in conversation

Reply to Claude with:
> "That answer appears incorrect. The v33 canonical source says [correct info with file/section citation]. Please re-read [specific file] §[specific section] and provide the correct answer."

Force Claude to quote exact text from the file.

### Step 4: Check if files are the problem

If Claude's hallucination matches a plausible-but-wrong reading of the file, the file itself may be ambiguous.

- Re-read the relevant section. Is the wording crystal clear?
- If ambiguous → this is a FILE bug. Fix the file, changelog the fix, re-upload.
- If clear → LLM bug, not file bug. Continue.

### Step 5: Check Project Knowledge integrity

- Are archived v31/v32 files accidentally still in Project Knowledge? Remove them.
- Are all 13 canonical v33 files present and current version? Re-upload if in doubt.
- Is Custom Instructions still correct? Re-paste from `project_instructions_v33.md`.

### Step 6: Log the incident

If the hallucination happened on a structured task (design decision, balance change, content authoring), log it briefly:

```
Date: ___
Pattern: A/B/C/D/E/F
Question: ___
Hallucinated answer: ___
Correct answer: ___
Root cause: [file bug / stale context / LLM confabulation / other]
Prevention: [file fix / prompt update / re-setup / none]
```

Over time, patterns emerge. Use `_CHANGELOG.md` Appendix or a separate `HALLUCINATION_LOG.md` if you want.

### Step 7: Run validation suite

If you had a major hallucination, re-run `gdd_llm_validation_suite.md` to verify overall accuracy hasn't degraded.

---

## 5. Prompt patterns that reduce hallucination risk

Use these patterns when asking Claude GDD questions. They force verifiable responses.

### Pattern 1: Force exact citation

**Bad:** "What's the wave stacking rule?"

**Good:** "Quote the exact text of the wave stacking rule from `01_rules.md` §17. Then explain it in your own words."

The quote forces Claude to locate the source; the explanation tests understanding.

### Pattern 2: Force ID references

**Bad:** "How much gold does a player get for killing Worms?"

**Good:** "What's the `{ID}` and value for Worm gold drop? Reference `02_balance_values.md` section."

The ID requirement prevents value rounding.

### Pattern 3: Binary questions first, then nuance

**Bad:** "How does the bag work?"

**Good:** "Does the bag have a fixed number of slots? If yes, what's the ID? Then explain the slot rules."

Binary first = verifiable fact; nuance second = can't derail into invention.

### Pattern 4: Scope-limited change requests

**Bad:** "Update the balance to make Lv5 easier."

**Good:** "I want to reduce `SLIME_LV1_HP_SCALING_PER_LEVEL` from 10 to 8. 
1. Which files need to change?
2. Which V1-V18 invariants might be affected?
3. Which verification checks should I re-run?
4. Do NOT propose additional changes."

Scope-limited = no creative cascade.

### Pattern 5: Request uncertainty acknowledgment

**Bad:** "What's Loop 2 tree cost?"

**Good:** "What's Loop 2 tree cost? If this is not locked in v33, say so explicitly and cite where it's deferred."

Explicit uncertainty acknowledgment = fewer confabulations.

### Pattern 6: Trap-check after answer

After Claude answers, follow up:

> "Is there any part of that answer that you inferred rather than read directly from the files? List anything you weren't 100% certain about."

Claude will often surface its own uncertain parts if asked.

### Pattern 7: Fresh-conversation sanity check

For critical answers, open a second fresh conversation and ask the same question. If answers differ materially, one is hallucinated.

---

## 6. Integration with tooling

### Using `gdd_lint.py` as anti-hallucination safety net

The lint catches hallucination AFTER you write it to files. Always run before committing:

```bash
python3 gdd_lint.py --strict
```

Specifically catches:
- `{ID}` references that don't exist (Claude invented an ID)
- Missing lock markers on sections (Claude "updated" a section but forgot the marker)
- Numeric literals in rules that should be IDs (Claude hardcoded instead of referenced)

### Using `gdd_llm_validation_suite.md`

Run the 20-question suite as a health check:

- After any major v33 file change — ensures files still teach correctly
- Quarterly regardless — catches slow drift
- After any hallucination incident — verifies general accuracy hasn't degraded

Specifically Q2 and Q20 are designed to trap stale v31 info. If these fail, archived files are polluting context or Claude is over-relying on training data.

---

## 7. When to distrust Claude completely

Sometimes the rational response is: "Don't ask Claude this question. Ask a human or read files yourself."

### Red flag for complete distrust

- Topic is heavily present in training data for OTHER games with similar mechanics (Slay the Spire, Hades, Balatro). Claude will confidently apply their patterns to DiceBound.
- Question is vague ("What's the best strategy for Lv5?") — no single right answer, guaranteed confabulation.
- Question requires recent playtest data you haven't given Claude.
- Question requires business context (player acquisition cost, market fit) not in files.
- Question asks for value judgments ("Is this fun?").

### Cheaper to read yourself

For these questions, opening `02_balance_values.md` in a text editor and searching is faster and more reliable than asking Claude:

- What's the exact value of a specific ID
- Does a specific section say X
- Which file contains topic Y

Use Claude when you need synthesis across files, not lookup of a single fact.

---

## Summary for handoff

Give this file to anyone new to v33. Key takeaway: **the lint script + validation suite catch structural hallucination; this document catches semantic hallucination. Both are needed.**

### For the owner (you)

1. Skim §3 patterns monthly — refresh what to watch for
2. Run validation suite quarterly
3. If you catch repeat hallucinations → file bug → fix files

### For the recipient (handoff)

1. Read this file BEFORE using Claude for real work
2. Practice with §5 prompt patterns for first week
3. Log hallucinations for first month — patterns stabilize knowledge

### For the project

- Anti-hallucination is a discipline, not a one-time setup
- Files can be perfect and Claude can still hallucinate — you're the final verifier
- Tooling catches structural issues; you catch semantic ones

---

**End of `ANTI_HALLUCINATION_RULES.md`.** Read before using Claude on DiceBound. Re-read quarterly.
