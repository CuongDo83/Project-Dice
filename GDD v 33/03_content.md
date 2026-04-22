# DiceBound Content — v33

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 14 — new file)
- **Status:** ✅ Drafted. Session 15 may polish if Session 14 leaves gaps.
- **Authoritative for:** Entity behaviors and identity descriptions (enemies, bag items, tree nodes, merge families, bosses, level manifests).
- **NOT authoritative for:** Numeric values (see `02_balance_values.md`). Rule mechanics (see `01_rules.md`).

---

## Reading rules

1. This file describes WHAT entities do and HOW they feel. Numeric values live in `02_balance_values.md`; mechanical rules live in `01_rules.md`.
2. Content descriptions are referenced by `01_rules.md` and implementation code but never duplicate numeric values from `02_balance_values.md`.
3. Level manifests store only `total enemy count + archetype breakdown + boss presence + mystery count + targets`. Per-wave composition is NOT in this file — it belongs in level JSON authored by content pipeline.
4. Lock markers use the same convention as `01_rules.md`: `<!-- Locked: v33 | Last changed: v33 | CL: — -->`.

---

## Section map

| § | Topic | Entities |
|---|---|---|
| 1 | Enemy archetypes | Slime, Wind, Worm, Fire |
| 2 | Boss placeholder | Elite Worm Lv3, Elite Fire Lv5, Elite Fire Lv7 |
| 3 | Bag items — Utility (5) | Pathfinder Token, Step Anchor, Field Kit, Sun Compass, Moon Ward |
| 4 | Bag items — Combat (10) | Guard Crest, Stable Edge, Power Edge, Keen Eye, Fatal Fang, Iron Guard, Blood Charm, Twin Sigil, Sun Fang, Moon Fang |
| 5 | Fusion endpoints | 6 locked + 9 deferred |
| 6 | Gold Tech Tree nodes | Root, Steady Hand, Finisher's Edge, Clean Loot, Contract Bonus, Capstone |
| 7 | Merge families | Stability, Burst, Precision, Guard |
| 8 | Level manifests | Lv1-Lv8 (Test Đợt 1 scope) |

---

## 1. Enemy archetypes

The 4 core archetypes define DiceBound's combat identity. Each archetype has a fixed movement identity (per-archetype moveSpeed range — see `02_balance_values.md` §8) that never scales with level. Only HP and DMG scale per `01_rules.md` §17 enemy scaling rule.

### 1.1 Slime — reference archetype

- **Visual ID:** `enemy_slime`
- **Role:** Baseline reference archetype for TTK anchor (V3: player takes ≥5 hits to die from Slime).
- **Movement identity:** `spd 1-1` Day — slow, predictable, always 1 tile per turn.
- **Combat identity:** Mid HP, mid DMG. Hits hard enough to matter but slow enough to plan around.
- **Design role:** The "safe-to-teach" enemy. FTUE (Lv1) uses Slime exclusively because its behavior is the most predictable. All Damage Guard anchors reference Slime HP.
- **Gold band:** Mid (`{GOLD_BAND_MID}`).
- **Encounter intro:** Yes — first-encounter popup introduces movement characteristic.

### 1.2 Wind — speed archetype

- **Visual ID:** `enemy_wind`
- **Role:** Fast mover, demands reactive play.
- **Movement identity:** `spd 2-4` Day (range) — variable, can cover significant ground in one turn. ⚠️ See `02_balance_values.md` Appendix A.2 — v32 part1 listed Wind Day speed as "?" but was inherited verbatim from v31 as `2-4`.
- **Combat identity:** Low HP, low-mid DMG. Dies in 1-2 hits but closes distance fast.
- **Design role:** First fast archetype introduced (Lv2). Teaches the player that speed matters more than raw power — you can't outrun Wind on a bad roll. Pushes route-planning discipline.
- **Gold band:** Low (`{GOLD_BAND_LOW}`).
- **Encounter intro:** Yes.

### 1.3 Worm — pressure archetype

- **Visual ID:** `enemy_worm`
- **Role:** High-HP, steady pressure. Slower than Wind but faster than Slime.
- **Movement identity:** `spd 2-2` Day — consistent 2 tiles per turn.
- **Combat identity:** High HP, mid-high DMG. Absorbs hits, applies relentless pressure.
- **Design role:** Introduced at Lv3 with Worm-focused content + first boss (Elite Worm). Tests player's DPS sustain — bag offers matter more when Worm appears.
- **Gold band:** High (`{GOLD_BAND_HIGH}`).
- **Encounter intro:** Yes.

### 1.4 Fire — execution archetype

- **Visual ID:** `enemy_fire`
- **Role:** High damage with variable speed. The "1-shot risk" enemy.
- **Movement identity:** `spd 1-3` Day — unpredictable pace, can cluster close or spread out.
- **Combat identity:** Mid HP, highest DMG. TTK anchor: player takes ≥3 hits to die from Fire (V4).
- **Design role:** Introduced at Lv3 (sparse) and escalates through Lv5-8 as the dominant threat. Defines the upper threat ceiling for Test Đợt 1 content.
- **Gold band:** High (`{GOLD_BAND_HIGH}`).
- **Encounter intro:** Yes.

### 1.5 Shared archetype behaviors

- **Targeting (current playtest):** All archetypes target the player's current cell. Pathfinding respects obstacles and walkability (per `01_rules.md` §13.2).
- **Day/Night phase response:** All archetypes receive `{NIGHT_DMG_MULTIPLIER}`× DMG and `{NIGHT_SPEED_MULTIPLIER}`× speed during Night (per §14.3).
- **Death drops:** Every enemy death triggers the same reward flow — gold (per archetype band), `{HEAL_POTION_DROP_PCT}%` heal potion chance, ~20% T1 Equipment drop chance, and Battlefield Bag popup.
- **No special abilities in v33.** Future archetypes / Boss Passive Traits deferred per v31 §6 roadmap.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 2. Boss placeholder (Test Đợt 1)

**⚠️ Placeholder spec only.** Full boss design (phase transitions, 2×2 tile variants, immune windows, unique attack patterns, visual treatment) is DEFERRED to a dedicated boss design session.

Current v33 spec is sufficient for SIRC verification, content pacing, and Test Đợt 1 balance mock — nothing more.

### 2.1 Boss shared behaviors

- **Placement:** Boss replaces 2 regular enemies in the final wave (wave `{BOSS_PLACEMENT_WAVE}`) of designated levels.
- **Tile size:** `{BOSS_TILE_SIZE}`×`{BOSS_TILE_SIZE}` in v33. 2×2 variants deferred.
- **HP scaling:** Boss HP = `{BOSS_HP_MULTIPLIER}` × base archetype HP at the level's Main Run level.
- **DMG scaling:** Boss DMG = `{BOSS_DMG_MULTIPLIER}` × base archetype DMG (no buff — same as regular enemy of same archetype).
- **Speed:** Inherits base archetype speed fully.
- **Gold reward:** `{GOLD_BAND_BOSS}` (8× Mid band) — always, regardless of base archetype.
- **No special abilities yet.** Acts as a tanky regular enemy for Test Đợt 1.

### 2.2 Specific boss instances

**Elite Worm (appears at Lv3 wave 5):**
- Base archetype: Worm Lv3.
- Stats: `{BOSS_ELITE_WORM_LV3_HP}` HP, `{BOSS_ELITE_WORM_LV3_DMG_MIN}`-`{BOSS_ELITE_WORM_LV3_DMG_MAX}` DMG, speed 2.
- Design role: player's first boss encounter. Tutorial-level boss that rewards a clean bag build.

**Elite Fire (appears at Lv5 wave 5):**
- Base archetype: Fire Lv5.
- Stats: `{BOSS_ELITE_FIRE_LV5_HP}` HP, `{BOSS_ELITE_FIRE_LV5_DMG_MIN}`-`{BOSS_ELITE_FIRE_LV5_DMG_MAX}` DMG, speed 1-3.
- Design role: mid-game wall. Expected retry point for most players.

**Elite Fire (appears at Lv7 wave 5):**
- Base archetype: Fire Lv7.
- Stats: `{BOSS_ELITE_FIRE_LV7_HP}` HP, `{BOSS_ELITE_FIRE_LV7_DMG_MIN}`-`{BOSS_ELITE_FIRE_LV7_DMG_MAX}` DMG, speed 1-3.
- Design role: late-mid tier boss. Gates access to Lv8+.

<!-- Locked: v33 | Last changed: v33 | CL: — Full boss design deferred -->

---

## 3. Bag items — Utility / Tactic (5 items)

Bag items have their numeric values locked in `02_balance_values.md` §20. This section describes the behavioral identity and design intent of each item.

### 3.1 Pathfinder Token

- **Primary effect:** Adds to maxRoll of the player's dice.
- **Stat type:** Flat (dice bonus, not percentage).
- **Design role:** Route flexibility. Lets the player reach farther on a good roll, opening more positioning options per turn.
- **Synergy:** Pairs with Step Anchor (Route Master fusion). Strong in Early phase (base weight `{BAG_WEIGHT_PATHFINDER_TOKEN_EARLY}`), less so at End.
- **Behavioral note:** maxRoll bonus does NOT change the player's minimum required movement — player can still commit any path length 1 to effective maxRoll.

### 3.2 Step Anchor

- **Primary effect:** Adds to minRoll of the player's dice.
- **Stat type:** Flat.
- **Design role:** Risk reduction. Raises the floor of bad rolls, making positioning more reliable.
- **Synergy:** Pairs with Pathfinder Token (Route Master fusion) for a wide-roll package. Also pairs with Field Kit (Field Marshal fusion) for tactical-support build. Pairs with Moon Ward for Night Shelter (night-survival package).
- **Behavioral note:** Effective minRoll caps at effective maxRoll — min cannot exceed max.

### 3.3 Field Kit

- **Primary effect:** Adds additional `% max HP heal` per heal potion pickup, stacking additively with base heal.
- **Stat type:** Percentage.
- **Design role:** Sustain. Extends the effective value of heal potion drops. Scales with progression (max HP grows).
- **Synergy:** Lv3 combined with base heal reaches `{HEAL_POTION_MAGNITUDE_PCT}% + {BAG_FIELD_KIT_LV3_PCT}%` of max HP per pickup. Pairs with Step Anchor (Field Marshal fusion).
- **Behavioral note:** Field Kit does not create new heal potions — it only amplifies the heal per pickup when a potion drops.

### 3.4 Sun Compass

- **Primary effect:** Adds to maxRoll ONLY during Day phase.
- **Stat type:** Flat (dice bonus), phase-gated.
- **Design role:** Day-phase specialist. Player gets extra reach during Day windows, then loses it at Night.
- **Synergy:** Pairs with Sun Fang (day-damage packages). Base weight skews Early to Mid (`{BAG_WEIGHT_SUN_COMPASS_EARLY}` to `{BAG_WEIGHT_SUN_COMPASS_MID}`).
- **Behavioral note:** Activation timing per `01_rules.md` §14.5 — bonus removes at start of Night, re-applies at start of Day.

### 3.5 Moon Ward

- **Primary effect:** `% Night damage reduction` — reduces damage taken during Night phase.
- **Stat type:** Percentage, phase-gated.
- **Design role:** Night survival. Counters the `{NIGHT_DMG_MULTIPLIER}`× Night damage multiplier. Essential item for late-game Night-heavy levels.
- **Synergy:** Pairs with Step Anchor (Night Shelter fusion). Base weight peaks in End phase (`{BAG_WEIGHT_MOON_WARD_END}`) reflecting its late-level value.
- **Behavioral note:** Applies to ALL damage taken during Night, regardless of source archetype.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 4. Bag items — Combat (10 items)

### 4.1 Guard Crest

- **Primary effect:** `% max HP` bonus.
- **Stat type:** Percentage (v32 converted from v31 flat +20 HP).
- **Design role:** Survivability anchor. Early-game core pick (highest Early weight `{BAG_WEIGHT_GUARD_CREST_EARLY}`).
- **Synergy:** Feeds 4 fusion recipes — Bulwark Line, Siege Heart, Hunter Guard, Last Stand. The "Swiss army" utility item for Guard-family builds.
- **Behavioral note:** % applies to effective max HP pre-bag (per `01_rules.md` §26.3). Stacks additively with other bag HP% bonuses.

### 4.2 Stable Edge

- **Primary effect:** `% dmgMin` bonus.
- **Stat type:** Percentage (v32 converted from v31 flat +10 dmgMin).
- **Design role:** Steady damage floor. Raises worst-case hits. Pairs naturally with Stability merge family.
- **Synergy:** Bulwark Line (with Guard Crest), Iron Rhythm (with Iron Guard), Sustain Rhythm (with Blood Charm).
- **Behavioral note:** dmgMin % must respect Damage Guard — if adding would push min above max, overflow handling per `01_rules.md` §26.4.

### 4.3 Power Edge

- **Primary effect:** `% dmgMax` bonus.
- **Stat type:** Percentage.
- **Design role:** Raw damage ceiling. Best-case hits hit harder.
- **Synergy:** Siege Heart (with Guard Crest), Critical Burst (with Fatal Fang), Twin Reaper (with Twin Sigil).
- **Behavioral note:** Subject to Damage Guard overflow rule (§26.4). Large % gains may partially convert to dmgMin at high progression states.

### 4.4 Keen Eye

- **Primary effect:** `% Crit Chance`.
- **Stat type:** Flat (chance-based, kept flat per fusion principle).
- **Design role:** Crit-chance backbone. Required for most crit-based builds.
- **Synergy:** Hunter Guard (with Guard Crest), Death Mark (with Fatal Fang), Sunbreaker (with Sun Fang).
- **Behavioral note:** Capped at `{CHANCE_CAP_CRIT_PCT}%` globally. Lv3 (+`{BAG_KEEN_EYE_LV3_PCT}%`) alone reaches nearly half the cap.

### 4.5 Fatal Fang

- **Primary effect:** `% Crit Damage` (multiplier on crit hits).
- **Stat type:** Flat.
- **Design role:** Crit-damage amplifier. Combos with Keen Eye for execution-focused builds.
- **Synergy:** Last Stand (with Guard Crest), Critical Burst (with Power Edge), Death Mark (with Keen Eye).
- **Behavioral note:** Applies multiplicatively to base damage on successful crit (per combat resolution §8.1 step 3). Does NOT affect non-crit hits.

### 4.6 Iron Guard

- **Primary effect:** `% Block Chance`.
- **Stat type:** Flat.
- **Design role:** Damage mitigation. Chance to nullify incoming hits entirely.
- **Synergy:** Iron Rhythm (with Stable Edge).
- **Behavioral note:** Capped at `{CHANCE_CAP_BLOCK_PCT}%`. On successful block, incoming damage is 0 (full nullification) — lifesteal from blocked hit = 0.

### 4.7 Blood Charm

- **Primary effect:** `% Lifesteal` (heal fraction of damage dealt).
- **Stat type:** Flat.
- **Design role:** Sustain during combat. Alternative to heal-potion sustain.
- **Synergy:** Sustain Rhythm (with Stable Edge).
- **Behavioral note:** Capped at `{CHANCE_CAP_LIFESTEAL_PCT}%`. Heals from FINAL damage dealt (after crit and before block nullification — blocked hits yield 0 lifesteal).

### 4.8 Twin Sigil

- **Primary effect:** `% Double Strike Chance` (chance to trigger 1 extra hit per attack).
- **Stat type:** Flat.
- **Design role:** Attack volume multiplier. Doubles effective hits on lucky procs.
- **Synergy:** Twin Reaper (with Power Edge).
- **Behavioral note:** Capped at `{CHANCE_CAP_DOUBLE_STRIKE_PCT}%`. Extra hit does NOT chain (per §8.2 — max 1 extra hit per base attack).

### 4.9 Sun Fang

- **Primary effect:** `% Day DMG` (both dmgMin and dmgMax) — Day phase only.
- **Stat type:** Percentage, phase-gated.
- **Design role:** Day-damage specialist. Peak value in Early/Mid (`{BAG_WEIGHT_SUN_FANG_EARLY}`, `{BAG_WEIGHT_SUN_FANG_MID}`).
- **Synergy:** Sunbreaker fusion (with Keen Eye).
- **Behavioral note:** Applies only during Day rounds. Removes effect at Night start, re-applies at Day start. Stacks additively with other bag DMG% bonuses during Day.

### 4.10 Moon Fang

- **Primary effect:** `% Night DMG` (both dmgMin and dmgMax) — Night phase only.
- **Stat type:** Percentage, phase-gated.
- **Design role:** Night-damage specialist. 2× the magnitude of Sun Fang per level (4:2 Day:Night time ratio normalization).
- **Synergy:** No locked Night-endpoint fusion yet. 9 deferred fusion endpoints (§5) may include one.
- **Behavioral note:** Peak weight at End (`{BAG_WEIGHT_MOON_FANG_END}`) — reflects late-game Night pressure.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 5. Fusion endpoints

Fusion endpoints are permanent in-run combined items. Recipe: `{FUSION_RECIPE_ITEM_COUNT}` × Lv3 matching items → 1 fusion endpoint. Fusion items keep full effects of both recipe items AND add a locked fusion bonus (per `01_rules.md` §18.9 and `02_balance_values.md` §21).

### 5.1 Locked fusion endpoints (6 of 15)

| Endpoint | Recipe | Package | Role | v33 bonus |
|---|---|---|---|---|
| Bulwark Line | Guard Crest Lv3 + Stable Edge Lv3 | Guard + Stability | Safe bruiser | +10% HP (was +20 flat in v31) |
| Siege Heart | Guard Crest Lv3 + Power Edge Lv3 | Guard + Burst | Tanky finisher | +15% dmgMax (was +10 flat) |
| Hunter Guard | Guard Crest Lv3 + Keen Eye Lv3 | Guard + Precision | Reliable duelist | +8% Crit Chance (flat kept) |
| Route Master | Pathfinder Token Lv3 + Step Anchor Lv3 | Route + Route | Mobility package | +1 maxRoll (flat dice kept) |
| Field Marshal | Step Anchor Lv3 + Field Kit Lv3 | Route + Sustain | Tactical support | +5% max HP heal per pickup |
| Night Shelter | Step Anchor Lv3 + Moon Ward Lv3 | Route + Night | Night reposition | +15% Night damage reduction (bumped from v31 +10%) |

### 5.2 Deferred endpoints (9 of 15)

Per `02_balance_values.md` Appendix B, these 9 fusion endpoints from v31 exist as recipe names but their v33 values (after v32's flat→% conversion principle) have NOT been locked. They will be authored when needed, using fusion principles:
- DMG/HP fusion bonuses → percentage.
- Chance/dice fusion bonuses → keep flat.
- Night endpoints get `{FUSION_PHASE_TIME_RATIO_RULE}` — 2× Day equivalent per 4:2 Day:Night time ratio.

Deferred endpoints:
- Last Stand (Guard Crest + Fatal Fang) — comeback bruiser.
- Iron Rhythm (Stable Edge + Iron Guard) — low-risk attrition.
- Sustain Rhythm (Stable Edge + Blood Charm) — drain fighter.
- Critical Burst (Power Edge + Fatal Fang) — explosive closer.
- Twin Reaper (Twin Sigil + Power Edge) — double-hit finisher.
- Death Mark (Keen Eye + Fatal Fang) — crit assassin.
- Sunbreaker (Sun Fang + Keen Eye) — Day-phase kill window.
- 2 additional unnamed slots (framework reserves 15 total).

<!-- Locked: v33 | Last changed: v33 | CL: — 9 of 15 endpoints deferred per v32 §10.10 -->

---

## 6. Gold Tech Tree nodes

Tree structure: 6 nodes across Loop 1. Values in `02_balance_values.md` §16. Rules in `01_rules.md` §27.

### 6.1 Root — HP lane

- **Effect:** Permanent +HP across 3 tiers (cumulative +`{TREE_LOOP_1_MAX_HP_GAIN}` HP at Tier 3).
- **Role:** Base survivability floor. Root must be purchased first — it is the entry point to all other lanes.
- **v31 → v32 change:** Was "structural free node" in v31; v32 made Root a purchasable node with RS cost. Preserves progression pacing.

### 6.2 Combat Lane A — Steady Hand (dmgMin)

- **Effect:** Permanent +dmgMin across 3 tiers (+5 dmgMin at Tier 3).
- **Role:** Raises base damage floor. Makes min-roll hits meaningful.
- **Prerequisite:** Root Tier 1 purchased.

### 6.3 Combat Lane B — Finisher's Edge (dmgMax)

- **Effect:** Permanent +dmgMax across 3 tiers (+5 dmgMax at Tier 3).
- **Role:** Raises best-case damage ceiling. Enables execution play.
- **Prerequisite:** Steady Hand at Tier 3 (fully maxed) — preserves v31 dmgMax-after-dmgMin invariant.

### 6.4 Gold% Lane A — Clean Loot

- **Effect:** Permanent +gold efficiency % across 3 tiers (+12% total at Tier 3).
- **Role:** Economy amplifier. Speeds up full-build pacing.
- **Prerequisite:** Root Tier 1 purchased. Independent of Combat lanes.

### 6.5 Gold% Lane B — Contract Bonus

- **Effect:** Permanent +gold efficiency % across 3 tiers (+9% total at Tier 3).
- **Role:** Secondary economy amplifier. Slightly lower yield than Clean Loot but cheaper — efficient early.
- **Prerequisite:** Root Tier 1 purchased. Independent of Clean Loot (player may pick either or both).

### 6.6 Capstone — Campaign Command

- **Effect:** Mixed dmgMin/dmgMax bonus across 3 tiers. Tier 1 grants dmgMin, Tier 2 grants dmgMax, Tier 3 grants +1 to both.
- **Role:** Final polish on a mature build. Requires investment in multiple lanes before unlocking.
- **Prerequisite:** Both Combat lanes ≥ Tier 1 AND at least one Gold% lane ≥ Tier 1 (soft multi-lane gate per `01_rules.md` §27.4).

### 6.7 Tree loop mechanic

Loop 1 completion unlocks Loop 2, which presents the same 6-node structure with scaled RS costs (values deferred per v32 §5.7). Stats stack across loops with a compound gold% cap of `{TREE_LOOP_1_LANE_AB_COMPOUND_CAP_PCT}%`.

<!-- Locked: v33 | Last changed: v33 | CL: — Loop 2+ scaling deferred -->

---

## 7. Merge families

4 families define 4 archetypal playstyles. Values in `02_balance_values.md` §18. Rules in `01_rules.md` §25.

### 7.1 Stability

- **Primary stat:** dmgMin per slot (0 → +6 at T6).
- **4-slot family bias:** % damage vs slowed enemies (+5% at T6).
- **Sub-bonus (T5+):** +HP per slot.
- **Identity:** Steady-state fighter. Thrives on sustained DPS. Worm hunter (Worm moves 2 tiles — falls into "slowed" band less often, but Stability's dmgMin floor helps grind Worm HP).
- **Playstyle:** Safe, predictable, rewards player patience. The "no bad hits" family.

### 7.2 Burst

- **Primary stat:** dmgMax per slot (0 → +6 at T6).
- **4-slot family bias:** % Crit Damage (+5% at T6).
- **Sub-bonus (T5+):** +HP per slot.
- **Identity:** Explosive damage. Combines with Crit stacking for massive single-hit spikes. Best vs high-HP enemies (Worm, Fire boss).
- **Playstyle:** High-ceiling, high-variance. Rewards lucky rolls and crit chains. The "kill-in-one-hit" family.

### 7.3 Precision

- **Primary stat:** Crit Chance per slot (0 → +12% at T6, 4-slot total).
- **4-slot family bias:** % Double Strike (+5% at T6).
- **Sub-bonus (T5+):** +HP per slot.
- **Identity:** Chance-based combat amplifier. Synergizes with Keen Eye, Twin Sigil, Fatal Fang bag items.
- **Playstyle:** Snowballing chance stacks. Starts slow but at T6 + full bag combo can outperform raw-damage families.

### 7.4 Guard

- **Primary stat:** HP per slot (+30 at T6).
- **4-slot family bias:** % Lifesteal (+5% at T6).
- **Sub-bonus (T5+):** `{MERGE_GUARD_T5_SUB_BLOCK_PCT}%` Block% at T5, `{MERGE_GUARD_T6_SUB_BLOCK_PCT}%` Block% at T6 (distinct from other families — Guard's sub-bonus is Block%, not HP).
- **Identity:** Tanky survival. Highest HP ceiling, self-sustain via Lifesteal, partial nullification via Block.
- **Playstyle:** Attrition warfare. Low raw DPS but impossible to kill. Best vs Night-heavy content.

### 7.5 Family commitment trade-off

Per `01_rules.md` §25.6, family bias bonus requires 4-slot same-family match. Mixed-family builds get sub-bonuses only, no bias activation. This creates an explicit trade-off:

- **Commit to one family** → stronger bias, narrower tactical range.
- **Mix families** → flexible sub-bonuses, no bias amplification.

Both are valid build paths. Post-Test Đợt 1 tuning may adjust bias strength to keep the decision meaningful.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 8. Level manifests (Test Đợt 1: Lv1-Lv8)

Per user Q3 decision: this section stores `total enemy count + archetype breakdown + boss + mystery count + targets` per level. **Per-wave composition is NOT locked here** — it belongs in level JSON files in the content pipeline.

### 8.1 Level 1 — FTUE Tutorial

- **Enemy total:** 3 Slime.
- **Boss:** None.
- **Mystery cells:** 9 total across waves.
- **Wave count:** 3.
- **Win rate target:** 90-95% (FTUE must succeed).
- **Play time target:** ~5 min.
- **Theme:** Tutorial. Slime-only (predictable speed 1).

### 8.2 Level 2 — Slime dominance + Wind introduction

- **Enemy total:** 15 (10 Slime + 5 Wind).
- **Boss:** None.
- **Mystery cells:** 8 total.
- **Wave count:** 4.
- **Win rate target:** 85%.
- **Play time target:** ~6-7 min.
- **Theme:** First fast archetype (Wind) introduced.

### 8.3 Level 3 — Worm focus + first boss

- **Enemy total:** 22 regular + 1 Elite Worm boss.
- **Archetype breakdown (regular enemies):** Slime + Wind + Worm + Fire mix.
- **Boss:** Elite Worm at wave 5.
- **Mystery cells:** 5 total.
- **Wave count:** 5.
- **Win rate target:** 55-60%.
- **Play time target:** ~9 min.
- **Theme:** Worm focus; first boss encounter.

### 8.4 Level 4 — Mixed peak

- **Enemy total:** 24 regular.
- **Archetype breakdown:** Mixed Slime/Wind/Worm/Fire.
- **Boss:** None.
- **Mystery cells:** 5 total.
- **Wave count:** 5.
- **Win rate target:** 55%.
- **Play time target:** ~8-9 min.
- **Theme:** Mixed archetype practice.

### 8.5 Level 5 — Fire climax + boss (mid-game wall)

- **Enemy total:** 23 regular + 1 Elite Fire boss.
- **Archetype breakdown:** Slime + Worm + Fire dominant.
- **Boss:** Elite Fire at wave 5.
- **Mystery cells:** 5 total.
- **Wave count:** 5.
- **Win rate target:** 45-50% (expected retry point).
- **Play time target:** ~10 min.
- **Theme:** Mid-game wall. Fire pressure climax.
- **⚠️ Flag:** Wave stack risk ~45% — playtest priority observation per `01_rules.md` §17.3 V16.

### 8.6 Level 6 — Post-climax transition

- **Enemy total:** 25 regular.
- **Archetype breakdown:** Worm/Fire focus.
- **Boss:** None.
- **Mystery cells:** 5 total.
- **Wave count:** 5.
- **Win rate target:** 45-55%.
- **Play time target:** ~8-9 min.
- **Theme:** Post-boss cooldown; Worm/Fire grind.
- **⚠️ Flag:** Wave stack risk ~40% — playtest priority.

### 8.7 Level 7 — Late-mid boss

- **Enemy total:** 20 regular + 1 Elite Fire boss.
- **Archetype breakdown:** Mixed + Fire.
- **Boss:** Elite Fire (Lv7-scaled) at wave 5.
- **Mystery cells:** 5 total.
- **Wave count:** 5.
- **Win rate target:** 40-50%.
- **Play time target:** ~9-10 min.
- **Theme:** Late-mid boss gate.

### 8.8 Level 8 — Pre-endgame Fire grind

- **Enemy total:** 24 regular.
- **Archetype breakdown:** Fire-heavy.
- **Boss:** None.
- **Mystery cells:** 5 total.
- **Wave count:** 5.
- **Win rate target:** 35-45%.
- **Play time target:** ~9-10 min.
- **Theme:** Fire-heavy endgame preview.
- **⚠️ Flag:** Wave stack risk ~40% — playtest priority.

### 8.9 Level 9-10 — DEFERRED

Per v32 part1 §4.1, Lv9-10 are deferred to Đợt 2 as expert-replay content of Lv7-8. Not in Test Đợt 1 scope.

<!-- Locked: v33 | Last changed: v33 | CL: — Per-wave composition intentionally NOT in this file -->

---

**End of `03_content.md`.** 8 sections covering 4 enemy archetypes + 3 boss placeholders + 15 bag items + 15 fusion endpoints (6 locked + 9 deferred) + 6 tree nodes + 4 merge families + 8 level manifests.

Cross-references: numeric values → `02_balance_values.md`, rules → `01_rules.md`. Per-wave composition lives in level JSON (content pipeline), not in this file.
