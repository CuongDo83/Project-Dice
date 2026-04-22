# DiceBound GDD v33 — Balance Values

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 17 cleanup — §33 terminology fix "power-item" → "bag item")
- **Status:** ✅ Sessions 2-5 complete + Session 9 patch (bag weights) + Session 17 terminology cleanup. This file is the authoritative balance values source for DiceBound v33.
- **Authoritative for:** All numeric values. Other files reference by `{ID}`. This is the single source of truth for balance numbers.

---

## Scope of this file

This file is the single source of truth for numeric values in DiceBound. No other v33 file may hardcode a number that belongs here. All other files reference values using `{ID}` syntax (see `_INDEX.md` §4.2).

**✅ File COMPLETE — Sessions 2-5 all delivered:**
- Player baseline + Equipment Lv1 auto-equip bonuses
- Chance caps, Damage Guard, TTK anchors
- Heal potion (drop + magnitude + pickup rate)
- 4 enemy archetypes (Lv1 baseline + Day move speed + Day/Night multipliers)
- Enemy scaling rule (HP linear, DMG capped +15 bonus)
- Gold bands (Low/Mid/High/Boss) + efficiency curve
- Equipment Upgrade cost + Merge cost
- Idle reward system (constants + per-Lv curve)
- Rune Trial reward system + daily wins cap
- Gold Tech Tree Loop 1 (6 nodes × 3 tiers)
- Equipment per-level scaling (Weapon/Auxiliary/Helmet/Armor)
- Merge 4-family tier stats (Stability/Burst/Precision/Guard × T1-T6)
- Merge T1 piece consumption (cubic 3→1)
- Bag items (15 items × Lv1/Lv2/Lv3)
- Fusion endpoints (6 sample endpoints + principles; 9 deferred)
- Wave/Day/Night cycle constants
- Wave overlap + stacking thresholds
- Map grid dimensions
- UPI ratio target bands per session stage
- V1.3.0 PS_day difficulty tier bands
- Threat band percentages
- In-run vs out-of-run ratio bounds
- Boss placeholder stats (3 instances)
- Anti-frustration gate thresholds
- Monte Carlo + session assumptions + full build pacing target
- Bag offer weight tables (15 utility + 30 combat base phase weights + 9 dynamic modifiers + modifier threshold + 4 structural rule values) — **Session 9 patch**

**Total: ~375 IDs locked.** 6 conflicts discovered during migration, all resolved (A.1-A.5) or noted as non-blocking (A.6).

---

## 1. Player Baseline

Raw player state without any equipment or bag items. Fresh-state combat math starts here.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `PLAYER_HP_BASELINE` | 180 | HP | v33 | Unchanged from v31 |
| `PLAYER_DMG_MIN_BASELINE` | 10 | damage | v33 | Replaced 20 (v31). User-directed for Slime 4-hit TTK |
| `PLAYER_DMG_MAX_BASELINE` | 15 | damage | v33 | Replaced 40 (v31) |
| `PLAYER_ROLL_MIN` | 1 | tile | v33 | Unchanged |
| `PLAYER_ROLL_MAX` | 3 | tile | v33 | v32 S1 intentional change from v31 (was 4). Confirmed Session 2 |
| `PLAYER_BASE_CRIT_PCT` | 5 | % | v33 | Replaced 0 (v31). Added for Fatal Fang standalone utility |
| `PLAYER_BASE_BLOCK_PCT` | 0 | % | v33 | Unchanged |
| `PLAYER_BASE_DOUBLE_STRIKE_PCT` | 0 | % | v33 | Unchanged |
| `PLAYER_BASE_LIFESTEAL_PCT` | 0 | % | v33 | Unchanged |
| `PLAYER_CRIT_DAMAGE_MULTIPLIER` | 1.5 | × | v33 | Unchanged from v31 |

---

## 2. Equipment Lv1 Baseline (Auto-Equipped from New Game)

Player starts new game with Equipment Lv1 auto-equipped. These bonuses stack on top of `PLAYER_*_BASELINE`.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `EQUIPMENT_LV1_WEAPON_DMG_MIN` | 1 | damage | v33 | Weapon slot Lv1 |
| `EQUIPMENT_LV1_WEAPON_DMG_MAX` | 2 | damage | v33 | — |
| `EQUIPMENT_LV1_AUXILIARY_DMG_MIN` | 2 | damage | v33 | Auxiliary slot Lv1 (mirrors Weapon) |
| `EQUIPMENT_LV1_AUXILIARY_DMG_MAX` | 1 | damage | v33 | — |
| `EQUIPMENT_LV1_HELMET_HP` | 10 | HP | v33 | Helmet slot Lv1 |
| `EQUIPMENT_LV1_ARMOR_HP` | 10 | HP | v33 | Armor slot Lv1 |

**Derived effective baseline (fresh new game, Equipment Lv1 equipped):**
- Effective HP: `{PLAYER_HP_BASELINE} + {EQUIPMENT_LV1_HELMET_HP} + {EQUIPMENT_LV1_ARMOR_HP}` = 200
- Effective DMG min: `{PLAYER_DMG_MIN_BASELINE} + {EQUIPMENT_LV1_WEAPON_DMG_MIN} + {EQUIPMENT_LV1_AUXILIARY_DMG_MIN}` = 13
- Effective DMG max: `{PLAYER_DMG_MAX_BASELINE} + {EQUIPMENT_LV1_WEAPON_DMG_MAX} + {EQUIPMENT_LV1_AUXILIARY_DMG_MAX}` = 18

Derived values are NOT separately stored as IDs. Rules/content must compute from base IDs above.

---

## 3. Chance Stat Caps

Maximum cap enforced on player's chance-based stats regardless of accumulated bonuses.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `CHANCE_CAP_CRIT_PCT` | 50 | % | v33 | Unchanged from v31 |
| `CHANCE_CAP_BLOCK_PCT` | 50 | % | v33 | Unchanged from v31 |
| `CHANCE_CAP_DOUBLE_STRIKE_PCT` | 50 | % | v33 | Unchanged from v31 |
| `CHANCE_CAP_LIFESTEAL_PCT` | 25 | % | v33 | NEW cap (v32 cascade Entry 4). Prevents runaway sustain |

---

## 4. Damage Guard Thresholds (TIER 1 Invariant)

Constraint on player damage range to preserve combat readability and prevent extreme swings.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `DAMAGE_GUARD_MAX_GAP` | 25 | damage | v33 | `dmgMax - dmgMin ≤ 25`. Anchored to 50% of Slime HP |
| `DAMAGE_GUARD_MIN_RATIO_PCT` | 50 | % | v33 | `dmgMin ≥ 50% of dmgMax` |

Rule enforcement lives in `01_rules.md` combat section. Verification in `06_verification.md` V1/V2.

---

## 5. TTK Anchors (TIER 1 Invariant)

Target hits-to-kill values that serve as the anchor for all other combat balance derivations.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `TTK_SLIME_TARGET_HITS` | 4 | hits | v33 | Reference archetype. Player DMG derived from this |
| `TTK_FIRE_MIN_HITS` | 3 | hits | v33 | Minimum — sustainable combat exchange |
| `TTK_SLIME_VS_PLAYER_MIN_HITS` | 5 | hits | v33 | Player must survive ≥5 Slime hits (effective HP 200 vs Slime DMG 35) |

These anchors are INPUTS to combat balance derivation, not OUTPUTS. Changing these requires full re-derivation of Player DMG range and Enemy scaling.

---

## 6. Heal Potion

Dropped by defeated enemies. Orthogonal cross-pattern placement around dead enemy tile.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `HEAL_POTION_DROP_PCT` | 30 | % | v33 | Per enemy death. Unchanged from v31 |
| `HEAL_POTION_MAGNITUDE_PCT` | 10 | % of max HP | v33 | Replaced flat +20 HP (v31). Scales with progression |
| `HEAL_POTION_SPAWN_PATTERN` | `orthogonal_cross_1_tile` | enum | v33 | See `01_rules.md` heal-potion section for pattern spec |

Magnitude clamps at max HP (no overheal).

---

## 7. Enemy Archetypes — Lv1 Baseline

Four archetypes. Stats at Main Run Level 1.

Uniform data model: every archetype stores `MOVE_SPEED_DAY_MIN` and `MOVE_SPEED_DAY_MAX`. Fixed-speed archetypes have MIN=MAX. Variable-speed archetypes have MIN<MAX. Night values derived via `{NIGHT_SPEED_MULTIPLIER}` (see §9).

### 7.1 Wind

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `WIND_HP_LV1` | 30 | HP | v33 | Unchanged from v31 |
| `WIND_DMG_MIN_LV1` | 21 | damage | v33 | Replaced 20 (v31). Damage Guard compliance |
| `WIND_DMG_MAX_LV1` | 30 | damage | v33 | Unchanged |
| `WIND_MOVE_SPEED_DAY_MIN` | 2 | tile/turn | v33 | Inherited from v31 `spd 2-4`. Variable fast mover |
| `WIND_MOVE_SPEED_DAY_MAX` | 4 | tile/turn | v33 | — |
| `WIND_GOLD_BAND` | `LOW` | band | v33 | Maps to `{GOLD_BAND_LOW}` (Session 3) |

### 7.2 Slime (Reference Archetype)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `SLIME_HP_LV1` | 50 | HP | v33 | Unchanged. Serves as TTK anchor target (50 / 12.5 avg = 4 hits) |
| `SLIME_DMG_MIN_LV1` | 30 | damage | v33 | Unchanged |
| `SLIME_DMG_MAX_LV1` | 40 | damage | v33 | Unchanged |
| `SLIME_MOVE_SPEED_DAY_MIN` | 1 | tile/turn | v33 | Fixed speed (MIN=MAX). Slow, predictable anchor |
| `SLIME_MOVE_SPEED_DAY_MAX` | 1 | tile/turn | v33 | — |
| `SLIME_GOLD_BAND` | `MID` | band | v33 | Maps to `{GOLD_BAND_MID}` (Session 3) |

### 7.3 Worm

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `WORM_HP_LV1` | 70 | HP | v33 | Unchanged |
| `WORM_DMG_MIN_LV1` | 40 | damage | v33 | Unchanged |
| `WORM_DMG_MAX_LV1` | 50 | damage | v33 | Unchanged |
| `WORM_MOVE_SPEED_DAY_MIN` | 2 | tile/turn | v33 | Fixed speed (MIN=MAX). Consistent pressure |
| `WORM_MOVE_SPEED_DAY_MAX` | 2 | tile/turn | v33 | — |
| `WORM_GOLD_BAND` | `HIGH` | band | v33 | Maps to `{GOLD_BAND_HIGH}` (Session 3) |

### 7.4 Fire

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `FIRE_HP_LV1` | 50 | HP | v33 | Unchanged |
| `FIRE_DMG_MIN_LV1` | 50 | damage | v33 | Unchanged |
| `FIRE_DMG_MAX_LV1` | 60 | damage | v33 | Unchanged |
| `FIRE_MOVE_SPEED_DAY_MIN` | 1 | tile/turn | v33 | Variable speed per turn (random 1-3) |
| `FIRE_MOVE_SPEED_DAY_MAX` | 3 | tile/turn | v33 | — |
| `FIRE_GOLD_BAND` | `HIGH` | band | v33 | Maps to `{GOLD_BAND_HIGH}` (Session 3) |

---

## 8. Enemy Scaling Rules

Enemies scale with Main Run Level. Formula applies uniformly to all 4 archetypes.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `ENEMY_HP_PER_MAIN_LEVEL` | 10 | HP/level | v33 | Linear, no cap. HP grows through Lv10 content |
| `ENEMY_DMG_SCALING_STEP` | 5 | damage | v33 | Per A.3 resolution (table canonical) |
| `ENEMY_DMG_SCALING_INTERVAL` | 2 | main levels | v33 | Per A.3 resolution (table canonical, +5 per 2 levels) |
| `ENEMY_DMG_SCALING_CAP_BONUS` | 15 | damage | v33 | Max bonus DMG above baseline. Cap reached at Lv7 with +5/2 rule |
| `ENEMY_SCALING_CONTENT_MAX_LEVEL` | 10 | level | v33 | Content designed through Lv10 (Lv9-10 deferred to đợt 2) |

**Derived scaling (formula in `01_rules.md`):**
```
Enemy HP at Lv L    = Baseline HP + (L - 1) × {ENEMY_HP_PER_MAIN_LEVEL}
Enemy DMG at Lv L   = Baseline DMG + min(
                         floor((L - 1) / {ENEMY_DMG_SCALING_INTERVAL}),
                         {ENEMY_DMG_SCALING_CAP_BONUS} / {ENEMY_DMG_SCALING_STEP}
                      ) × {ENEMY_DMG_SCALING_STEP}
```

**Verified against v32 part1 §2.2 per-level table:**
| Main Lv | Slime DMG bonus | Table value | Formula result | Match |
|---|---|---|---|---|
| 1 | +0 | 30-40 | 30-40 | ✓ |
| 3 | +5 | 35-45 | 35-45 | ✓ |
| 5 | +10 | 40-50 | 40-50 | ✓ |
| 7 | +15 (cap) | 45-55 | 45-55 | ✓ |
| 10 | +15 (cap held) | 45-55 | 45-55 | ✓ |

---

## 9. Day/Night Phase Multipliers

Day/Night is a phase cycle within each level. Night multiplies enemy DMG and move speed. Rule applies uniformly to all 4 archetypes (no per-archetype override in v33).

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `NIGHT_DMG_MULTIPLIER` | 2 | × | v33 | Inherited from v31. All enemies deal 2× DMG during Night phase |
| `NIGHT_SPEED_MULTIPLIER` | 2 | × | v33 | Inherited from v31. All enemies move 2× tiles during Night phase |

**Rule derivation (stored in `01_rules.md`, not here):**
- Enemy Night DMG = Day DMG × `{NIGHT_DMG_MULTIPLIER}`
- Enemy Night MOVE_SPEED = Day speed × `{NIGHT_SPEED_MULTIPLIER}`

Example per v31 lock (verified against archetype data):
- Slime Day DMG 30-40 → Night DMG 60-80 ✓
- Wind Day speed 2-4 → Night speed 4-8 ✓
- Worm Day DMG 40-50 → Night DMG 80-100 ✓
- Fire Day speed 1-3 → Night speed 2-6 ✓

Day/Night block length (number of turns per Day, per Night) is a wave/level constant — locked in Session 5.

---

## 10. Gold Bands (Currency Faucet — Main Run)

Gold dropped per enemy defeated. Archetype maps to one of 4 bands; boss is its own band.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `GOLD_BAND_LOW` | 3 | gold | v33 | Replaced 1 (v31). Wind |
| `GOLD_BAND_MID` | 8 | gold | v33 | Replaced 2 (v31). Slime (reference archetype) |
| `GOLD_BAND_HIGH` | 13 | gold | v33 | Replaced 4 (v31). Worm, Fire |
| `GOLD_BAND_BOSS` | 64 | gold | v33 | Replaced 16 (v31). 8× `{GOLD_BAND_MID}` |

**Scaling rationale (from v32 cascade Entry 15):** 3.2× increase from v31 bands (1/2/4/16 → 3/8/13/64) to support strict SIRC ≤50% across all Idle tiers. Equipment/Merge cost also scales 2.5× to preserve pacing — see §12 and §13.

---

## 11. Gold Efficiency Curve (Day-depth Bonus)

End-of-run gold bonus scales with Day-depth survived in that run. Applied to total kill-gold after run ends, before currency deposit.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `GOLD_EFFICIENCY_DAY_1_PCT` | 0 | % | v33 | Day 1 baseline, no bonus |
| `GOLD_EFFICIENCY_DAY_2_PCT` | 15 | % | v33 | Day 2-3 bucket |
| `GOLD_EFFICIENCY_DAY_3_PCT` | 15 | % | v33 | Day 2-3 bucket |
| `GOLD_EFFICIENCY_DAY_4_PCT` | 30 | % | v33 | Day 4 bucket |
| `GOLD_EFFICIENCY_DAY_5_PLUS_PCT` | 50 | % | v33 | Day 5+ cap. Does not increase further |

**Commentary (VI):** v32 part2 §5.3 là spec mới nhất với thresholds Day 1 / Day 2-3 / Day 4 / Day 5+ (compressed curve, cap đạt sớm hơn). Earlier draft trong handoff §Bước 3 và DB_Tuning_Proposals ghi Day 1 / Day 3 / Day 5 / Day 8+ (stretched curve). v33 dùng curve compressed.

---

## 12. Equipment Upgrade Cost (Gold Sink)

Per-slot Gold cost to upgrade to target level. Scaled 2.5× nominal from v31 (actual cumulative ratio 2×).

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `EQUIPMENT_UPGRADE_COST_LV2` | 50 | gold | v33 | Tutorial-friendly intro cost |
| `EQUIPMENT_UPGRADE_COST_LV5` | 187 | gold | v33 | — |
| `EQUIPMENT_UPGRADE_COST_LV10` | 375 | gold | v33 | — |
| `EQUIPMENT_UPGRADE_COST_LV15` | 562 | gold | v33 | — |
| `EQUIPMENT_UPGRADE_COST_LV20` | 750 | gold | v33 | Max Lv20 upgrade |
| `EQUIPMENT_UPGRADE_CUMULATIVE_LV1_TO_LV20_PER_SLOT` | 5920 | gold | v33 | Sum across all 19 upgrades for 1 slot |
| `EQUIPMENT_UPGRADE_FULL_4_SLOT_LV20` | 23680 | gold | v33 | 4 slots × cumulative per slot |

**Note:** Intermediate levels (Lv3, Lv4, Lv6-9, Lv11-14, Lv16-19) are not locked in v32 source. See Appendix A.4.

---

## 13. Equipment Merge Cost (Gold Sink)

Per-slot Gold cost to merge to next tier. Scaled 2.5× from v31. Cubic T1 piece consumption per §Content (stored in `03_content.md`, not here).

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `MERGE_COST_T1_TO_T2` | 225 | gold | v33 | — |
| `MERGE_COST_T2_TO_T3` | 450 | gold | v33 | — |
| `MERGE_COST_T3_TO_T4` | 750 | gold | v33 | — |
| `MERGE_COST_T4_TO_T5` | 1200 | gold | v33 | — |
| `MERGE_COST_T5_TO_T6` | 1875 | gold | v33 | — |
| `MERGE_CUMULATIVE_T1_TO_T5_PER_SLOT` | 2625 | gold | v33 | Sum T1→T5 for 1 slot |
| `MERGE_CUMULATIVE_T1_TO_T6_PER_SLOT` | 4500 | gold | v33 | Sum T1→T6 for 1 slot |
| `MERGE_FULL_4_SLOT_T5` | 10500 | gold | v33 | Full build target (per v32 §5.11) |
| `MERGE_FULL_4_SLOT_T6` | 18000 | gold | v33 | Long-term aspiration, not full-build target |

---

## 14. Idle Reward System (Gold Faucet — Supplemental)

Passive gold accumulation while player is offline. Redesigned in v32 (removed cooldown, doubled cap, flattened curve).

### 14.1 Idle constants

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `IDLE_TICK_INTERVAL_MINUTES` | 5 | minutes | v33 | Inherited from v31. Visual cadence |
| `IDLE_OFFLINE_CAP_HOURS` | 8 | hours | v33 | Doubled from v31 (was 4hr) |
| `IDLE_CLAIM_COOLDOWN_HOURS` | 0 | hours | v33 | Removed v31's 12hr cooldown |
| `IDLE_T1_EQUIPMENT_DROP_PCT` | 3 | % per tick | v33 | Chance to drop T1 Equipment piece |
| `IDLE_DAILY_TICKS_TARGET` | 240 | ticks | v33 | 3-session rhythm: 96 + 48 + 96 |

### 14.2 Idle Gold per tick — per Main Run level cleared

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `IDLE_GOLD_PER_TICK_LV1` | 1 | gold | v33 | — |
| `IDLE_GOLD_PER_TICK_LV2` | 1 | gold | v33 | — |
| `IDLE_GOLD_PER_TICK_LV3` | 2 | gold | v33 | — |
| `IDLE_GOLD_PER_TICK_LV4` | 2 | gold | v33 | — |
| `IDLE_GOLD_PER_TICK_LV5` | 2 | gold | v33 | — |
| `IDLE_GOLD_PER_TICK_LV6` | 2 | gold | v33 | — |
| `IDLE_GOLD_PER_TICK_LV7` | 3 | gold | v33 | — |
| `IDLE_GOLD_PER_TICK_LV8` | 3 | gold | v33 | — |
| `IDLE_GOLD_PER_TICK_LV9` | 3 | gold | v33 | — |
| `IDLE_GOLD_PER_TICK_LV10` | 3 | gold | v33 | Max tier |

Curve shape: step function (1 → 2 → 3), much milder than v31 linear 6→20. SIRC ≤50% verified at all 5 anchor tiers in v32 §5.10.

---

## 15. Rune Trial Rewards (Rune Shard Faucet)

Rune Trial mode spends player turns to earn Rune Shard. Architecture: 20 handmade stages, 2 waves per stage, no Day/Night, no mystery cells.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `RUNE_TRIAL_TOTAL_STAGES` | 20 | stages | v33 | Stage 1 through Stage 20 |
| `RUNE_TRIAL_WAVES_PER_STAGE` | 2 | waves | v33 | Fixed per stage |
| `RUNE_TRIAL_REWARD_BASE` | 8 | RS | v33 | Reward formula: base + stage |
| `RUNE_TRIAL_REWARD_PER_STAGE` | 1 | RS/stage | v33 | Linear slope. Reward(N) = 8 + N |
| `RUNE_TRIAL_FIRST_CLEAR_BONUS_PCT` | 50 | % | v33 | Applied first clear only, replay no bonus |
| `RUNE_TRIAL_FIRST_CLEAR_MAX_STAGE` | 2 | stage | v33 | Bonus applies stages 1-2 only |
| `RUNE_TRIAL_DIFFICULTY_SCALE_FACTOR` | 0.85 | × | v33 | Enemy scale = 0.85 × highest Main Run level cleared |
| `RUNE_TRIAL_DAILY_WINS` | 2 | wins/day | v33 | Inherited from v31 + DB_Tuning_Proposals (confirmed Session 3) |

**Derived reward table (formula reference, not authoritative):**
| Stage | Reward | First-clear total |
|---|---|---|
| 1 | 9 RS | 13.5 RS |
| 5 | 13 RS | — |
| 10 | 18 RS | — |
| 15 | 23 RS | — |
| 20 | 28 RS | — |

---

## 16. Gold Tech Tree — Loop 1 (Rune Shard Sink)

**Architecture:** Loop-based compound tree. Loop 1 has 6 nodes in 3 branch categories (Root, Combat, Gold%, Capstone). Each node has 3 tiers with per-tier costs and effects. Max cost if all nodes fully upgraded = 525 RS. Typical partial completion per loop ≈ 315 RS.

**Layer role:** Base power floor + economy smoothing. Permanent account-level progression.

### 16.1 Root (HP Base)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `TREE_ROOT_TIER1_HP` | 5 | HP | v33 | Additional HP at Tier 1 |
| `TREE_ROOT_TIER2_HP` | 10 | HP | v33 | Additional HP at Tier 2 |
| `TREE_ROOT_TIER3_HP` | 15 | HP | v33 | Additional HP at Tier 3 |
| `TREE_ROOT_TIER1_COST_RS` | 15 | RS | v33 | — |
| `TREE_ROOT_TIER2_COST_RS` | 30 | RS | v33 | — |
| `TREE_ROOT_TIER3_COST_RS` | 45 | RS | v33 | — |

**Per-tier additive:** Root full (T1+T2+T3) = +30 HP cumulative, 90 RS total cost.

### 16.2 Combat Lane A — "Steady Hand" (dmgMin)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `TREE_STEADY_TIER1_DMG_MIN` | 1 | damage | v33 | — |
| `TREE_STEADY_TIER2_DMG_MIN` | 2 | damage | v33 | — |
| `TREE_STEADY_TIER3_DMG_MIN` | 2 | damage | v33 | — |
| `TREE_STEADY_TIER1_COST_RS` | 30 | RS | v33 | — |
| `TREE_STEADY_TIER2_COST_RS` | 45 | RS | v33 | — |
| `TREE_STEADY_TIER3_COST_RS` | 60 | RS | v33 | — |

**Steady full:** +5 dmgMin cumulative, 135 RS total.

### 16.3 Combat Lane B — "Finisher's Edge" (dmgMax)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `TREE_FINISHER_TIER1_DMG_MAX` | 1 | damage | v33 | — |
| `TREE_FINISHER_TIER2_DMG_MAX` | 2 | damage | v33 | — |
| `TREE_FINISHER_TIER3_DMG_MAX` | 2 | damage | v33 | — |
| `TREE_FINISHER_TIER1_COST_RS` | 30 | RS | v33 | — |
| `TREE_FINISHER_TIER2_COST_RS` | 45 | RS | v33 | — |
| `TREE_FINISHER_TIER3_COST_RS` | 60 | RS | v33 | — |

**Finisher full:** +5 dmgMax cumulative, 135 RS total.

### 16.4 Gold% Lane A — "Clean Loot"

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `TREE_CLEAN_LOOT_TIER1_GOLD_PCT` | 3 | % | v33 | Additional gold efficiency |
| `TREE_CLEAN_LOOT_TIER2_GOLD_PCT` | 4 | % | v33 | — |
| `TREE_CLEAN_LOOT_TIER3_GOLD_PCT` | 5 | % | v33 | — |
| `TREE_CLEAN_LOOT_TIER1_COST_RS` | 15 | RS | v33 | — |
| `TREE_CLEAN_LOOT_TIER2_COST_RS` | 20 | RS | v33 | — |
| `TREE_CLEAN_LOOT_TIER3_COST_RS` | 25 | RS | v33 | — |

**Clean Loot full:** +12% gold (additive), 60 RS total.

### 16.5 Gold% Lane B — "Contract Bonus"

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `TREE_CONTRACT_BONUS_TIER1_GOLD_PCT` | 2 | % | v33 | — |
| `TREE_CONTRACT_BONUS_TIER2_GOLD_PCT` | 3 | % | v33 | — |
| `TREE_CONTRACT_BONUS_TIER3_GOLD_PCT` | 4 | % | v33 | — |
| `TREE_CONTRACT_BONUS_TIER1_COST_RS` | 10 | RS | v33 | — |
| `TREE_CONTRACT_BONUS_TIER2_COST_RS` | 15 | RS | v33 | — |
| `TREE_CONTRACT_BONUS_TIER3_COST_RS` | 20 | RS | v33 | — |

**Contract Bonus full:** +9% gold (additive), 45 RS total.

### 16.6 Capstone — "Campaign Command"

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `TREE_CAPSTONE_TIER1_DMG_MIN` | 1 | damage | v33 | Tier 1 gives dmgMin only |
| `TREE_CAPSTONE_TIER2_DMG_MAX` | 1 | damage | v33 | Tier 2 gives dmgMax only |
| `TREE_CAPSTONE_TIER3_DMG_MIN` | 1 | damage | v33 | Tier 3 gives +1 each |
| `TREE_CAPSTONE_TIER3_DMG_MAX` | 1 | damage | v33 | — |
| `TREE_CAPSTONE_TIER1_COST_RS` | 15 | RS | v33 | — |
| `TREE_CAPSTONE_TIER2_COST_RS` | 20 | RS | v33 | — |
| `TREE_CAPSTONE_TIER3_COST_RS` | 25 | RS | v33 | — |

**Capstone full:** +2 dmgMin / +2 dmgMax cumulative, 60 RS total.

### 16.7 Loop 1 Aggregate

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `TREE_LOOP_1_FULL_COST_RS` | 525 | RS | v33 | All 6 nodes at Tier 3 |
| `TREE_LOOP_1_TYPICAL_COST_RS` | 315 | RS | v33 | Player chooses branches, partial loop completion |
| `TREE_LOOP_1_MAX_HP_GAIN` | 30 | HP | v33 | Root full |
| `TREE_LOOP_1_MAX_DMG_MIN_GAIN` | 7 | damage | v33 | Steady (5) + Capstone (2) |
| `TREE_LOOP_1_MAX_DMG_MAX_GAIN` | 7 | damage | v33 | Finisher (5) + Capstone (2) |
| `TREE_LOOP_1_MAX_GOLD_PCT_GAIN` | 12 | % | v33 | Lane A only; Lane B full = 9% |
| `TREE_LOOP_1_LANE_AB_COMPOUND_CAP_PCT` | 50 | % | v33 | Max gold efficiency bonus across loops, cap |

**Loop 2-3 DEFERRED per v32 §5.7** — compound runaway concerns flagged for đợt 2 review. Not locked in v33.

**Commentary (VI):** v31 có 7 nodes riêng (Iron Hide, Steady Hand, Clean Loot, Veteran Body, Finisher's Edge, Contract Bonus, Campaign Command) total 838 RS. v32 redesign gom về 6 nodes (Root gộp Iron Hide + Veteran Body), per-loop 315 RS, compound qua multiple loops.

---

## 17. Equipment Per-Level Scaling (Gold Sink Return)

**Architecture:** 4 slots (Weapon, Auxiliary, Helmet, Armor) each upgradeable from Lv1 to Lv20 for 19 upgrade steps per slot.

Equipment Lv1 baseline bonuses are in §2. This section covers per-upgrade increments and Lv20 cumulative contribution.

### 17.1 Per-upgrade increments

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `EQUIPMENT_WEAPON_ODD_LEVEL_DMG_MAX_INCREMENT` | 1 | damage | v33 | Upgrade to Lv2, 4, 6, ..., 20 each gives +1 dmgMax |
| `EQUIPMENT_WEAPON_EVEN_LEVEL_DMG_MIN_INCREMENT` | 1 | damage | v33 | Upgrade to Lv3, 5, 7, ..., 19 each gives +1 dmgMin |
| `EQUIPMENT_AUX_ODD_LEVEL_DMG_MIN_INCREMENT` | 1 | damage | v33 | Mirrors Weapon — odd gives dmgMin |
| `EQUIPMENT_AUX_EVEN_LEVEL_DMG_MAX_INCREMENT` | 1 | damage | v33 | Even gives dmgMax |
| `EQUIPMENT_HELMET_PER_UPGRADE_HP_INCREMENT` | 2 | HP | v33 | All 19 upgrades give +2 HP each |
| `EQUIPMENT_ARMOR_PER_UPGRADE_HP_INCREMENT` | 2 | HP | v33 | All 19 upgrades give +2 HP each |

### 17.2 Lv20 cumulative contribution (includes Lv1 baseline)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `EQUIPMENT_WEAPON_LV20_DMG_MIN_TOTAL` | 10 | damage | v33 | Used in v32 §1.5 Damage Guard verification |
| `EQUIPMENT_WEAPON_LV20_DMG_MAX_TOTAL` | 11 | damage | v33 | ⚠️ See Appendix A.6 (arithmetic flag) |
| `EQUIPMENT_AUX_LV20_DMG_MIN_TOTAL` | 12 | damage | v33 | — |
| `EQUIPMENT_AUX_LV20_DMG_MAX_TOTAL` | 10 | damage | v33 | — |
| `EQUIPMENT_HELMET_LV20_HP_TOTAL` | 48 | HP | v33 | Lv1 baseline (10) + 19 upgrades × 2 = 48 |
| `EQUIPMENT_ARMOR_LV20_HP_TOTAL` | 48 | HP | v33 | Same formula |

### 17.3 Full 4-slot Lv20 cumulative

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `EQUIPMENT_4_SLOT_LV20_HP_TOTAL` | 96 | HP | v33 | Helmet 48 + Armor 48 |
| `EQUIPMENT_4_SLOT_LV20_DMG_MIN_TOTAL` | 22 | damage | v33 | Weapon 10 + Aux 12 |
| `EQUIPMENT_4_SLOT_LV20_DMG_MAX_TOTAL` | 21 | damage | v33 | Weapon 11 + Aux 10 |

---

## 18. Equipment Merge — Family Tier Stats

**Architecture:** 4 families (Stability, Burst, Precision, Guard) each with Tier 1 baseline → Tier 6 peak. Per-slot stat values; family bias bonus activates when all 4 slots are same family.

### 18.1 Stability family (dmgMin focus, slowed-enemy bias)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `MERGE_STABILITY_T1_DMG_MIN_PER_SLOT` | 0 | damage | v33 | Baseline, no bonus |
| `MERGE_STABILITY_T2_DMG_MIN_PER_SLOT` | 2 | damage | v33 | — |
| `MERGE_STABILITY_T3_DMG_MIN_PER_SLOT` | 3 | damage | v33 | — |
| `MERGE_STABILITY_T4_DMG_MIN_PER_SLOT` | 4 | damage | v33 | — |
| `MERGE_STABILITY_T5_DMG_MIN_PER_SLOT` | 5 | damage | v33 | — |
| `MERGE_STABILITY_T6_DMG_MIN_PER_SLOT` | 6 | damage | v33 | — |
| `MERGE_STABILITY_T3_FAMILY_BIAS_PCT` | 1 | % dmg vs slowed | v33 | Activates at 4-slot same family |
| `MERGE_STABILITY_T4_FAMILY_BIAS_PCT` | 2 | % | v33 | — |
| `MERGE_STABILITY_T5_FAMILY_BIAS_PCT` | 3 | % | v33 | — |
| `MERGE_STABILITY_T6_FAMILY_BIAS_PCT` | 5 | % | v33 | — |
| `MERGE_STABILITY_T5_SUB_HP` | 10 | HP | v33 | Sub-bonus from T5 |
| `MERGE_STABILITY_T6_SUB_HP` | 20 | HP | v33 | Sub-bonus from T6 |

### 18.2 Burst family (dmgMax focus, Crit Damage bias)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `MERGE_BURST_T1_DMG_MAX_PER_SLOT` | 0 | damage | v33 | Baseline |
| `MERGE_BURST_T2_DMG_MAX_PER_SLOT` | 2 | damage | v33 | — |
| `MERGE_BURST_T3_DMG_MAX_PER_SLOT` | 3 | damage | v33 | — |
| `MERGE_BURST_T4_DMG_MAX_PER_SLOT` | 4 | damage | v33 | — |
| `MERGE_BURST_T5_DMG_MAX_PER_SLOT` | 5 | damage | v33 | — |
| `MERGE_BURST_T6_DMG_MAX_PER_SLOT` | 6 | damage | v33 | — |
| `MERGE_BURST_T3_FAMILY_BIAS_PCT` | 1 | % Crit Damage | v33 | Activates at 4-slot same family |
| `MERGE_BURST_T4_FAMILY_BIAS_PCT` | 2 | % | v33 | — |
| `MERGE_BURST_T5_FAMILY_BIAS_PCT` | 3 | % | v33 | — |
| `MERGE_BURST_T6_FAMILY_BIAS_PCT` | 5 | % | v33 | — |
| `MERGE_BURST_T5_SUB_HP` | 10 | HP | v33 | — |
| `MERGE_BURST_T6_SUB_HP` | 20 | HP | v33 | — |

### 18.3 Precision family (Crit Chance focus, Double Strike bias)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `MERGE_PRECISION_T1_CRIT_PER_SLOT_PCT` | 0 | % | v33 | Baseline |
| `MERGE_PRECISION_T2_CRIT_PER_SLOT_PCT` | 1 | % | v33 | — |
| `MERGE_PRECISION_T3_CRIT_PER_SLOT_PCT` | 1 | % | v33 | — |
| `MERGE_PRECISION_T4_CRIT_PER_SLOT_PCT` | 2 | % | v33 | — |
| `MERGE_PRECISION_T5_CRIT_PER_SLOT_PCT` | 3 | % | v33 | — |
| `MERGE_PRECISION_T6_CRIT_PER_SLOT_PCT` | 3 | % | v33 | — |
| `MERGE_PRECISION_T3_FAMILY_BIAS_PCT` | 1 | % Double Strike | v33 | — |
| `MERGE_PRECISION_T4_FAMILY_BIAS_PCT` | 2 | % | v33 | — |
| `MERGE_PRECISION_T5_FAMILY_BIAS_PCT` | 3 | % | v33 | — |
| `MERGE_PRECISION_T6_FAMILY_BIAS_PCT` | 5 | % | v33 | — |
| `MERGE_PRECISION_T5_SUB_HP` | 10 | HP | v33 | — |
| `MERGE_PRECISION_T6_SUB_HP` | 20 | HP | v33 | — |

### 18.4 Guard family (HP focus, Lifesteal bias + Block sub-bonus)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `MERGE_GUARD_T1_HP_PER_SLOT` | 0 | HP | v33 | Baseline |
| `MERGE_GUARD_T2_HP_PER_SLOT` | 10 | HP | v33 | — |
| `MERGE_GUARD_T3_HP_PER_SLOT` | 15 | HP | v33 | — |
| `MERGE_GUARD_T4_HP_PER_SLOT` | 20 | HP | v33 | — |
| `MERGE_GUARD_T5_HP_PER_SLOT` | 25 | HP | v33 | — |
| `MERGE_GUARD_T6_HP_PER_SLOT` | 30 | HP | v33 | — |
| `MERGE_GUARD_T3_FAMILY_BIAS_PCT` | 1 | % Lifesteal | v33 | — |
| `MERGE_GUARD_T4_FAMILY_BIAS_PCT` | 2 | % | v33 | — |
| `MERGE_GUARD_T5_FAMILY_BIAS_PCT` | 3 | % | v33 | — |
| `MERGE_GUARD_T6_FAMILY_BIAS_PCT` | 5 | % | v33 | — |
| `MERGE_GUARD_T5_SUB_BLOCK_PCT` | 2 | % | v33 | Sub-bonus is Block%, not HP (unlike other families) |
| `MERGE_GUARD_T6_SUB_BLOCK_PCT` | 5 | % | v33 | — |

### 18.5 Family bias activation rule

**Bias bonus applies only when all 4 slots are same family at the tier's bias level.** Mixed-family builds get NO bias bonus. Bias is NOT per-slot — single bonus per 4-slot match.

**4-slot all-same-family at T6 totals:**
- Stability: +24 dmgMin + 80 HP + 5% dmg vs slowed
- Burst: +24 dmgMax + 80 HP + 5% Crit Damage
- Precision: +12% Crit + 80 HP + 5% Double Strike
- Guard: +120 HP + 5% Lifesteal + 5% Block

---

## 19. Merge Recipe — T1 Piece Consumption (Cubic 3→1)

**Rule:** Each tier transition consumes 3 pieces of the previous tier. This creates cubic scaling in T1-equivalent pieces needed.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `MERGE_RECIPE_PIECES_PER_TRANSITION` | 3 | pieces | v33 | Uniform across all tier transitions |
| `MERGE_T1_PIECES_FOR_T2_PER_SLOT` | 3 | T1 pieces | v33 | Cumulative |
| `MERGE_T1_PIECES_FOR_T3_PER_SLOT` | 12 | T1 pieces | v33 | Cumulative (3 + 3×3) |
| `MERGE_T1_PIECES_FOR_T4_PER_SLOT` | 39 | T1 pieces | v33 | Cumulative |
| `MERGE_T1_PIECES_FOR_T5_PER_SLOT` | 120 | T1 pieces | v33 | Cumulative |
| `MERGE_T1_PIECES_FOR_T6_PER_SLOT` | 363 | T1 pieces | v33 | Cumulative |
| `MERGE_T1_PIECES_4_SLOT_T5` | 480 | T1 pieces | v33 | 4 × 120 |
| `MERGE_T1_PIECES_4_SLOT_T6` | 1452 | T1 pieces | v33 | 4 × 363 |

---

## 20. Bag Items Catalog (15 items × Lv1/Lv2/Lv3)

**Architecture:** 4 neutral slots. Each slot holds one item at Lv1/Lv2/Lv3. Picking same item 3 times upgrades it (pick same at Lv1 → Lv2, pick same at Lv2 → Lv3). Bag resets at run end.

**v32 change:** DMG/HP items converted to % (scales with progression). Chance/dice items keep flat values.

### 20.1 Utility/Tactic category (5 items)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `BAG_PATHFINDER_TOKEN_LV1` | 1 | +maxRoll | v33 | Flat (dice) — unchanged from v31 |
| `BAG_PATHFINDER_TOKEN_LV2` | 2 | +maxRoll | v33 | — |
| `BAG_PATHFINDER_TOKEN_LV3` | 3 | +maxRoll | v33 | — |
| `BAG_STEP_ANCHOR_LV1` | 1 | +minRoll | v33 | Flat (dice) |
| `BAG_STEP_ANCHOR_LV2` | 2 | +minRoll | v33 | — |
| `BAG_STEP_ANCHOR_LV3` | 3 | +minRoll | v33 | — |
| `BAG_FIELD_KIT_LV1_PCT` | 5 | % max HP heal | v33 | Stacks with base heal (§6) |
| `BAG_FIELD_KIT_LV2_PCT` | 8 | % | v33 | — |
| `BAG_FIELD_KIT_LV3_PCT` | 10 | % | v33 | Lv3 combined with base heal = +20% max HP per pickup |
| `BAG_SUN_COMPASS_LV1` | 1 | +Day maxRoll | v33 | Flat (dice) |
| `BAG_SUN_COMPASS_LV2` | 2 | — | v33 | — |
| `BAG_SUN_COMPASS_LV3` | 3 | — | v33 | — |
| `BAG_MOON_WARD_LV1_PCT` | 20 | % Night dmg reduce | v33 | — |
| `BAG_MOON_WARD_LV2_PCT` | 35 | % | v33 | — |
| `BAG_MOON_WARD_LV3_PCT` | 50 | % | v33 | — |

### 20.2 Combat category (10 items)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `BAG_GUARD_CREST_LV1_PCT` | 10 | % max HP | v33 | Converted from v31 flat +20 HP |
| `BAG_GUARD_CREST_LV2_PCT` | 15 | % | v33 | — |
| `BAG_GUARD_CREST_LV3_PCT` | 20 | % | v33 | — |
| `BAG_STABLE_EDGE_LV1_PCT` | 15 | % dmgMin | v33 | Converted from v31 flat +10 |
| `BAG_STABLE_EDGE_LV2_PCT` | 25 | % | v33 | — |
| `BAG_STABLE_EDGE_LV3_PCT` | 35 | % | v33 | — |
| `BAG_POWER_EDGE_LV1_PCT` | 15 | % dmgMax | v33 | — |
| `BAG_POWER_EDGE_LV2_PCT` | 25 | % | v33 | — |
| `BAG_POWER_EDGE_LV3_PCT` | 35 | % | v33 | — |
| `BAG_KEEN_EYE_LV1_PCT` | 8 | % Crit Chance | v33 | Chance — kept flat from v31 |
| `BAG_KEEN_EYE_LV2_PCT` | 16 | % | v33 | — |
| `BAG_KEEN_EYE_LV3_PCT` | 24 | % | v33 | — |
| `BAG_FATAL_FANG_LV1_PCT` | 20 | % Crit Damage | v33 | Chance-adjacent — kept flat |
| `BAG_FATAL_FANG_LV2_PCT` | 40 | % | v33 | — |
| `BAG_FATAL_FANG_LV3_PCT` | 60 | % | v33 | — |
| `BAG_IRON_GUARD_LV1_PCT` | 8 | % Block Chance | v33 | Chance — kept flat |
| `BAG_IRON_GUARD_LV2_PCT` | 16 | % | v33 | — |
| `BAG_IRON_GUARD_LV3_PCT` | 24 | % | v33 | — |
| `BAG_BLOOD_CHARM_LV1_PCT` | 6 | % Lifesteal | v33 | Chance — kept flat; cap `{CHANCE_CAP_LIFESTEAL_PCT}` |
| `BAG_BLOOD_CHARM_LV2_PCT` | 12 | % | v33 | — |
| `BAG_BLOOD_CHARM_LV3_PCT` | 18 | % | v33 | — |
| `BAG_TWIN_SIGIL_LV1_PCT` | 6 | % Double Strike | v33 | Chance — kept flat |
| `BAG_TWIN_SIGIL_LV2_PCT` | 12 | % | v33 | — |
| `BAG_TWIN_SIGIL_LV3_PCT` | 18 | % | v33 | — |
| `BAG_SUN_FANG_LV1_PCT` | 10 | % Day DMG (both min/max) | v33 | Converted to % |
| `BAG_SUN_FANG_LV2_PCT` | 15 | % | v33 | — |
| `BAG_SUN_FANG_LV3_PCT` | 20 | % | v33 | — |
| `BAG_MOON_FANG_LV1_PCT` | 20 | % Night DMG (both min/max) | v33 | 2× Sun Fang per time-ratio (Day:Night = 4:2) |
| `BAG_MOON_FANG_LV2_PCT` | 30 | % | v33 | — |
| `BAG_MOON_FANG_LV3_PCT` | 40 | % | v33 | — |

---

## 21. Fusion Endpoints (Sample — 6 of 15 locked)

**Architecture (unchanged from v31):** 2 × Lv3 bag items fuse into a single fusion endpoint. Neither input item upgrades further after fusion. Fusion preserves full effects of both recipe items AND adds a locked fusion bonus.

**v32 principle change:** DMG/HP bonuses converted to %, chance/dice bonuses keep flat, phase bonuses follow time-ratio rule.

### 21.1 Fusion principles (locked)

| ID | Value | Lock | Note |
|---|---|---|---|
| `FUSION_DMG_HP_BONUS_TYPE` | `percentage` | v33 | All DMG/HP fusion bonuses must be % |
| `FUSION_CHANCE_DICE_BONUS_TYPE` | `flat` | v33 | All Crit/Block/DS/Lifesteal/dice bonuses keep flat |
| `FUSION_PHASE_TIME_RATIO_RULE` | `2x_night_vs_day` | v33 | Night endpoints get 2× Day endpoint % (matches 4:2 time ratio) |

### 21.2 Sample fusion endpoints (6 of 15 locked; 9 deferred)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `FUSION_BULWARK_LINE_BONUS_PCT` | 10 | % HP | v33 | Recipe: Guard Crest Lv3 + Stable Edge Lv3. Converted from v31 flat +20 HP |
| `FUSION_SIEGE_HEART_BONUS_PCT` | 15 | % dmgMax | v33 | Recipe: Guard Crest Lv3 + Power Edge Lv3. Converted from v31 flat +10 dmgMax |
| `FUSION_HUNTER_GUARD_BONUS_PCT` | 8 | % Crit Chance | v33 | Recipe: Guard Crest Lv3 + Keen Eye Lv3. Kept flat (chance) |
| `FUSION_ROUTE_MASTER_BONUS` | 1 | +maxRoll | v33 | Recipe: Pathfinder + Step Anchor. Kept flat (dice) |
| `FUSION_FIELD_MARSHAL_BONUS_PCT` | 5 | % max HP heal | v33 | Recipe: Step Anchor + Field Kit. Converted from v31 flat +10 Heal Eff |
| `FUSION_NIGHT_SHELTER_BONUS_PCT` | 15 | % Night dmg reduce | v33 | Recipe: Step Anchor + Moon Ward. Bumped from v31 +10% |

**9 remaining endpoints DEFERRED to playtest tuning** per v32 §10.10 placeholders:
- Last Stand, Iron Rhythm, Sustain Rhythm, Critical Burst, Twin Reaper, Death Mark, Sunbreaker (v31 names) + 2 additional slots

See `07_open_questions.md` (Session 16) for full deferred list.

---

## 22. Wave & Day/Night Cycle Constants

**Architecture:** Each level has multiple waves, each Day block spawns a queued wave, Night phase multiplies enemy stats per §9.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `DAY_BLOCK_TURNS` | 4 | turns | v33 | Turns within one Day phase |
| `NIGHT_BLOCK_TURNS` | 2 | turns | v33 | Turns within one Night phase |
| `FULL_CYCLE_TURNS` | 6 | turns | v33 | Day + Night (4+2) |
| `WAVE_FIRST_SPAWN_TURN` | 1 | turn | v33 | Wave 1 spawns deterministically |
| `WAVE_SPAWN_INTERVAL_TURNS` | 6 | turns | v33 | Wave N+1 spawns at first Day turn of Day block N+1 |

**Derived wave spawn turns (for content reference):** 1, 7, 13, 19, 25, ... = `{WAVE_FIRST_SPAWN_TURN} + N × {WAVE_SPAWN_INTERVAL_TURNS}`

---

## 23. Wave Overlap & Stacking Thresholds

**Architecture:** Enemies from previous waves are NOT cleared when new wave spawns. Overlap is intentional DiceBound design.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `WAVE_STACK_DAY_3_MAX_PCT` | 30 | % seeds | v33 | DiceBound-specific V16 threshold (3-wave stack at Day 3) |
| `WAVE_STACK_FRAMEWORK_DEFAULT_PCT` | 5 | % seeds | v33 | Framework default — kept for reference, not active for DiceBound |

**Commentary (VI):** Framework P4 mặc định ≤5% nhưng DiceBound revised ≤30% vì wave overlap là intentional. Lv5, Lv6, Lv8 currently flagged ~40-45% seed stack → playtest priority observation.

---

## 24. Map & Grid Constants

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `MAP_GRID_WIDTH` | 8 | tiles | v33 | From v31 playtest |
| `MAP_GRID_HEIGHT` | 11 | tiles | v33 | 8×11 portrait orientation |

---

## 25. UPI Ratio Target Bands

**Architecture:** `UPI = effective_DPS × effective_EHP`. Target ratio `UPI_player / UPI_enemy` must stay within band for the player's progression stage.

### 25.1 Session stage thresholds

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `UPI_STAGE_EARLY_SESSION_MAX` | 5 | sessions | v33 | Early stage sessions 1-5 |
| `UPI_STAGE_MID_SESSION_MAX` | 15 | sessions | v33 | Mid stage sessions 6-15 |
| `UPI_STAGE_LATE_SESSION_MIN` | 16 | sessions | v33 | Late stage sessions 16+ |

### 25.2 Ratio bands per stage

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `UPI_RATIO_EARLY_MIN` | 0.8 | × | v33 | Player allowed to struggle with bad RNG |
| `UPI_RATIO_EARLY_MAX` | 1.5 | × | v33 | — |
| `UPI_RATIO_MID_MIN` | 1.2 | × | v33 | Player feels stronger, content has teeth |
| `UPI_RATIO_MID_MAX` | 2.0 | × | v33 | — |
| `UPI_RATIO_LATE_MIN` | 1.8 | × | v33 | Player feels powerful, not invincible |
| `UPI_RATIO_LATE_MAX` | 2.5 | × | v33 | — |

---

## 26. V1.3.0 PS_day Difficulty Tier Bands

**Architecture:** PS_day is per-Day-block pressure score (overlap-aware, replaces v1.0 PS_wave). Target bands per level tier.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `PS_DAY_LOW_MIN` | 0.15 | score | v33 | Low tier (Lv1-2) |
| `PS_DAY_LOW_MAX` | 0.35 | score | v33 | — |
| `PS_DAY_LOW_MID_MIN` | 0.25 | score | v33 | Low-Mid (Lv2-3) |
| `PS_DAY_LOW_MID_MAX` | 0.45 | score | v33 | — |
| `PS_DAY_MID_MIN` | 0.35 | score | v33 | Mid (Lv3-4) |
| `PS_DAY_MID_MAX` | 0.55 | score | v33 | — |
| `PS_DAY_MID_HIGH_MIN` | 0.45 | score | v33 | Mid-High (Lv4-5) |
| `PS_DAY_MID_HIGH_MAX` | 0.65 | score | v33 | — |
| `PS_DAY_HIGH_MIN` | 0.55 | score | v33 | High (Lv5-6) |
| `PS_DAY_HIGH_MAX` | 0.75 | score | v33 | — |
| `PS_DAY_VERY_HIGH_MIN` | 0.65 | score | v33 | Very High (Lv7-8) |
| `PS_DAY_VERY_HIGH_MAX` | 0.85 | score | v33 | — |

---

## 27. Threat Band Percentages (V1.3.0 ESP Input)

**Architecture:** Enemy power vs player power ratio determines threat tier for difficulty scoring.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `THREAT_BAND_LOW_MAX_PCT` | 80 | % of player power | v33 | Enemy < 80% player = Low threat |
| `THREAT_BAND_MID_MIN_PCT` | 80 | % | v33 | Enemy 80-120% = Mid threat |
| `THREAT_BAND_MID_MAX_PCT` | 120 | % | v33 | — |
| `THREAT_BAND_HIGH_MIN_PCT` | 120 | % | v33 | Enemy > 120% player = High threat |

**Threat points assignment:** Low=0, Mid=1, High=2 (rule, see `01_rules.md`).

---

## 28. In-run vs Out-of-run Power Ratio Bounds

**Architecture:** Protects tactical depth. In-run (Bag + Fusion) must contribute enough power so runs aren't pre-solved by permanent progression.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `IN_RUN_POWER_FLOOR_PCT` | 25 | % total UPI | v33 | Hard floor — Bag must deliver ≥25% at every stage |
| `IN_RUN_POWER_CEILING_PCT` | 40 | % total UPI | v33 | Late-game ceiling — Bag shouldn't dominate |
| `OUT_OF_RUN_IDLE_CEILING_PCT` | 30 | % of out-of-run UPI | v33 | Idle contribution cap (prevents "Idle solves the game") |

---

## 29. Boss Placeholder Stats

**Architecture:** Boss replaces 2 regular enemies in wave 5 (final wave) of designated levels. Test Đợt 1 uses 1×1 placeholder — full boss design (2×2, phases, immune windows) deferred.

### 29.1 Boss scaling multipliers (applied to base archetype at that level)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `BOSS_HP_MULTIPLIER` | 1.5 | × | v33 | Boss HP = 1.5× base archetype HP at that Main Run Lv |
| `BOSS_DMG_MULTIPLIER` | 1.0 | × | v33 | Same DMG as base — no buff |
| `BOSS_SPEED_INHERITS` | 1 | flag | v33 | 1 = inherits base archetype speed fully |
| `BOSS_TILE_SIZE` | 1 | tiles | v33 | 1×1 for Test Đợt 1; 2×2 deferred |
| `BOSS_PLACEMENT_WAVE` | 5 | wave | v33 | Final wave of designated levels |

### 29.2 Specific boss instances (Test Đợt 1)

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `BOSS_ELITE_WORM_LV3_HP` | 135 | HP | v33 | 1.5 × Worm Lv3 HP (90) |
| `BOSS_ELITE_WORM_LV3_DMG_MIN` | 45 | damage | v33 | Same as Worm Lv3 |
| `BOSS_ELITE_WORM_LV3_DMG_MAX` | 55 | damage | v33 | — |
| `BOSS_ELITE_FIRE_LV5_HP` | 135 | HP | v33 | 1.5 × Fire Lv5 HP (90) |
| `BOSS_ELITE_FIRE_LV5_DMG_MIN` | 60 | damage | v33 | Same as Fire Lv5 |
| `BOSS_ELITE_FIRE_LV5_DMG_MAX` | 70 | damage | v33 | — |
| `BOSS_ELITE_FIRE_LV7_HP` | 165 | HP | v33 | 1.5 × Fire Lv7 HP (110) |
| `BOSS_ELITE_FIRE_LV7_DMG_MIN` | 65 | damage | v33 | Same as Fire Lv7 |
| `BOSS_ELITE_FIRE_LV7_DMG_MAX` | 75 | damage | v33 | — |

**Commentary (VI):** Boss detail design (phase transitions, unique mechanics, 2×2, visual) DEFERRED per v32 §10.10. v33 lock giá trị vừa đủ để SIRC/content pacing/balance verification chạy được.

---

## 30. Anti-Frustration Gate Thresholds

**Architecture:** Three gates (G1/G2/G3) that every level must pass. Gates protect player experience against unwinnable scenarios.

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `G1_PLAYER_HP_MARGIN_MULTIPLIER` | 4 | × | v33 | Player HP ≥ 4× strongest single-hit enemy DMG at that level |
| `G2_WAVE_STACK_DAY_3_MAX_PCT` | 30 | % seeds | v33 | Same as `{WAVE_STACK_DAY_3_MAX_PCT}` — cross-referenced |
| `G3_HEAL_ECONOMY_MIN_RATIO_PCT` | 10 | % of damage | v33 | Heal pickup × value ≥ 10% of damage taken per wave |

---

## 31. Enemy DMG Range & Economy Constants

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `ENEMY_DMG_MIN_RATIO_PCT` | 70 | % of dmgMax | v33 | Enemy dmgMin ≥ 70% of dmgMax (narrow band, readable) |
| `HEAL_POTION_PICKUP_RATE_PCT` | 70 | % | v33 | Estimated player pickup efficiency (from v31) |

---

## 32. Verification & Methodology Constants

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `MONTE_CARLO_SAMPLE_SIZE` | 1000 | runs | v33 | N per scenario (framework P3/P5 default) |
| `SESSION_RUNS_TARGET` | 3 | runs | v33 | Assumed runs per session (user intent "3 session × 30 phút" daily) |
| `SESSION_LENGTH_TARGET_MINUTES` | 30 | minutes | v33 | Target per session |
| `FULL_BUILD_DAYS_MIN` | 22 | days | v33 | Framework target for full build (Eq Lv20 + Tree L1 + Merge T5) |
| `FULL_BUILD_DAYS_MAX` | 34 | days | v33 | — |
| `BUILD_PACKAGES_TOTAL_MIN` | 2 | packages | v33 | Full build requires 2-3 packages summed across layers |
| `BUILD_PACKAGES_TOTAL_MAX` | 3 | packages | v33 | — |

---

## 33. Bag Offer Weight Tables (Session 9 patch)

**Architecture:** Battlefield Bag popup offers 3 choices drawn from the bag item pool. Drawing uses `final_weight = BasePhaseWeight(item, current_phase) × product_of_applicable_dynamic_modifiers`. Normalize across items, sample 3 distinct items.

**Phase assignment per wave position (rule, see `01_rules.md` §18.8):**
- Wave 1 of level → `Early`
- Middle waves → `Mid`
- Final wave of level → `End`

### 33.1 Utility / Tactic items — Base phase weights

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `BAG_WEIGHT_PATHFINDER_TOKEN_EARLY` | 14 | weight | v33 | Route stability focus early |
| `BAG_WEIGHT_PATHFINDER_TOKEN_MID` | 8 | weight | v33 | — |
| `BAG_WEIGHT_PATHFINDER_TOKEN_END` | 4 | weight | v33 | — |
| `BAG_WEIGHT_STEP_ANCHOR_EARLY` | 13 | weight | v33 | — |
| `BAG_WEIGHT_STEP_ANCHOR_MID` | 8 | weight | v33 | — |
| `BAG_WEIGHT_STEP_ANCHOR_END` | 4 | weight | v33 | — |
| `BAG_WEIGHT_FIELD_KIT_EARLY` | 9 | weight | v33 | Heal sustain |
| `BAG_WEIGHT_FIELD_KIT_MID` | 7 | weight | v33 | — |
| `BAG_WEIGHT_FIELD_KIT_END` | 4 | weight | v33 | — |
| `BAG_WEIGHT_SUN_COMPASS_EARLY` | 10 | weight | v33 | Day dice bonus |
| `BAG_WEIGHT_SUN_COMPASS_MID` | 9 | weight | v33 | — |
| `BAG_WEIGHT_SUN_COMPASS_END` | 4 | weight | v33 | — |
| `BAG_WEIGHT_MOON_WARD_EARLY` | 6 | weight | v33 | Night dmg reduce — scales toward End |
| `BAG_WEIGHT_MOON_WARD_MID` | 9 | weight | v33 | — |
| `BAG_WEIGHT_MOON_WARD_END` | 12 | weight | v33 | Peaks at End for late-level Night survival |

### 33.2 Combat items — Base phase weights

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `BAG_WEIGHT_GUARD_CREST_EARLY` | 14 | weight | v33 | Survivability anchor |
| `BAG_WEIGHT_GUARD_CREST_MID` | 10 | weight | v33 | — |
| `BAG_WEIGHT_GUARD_CREST_END` | 6 | weight | v33 | — |
| `BAG_WEIGHT_STABLE_EDGE_EARLY` | 13 | weight | v33 | Steady dmgMin |
| `BAG_WEIGHT_STABLE_EDGE_MID` | 11 | weight | v33 | — |
| `BAG_WEIGHT_STABLE_EDGE_END` | 7 | weight | v33 | — |
| `BAG_WEIGHT_POWER_EDGE_EARLY` | 10 | weight | v33 | dmgMax |
| `BAG_WEIGHT_POWER_EDGE_MID` | 10 | weight | v33 | — |
| `BAG_WEIGHT_POWER_EDGE_END` | 8 | weight | v33 | — |
| `BAG_WEIGHT_KEEN_EYE_EARLY` | 8 | weight | v33 | Crit chance |
| `BAG_WEIGHT_KEEN_EYE_MID` | 10 | weight | v33 | — |
| `BAG_WEIGHT_KEEN_EYE_END` | 9 | weight | v33 | — |
| `BAG_WEIGHT_FATAL_FANG_EARLY` | 5 | weight | v33 | Crit damage (execution, scales End) |
| `BAG_WEIGHT_FATAL_FANG_MID` | 8 | weight | v33 | — |
| `BAG_WEIGHT_FATAL_FANG_END` | 10 | weight | v33 | — |
| `BAG_WEIGHT_IRON_GUARD_EARLY` | 8 | weight | v33 | Block chance |
| `BAG_WEIGHT_IRON_GUARD_MID` | 9 | weight | v33 | — |
| `BAG_WEIGHT_IRON_GUARD_END` | 10 | weight | v33 | — |
| `BAG_WEIGHT_BLOOD_CHARM_EARLY` | 7 | weight | v33 | Lifesteal sustain |
| `BAG_WEIGHT_BLOOD_CHARM_MID` | 9 | weight | v33 | — |
| `BAG_WEIGHT_BLOOD_CHARM_END` | 9 | weight | v33 | — |
| `BAG_WEIGHT_TWIN_SIGIL_EARLY` | 6 | weight | v33 | Double Strike |
| `BAG_WEIGHT_TWIN_SIGIL_MID` | 9 | weight | v33 | — |
| `BAG_WEIGHT_TWIN_SIGIL_END` | 10 | weight | v33 | — |
| `BAG_WEIGHT_SUN_FANG_EARLY` | 10 | weight | v33 | Day DMG (peaks Early-Mid) |
| `BAG_WEIGHT_SUN_FANG_MID` | 10 | weight | v33 | — |
| `BAG_WEIGHT_SUN_FANG_END` | 5 | weight | v33 | — |
| `BAG_WEIGHT_MOON_FANG_EARLY` | 5 | weight | v33 | Night DMG (peaks End) |
| `BAG_WEIGHT_MOON_FANG_MID` | 8 | weight | v33 | — |
| `BAG_WEIGHT_MOON_FANG_END` | 12 | weight | v33 | — |

### 33.3 Dynamic modifiers (applied multiplicatively on base weight)

| ID | Value | Unit | Lock | Condition |
|---|---|---|---|---|
| `BAG_MOD_OWNED_NOT_MAX` | 2.0 | × | v33 | Item is already owned and not at Lv3 yet (upgrade bias) |
| `BAG_MOD_LV2_NEEDS_LV3_FOR_FUSION` | 2.8 | × | v33 | Item at Lv2, and reaching Lv3 would unlock a currently-open fusion recipe |
| `BAG_MOD_FAMILY_ALIGNED` | 1.5 | × | v33 | Item shares family with current build direction |
| `BAG_MOD_COMPLETES_OPEN_FUSION` | 2.2 | × | v33 | Item directly completes an open fusion recipe |
| `BAG_MOD_LOW_HP_RECOVERY` | 1.7 | × | v33 | Player HP ≤ `{MODIFIER_LOW_HP_THRESHOLD_PCT}%` max AND item is Guard Crest / Iron Guard / Blood Charm / Field Kit / Moon Ward |
| `BAG_MOD_DAY_PHASE_BIAS` | 1.35 | × | v33 | Current phase is Day AND item is Sun Compass / Sun Fang |
| `BAG_MOD_NIGHT_PHASE_BIAS` | 1.5 | × | v33 | Current phase is Night AND item is Moon Ward / Moon Fang |
| `BAG_MOD_OFF_BUILD_AFTER_FIRST_FUSION` | 0.45 | × | v33 | After first fusion completed, item fully misaligns with current build |
| `BAG_MOD_RECIPE_PRODUCES_EXISTING_FUSION` | 0 | × | v33 | Recipe would produce a fusion item already in the bag (hard zero — never offer) |

### 33.4 Modifier thresholds

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `MODIFIER_LOW_HP_THRESHOLD_PCT` | 50 | % of max HP | v33 | Triggers `BAG_MOD_LOW_HP_RECOVERY` |

### 33.5 Reroll + skip rule values

| ID | Value | Unit | Lock | Note |
|---|---|---|---|---|
| `BAG_REROLLS_PER_LEVEL` | 1 | reroll | v33 | Total per level (not per popup) |
| `BAG_ACTIVE_SLOTS` | 4 | slots | v33 | Neutral slots during run |
| `BAG_POPUP_CHOICE_COUNT` | 3 | choices | v33 | Items shown per popup |
| `FUSION_RECIPE_ITEM_COUNT` | 2 | Lv3 items | v33 | Always 2 × Lv3 matching items per recipe |

---

## Appendix A — Conflicts Discovered (Sessions 2-4) — Status Tracker

Three conflicts found in Session 2 (all resolved). Two conflicts discovered in Session 3 (A.4 resolved with caveat, A.5 resolved). One minor flag from Session 4 (A.6).

**Session 2 conflicts (A.1, A.2, A.3): ALL RESOLVED**  
**Session 3 conflicts (A.4, A.5): RESOLVED (A.4 with caveat on intermediate levels)**  
**Session 4 minor flag (A.6): NOTED, workaround applied**

### A.1 Player roll max — ✅ RESOLVED

**Resolution:** `PLAYER_ROLL_MAX = 3` locked per v32 S1 intentional change (user-confirmed Session 2).

**Source of truth:** `GDD_v32_handoff_VI_Claude.md` §Giá Trị Đã Lock Hiện Tại explicitly records v32 S1 decision "Dice roll: minRoll 1 / maxRoll 3".

**Context:** v32 part1 §1.1 table label "unchanged" was an error (v31 was actually 4). v33 reflects the correct v32 S1 locked value of 3.

**Commentary (VI):** User confirmed Session 2. Không rollback về 4. Mọi rule/content tham chiếu `PLAYER_ROLL_MAX` đều dùng giá trị 3.

### A.2 Wind move speed — ✅ RESOLVED

**Resolution:** Inherited from v31 `spd 2-4` at Day, Night derived via `{NIGHT_SPEED_MULTIPLIER}` = 4-8.

**Source:** `dicebound_gdd_v31.md` §6.3 Enemy type Wind explicitly locks `spd 2-4 ở Day; Night modifier 4-8`.

**Why v32 part1 §2.1 showed "?":** Incomplete table entry, not intentional override. Per `_INDEX.md` §6.2, incomplete v32 fields inherit from v31.

**v33 locked values** (already in §7.1):
- `WIND_MOVE_SPEED_DAY_MIN` = 2
- `WIND_MOVE_SPEED_DAY_MAX` = 4
- Night = 4-8 (derived via multiplier, no separate ID needed)

### A.3 Enemy DMG scaling — ✅ RESOLVED

**Resolution:** Table canonical (+5 per 2 main levels), cap +15 bonus. User-confirmed Session 2.

**v33 locked values** (in §8):
- `ENEMY_DMG_SCALING_STEP` = 5
- `ENEMY_DMG_SCALING_INTERVAL` = 2
- `ENEMY_DMG_SCALING_CAP_BONUS` = 15

**Correction downstream:** v32 part1 §2.2 rule text ("+5 per 3 Main Run levels") is **wrong** per this resolution. When `01_rules.md` is written in Phase 2, rule text must state:

> Enemy DMG increases by `{ENEMY_DMG_SCALING_STEP}` every `{ENEMY_DMG_SCALING_INTERVAL}` Main Run levels, capping at `{ENEMY_DMG_SCALING_CAP_BONUS}` above baseline.

**Cap-level clarification:**
- With +5/2 rule, cap (+15) is reached at **Main Lv7**, not Lv10.
- Lv7-Lv10 all hold at baseline+15.
- `ENEMY_DMG_SCALING_CAP_LEVEL` ID from initial Session 2 draft was removed (misleading — was derived from rejected +5/3 rule).

**Commentary (VI):** v32 part1 footnote "*DMG caps at Lv10*" bị outdated dưới rule +5/2. Thực tế cap ở Lv7. Rule text viết trong 01_rules.md phải correct điều này.

**Impact for Session 3 (Economy):** Gold-per-kill + SIRC verification có thể proceed — enemy DMG per level giờ đã deterministic.

### A.4 Equipment Upgrade cost formula inconsistency — ⚠️ NOTED, WORKAROUND APPLIED

**Conflict:**
- `dicebound_gdd_v32_part2.md` §5.5 states formula: `cost(Lv) = 20 × Lv × 2.5`
- Table values in same section do NOT match this formula:
  - Formula predicts Lv2=100, Lv5=250, Lv20=1000
  - Table shows Lv2=50, Lv5=187, Lv20=750
- Stated cumulative "5,920 gold" also doesn't derive cleanly from either table or formula
- Stated "2.5× scale from v31" is nominal — actual cumulative ratio is 2× (v31 2,960 → v32 5,920)

**Analysis:** The 5 tabulated costs (Lv2/5/10/15/20) are self-consistent with formula `cost(Lv) = 37.5 × Lv` EXCEPT Lv2 which is discounted to 50 (instead of 75) for tutorial-friendly pacing. Stated formula `20 × Lv × 2.5` in v32 part2 §5.5 is wrong documentation.

**Workaround applied in v33:**
- 5 tabulated values locked as-is
- Intermediate levels (Lv3, Lv4, Lv6-9, Lv11-14, Lv16-19) NOT locked
- Cumulative 5,920 and 4-slot 23,680 locked as authoritative totals
- Formula NOT locked as an ID (would be misleading)

**Open question for Session 4/5:** If Session 4 Progression or Session 5 Verification needs per-level costs for intermediate levels, resolve via one of:
- (A) Lock `cost(Lv) = 37.5 × Lv` for Lv3+, keep Lv2=50 special case; re-verify cumulative
- (B) Lock linear interpolation between tabulated values
- (C) Re-author full table from scratch
- (D) Playtest as-is with 5-point table, intermediate levels interpolated at runtime

**Commentary (VI):** Không blocking Session 3. Full build cost tính đúng qua cumulative number (5,920 × 4 slot). Per-run gold pacing verified trong v32 part2 §5.4. Chỉ chưa có công thức authoritative cho intermediate levels — resolve khi cần.

### A.5 Rune Trial daily wins — ✅ RESOLVED

**Resolution:** `RUNE_TRIAL_DAILY_WINS = 2` locked per user confirmation (Session 3 close).

**Source:** Inherited from v31 default + DB_Tuning_Proposals assumption. v32 part2 §5.8 was incomplete (didn't mention cap), user confirmed inherit.

**Impact:** SIRC ≤50% verified at all 5 Main Run tiers with 2 wins/day cap. No cascade needed.

### A.6 Weapon Lv20 cumulative arithmetic — ⚠️ NOTED (minor)

**Issue:**
- v32 part2 §6.2 Weapon rule: "Odd upgrade levels (Lv2, 4, 6, ..., 20): +1 dmgMax" (10 levels) + Lv1 baseline "+2 dmgMax" → expected total +12 dmgMax.
- But stated cumulative: "Lv20 cumulative: +10 dmgMin / +11 dmgMax"
- And v32 part2 §1.5 Damage Guard peak check uses +11 dmgMax (matches cumulative, not rule arithmetic).

**Resolution:** v33 locks cumulative +11 dmgMax as authoritative (matches §1.5 verification). Per-upgrade increment of +1 may have off-by-one somewhere. Not blocking.

**Impact:** Negligible — 1 point of dmgMax at max progression doesn't cascade to SIRC/UPI/DSSM.

**Commentary (VI):** v32 part2 §6.2 arithmetic không chặt — rule pattern nói +12 dmgMax, cumulative ghi +11. v33 dùng +11 khớp verification. Playtest tuning sẽ clarify.

---

## Appendix B — File Completion Status

**✅ ALL SESSIONS COMPLETE**

| Session | Scope | Sections | Status |
|---|---|---|---|
| 2 | Player + Enemy | §1-§9 | ✅ Locked |
| 3 | Economy | §10-§15 | ✅ Locked |
| 4 | Progression | §16-§21 | ✅ Locked |
| 5 | Constants + Thresholds | §22-§32 | ✅ Locked |
| 9 | Bag Offer Weights (patch) | §33 | ✅ Locked |

**Ready for Phase 2 migration:** `01_rules.md` (in progress — Sessions 6-13 for rules).

---

**End of `02_balance_values.md`.** ~375 IDs locked across 33 sections. 6 conflicts resolved during migration (A.1-A.5 resolved, A.6 noted as non-blocking). This file is the **authoritative numeric source** for DiceBound v33 — no other v33 file may hardcode values that belong here.
