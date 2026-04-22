# DiceBound GDD — Changelog

Append-only. Newest on top. Short "what" entries. For deep rationale, see relevant file + Git history.

Format per entry:
```
## vN — YYYY-MM-DD — short title
- Category: short what (reason in parentheses if useful)
- Category: short what
- Cascade: files touched / verification result
```

Categories: `Balance`, `Rule`, `Content`, `Schema`, `UI`, `Vision`, `Structure`, `Cascade`.

---

## v33 — 2026-04-21 — Initial migration

**Structure:**
- Full restructure from v31 + v32 part1 + v32 part2 + handoff into concern-based 9-file layout
- Added `_INDEX.md` (meta, task map, glossary, ID convention) and `_CHANGELOG.md` (this file)
- Locked "no delta overlay" policy — all future edits direct to v33 files
- Terminology standardization "power item" → "bag item" (see `_INDEX.md` §5)

**Balance (Session 2 — Player + Enemy):**
- Extracted 60 balance IDs to `02_balance_values.md` with UPPER_SNAKE_CASE convention and `{ID}` reference syntax
- Covered: Player baseline, Equipment Lv1 auto-equip, chance caps, Damage Guard, TTK anchors, heal potion, 4 enemy archetypes Lv1, enemy scaling, Night phase multipliers

**Migration decisions (Session 2):**
- A.1 resolved: `PLAYER_ROLL_MAX = 3` confirmed per v32 S1 handoff tracker (v31 was 4; v32 S1 intentional change; v32 part1 label "unchanged" was error)
- A.2 resolved: `WIND_MOVE_SPEED_DAY` = 2-4 inherited from v31 (v32 part1 showed "?" as incomplete entry, not override)
- A.3 resolved: Enemy DMG scaling `+5 per 2 main levels, cap +15 bonus` — table canonical over rule text; rule text "+5 per 3 levels" in v32 part1 §2.2 is outdated and must be corrected when writing `01_rules.md`

**Downstream impacts recorded:**
- Enemy DMG cap reached at Lv7 (not Lv10 as v32 footnote claimed)
- Night DMG and speed multipliers applied uniformly via `{NIGHT_DMG_MULTIPLIER} = 2` and `{NIGHT_SPEED_MULTIPLIER} = 2`
- Rule text for enemy scaling must use new formula when written in Phase 2

**Balance (Session 3 — Economy):**
- Extracted 47 economy IDs to `02_balance_values.md` §10-15
- Covered: Gold bands (3/8/13/64 — 3.2× v31), Gold efficiency curve (Day 1/2-3/4/5+ → 0/15/30/50%), Equipment Upgrade cost (5 tabulated + cumulative), Equipment Merge cost (5 transitions + cumulative), Idle reward system (5 constants + 10-level curve), Rune Trial rewards (formula 8+N)

**Migration decisions (Session 3):**
- A.4 noted with workaround: Equipment Upgrade cost formula in v32 part2 §5.5 is inconsistent with its own table; v33 locks 5 tabulated values + cumulative, intermediate levels not locked. Resolution deferred to Session 4/5 if needed.
- A.5 pending user input: Rune Trial daily wins cap not in v32 part2 §5.8 (inherited from v31/proposals as 2). User to confirm before Session 4.
- Efficiency curve: v33 uses compressed v32 part2 §5.3 thresholds (Day 1/2-3/4/5+) not older stretched handoff draft (Day 1/3/5/8+)

**Cascade:**
- Files touched: `_CHANGELOG.md`, `02_balance_values.md`
- No downstream regressions — all Session 3 values are faucet/sink numerics, independent of combat rule layer

**Balance (Session 4 — Progression):**
- Extracted ~158 progression IDs to `02_balance_values.md` §16-21
- Covered: Gold Tech Tree Loop 1 (6 nodes × 3 tiers + aggregate, 525 RS full / 315 RS typical), Equipment per-level scaling (4 slots × increment + Lv20 cumulative), Merge 4-family (Stability/Burst/Precision/Guard × T1-T6 per-slot + bias + sub-bonuses), Merge recipe (cubic 3→1 up to 363 T1 for T6), Bag items (15 × Lv1/Lv2/Lv3), Fusion endpoints (6 locked + 3 principles + 9 deferred)

**Migration decisions (Session 4):**
- A.6 noted: Weapon Lv20 dmgMax cumulative stated +11 but rule arithmetic suggests +12. v33 locks +11 (matches §1.5 verification). Non-blocking.
- Tree redesign: v31 had 7 named nodes (Iron Hide, Steady Hand, Clean Loot, Veteran Body, Finisher's Edge, Contract Bonus, Campaign Command) total 838 RS. v32 consolidated to 6 generic nodes (Root replaces Iron Hide + Veteran Body), 525 RS full / 315 RS typical per loop, compound across loops.
- Loop 2-3 scaling DEFERRED per v32 §5.7 (compound runaway risk).
- Fusion: 9 of 15 endpoints deferred to playtest tuning (principles locked: DMG/HP→%, chance/dice→flat, Night = 2× Day per time-ratio).

**Cascade:**
- Files touched: `_CHANGELOG.md`, `02_balance_values.md`
- Total ~265 balance IDs locked across Sessions 2-4
- Ready for Session 5: cross-system thresholds + boss placeholder stats (final balance session)

**Balance (Session 5 — Constants + Thresholds):**
- Extracted ~55 constant IDs to `02_balance_values.md` §22-32 — COMPLETES the file
- Covered: Wave/Day/Night cycle constants (4/2/6 turns, spawn interval), Wave overlap thresholds (V16 DiceBound ≤30%), Map grid (8×11), UPI ratio bands per session stage (early 0.8-1.5×, mid 1.2-2.0×, late 1.8-2.5×), V1.3.0 PS_day tier bands (6 tiers Low through Very High), Threat band percentages (80%/120%), In-run vs out-of-run ratio bounds (floor 25%, ceiling 40%, Idle cap 30%), Boss placeholder stats (3 instances × HP/DMG/Speed + scaling multipliers), Anti-frustration gates (G1/G2/G3 thresholds), Enemy DMG range band (70%), Heal pickup rate (70%), Monte Carlo sample size (1000), Session assumptions (3 runs × 30 min), Full build pacing target (22-34 days)

**Migration decisions (Session 5):**
- No new conflicts discovered. Session 5 content is aggregation of framework thresholds + v32 part1 §3/§4 constants + v32 part2 §7 verification constants.
- V16 wave stacking: DiceBound-specific ≤30% threshold locked (framework default ≤5% kept as reference but inactive).
- Boss placeholder stats locked sufficient for SIRC/balance verification; full boss design (phases, 2×2, unique mechanics) remains deferred per v32 §10.10.
- "Build packages" stored as numeric min/max (2-3). Exact definition of "package" is conceptual, belongs in `01_rules.md` or `06_verification.md`.

**Cascade:**
- Files touched: `_CHANGELOG.md`, `02_balance_values.md`
- **`02_balance_values.md` is NOW COMPLETE** — ~320 IDs across 32 sections
- Next phase: writing `01_rules.md` (system rules referencing these IDs)
- All 6 conflicts resolved or noted: A.1-A.5 RESOLVED, A.6 NOTED (non-blocking)

**Rules (Session 6 — Combat + State Flow first pass):**
- Created `01_rules.md` with file header, reading rules, and full section map (31 sections planned across Sessions 6-13)
- Drafted 15 rule sections (§1-§15) covering: state flow (7 canonical states), turn structure + Day/Night cycle, player input (BeforeRoll), dice roll mechanics, path drag + movement, mid-path priority + continuation, combat trigger + initiator, combat per-hit resolution order (crit→block→damage→lifesteal→double strike), combat end conditions, Damage Guard invariant (TIER 1), chance stat caps, heal potion behavior, enemy AI, Day/Night phase multipliers, Win/Lose scaffold
- All rules reference values via `{ID}` syntax — no literal numbers in rule text
- Lock markers added at end of each section: `<!-- Locked: v33 | Last changed: v33 | CL: — -->`

**Migration decisions (Session 6):**
- §15 Win/Lose scaffolded only — partial gold on lose is an open question, deferred to Session 10-11 or Session 16
- Mystery cell + Battlefield Bag flow deferred to Session 8-9 (§18)
- Power-up selection after Win deferred to Session 10-11 (§28)
- Corrected v32 part1 footnote inaccuracy in §18 balance_values (enemy DMG cap at Lv7, not Lv10) — `01_rules.md` must NOT repeat this error when §19 difficulty rules are written in Session 8-9

**Cascade:**
- Files touched: `_CHANGELOG.md`, `01_rules.md` (new)
- `02_balance_values.md` unchanged
- Next session (Session 7): polish `01_rules.md` Part A — verify all `{ID}` references resolve correctly in `02_balance_values.md`, tighten rule language, resolve §15 edge cases where possible

**Rules (Session 7 — Part A polish):**
- Fixed 2 ID reference bugs in `01_rules.md`: `HEAL_POTION_DROP_RATE_PCT` → `HEAL_POTION_DROP_PCT`, `HEAL_POTION_HEAL_PCT` → `HEAL_POTION_MAGNITUDE_PCT` (3 occurrences across §12)
- Tightened §8.2 Double Strike: extra hit now SKIPS step 7 (no "depth tracking" logic needed — cleaner implementation contract)
- Replaced 2 literal number references with IDs: §13.4 Enemy DMG ratio, §8.3 Commentary chance cap
- Added §6.4 Mystery cell persistence across waves (v31 explicit rule found)
- Added §6.5 Wave-spawn overlap exceptions (enemy on player → immediate attack; mystery on player → immediate pickup — v31 explicit)
- §15 Win/Lose — resolved partial-gold open question using v31 explicit rule: "gold collected from enemy kills must carry out on lose". Both Win and Lose fully bank gold + T1 drops. Efficiency bonus on Lose applies at Day-depth reached at moment of death. Bag/in-run power/HP never carry.

**Verification (Session 7):**
- 25 unique `{ID}` references in `01_rules.md` — all resolve correctly in `02_balance_values.md` (0 missing)
- 0 literal balance numbers in rule text (only code-logic constants like "0 damage" remain)
- Part A (§1-§15) marked as LOCKED and authoritative for Combat + State Flow domain

**Migration decisions (Session 7):**
- Efficiency on Lose: v31 silent, v32 part2 §5.3 says "applied to total gold earned during run" without win/lose distinction. v33 interprets as "proportional to Day-depth at death". Flag for playtest: if players exploit by quitting to claim efficiency early, revert to Win-only at Session 10-11 Economy pass.
- Double Strike "chain break" expressed as implementation contract (skip step 7 for extra hits) instead of conceptual "depth ≤1" rule — easier to code correctly.

**Cascade:**
- Files touched: `_CHANGELOG.md`, `01_rules.md`
- `02_balance_values.md` unchanged (no new IDs needed)
- Next session (Session 8): Part B — Level structure + Wave spawn rules + Mystery/Battlefield Bag flow (§16-§20)

**Rules (Session 8 — Part B Level/Wave/Mystery draft):**
- Added 5 rule sections (§16-§20) to `01_rules.md`:
  - §16 Level structure + wave spawn (wave order, spawn window = first Player turn of each Day block, preview markers red X/green X, preview timing, level completion)
  - §17 Wave overlap + stacking (overlap intentional, stat independence, V16 threshold, Wave Stacking Stress Test protocol, failure responses)
  - §18 Mystery cell + Battlefield Bag flow (trigger conditions, 3-choice popup, reroll 1/level, skip, pick behavior, replace branch, offer weighting overview, fusion mechanics, 4 neutral slots, choice card UI requirements)
  - §19 Difficulty scoring V1.3.0 (ESP/ECP/TPP/RR formulas, growth relief overview, full formula chain, PS_day overlap-aware pressure, tier bands per level, Day-block length as difficulty lever with 3-row lookup)
  - §20 Anti-frustration gates (G1 HP headroom, G2 wave overlap safety, G3 heal access, Empty Bag Test invariant)
- 47 unique ID references across full file, all verified against `02_balance_values.md`

**Flags raised (Session 8):**
- **Bag offer weight tables not migrated:** v31 §5.8 BasePhaseWeight (5 utility × Early/Mid/End + 10 combat × Early/Mid/End) and 9 dynamic modifier multipliers NOT yet in `02_balance_values.md`. Flagged in §18.8 as "pending migration". Decision needed: either reopen `02_balance_values.md` for a patch, or defer until Session 10-11 when Economy rules are written. Implementations currently must reference v31 §5.8 as interim source.
- MO_effective / BO / HO formulas for Growth Relief deferred to `06_verification.md` V1.3.0 extension (Session 16). Rules layer treats these as designer inputs per wave.

**Migration decisions (Session 8):**
- Kept V1.3.0 full scoring chain (`RawCombatPressure - GrowthRelief + WCP + LPR`) rather than simplify — this is the existing DiceBound formula that content design already uses.
- Day-block length 3-row lookup (Short 3/1, Medium 4/2 default, Long 5/3) locked as tunable pattern, referenced by §17.5 and §19.12.
- "Empty Bag Test" placed under §20 (anti-frustration gates) rather than as standalone section — it is the **inverse** of frustration protection (protects tactical depth rather than against impossible difficulty).

**Cascade:**
- Files touched: `_CHANGELOG.md`, `01_rules.md`
- `02_balance_values.md` unchanged (still closed post-Session 5)
- Next session (Session 9): Part B polish — verify references, tighten language, resolve bag weight migration decision, possibly extend PS_day formula with specific MO/BO/HO probability weights

**Session 9 — Bag Weight Migration Patch + Part B Polish:**

**Balance values (re-opened `02_balance_values.md` §33):**
- Added 59 new IDs for Bag Offer Weight Tables:
  - §33.1 Utility item phase weights: 5 items × 3 phases = 15 IDs (Pathfinder Token, Step Anchor, Field Kit, Sun Compass, Moon Ward)
  - §33.2 Combat item phase weights: 10 items × 3 phases = 30 IDs (Guard Crest, Stable Edge, Power Edge, Keen Eye, Fatal Fang, Iron Guard, Blood Charm, Twin Sigil, Sun Fang, Moon Fang)
  - §33.3 Dynamic modifiers: 9 IDs (owned-not-max, Lv2-needs-Lv3-for-fusion, family-aligned, completes-open-fusion, low-HP-recovery, Day-phase-bias, Night-phase-bias, off-build-after-first-fusion, recipe-produces-existing-fusion)
  - §33.4 Modifier threshold: 1 ID (`MODIFIER_LOW_HP_THRESHOLD_PCT` = 50%)
  - §33.5 Structural rule values: 4 IDs (`BAG_REROLLS_PER_LEVEL`, `BAG_ACTIVE_SLOTS`, `BAG_POPUP_CHOICE_COUNT`, `FUSION_RECIPE_ITEM_COUNT`)
- Total `02_balance_values.md` now 404 IDs across 33 sections
- Source: v31 §5.8 unchanged in numeric values

**Rules (`01_rules.md` Part B polish):**
- Removed "pending migration" flag from §18.8 (bag offer weighting now has full ID references)
- Tightened §18.8 with explicit computation formula: `final_weight = BasePhaseWeight × product_of_modifiers`
- Added modifier application rules: all applicable multiply (not first-match), `BAG_MOD_RECIPE_PRODUCES_EXISTING_FUSION = 0` is hard filter not weight
- Replaced 5 literal numbers in §18 with new ID references: `{BAG_POPUP_CHOICE_COUNT}` (was "3"), `{BAG_REROLLS_PER_LEVEL}` (was "1 reroll"), `{BAG_ACTIVE_SLOTS}` (was "4 slots"), `{FUSION_RECIPE_ITEM_COUNT}` (was "2 × Lv3")
- `01_rules.md` now 51 unique ID references, all verified against `02_balance_values.md`

**Migration decisions (Session 9):**
- User chose Option A (re-open `02_balance_values.md`) over Option C (defer). Rationale: cleaner — no interim source dangling, rules file fully self-contained via IDs.
- All v31 §5.8 weights migrated verbatim (no numeric changes). Playtest may tune values later via standard change workflow.
- `MODIFIER_LOW_HP_THRESHOLD_PCT` extracted as separate ID rather than embedding 50% literal in modifier description — allows future tuning without rule change.

**Cascade:**
- Files touched: `_CHANGELOG.md`, `02_balance_values.md`, `01_rules.md`
- `02_balance_values.md` status: "COMPLETE" reasserted (Sessions 2-5 + Session 9 patch; no future sessions expected to add IDs barring playtest-driven changes)
- Part B (§16-20) of `01_rules.md` locked with full ID coverage
- Next session (Session 10): Part C start — Economy currency flows (DSSM), Idle claim behavior, Rune Trial structure, Equipment Upgrade rules, Equipment Merge rules

**Rules (Session 10 — Part C Economy/Progression first pass, §21-25):**
- Added 5 rule sections to `01_rules.md`:
  - §21 Economy currency flows — DSSM architecture, Gold/RS faucet-sink mapping, strict separation V13 invariant, Equipment as shared output surface (not a currency violation)
  - §22 Idle reward claim behavior — accrual online+offline, tick interval, offline cap, no cooldown, per-tick gold by level, 3% equipment roll, manual claim mechanics, 3-session daily rhythm design intent, SIRC V14 invariant reference
  - §23 Rune Trial structure — stage-based PvE, 20 handmade stages, 2 waves/stage, disabled features (bag/fusion/mystery/day-night), 0.85× enemy scaling, 2 daily wins, lose-doesn't-consume rule, replay + sweep mechanics, reward formula, currency restriction
  - §24 Equipment Upgrade rules — SLOT-based ownership (critical vs Merge), 4 slots × Lv1-Lv20, per-upgrade stat patterns per slot (odd/even), Damage Guard interaction, slot stats apply only when equipped, Home→Equipment UI flow
  - §25 Equipment Merge rules — PIECE-based ownership, 4 families structure (Stability/Burst/Precision/Guard), 6-tier progression structure (T1 base → T6 peak), cubic 3→1 recipe, gold costs per transition, 4-slot family bias activation rule, readability rule (always-on or UI-readable conditions only), Blacksmith UI flow

**Verification:**
- 107 unique `{ID}` references in `01_rules.md`, all resolve correctly against `02_balance_values.md` 404 IDs (0 missing)
- Literal numbers remaining in Part C are illustrative examples, architectural constants (4 equipment slots), or design intent estimates — not tunable balance values

**Migration decisions (Session 10):**
- Ownership model clarity emphasized: Upgrade = SLOT-based (stats stay with slot on swap), Merge Tier = PIECE-based (stats travel with piece). This distinction was explicit in v31 v20/v21 but easily missed.
- Family bias activation rule: bias scales with MINIMUM tier across 4 slots (e.g., T6/T6/T5/T3 activates at T3 level) — chose this interpretation over "average tier" or "max tier" based on v31 intent to reward consistent commitment.
- Merge readability rule preserved verbatim from v31 v16 — hidden percentile conditions prohibited, always-on or UI-readable only. Examples explicitly listed.
- Rune Trial daily reset flagged: "7:00 local time" from v31 §3.8 — timezone ambiguity (local vs UTC vs server) not resolved. Tagged for Session 16 open questions.

**Cascade:**
- Files touched: `_CHANGELOG.md`, `01_rules.md`
- `02_balance_values.md` unchanged
- Next session (Session 11): Part C completion — §26 Bag items (extending §18 with stat application rules, Damage Guard interaction for DMG items, per-phase bias timing), §27 Tree unlock rules (node prerequisites, branch dependencies, lane gating, Loop compound mechanic), §28 Between-level power-up selection

**Rules (Session 11 — Part C completion, §26-28 + polish §21-25):**
- Added 3 rule sections to `01_rules.md`:
  - §26 Bag item stat application + fusion extensions — stat application timing (immediate on pick), flat vs percentage distinction, percentage base definition (bag% applies as outermost multiplier on pre-bag effective base), Damage Guard overflow for %-DMG items, phase-dependent activation/deactivation at phase boundaries, heal% stacking (Field Kit + base heal), bag state reset timing, fusion execution slot mechanics
  - §27 Gold Tech Tree unlock rules — tree open from start, Root-first access rule, per-lane local prerequisite, Finisher-after-Steady-max invariant preserved from v31, Capstone soft gate (both Combat lanes ≥ T1 + at least one Gold lane), node states (Locked/Available/Purchased/Max), UI layout (vertical bottom-up, no side panel), Damage Guard interaction for tree purchases, LM-A compound loop mechanic (Loop 2+ deferred), persistence schema
  - §28 Between-level power-up selection — WinText → tally → result table → selection flow, 4-effect pool (Heal+1/Heal+2/+dmgMin/+dmgMax), 4 OPEN QUESTIONS flagged A.7-A.10 (run structure ambiguity, selection count, power-up magnitudes, heal pool expansion)

**Open questions flagged for Session 16 (A.7-A.10):**
- A.7 Run structure: single-level vs multi-level rogue-like (affects power-up persistence)
- A.8 Selection count per popup (v31/v32 silent — v33 interim uses `{BAG_POPUP_CHOICE_COUNT}` = 3)
- A.9 Power-up numeric magnitudes for +dmgMin / +dmgMax (never locked)
- A.10 Heal pool expansion to %-based variants post-v32

**Verification:**
- 111 unique `{ID}` references in `01_rules.md`, all resolve against `02_balance_values.md` 404 IDs (0 missing)
- Part C complete (§21-28 all locked)

**Migration decisions (Session 11):**
- Percentage bag stats as OUTERMOST multiplier: bag% applies on top of (Permanent + Equipment + Merge + Tree) stacked base. This ensures empty-bag state remains meaningfully weaker than maxed-bag state, preserving in-run tactical depth (V12 invariant).
- Fusion slot accounting: "consume 2 recipe slots → place fusion in 1 slot → net free slot +1". Interpretation flagged — if playtest finds this confusing, revisit in Session 16.
- Root = purchasable (v32) vs free-structural (v31): v32 wins. Rule text explicitly notes the change.
- Tree prerequisite "Finisher requires Steady max": preserved from v31 explicit invariant. Applied to v32 simplified 6-node topology.
- Capstone soft gate: inferred as "both Combat lanes ≥ T1 + at least one Gold lane" since v32 topology doesn't specify. Conservative — ensures multi-lane investment before capstone. Tunable if playtest finds it too restrictive.

**Cascade:**
- Files touched: `_CHANGELOG.md`, `01_rules.md`
- `02_balance_values.md` unchanged
- Next session (Session 12): Part D start — §29 UI state list + invariants (7 runtime states, transitions, HUD elements per state, wireframe references), §30 HUD/readout rules (power display, threat preview, phase indicator, bag summary, timer)
- Session 13 will add §31 Cross-system invariants (V1-V17) and polish Part D

**Rules (Session 12 — Part D §29-30 UI/HUD first pass):**
- Added 2 rule sections to `01_rules.md`:
  - §29 UI state list + invariants — 7 canonical runtime states, per-state UI element requirements (BeforeRoll/ReachablePreview/Moving/Combat/EnemyTurn/WinText/LoseText), UI state invariants (UI doesn't modify gameplay logic, single modal at a time, no manual End Turn), wireframe references from v31 (5 present, 4 missing)
  - §30 HUD + readout rules — Top HUD main mode (HP+DMG+Move+PowerValue+PhaseLabel+BagTarget), Top HUD Rune Trial (stripped down, no phase/bag), power display formula `hp.current + dmg.max` for both player and enemy (no auto-judge), threat preview color coding (dark red moveSpeedMin, light red moveSpeedMax), tap-enemy tooltip rules, wave preview markers, Day/Night indicators + explicit Night warning message, heal potion presentation, bag summary HUD, Equipment UI + Blacksmith layouts (v31 v19/v21 locked), Home/Idle card, Modes/Rune Trial card, stage-select UI (no recommended power), Gold Tech Tree UI (vertical bottom-up, node cards self-contained), secondary danger cue coverage rule

**Verification:**
- 111 unique `{ID}` references (unchanged from Session 11 — §29-30 mostly UI behavior text, minimal new balance refs)
- All resolve against `02_balance_values.md` 404 IDs (0 missing)
- 30 of 31 total sections drafted/locked in `01_rules.md`

**Migration decisions (Session 12):**
- Power display formula `hp.current + dmg.max` preserved from v31 v9. Simple scalar for direct player↔enemy comparison. No auto-judge (respects player agency).
- Threat preview default state: ON. Player can toggle off if distracting, but on-by-default ensures new players see movement risk.
- Night phase transition requires EXPLICIT warning message per v31 — not just visual tint. Specifically: "Enemy speed ×{NIGHT_SPEED_MULTIPLIER} / atk ×{NIGHT_DMG_MULTIPLIER}".
- Rune Trial stage-select explicitly does NOT show "recommended power" per v31 — player judges readiness from their own stats vs prior main-run experience.
- Secondary danger cue coverage rule added: if a threat surface isn't covered by existing UI cues, new cue must be added via design review. Prevents "player misreads threat because UI hid it" failure mode.

**Cascade:**
- Files touched: `_CHANGELOG.md`, `01_rules.md`
- `02_balance_values.md` unchanged
- Next session (Session 13): §31 Cross-system invariants V1-V17 (full verification checklist for implementation — Dual-currency integrity, SIRC, Merge supply, Wave stacking, Mode role uniqueness, Damage Guard, UPI power curve, etc.), polish Part D, final verification pass of entire `01_rules.md`

**Rules (Session 13 — `01_rules.md` COMPLETE: §31 + final pass):**
- Added §31 Cross-system invariants V1-V18 to `01_rules.md`:
  - 31.1 Combat/Stat invariants (V1 Damage Guard baseline, V2 Damage Guard max progression, V3 TTK Slime ≥5, V4 TTK Fire ≥3)
  - 31.2 Build architecture (V5 total packages 2-3, V6 no single layer = 1 full package, V7 in-run floor 25%, V8 in-run ceiling 40%, V9 Empty Bag Test)
  - 31.3 Progression (V10 layer orthogonality, V11 UPI ratio session bands, V12 chance caps respected)
  - 31.4 Dual-currency + meta (V13 currency integrity, V14 SIRC pass 5 tiers, V15 Merge supply sufficient, V16 Wave Stacking Stress Test, V17 MMRM mode role uniqueness)
  - 31.5 V18 Idle out-of-run ratio ≤30% (distinct from V14 SIRC — 30-day window vs per-day)
  - 31.6 Invariant priority order when conflicts arise (Combat/Stat highest, quantitative thresholds lowest)

**File completion summary:**
- 31 rule sections across 4 Parts (A: 1-15 Combat+State, B: 16-20 Level+Wave+Mystery, C: 21-28 Economy+Progression, D: 29-31 UI+Invariants)
- 121 unique `{ID}` references, all resolve against `02_balance_values.md` (0 missing)
- All 31 sections have Lock markers (`<!-- Locked: v33 | Last changed: v33 | CL: — -->`)
- 7 open questions flagged for Session 16:
  - A.7-A.10 (power-up structure §28)
  - Rune Trial daily reset timezone (§23.5)
  - Fusion slot accounting verification (§26.8)
  - Loop 2+ tree scaling (§27.9)

**Migration decisions (Session 13):**
- V14 SIRC threshold: framework-fixed at 50%, NOT stored as ID. Note explicitly in rule text that this is not `{OUT_OF_RUN_IDLE_CEILING_PCT}` (which is the V18 30-day window threshold, different concept).
- V1-V18 numbering: consolidated from v32 part2 §7.4 + framework v1.1 §3. V18 (Idle out-of-run) kept separate from V14 (SIRC) despite both being Idle-related — different measurement windows, both must hold.
- Invariant priority order (31.6): Combat/Stat > Chance caps > Currency > MMRM > Build architecture > Quantitative. Makes explicit what resolves when invariants conflict during tuning proposals.
- No new balance IDs added. V14 SIRC threshold stays as framework-fixed literal.

**Cascade:**
- Files touched: `_CHANGELOG.md`, `01_rules.md`
- `02_balance_values.md` unchanged
- **`01_rules.md` status: COMPLETE. Authoritative source for DiceBound v33 runtime rules.**
- Next session (Session 14): Start `03_content.md` — enemy archetype behaviors (movement patterns, targeting logic per archetype), 15 bag items detail (effect mechanics, interaction edge cases beyond balance values), tree node descriptions, merge family identity text, boss placeholder behavior, level enemy manifests (count + type per level, no wave composition per user Q3 decision earlier in migration)

**Content (Session 14 — `03_content.md` created):**
- Created new file `03_content.md` covering entity behaviors and identity descriptions
- 8 sections:
  - §1 Enemy archetypes (Slime reference, Wind speed, Worm pressure, Fire execution) with movement identity + combat identity + design role + gold band
  - §2 Boss placeholder (3 instances: Elite Worm Lv3, Elite Fire Lv5, Elite Fire Lv7) — full boss design deferred
  - §3 Bag items Utility/Tactic (5 items): Pathfinder Token, Step Anchor, Field Kit, Sun Compass, Moon Ward
  - §4 Bag items Combat (10 items): Guard Crest, Stable Edge, Power Edge, Keen Eye, Fatal Fang, Iron Guard, Blood Charm, Twin Sigil, Sun Fang, Moon Fang
  - §5 Fusion endpoints (6 locked + 9 deferred with principle references)
  - §6 Gold Tech Tree nodes (Root, Steady Hand, Finisher's Edge, Clean Loot, Contract Bonus, Capstone) with prerequisite chain
  - §7 Merge families (Stability, Burst, Precision, Guard) with identity + playstyle + commitment trade-off
  - §8 Level manifests Lv1-Lv8 (per user Q3 decision: count + type per level, NOT per-wave composition — wave comp belongs in level JSON)
- 41 unique `{ID}` references, all resolve against `02_balance_values.md` (0 missing)

**Migration decisions (Session 14):**
- File purpose: describes WHAT entities do and HOW they feel. Numbers → `02_balance_values.md`; rules → `01_rules.md`; behavior/identity → this file.
- Bag item descriptions include synergy notes (which fusion endpoints each item feeds) and behavioral edge cases (e.g., Blood Charm lifesteal = 0 on blocked hit, Twin Sigil extra hit doesn't chain).
- Level manifest format per user Q3: preserves only balance-relevant data. Wave composition (which enemies in which wave) deliberately excluded from this file — implementation pipeline will author level JSON from these manifests + rules.
- 3 Lv1-Lv8 wave-stack risk flags preserved from v32 part1 §4 (Lv5 ~45%, Lv6 ~40%, Lv8 ~40%) — cross-referenced to V16 playtest priority observations.
- Merge family "Guard" sub-bonus clarification: unlike Stability/Burst/Precision which use HP for T5/T6 sub-bonus, Guard uses Block% (10/20 HP vs 2/5% Block — per §18.4 balance values).
- Elite Worm/Fire bosses fully placeholder — acts as tanky regular enemy, no special abilities yet. Flag preserved.

**Cascade:**
- Files touched: `_CHANGELOG.md`, `03_content.md` (new)
- `02_balance_values.md` unchanged
- `01_rules.md` unchanged
- Next session (Session 15): Create `04_schema.md` — runtime state schema (player state, enemy state, bag state, wave state), save schema (persistence structure matching v31 `diceBoundPlayerData`), event schema skeleton for telemetry

**Schema (Session 15 — `04_schema.md` created):**
- Created new file `04_schema.md` — data contract layer (schema shape only, no mechanics)
- 5 sections:
  - §1 Runtime state schemas (6): PlayerRuntimeState, EnemyRuntimeState, BagRuntimeState, WaveRuntimeState, LevelRuntimeState, UIRuntimeState
  - §2 Config schemas (5): LevelConfig, EnemyArchetypeConfig, BagItemConfig, TreeNodeConfig, FusionRecipeConfig
  - §3 Save/persistence schemas (8): DiceBoundPlayerData + v31-locked keys + v33 additions (EquipmentSaveData, GoldTechTreeSaveData, RuneTrialSaveData, IdleRewardSaveData, auxiliary keys, RunStateSaveData optional)
  - §4 Event schema (telemetry): event envelope + 25+ event types catalog (combat/movement/bag/level/economy/progression/rune trial) + V14/V16 instrumentation specifications + retention policy
  - §5 Schema change rules: versioning protocol, save migration chain from v32, forbidden operations
- 10 unique `{ID}` references, all resolve against `02_balance_values.md` (0 missing after Session 15 fix)

**Migration decisions (Session 15):**
- TypeScript-like pseudo-notation chosen for readability — actual implementation is JavaScript per v31 codebase. Unity port would adapt to C# naming conventions.
- Save-schema field names preserve v31 locks (hp, dmgMin, dmgMax, gold, permanentUpgrades, selectedMap, goldTechTree, diceBoundPlayerData, diceBoundTotalGold, etc.) — renaming = breaking migration, forbidden per §5.3.
- v33 additions tagged clearly: `runeShard`, `runeProgress`, `idleReward`, `goldTechTree.currentLoop`, `goldTechTree.loopCompletions`.
- Mid-run resume `RunStateSaveData` kept Partial per v31 §8.1 status — nice-to-have, not Test Đợt 1 required.
- Event schema is SKELETON — emission progressive, Test Đợt 1 minimum = combat + level + economy events. Full wave_spawned emission required for V16 verification.
- V14 SIRC instrumentation: daily gold aggregation by source (kill/efficiency vs idle_claim) per Main Run tier, formula documented inline.
- Auxiliary save keys kept SEPARATE from diceBoundPlayerData (dicebound_enemy_intro_seen_v1, dicebound_playtest_map) — v31-locked structure.

**Fixed during Session 15 verification:**
- Initial draft used incorrect ID names `DAY_ROUNDS_PER_CYCLE`/`NIGHT_ROUNDS_PER_CYCLE`/`ENEMY_HP_SCALING_PER_LEVEL`/`ENEMY_DMG_SCALING_PER_N_LEVELS` — corrected to canonical `DAY_BLOCK_TURNS`/`NIGHT_BLOCK_TURNS`/`ENEMY_HP_PER_MAIN_LEVEL`/`ENEMY_DMG_SCALING_STEP` + `ENEMY_DMG_SCALING_INTERVAL` + `ENEMY_DMG_SCALING_CAP_BONUS`.

**Cascade:**
- Files touched: `_CHANGELOG.md`, `04_schema.md` (new)
- `02_balance_values.md` unchanged
- `01_rules.md` unchanged
- `03_content.md` unchanged
- Next session (Session 16): Create `06_verification.md` (V1-V18 methodology details — Monte Carlo harness, MO_effective/BO/HO formulas, difficulty scoring extensions, Empty Bag Test) + `07_open_questions.md` (resolve A.7-A.10 power-up structure, Rune Trial timezone, fusion slot accounting, Loop 2+ scaling, V14 SIRC framework-fixed 50% rationale)

**Verification + Open Questions (Session 16 — 2 files created):**

**`06_verification.md` created (9 sections):**
- §1 Verification philosophy — priority order recap from §31.6
- §2 V1-V4 Combat/Stat methodology — Damage Guard baseline/peak + TTK anchors Slime ≥5, Fire ≥3 with exact formulas
- §3 V5-V9 Build architecture methodology — package counting convention, in-run power floor/ceiling bands, Empty Bag Test inverse check (current v32: 1.54× ✓)
- §4 V10-V12 Progression methodology — orthogonality overlap-score matrix, UPI session bands, chance caps runtime assertion
- §5 V13-V17 Dual-currency + meta methodology — DSSM lint check, SIRC 5-tier formula (framework-fixed 50%), Merge T1 supply sufficiency with buffer math, V16 Monte Carlo pass criterion (≤30% DiceBound threshold), MMRM mode registry lint
- §6 V18 Idle out-of-run methodology — 30-day rolling window distinct from V14 SIRC
- §7 Difficulty scoring extensions — FULL MO_effective / BO / HO formulas deferred from rules §19.8, PS_day runtime pressure, variance band recommendation
- §8 Monte Carlo harness specification — requirements, sample size 1000 seeds/level, output format, Partial implementation status
- §9 Verification cadence — 5-tier cadence schedule (code change / balance change / content authoring / playtest / weekly)
- 22 valid `{ID}` references + 1 documentation placeholder (`{SOMETHING_PCT}` as example syntax)

**`07_open_questions.md` created (7 questions tracked):**
- **Closed with v33 INTERIM:**
  - A.8 Selection count = 3 options per popup (matches bag popup)
  - RT-TZ Rune Trial timezone = local device 7:00 (no server infrastructure needed)
  - FUS-SLOT Fusion slot accounting = Model X (consume 2, place 1, net +1 free slot)
- **Deferred with principles:**
  - A.10 Heal %-based variants post-v32 (depends on A.9 resolution)
  - LOOP-2 Tree Loop 2+ scaling (6 principles locked for future authoring: same topology, cost monotonicity, stat stacking, compound cap preserved, unlock gate, save compatibility)
- **NEEDS USER DECISION (blocking full authoring):**
  - A.7 Run structure — Model A (level-based, transient buff) vs Model B (rogue-lite multi-level) vs Model C (permanent meta). v33 recommends Model A. Impacts §28 power-up persistence, Empty Bag Test denominator, UPI computation.
  - A.9 Power-up numeric magnitudes — +dmgMin/+dmgMax not locked in v31/v32 source. v33 recommends +1 flat for each (5-7% effective at Lv1 baseline, 1-2% at peak).
- 3 valid `{ID}` references

**Migration decisions (Session 16):**
- V14 SIRC threshold stays at literal 50% (framework rule, NOT stored as ID). `{OUT_OF_RUN_IDLE_CEILING_PCT}` = 30% is V18, separate concept.
- Monte Carlo harness status Partial — Test Đợt 1 relies on analytic estimates + qualitative playtest. Full harness is post-Đợt-1 priority.
- A.7 flagged as blocking because it determines interpretation of run/session boundaries affecting UPI computation, Empty Bag Test setup, and save schema (RunStateSaveData optional vs required).
- A.9 flagged as blocking because balance values file needs IDs for POWERUP_DMG_MIN_INCREMENT / POWERUP_DMG_MAX_INCREMENT / POWERUP_HEAL_1 / POWERUP_HEAL_2 before content authoring.
- Timezone policy locked as local device time: rejected UTC (awkward global reset) and server time (no infrastructure). Known edge cases (timezone changes, DST) documented as acceptable.
- Loop 2+ 6 design principles documented inline so future author doesn't start from scratch.

**Verification:**
- `06_verification.md`: 22 `{ID}` references verified, 0 missing
- `07_open_questions.md`: 3 `{ID}` references verified, 0 missing (1 fixed mid-session: `TREE_LOOP_1_TOTAL_COST_RS` was incorrect — replaced with prose reference to §16.6)

**Session 16 PATCH — Power-up feature removal (post-Session 16 close):**

User clarified during Session 16 that the "between-level power-up selection" feature was REMOVED during v32 design iteration and is NOT in v33. My Session 6-13 migration incorrectly preserved the v31 power-up mechanic throughout `01_rules.md`, `04_schema.md`, and `07_open_questions.md`. All traces cleaned up in this patch.

**User quote confirming removal:**
> "Chơi xong 1 màn, dù thắng hay thua chỉ hiển thị màn hình kết quả, xem nhận vật phẩm gì, nhận gold và equipment. Đâu có power up gì mang đi."

**v33 confirmed flow (post-patch):**
- Win/Lose → Result table (enemies killed, gold earned, equipment obtained) → banking → Home
- Progression between levels = Home only (Gold Tech Tree + Equipment Upgrade + Equipment Merge)
- 1 level = 1 run (Model A) — HP resets, bag resets, only gold/equipment carry out
- NO transient buffs, NO between-level popups, NO in-run power-ups

**Files modified in patch:**

`01_rules.md`:
- §15.1 Win flow: steps 4-5 rewritten (banking + Home instead of power-up → next level)
- §15.3 in-run state list: removed "In-run power-ups from mystery cells or fusion" bullet; added "Fusion-ready state" bullet
- §15.4 flow invariant: updated wording to remove power-up mention
- §28: FULL SECTION REPLACED with removal notice. Section number 28 preserved for stable numbering. Content now explains v33 has no power-up selection and points to Home progression (Tree/Equipment/Merge).
- §29.1 state table: `WinText` row description updated
- §29.2 `WinText` per-state UI: removed power-up popup, added banking animation
- §29.4 wireframe list: removed "Power-up selection" from missing-wireframe list
- Glossary (top of file): `WinText` entry simplified
- Section map table: §28 status updated
- File header: removed A.7-A.10 from open questions list
- Deferred list (historical): marked power-up as "removed per user confirmation"
- Closing line: updated count (3 open questions remain)

`04_schema.md`:
- §1.1 PlayerRuntimeState: removed `inRunPowerUps: InRunPowerUp[]` field
- §1.1: removed `InRunPowerUp` interface entirely
- §1.6 UIRuntimeState: removed `'power_up_selection'` from activeModal enum

`07_open_questions.md`:
- REWRITTEN. 7 questions → 3 questions.
- Removed A.7 (run structure — resolved as Model A)
- Removed A.8 (selection count — not applicable)
- Removed A.9 (magnitudes — not applicable)
- Removed A.10 (heal pool expansion — not applicable)
- Kept: RT-TZ, FUS-SLOT, LOOP-2
- Added resolution note section explaining the A.7-A.10 removal with user quote

**Files NOT affected (verified clean):**
- `_INDEX.md` — 0 power-up references
- `02_balance_values.md` — 0 power-up references (no IDs were authored)
- `03_content.md` — 0 power-up references
- `06_verification.md` — 0 power-up references (V invariants unaffected)

**Historical entries preserved:**
- `_CHANGELOG.md` Session 10-13 entries keep original text for historical accuracy (they represent what was authored at that time, even if later corrected).

**Verification after patch:**
- `01_rules.md`: 121 unique `{ID}` references, 0 missing. Still 31 sections (§28 is placeholder).
- `04_schema.md`: 10 references, 0 missing.
- `07_open_questions.md`: 1 reference, 0 missing.
- `03_content.md` and `06_verification.md` unchanged and still verify clean.

**Migration lesson (VI commentary):**
Migration process should have validated feature existence during Session 7 rules authoring instead of preserving v31 drafts verbatim. v31 contains many working-draft features that were iterated in v32. Future v33+ migrations should check each v31 feature against v32 source explicitly before preserving. For the current migration, this is the last major scope correction expected — all other major features (Idle, Rune Trial, DSSM, Merge families, Tree loop structure) have been cross-validated against v32 source during authoring.

**Session 17 — Phase 4 cleanup (terminology standardization + cross-reference validation + file structure finalization):**

**Terminology standardization:**
- `01_rules.md` §18.2: "power-item choices" → "bag item choices" (1 fix)
- `01_rules.md` §18.10: "Any power item" → "Any bag item" (1 fix)
- `02_balance_values.md` §33: "power-item pool" → "bag item pool" (1 fix)
- Total: 3 legacy "power item" references updated to canonical "bag item" per `_INDEX.md` glossary rule

**Cross-reference validation:**
- `01_rules.md` §31 V2 enforcement list: removed stale `§28.5` reference (§28.5 no longer exists after Session 16 patch; §28 is now a placeholder)
- Verified no other §28.N subsection references exist (all removed or were never authored)
- All 4 non-placeholder power-up mentions in `01_rules.md` (§28 removal notice) and `07_open_questions.md` (removal documentation) are intentional and acceptable
- `_CHANGELOG.md` historical power-up mentions preserved (24 mentions) — historical accuracy

**File structure finalization:**
- Created `05_ui_and_presentation.md` as THIN POINTER FILE (no rules content of its own; all UI rules stay in `01_rules.md` §29-30)
- Reason for pointer-only design: UI rules ARE game design (player-visible contracts), cannot be cleanly split from gameplay rules without creating two sources of truth. Explicit pointer file prevents `_INDEX.md` broken references and documents scope boundaries.
- Pointer file §1 maps all 20 UI topics to their `01_rules.md` locations (§29-§30)
- Pointer file §2 documents what is NOT in v33 GDD scope: visual design tokens, animation specs, art direction, localization, accessibility, asset management, platform UI — all art/frontend pipeline concerns handled ad-hoc for solo GD workflow

**File header refresh:**
- `01_rules.md`: Session 13 → Session 17 cleanup, notes §28 placeholder status
- `02_balance_values.md`: Session 9 → Session 17 terminology cleanup
- `_INDEX.md`: Status reflects final 9-file structure, file manifest row for `05` updated to describe pointer role, `06_verification.md` description updated V1-V17 → V1-V18

**Verification (final):**
- `01_rules.md`: 121 `{ID}` refs, 0 missing ✓
- `02_balance_values.md`: authoritative, 404 IDs
- `03_content.md`: 41 refs, 0 missing ✓
- `04_schema.md`: 10 refs, 0 missing ✓
- `05_ui_and_presentation.md`: 0 refs (pointer file) ✓
- `06_verification.md`: 22 refs + 1 documentation placeholder (`{SOMETHING_PCT}`), 0 missing ✓
- `07_open_questions.md`: 1 ref, 0 missing ✓
- Total content IDs referenced across all files: 195 unique references, all resolve against `02_balance_values.md` 404 authoritative IDs
- No broken cross-references, no stale §28.N references

**Final v33 file structure (9 files authored):**
```
_INDEX.md                   11 KB   meta + task map + glossary
_CHANGELOG.md               42 KB   append-only history (growing)
01_rules.md                 88 KB   31 sections, 121 IDs
02_balance_values.md        54 KB   33 sections, 404 IDs
03_content.md               26 KB   8 sections, 41 IDs
04_schema.md                23 KB   5 sections, 10 IDs
05_ui_and_presentation.md    5 KB   pointer file
06_verification.md          23 KB   9 sections, V1-V18 methodology
07_open_questions.md         7 KB   3 open questions
-----
279 KB total (vs v31 275 KB single file)
```

**Migration decisions (Session 17):**
- `00_vision.md` NOT authored in v33 — vision lives in `Claude_dicebound-vision-pillars.md` (project source, not migrated). Can be migrated in future session if solo GD wants vision statement in v33 canon.
- Pointer file pattern justified: same rationale as "single source of truth" — split risks drift.
- Terminology cleanup complete. "power item" → "bag item" was the only outstanding term shift from v31. No other legacy term drift found.

**What's left for Sessions 18-23:**
- Session 18: Optional — create `00_vision.md` from existing vision-pillars source if wanted.
- Session 19-20: Duplication audit (if any large blocks repeat across files — estimated minimal based on Session 17 scan showing healthy file separation).
- Session 21: Python lint script — validate `{ID}` references, check for duplicate IDs in `02_balance_values.md`, flag numeric literals in `01_rules.md` that should be IDs.
- Session 22: LLM validation test suite — 15-20 questions targeting 90% accuracy on balance + rules queries.
- Session 23: Archive v31/v32/handoff to `_archive/`, update Project Instructions with v33 reading order, commit tag `v33-initial`.

**Phase 4 COMPLETE with Session 17.** Ahead of schedule — original plan allocated Sessions 17-20 for cleanup; achieved in 1 session because minimal conflict discovered.

**Session 18 — `00_vision.md` migrated from vision-pillars source:**

**File created:** `/mnt/user-data/outputs/00_vision.md` (~15KB).

**Source:** `Claude_dicebound-vision-pillars.md` (09/04/2026 draft — based on GDD v9).

**Structure preserved:**
- 3-tier strategy (Tầng 1 Vision / Tầng 2 Retention / Tầng 3 Monetization) — industry-standard per VentureBeat, MY.GAMES, IdeaPlan, Troy Dunniway references
- 5 Key Pillars (path IS decision / board shows everything / never sits still / every kill feeds build / losing still moves forward)
- Vision statement (70 words EN + VI) + short 30-word version
- Checklist tracking v33 canonical state

**v33 updates applied during migration (stale refs corrected):**

| Item | Source (v9/v31) | v33 |
|---|---|---|
| Gold Tech Tree | 8 nodes / 3 lanes / 1 capstone / 838 gold | 6 nodes / 3 tiers each / ~315 RS per loop / multi-loop |
| Tree currency | gold | Rune Shard |
| Enemy gold bands | Wind 1 / Slime 2 / Worm 4 / Fire 4 | Wind 3 / Slime 8 / Worm+Fire 13 (via `{GOLD_BAND_*}` IDs) |
| Pillar 5 mechanisms | "between-level power-up only on win" | Removed — Rune Shard/Rune Trial/efficiency curve instead |
| Retention table | "Between-level power-up (chỉ khi win)" | Removed; added Rune Trial + Equipment Upgrade/Merge + Idle Reward rows |
| Checklist item 9 | Not in v9 doc | Added: "Between-level power-up removal per Session 16 user confirmation" |
| Short-loop values | Hardcoded numbers (heal 30%) | `{HEAL_POTION_DROP_PCT}%` ID reference |

**Pillar 5 retention note:** Original source framed losing as "not losing everything" and winning as strictly better. v33 keeps this philosophy but the mechanism changed — winning rewards more via efficiency curve (up to `{GOLD_EFFICIENCY_DAY_5_PLUS_PCT}`%) and deeper progress (more kills → more gold/equipment drops), NOT via between-level power-up. Text updated accordingly.

**Feature filter note:** Pillar 5 feature filter now explicitly calls out v31's removed power-up as an example of what WAS weakening the pillar (over-rewarding wins vs losses). This makes the pillar reasoning transparent to future feature proposals.

**Verification:**
- 12 unique `{ID}` references in `00_vision.md`, all resolve against `02_balance_values.md` (0 missing)
- 3-tier structure preserved; pillar count unchanged (5)
- Industry-source references (VentureBeat, MY.GAMES, Dunniway) preserved from original

**Migration decisions (Session 18):**
- Kept both EN and VI vision text for team/stakeholder readability
- Added short ~30-word version for pitch/marketing contexts (Dunniway recommends <50 words; 70 was kept for VI parity)
- Checklist §5 table rewritten to reflect v33 actual lock status (Items 1, 2, 4, 5, 7, 8, 9, 10 = locked; Items 3, 6 = deferred)
- Vision analysis table column "GDD v9" → renamed "v33 mechanism" with direct section references

**Session 19 — Thorough duplication audit:**

Scanned all 9 content files for text duplication AND conceptual overlap. Methodology: (1) per-concept cross-file mention count for 14 key concepts, (2) deep inspection of suspected duplicates (V1 invariants, MO/BO/HO formulas, fusion endpoints, Rune Trial details, Loop 2 principles, §28 removal notice), (3) changelog scan for canonical info that should live in files instead.

**Findings: file separation WORKING CORRECTLY.** No action needed. No file consolidation required.

**Key audit scan results:**

| Concept | rules | balance | content | schema | verify | vision | Assessment |
|---|---|---|---|---|---|---|---|
| Day/Night | 10 | 7 | 1 | 1 | 1 | 5 | Expected spread (rule + values + vision intent) |
| Rune Trial | 22 | 4 | 0 | 1 | 1 | 3 | Concentration in rules §23 is expected (whole mode) |
| Battlefield Bag | 11 | 1 | 1 | 0 | 1 | 1 | Rule-driven; correctly concentrated |
| Damage Guard | 13 | 5 | 3 | 0 | 4 | 0 | Expected — invariant referenced across layers |
| Fusion | 17 | 5 | 3 | 3 | 0 | 0 | Healthy split (rules + balance + content + schema) |
| SIRC | 7 | 6 | 1 | 6 | 6 | 0 | Even distribution (invariant spans all layers) |
| Mystery cell | 10 | 0 | 8 | 0 | 0 | 2 | Content owns behavior; rules owns mechanics |

**Complementary cross-references verified (NOT duplication — different roles):**

1. **V1-V18 invariants** appear in `01_rules.md` §31 (definition, what it protects) AND `06_verification.md` §2-6 (methodology, formula, cadence). Split is intentional — rules = "what is the rule", verification = "how to verify".
2. **MO/BO/HO** appear in `01_rules.md` §19 (names + deferral pointer) AND `06_verification.md` §7 (actual formulas). Explicit deferral link exists in rules text.
3. **Loop 2+ compound cap** appears in `01_rules.md` §27.9 (rule: cap applies across loops) AND `07_open_questions.md` LOOP-2 (principle MUST hold when Loop 2 is authored). Rule vs deferred-principle — different audiences.
4. **Bag items** distributed across `02_balance_values.md` §20 (numeric values), `03_content.md` §3-4 (identity + synergy + edge cases), `01_rules.md` §18/26 (mechanics). Single source of truth per layer.

**Minor duplications identified (acceptable, LEFT AS IS):**

- **§28 placeholder in `01_rules.md`** repeats ~4 lines of Win/Lose flow from `07_open_questions.md` removal note. Tolerable: rules is the implementation guide, open questions is the history. Jumping between files for ~4 lines of context would be worse UX than the mild redundancy.

**Changelog audit — no canonical info misplaced.** Historical FINAL decisions in changelog (e.g., "A.3 resolved: Enemy DMG +5 per 2 main levels") have been properly mirrored into `02_balance_values.md` (table canonical) + `01_rules.md` where applicable. Changelog is purely append-only history as designed.

**Files NOT requiring modification:**
- All 10 files passed audit.
- No text consolidation actions needed.
- No cross-reference additions/removals needed.

**Audit cadence recommendation (future):**
- Re-run this scan when any new file is added to v33.
- Re-run if any file grows >20% in size (potential scope creep).
- Otherwise: quarterly or on major version bump.

**Phase 4 cleanup status:**
- Session 17: terminology standardization + cross-reference validation ✅
- Session 18: `00_vision.md` migration with v33 updates ✅
- Session 19: duplication audit ✅ (no changes required)
- Phase 4 COMPLETE.

**Session 20 preview — `05_ui_and_presentation.md` expansion decision:**
Current `05_*` is a thin pointer file (~5KB, 0 rule content). Session 20 will decide whether to expand it with:
- Visual design token scaffolding (color/font/spacing as placeholder fields)
- Animation timing spec placeholders
- Art direction mood references

Or keep pointer file as-is (recommended for solo GD workflow — art docs belong in Figma/art pipeline, not GDD).

**Session 20 — `05_ui_and_presentation.md` expansion decision:**

**Scan for missing UI/adjacent info:** Compared `05_ui_and_presentation.md` "NOT in scope" list against v32 part2 §10 TBD registry. Found 3 items missing from 05:
- Narrative / Worldbuilding
- Tutorial UX Flow
- Social features

**Decision:** Minimal expansion (Option A). Add 3 missing categories to `05_ui_and_presentation.md` "NOT in scope" list to make 05 the canonical "what's NOT in v33 scope" registry mirroring v32 §10 fully.

**Rationale rejected (Option B — separate registry file):**
- New file would duplicate the indexing burden.
- Items are small (bullet lists, not full specs) — don't warrant own file.
- 05 is already "scope boundary" file by Session 17 design; this is its natural home.

**Expansion content added (~30 lines):**

`### Narrative / Worldbuilding`
- Setting/lore, character identity, enemy narrative hooks, boss narrative, progression narrative, narrative pacing across levels.

`### Tutorial UX flow`
- Session 1 sequencing, mystery/bag/Day-Night/boss first-interaction tutorials, achievement feedback, tooltip-on-first-use policy.

`### Social features`
- Friends/leaderboards, share run highlights, guild/clan, community integrations.

**Other updates:**
- File header status line updated (Session 17 → Session 20).
- "When to expand" section clarified with two explicit options (inline expansion vs new file) + three rationales for keeping the registry (boundary marking, scaling checklist, version-drift prevention).
- Closing line updated: "pointer file + scope boundary registry".
- Lock marker note updated with CL reference to Session 20.

**Coverage map (v33 05 file vs v32 §10 TBD):**

| v32 §10 TBD item | 05 §2 "NOT in scope" section | Status |
|---|---|---|
| 10.1 UI Wireframe | Visual design tokens + Art direction | ✅ Covered |
| 10.2 Audio / SFX | Asset management (Audio design subsection) | ✅ Covered |
| 10.3 Narrative / Worldbuilding | Narrative / Worldbuilding (NEW) | ✅ Added Session 20 |
| 10.4 Monetization | NOT in 05 — lives in `00_vision.md` §3 | ✅ Covered (different file) |
| 10.5 Tutorial UX Flow | Tutorial UX flow (NEW) | ✅ Added Session 20 |
| 10.6 Animation Spec | Animation specifications | ✅ Covered |
| 10.7 Social Features | Social features (NEW) | ✅ Added Session 20 |
| 10.8 Accessibility | Accessibility | ✅ Covered |
| 10.9 Localization | Localization | ✅ Covered |
| 10.10 Boss Detail Design | NOT in 05 — lives in `03_content.md` §2 (placeholder) | ✅ Covered (different file) |

All 10 v32 §10 TBD items now explicitly tracked across v33 files. No silent drops.

**Verification:**
- `05_ui_and_presentation.md` still 0 `{ID}` references (pointer file, no numeric refs needed)
- File grew from ~5KB to ~7KB — still minimal
- No changes required to other files

**Phase 4 cleanup truly complete** (Sessions 17-20). All four planned cleanup types done:
- Session 17: Terminology standardization + cross-reference validation
- Session 18: `00_vision.md` migration with v33 updates
- Session 19: Duplication audit
- Session 20: UI scope boundary expansion

**Session 21 — Python lint script `gdd_lint.py` delivered:**

**Artifact:** `gdd_lint.py` (~500 lines) + `gdd_lint_README.md` (usage guide, ~80 lines). Self-contained — Python 3.8+ stdlib only, no dependencies.

**6 automated checks implemented:**

1. **ID reference validation** — parses `02_balance_values.md` table rows for defined IDs, scans all content files for `{ID}` references, reports mismatches. Whitelist for documentation placeholders (`{SOMETHING_PCT}`, `{ID}`, `{CAPS_WITH_UNDERSCORES}`).
2. **Duplicate ID check** — reports any ID defined twice in balance file.
3. **Numeric literal heuristic** — scans `01_rules.md` for numeric patterns (%, HP, gold, RS, turns, rounds, ticks, minutes, hours, ×) and flags as potential missing IDs. Accepts architectural constants (4 slots, 6 tiers, 2×2 grid, ~0.5s) + version references (Lv1, T3, V14, Session 1) via `NUMERIC_ACCEPTABLE_CONTEXT` whitelist.
4. **Section lock markers** — verifies every `## N. Title` in `01_rules.md` has a `<!-- Locked: v33` marker within the section's line range.
5. **File header consistency** — verifies all files (00-07 + 02) have required header fields: Version, Last updated, Status, Authoritative for.
6. **Cross-file section references** — parses `` `file.md` §N.M `` patterns, verifies target file exists and target section number is defined.

**CLI:**
- `python3 gdd_lint.py [dir]` — run in directory (default: cwd)
- `--strict` — treat warnings as errors (exit 2)
- Exit codes: 0 pass / 1 warnings / 2 errors

**Test results on v33 GDD (2026-04-21):**

| Check | Result | Count |
|---|---|---|
| 1 ID refs | ✅ PASS | 282 refs across 7 files |
| 2 Duplicate IDs | ✅ PASS | 0 duplicates |
| 3 Numeric literals | ✅ PASS | 0 suspicious literals flagged |
| 4 Lock markers | ✅ PASS | 31/31 sections |
| 5 Headers | ✅ PASS | 8/8 files valid |
| 6 Cross-file refs | ✅ PASS | 72 references resolve |

Total: 0 errors, 0 warnings. Strict mode also clean.

**One small fix applied during Session 21:**
- `02_balance_values.md` header used "Authoritative:" instead of "Authoritative for:" — caused Check 5 warning. Standardized to "Authoritative for: All numeric values..." to match sibling files.

**Known limitations (documented in README):**
- Lint does NOT validate semantic correctness of rules (does rule say what you meant?).
- Lint does NOT validate value plausibility (is 200 HP appropriate?).
- Lint does NOT validate cross-system design coherence.
- Lint does NOT validate content balance (do level manifests hit win-rate targets?).
- For these, use Session 22 LLM validation suite + playtest.

**Integration suggestions (in README):**
- Git pre-commit hook: `python3 gdd_lint.py --strict`
- CI pipeline: GitHub Actions example provided
- Cursor workflow: run before pasting GDD into Cursor prompts

**Customization points:**
- `ID_WHITELIST` (constants at top of script) — add doc placeholders
- `NUMERIC_PATTERNS` — add new numeric formats to flag
- `NUMERIC_ACCEPTABLE_CONTEXT` — add new architectural constants (e.g., new enum values, new version markers)

**Phase 5 status:**
- Session 21 ✅ Python lint script
- Session 22 🔲 LLM validation test suite
- Session 23 🔲 Archive + final commit

**Session 22 — LLM validation test suite delivered:**

**Artifact:** `gdd_llm_validation_suite.md` (~500 lines, ~18KB) containing 20 test questions across 7 categories for validating v33 GDD LLM-readability.

**Test design principles:**
1. Each question has definitive verifiable answer in v33 files
2. Coverage of file organization via Task Map
3. Include trap questions where naive/stale-data answers would fail
4. Binary scoring (pass/fail, no partial credit) to prevent rubber-stamping
5. Target ≥ 90% accuracy (18+ / 20)

**Category distribution:**

| Category | Questions | Purpose |
|---|---|---|
| A Balance Lookups | Q1-Q5 | Direct value queries, formula interpolation |
| B Rule Queries | Q6-Q10 | Runtime behavior, state transitions, combat resolution |
| C Cross-System Reasoning | Q11-Q14 | Requires multiple files, architectural distinction |
| D Content Queries | Q15-Q17 | Level composition, entity edge cases, fusion availability |
| E Schema / Implementation | Q18 | Save schema structure for Rune Trial |
| F Vision / Pillars | Q19 | Feature filter exercise against pillars |
| G Trap (anti-confabulation) | Q20 | Post-Win flow — trap for v31 power-up stale info |

**Difficulty distribution:** ~30% Easy, ~50% Medium, ~20% Hard (Q3 interpolated balance, Q7 combat order, Q11 SIRC vs V18, Q14 ownership models, Q20 trap).

**Key questions by strategic value:**

- **Q2, Q20:** Anti-confabulation trap. v31 had gold bands Wind 1/Slime 2/Worm 4/Fire 4 AND power-up feature. v33 has gold bands 3/8/13/13 AND NO power-up. LLM must use v33 files over training data.
- **Q11:** Tests understanding that V14 SIRC threshold 50% is framework-fixed (NOT stored as ID) while V18 threshold 30% IS stored as `OUT_OF_RUN_IDLE_CEILING_PCT`. Common mistake: conflating them.
- **Q13:** Tests cross-file reasoning chain (content change → rules check → verification → changelog). Requires following Task Map fully.
- **Q14:** Tests Equipment Upgrade (SLOT-based) vs Equipment Merge (PIECE-based) ownership distinction. Designed to catch "which stat travels with piece vs stays with slot" confusion.
- **Q19:** Pillar filter exercise — "auto-route player" feature must be REJECTED per Pillar 1. Tests designer reasoning, not just lookup.

**Expected failure modes documented (for diagnosis):**
1. **Stale v31 info leak** — LLM pulls from training data despite v33 files (affects Q2, Q20 specifically)
2. **Cross-file reasoning gap** — LLM answers from first file only, misses cross-references (Q11, Q13)
3. **Architectural vs tunable confusion** — ownership models conflated (Q5, Q14)
4. **Deferred vs locked confusion** — LLM treats deferred items as locked (Q17, Q4)

**Design tenet:** Test suite validates FILES, not LLMs. If multiple LLMs fail same question, the file is at fault (ambiguity to fix). If one LLM fails a clear question, LLM is at fault.

**Maintenance protocol:**
- Re-run after major v33 file changes (balance retune, new content, rule update)
- Add new questions for new features in future sessions
- Questions consistently failing across LLMs → flag as GDD ambiguity, fix in files

**Known limitations (not tested by suite):**
- Aesthetic/subjective quality of answers (covered only via playtest)
- Creative problem-solving (e.g., "design a new bag item")
- Long-context scaling (suite fits in typical context window)
- Multi-turn conversation consistency

**Suite not run in Session 22.** This session delivers the TEST DESIGN, not test results. User should run the suite against 1-2 LLMs (e.g., Claude Opus 4.7 + GPT-5 for cross-check) to establish baseline accuracy. Record results in suite §Scoring template.

**Phase 5 status:**
- Session 21 ✅ Python lint script (PASS 0/0 errors/warnings on v33)
- Session 22 ✅ LLM validation test suite (20 questions designed)
- Session 23 🔲 Archive + final commit

**Session 23 — Final session: archive plan + project instructions + migration complete:**

**Artifacts delivered:**
- `project_instructions_v33.md` — Ready-to-paste Claude Project Custom Instructions with anti-confabulation guidance, terminology locks, "features NOT in v33" list, Task Map reference, tooling references
- `_migration_summary_v33.md` — Full migration retrospective (23 sessions, 6 phases), archive plan, metrics, lessons learned, user action checklist (immediate / short-term / medium-term / long-term)

**Migration status:** ✅ COMPLETE. v33 is canonical DiceBound GDD.

**Final deliverable count:**
- 10 canonical v33 GDD files (279 KB)
- 3 tooling artifacts (lint + README + validation suite)
- 1 setup artifact (project instructions)
- 1 migration summary
- Total: 15 files, ~340 KB (vs v31 single 275 KB monolith)

**Archive plan summary** (per `_migration_summary_v33.md`):

Files to REMOVE from active Project Knowledge (move to separate archive OR delete):
- Category A: v31/v32 source files (3 files)
- Category B: Handoff logs (2 files)
- Category C: Framework + workflow docs (13 files)
- Category D: Research/reference docs (8 files)
- Total: ~26 files to archive

Critical rule: v31/v32 files must NOT stay in active DiceBound Project Knowledge. They will pollute context and cause stale-info leaks (Q20 trap scenario in validation suite).

**Project Instructions key content** (for Claude UI Custom Instructions field):
- Source of truth directive: v33 files only, never v31/v32
- Reading order per task (via Task Map in `_INDEX.md`)
- Terminology locks: "bag item" not "power item", run definition, SIRC/DSSM/MMRM acronyms
- Features NOT in v33: between-level power-up, v31 gold bands, v31 tree topology, gold as tree currency
- ID reference syntax guidance
- Change workflow: file identification → invariant check → cascade analysis → lint
- Feature filter via 5 pillars
- Open questions status (RT-TZ / FUS-SLOT / LOOP-2)
- Tooling references (lint + validation suite)
- Ask-before-confabulate rule

**Verification test** (for user post-setup):
Run new conversation, ask "What's the gold band for a Worm enemy?" Expected: `GOLD_BAND_HIGH` = 13. Failure: stale v31 "4 gold" → archived files still polluting context.

**User action checklist** (from `_migration_summary_v33.md`):

Immediate:
1. Download 15 deliverables
2. Upload 10 canonical + 3 tooling to Project Knowledge
3. Remove 26 v31/v32/framework files from Project Knowledge
4. Paste `project_instructions_v33.md` into Claude Project Custom Instructions

Short-term:
5. Run `gdd_lint.py --strict` to confirm clean state
6. Run LLM validation suite, target ≥90% accuracy
7. Resolve 3 open questions via playtest

Medium-term:
8. Build Cursor prototype using v33 files
9. Log GDD ambiguity during prototype → fix in files, re-run lint
10. Git tag `v33-initial`

Long-term:
11. Playtest observations on V16 wave stacking, V10 Merge-only test, G1/G2/G3 gates
12. Draft Loop 2+ per principles
13. Plan v34 only if structural changes needed

**Lessons learned** (from `_migration_summary_v33.md` §Lessons learned):
1. Always cross-validate v31 features against v32 before preserving (Session 16 power-up cost 1 patch session)
2. Compressed timelines work when audit passes are thorough (Phases 4-5 finished under budget)
3. Pointer files prevent index drift (`05_*` as thin pointer, not separate rules source)
4. Separate "what IS in scope" from "what is NOT in scope" (registry of deferred items)
5. Framework-fixed values belong in rules, not balance (V14 SIRC 50% stays as literal)
6. Anti-confabulation traps essential in LLM test suites (Q2, Q20 catch stale-data leaks)

**Key metrics:**
- 23 sessions
- 398+ balance IDs
- 31 rule sections across 4 Parts
- 282 cross-file `{ID}` references (0 missing)
- 72 cross-file section references (0 broken)
- 18 cross-system invariants defined
- 100% lint pass rate on v33
- 7 open questions → 3 remaining (3 with v33 interim, 4 deleted via Session 16 power-up removal)
- 1 major feature correction applied (power-up removal)

**MIGRATION COMPLETE. v33 is canonical. Ready for Cursor prototype + playtest.**

**Tag:** `v33-initial`
**Date:** 2026-04-21
**Total:** Sessions 1-23, 6 phases (Balance / Rules / Content+Schema+Verify / Cleanup / Tooling+Test / Archive)

**Cascade:**
- Files touched: `_CHANGELOG.md`, `project_instructions_v33.md` (new), `_migration_summary_v33.md` (new)
- No v33 GDD files modified — all canonical files at stable state
- No future sessions planned under v33 migration scope

**Cascade:**
- Files touched: `_CHANGELOG.md`, `_INDEX.md`, `gdd_llm_validation_suite.md` (new)
- No v33 GDD files modified
- Next session (Session 23): Final migration — archive v31/v32/handoff to `_archive/`, update Project Instructions with v33 reading order, commit tag `v33-initial`

**Cascade:**
- Files touched: `_CHANGELOG.md`, `_INDEX.md`, `02_balance_values.md` (header fix), `gdd_lint.py` (new), `gdd_lint_README.md` (new)
- Next session (Session 22): LLM validation test suite — 15-20 test questions covering balance lookups, rule queries, cross-system reasoning; target 90% accuracy when fed `_INDEX.md` + relevant task files per `_INDEX.md` §3 Task Map

**Cascade:**
- Files touched: `_CHANGELOG.md`, `_INDEX.md`, `05_ui_and_presentation.md`
- No other files modified
- Next session (Session 21): Python lint script — validate `{ID}` references automatically across all 10 files, check for duplicate IDs in `02_balance_values.md`, flag numeric literals in `01_rules.md` that should reference IDs

**Cascade:**
- Files touched: `_CHANGELOG.md` (this entry only)
- No other files modified — audit found no issues requiring fixes
- Next session (Session 20): `05_ui_and_presentation.md` expansion decision (low-stakes; may be a quick session)

**Cascade:**
- Files touched: `_INDEX.md` (file manifest update + status), `_CHANGELOG.md`, `00_vision.md` (new)
- Files unchanged: `01_rules.md`, `02_balance_values.md`, `03_content.md`, `04_schema.md`, `05_ui_and_presentation.md`, `06_verification.md`, `07_open_questions.md`
- Next session (Session 19): Thorough duplication audit — check rule text + ideas repeated across files (text scan in Session 17 was preliminary; deeper audit looks at conceptual overlap, not just string matches)

**Cascade:**
- Files touched: `_CHANGELOG.md`, `_INDEX.md`, `01_rules.md`, `02_balance_values.md`, `05_ui_and_presentation.md` (new)
- Files unchanged: `03_content.md`, `04_schema.md`, `06_verification.md`, `07_open_questions.md`

**Cascade:**
- Files touched: `_CHANGELOG.md`, `06_verification.md` (new), `07_open_questions.md` (new)
- `02_balance_values.md` unchanged
- `01_rules.md` unchanged (but has 7 flagged markers that will resolve as open questions close)
- `03_content.md` unchanged
- `04_schema.md` unchanged
- **User input requested:** A.7 (run structure model A/B/C) + A.9 (power-up magnitudes). These should be answered before Sessions 17-20 cleanup begins, OR resolved inline during Session 17 if user decides as-you-go.
- Next session (Session 17): Phase 4 cleanup begins. Terminology standardization across all files (find-replace "power item" → "bag item", etc.), duplication audit, start `05_ui_and_presentation.md` if §29-30 in rules doesn't fully cover it.

**Cascade:**
- Files touched: `_INDEX.md`, `_CHANGELOG.md`, `02_balance_values.md`
- v31 + v32 files slated for `_archive/` after Session 23 validation
- Verification deferred to `06_verification.md` (Session 16)
