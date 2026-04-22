# DiceBound Verification — v33

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 16 — new file)
- **Status:** ✅ Drafted. Methodology specifications for V1-V18 invariants from `01_rules.md` §31.
- **Authoritative for:** HOW each invariant is verified (methodology, formulas, thresholds, pass/fail criteria, cadence).
- **NOT authoritative for:** Invariant definitions themselves (see `01_rules.md` §31), numeric values (see `02_balance_values.md`).

---

## Reading rules

1. Every verification check is tagged V1-V18, matching `01_rules.md` §31.
2. Formulas use plain pseudo-math; variables reference either balance value IDs (`{SOMETHING_PCT}`) or runtime state (e.g., `player_EHP`).
3. Thresholds: "PASS" is the acceptable band. Anything outside triggers either a bug fix or a tuning proposal.
4. Cadence: when each check runs — on code change, on content authoring, on playtest, or continuously at runtime.

---

## Section map

| § | Topic | Scope |
|---|---|---|
| 1 | Verification philosophy | Why these invariants matter, priority order recap |
| 2 | V1-V4 Combat/Stat methodology | Damage Guard + TTK anchors |
| 3 | V5-V9 Build architecture methodology | Package budget + in-run power bands + Empty Bag Test |
| 4 | V10-V12 Progression methodology | Orthogonality + UPI + chance caps |
| 5 | V13-V17 Dual-currency + meta methodology | DSSM integrity + SIRC + Merge supply + Wave stacking + MMRM |
| 6 | V18 Idle out-of-run methodology | 30-day window ratio |
| 7 | Difficulty scoring extensions | Full MO_effective / BO / HO formulas + variance bands |
| 8 | Monte Carlo harness specification | Simulator requirements + sample size + seed management |
| 9 | Verification cadence | When to run which check |

---

## 1. Verification philosophy

Verification prevents silent drift between design intent and implementation. Every invariant in `01_rules.md` §31 has:

- A **definition** — what it protects (in §31).
- A **methodology** — how to confirm it holds (this file).
- A **threshold** — what numbers constitute PASS vs FAIL.
- A **cadence** — when to check.

When an invariant fails, treat it as a **bug**, not a tuning opportunity. Either the rule is wrong (update §31) or the implementation is wrong (fix code). Changing the threshold to hide a failure is forbidden.

**Priority order (from `01_rules.md` §31.6):** Combat/Stat → Chance caps → Currency → MMRM → Build architecture → Quantitative thresholds. Higher-priority failures block release; lower-priority failures can be tracked as known-issues if impact is minor.

---

## 2. V1-V4 Combat/Stat methodology

### 2.1 V1 — Damage Guard at baseline

**Check:** Fresh-new-game player state (Equipment Lv1 auto-equipped, empty bag, Tree Loop 1 not started).

**Formula:**
```
gap = player_dmg_max - player_dmg_min
ratio = player_dmg_min / player_dmg_max

PASS if: 
  gap ≤ {DAMAGE_GUARD_MAX_GAP}
  AND ratio ≥ {DAMAGE_GUARD_MIN_RATIO_PCT} / 100
```

**Current v33 values:** Player baseline = 20 HP, dmgMin 15, dmgMax 20. Gap = 5. Ratio = 0.75. Framework caps: gap ≤ 20, ratio ≥ 0.5. ✅ PASS.

**Cadence:** On any change to `PLAYER_DMG_MIN_BASELINE`, `PLAYER_DMG_MAX_BASELINE`, or Equipment Lv1 baseline bonuses.

### 2.2 V2 — Damage Guard at max progression

**Check:** Peak progression state (Equipment Lv20 × 4 slots + Tree Loop 1 full + Merge T5/T6 all 4 slots + full bag of best-case items).

**Formula:** Same as V1, applied to peak effective stats.

**Current v32 part2 §1.5 verification:** Gap 4 / Ratio 90.7% ✅ PASS.

**Cadence:** On any change to Equipment per-level scaling, Tree tier values, Merge tier stats, or bag item magnitudes affecting DMG.

### 2.3 V3 — TTK Slime anchor

**Check:** Fresh-new-game player takes ≥ 5 hits from Slime Lv1 before dying.

**Formula:**
```
slime_dmg_avg = (SLIME_LV1_DMG_MIN + SLIME_LV1_DMG_MAX) / 2
hits_to_kill_player = ceil({PLAYER_HP_BASELINE} / slime_dmg_avg)

PASS if: hits_to_kill_player ≥ 5
```

**Current v33 values:** Slime Lv1 avg DMG = (30+40)/2 = 35. Player HP = 200. Hits = ceil(200/35) = 6. ✅ PASS (margin of 1 hit).

**Cadence:** On any change to `SLIME_LV1_*`, `PLAYER_HP_BASELINE`, or enemy scaling formula affecting Slime.

### 2.4 V4 — TTK Fire anchor

**Check:** Fresh-new-game player takes ≥ 3 hits from Fire Lv1 before dying.

**Formula:**
```
fire_dmg_avg = (FIRE_LV1_DMG_MIN + FIRE_LV1_DMG_MAX) / 2
hits_to_kill_player = ceil({PLAYER_HP_BASELINE} / fire_dmg_avg)

PASS if: hits_to_kill_player ≥ 3
```

**Current v33 values:** Fire Lv1 avg DMG = (50+60)/2 = 55. Player HP = 200. Hits = ceil(200/55) = 4. ✅ PASS (margin of 1 hit).

**Cadence:** On any change to `FIRE_LV1_*`, `PLAYER_HP_BASELINE`, or enemy scaling formula affecting Fire.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 3. V5-V9 Build architecture methodology

### 3.1 V5 — Build Completion Budget

**Check:** A full build requires 2-3 "packages" summed across layers.

**Package counting convention:**
- Tree Loop 1 complete = 1 package.
- Equipment Lv20 on all 4 slots = 1 package.
- Merge Tier T5+ (all 4 slots same family) = 1 package.
- Full bag + 1 fusion endpoint = 1 package.

**Max theoretical:** 4 packages if all fully completed simultaneously.

**Design target:** 2-3 packages is the mature-build range. 4 packages is endgame edge case acceptable at Session 30+.

**Cadence:** On any change that could inflate a single layer's power contribution.

### 3.2 V6 — No single permanent layer = 1 full package alone

**Check:** Compute UPI contribution per layer:
```
tree_upi_contribution = sum of all tree stat effects × weights
equipment_upi_contribution = similarly
merge_upi_contribution = similarly

PASS if: 
  tree_upi / total_permanent_upi < 1.0 × package_unit_upi
  equipment_upi / total_permanent_upi < 1.0 × package_unit_upi
  merge_upi / total_permanent_upi ≈ 1.0 × package_unit_upi (Merge intentionally = 1 at T6)
```

`package_unit_upi` = UPI delta between "has 1 package" and "has 0 packages" on reference build.

**Note:** Merge at T6 may reach 1 full package — this is the designed exception per v31 roadmap. Tree and Equipment individually must stay below 1.

### 3.3 V7 — In-run power floor ≥ 25%

**Formula:**
```
for each progression_stage in [fresh, session_5, session_10, session_15, session_25]:
  ratio = (bag_upi + fusion_upi) / total_upi_at_stage
  PASS if: ratio ≥ {IN_RUN_POWER_FLOOR_PCT} / 100
```

Stage-specific UPI computed using reference-player state at each checkpoint.

### 3.4 V8 — In-run power ceiling ≤ 40%

**Formula:**
```
for session_25+ stages:
  ratio = (bag_upi + fusion_upi) / total_upi_at_stage
  PASS if: ratio ≤ {IN_RUN_POWER_CEILING_PCT} / 100
```

V7 and V8 together constrain bag contribution to 25%-40% of total power — wide enough for build variation, narrow enough to keep permanent progression meaningful.

### 3.5 V9 — Empty Bag Test (inverse invariant)

**Check:** Player with full permanent progression + EMPTY bag cannot trivially clear late-game levels.

**Formula:**
```
player_upi_no_bag = tree_upi + equipment_upi + merge_upi  // no bag
enemy_upi_lv10 = sum over Lv10 enemies of (hp × dmg_avg)

PASS if: player_upi_no_bag / enemy_upi_lv10 < 1.8
```

**Current v32 verification:** 1.54× ✅ PASS (within 0.26 of threshold).

**Interpretation:** If test fails (ratio ≥ 1.8), permanent progression alone can clear Lv10 — V7 is broken, bag is cosmetic, rogue-lite tactical depth collapses.

**Cadence:** Mandatory on ANY change to permanent progression values.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 4. V10-V12 Progression methodology

### 4.1 V10 — Layer orthogonality

**Check:** Each permanent layer contributes distinct stat profile.

**Method:** Overlap-score matrix across layers:
```
for each (layer_A, layer_B) pair:
  shared_stats = intersection of stat targets
  overlap_score = sum(magnitude overlap) / sum(layer_A magnitudes)
  PASS if: overlap_score < 0.5
```

**Current v33 known overlap:** Tree HP vs Equipment Helmet/Armor HP (both provide flat HP). Accepted per `DB_Balance_Framework_06_Progression.md` §2 — Tree is "everyone gets this floor," Equipment is "slot investment." Overlap intentional and bounded.

**FLAG:** Equipment Merge family bias vs Bag family identity remains the highest-risk overlap. Requires playtest verification — "Merge-only test" (T6 all slots + empty bag): player should NOT reach mid-to-late content easily. If playtest shows Merge alone dominates, V10 is broken.

### 4.2 V11 — UPI ratio in session-stage bands

**Formula:**
```
player_UPI = sum(player stats × weights)
enemy_UPI = sum(expected enemy stats at level × weights)
ratio = player_UPI / enemy_UPI

For Session 5 reference checkpoint:
  PASS if: {UPI_RATIO_EARLY_MIN} ≤ ratio ≤ {UPI_RATIO_EARLY_MAX}

For Session 10:
  PASS if: {UPI_RATIO_MID_MIN} ≤ ratio ≤ {UPI_RATIO_MID_MAX}

For Session 15+:
  PASS if: {UPI_RATIO_LATE_MIN} ≤ ratio ≤ {UPI_RATIO_LATE_MAX}
```

**Current v32 verification bands passed at 1.82× / 2.56× / 2.86× across checkpoints.

### 4.3 V12 — Chance caps respected

**Runtime check** (not just design-time):
```
for each combat resolution:
  assert effective_crit_chance ≤ {CHANCE_CAP_CRIT_PCT} / 100
  assert effective_block_chance ≤ {CHANCE_CAP_BLOCK_PCT} / 100
  assert effective_double_strike_chance ≤ {CHANCE_CAP_DOUBLE_STRIKE_PCT} / 100
  assert effective_lifesteal ≤ {CHANCE_CAP_LIFESTEAL_PCT} / 100
```

Combat engine must clamp these values after all multiplicative stacking. Test via unit test: construct worst-case stacking scenario (full Precision merge + Keen Eye Lv3 + Hunter Guard fusion + Tree bonuses) and assert effective crit ≤ 50%.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 5. V13-V17 Dual-currency + meta methodology

### 5.1 V13 — Dual-currency integrity (DSSM audit)

**Check:** No mixed-currency reward tables.

**Method:** Static audit of all reward configs:
```
for each reward_config:
  if source == 'main_run':
    assert reward.runeShard == 0 AND reward.rsOnly == false
  if source == 'rune_trial':
    assert reward.gold == 0 AND reward.equipmentDrop == false
  if source == 'idle':
    assert reward.runeShard == 0  // idle grants gold + equipment, not RS
```

**Pass criterion:** ZERO cross-contamination findings.

**Cadence:** On any new reward table authoring; automated lint check (Session 21).

### 5.2 V14 — SIRC pass at 5 tiers

**Formula:**
```
for each tier in [Lv1, Lv3, Lv5, Lv7, Lv10]:
  idle_daily_gold = ticks_per_day × gold_per_tick_at_tier
  active_daily_gold = avg_runs_per_day × gold_per_run_at_tier
  
  ratio = idle_daily_gold / active_daily_gold
  PASS if: ratio ≤ 0.50  // framework-fixed, not stored as ID
```

**Constants:**
- `ticks_per_day` = `{IDLE_DAILY_TICKS_TARGET}` = 240 (per v33 design intent 3-session rhythm).
- `gold_per_tick_at_tier` from `02_balance_values.md` §14.2.
- `avg_runs_per_day` = 3 (per v33 session rhythm assumption).
- `gold_per_run_at_tier` computed from kill composition at that level + efficiency bonus at expected Day-depth.

**Current v32 verification:** 19%-45% range across 5 tiers ✅ PASS (strict framework ≤50%).

**Note:** The 50% threshold is NOT stored as `{OUT_OF_RUN_IDLE_CEILING_PCT}` (that ID = 30% and refers to V18). V14 SIRC uses literal 50% per framework rule.

### 5.3 V15 — Merge T1 supply sufficiency

**Formula:**
```
target_tier = 5  // "full build" definition per v32 §7.2
pieces_needed_per_slot = 3^(target_tier - 1) = 3^4 = 81
buffer = 1.5
pieces_needed = pieces_needed_per_slot × 4 slots × buffer = 486

pieces_per_30_days = 
  (active_run_drops_per_day × days) + 
  (idle_equipment_drops_per_day × days)

PASS if: pieces_per_30_days ≥ pieces_needed
```

**Current v32 verification:**
- Active drops: ~660 T1/30 days (20% drop × 22 enemies × 5 runs × 30)
- Idle drops: ~216 T1/30 days (3% × 240 ticks × 30)
- Total: ~876 T1 / 30 days
- Required for T5: 720 pieces (after buffer) → 876/720 = 122% ✅ PASS
- Required for T6: 2,178 pieces → 876/2178 = 40% ❌ FAIL at T6 (acceptable — T6 is post-expansion aspiration per v32)

### 5.4 V16 — Wave Stacking Stress Test

**Method:** 1000-seed Monte Carlo simulation per level.

**Simulator requirements** (see §8 for harness spec):
- Day-block spawn gate (waves spawn only at first Player turn of each Day block).
- Overlap tracking (waves don't wait for previous to clear).
- Lowest proposed DPS build per level tier (worst-case player).
- Median dice rolls + median bag/mystery drops (controlled RNG).

**Formula:**
```
for each level in [Lv1..Lv10]:
  simulate 1000 seeds of Day 1-5 sequences
  count_fail = count of seeds where active_waves_count ≥ 3 at any turn in Day 3 block
  pct_fail = count_fail / 1000

  PASS if: pct_fail ≤ {WAVE_STACK_DAY_3_MAX_PCT} / 100  // DiceBound ≤30%
```

**Current v32 estimates** (analytic, not full Monte Carlo — full run requires implementation):

| Level | 3-stack risk Day 3 | Status |
|---|---|---|
| Lv1 | ~0% | ✅ PASS |
| Lv2 | ~5% | ✅ PASS |
| Lv3 | ~25% | ✅ PASS |
| Lv4 | ~30% | ⚠️ at threshold |
| Lv5 | ~45% | ❌ FAIL (playtest priority) |
| Lv6 | ~40% | ❌ FAIL (playtest priority) |
| Lv7 | ~30% | ⚠️ at threshold |
| Lv8 | ~40% | ❌ FAIL (playtest priority) |

**Fallback if playtest confirms failures:** reduce enemy counts at Lv5-8 by ~20% in Đợt 2 (Option B in DB_Tuning_Proposals).

### 5.5 V17 — Mode Role uniqueness (MMRM)

**Check:** Static audit:
```
for each mode in modes_registry:
  assert exactly_one_role_tag(mode)
  
primary_drivers = [m for m in modes if m.role == 'primary_progression_driver']
PASS if: len(primary_drivers) == 1
```

**Current v33 roles:**
- Main Run = `primary progression driver` ✅ (unique).
- Rune Trial = `currency faucet`.
- Idle Reward = `supplemental passive`.

Pass criterion met by design.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 6. V18 Idle out-of-run methodology

**Check:** Over a 30-day rolling window, Idle-sourced permanent progression ≤ 30% of total out-of-run progression.

**Formula:**
```
idle_upi_gained_30d = sum of permanent UPI gained via idle-sourced gold/equipment over 30 days
active_upi_gained_30d = sum of permanent UPI gained via active-run sources over 30 days

total_out_of_run_upi_gained = idle_upi_gained_30d + active_upi_gained_30d

PASS if: idle_upi_gained_30d / total_out_of_run_upi_gained ≤ {OUT_OF_RUN_IDLE_CEILING_PCT} / 100
```

**Current v32 verification:** 20% ✅ PASS (comfortable margin under 30%).

**Distinction from V14 SIRC:**
- V14 SIRC: daily gold income ratio (idle vs active).
- V18: 30-day accumulated permanent progression power ratio.

Both must pass independently — V14 measures the flow, V18 measures the stock.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 7. Difficulty scoring extensions (V1.3.0 formulas)

Deferred from `01_rules.md` §19.8, these are the exact formulas for MO_effective, BO, HO, and supporting scores.

### 7.1 MO_effective (Mystery Opportunity)

Relief score capturing mystery cell availability, including carry-over mysteries from prior waves.

**Base density score:**
```
mysteryDensity = mysteryCellCountInWave / enemyCountInWave

MO_base = 
  0 if mysteryDensity == 0
  1 if 0 < mysteryDensity ≤ 0.34
  2 if 0.34 < mysteryDensity ≤ 0.75
  3 if mysteryDensity > 0.75
```

**Carry-over adjustment:**
```
carryOverMysteryBonus =
  0 if no mystery persisted from previous wave, OR persisted mystery not tactically relevant
  1 if mystery persisted AND reachable/tactically relevant
```

**Effective score:**
```
MO_effective = min(3, MO_base + carryOverMysteryBonus)
```

### 7.2 BO (Battlefield Bag Opportunity)

Scored heuristically, not via exact odds engine. Measures meaningful build progress per wave.

```
BO = 
  0 if wave opens no meaningful build progress
  1 if wave opens 1 meaningful build step
  2 if wave opens a strong build progress window
```

**"Meaningful build step" examples:**
- Fills a critical missing slot.
- Upgrades existing item in right direction.
- Makes significant progress toward Lv3.
- Creates a fusion-ready state.
- Completes a fusion endpoint.
- Provides timely recovery item before next wave.

**Probability weighting (v1.1 extension):**
```
BO_weighted = BO_base × P(useful_offer_this_wave)
```

Where `P(useful_offer_this_wave)` = probability-weighted estimate based on bag offer weight tables (`02_balance_values.md` §33) and current bag state.

For heuristic scoring during content authoring, designers may use BO_base directly and document in review notes why score is elevated.

### 7.3 HO (Heal Opportunity)

```
HO = 
  0 if wave has essentially no realistic heal-route value
  1 if wave has moderate kill-order / sustain value
  2 if wave has many enemies easily convertible to meaningful heal-routes
```

**Probability weighting:**
```
HO_expected_heal = expected_kills × {HEAL_POTION_DROP_PCT}/100 × heal_magnitude_pct × max_hp × pickup_probability
```

`pickup_probability` depends on potion placement relative to player path — for scoring, assume 0.6-0.8 based on map density.

**Constraint:** HO is a *small relief term*. Cannot justify a hopeless level on the assumption that heal drops will compensate — that's RNG dependence, not design.

### 7.4 Full difficulty scoring chain

```
RawCombatPressure = ESP + ECP + TPP + RR
GrowthRelief = MO_effective + BO + HO
waveDifficulty = max(0, RawCombatPressure - GrowthRelief)
levelDifficulty = round(avg(waveDifficulty across waves)) + WCP + LPR
```

**Component scores:**
- ESP = Enemy Stat Pressure per wave (threat band per enemy vs current player UPI).
- ECP = Enemy Count Pressure.
- TPP = Tempo/Phase Pressure (Day/Night exposure during wave).
- RR = Readability Risk.
- WCP = Wave Count Pressure (0 if 1-2 waves, 1 if 3-4 waves, 2 if 5+ waves).
- LPR = Layout/Placement Risk (0-2 per designer judgment).

### 7.5 PS_day — overlap-aware runtime pressure

Per `01_rules.md` §19.10, at start of each Day block's first Player turn:

```
PS_day = Σ over all active waves of: (enemy_DMG_i × count_remaining_i) / player_EHP
```

Computed at RUNTIME, unlike the authoring-time heuristic scores above. Compared to PS_day target bands (`02_balance_values.md` §26) to flag levels drifting outside intended tier.

### 7.6 Variance band recommendation (v1.1 extension)

v1.3.0 scores are single numbers. DiceBound's multi-layer RNG creates high variance, so designers should accompany scores with a P25-P75 band where feasible:
- P25 = 25th percentile outcome (favorable RNG).
- P75 = 75th percentile outcome (unfavorable RNG).

If P75-P25 spread is larger than 2 difficulty tiers, the wave is high-variance and needs either RNG dampening (via mystery/bag floor) or explicit warning in design notes.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 8. Monte Carlo harness specification

Required for V16 Wave Stacking Stress Test and optional for difficulty variance estimation.

### 8.1 Harness requirements

- **Deterministic seeding:** every seed produces reproducible output. Store seed in telemetry event for replay.
- **Day-block spawn gate:** simulator ticks through Day blocks (`{DAY_BLOCK_TURNS}` Day + `{NIGHT_BLOCK_TURNS}` Night turns per block) and checks spawn eligibility only at first Player turn of each Day block.
- **Wave overlap:** waves spawn regardless of previous-wave clear state.
- **Active wave tracking:** record `active_waves_count` at every turn; keep max value per run.
- **Player build configuration:** parameterized — simulator accepts a build profile (Tree state, Equipment levels, Merge tier, bag composition).
- **RNG controls:** median dice rolls for combat; seed-controlled for drops (bag offers, heal potion, equipment drop).

### 8.2 Sample size

- `{MONTE_CARLO_SAMPLE_SIZE}` = 1000 seeds per level per build profile.
- Per-level total run time: estimated ~5-10 minutes on modern hardware for pure simulation (no rendering).

### 8.3 Output format

Per-level report:
```
{
  level: 5,
  build_profile: "lowest_dps_lv5",
  total_seeds: 1000,
  failures: {
    V16_wave_stacking: 450,  // count of seeds with ≥3 active waves at Day 3
    V16_pct: 45.0,           // percentage
    V16_pass: false          // > 30% threshold
  },
  variance: {
    day_depth_reached_p25: 3,
    day_depth_reached_p50: 4,
    day_depth_reached_p75: 5
  }
}
```

### 8.4 Harness implementation status

**Partial** — no live Monte Carlo harness exists at v33 authoring time. v32 part2 §7.3 estimates are ANALYTIC approximations. Full harness implementation is post-Test-Đợt-1 priority.

**Test Đợt 1 mitigation:** playtest observation covers V16 qualitatively (human-rated frustration at Lv5/Lv6/Lv8 checkpoints). If playtest confirms frustration → trigger Đợt 2 Option B (reduce enemy counts 20%).

<!-- Locked: v33 | Last changed: v33 | CL: — Harness implementation Partial -->

---

## 9. Verification cadence

### 9.1 On every code change (automated where possible)

- V1, V2 Damage Guard (unit tests with reference values).
- V12 Chance caps (unit test: worst-case stacking scenario).
- V13 Dual-currency integrity (lint check on reward configs).
- V17 MMRM (lint check on mode registry).

### 9.2 On any balance value change

- Re-run V1-V4 if combat stats change.
- Re-run V7-V9 if permanent progression values change.
- Re-run V11 if UPI-contributing values change.
- Re-run V14 if gold income/cost values change.
- Re-run V15 if drop rates or merge costs change.
- Re-run V18 if idle or main-run gold/UPI rates change.

### 9.3 On content authoring (new levels or content)

- Score levels using §7 chain (RawCombatPressure + GrowthRelief → waveDifficulty → levelDifficulty).
- Compare against PS_day target bands for level's tier.
- Run V16 Wave Stacking Stress Test once Monte Carlo harness exists.
- Flag anti-frustration gates G1/G2/G3 (per `01_rules.md` §20).

### 9.4 On playtest observation (qualitative supplements)

- V9 Empty Bag Test feel (does empty-bag run feel hopeless at Lv10?).
- V10 layer orthogonality feel ("Merge-only test" with T6 same family + empty bag — player should NOT breeze through).
- V16 wave stacking frustration at Lv5/6/8 (playtest priority observation).
- G1/G2/G3 anti-frustration (death spiral, stuck states, unfairness).

### 9.5 On weekly/monthly cadence

- V14 SIRC aggregate over last 7 days of telemetry.
- V15 Merge supply actual vs projected.
- V18 30-day window rolling check.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

**End of `06_verification.md`.** 9 sections covering methodology for V1-V18 + difficulty scoring extensions + Monte Carlo harness spec + verification cadence. Cross-references: invariant definitions → `01_rules.md` §31, numeric thresholds → `02_balance_values.md`.
