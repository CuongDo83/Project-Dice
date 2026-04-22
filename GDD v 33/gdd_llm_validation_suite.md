# DiceBound v33 LLM Validation Test Suite

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 22)
- **Purpose:** Validate that v33 GDD files, when fed to an LLM per `_INDEX.md` §3 Task Map, enable correct answers to common DiceBound design questions.
- **Target accuracy:** ≥ 90% across 20 questions (≥ 18 correct).
- **Scoring:** Binary per question — correct (1) or incorrect (0). Partial credit NOT used; ambiguous answers score 0.

---

## How to use this suite

### Test protocol

1. Start fresh LLM conversation (no prior context).
2. Paste `_INDEX.md` first.
3. For each question, paste ONLY the files listed under "Files needed" (per Task Map).
4. Ask the question verbatim.
5. Score the answer against the expected key facts.
6. Record traps triggered (LLM confabulated, used v31 stale info, etc.).

### Target accuracy bands

- **≥ 90% (18+ correct):** v33 GDD is working as intended. Ship it.
- **75-89% (15-17 correct):** Some drift or ambiguity. Review wrong answers; may need minor file updates.
- **< 75% (< 15 correct):** Structural issue with GDD. Needs Session 23+ remediation.

### When to re-run

- After any major v33 file change.
- Before archiving v33 → v34.
- If Cursor/implementation LLM produces wrong output that traces to misunderstood rules.

---

## Scoring rubric per question

Each question has:
- **Q:** The question asked.
- **Files needed:** Which files to paste (matches `_INDEX.md` §3 Task Map).
- **Expected key facts:** What the correct answer MUST include (bullet form).
- **Trap to avoid:** Common wrong answers (e.g., stale v31 info).
- **Pass criteria:** What counts as correct.

---

## Test questions

### Category A — Balance Lookups (5 questions)

---

#### Q1. Basic value lookup

**Q:** What is the value of `PLAYER_HP_BASELINE` in DiceBound v33?

**Files needed:** `_INDEX.md`, `02_balance_values.md`

**Expected key facts:**
- Value: `200`
- Unit: HP
- Where: `02_balance_values.md` §2 Player baseline

**Pass criteria:** States 200 (HP). Partial credit NOT given for "around 200" or "200 or so".

---

#### Q2. Gold band per archetype

**Q:** How much gold does killing a Worm enemy grant in v33 main run?

**Files needed:** `_INDEX.md`, `02_balance_values.md`, `03_content.md`

**Expected key facts:**
- Worm uses High gold band
- Value: `GOLD_BAND_HIGH` = 13 gold
- Applies to both Worm and Fire

**Pass criteria:** States 13 gold for Worm. If says "Wind=1, Slime=2, Worm=4, Fire=4" (v31 stale values), FAIL.

---

#### Q3. Equipment upgrade cost (interpolated)

**Q:** What does Equipment Upgrade Lv15 cost per slot?

**Files needed:** `_INDEX.md`, `02_balance_values.md`

**Expected key facts:**
- Locked milestones: Lv2, Lv5, Lv10, Lv15, Lv20
- `EQUIPMENT_UPGRADE_COST_LV15` is defined
- Also note: formula in v32 part2 §5.5 conflicts with table — table is canonical (Appendix A.4)

**Pass criteria:** States the Lv15 value from `02_balance_values.md` §12. Bonus if notes the A.4 flag.

---

#### Q4. Merge tier cost

**Q:** What's the gold cost to promote an equipment piece from T3 to T4 via Merge?

**Files needed:** `_INDEX.md`, `02_balance_values.md`

**Expected key facts:**
- ID: `MERGE_COST_T3_TO_T4`
- Located in `02_balance_values.md` §13 Merge Gold Costs

**Pass criteria:** States the T3→T4 gold cost. Also notes 3 pieces of T3 required (cubic recipe).

---

#### Q5. Wave timing constants

**Q:** When does Wave 1 spawn, and when does Wave 2 spawn at earliest?

**Files needed:** `_INDEX.md`, `01_rules.md`, `02_balance_values.md`

**Expected key facts:**
- Wave 1: deterministic at Day 1 Turn 1 (`WAVE_FIRST_SPAWN_TURN` = 1)
- Wave 2: at first Player turn of Day 2 block (per `WAVE_SPAWN_INTERVAL_TURNS` = 6, i.e., 4 Day + 2 Night = 6 turns)
- Wave N+1 spawns at first Player turn of each subsequent Day block, regardless of whether previous wave is clear (overlap intended)

**Pass criteria:** States Wave 1 Day 1 Turn 1, Wave 2 earliest at Day 2 Turn 1. Notes overlap is intentional.

---

### Category B — Rule Queries (5 questions)

---

#### Q6. Mystery cell interaction

**Q:** What happens when a player enters a mystery cell during mid-path movement?

**Files needed:** `_INDEX.md`, `01_rules.md`

**Expected key facts:**
- Reward popup opens immediately (bag choice popup with 3 options)
- Player picks / rerolls / skips
- After resolution, player continues along remaining path
- Mystery popup is NOT end-turn trigger — flow returns to movement resolver
- Mid-path priority: special → combat → mystery → gold (per §6)

**Pass criteria:** Mentions popup opens, 3 choices, continues on resolution. Does NOT describe popup as end-turn.

---

#### Q7. Combat per-hit resolution order

**Q:** In DiceBound combat, what is the exact order operations are applied per hit?

**Files needed:** `_INDEX.md`, `01_rules.md`

**Expected key facts:** Order from `01_rules.md` §8:
1. Base damage
2. Crit roll (Crit Chance)
3. Crit damage multiplier (if crit)
4. Block roll (Block Chance)
5. Final damage computed (0 if blocked)
6. Lifesteal (based on final damage)
7. Double Strike roll (extra hit, skips step 7 on second hit)

**Pass criteria:** States order base → crit → crit dmg → block → final → lifesteal → DS. Notes DS extra hit skips another DS roll.

---

#### Q8. Night phase warning

**Q:** What UI cue must DiceBound display when entering Night phase? Is a visual tint alone sufficient?

**Files needed:** `_INDEX.md`, `01_rules.md`

**Expected key facts:**
- Explicit text message REQUIRED: "Enemy speed ×2 / atk ×2" (or equivalent wording)
- Visual tint ALONE is NOT sufficient (per §30.7)
- Rule: Entering Night MUST display the warning at round boundary
- Reason: readability pillar (Pillar 2) — player should not need to mental-math the multiplier

**Pass criteria:** States explicit text required, not just tint. Bonus if names the pillar.

---

#### Q9. Fusion execution

**Q:** What does the player need to do to execute a fusion recipe?

**Files needed:** `_INDEX.md`, `01_rules.md`

**Expected key facts:**
- Player holds 2 × Lv3 items matching a fusion recipe → items enter "fusion ready" state
- Fusion does NOT auto-fire — player must tap the fusion action manually
- On execution: 2 recipe items consumed, 1 fusion endpoint placed in bag
- Net slot delta: +1 free slot (consume 2 → place 1)
- Fusion item's bonus applies immediately

**Pass criteria:** Mentions manual trigger (not auto), 2→1 consumption, net +1 free slot.

---

#### Q10. Tree prerequisite chain

**Q:** Can the player purchase Finisher's Edge before Steady Hand is fully maxed?

**Files needed:** `_INDEX.md`, `01_rules.md`, `03_content.md`

**Expected key facts:**
- NO. Finisher's Edge (dmgMax) requires Steady Hand (dmgMin) at Tier 3 (fully maxed)
- Invariant preserved from v31 — "dmgMax cannot open before dmgMin is maxed in same branch"
- Root Tier 1 is prerequisite for ALL lanes becoming Available

**Pass criteria:** States Finisher requires Steady Hand max. Bonus if explains WHY (dmgMax-after-dmgMin invariant).

---

### Category C — Cross-System Reasoning (4 questions)

---

#### Q11. SIRC vs OUT_OF_RUN_IDLE_CEILING

**Q:** The value `OUT_OF_RUN_IDLE_CEILING_PCT` is 30%, but V14 SIRC checks if Idle gold is ≤ 50% of active gold. Why the discrepancy?

**Files needed:** `_INDEX.md`, `01_rules.md`, `02_balance_values.md`, `06_verification.md`

**Expected key facts:**
- V14 SIRC and V18 measure DIFFERENT things
- V14 SIRC: daily gold income ratio (idle gold/day vs active gold/day). Threshold 50% is FRAMEWORK-FIXED, not stored as an ID.
- V18: 30-day accumulated permanent progression ratio (idle-sourced UPI vs total UPI). `OUT_OF_RUN_IDLE_CEILING_PCT` = 30% applies HERE.
- Both must pass independently.

**Pass criteria:** Distinguishes V14 (daily flow) from V18 (30-day stock). States 50% is framework-fixed for V14, 30% is ID for V18.

---

#### Q12. Bag% and Damage Guard interaction

**Q:** If a player picks Power Edge Lv3 (percentage dmgMax bonus) at peak progression, and this would push dmgMax - dmgMin above the Damage Guard gap, what happens?

**Files needed:** `_INDEX.md`, `01_rules.md`

**Expected key facts:**
- Overflow rule applies per §26.4
- If adding bag % pushes `dmgMax - dmgMin > DAMAGE_GUARD_MAX_GAP`, dmgMax gain is CAPPED
- Overflow converts to dmgMin gain at 1:1 rate
- If ratio floor `DAMAGE_GUARD_MIN_RATIO_PCT` cannot be met, dmgMax capped directly
- Bag % is OUTERMOST multiplier (applied after permanent progression)

**Pass criteria:** Explains overflow-to-dmgMin conversion. Mentions bag % is outermost multiplier.

---

#### Q13. Level content authoring workflow

**Q:** I want to change the enemy count in Lv5 from 23 to 20. Which files do I need to update, and what validation should I run?

**Files needed:** `_INDEX.md`, `03_content.md`, `06_verification.md`

**Expected key facts:**
- `03_content.md` §8.5 Level 5 manifest (total enemy count)
- `01_rules.md` §17 wave stacking threshold may need re-evaluation (Lv5 currently flagged ~45% risk)
- Run V16 Wave Stacking Stress Test (via Monte Carlo harness OR analytic estimate)
- Update `02_balance_values.md` §26 PS_day tier bands if the change shifts Lv5 out of its target band
- Also update `_CHANGELOG.md` with change entry
- Note: per-wave composition lives in level JSON (content pipeline), NOT in `03_content.md` — per user Q3 decision

**Pass criteria:** Mentions `03_content.md` §8.5 + V16 check + changelog. Notes per-wave comp separation.

---

#### Q14. Equipment upgrade vs merge ownership

**Q:** Player has Weapon slot at Upgrade Lv10 with a T2 Weapon piece equipped. Player swaps a different T3 Weapon piece into the slot. What stats apply?

**Files needed:** `_INDEX.md`, `01_rules.md`

**Expected key facts:**
- Equipment Upgrade = SLOT-based (per §24.1)
- Equipment Merge Tier = PIECE-based (per §25.1)
- Slot Lv10 base stats stay with the slot (apply to whatever piece is equipped)
- Previously equipped T2 piece keeps its T2 merge tier in inventory
- Newly equipped T3 piece brings its T3 merge tier stats
- Player now has: Weapon slot Lv10 stats + T3 piece merge tier stats

**Pass criteria:** Explains SLOT-based vs PIECE-based distinction correctly. States both Lv10 and T3 apply after swap.

---

### Category D — Content Queries (3 questions)

---

#### Q15. Level composition

**Q:** What enemies appear in Lv5, and is there a boss?

**Files needed:** `_INDEX.md`, `03_content.md`

**Expected key facts:**
- Total: 23 regular enemies + 1 Elite Fire boss
- Archetype breakdown: Slime + Worm + Fire dominant (Fire Climax theme)
- Boss: Elite Fire at wave 5
- Mystery cells: 5 total
- Wave count: 5
- Win rate target: 45-50% (mid-game wall — expected retry)
- Wave stack risk flagged ~45% (V16 playtest priority)

**Pass criteria:** States 23 regular + Elite Fire + 5 mystery. Notes mid-game wall + V16 flag.

---

#### Q16. Bag item edge case

**Q:** How much lifesteal does Blood Charm Lv3 give, and what happens to lifesteal if the enemy blocks the hit?

**Files needed:** `_INDEX.md`, `02_balance_values.md`, `03_content.md`, `01_rules.md`

**Expected key facts:**
- Blood Charm Lv3 value: `BAG_BLOOD_CHARM_LV3_PCT` (look up exact value in `02_balance_values.md` §20)
- Lifesteal cap globally: `CHANCE_CAP_LIFESTEAL_PCT` = 25% (per `01_rules.md` §11)
- On blocked hit: final damage = 0 → lifesteal heal = 0 (per `03_content.md` §4.7 behavioral note + `01_rules.md` §8 combat resolution)
- Lifesteal heals from FINAL damage dealt (after crit, after block nullification)

**Pass criteria:** States Lv3 value + 25% cap + zero-on-block. Bonus for explaining "final damage" means post-block.

---

#### Q17. Fusion endpoint availability

**Q:** Which fusion endpoints feed into a Guard-family build?

**Files needed:** `_INDEX.md`, `03_content.md`

**Expected key facts:**
- 4 endpoints feed Guard family:
  - Bulwark Line (Guard Crest + Stable Edge)
  - Siege Heart (Guard Crest + Power Edge)
  - Hunter Guard (Guard Crest + Keen Eye)
  - Last Stand (Guard Crest + Fatal Fang) — DEFERRED (not yet locked v33 value)
- Only Bulwark Line, Siege Heart, Hunter Guard have v33 locked values
- Last Stand is in the 9 deferred endpoints

**Pass criteria:** Lists Bulwark Line + Siege Heart + Hunter Guard as locked. Notes Last Stand as deferred.

---

### Category E — Schema / Implementation (1 question)

---

#### Q18. Save schema for Rune Trial

**Q:** If I'm implementing Rune Trial persistence, what fields does `RuneTrialSaveData` need?

**Files needed:** `_INDEX.md`, `04_schema.md`, `01_rules.md`

**Expected key facts:**
- Fields per `04_schema.md` §3.5:
  - `highestClearedStage: number` (0 = never cleared)
  - `stageClearMap: { [stageIndex]: { firstClearedAt: number } }`
  - `dailyRewardedWinsUsed: number` (resets daily)
  - `lastDailyResetAt: number` (epoch ms)
- Reset at 7:00 local device time (per `01_rules.md` §23.5)
- No cross-contamination with Gold economy (V13 invariant)

**Pass criteria:** Names the 4 fields. States local timezone for reset. Notes V13 separation.

---

### Category F — Vision / Pillars (1 question)

---

#### Q19. Design pillar check

**Q:** I'm considering adding a feature that auto-routes the player along an optimal path when they press a button. Does this feature align with DiceBound's design pillars?

**Files needed:** `_INDEX.md`, `00_vision.md`

**Expected key facts:**
- Feature CONFLICTS with Pillar 1 ("The path IS the decision")
- Feature filter for Pillar 1: "Does this feature preserve or enhance path drawing as the primary decision? If a feature auto-selects paths or reduces path-planning to a menu, it weakens this pillar."
- Auto-routing explicitly weakens Pillar 1 → feature should be REJECTED
- No other pillar supports the feature sufficiently to override

**Pass criteria:** Rejects feature with reference to Pillar 1. Cites the explicit feature filter language.

---

### Category G — Trap Questions (1 question — test stale info avoidance)

---

#### Q20. Post-Win flow (trap: v31 power-up)

**Q:** What happens after the `WinText` screen in DiceBound v33? Describe the flow step by step.

**Files needed:** `_INDEX.md`, `01_rules.md`

**Expected key facts:**
- Flow per `01_rules.md` §15.1:
  1. `WinText` screen displays
  2. Gold tally runs (includes efficiency bonus per Day-depth reached)
  3. Result table displays (enemies killed, gold earned, equipment obtained)
  4. Gold + equipment banked to persistent storage
  5. Return to Home. Player selects next level from Home → Modes → Main Run
- NO power-up selection popup (v31 feature removed in v32 per §28)
- Progression between levels flows ENTIRELY through Home (Tree, Equipment Upgrade/Merge)

**TRAP to avoid:** Do NOT mention "between-level power-up selection" from v31. If LLM says "player picks a power-up (Heal +1, +dmgMin, etc.) before next level", FAIL — that's stale v31 info.

**Pass criteria:** Describes flow WITHOUT mentioning power-up. Correctly states progression happens at Home. If trap triggered: 0 points, note "v31 stale info leak".

---

## Question difficulty distribution

| Category | Questions | Difficulty mix |
|---|---|---|
| A Balance Lookups | Q1-Q5 | 2 Easy + 2 Medium + 1 Hard (Q3 interpolated) |
| B Rule Queries | Q6-Q10 | 2 Easy + 2 Medium + 1 Hard (Q7 combat order) |
| C Cross-System | Q11-Q14 | 0 Easy + 2 Medium + 2 Hard |
| D Content | Q15-Q17 | 1 Easy + 2 Medium |
| E Schema | Q18 | 1 Medium |
| F Vision | Q19 | 1 Medium (requires pillar reasoning) |
| G Trap | Q20 | 1 Hard (tests anti-confabulation) |

Total: 20 questions. ~30% Easy, ~50% Medium, ~20% Hard.

---

## Scoring template

Copy this and fill in after running the suite:

```
Test Run Date: _______________
LLM Tested: __________________ (e.g., Claude Opus 4.7, GPT-5, etc.)

| Q# | Category | Result | Notes |
|----|----------|--------|-------|
| Q1 | A Balance | [ ] PASS  [ ] FAIL | ... |
| Q2 | A Balance | [ ] PASS  [ ] FAIL | ... |
...
| Q20| G Trap    | [ ] PASS  [ ] FAIL | Did trap trigger? Y/N |

Total Pass: __ / 20
Accuracy: __% 
Target met (≥90%): [ ] Y  [ ] N
```

---

## Expected failure modes (from design experience)

Before running, note these likely failure patterns. If accuracy fails, check if failures cluster in any pattern:

1. **Stale v31 info leak** (Q2 gold bands, Q20 power-up): LLM pulls from v31 training data despite v33 files. Indicates file language not strong enough to override prior.
2. **Cross-file reasoning gap** (Q11 SIRC/V18, Q13 level change workflow): LLM answers only from the first file shown, misses cross-references. Indicates Task Map not followed.
3. **Architectural vs tunable confusion** (Q5 wave timing, Q14 slot-vs-piece): LLM conflates different ownership models. Indicates rules §24.1/§25.1 distinction needs stronger language.
4. **Deferred vs locked confusion** (Q17 fusion endpoints, Q4 merge cost): LLM answers about deferred items as if locked. Indicates "deferred" markers need clearer flagging.

---

## Maintenance

- When v33 files change significantly (balance retune, new content, rule update), re-run suite and update expected answers where appropriate.
- New sessions that add new features → add new test questions covering them.
- Questions that consistently produce wrong answers across multiple LLMs → flag as GDD ambiguity, fix in files (not in test suite).

**Rule:** This test suite validates the FILES, not the LLMs. If a question is wrong but the file is clear, the LLM is at fault. If a question is wrong and multiple LLMs get it wrong, the FILE is at fault.

---

**End of validation test suite.** 20 questions across 7 categories covering balance lookup, rules, cross-system reasoning, content, schema, vision, and anti-confabulation traps. Designed for ≥90% accuracy target when files are properly fed per Task Map.
