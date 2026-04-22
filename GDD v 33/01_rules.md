# DiceBound Rules — v33

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 17 cleanup — terminology standardized, §28 is placeholder per Session 16 patch)
- **Status:** ✅ All 31 sections locked. 121 `{ID}` references verified, 0 missing. §28 = intentional placeholder (feature removed). File is authoritative for DiceBound v33 runtime rules.
- **Authoritative for:** Runtime rules, state transitions, resolution order, invariants.
- **NOT authoritative for:** Numeric values (see `02_balance_values.md`). This file references values via `{ID}` syntax only.

**Open questions deferred to Session 16 (`07_open_questions.md`):**
- Rune Trial daily reset timezone (§23.5)
- Fusion slot accounting verification (§26.8)
- Loop 2+ tree scaling (§27.9)

---

## Reading rules

1. Every `{CAPS_WITH_UNDERSCORES}` token is a reference to an ID in `02_balance_values.md`. Replace mentally with the locked value when implementing.
2. No literal numbers may appear in rule statements. If you see one, that's a bug — log it for cleanup Session.
3. Every rule section ends with an HTML comment Lock marker: `<!-- Locked: v33 | Last changed: v33 | CL: — -->`. When a rule changes in a future version, update the marker and log the changelog (`CL:`) entry pointing to `_CHANGELOG.md`.
4. Vietnamese commentary blocks (marked `Commentary (VI):`) are for human-reader context and are NOT part of the rule. LLMs implementing this file should read English rule text as authoritative.

---

## Section map

This file is being written across Sessions 6-13 in 4 passes:

| § | Topic | Session | Status |
|---|---|---|---|
| 1 | State flow | 6-7 | ✅ Locked |
| 2 | Turn structure | 6-7 | ✅ Locked |
| 3 | Player input (BeforeRoll) | 6-7 | ✅ Locked |
| 4 | Dice roll mechanics | 6-7 | ✅ Locked |
| 5 | Path drag + movement | 6-7 | ✅ Locked |
| 6 | Mid-path priority + interactions | 6-7 | ✅ Locked |
| 7 | Combat trigger | 6-7 | ✅ Locked |
| 8 | Combat per-hit resolution | 6-7 | ✅ Locked |
| 9 | Combat end conditions | 6-7 | ✅ Locked |
| 10 | Damage Guard invariant | 6-7 | ✅ Locked |
| 11 | Chance stat caps | 6-7 | ✅ Locked |
| 12 | Heal potion behavior | 6-7 | ✅ Locked |
| 13 | Enemy AI behavior | 6-7 | ✅ Locked |
| 14 | Day/Night phase behavior | 6-7 | ✅ Locked |
| 15 | Win / Lose conditions | 6-7 | ✅ Locked (partial-gold resolved per v31) |
| 16 | Level structure + wave spawn | 8-9 | ✅ Locked |
| 17 | Wave overlap + stacking | 8-9 | ✅ Locked |
| 18 | Mystery cell + Battlefield Bag flow | 8-9 | ✅ Locked |
| 19 | Difficulty scoring (PS_day, ESP, ECP, TPP, RR) | 8-9 | ✅ Locked |
| 20 | Anti-frustration gates (G1/G2/G3) | 8-9 | ✅ Locked |
| 21 | Economy currency flows (DSSM) | 10-11 | ✅ Locked |
| 22 | Idle reward claim behavior | 10-11 | ✅ Locked |
| 23 | Rune Trial structure | 10-11 | ✅ Locked |
| 24 | Equipment Upgrade rules | 10-11 | ✅ Locked |
| 25 | Equipment Merge rules | 10-11 | ✅ Locked |
| 26 | Bag item upgrade + fusion rules | 10-11 | ✅ Locked |
| 27 | Gold Tech Tree unlock rules | 10-11 | ✅ Locked |
| 28 | [REMOVED — no power-up selection in v33] | 10-11, 16 | ✅ Locked (section placeholder) |
| 29 | UI state list + invariants | 12 | ✅ Drafted |
| 30 | HUD + readout rules | 12 | ✅ Drafted |
| 31 | Cross-system invariants (V1-V18) | 13 | ✅ Locked |

---

# PART A — Combat + State Flow (Session 6 draft)

## 1. State flow

### 1.1 Canonical runtime states

The runtime state machine defines these named states, and implementations must preserve these names unless the user explicitly requests a design change:

- `BeforeRoll` — player is observing the board; roll has not happened this turn.
- `ReachablePreview` — player has rolled; reachable cells are shown; drag has not started or is in progress.
- `Moving` — player has committed a path by releasing drag; character is animating to destination.
- `Combat` — combat screen is open (triggered mid-`Moving` or directly by enemy contact).
- `EnemyTurn` — enemies act sequentially; no player input accepted.
- `WinText` — level win resolution screen followed by result table.
- `LoseText` — level lose resolution screen.

Additional states may be added only when justified by a real mechanic or UI flow.

### 1.2 Runtime invariants

- **Single committed move resolves the turn.** Once the player releases drag, the move commits and the player turn ends after all mid-path interactions resolve. No take-backs.
- **Enemy actions resolve sequentially.** One enemy's turn does not begin until the previous enemy's turn has fully resolved (including any combat triggered).
- **State/orchestration layer owns transition order.** Gameplay systems (combat, rewards, special cells) must not bypass the state flow with hidden side effects.
- **Player turn order (unless explicitly overridden):**
  1. Roll
  2. Preview reachable cells
  3. Select target cell (drag)
  4. Move
  5. Resolve special-cell effects
  6. Resolve combat if triggered
  7. Resolve mystery rewards if triggered
  8. Check objective / win / lose
  9. End player turn
  10. Run enemy turn sequentially

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 2. Turn structure

### 2.1 Alternation

Player turn and Enemy turn alternate. A "full round" is one Player turn plus one Enemy turn.

### 2.2 Day/Night cycle

Day/Night phase runs in parallel to turn counter. The cycle is:

- `{DAY_BLOCK_TURNS}` full rounds in **Day** phase.
- Then `{NIGHT_BLOCK_TURNS}` full rounds in **Night** phase.
- Then cycle repeats: Day → Night → Day → ...

The cycle starts from Day at turn 1. Transitions happen between rounds (not mid-round).

### 2.3 Wave spawn

- Wave 1 spawns deterministically at turn `{WAVE_FIRST_SPAWN_TURN}`.
- Wave N+1 spawns at the first Player turn of Day block N+1.
- Wave spawn interval = `{WAVE_SPAWN_INTERVAL_TURNS}` turns (= one full Day+Night cycle).
- Enemies from previous waves are NOT cleared when a new wave spawns. Wave overlap is intentional (see §17, Session 8-9).

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 3. Player input (BeforeRoll state)

### 3.1 Observation actions (do not consume turn)

At `BeforeRoll`, before rolling, the player may:

- **Tap an enemy** to toggle a tooltip above that enemy's head. Tooltip shows: archetype name, level, HP, DMG min-max, moveSpeed min-max. Only one tooltip visible at a time — tapping a different enemy closes the old and opens the new.
- **Toggle enemy threat preview HUD.** When on (default), all alive enemies display reachable-tile preview for their current phase, considering obstacles/walkability/pathing. Preview uses dark red for `moveSpeedMin` and light red for `moveSpeedMax`.

These interactions do not consume the roll, do not commit a move, and do not change turn state.

### 3.2 Committing actions

At `BeforeRoll`, the player has exactly two committing actions:

1. **Roll** — advances state to `ReachablePreview`.
2. **Skip Turn** — ends the player turn immediately, no roll, no movement.

There is no "End Turn" button in the visible UI. The manual end-turn hidden path is disabled. `Skip Turn` is the only way to pass without moving.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 4. Dice roll mechanics

### 4.1 Roll range

On `Roll`, the system produces an integer `X` uniformly drawn from `[{PLAYER_ROLL_MIN}, {PLAYER_ROLL_MAX}]` inclusive.

### 4.2 Usable range

The player is allowed to commit any path of length `L` where `1 ≤ L ≤ X`. The player cannot commit a path of length 0 — staying put is only possible via `Skip Turn` from `BeforeRoll`, not after rolling.

Any unused movement (`X - L`) is discarded on commit.

### 4.3 Phase-specific dice modifiers

Day-specific dice bonuses (e.g., Sun Compass bag item adds to `{PLAYER_ROLL_MAX}` during Day phase) apply only during the corresponding phase. See §26 Bag item rules (Session 10-11) for full phase-dependent behavior.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 5. Path drag + movement

### 5.1 Path drag from current cell

After Roll, the player drags a path preview starting from the character's current cell. During drag:

- Character remains visually on the current cell. UI must NOT present drag as pulling the character sprite.
- Path preview displays the route the player is currently tracing.
- Player may visit up to `X` cells where `X` is the rolled value (see §4).
- Path cannot repeat any cell already visited in the same turn.
- Path must follow grid adjacency rules (no diagonal unless future design adds it).

### 5.2 Commit on release

Releasing the drag commits the move. The state transitions to `Moving` and the character animates along the committed path. No confirmation prompt.

### 5.3 Mid-path resolution

As the character traverses the committed path, interactions resolve at each cell traversed (not only at the destination). See §6 for priority and continuation rules.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 6. Mid-path priority + interactions

### 6.1 Per-cell resolution priority

When the character enters a cell that contains one or more interaction triggers, the engine resolves them in this order:

1. **Special tile effects** (e.g., hazard tile if design adds them — none in current v33).
2. **Combat** — if the cell contains an enemy, enter `Combat` state.
3. **Mystery reward** — if the cell is a mystery cell, open Battlefield Bag popup (see §18, Session 8-9).
4. **Gold pickup** — if the cell has a gold drop, auto-pickup (no popup).

If multiple triggers exist on the same cell, resolve in order above.

### 6.2 Mid-path continuation rule

If an interaction resolves without triggering a fail state or a hard-stop state, movement continues along the remaining path after the interaction's resolution screen closes.

- Combat resolved with player win → continue remaining path.
- Combat resolved with player loss → enter `LoseText`, path abandoned.
- Mystery reward resolved (player picked item or skipped) → continue remaining path.
- Gold pickup → continue remaining path with no state change.

### 6.3 Terminal interactions

The following cell interactions terminate the path immediately regardless of remaining cells:

- Player HP reaches 0 → `LoseText`.
- All level-objective enemies defeated AND last wave cleared → `WinText`.

### 6.4 Mystery cell persistence across waves

Unpicked mystery cells from a prior wave are NOT cleared when a new wave spawns. They persist on the board until the player picks them up or the level ends.

### 6.5 Wave-spawn overlap exceptions

When a new wave spawns (at the first Player turn of a new Day block), spawn positions may coincide with the player's current cell. Handle as follows:

- **Enemy spawns on player's cell:** the spawning enemy attacks the player immediately as a special overlap exception. This attack resolves before the player's roll for the current turn.
- **Mystery cell spawns on player's cell:** the player receives the mystery pick immediately (Battlefield Bag popup opens before roll).
- **Gold spawn on player's cell** (if design adds this later): auto-pickup, no popup.

Post-exception, the player turn continues normally at `BeforeRoll` for any remaining board interactions.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 7. Combat trigger

### 7.1 Trigger conditions

Combat enters the `Combat` state when either side actively steps onto the other's cell:

- Player traverses into a cell occupied by an enemy (during `Moving`).
- Enemy moves into the cell occupied by the player (during `EnemyTurn`).

Combat is mutual-contact-triggered — there is no ranged-attack system in v33.

### 7.2 Initiator attacks first

The party that initiated contact (stepped onto the other) attacks first. This applies regardless of which "turn" owns the moment — if an enemy walks into the player during `EnemyTurn`, the enemy attacks first.

### 7.3 Combat screen

Combat is presented on a dedicated full-screen combat screen (not inline on the board). Post-combat, the character position resolves at the meeting point (the cell where contact occurred).

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 8. Combat per-hit resolution

### 8.1 Per-hit resolution order

Every hit resolves in this exact order:

1. **Base damage roll** — attacker rolls damage from their `[dmgMin, dmgMax]` range.
2. **Crit check** — roll against attacker's effective Crit Chance (capped at `{CHANCE_CAP_CRIT_PCT}%`).
3. **Apply crit damage if success** — multiply base damage by `{PLAYER_CRIT_DAMAGE_MULTIPLIER}` (for player) or by the equivalent enemy crit multiplier (currently same value in v33).
4. **Defender block check** — defender rolls against their effective Block Chance (capped at `{CHANCE_CAP_BLOCK_PCT}%`). On success, damage is nullified entirely for this hit.
5. **Apply final damage** — subtract final damage from defender HP.
6. **Lifesteal from final damage dealt** — attacker heals a fraction equal to their effective Lifesteal % (capped at `{CHANCE_CAP_LIFESTEAL_PCT}%`) of the damage actually applied. Lifesteal from 0 damage (blocked hit) yields 0 heal.
7. **Double Strike check** — roll against attacker's effective Double Strike Chance (capped at `{CHANCE_CAP_DOUBLE_STRIKE_PCT}%`).

### 8.2 Double Strike behavior

- On Double Strike success, the current attack generates exactly ONE extra hit immediately after step 5 resolves (final damage applied).
- The extra hit re-runs steps 1-6 of the per-hit flow independently (own base damage roll, own crit check, own block check, own lifesteal).
- **The extra hit SKIPS step 7** — extra hits never roll for Double Strike. This hard-blocks chaining: max 1 extra hit per base attack, always.

**Commentary (VI):** v31 ghi rõ "Double Strike không chain; mỗi attack tạo tối đa 1 extra hit". v33 làm rule cụ thể hơn bằng cách bỏ step 7 ở extra hit — implementation không cần logic "track depth", chỉ cần gate step 7 theo is_extra_hit flag.

### 8.3 Chance cap enforcement

All chance-based stats are globally capped:

- Crit Chance ≤ `{CHANCE_CAP_CRIT_PCT}%`
- Block Chance ≤ `{CHANCE_CAP_BLOCK_PCT}%`
- Double Strike Chance ≤ `{CHANCE_CAP_DOUBLE_STRIKE_PCT}%`
- Lifesteal ≤ `{CHANCE_CAP_LIFESTEAL_PCT}%`

If accumulated bonuses exceed the cap, the excess is ignored (no overflow to other stats).

**Commentary (VI):** v31 đã có cap `{CHANCE_CAP_CRIT_PCT}%` cho 3 chance-based stats; v32 thêm cap `{CHANCE_CAP_LIFESTEAL_PCT}%` cho Lifesteal vì nhóm Guard family có thể stack Lifesteal cao gây runaway sustain.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 9. Combat end conditions

### 9.1 Exit when HP reaches 0

Combat ends when one side's HP reaches 0. No flee, no escape, no surrender.

### 9.2 Post-combat state routing

- **Player wins mid-movement:** resolve at the meeting cell. Remaining path from §5 continues.
- **Player wins during `EnemyTurn` contact:** enemy turn continues with the next enemy; combat was a sub-interaction within the current enemy's action.
- **Player loses:** state transitions to `LoseText` regardless of context.

### 9.3 Position after win

- If player kills enemy mid-path, player is placed on the cell where the enemy died (= the meeting cell). Movement continues from that cell with remaining path length.
- If enemy attacked player during `EnemyTurn` and enemy was defeated in the counter-exchange, the enemy's cell is vacated; player stays on their current cell.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 10. Damage Guard invariant (TIER 1)

### 10.1 Rule statement

The player's effective damage range must satisfy both constraints at all times:

- `dmgMax - dmgMin ≤ {DAMAGE_GUARD_MAX_GAP}` (absolute gap cap).
- `dmgMin ≥ {DAMAGE_GUARD_MIN_RATIO_PCT}% of dmgMax` (ratio floor).

### 10.2 Enforcement

If a bag item, fusion bonus, or progression change would push the player's damage range outside the guard:

- The overflow portion of the dmgMax bonus is converted into an equivalent dmgMin bonus sufficient to bring the ratio back into compliance.
- If both constraints cannot be satisfied simultaneously, the ratio floor takes priority (cap dmgMax if needed).

### 10.3 Scope

Damage Guard applies to **player** damage range only. Enemy damage ranges are governed separately by `{ENEMY_DMG_MIN_RATIO_PCT}%` (see §13).

### 10.4 Verification hook

Damage Guard compliance is checked at every progression state transition. See `06_verification.md` V11 (Session 16).

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 11. Chance stat caps

All four chance-based stats have global caps. See §8.3 for values. Implementation rules:

- Caps apply to the **effective** value after all bonuses sum.
- Caps apply per-stat independently (Crit and Block do not share a budget).
- Display UI may show both the "pre-cap" accumulated value and the "capped effective" value, but combat math uses only the capped value.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 12. Heal potion behavior

### 12.1 Drop trigger

When an enemy is defeated, a heal potion drops on the enemy's tile with probability `{HEAL_POTION_DROP_PCT}%`. Drop roll is independent per enemy kill.

### 12.2 Pickup

The heal potion remains on the tile until the player steps on it (via `Moving`). Pickup is automatic on step — no confirmation.

### 12.3 Heal magnitude

On pickup, the player heals `{HEAL_POTION_MAGNITUDE_PCT}%` of their current max HP (not base HP — scales with progression).

### 12.4 Field Kit bag item interaction

The Field Kit bag item (see `02_balance_values.md` §20.1) adds additional % max HP heal per pickup, stacking additively with the base heal. At Field Kit Lv3, total heal per pickup = `{HEAL_POTION_MAGNITUDE_PCT}% + {BAG_FIELD_KIT_LV3_PCT}%` of max HP.

### 12.5 Expected efficiency

The estimated player pickup rate is `{HEAL_POTION_PICKUP_RATE_PCT}%` (some potions expire as player cannot route to them before the run moves on). Economy math uses this estimate for SIRC/Monte Carlo validation (see `06_verification.md`).

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 13. Enemy AI behavior

### 13.1 Archetype move speed

Each archetype has a move speed range `[moveSpeedMin, moveSpeedMax]` per phase. The exact speed used each enemy turn is drawn uniformly from the range. Move speed does NOT scale with Main Run level — it is a fixed archetype identity trait.

### 13.2 Targeting

In current v33 (playtest stage), all enemies target the player's current cell. Pathfinding respects board obstacles and walkability.

### 13.3 Sequential resolution

During `EnemyTurn`, enemies act one at a time. Resolution order within a turn is implementation-defined but must be deterministic for reproducibility (Monte Carlo requires determinism — see `06_verification.md`).

### 13.4 Enemy damage range constraint

Enemy `dmgMin ≥ {ENEMY_DMG_MIN_RATIO_PCT}% of dmgMax`. This is narrower than the player's Damage Guard ratio floor `{DAMAGE_GUARD_MIN_RATIO_PCT}%` (see §10.1) to keep enemy threat readable.

### 13.5 Enemy turn contact combat

If an enemy moves into the player's cell during its action, combat triggers with the enemy as initiator (see §7.2). After combat resolves, if the player survives, the enemy turn continues with the next enemy.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 14. Day/Night phase behavior

### 14.1 Phase identity

Each full round is either a Day round or a Night round per the cycle in §2.2. Phase is a global property — it applies to the entire board during its active rounds.

### 14.2 Night activation timing

The Night buff activates at the **start** of a Night round. All enemy actions from that point (movement AND combat) use Night-multiplied stats until the Night phase ends.

### 14.3 Night multipliers

During Night rounds:

- Enemy DMG = base archetype DMG × `{NIGHT_DMG_MULTIPLIER}`.
- Enemy move speed = base archetype move speed × `{NIGHT_SPEED_MULTIPLIER}`.

Multipliers apply uniformly to all enemies, regardless of archetype.

### 14.4 Combat triggered during Night

If combat is triggered during a Night round (either player-initiated or enemy-initiated), the enemy uses Night-multiplied DMG for the entire combat encounter, even if the encounter spans into the next Day round (rare edge case).

### 14.5 Phase-dependent bag items

Phase-sensitive bag items (Sun Compass, Moon Ward, Sun Fang, Moon Fang) activate their bonus at the start of their relevant phase and apply consistently throughout that phase. Switching phases instantly activates/deactivates these effects.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 15. Win / Lose conditions

### 15.1 Win condition

Level clears when BOTH conditions are met:

- All scheduled waves for the level have spawned (no more waves remain queued).
- No hostile enemies remain alive on the board.

On clear, state transitions to `WinText`. Flow:
1. Show `WinText` screen with win result.
2. Tally gold earned during run (includes efficiency bonus per `{GOLD_EFFICIENCY_DAY_1_PCT}` / `{GOLD_EFFICIENCY_DAY_2_PCT}` / `{GOLD_EFFICIENCY_DAY_3_PCT}` / `{GOLD_EFFICIENCY_DAY_4_PCT}` / `{GOLD_EFFICIENCY_DAY_5_PLUS_PCT}` — see `02_balance_values.md` §11).
3. Show run result table (enemies killed, gold earned, equipment obtained).
4. Bank gold and equipment to persistent storage.
5. Return to Home. Player selects next level from Home → Modes → Main Run.

### 15.2 Lose condition

Player loses when player HP reaches 0 at any moment — mid-path (during `Moving`), during `Combat`, or during `EnemyTurn`.

State transitions to `LoseText` immediately (no grace period, no revive). Flow:
1. Show `LoseText` screen with lose result.
2. Tally gold earned during run (up to the moment of death).
3. Show run result table.
4. Return to Home. Player may spend banked Rune Shard on Gold Tech Tree before next run.

### 15.3 Reward persistence across Win/Lose

Gold and T1 Equipment drops earned during a run **are always fully banked** — this applies on both Win and Lose outcomes. v31 explicit rule: "gold collected from enemy kills must carry out on lose". v33 preserves this.

**Efficiency bonus application:**
- **On Win:** efficiency curve applies per Day-depth reached.
- **On Lose:** efficiency curve applies per Day-depth reached **at the moment of death**. Example: player dies at Day 3 → `{GOLD_EFFICIENCY_DAY_3_PCT}%` bonus applied to kill gold tallied so far.

**In-run state that does NOT carry over (Win or Lose):**
- Battlefield Bag items (all reset to empty).
- Fusion-ready state (any un-executed recipes lost).
- Player HP (reset to max for next run).

**Permanent progression (always preserved regardless of outcome):**
- Gold Tech Tree node purchases.
- Equipment Upgrade level (per slot).
- Equipment Merge Tier (per slot).
- Rune Shard balance.

**Commentary (VI):** v31 cho phép gold on lose được kept đầy đủ. Về efficiency bonus, v31 không spec rõ; v32 part2 §5.3 ghi "applied to total gold earned during run, after all kill rewards tallied" — không phân biệt win/lose. v33 lock: efficiency apply theo Day-depth đạt được lúc thua (reward proportional to progress). Nếu playtest cho thấy tạo incentive sai (player quit để claim efficiency sớm), revert về "efficiency chỉ áp dụng khi Win" ở Session 10-11 Economy pass.

### 15.4 Flow invariants

- Win/Lose must always resolve game to a clear state (no hung flow).
- Wave clear and level clear are distinct milestones — only full level clear triggers `WinText`.
- In-run bag power never converts to permanent meta progression.
- `WinText` flow uses explicit sequence: `WinText` → result table → banking → return to Home.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

# PART B — Level / Wave / Mystery (Session 8 draft)

## 16. Level structure + wave spawn

### 16.1 Level shape

A level consists of a fixed sequence of waves. Each wave has its own enemy placement and mystery cell placement. Wave order is immutable within a level unless the design is explicitly changed.

Each wave must include at least **1 newly-spawned mystery cell belonging to that wave**. Mystery cells carried over from prior waves do NOT satisfy this per-wave requirement — every wave must add at least one fresh mystery target.

### 16.2 Wave 1 spawn

Wave 1 spawns deterministically when the level begins, at turn `{WAVE_FIRST_SPAWN_TURN}` (= Day 1 Turn 1). No preview occurs before Wave 1 — the player enters the level with Wave 1 already on the board.

### 16.3 Queued wave spawn window

For Wave 2 and beyond, the ONLY spawn window is the first Player turn of each subsequent Day block. Specifically:

- The `{DAY_BLOCK_TURNS} - 1` remaining Day turns within the same Day block do NOT spawn queued waves.
- None of the `{NIGHT_BLOCK_TURNS}` Night turns spawn queued waves.
- Next spawn window after the current Day block's first Player turn = first Player turn of the NEXT Day block, which is `{WAVE_SPAWN_INTERVAL_TURNS}` turns later.

### 16.4 Wave preview markers

When a wave is scheduled but not yet spawned, the board must display preview markers on the exact tiles where the wave will spawn:

- **Red `X`** = next-wave enemy spawn position.
- **Green `X`** = next-wave mystery cell spawn position.

**Preview timing:** The preview becomes visible at the start of the Player turn when the wave is *scheduled to spawn on the next valid window*. Preview does NOT auto-appear at level entry — the first preview appears only when Wave 1 is cleared or when the next Day block boundary is one turn away (whichever occurs first in level flow).

**Preview information:** Preview shows POSITION ONLY. It does NOT reveal archetype, level, or stats of incoming enemies. This preserves the "may / xui" (luck-based) identity of each wave.

**Preview occupancy:** Preview tiles do NOT block movement. The player may step on, stand on, or pass through a preview tile freely during the current wave.

### 16.5 Wave spawn mechanics

When the spawn window fires:

- Enemies of the new wave spawn on their previewed red-X tiles.
- Mystery cells of the new wave spawn on their previewed green-X tiles.
- Alive enemies from prior waves remain on the board (see §17).
- Uncollected mystery cells from prior waves remain on the board (see §6.4).
- Overlap exceptions apply per §6.5 (enemy on player tile → immediate attack; mystery on player tile → immediate pickup).

### 16.6 Level completion

A level completes when BOTH conditions are met:

- All scheduled waves have spawned (no waves remain queued).
- No hostile enemies remain alive on the board.

On completion, state transitions to `WinText` per §15.1.

**Clearing a wave individually (killing all enemies of one wave) is NOT a level completion milestone** — it only affects the visual/pacing flow. The level only completes when ALL waves' enemies are defeated.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 17. Wave overlap + stacking

### 17.1 Overlap is intentional

DiceBound design intentionally allows waves to overlap. When a new wave spawns, previous-wave enemies are NOT removed — they continue to act, take damage, drop rewards, and threaten the player alongside the new wave's enemies.

### 17.2 Stat independence per wave

Each enemy keeps its own archetype stats regardless of how many waves are simultaneously active. There is no "wave multiplier" that boosts stats when waves stack. Stacking pressure comes from **count**, not from stat inflation.

### 17.3 Wave stacking threshold (V16)

The DiceBound-specific wave stacking invariant:

- In any given level, the probability that `3 or more waves are simultaneously active at Day 3` must be ≤ `{WAVE_STACK_DAY_3_MAX_PCT}%` of Monte Carlo seeds.
- Framework default is `{WAVE_STACK_FRAMEWORK_DEFAULT_PCT}%` — DiceBound revises upward because overlap is intentional and tight waves are part of the design fantasy.

### 17.4 Verification requirement

Whenever combat stats, enemy HP, enemy count, or wave cadence change in ways that could affect Wave 1 DPS or Wave 2 spawn timing, the **Wave Stacking Stress Test** must re-run:

- Simulate `{MONTE_CARLO_SAMPLE_SIZE}` Day 1-5 sequences.
- Use the lowest-DPS build allowed by current tree/equipment/merge state at that level.
- Use median dice/bag/drop RNG.
- Count seeds where `active_waves_count ≥ 3` at any turn within Day 3 block.
- Test passes if this count ≤ `{WAVE_STACK_DAY_3_MAX_PCT}%` of seeds.

Detailed verification spec is in `06_verification.md` V16 (Session 16).

### 17.5 Failure response

If the Wave Stacking Stress Test fails for a level:

- **Option A:** Increase player baseline DPS (affects all levels — cascades broadly).
- **Option B:** Reduce enemy count at the failing level (~20% reduction typical — content tuning).
- **Option C:** Extend Day-block length at that level (from Medium to Long — see §19.12 Day-block length as difficulty lever).
- **Option D:** Add catch-up mechanism (deferred design — not in v33 scope).

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 18. Mystery cell + Battlefield Bag flow

### 18.1 Trigger conditions

The Battlefield Bag popup opens in exactly two situations:

1. **Enemy death** — when the player kills an enemy (including mid-path combat resolutions).
2. **Mystery cell pickup** — when the player steps onto a mystery cell.

Both triggers use the same `Battlefield Bag` popup with identical structure.

### 18.2 Popup structure

Each popup displays exactly `{BAG_POPUP_CHOICE_COUNT}` bag item choices drawn from the bag item pool per the offer weighting rule (see §18.8).

### 18.3 Valid player actions

The player always has at least 3 valid actions:

1. **Pick 1 of the `{BAG_POPUP_CHOICE_COUNT}` items.**
2. **Reroll** (if the level's reroll budget hasn't been exhausted).
3. **Skip** (close popup, receive no reward).

### 18.4 Reroll

- Reroll replaces ALL `{BAG_POPUP_CHOICE_COUNT}` current choices with fresh draws from the weighted pool.
- Each level allows exactly `{BAG_REROLLS_PER_LEVEL}` reroll(s) across the entire Battlefield Bag flow (shared across all popups that trigger in the same level).
- A used reroll does not reset on wave boundary or heal event — budget is per level, period.

### 18.5 Skip

Skip closes the popup without adding any item to the bag. No compensation. No reroll consumption. The run continues normally from the state before the popup opened.

### 18.6 Pick behavior — item already owned

If the player picks a choice that matches an item already in their bag, that bag item gains `+1 level`, capped at Lv3. Items level `Lv1 → Lv2 → Lv3` via repeated same-item picks.

### 18.7 Pick behavior — new item

**Case A: bag has empty slot.** The new item enters any empty slot (slot choice is implementation-defined but must be deterministic).

**Case B: bag is full (all `{BAG_ACTIVE_SLOTS}` slots occupied).** Flow transitions to the replace branch:

- Player taps the new item first (signals intent to add).
- Player then taps ONE existing bag item to replace it immediately.
- Alternative: player may skip the reward at this point.
- NO separate confirm step exists after the replace tap.
- NO cancel-back to the original 3-choice popup state after committing to the replace branch. The flow is one-way: either replace or skip.

### 18.8 Offer weighting (overview)

The offer pool is drawn using a two-layer weighting system:

- **BasePhaseWeight** — per-item weight that varies across the level's `Early / Mid / End` phases. See `02_balance_values.md` §33.1 (utility items) and §33.2 (combat items) for all 45 phase weights.
- **Dynamic modifiers** — multipliers applied on top of base weight based on current player state (item already owned, fusion ready, low HP, current phase, etc.). See `02_balance_values.md` §33.3 for all 9 modifier values.

**Phase assignment per wave position:**
- Wave 1 of level → `Early`
- Middle waves → `Mid`
- Final wave of level → `End`

**Computation:** `final_weight(item) = BasePhaseWeight(item, current_phase) × product_of_applicable_dynamic_modifiers`. Normalize final weights across all eligible items, sample 3 distinct items for the popup.

**Modifier application rules:**
- All applicable modifiers multiply together (not "first match wins").
- `BAG_MOD_RECIPE_PRODUCES_EXISTING_FUSION = 0` is a hard filter — items matching this condition are excluded from sampling entirely, not just weighted low.
- `BAG_MOD_OWNED_NOT_MAX` does NOT apply to items already at Lv3 (they have no upgrade path from pick).

### 18.9 Fusion mechanics

- **Recipe requirement:** `{FUSION_RECIPE_ITEM_COUNT}` × Lv3 matching bag items satisfies a fusion recipe. The specific recipe pairs are defined per fusion endpoint in `02_balance_values.md` §21.
- **Fusion ready state:** When the player holds `{FUSION_RECIPE_ITEM_COUNT}` × Lv3 items that complete a recipe, those bag items enter a `fusion ready` visual state.
- **Manual trigger:** Fusion executes only when the player taps the fusion action. Fusion never auto-fires.
- **Fusion result:**
  - The 2 recipe items are consumed; the fusion endpoint replaces them, occupying the bag slots' space as a single fusion item (it represents one completed family package).
  - Fusion items have NO level. They cannot be upgraded further.
  - Fusion items cannot be re-fused with anything else.
  - A fusion endpoint already present in the player's bag cannot be re-created — the offer weighting zeroes out any recipe that would produce a duplicate fusion item (v31 §5.8 dynamic modifier `×0`).

### 18.10 Bag slot structure

- The bag has `{BAG_ACTIVE_SLOTS}` neutral active slots during a run.
- Any bag item may enter any slot. Slot identity is uniform — the bag does not distinguish "utility-preferred" vs "combat-preferred" slots.
- Bag state is per-run only. On run end (Win or Lose), bag resets to empty.

### 18.11 Choice card UI requirements

Every card in the 3-choice popup must display:

- Item icon.
- Item name.
- Current level of the item (`Lv1`, `Lv2`, `Lv3`, or `New` if not owned yet).
- Affected stat(s).
- Current value → next value (the delta if this pick is confirmed).
- Family / recipe relation (which fusion recipes this item participates in).
- Slot impact (which bag slot will receive this item, or "replace" prompt if bag is full).
- State tag: `New`, `Upgrade`, or `Fusion Ready`.

Missing any of these elements creates dead-choice risk and is a rule violation.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 19. Difficulty scoring (V1.3.0 PS_day)

### 19.1 Purpose

Difficulty scoring estimates the pressure a wave/level exerts on the player, using a formula-based heuristic that combines raw combat pressure, growth relief opportunities, and layout/structural modifiers. Scores are used to verify content targets (per-level win-rate, time-to-clear) without requiring full playtest.

### 19.2 Scoring scope

- **Wave-level score:** `waveDifficulty` per wave.
- **Level-level score:** `levelDifficulty` per level (aggregate of wave scores plus level-level modifiers).
- **Overlap-aware score:** `PS_day` per Day-block start (captures wave stacking risk).

### 19.3 Per-enemy Threat Band classification (input for ESP)

For each enemy in a wave, compare its UPI (damage × HP) against the expected player UPI at the level's session count:

- `Low threat` = enemy UPI < `{THREAT_BAND_LOW_MAX_PCT}%` of player UPI → 0 threat points.
- `Mid threat` = enemy UPI between `{THREAT_BAND_MID_MIN_PCT}%` and `{THREAT_BAND_MID_MAX_PCT}%` of player UPI → 1 threat point.
- `High threat` = enemy UPI > `{THREAT_BAND_HIGH_MIN_PCT}%` of player UPI → 2 threat points.

### 19.4 Enemy Stat Pressure (ESP)

```
ESP = round(average(threat_points of all enemies in the wave))
```

Result is an integer score 0, 1, or 2 per wave.

### 19.5 Enemy Count Pressure (ECP)

ECP is a step function keyed to enemy count per wave:

| Enemy count | ECP |
|---|---|
| 1 | 0 |
| 2 | 1 |
| 3 | 2 |
| 4 | 3 |
| 5 | 4 |
| 6 | 5 |
| 7+ | 6 |

### 19.6 Tempo / Phase Pressure (TPP)

TPP scores Day/Night timing pressure on a wave:

- `TPP = 0` — wave resolves mostly in Day, or phase pressure is low.
- `TPP = 1` — wave has moderate Day/Night overlap, or a warning turn creates moderate timing tension.
- `TPP = 2` — wave intentionally forces the player into Night pressure, or phase timing is the dominant source of difficulty.

**Use rule:** TPP must be scored explicitly when Day/Night timing is a level design goal. If phase does not materially affect the wave, TPP stays at 0.

### 19.7 Wave Readability Risk (RR)

RR captures the risk that the player misreads threat or feels board state is too swingy:

```
RR = 0 by default
RR = RR + 1 if wave has ≥ 2 disruption sources
RR = RR + 1 if board has significant misread risk OR warning-turn value is too low
```

**Disruption sources** include: many Wind/Fire enemies, dense mystery cells with strong reachability, high Night timing pressure, spawn clustering that makes actual threat exceed the raw readout.

- `RR = 0` — readable wave.
- `RR = 1` — readability harder than normal.
- `RR = 2` — boundary / fairness stress; requires design review before ship.

### 19.8 Growth Relief components

Growth Relief components offset combat pressure:

- **MO_effective** — Mystery Opportunity. Counts mystery cells the player can realistically reach during the wave, including carry-over mysteries from prior waves that remain uncollected.
- **BO** — Battlefield Bag Opportunity. Counts expected enemy deaths × probability of getting a useful bag offer (probability-weighted in v1.1 extension; v1.0 treated as flat count).
- **HO** — Heal Opportunity. Expected heal from potion drops during the wave.

Specific formulas and probability weights for MO_effective / BO / HO are deferred to `06_verification.md` V1.3.0 extension (Session 16). Rules-layer implementations should treat MO/BO/HO as designer inputs per wave.

### 19.9 Full formula chain

```
RawCombatPressure = ESP + ECP + TPP + RR
GrowthRelief = MO_effective + BO + HO
waveDifficulty = max(0, RawCombatPressure - GrowthRelief)
levelDifficulty = round(avg(all waveDifficulty)) + WCP + LPR
```

Where:

- **WCP** — Wave Count Pressure. +0 if 1-2 waves, +1 if 3-4 waves, +2 if 5+ waves (per level).
- **LPR** — Layout / Placement Risk. +0 if placements are standard, +1 if awkward placement creates additional pressure, +2 if placement is a dominant difficulty source.

### 19.10 PS_day — overlap-aware pressure (v1.1 extension)

At the start of each Day block's first Player turn, compute:

```
PS_day = Σ over all active waves of: (enemy_DMG_i × count_remaining_i) / player_EHP
```

`Σ over all active waves` includes every wave that has spawned but not been fully cleared. `count_remaining_i` is the number of enemies still alive from wave `i`.

### 19.11 PS_day target bands per level tier

Target bands are specified in `02_balance_values.md` §26 via IDs:

- Low tier (Lv1-2): `{PS_DAY_LOW_MIN}` to `{PS_DAY_LOW_MAX}`.
- Low-Mid (Lv2-3): `{PS_DAY_LOW_MID_MIN}` to `{PS_DAY_LOW_MID_MAX}`.
- Mid (Lv3-4): `{PS_DAY_MID_MIN}` to `{PS_DAY_MID_MAX}`.
- Mid-High (Lv4-5): `{PS_DAY_MID_HIGH_MIN}` to `{PS_DAY_MID_HIGH_MAX}`.
- High (Lv5-6): `{PS_DAY_HIGH_MIN}` to `{PS_DAY_HIGH_MAX}`.
- Very High (Lv7-8): `{PS_DAY_VERY_HIGH_MIN}` to `{PS_DAY_VERY_HIGH_MAX}`.

A level fails design intent if its PS_day at any Day block falls outside its tier band (too easy below MIN, too hard above MAX).

### 19.12 Day-block length as difficulty lever

Day-block length is a tunable parameter equivalent in impact to enemy HP. v33 default uses Medium (`{DAY_BLOCK_TURNS}` Day / `{NIGHT_BLOCK_TURNS}` Night). Alternative rows available for tuning proposals:

| Row | Day turns | Night turns | Use case |
|---|---|---|---|
| Short | 3 | 1 | Tutorial / first 3 levels (tight cadence) |
| Medium (v33 default) | `{DAY_BLOCK_TURNS}` | `{NIGHT_BLOCK_TURNS}` | Standard mid-game |
| Long | 5 | 3 | Boss-gated / high-tier levels (recovery space) |

Any tuning proposal that changes Day-block length must re-run Wave Stacking Stress Test (§17.4) and PS_day tier verification.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 20. Anti-frustration gates (G1 / G2 / G3)

Every level must pass all three gates before shipping. Gates protect player experience against unwinnable or frustrating scenarios.

### 20.1 G1 — Minimum player HP headroom

**Rule:** `effective_player_HP ≥ {G1_PLAYER_HP_MARGIN_MULTIPLIER} × strongest_single_hit_enemy_DMG` at that level.

`strongest_single_hit_enemy_DMG` is computed as the max of: `dmgMax × crit_multiplier` across all archetypes present in the level, accounting for Night multiplier if the level's wave schedule exposes the player to Night combat.

**Failure response:** Reduce max enemy DMG at that level, OR boost player HP baseline via tree/equipment scaling, OR restructure wave composition to remove the highest-DMG enemy.

### 20.2 G2 — Wave overlap safety

**Rule:** `P(≥3 waves simultaneously active at Day 3) ≤ {G2_WAVE_STACK_DAY_3_MAX_PCT}%` of Monte Carlo seeds.

This is the same threshold as `{WAVE_STACK_DAY_3_MAX_PCT}` — both IDs must hold the same value. G2 is the player-experience framing; §17.3 is the verification framing.

**Failure response:** See §17.5.

### 20.3 G3 — Heal access

**Rule:** `(heal_pickup_rate × heal_value_per_pickup) / damage_taken_per_wave ≥ {G3_HEAL_ECONOMY_MIN_RATIO_PCT}%`.

Computation:
- `heal_pickup_rate` = `{HEAL_POTION_DROP_PCT}% × {HEAL_POTION_PICKUP_RATE_PCT}%` (drop × pickup efficiency).
- `heal_value_per_pickup` = `{HEAL_POTION_MAGNITUDE_PCT}%` of max HP × enemy count that drops (= enemy_count × drop_rate).
- `damage_taken_per_wave` = expected damage taken, computed from enemy DMG × expected hits landed (Monte Carlo estimate).

The ratio must meet the threshold per wave, not averaged across the level.

**Failure response:** Raise heal drop rate for that level (content tuning), add a bag offer bias toward Field Kit, or reduce expected damage taken by reducing enemy density.

### 20.4 Gate integration

All three gates must pass. A level failing ANY gate cannot ship without explicit override and cascade tracking (per `dicebound_change_workflow_en_v1_2_0.md`).

### 20.5 Empty Bag Test (related invariant)

A player with no bag items (`EMPTY_BAG` state) must NOT be able to clear late-game levels (Lv10+ in v33 content scope). This is the inverse of the anti-frustration gates — it protects **tactical depth** rather than against impossible difficulty.

- Formal check: `player_UPI(no bag) / enemy_UPI_at_Lv10 < 1.8` (UPI ratio must fall below the late-game minimum target from §25 balance values).
- Current v32 verification: ratio = 1.54× at Eq Lv20 + Tree + Merge (empty bag) vs Lv10 Fire — passes invariant.

**Commentary (VI):** Empty Bag Test đảm bảo in-run build vẫn có ý nghĩa — out-of-run progression không được đủ mạnh để "pre-solve" late game. Nếu ratio ≥ 1.8× với empty bag thì player không cần bag cũng thắng được → tactical depth bị triệt tiêu.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

# PART C — Economy + Progression (Session 10 draft)

## 21. Economy currency flows (DSSM)

### 21.1 Dual-currency architecture

DiceBound uses two strictly separate currencies:

- **Gold** — main run currency, used for Equipment Upgrade and Equipment Merge.
- **Rune Shard (RS)** — meta-progression currency, used for Gold Tech Tree.

### 21.2 Gold faucets and sinks

**Faucets (sources):**
- Enemy kills in main run (per `{GOLD_BAND_LOW}` / `{GOLD_BAND_MID}` / `{GOLD_BAND_HIGH}` / `{GOLD_BAND_BOSS}` archetype mapping).
- End-of-run efficiency bonus per `{GOLD_EFFICIENCY_DAY_1_PCT}` / `{GOLD_EFFICIENCY_DAY_2_PCT}` / `{GOLD_EFFICIENCY_DAY_3_PCT}` / `{GOLD_EFFICIENCY_DAY_4_PCT}` / `{GOLD_EFFICIENCY_DAY_5_PLUS_PCT}`.
- Idle reward system (see §22).

**Sinks (drains):**
- Equipment Upgrade (per `{EQUIPMENT_UPGRADE_COST_LV2}` through `{EQUIPMENT_UPGRADE_COST_LV20}`).
- Equipment Merge (per `{MERGE_COST_T1_TO_T2}` through `{MERGE_COST_T5_TO_T6}`).

### 21.3 Rune Shard faucets and sinks

**Faucets (sources):**
- Rune Trial stage clear (see §23) — reward formula `{RUNE_TRIAL_REWARD_BASE} + N × {RUNE_TRIAL_REWARD_PER_STAGE}` where N is stage number.
- Rune Trial first-clear bonus (`{RUNE_TRIAL_FIRST_CLEAR_BONUS_PCT}%` on stages 1 to `{RUNE_TRIAL_FIRST_CLEAR_MAX_STAGE}`).
- Rune Trial sweep (replay cleared stages).

**Sinks (drains):**
- Gold Tech Tree node purchases (see §27 — Session 11 pending).

### 21.4 Strict currency separation (V13 invariant)

**Rule:** No feature injects Gold into Rune Trial rewards. No feature injects Rune Shard into Main Run rewards. Currencies are strictly separate flows.

**Rationale:** Each currency has a dedicated activity gate (Gold ↔ main run, RS ↔ daily Rune Trial). Mixing faucets would collapse the daily-return-hook design and allow one activity to starve the other.

**Verification:** V13 (see `06_verification.md` Session 16) checks that no cross-contamination exists across all reward tables.

### 21.5 Equipment as shared output surface

Equipment T1 pieces are a **shared output surface** — sourced from both Gold and RS domains, but always sunk via Gold currency:

- **Sources (into owned-equipment inventory):** enemy kill drops (see §22.3 drop rate), Idle reward rolls (`{IDLE_T1_EQUIPMENT_DROP_PCT}%` per tick), Merge tier promotion.
- **Sinks (from owned-equipment inventory):** Equipment Merge consumes T1 pieces at cubic rate (see §25), Equipment Upgrade consumes Gold only (no piece consumption).

This dual-source structure is intentional and not a currency-mixing violation — Equipment pieces are the *output* of the activity, not a currency.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 22. Idle reward claim behavior

### 22.1 Accrual model

- Idle reward accrues both online and offline.
- Tick interval = `{IDLE_TICK_INTERVAL_MINUTES}` minutes.
- Offline cap = `{IDLE_OFFLINE_CAP_HOURS}` hours (accrual pauses when cap reached).
- Claim cooldown = `{IDLE_CLAIM_COOLDOWN_HOURS}` hours (0 = no cooldown; player may claim at any time).

### 22.2 Per-tick gold

Each tick grants gold based on the player's highest cleared main run level. Values locked in `02_balance_values.md` §14.2:

- Lv1 cleared → `{IDLE_GOLD_PER_TICK_LV1}` gold/tick.
- Lv2 → `{IDLE_GOLD_PER_TICK_LV2}`.
- Lv3 → `{IDLE_GOLD_PER_TICK_LV3}`.
- Lv4 → `{IDLE_GOLD_PER_TICK_LV4}`.
- Lv5 → `{IDLE_GOLD_PER_TICK_LV5}`.
- Lv6 → `{IDLE_GOLD_PER_TICK_LV6}`.
- Lv7 → `{IDLE_GOLD_PER_TICK_LV7}`.
- Lv8 → `{IDLE_GOLD_PER_TICK_LV8}`.
- Lv9 → `{IDLE_GOLD_PER_TICK_LV9}`.
- Lv10 → `{IDLE_GOLD_PER_TICK_LV10}` (max).

### 22.3 Per-tick Equipment roll

Each tick performs one Equipment roll with probability `{IDLE_T1_EQUIPMENT_DROP_PCT}%` of granting 1 T1 piece.

- Piece selection: uniform random from the full T1 equipment pool (all slots/families have equal odds).
- Duplicates are allowed.
- Granted equipment is added directly to the owned-equipment list.

### 22.4 Claim action

Claim is manual — player taps the Idle Reward card on Home to claim. On claim:

1. All stored gold is added to Gold balance.
2. All stored Equipment rolls are resolved and added to owned-equipment list.
3. Accrual timer resets to 0 with no leftover carry-over below the `{IDLE_TICK_INTERVAL_MINUTES}`-minute tick boundary.

### 22.5 3-session daily rhythm (design intent)

The `{IDLE_OFFLINE_CAP_HOURS}`-hour cap is set to support a 3-session daily rhythm:

- Morning claim after overnight (~10-12hr gap) → buffer at cap = big claim (~96 ticks).
- Noon claim (~4hr since morning) → partial buffer = small claim (~48 ticks).
- Evening claim (~8hr since morning, cap) → big claim (~96 ticks).
- Daily total ≈ `{IDLE_DAILY_TICKS_TARGET}` ticks.

This is a design target for SIRC verification (see `06_verification.md` V14), not a hard rule. Players claiming off-rhythm still get accrued value up to cap — they just lose accrual opportunity past the cap.

### 22.6 SIRC supplemental invariant (V14)

Idle gold/day must never exceed `{OUT_OF_RUN_IDLE_CEILING_PCT}%` of active-run gold/day at any Main Run level tier (Lv1, 3, 5, 7, 10 checkpoints). If a tuning proposal would break this, it must be rejected or the active side strengthened proportionally.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 23. Rune Trial structure

### 23.1 Mode identity

- Stage-based PvE, entered from Home → Modes → Rune Trial.
- Total stages: `{RUNE_TRIAL_TOTAL_STAGES}`.
- Each stage is handmade (not procedural).
- Stage target duration: 1-2 minutes.
- Waves per stage: `{RUNE_TRIAL_WAVES_PER_STAGE}`.
- Objective: defeat all enemies across both waves.
- Fail condition: player HP reaches 0.

### 23.2 Mode-specific rule modifications

Rune Trial uses the Combat + State Flow rules from Part A with these removals:

- **No Battlefield Bag.** Mystery cell triggers and enemy-death bag popups are disabled in this mode.
- **No Fusion.** (Follows from bag absence.)
- **No Mystery cell.** Board has no mystery cells.
- **No Day/Night cycle.** All turns behave as Day-phase with no Night multipliers applied.
- Smaller map size than main run (exact dimensions per stage design — not in balance values).
- Player uses full current account power (Equipment + Merge + Tree + fresh in-run state; no persistence of bag between stages).

### 23.3 Wave structure per stage

- **Wave 1** — lighter pressure, onboarding the stage.
- **Wave 2** — heavier pressure, stage climax.
- Wave 2 spawns on Wave 1 clear (not on Day block boundary like main run).
- Wave 2 uses red X preview (enemy positions only — no mystery since mode has no mystery).
- Wave overlap CAN occur if Wave 1 is slow — same rule as main run.

### 23.4 Enemy scaling

Rune Trial enemy stats scale per `{RUNE_TRIAL_DIFFICULTY_SCALE_FACTOR}` × highest Main Run level cleared. This makes Rune Trial slightly easier than matched-level main run content, keeping the mode accessible for daily farming.

### 23.5 Daily win economy

- Player has `{RUNE_TRIAL_DAILY_WINS}` daily rewarded wins.
- Losing a stage does NOT consume a rewarded win.
- Winning a stage consumes `1` rewarded win.
- Using all rewarded wins blocks further stage entry until daily reset.
- Daily reset: 7:00 local time (⚠️ flag — confirm timezone policy at Session 16).

### 23.6 Stage progression and replay

- Winning the current highest stage unlocks the next stage.
- Player may replay any previously-cleared stage.
- A stage that has not been cleared yet cannot be entered out of order.

### 23.7 Sweep (auto-win on cleared stages)

- Cleared stages display a `sweep` button on the stage-select UI.
- Sweep is allowed on ANY cleared stage, including the current highest cleared stage.
- Sweep consumes `1` rewarded win.
- Sweep reward = manual-clear reward (same RS payout, no discount, no bonus).
- Sweep is instantaneous — no combat is simulated.

### 23.8 Reward computation

- Base reward per stage N = `{RUNE_TRIAL_REWARD_BASE} + N × {RUNE_TRIAL_REWARD_PER_STAGE}` RS (linear).
- First-clear bonus: `+{RUNE_TRIAL_FIRST_CLEAR_BONUS_PCT}%` of stage reward, applied on first clear only (not on replay or sweep).
- First-clear bonus only applies to stages 1 through `{RUNE_TRIAL_FIRST_CLEAR_MAX_STAGE}`.
- Higher-numbered stages grant more RS (monotonic).

### 23.9 Currency restriction

Rune Trial grants **only Rune Shard**. No gold, no Equipment pieces, no bag items, no efficiency bonus. This preserves the DSSM strict separation (§21.4).

<!-- Locked: v33 | Last changed: v33 | CL: — Daily reset timezone flagged for Session 16 -->

---

## 24. Equipment Upgrade rules

### 24.1 Ownership model — slot-based

**Equipment Upgrade is SLOT-based, not piece-based.** Upgrading the Weapon slot raises the Weapon slot's base stats; whichever equipment piece is currently equipped in that slot uses those slot base stats. When the player swaps a different piece into that slot later, the new piece STILL receives the upgraded slot base stats.

This is in contrast to Equipment Merge Tier, which is piece-based (see §25).

### 24.2 Slot inventory

Four slots exist: Weapon, Auxiliary, Helmet, Armor. All four start at Lv1 with the Lv1 baseline bonuses auto-equipped on new game (per `02_balance_values.md` §2).

### 24.3 Upgrade range

Each slot can be upgraded from Lv1 to Lv20 across 19 upgrade steps.

### 24.4 Per-upgrade stat pattern

**Weapon slot:**
- Upgrade to Lv2, Lv4, ..., Lv20 (odd-indexed upgrade steps): grants `{EQUIPMENT_WEAPON_ODD_LEVEL_DMG_MAX_INCREMENT}` dmgMax per step.
- Upgrade to Lv3, Lv5, ..., Lv19 (even-indexed upgrade steps): grants `{EQUIPMENT_WEAPON_EVEN_LEVEL_DMG_MIN_INCREMENT}` dmgMin per step.
- Cumulative at Lv20 (including Lv1 baseline): `{EQUIPMENT_WEAPON_LV20_DMG_MIN_TOTAL}` dmgMin / `{EQUIPMENT_WEAPON_LV20_DMG_MAX_TOTAL}` dmgMax.

**Auxiliary slot (mirrors Weapon):**
- Upgrade to Lv2, Lv4, ...: grants `{EQUIPMENT_AUX_ODD_LEVEL_DMG_MIN_INCREMENT}` dmgMin per step.
- Upgrade to Lv3, Lv5, ...: grants `{EQUIPMENT_AUX_EVEN_LEVEL_DMG_MAX_INCREMENT}` dmgMax per step.
- Cumulative at Lv20: `{EQUIPMENT_AUX_LV20_DMG_MIN_TOTAL}` dmgMin / `{EQUIPMENT_AUX_LV20_DMG_MAX_TOTAL}` dmgMax.

**Helmet slot:** Each upgrade grants `{EQUIPMENT_HELMET_PER_UPGRADE_HP_INCREMENT}` HP. Cumulative at Lv20 (including baseline): `{EQUIPMENT_HELMET_LV20_HP_TOTAL}` HP.

**Armor slot:** Each upgrade grants `{EQUIPMENT_ARMOR_PER_UPGRADE_HP_INCREMENT}` HP. Cumulative at Lv20: `{EQUIPMENT_ARMOR_LV20_HP_TOTAL}` HP.

### 24.5 Cost

Per-slot gold cost is NOT constant per level. Locked milestones are Lv2, Lv5, Lv10, Lv15, Lv20 at `{EQUIPMENT_UPGRADE_COST_LV2}` / `{EQUIPMENT_UPGRADE_COST_LV5}` / `{EQUIPMENT_UPGRADE_COST_LV10}` / `{EQUIPMENT_UPGRADE_COST_LV15}` / `{EQUIPMENT_UPGRADE_COST_LV20}` gold.

Intermediate levels (Lv3, Lv4, Lv6-9, Lv11-14, Lv16-19) are not locked numerically. Per `02_balance_values.md` Appendix A.4, the formula stated in v32 part2 §5.5 is inconsistent with the table. Implementations should interpolate linearly between locked milestones OR defer until a future balance patch.

### 24.6 Slot stat application

Slot stats apply to the character ONLY when the corresponding equipment piece is currently equipped in that slot. If that slot is unequipped (empty), that slot's stats do NOT apply to the character.

At game start, all 4 slots are auto-equipped with Lv1 T1 pieces so the Lv1 baseline bonuses are active from session 1.

### 24.7 Damage Guard interaction

Equipment Upgrade changes to Weapon and Auxiliary slots shift the player's effective dmgMin and dmgMax. After every upgrade, the Damage Guard invariant (§10) must be re-verified. If the upgrade would violate `{DAMAGE_GUARD_MAX_GAP}` absolute gap or `{DAMAGE_GUARD_MIN_RATIO_PCT}%` ratio floor, the overflow adjustment rule applies.

### 24.8 Upgrade UI flow

Upgrade happens at Home → Equipment screen → tap equipped item → item-info popup → `Upgrade` button. The `Upgrade` button is shown only on currently equipped items. Gold cost is displayed directly above the button. Tap applies upgrade immediately without opening a secondary confirm popup.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 25. Equipment Merge rules

### 25.1 Ownership model — piece-based

**Equipment Merge Tier is PIECE-based, not slot-based.** A merged piece retains its merge tier when unequipped, re-equipped, or moved to a different slot (if slot-compatible). This is in contrast to Equipment Upgrade, which is slot-based (see §24).

### 25.2 Family structure

Four families exist:

- **Stability** — dmgMin focus; 4-slot bias = bonus dmg vs slowed enemies.
- **Burst** — dmgMax focus; 4-slot bias = bonus Crit Damage.
- **Precision** — Crit Chance focus; 4-slot bias = bonus Double Strike.
- **Guard** — HP focus; 4-slot bias = bonus Lifesteal; sub-bonus = Block%.

Each family has 6 tiers (T1 through T6). Stats per tier are locked in `02_balance_values.md` §18.

### 25.3 Tier progression structure

Each tier transition is a piece-level merge:

- **T1** — base bias stat (the starter bias — family identity at its weakest form).
- **T2** — unlocks Line 1 (first stat line).
- **T3** — unlocks Line 2 (second stat line).
- **T4** — upgrades Line 1 + Line 2 (no new line, but amplifies existing).
- **T5** — unlocks Line 3 (light capstone) + adds HP sub-bonus (for Stability/Burst/Precision) or Block% sub-bonus (for Guard).
- **T6** — peak. Strongest bias + maxed sub-bonus.

### 25.4 Merge recipe (cubic 3→1)

To promote a piece from tier N to tier N+1, consume `{MERGE_RECIPE_PIECES_PER_TRANSITION}` pieces of tier N (one is the root piece being promoted, the others are fodder). This creates cubic T1-piece consumption:

- T1 → T2: `{MERGE_T1_PIECES_FOR_T2_PER_SLOT}` T1 pieces cumulative.
- T1 → T3: `{MERGE_T1_PIECES_FOR_T3_PER_SLOT}`.
- T1 → T4: `{MERGE_T1_PIECES_FOR_T4_PER_SLOT}`.
- T1 → T5: `{MERGE_T1_PIECES_FOR_T5_PER_SLOT}`.
- T1 → T6: `{MERGE_T1_PIECES_FOR_T6_PER_SLOT}`.

### 25.5 Gold cost per transition

In addition to piece consumption, each merge transition costs gold:

- T1 → T2: `{MERGE_COST_T1_TO_T2}` gold.
- T2 → T3: `{MERGE_COST_T2_TO_T3}` gold.
- T3 → T4: `{MERGE_COST_T3_TO_T4}` gold.
- T4 → T5: `{MERGE_COST_T4_TO_T5}` gold.
- T5 → T6: `{MERGE_COST_T5_TO_T6}` gold.

### 25.6 Family bias activation — 4-slot same-family match

Family bias bonus is NOT per-slot. It activates only when ALL 4 equipped slots are pieces of the same family. Bias magnitude scales with the MINIMUM tier across the 4 slots (e.g., Stability T6/T6/T5/T3 activates bias at T3 level).

Mixed-family builds receive NO bias bonus. Sub-bonuses (HP or Block%) from individual tier levels still apply per-slot regardless of family composition.

### 25.7 Readability rule for merge stat lines

Merge tier stat lines must use only **always-on** effects or **UI-readable** conditional triggers. Hidden-percentile / backend-roll-window conditions are prohibited.

**Approved readable conditions** (examples):
- `enemy < 50% HP` (visible via enemy HP bar).
- `first hit each combat` (visible via combat screen counter).
- `Night` (visible via phase indicator).
- `after winning combat` (visible via post-combat state).

**Prohibited conditions** (examples): "20% of the time", "backend-rolled chance", "hidden proc" — any condition where the player cannot verify activation from UI state.

### 25.8 Merge UI flow

Merge happens at Home → Equipment screen → Blacksmith → Blacksmith merge popup. Root equipment is selected from the owned-equipment list. Tapping an owned item auto-fills the first valid material slot. Tapping a filled material slot removes it.

- `Merge` button is persistently visible.
- If requirements unmet, tapping Merge shows a toast explaining the missing component.
- No pre-merge result preview (player learns the stat line on successful merge).
- On successful merge: fodder pieces are consumed, root piece advances to next tier, gold deducted.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 26. Bag item stat application + fusion extensions (extending §18)

§18 covers the popup flow, pick/reroll/skip mechanics, and offer weighting. §26 covers how bag item stats actually APPLY to the character during combat.

### 26.1 Stat application timing

Bag item stats apply to the character **immediately** upon acquisition or upgrade — the moment the popup closes with the player's pick confirmed. There is no delayed activation, no cooldown, no "end of turn" gate.

### 26.2 Flat vs percentage stats

Bag item stats come in two forms (per `02_balance_values.md` §20):

- **Flat stats** — dice-related (Pathfinder Token, Step Anchor, Sun Compass), chance-based (Crit/Block/Double Strike/Lifesteal). Add directly to the corresponding player stat.
- **Percentage stats** — HP (Guard Crest), dmgMin (Stable Edge), dmgMax (Power Edge/Sun Fang/Moon Fang), phase-dmg items, heal% (Field Kit), night-dmg-reduction (Moon Ward).

### 26.3 Percentage base definition

Percentage bag bonuses apply to the player's **effective base stat BEFORE bag application**, which includes:

- `PLAYER_HP_BASELINE` + Equipment HP (Helmet + Armor) + Tree Root HP contributions + Merge sub-HP contributions.
- `PLAYER_DMG_MIN_BASELINE` + Equipment Weapon/Aux dmgMin + Tree dmgMin contributions + Merge Stability dmgMin contributions.
- Similarly for dmgMax.

**Bag % stacks additively within the bag layer.** Example: Guard Crest Lv3 (+20% HP) + Fusion-Bulwark-Line (+10% HP) = +30% total from bag. This 30% then applies to the pre-bag effective base.

**Bag layer is the outermost multiplier.** Permanent progression (Tree/Equipment/Merge) is computed first, then bag% applies on top. This keeps empty-bag state meaningfully weaker than maxed-bag state.

### 26.4 Damage Guard interaction for % DMG items

Percentage dmgMax bag items (Power Edge) can create violations of the Damage Guard invariant (§10). Overflow handling:

- If adding the bag % pushes `dmgMax - dmgMin` above `{DAMAGE_GUARD_MAX_GAP}`, the dmgMax gain is capped and the overflow converts to dmgMin gain at a 1:1 rate until the gap re-enters compliance.
- If the ratio floor `{DAMAGE_GUARD_MIN_RATIO_PCT}%` cannot be met, dmgMax is capped directly (dmgMin never exceeds its own bag contribution).

### 26.5 Phase-dependent item activation

Phase-sensitive bag items activate/deactivate at phase boundaries per §14.5:

- **Sun Compass** — `+Day maxRoll` active only during Day phase. At start of Night, the bonus removes itself from player's effective maxRoll. At start of Day, it re-applies.
- **Moon Ward** — `% Night dmg reduce` active only during Night phase (reduces dmg taken).
- **Sun Fang** — `% Day DMG` active only during Day phase.
- **Moon Fang** — `% Night DMG` active only during Night phase.

Switching phases mid-combat (rare edge case) recalculates player stats at the phase transition point, not retroactively for already-resolved hits.

### 26.6 Heal% stacking (Field Kit)

Field Kit's `% max HP heal` (per pickup) stacks additively with the base heal potion magnitude (per §12.4). Both values are percentage-of-max-HP and apply to whatever max HP the player has at the moment of pickup (after all progression + bag stacking).

### 26.7 Bag state reset timing

Bag state resets to empty at these events:

- Player loses → `LoseText` → bag cleared before banking.
- Player wins level → `WinText` → bag cleared before next level (if run continues).
- Run ends for any reason → bag cleared.

Fusion-ready state does NOT persist — if player has 2 × Lv3 recipe items in "fusion ready" state but fails to execute fusion before run ends, the fusion opportunity is lost along with the bag reset.

### 26.8 Fusion execution mechanics (extending §18.9)

When player taps the fusion execute action on a ready recipe:

- The 2 recipe items disappear from their bag slots.
- The fusion endpoint item is placed. Slot footprint: fusion occupies 1 slot (merging the 2 consumed slots frees 1, leaving the other for the fusion result). Net: bag slot count decreases by 1 on successful fusion.
- Wait — this implies bag effectively shrinks. Clarification: after fusion, the 2 consumed slots both free up; the fusion item occupies exactly 1 of them. Net free slot delta = +1 (one more empty slot available).
- Fusion item's bonus applies immediately per §26.1.

**Commentary (VI):** v31 không nói rõ fusion occupies 1 hay 0 slots. Hiểu logic: fusion = combined item thay thế 2 cái gốc, occupy 1 slot → bag thực tế trở nên rộng ra 1 slot. Nếu rule này phản trực giác khi implement, revisit ở Session 16.

<!-- Locked: v33 | Last changed: v33 | CL: — Slot-accounting for fusion flagged — verify with playtest implementation -->

---

## 27. Gold Tech Tree unlock rules

### 27.1 Tree open from game start

The tree is accessible from the first session. No "unlock tree" gating event. Player may spend Rune Shard as soon as they accumulate enough from Rune Trial.

### 27.2 Tree topology (v33 — Loop 1)

Loop 1 contains 6 nodes, each with 3 tiers. Node list and stats are in `02_balance_values.md` §16:

- **Root** — HP lane (was "structural free node" in v31; v32 redesign makes Root a purchasable `{TREE_ROOT_TIER1_COST_RS}` / `{TREE_ROOT_TIER2_COST_RS}` / `{TREE_ROOT_TIER3_COST_RS}` RS node).
- **Combat Lane A: Steady Hand** — dmgMin.
- **Combat Lane B: Finisher's Edge** — dmgMax.
- **Gold% Lane A: Clean Loot** — gold efficiency.
- **Gold% Lane B: Contract Bonus** — gold efficiency.
- **Capstone: Campaign Command** — mixed dmgMin/dmgMax.

### 27.3 Root access

The Root is the entry point. Root Tier 1 must be purchased before ANY other node becomes Available.

### 27.4 Lane structure after Root

Once Root Tier 1 is purchased, all 5 other nodes (Combat A/B, Gold A/B, Capstone) become eligible targets. The branching rule is **per-lane local prerequisite**:

- **Within a lane:** Tier 2 of a node requires Tier 1 of that node purchased. Tier 3 requires Tier 2. (Sequential within a node.)
- **Combat Lane B prerequisite:** Finisher's Edge cannot be purchased before Steady Hand is fully maxed (Tier 3). This is the v31 dmgMax-after-dmgMin invariant.
- **Gold% Lanes A and B:** independent of each other. Either may be purchased first; no cross-lane gating.
- **Capstone:** available after BOTH Combat lanes are at least at Tier 1 AND at least one Gold% lane has any tier purchased. (Soft gate — ensures player has invested in multiple lanes before capstone.)

No global full-tier-completion requirement exists. Player does NOT need to max lower tiers across the entire tree to open a specific branch.

### 27.5 Node states (UI-visible)

Each node displays one of 4 states:

- `Locked` — prerequisites not met. Cannot be interacted.
- `Available` — prerequisites met, player has enough RS to buy. Highlighted.
- `Purchased` — at least Tier 1 owned. Shows current tier.
- `Max` — at Tier 3 (all 3 tiers purchased). No further interaction.

### 27.6 Purchase interaction

Tap an Available node to buy immediately. No confirm popup. The tier advances by 1, RS balance deducts by the tier cost, and visible stats update immediately.

### 27.7 Tree UI layout

- Entry: dedicated button from Home.
- Layout: vertical tree growing bottom-up. Root at bottom. Capstone at top.
- Each node card shows directly (no tooltip or side panel): icon, name, current level (e.g., `Lv 2/3`), next tier cost in RS, main effect.
- No separate info popup needed — all data fits on the node card.

### 27.8 Damage Guard invariant for tree purchases

Every permanent dmgMin/dmgMax tree purchase must respect the player Damage Guard (§10). If a tree upgrade would violate the guard, the overflow adjustment rule applies at stat application time (not purchase time — the purchase is always allowed, but the guard caps the effective stat).

### 27.9 Loop compound mechanic (LM-A)

v32 redesigned the tree as a loop-based compound system:

- Completing Loop 1 (all 6 nodes at Tier 3) unlocks Loop 2.
- Loop 2 presents the same 6-node structure with scaled RS costs (deferred per `02_balance_values.md` §16.7 — Loops 2-3 scaling not yet locked).
- Stats stack additively across loops (Loop 1 full + Loop 2 full = 2× Loop 1 stat gains).
- Max gold efficiency compound caps at `{TREE_LOOP_1_LANE_AB_COMPOUND_CAP_PCT}%` across all loops.

**Note on Loops 2-3:** Full spec deferred per v32. v33 does not lock Loop 2 cost scaling or behavior beyond "same structure, stacked stats". Implementations should treat Loop 2+ as post-Test-Đợt-1 content.

### 27.10 Persistence

Tree state persists in `diceBoundPlayerData.goldTechTree`:

- `goldTechTree.version` — migration version.
- Per-node: semantic node ID → `{ level, purchasedAt }`.
- `unlocked` state is derived from prerequisites at runtime, not persisted.

Changes persist immediately on purchase (no explicit save action needed).

<!-- Locked: v33 | Last changed: v33 | CL: — Loop 2+ behavior deferred per v32 §5.7 -->

---

## 28. [REMOVED — Between-level power-up selection not in v33]

**v33 does not have between-level power-up selection.** The feature existed as draft in v31 but was removed during v32 design iteration. Confirmed by user at Session 16.

**v33 Win flow:** `WinText` → Result table (enemies killed, gold earned, equipment obtained) → gold + equipment banked → return to Home. No power-up popup, no mid-flow selection.

**v33 Lose flow:** `LoseText` → Result table → gold + equipment banked (per §15.2 partial efficiency) → return to Home. No power-up popup.

**Progression between levels flows ENTIRELY through Home:**
- Gold Tech Tree purchase (§27) — spends Rune Shard for permanent stat nodes.
- Equipment Upgrade (§24) — spends Gold to level slots.
- Equipment Merge (§25) — consumes pieces + Gold to advance tier.

No in-run or between-level transient buff system exists in v33.

**Section number kept as 28 for stable numbering**; content removed to avoid confusion with v31 draft.

<!-- Locked: v33 | Last changed: v33 | CL: — Section removed per user confirmation Session 16; v33 has no power-up selection -->

---

# PART D — UI + Cross-system invariants (Session 12 draft)

## 29. UI state list + invariants

### 29.1 Canonical UI state list

The runtime UI state machine matches the gameplay state machine from §1.1. Seven canonical states:

| State | Purpose |
|---|---|
| `BeforeRoll` | Player observes board, reads visible power/enemy info, optional tap-enemy tooltip, decides Roll or Skip Turn |
| `ReachablePreview` | Player has rolled; reachable cells visible; drag in progress or about to start |
| `Moving` | Player committed a path; character animates along route |
| `Combat` | Dedicated full-screen combat screen, turn-based exchanges |
| `EnemyTurn` | Enemies act sequentially; no player input accepted |
| `WinText` | Level-clear screen → result table → banking → return to Home |
| `LoseText` | Level-lose screen → result table → return to Home |

Additional states may be added only when justified by a new mechanic (per §1.1 rule).

### 29.2 Per-state UI element requirements

**`BeforeRoll`:**
- Top HUD visible (§30.1).
- `Roll` button visible and enabled.
- `Skip Turn` button visible and enabled.
- `Threat Preview Toggle` button visible (current toggle state persisted per-session).
- Tap-enemy interaction active (shows tooltip on tap; one tooltip max visible at a time).

**`ReachablePreview`:**
- Top HUD visible.
- `Roll` and `Skip Turn` hidden (roll committed).
- Reachable tiles highlighted based on rolled value.
- Drag preview from current cell shows tentative path as player drags.
- Release commits path, transitions to `Moving`.

**`Moving`:**
- Top HUD visible (stats update per-cell traversal).
- Character animates along committed path.
- Per-cell interactions resolve in order (§6.1).

**`Combat`:**
- Full-screen combat view.
- Player stats display.
- Enemy stats display.
- Hit-by-hit resolution animates with visible damage numbers.
- Auto-closes when one side's HP reaches 0.

**`EnemyTurn`:**
- Top HUD visible.
- No player input accepted.
- Enemies animate one at a time in sequence.
- Night visual cue active if in Night phase (phase-distinct lighting/tint).

**`WinText`:**
- Full-screen `WinText` banner.
- Then result table (enemies killed, gold earned, equipment obtained during run — NOT in-run bag items).
- Then banking animation (gold/equipment icons fly to inventory).
- Return-to-Home button.

**`LoseText`:**
- Full-screen `LoseText` banner.
- Then result table (same fields as Win).
- Return-to-Home button.

### 29.3 UI state invariants

- **UI does NOT modify gameplay logic.** UI reads from approved state selectors only; any state mutation must flow through the orchestration layer.
- **UI does NOT bypass state flow.** If the current state is `EnemyTurn`, no UI button can trigger a Player action.
- **Exactly one modal/popup at a time.** Stacked popups are prohibited except for bag replace-branch (§18.7) which uses sequential interactions, not stacking.
- **Manual `End Turn` button is NOT in the visible UI.** It is disabled / removed per v31 v11. `Skip Turn` at `BeforeRoll` is the ONLY way to pass without moving.

### 29.4 Wireframe references

The following wireframes exist in v31 source (reference only — not authoritative for v33 behavior, but implementations should match structure):

- `ui-wireframe-home-v1.png`
- `ui-wireframe-gameplay-before-roll-v1.png`
- `ui-wireframe-combat-v1.png`
- `ui-wireframe-win-text-v1.png`
- `ui-wireframe-lose-text-v1.png`

Wireframes do NOT exist for: `ReachablePreview`, `EnemyTurn`, Enemy Intro popup, Mystery / Bag popup. These states rely on rule text only for v33 implementation.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 30. HUD + readout rules

### 30.1 Top HUD — Main mode

Top HUD displays continuously during all gameplay states except `WinText`/`LoseText`. Required elements:

- **Player HP** (current / max).
- **Player DMG** (dmgMin-dmgMax range).
- **Player Move range** (`{PLAYER_ROLL_MIN}`-`{PLAYER_ROLL_MAX}` + any dice bag item modifiers active in current phase).
- **Player Power value** — single scalar for direct enemy comparison. Current formula: `player.hp.current + player.dmg.max`.
- **Day / Night phase label** with round progress indicator.
- **Bag-target icon** at top-right — receives collected Gold and dropped Equipment feedback animations.

### 30.2 Top HUD — Rune Trial mode

Top HUD elements in Rune Trial (per §23.2 mode restrictions):

- Player HP.
- Player DMG.
- Player Move range.
- Player Power value.

Elements ABSENT in Rune Trial (because features disabled):
- No Day/Night phase label.
- No bag-target icon (no bag, no fusion).

### 30.3 Visible power formula

**Player power** displayed on Top HUD: `player.hp.current + player.dmg.max`.

**Enemy power** displayed on-body (per-enemy on the board): same formula — `enemy.hp.current + enemy.dmg.max`.

The system does NOT auto-judge strong/weak for the player — the player reads both values and decides.

### 30.4 Threat preview

**Purpose:** Show the reachable tiles each enemy can move to this turn so the player can plan routes.

- Toggle ON/OFF via HUD button. Default: ON.
- Active states: `BeforeRoll`, `ReachablePreview`.
- Preview uses REAL reachable tiles per the current phase — accounting for:
  - Current phase (Day or Night).
  - Obstacles and walkability.
  - Pathfinding per archetype.
- Color coding:
  - Dark red = tiles reachable at `moveSpeedMin`.
  - Light red = additional tiles reachable at `moveSpeedMax`.
- Preview must NOT use fake geometric ranges if real pathing differs.

### 30.5 Tap-enemy tooltip (BeforeRoll only)

Tap an enemy at `BeforeRoll` to toggle a small tooltip above the enemy's head. Tooltip contents:

- Archetype name.
- Level.
- HP (current/max).
- DMG (min-max).
- moveSpeed (min-max) — note: these are base values; player mentally applies Night multiplier if phase is Night.

Rules:
- Only ONE tooltip visible at any time. Tapping a different enemy closes the old tooltip and opens the new.
- Tapping the same enemy again closes its tooltip.
- Tooltip interaction does NOT consume roll, does NOT commit move, does NOT change turn state.

### 30.6 Wave preview markers

**Main mode preview markers** (per §16.4):
- Red `X` = next-wave enemy spawn positions.
- Green `X` = next-wave mystery cell spawn positions.
- Visual treatment: distinct, non-blocking (player can walk on/through).

**Rune Trial preview markers** (per §23.3):
- Red `X` only (no mystery → no green X).
- Visual treatment: reuses main-mode red X style.

### 30.7 Day/Night phase indicators

- **Day** — default visual state (neutral lighting).
- **Night** — distinct visual treatment (cooler palette, particle cue, or tint — exact visual per art direction).
- **Phase transition** — explicit cue at round boundary. Entering Night MUST display a warning message: "Enemy speed ×`{NIGHT_SPEED_MULTIPLIER}` / atk ×`{NIGHT_DMG_MULTIPLIER}`" or equivalent reminder of the multiplier impact.

### 30.8 Heal potion readout

- Heal potion must have a distinct icon/silhouette on the board — readable at game's default map zoom.
- Icon must visually clear against map tiles.
- Spawn must have clear feedback (animation/pop effect when potion appears).
- Pickup must have clear feedback (collected-effect when player steps on tile).

### 30.9 Bag summary HUD

During gameplay (main mode only):
- Bag-target icon at top-right shows bag slot count (`N`/`{BAG_ACTIVE_SLOTS}`).
- Dropped items (Gold coins, T1 equipment) fly from enemy death position to the bag-target icon with ~0.5s lift-off delay before animation.
- Collected gold adds to run gold tally visible in HUD.

### 30.10 Equipment UI (Home → Equipment)

Layout locked per v31 v21:
- Dedicated `Back` button at top-left.
- 4 equipped slots arranged as 2 on left, 2 on right.
- Character display at center of equipped-slot area.
- Owned-equipment list as square-icon grid with 5 columns.
- Tap any equipment icon opens item-info popup with tier lines (unlocked lines visible, locked lines dimmed).
- Unequipped items show `Equip` or `Swap` button depending on slot occupancy.
- Equipped items show `Unequip` and `Upgrade` buttons.
- `Upgrade` button shows gold cost directly above it. Tap applies upgrade immediately.
- Equipped items show small `E` tag in main list; cannot be consumed as Blacksmith fodder (locked overlay on those icons).

### 30.11 Blacksmith UI (Home → Equipment → Blacksmith)

Layout locked per v31 v19:
- Dedicated `X` close button at top-right.
- Root equipment selected from full owned-equipment list.
- Material slots below root-equipment slot.
- Tapping an owned item auto-fills the first valid material slot.
- Tapping a filled material slot removes it.
- `Merge` button below material slots. Persistently visible.
- Tapping Merge with unmet requirements → toast explaining what's missing.
- NO pre-merge result preview (player learns result on successful merge).

### 30.12 Home / Idle Reward card

- Card present at Home screen.
- Shows Idle buffer state (visual progress toward `{IDLE_OFFLINE_CAP_HOURS}`-hour cap).
- `Manual Claim` button available.
- Claim resolves all accrued gold + equipment rolls, timer resets (§22.4).

### 30.13 Modes / Rune Trial card

- Accessible from Home → Modes menu.
- Card displays:
  - `remaining rewarded wins` (current / `{RUNE_TRIAL_DAILY_WINS}`).
  - `highest cleared stage`.
- Tapping opens Rune Trial stage select.

### 30.14 Rune Trial stage-select UI

Stage-select screen displays per stage:
- Stage number.
- Reward (RS amount + first-clear bonus indicator if applicable).
- Clear status (cleared / current / locked).
- `Sweep` button on cleared stages (§23.7).

Does NOT display:
- Recommended power level (player judges from own stats vs their main-run progress).

### 30.15 Gold Tech Tree UI

Layout locked per v31 v9 and §27.7:
- Entry: dedicated button on Home.
- Vertical tree from bottom (Root) to top (Capstone).
- No separate tooltip, side panel, or bottom sheet.
- Each node card self-contains: icon, name, level (`Lv X/3`), next-tier cost in RS, main effect text.
- Four states color-coded: `Locked`, `Available`, `Purchased`, `Max`.
- Tap Available node → immediate purchase, no confirm popup.

### 30.16 Secondary danger cue rules

When the Top HUD power comparison alone doesn't communicate full threat (e.g., Wind with high speed vs low raw power), secondary cues must fill the gap:

- Threat preview (§30.4) covers movement-based danger.
- Tap-enemy tooltip (§30.5) covers stat-based danger.
- Phase warning (§30.7) covers Night-multiplier danger.
- Wave preview (§30.6) covers incoming-wave danger.

Design goal: player never misreads threat because UI hid critical information. If a threat surface is not covered by existing cues, new cue must be added (cascade through §30 design review).

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 31. Cross-system invariants (V1-V18)

This section is the implementation checklist. Every invariant below must hold at runtime. Violations are bugs — not tuning opportunities. Verification methodology for each invariant lives in `06_verification.md` (Session 16).

### 31.1 Combat/Stat invariants

**V1 — Damage Guard at baseline**  
Player effective `dmgMax - dmgMin ≤ {DAMAGE_GUARD_MAX_GAP}` AND `dmgMin ≥ {DAMAGE_GUARD_MIN_RATIO_PCT}% × dmgMax` at new-game state (Equipment Lv1 auto-equipped, empty bag, Tree Loop 1 not started).  
Enforcement: §10.

**V2 — Damage Guard at max progression**  
Same constraint holds at max progression state (Equipment Lv20 × 4 slots + Tree Loop 1 full + Merge T5/T6 + full bag optimized, any phase).  
Enforcement: §10, §24.7, §26.4, §27.8.  
Reference: v32 part2 §1.5 peak-state verification showed Gap 4 / Ratio 90.7% ✓.

**V3 — TTK Slime anchor**  
A fresh-new-game player (Equipment Lv1 only, no bag, no tree, no merge) takes ≥ 5 hits from Slime before dying. Slime is the reference archetype for TTK.  
Computation: `player_HP / slime_dmg_avg ≥ 5`.

**V4 — TTK Fire anchor**  
Same fresh-new-game player takes ≥ 3 hits from Fire before dying. Fire is the strongest-damage reference.  
Computation: `player_HP / fire_dmg_avg ≥ 3`.

### 31.2 Build architecture invariants

**V5 — Build Completion Budget**  
A full build requires `{BUILD_PACKAGES_TOTAL_MIN}` to `{BUILD_PACKAGES_TOTAL_MAX}` packages summed across layers. No more.  
Enforcement: design audit when any layer value changes.

**V6 — No single permanent layer = 1 full package alone**  
No single out-of-run layer (Tree, Equipment, Merge) contributes a full package's worth of power alone. Each provides <1 package; Merge and Bag+Fusion each provide ≈1 at peak.  
Rationale: preserves tactical depth — no layer pre-solves runs.

**V7 — In-run power floor ≥ 25%**  
At every progression stage (fresh Lv1 through peak Session 30+), the player's in-run (Bag + Fusion) power contribution must be ≥ `{IN_RUN_POWER_FLOOR_PCT}%` of total UPI.  
Enforcement: §20.5 Empty Bag Test (inverse check).

**V8 — In-run power ceiling ≤ 40%**  
At late game (Session 20+), in-run power contribution must be ≤ `{IN_RUN_POWER_CEILING_PCT}%` of total UPI. Otherwise bag dominates and permanent progression feels meaningless.

**V9 — Empty Bag Test passes**  
A player with full permanent progression (Equipment Lv20 + Tree Loop 1 + Merge T5/T6) and EMPTY bag cannot clear late-game levels (Lv10 content reference).  
Check: `player_UPI(no bag) / enemy_UPI_at_Lv10 < 1.8`.  
Current v32 verification: 1.54× ✓ (passes).

### 31.3 Progression invariants

**V10 — Layer orthogonality**  
No new layer may overlap ≥ 50% with an existing layer's primary role. Layers keep distinct stat profiles:
- Tree: base HP/dmgMin/dmgMax/gold% floor.
- Equipment: slot-specific stats (Lv1-20 growth).
- Merge Tier: family bias + piece-specific lines.
- Bag + Fusion: chance stats + situational + fusion synergies.

**V11 — UPI ratio in session-stage bands**  
At sessions 5, 10, 15, 25 (checkpoint targets), `player_UPI / enemy_UPI` must fall within the tier band:
- Early (sessions 1-5): `{UPI_RATIO_EARLY_MIN}` to `{UPI_RATIO_EARLY_MAX}`.
- Mid (sessions 6-15): `{UPI_RATIO_MID_MIN}` to `{UPI_RATIO_MID_MAX}`.
- Late (sessions 16+): `{UPI_RATIO_LATE_MIN}` to `{UPI_RATIO_LATE_MAX}`.

**V12 — Chance caps respected**  
Effective chance-based stats must never exceed caps:
- Crit Chance ≤ `{CHANCE_CAP_CRIT_PCT}%`.
- Block Chance ≤ `{CHANCE_CAP_BLOCK_PCT}%`.
- Double Strike Chance ≤ `{CHANCE_CAP_DOUBLE_STRIKE_PCT}%`.
- Lifesteal ≤ `{CHANCE_CAP_LIFESTEAL_PCT}%`.  
Enforcement: §8.3, §11.

### 31.4 Dual-currency + meta invariants

**V13 — Dual-currency integrity**  
Gold and Rune Shard are strictly separate flows. No feature injects Gold into Rune Trial rewards. No feature injects Rune Shard into Main Run rewards. Equipment is a shared output surface but NOT a currency (pieces, not units).  
Enforcement: §21.4.

**V14 — SIRC pass at 5 tiers**  
At Main Run level tiers Lv1/3/5/7/10, `Idle_gold_per_day / Active_gold_per_day ≤ {OUT_OF_RUN_IDLE_CEILING_PCT / 100}` (= 50% framework rule).  
Wait — framework says ≤50%, but `{OUT_OF_RUN_IDLE_CEILING_PCT}` is 30% (different concept — see V18). The SIRC threshold of 50% is NOT stored as an ID in `02_balance_values.md`; it is framework-fixed. Use the literal 50% in SIRC verification.  
Enforcement: §22.6. Reference: v32 §5.10 passed all 5 tiers (19%-45% range).

**V15 — Merge T1 supply sufficiency**  
`expected_T1_pieces_per_30_days ≥ 3^(target_tier - 1) × 1.5` at the "full build" target tier (currently T5 per v32 §7.2).  
Rationale: 1.5× buffer ensures supply isn't knife-edge.  
Enforcement: §25 + Idle/kill drop rates.

**V16 — Wave Stacking Stress Test**  
`P(≥3 waves simultaneously active at Day 3) ≤ {WAVE_STACK_DAY_3_MAX_PCT}%` of `{MONTE_CARLO_SAMPLE_SIZE}` seeds, per level.  
Enforcement: §17.3, §20.2.

**V17 — Mode Role uniqueness (MMRM)**  
Each mode declares exactly one role: `primary progression driver`, `currency faucet`, or `supplemental passive`. No two modes share the `primary progression driver` role.  
Current v33 mode assignments:
- **Main Run** = `primary progression driver` (gold + equipment + bag + content).
- **Rune Trial** = `currency faucet` (Rune Shard only, daily gated).
- **Idle Reward** = `supplemental passive` (gold + equipment, rate-limited by SIRC).

### 31.5 Idle out-of-run ceiling (V18 — v32 extension)

**V18 — Idle out-of-run ratio ≤ 30%**  
Over a 30-day rolling window, Idle's contribution to out-of-run UPI must be ≤ `{OUT_OF_RUN_IDLE_CEILING_PCT}%` of total out-of-run UPI. This is distinct from V14 SIRC (which measures daily gold ratio).  
V14 measures: Idle gold income vs active gold income per day.  
V18 measures: Idle-sourced permanent progression power vs total permanent progression power over 30 days.  
Reference: v32 verification showed 20% ✓ (passes).

### 31.6 Invariant priority

When two invariants conflict (edge case during tuning), priority order:

1. V1-V4 Combat/Stat (player survivability + readability) — HIGHEST.
2. V12 Chance caps (prevents runaway combat).
3. V13 Dual-currency (preserves economy architecture).
4. V17 MMRM (preserves mode role clarity).
5. V5-V11 Build architecture + progression.
6. V14-V16, V18 Quantitative thresholds — LOWEST (tunable via playtest).

If a proposed change violates a higher-priority invariant to satisfy a lower one, the change must be rejected or restructured.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

# Deferred list (historical — all resolved)

The following items were listed as deferred during Session 6-7 draft and have since been resolved or deemed not applicable:

- ✅ Mystery cell mechanics + Battlefield Bag popup flow — completed in §18 (Session 8-9).
- ✅ Full-bag replace UX flow — completed in §18.7.
- ❌ Power-up selection after WinText — removed per user confirmation Session 16. Not in v33 (see §28 placeholder).
- ✅ Partial gold on lose — resolved in §15.3 (Day-depth-proportional efficiency).
- ✅ Difficulty scoring integration (ESP/ECP/TPP/RR → PS_day) — completed in §19 + `06_verification.md` §7.

---

**End of `01_rules.md` (Sessions 6-13 + Session 16 patch).** 31 rule sections across 4 Parts. Section 28 intentionally empty (feature removed). Cross-references verified. 3 open questions remain (RT-TZ timezone, FUS-SLOT accounting, LOOP-2 tree scaling) — all tracked in `07_open_questions.md` with v33 interim answers or principles.

**Next:** Session 14 (`03_content.md`) — enemy archetype behaviors, 15 bag items catalog detail, tree nodes, merge families, boss placeholder, level enemy manifests (count/type per level).
