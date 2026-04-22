# DiceBound Schema — v33

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 15 — new file)
- **Status:** ✅ Drafted. Some schemas carry v31 `Partial` tags preserved as-is.
- **Authoritative for:** Data contracts — runtime state, config inputs, persistence structure, telemetry events.
- **NOT authoritative for:** Numeric values (see `02_balance_values.md`), rule mechanics (see `01_rules.md`), entity behaviors (see `03_content.md`).

---

## Reading rules

1. Types use a TypeScript-like pseudo-notation for readability; actual implementation language is JavaScript per v31 codebase. Adapt syntax to target language (Unity/C# for future Unity port).
2. Field names use camelCase per v31 convention (exceptions noted inline).
3. `?` suffix marks optional fields. `[]` suffix marks arrays.
4. Semantic IDs (e.g., `enemy_slime`, `bag_guard_crest`) use snake_case for stability across localization and code generation.
5. Save-schema fields marked **v31-locked** must match the exact v31 field names for back-compat. v33 additions are clearly tagged.

---

## Section map

| § | Topic | Scope |
|---|---|---|
| 1 | Runtime state schemas | Player, enemy, bag, wave, level, UI state |
| 2 | Config schemas | Level manifest, enemy archetype, bag item, tree node, fusion recipe |
| 3 | Save/persistence schemas | `diceBoundPlayerData` + v33 additions, auxiliary keys |
| 4 | Event schema (telemetry) | SIRC/V16 verification event skeleton |
| 5 | Schema change rules | When/how to migrate, version bump protocol |

---

## 1. Runtime state schemas

Runtime state is the in-memory representation during active play. Lost on page refresh unless serialized through save system (§3).

### 1.1 PlayerRuntimeState

```ts
interface PlayerRuntimeState {
  // Core stats
  hp: { current: number, max: number };
  dmgMin: number;  // effective, post-bag
  dmgMax: number;  // effective, post-bag
  roll: { min: number, max: number };  // effective dice range, post-bag, per-phase
  
  // Chance stats (effective, capped per {CHANCE_CAP_*})
  critChance: number;         // 0..0.5
  critDamageBonus: number;    // e.g., 0.5 = +50%
  blockChance: number;        // 0..0.5
  doubleStrikeChance: number; // 0..0.5
  lifestealPct: number;       // 0..0.25
  
  // Position
  position: { x: number, y: number };
  
  // Bag (see BagRuntimeState §1.3)
  bag: BagRuntimeState;
  
  // Gold accumulated this run (not yet banked)
  runGold: number;
  
  // Derived (computed, not stored)
  power: number;  // hp.current + dmgMax, per §30.3
}
```

### 1.2 EnemyRuntimeState

```ts
interface EnemyRuntimeState {
  id: string;                     // instance ID, unique per level
  archetype: 'slime' | 'wind' | 'worm' | 'fire' | 'elite_worm' | 'elite_fire';
  level: number;                  // archetype level for stat scaling
  hp: { current: number, max: number };
  dmgMin: number;
  dmgMax: number;
  moveSpeed: { min: number, max: number };  // baseline; Night multiplier applied at phase transition
  position: { x: number, y: number };
  alive: boolean;                 // false after death until removed
  waveIndex: number;              // which wave spawned this enemy (for wave-stacking metrics)
}
```

**Note (Partial per v31 §8.2):** `badge/power` not stored — computed runtime as `hp.current + dmgMax`. `introSeen` not on enemy — lives in save-global flags per archetype.

### 1.3 BagRuntimeState

```ts
interface BagRuntimeState {
  slots: BagSlot[];                    // length = {BAG_ACTIVE_SLOTS}, each slot may be null
  rerollUsedThisLevel: boolean;        // consumed if player used reroll in §18.4
  pendingPopup?: BagPopupState;        // active if popup open
}

interface BagSlot {
  itemId: string;                // e.g., 'bag_guard_crest', 'fusion_bulwark_line'
  level: number;                 // 1..3 for base items; fusion items don't level
  isFusion: boolean;             // true if this is a fusion endpoint
  fusionReady?: boolean;         // true if item is part of a ready recipe pair (§18.9)
}

interface BagPopupState {
  source: 'enemy_death' | 'mystery_cell';
  choices: BagOfferedItem[];     // length = {BAG_POPUP_CHOICE_COUNT}
  playerChoice?: number;         // index in choices[] when picked
  replaceBranch?: {              // active only when bag full and player picked
    pickedItem: BagOfferedItem;
    // Next tap: player selects slot index to replace
  };
}

interface BagOfferedItem {
  itemId: string;
  level: number;                 // offered level (1 for new, existing+1 for upgrade)
  choiceType: 'new' | 'upgrade' | 'fusion_ready' | 'off_path';
  slotImpact: 'fits_empty' | 'requires_replace';
  recipeRelation?: string;       // fusion endpoint ID if this pick completes a recipe
}
```

### 1.4 WaveRuntimeState

```ts
interface WaveRuntimeState {
  waveIndex: number;
  status: 'queued' | 'spawned' | 'active' | 'cleared';
  spawnedAtTurn?: number;
  clearedAtTurn?: number;
  previewPositions?: Array<{ x: number, y: number, type: 'enemy' | 'mystery' }>;
}

interface LevelWaveState {
  waves: WaveRuntimeState[];
  activeWaveCount: number;       // waves where status=='spawned' or 'active' (for V16 tracking)
}
```

### 1.5 LevelRuntimeState

```ts
interface LevelRuntimeState {
  levelIndex: number;            // 1..8 for Test Đợt 1
  mapSize: { w: number, h: number };  // currently 8×11 for all levels
  
  // Day/Night cycle tracking
  phase: 'day' | 'night';
  roundIndex: number;            // 1-based, round counter within level
  roundPhaseIndex: number;       // 1..{DAY_BLOCK_TURNS} for Day, 1..{NIGHT_BLOCK_TURNS} for Night
  
  // Entity lists
  enemies: EnemyRuntimeState[];
  mysteryCells: MysteryCellRuntimeState[];
  healPotions: HealPotionRuntimeState[];
  
  // Wave state
  waveState: LevelWaveState;
  
  // Turn state
  currentTurn: 'player_before_roll' | 'player_reachable_preview' | 'player_moving' 
             | 'combat' | 'enemy_turn' | 'win' | 'lose';
  turnCounter: number;           // total turns elapsed this level
  
  // Run-level aggregate
  enemiesKilled: number;
  equipmentDropped: number;
}

interface MysteryCellRuntimeState {
  id: string;
  position: { x: number, y: number };
  consumed: boolean;
}

interface HealPotionRuntimeState {
  id: string;
  position: { x: number, y: number };
  spawnedAtTurn: number;
}
```

### 1.6 UIRuntimeState

UI state mirrors the gameplay state (per `01_rules.md` §29.1) with UI-specific additions:

```ts
interface UIRuntimeState {
  gameState: LevelRuntimeState['currentTurn'];
  
  // Toggles (persist across level boundary if same session)
  threatPreviewOn: boolean;       // default true
  
  // Transient UI
  tapEnemyTooltipFor?: string;    // enemy ID if tooltip visible (only one at a time)
  activeModal?: 'bag_popup' | 'enemy_intro' | 'result_table' 
              | 'merge_popup' | 'equipment_info';
  
  // Phase warning flag
  nightWarningShown: boolean;     // set true when Night warning displayed this phase cycle
}
```

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 2. Config schemas

Config schemas describe data loaded at runtime (level JSON, archetype definitions, item definitions). These files live in the content pipeline, not in player save.

### 2.1 LevelConfig

```ts
interface LevelConfig {
  levelIndex: number;            // 1..10
  mapSize: { w: number, h: number };
  playerStart: { x: number, y: number };  // v31-locked
  
  // Per-wave composition (this IS in level JSON, just NOT in 03_content.md — per user Q3)
  waves: WaveConfig[];
  
  // Static placements
  mysteryCells: Array<{ id: string, x: number, y: number }>;  // v31-locked schema
  specialTiles: Array<{ type: string, x: number, y: number }>;  // v31-locked schema
  
  // Win condition
  objective: {
    objectiveType: 'defeat_all_enemies_across_all_waves';  // current v33 only value
    targetValue?: number;
  };
}

interface WaveConfig {
  waveIndex: number;             // 1-based within level
  enemies: EnemyPlacement[];     // spawned at wave trigger
  mysteries: Array<{ id: string, x: number, y: number }>;  // spawned at wave trigger
  bossSlot?: BossPlacement;      // present only on boss waves (per §2 of 03_content.md)
}

interface EnemyPlacement {
  enemyId: string;               // references enemy archetype definition
  position: { x: number, y: number };
}

interface BossPlacement {
  archetypeId: 'elite_worm' | 'elite_fire';
  levelAnchor: number;           // stat-scaling level (matches level it appears at)
  position: { x: number, y: number };
}
```

### 2.2 EnemyArchetypeConfig

```ts
interface EnemyArchetypeConfig {
  archetypeId: 'slime' | 'wind' | 'worm' | 'fire';
  visualId: string;              // 'enemy_slime' etc.
  baseStatsLv1: {
    hp: number;
    dmgMin: number;
    dmgMax: number;
    moveSpeed: { min: number, max: number };
  };
  goldBand: 'low' | 'mid' | 'high';
  scalingRule: {
    hpPerLevel: number;          // = {ENEMY_HP_PER_MAIN_LEVEL} = 10
    dmgPerNLevels: number;       // = {ENEMY_DMG_SCALING_STEP} = 5
    dmgNLevelInterval: number;   // = {ENEMY_DMG_SCALING_INTERVAL} = 2
    dmgCapBonus: number;         // = {ENEMY_DMG_SCALING_CAP_BONUS} = 15
  };
  introText: string;             // localization key
}
```

**Scaling note:** `moveSpeed` is ARCHETYPE-LOCKED and never scales per enemy level. This is a protected invariant (per `01_rules.md` §13.3).

### 2.3 BagItemConfig

```ts
interface BagItemConfig {
  itemId: string;                // e.g., 'bag_guard_crest'
  displayName: string;           // localization key
  family: 'guard' | 'stability' | 'burst' | 'precision' | 'utility' | 'route' | 'sustain' | 'day' | 'night';
  category: 'utility' | 'combat';
  
  // Effect definition
  effectType: 'flat' | 'percentage';
  statTarget: 'hp' | 'dmg_min' | 'dmg_max' | 'crit_chance' | 'crit_damage' 
            | 'block_chance' | 'double_strike_chance' | 'lifesteal'
            | 'roll_min' | 'roll_max' | 'heal_pct_per_pickup' 
            | 'night_dmg_reduction' | 'day_dmg' | 'night_dmg';
  phaseGate?: 'day' | 'night';   // if present, effect only active in specified phase
  
  // Magnitudes per level (Lv1/Lv2/Lv3)
  magnitudes: [number, number, number];  // order: Lv1, Lv2, Lv3
  
  // Weighting (for bag offer computation — per §18.8)
  baseWeightByPhase: {
    early: number;
    mid: number;
    end: number;
  };
}
```

### 2.4 TreeNodeConfig

```ts
interface TreeNodeConfig {
  nodeId: 'root' | 'steady_hand' | 'finishers_edge' | 'clean_loot' 
        | 'contract_bonus' | 'campaign_command';
  displayName: string;           // localization key
  lane: 'hp' | 'combat_a' | 'combat_b' | 'gold_a' | 'gold_b' | 'capstone';
  
  prerequisites: {
    requiredNodeId?: string;              // e.g., 'steady_hand' for 'finishers_edge'
    requiredTier?: number;                // full-tier prerequisite (3 = must be maxed)
    softGateConditions?: SoftGate[];      // for Capstone
  };
  
  tiers: TreeNodeTier[];         // length 3 for v33
}

interface TreeNodeTier {
  tier: 1 | 2 | 3;
  costRS: number;                // rune shard cost for this tier
  effect: {
    statTarget: 'hp' | 'dmg_min' | 'dmg_max' | 'gold_pct';
    magnitude: number;
  };
}

interface SoftGate {
  nodeId: string;
  minTier: number;
}
```

### 2.5 FusionRecipeConfig

```ts
interface FusionRecipeConfig {
  endpointId: string;            // e.g., 'fusion_bulwark_line'
  displayName: string;
  recipeItems: [string, string]; // e.g., ['bag_guard_crest_lv3', 'bag_stable_edge_lv3']
  package: string;               // e.g., 'Guard + Stability'
  role: string;                  // e.g., 'Safe bruiser'
  bonus: {
    statTarget: string;
    magnitude: number;
    phaseGate?: 'day' | 'night';
    effectType: 'flat' | 'percentage';
  };
}
```

<!-- Locked: v33 | Last changed: v33 | CL: — Wave config schema keeps v31 "Partial" status; exact JSON format per level still implementation-defined -->

---

## 3. Save/persistence schemas

Save data persists across sessions in `localStorage` (or Unity PlayerPrefs post-port). Key names are **v31-locked** — never rename without migration code.

### 3.1 diceBoundPlayerData (primary save object)

```ts
interface DiceBoundPlayerData {
  // v33 metadata
  saveVersion: string;           // e.g., "v33.0"
  savedAt: number;               // epoch ms
  
  // Player baseline (v31-locked field names)
  hp: number;                    // current persisted HP (max derived from tree + equipment)
  dmgMin: number;                // baseline, NOT post-bag
  dmgMax: number;                // baseline
  gold: number;                  // total banked gold (separate from diceBoundTotalGold — see §3.2 note)
  
  // Equipment (piece-based merge state + slot-based upgrade state)
  equipment: EquipmentSaveData;
  
  // Rune Shard economy (v33 addition — v32 introduced dual currency)
  runeShard: number;             // current balance
  
  // Progression
  permanentUpgrades: any;        // v31-locked legacy field — migration target for tree+equipment
  selectedMap: string;           // current/last level ID
  goldTechTree: GoldTechTreeSaveData;
  runeProgress: RuneTrialSaveData;   // v33 addition
  
  // Idle reward accumulator (v33 addition)
  idleReward: IdleRewardSaveData;
  
  // Bag state (if saving mid-run — optional)
  currentRun?: RunStateSaveData;
}
```

### 3.2 diceBoundTotalGold (legacy key)

```ts
// Separate localStorage key — v31-locked name
// Historical: kept separate for analytics; sums cumulative gold earned (not current balance)
interface DiceBoundTotalGold {
  totalGold: number;             // cumulative, monotonic increasing
  earnedThisRun: number;         // per-run counter
  spentTotal: number;            // cumulative sink spending
}
```

### 3.3 EquipmentSaveData

```ts
interface EquipmentSaveData {
  // Slot upgrade levels (slot-based per §24.1)
  slotLevels: {
    weapon: number;              // 1..20
    auxiliary: number;
    helmet: number;
    armor: number;
  };
  
  // Currently equipped piece IDs per slot
  equipped: {
    weapon: string | null;       // piece ID or null if unequipped
    auxiliary: string | null;
    helmet: string | null;
    armor: string | null;
  };
  
  // Owned equipment list (piece-based merge state per §25.1)
  owned: OwnedEquipmentPiece[];
}

interface OwnedEquipmentPiece {
  pieceId: string;               // unique instance ID
  archetype: 'weapon' | 'auxiliary' | 'helmet' | 'armor';
  family: 'stability' | 'burst' | 'precision' | 'guard';
  mergeTier: 1 | 2 | 3 | 4 | 5 | 6;  // piece-based tier
  acquiredAt: number;            // epoch ms, for sort ordering
}
```

### 3.4 GoldTechTreeSaveData (v31-locked structure + v33 refinement)

```ts
interface GoldTechTreeSaveData {
  version: string;               // migration version, e.g., "v33.tree.1"
  nodes: {
    [nodeId: string]: {          // nodeId uses semantic IDs per §2.4
      level: 0 | 1 | 2 | 3;      // 0 = not purchased
      purchasedAt: number;       // epoch ms of last purchase
    };
  };
  // 'unlocked' field DERIVED at runtime — not persisted (per v31 §8.1)
  
  // v33 addition: loop tracking
  currentLoop: 1 | 2 | 3;        // which loop player is on
  loopCompletions: Array<{ loop: number, completedAt: number }>;
}
```

### 3.5 RuneTrialSaveData (v33 addition)

```ts
interface RuneTrialSaveData {
  highestClearedStage: number;   // 0 = never cleared
  stageClearMap: { [stageIndex: string]: { firstClearedAt: number } };
  dailyRewardedWinsUsed: number; // resets daily
  lastDailyResetAt: number;      // epoch ms of last 7:00 reset (⚠️ timezone OPEN per §23.5)
}
```

### 3.6 IdleRewardSaveData (v33 addition)

```ts
interface IdleRewardSaveData {
  lastClaimAt: number;           // epoch ms
  accruedGold: number;           // pending claim
  accruedEquipmentRolls: number; // count of unclaimed T1 rolls
  // On claim: system processes rolls, adds to owned equipment, resets counters, updates lastClaimAt
}
```

### 3.7 Auxiliary save keys (v31-locked)

```ts
// Separate localStorage keys — DO NOT merge into diceBoundPlayerData
// Each has its own key name, documented here for completeness:

// Key: 'dicebound_enemy_intro_seen_v1'
interface EnemyIntroSeenSave {
  [archetypeId: string]: boolean;  // e.g., { slime: true, wind: true, ... }
}

// Key: 'dicebound_playtest_map'
interface PlaytestMapSave {
  // Playtest-only flow; not shipped in prod
  currentTestMap?: string;
  testRunsCompleted?: number;
}
```

### 3.8 RunStateSaveData (optional — mid-run persistence)

```ts
// Only used if save/resume mid-run is implemented (v31 §8.1 direction)
interface RunStateSaveData {
  currentLevel: LevelRuntimeState;  // full level snapshot
  playerRun: PlayerRuntimeState;    // in-run player state
  savedAtTurn: number;
}
```

**⚠️ v31 §8.1 flag:** "Save/resume giữa màn hiện direction là lưu player state + enemy runtime state + tile state... exact serialized contract vẫn Partial." v33 keeps this status — full mid-run resume schema is a nice-to-have, not required for Test Đợt 1.

<!-- Locked: v33 | Last changed: v33 | CL: — Mid-run resume remains Partial; RuneTrialSaveData timezone policy flagged for Session 16 -->

---

## 4. Event schema (telemetry)

Events feed verification systems (V14 SIRC, V16 Wave Stacking, and future playtest observability). This is a SKELETON — not all events must emit in Test Đợt 1, but the schema is locked so emission can be added incrementally.

### 4.1 Event envelope

```ts
interface TelemetryEvent {
  eventType: string;              // see §4.2 catalog
  eventVersion: string;           // e.g., "v33.1" — bump on schema change
  timestamp: number;              // epoch ms
  sessionId: string;              // client-generated per app launch
  playerId?: string;              // if logged in; anonymous otherwise
  payload: object;                // shape depends on eventType
}
```

### 4.2 Event catalog (Test Đợt 1 minimum set)

**Combat events:**
- `combat_started` — payload: `{ enemyId, playerStats, enemyStats, levelIndex, phase }`
- `combat_hit` — payload: `{ initiator: 'player'|'enemy', baseDmg, wasCrit, wasBlocked, wasDoubleStrike, finalDmg, lifestealHeal }`
- `combat_ended` — payload: `{ winner: 'player'|'enemy', turnsElapsed, finalPlayerHp }`

**Movement events:**
- `dice_rolled` — payload: `{ rollValue, rollMin, rollMax }`
- `path_committed` — payload: `{ path: Array<{x,y}>, phase }`

**Bag events (critical for V14 SIRC active-side sizing):**
- `bag_popup_opened` — payload: `{ source, offered: BagOfferedItem[] }`
- `bag_popup_resolved` — payload: `{ action: 'pick'|'reroll'|'skip'|'replace', chosenItemId?, replacedItemId?, bagState }`
- `fusion_executed` — payload: `{ endpointId, consumedItems, bagState }`

**Level events:**
- `level_started` — payload: `{ levelIndex, playerStats, equippedState }`
- `wave_spawned` — payload: `{ waveIndex, enemyCount, activeWaveCount }` ← **required for V16 active_waves_count tracking**
- `level_ended` — payload: `{ result: 'win'|'lose', enemiesKilled, goldEarned, equipmentDropped, daysReached, playTimeSec }`

**Economy events (critical for V14 SIRC):**
- `gold_earned` — payload: `{ amount, source: 'kill'|'efficiency'|'idle_claim', levelIndex }`
- `gold_spent` — payload: `{ amount, sink: 'equipment_upgrade'|'equipment_merge' }`
- `rune_shard_earned` — payload: `{ amount, source: 'rune_trial_clear'|'rune_trial_sweep', stageIndex }`
- `rune_shard_spent` — payload: `{ amount, sink: 'tree_node_purchase', nodeId, tier }`
- `idle_claimed` — payload: `{ goldAmount, equipmentRolls, equipmentDropped, timeSinceLastClaim }`

**Progression events:**
- `equipment_upgraded` — payload: `{ slot, fromLevel, toLevel, goldCost }`
- `equipment_merged` — payload: `{ rootPieceId, fromTier, toTier, consumedPieceIds, goldCost }`
- `tree_node_purchased` — payload: `{ nodeId, fromTier, toTier, rsCost }`

**Rune Trial events:**
- `rune_trial_entered` — payload: `{ stageIndex, dailyWinsRemaining }`
- `rune_trial_resolved` — payload: `{ stageIndex, result: 'win'|'lose', rewardedWinConsumed, rsEarned }`

### 4.3 V16 Wave Stacking instrumentation

To support V16 verification (per `01_rules.md` §17.3), emit `wave_spawned` at every wave trigger with `activeWaveCount` populated. Analytics aggregates over 1000+ seed runs to compute `P(activeWaveCount ≥ 3 at Day 3 block)`. Target: ≤ `{WAVE_STACK_DAY_3_MAX_PCT}%`.

### 4.4 V14 SIRC instrumentation

Aggregate daily gold by source for each Main Run tier (Lv1/3/5/7/10):

```
SIRC_daily_ratio(tier) = SUM(idle_claimed.goldAmount where tier)
                      / SUM(gold_earned.amount where source=='kill'|'efficiency' AND tier)
```

Target per `{OUT_OF_RUN_IDLE_CEILING_PCT}%` framework ceiling. Current v32 verification passed 19%-45% range across 5 tiers.

### 4.5 Event retention

- Local buffer: last 1000 events kept client-side.
- Transmission: batched upload at session end (not yet implemented in Test Đợt 1).
- Schema evolution: bump `eventVersion` when payload shape changes; maintain v33.1 → v33.2 migration in analytics side.

<!-- Locked: v33 | Last changed: v33 | CL: — Emission is progressive; Test Đợt 1 minimum is combat + level + economy events -->

---

## 5. Schema change rules

### 5.1 When to bump schema version

Bump **runtime schema** version: never (runtime is transient, regenerate on load).

Bump **config schema** version: when a breaking change to level/archetype/item config structure occurs. Migration code not required (content is re-authored).

Bump **save schema** version (`saveVersion` in `DiceBoundPlayerData`): REQUIRED when any v31-locked field name changes, or new mandatory field added to save object. Always include migration code that upgrades from previous version.

Bump **event schema** version (`eventVersion`): when telemetry payload shape changes.

### 5.2 Save migration protocol

On load:
1. Read `saveVersion` field.
2. If version matches current → proceed.
3. If version older → run migration chain (v32 → v33 → v34 ...) each adding fields with defaults.
4. If version newer → refuse to load, prompt user to update app.

Default values for new v33 fields when migrating from v32 save:
- `runeShard` = 0
- `runeProgress` = empty object defaults
- `idleReward` = `{ lastClaimAt: now, accruedGold: 0, accruedEquipmentRolls: 0 }`
- `goldTechTree.currentLoop` = 1
- `goldTechTree.loopCompletions` = []

### 5.3 Forbidden operations

- NEVER delete a field from v31-locked save schema without migration.
- NEVER repurpose a field name (old semantic → new semantic). Use new field name + deprecate old.
- NEVER change enum string values without migration (e.g., don't rename `'slime'` → `'enemy_slime'` in archetype field).

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

**End of `04_schema.md`.** 5 sections covering 6 runtime schemas + 5 config schemas + 8 save schemas + event skeleton + migration rules.

Cross-references: numeric values → `02_balance_values.md`, rules → `01_rules.md`, entity behaviors → `03_content.md`. This file is the data contract layer — schema shape only, no mechanics.
