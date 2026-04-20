# Prototype GDD for AI Dev Web Game

## Project: DiceBound
- Version: 29
- Owner: Long Thăng x Cường Đẹp
- Last updated: 17/04/2026

---

## 1. Document Control
- **Project name:** DiceBound
- **Prototype name:** DiceBound
- **Version:** 29
- **Owner:** Long Thăng x Cường Đẹp
- **Last updated:** 17/04/2026
- **Purpose of this doc:** Tài liệu mô tả current locked design của prototype hiện tại, gồm implemented baseline và các update đã được khóa đến version 28
- **Intended use:**
  - Design alignment
  - AI Dev prompt source
  - Change management
  - Regression control

### 1.1 Document rules
- AI Dev không được tự thêm feature nếu không có yêu cầu rõ.
- Chỉ sửa đúng section liên quan.
- Nếu một thay đổi ảnh hưởng section khác, phải nêu rõ impact.
- Không đổi schema, architecture, flow ngoài scope.

### 1.2 Current status
- Filled

### 1.3 Source of truth
- Product definition / Design document

### 1.4 Changelog
- **v29 — 17/04/2026**
  - Reworked the current approved `Rune Trial` sweep-eligibility rule
  - Removed the previous restriction that sweep applies only to older cleared stages
  - Removed the previous restriction that the current highest cleared stage may not be swept
  - Locked the new current approved direction:
    - any `Rune Trial` stage that has already been cleared may use `Sweep / auto-win`
    - this includes the current highest cleared stage if it has already been cleared
    - sweep still consumes `1` rewarded win
    - sweep reward still equals manual-clear reward
    - if the player has no rewarded wins left for the day, sweep is not available because the mode cannot be entered again that day
  - Updated `Rune Trial` current-behavior, meta-loop, content, acceptance, and UI-data wording so AI Dev should no longer gate sweep behind `older stage only` logic

- **v28 — 17/04/2026**
  - Reworked the current approved main-mode queued-wave cadence again so queued waves are no longer eligible to spawn on every `Day` player turn
  - Locked the new current approved cadence for main mode:
    - `Wave 1` spawns when the level begins on `Day 1 Turn 1`
    - after that, only the **first `Player turn` of each `Day` block** may spawn the next queued wave
    - the remaining `3` `Day` turns in that same block do **not** spawn queued waves
    - the `2` `Night` turns do **not** spawn queued waves
    - therefore, in a `2-wave` level, `Wave 2` now earliest-spawns on `Day 2 Turn 1`
  - Locked the main readability dependency of the cadence change:
    - next-wave preview must align to the next eligible `Day`-block spawn window
    - next-wave preview must **not** be auto-visible from initial level entry by default
  - Updated core loop, core rules, wave-system wording, win/lose references, and acceptance wording so AI Dev should no longer spawn queued waves on every `Day` turn or show `Wave 2` warning markers at level-start by default

- **v27 — 16/04/2026**
  - Locked the exact `Rune Shard / Mảnh Ấn` tree-cost table by keeping the previous legacy tree costs `1:1` and changing only the spend currency from `gold` to `Rune Shard`
  - Locked the exact current approved tree node costs:
    - `Iron Hide = 16 / 24 / 36 Rune Shard`
    - `Steady Hand = 16 / 24 / 36 Rune Shard`
    - `Clean Loot = 16 / 24 / 36 Rune Shard`
    - `Veteran Body = 28 / 42 / 60 Rune Shard`
    - `Finisher's Edge = 28 / 42 / 60 Rune Shard`
    - `Contract Bonus = 28 / 42 / 60 Rune Shard`
    - `Campaign Command = 52 / 72 / 96 Rune Shard`
    - full tree total = `838 Rune Shard`
  - Locked the exact current approved `Rune Trial` stage reward table:
    - `Stage 1 = 7`
    - `Stage 2 = 9`
    - `Stage 3 = 10`
    - `Stage 4 = 11`
    - `Stage 5 = 12`
    - `Stage 6 = 13`
    - `Stage 7 = 14`
    - `Stage 8 = 15`
    - `Stage 9 = 16`
    - `Stage 10 = 17`
    - `Stage 11 = 18`
    - `Stage 12 = 19`
    - `Stage 13 = 20`
    - `Stage 14 = 21`
    - `Stage 15 = 22`
    - `Stage 16 = 23`
    - `Stage 17 = 24`
    - `Stage 18 = 25`
    - `Stage 19 = 26`
    - `Stage 20 = 27`
    - there is still no first-clear bonus
    - sweep reward still equals manual-clear reward
  - Locked exact persistence field names under `diceBoundPlayerData.runeProgress`:
    - `runeShardBalance`
    - `highestClearedStage`
    - `stageClearMap`
    - `dailyRewardedWinsUsed`
    - `lastDailyResetAt`
  - Locked `Rune Trial` incoming `Wave 2` preview to reuse the current main-mode red `X` visual language
  - Locked that, after the player has used both daily rewarded wins, attempting to enter `Rune Trial` again that day shows a short toast on the `Modes` screen
  - Added AI Dev contract direction for the current partial file-ownership state:
    - AI Dev must inspect the codebase first
    - AI Dev must return the proposed file/module list before implementation begins
  - Clarified current implementation scope direction:
    - official product direction still targets `20` handmade `Rune Trial` stages
    - until the full handmade per-stage table is locked, current implementation may ship the mode framework plus `3` sample stages only

- **v26 — 16/04/2026**
  - Promoted the previously reviewed `Rune Shard` tree-currency / daily-mode working draft into the official main GDD source of truth
  - Locked the new tree-currency ownership:
    - the current power tree continues to use the source name `Gold Tech Tree`
    - tree nodes no longer use `gold` as upgrade currency
    - tree node upgrades now use `Rune Shard / Mảnh Ấn`
  - Added the official daily tree-resource mode: `Rune Trial`
    - entry point = `Modes`
    - reward = `Rune Shard` only
    - purpose = `daily return reason + daily power-floor check + account-power checkpoint`
  - Locked the current approved `Rune Trial` stage structure:
    - `20` stages in the initial structure
    - each stage is `handmade`
    - map size is smaller than the main mode
    - each stage targets `1–2` minutes
    - each stage contains `2` short waves
    - `Wave 1` is lighter and `Wave 2` is clearly heavier
    - objective = defeat all enemies across the stage's `2` waves
    - lose condition = player death
  - Locked the current approved `Rune Trial` gameplay scope:
    - uses `movement + combat`
    - does **not** use `Battlefield Bag`
    - does **not** use `Fusion`
    - does **not** use `Mystery cell`
    - does **not** use `Day / Night`
    - uses the player's full current account power
    - enemy level scaling follows the same approved enemy-level framework as the main mode
    - early stages use a subset of the enemy roster; later stages open the full roster
  - Locked the current approved `Rune Trial` wave-flow direction:
    - `Wave 2` uses the current red `X` preview language
    - when `Wave 1` is cleared, `Wave 2` spawns immediately on its marked tiles
    - there is no separate prep turn between the two waves in this mode
  - Locked the current approved `Rune Trial` daily / sweep rules:
    - player has `2` rewarded wins per day
    - reset time = `7:00`
    - losing does **not** consume a rewarded win
    - winning consumes `1` rewarded win and unlocks the next stage
    - after the player has used both daily rewarded wins, the mode can no longer be entered that day
    - the player may replay any older stage that has already been cleared
    - `Sweep / auto-win` is allowed only on already-cleared older stages
    - the current highest cleared stage may **not** be swept
    - sweep consumes `1` rewarded win
    - sweep reward equals manual-clear reward
    - there is no first-clear bonus
  - Locked the current approved `Rune Trial` UI / data direction:
    - the `Modes` card for `Rune Trial` shows `remaining rewarded wins` and `highest cleared stage`
    - the stage-select UI shows `stage number`, `reward`, `clear status`, and `sweep button`
    - the mode does **not** show `recommended power`
    - persistence must track `Rune Shard` balance, `highest cleared stage`, per-stage clear status, `daily rewarded wins used`, and the daily reset timestamp
  - Clarified what remains intentionally open after v26:
    - exact `Rune Shard` node-cost table after the rescale from the legacy gold table
    - exact `Rune Trial` reward values by stage

- **v25-working-rune-shard-mode — 16/04/2026**
  - Working-draft override for the current `Gold Tech Tree` economy direction:
    - tree nodes no longer use `gold` as the approved upgrade currency in this draft
    - tree node upgrades now use `Rune Shard / Mảnh Ấn`
  - Added a new current working-draft progression source for tree currency:
    - a new short-session stage-based mode grants `Rune Shard`
    - the mode exists to check whether the player's current account power has reached the daily required threshold while creating a daily return reason
  - Locked the current approved mode rules for this working draft:
    - player has `2` daily rewarded clears
    - losing does **not** consume a daily clear
    - winning consumes a daily clear and unlocks the next level
    - player may return to already-cleared older levels
    - already-cleared older levels support `quick play / auto-win` reward claim
  - Locked that this new mode grants `Rune Shard` only
  - Locked that the working draft changes the tree currency only; exact `Rune Shard` cost conversion, exact mode reward table, exact reset timing, exact entry UI wording, and exact persistence field names remain `TBD` in this draft

- **v25 — 16/04/2026**
  - Promoted the previously reviewed slot-upgrade Lv1 / popup-readability working draft into the official main GDD source of truth
  - Locked that `Equipment Upgrade` slot stats already exist at `Lv1` as the slot baseline:
    - `Weapon slot Lv1 = +1 dmgMin, +2 dmgMax`
    - `Auxiliary Equipment slot Lv1 = +2 dmgMin, +1 dmgMax`
    - `Helmet slot Lv1 = +10 Max HP`
    - `Armor slot Lv1 = +10 Max HP`
  - Clarified slot-stat application ownership:
    - slot stats apply to the character only when the corresponding equipment piece is currently equipped in that slot
    - if that slot is unequipped, that slot's stats do not apply to the character
  - Updated the Equipment item-info popup direction so the first block of the popup shows the current slot stats before the equipment tier lines
  - Updated progression / runtime-stat / popup-readability wording so AI Dev should no longer treat `Lv1 slot stats` or `unequipped slot-stat behavior` as unresolved
- **v24 — 16/04/2026**
  - Updated the current approved end-of-run `result table` presentation so it no longer lists in-run `power items`
  - Locked the new result-table reward scope:
    - keep `Win / Lose`
    - keep `Enemies killed`
    - keep `Gold earned`
    - show only `Equipment obtained during the run`
    - do not show the list of in-run `power items`
  - Locked the design goal of the result-table adjustment:
    - the end-of-run summary should emphasize `account-level rewards`
    - temporary in-run rewards should not be repeated after the run ends
  - Updated the current approved `Equipment Merge Tier` recipe cadence to align more closely with the intended `Archero 2` direction:
    - `T1 -> T2 = 1 root + 2 exact duplicates`
    - `T2 -> T3 = 1 root + 2 exact duplicates`
    - `T3 -> T4 = 1 root + 2 exact duplicates`
    - each of the above steps now requires `3 total items`
  - Kept the later-step recipe direction unchanged:
    - `T4 -> T5 = 1x same-slot same-family fodder`
    - `T5 -> T6 = 2x same-slot same-family fodder`
  - Updated equipment-framework, merge-recipe, Blacksmith-material, and result-table wording so AI Dev should no longer keep the old `2-item` early-tier recipe or show `power item` history in the run-end summary

- **v23 — 16/04/2026**
  - Reworked the wave-progression trigger so new waves are no longer blocked by fully clearing the current wave
  - Locked the new wave-spawn cadence:
    - if another wave is queued, it now spawns at the start of a `Day` player turn
    - this spawn can happen even when enemies from previous waves are still alive
  - Locked wave overlap as the current approved direction:
    - previous-wave enemies stay on the board
    - newly spawned wave enemies are added on top
    - level completion still requires defeating all enemies across all spawned waves
  - Kept the current preview-marker language but repointed it to the new cadence:
    - `X` đỏ = next scheduled wave enemy spawn positions
    - `X` xanh = next scheduled wave mystery spawn positions
    - preview still shows positions only, not exact enemy info
  - Updated core loop, core rules, wave system, objective / win-lose references, and acceptance wording so AI Dev should no longer keep the old `clear wave -> 1 prep turn -> enemy-turn spawn` flow

- **v22 — 15/04/2026**
  - Added a required end-of-run `result table` inside the current Win/Lose result flow:
    - show `Win / Lose`
    - show `Enemies killed`
    - show `Gold earned`
    - show `Equipment obtained during the run` only; do not show in-run `power items`
  - Reworked the current enemy-death reward presentation so that, in addition to the existing `Battlefield Bag` power-item flow:
    - after the combat UI closes, enemy death also spawns `Gold`
    - enemy death also has a current approved chance to drop a random `Tier 1 Equipment` at about `20%`
    - dropped `Gold` and `Equipment` jump out from the dead enemy, wait about `0.5s`, then fly into a bag target at the top-right of the gameplay HUD
  - Updated the current bag-choice rule so choosing `1` of the `3` power-item choices may now also swap with a currently owned power item even when the bag is not full
  - Updated the main `Equipment` screen owned-list rule:
    - currently equipped equipment pieces no longer appear again in the lower owned-equipment list
    - therefore the main Equipment screen no longer needs the `E` tag in that lower list
    - `Blacksmith` keeps the previous equipped-item readability rules unchanged

- **v21 — 15/04/2026**
  - Reworked the official `Equipment UI Flow` to make equipment reading more item-centric while keeping the locked ownership model unchanged:
    - `Equipment Upgrade` remains **slot-based**
    - `Equipment Merge Tier` remains **piece-based**
  - Locked the new `Home -> Equipment` screen presentation:
    - dedicated `Back` button at the top-left
    - `4` equipped slots arranged as `2` on the left and `2` on the right
    - character display at the center of the equipped-slot area
    - owned-equipment list shown as a square-icon grid with `5` columns
  - Replaced the old `tap equipped slot -> small slot-upgrade popup` interaction with the new approved item-info popup flow:
    - tapping any equipment icon opens an item-info popup
    - all tier lines remain visible in the popup
    - locked / not-yet-unlocked tier lines stay dimmed until the correct tier is reached
    - unequipped items show `Equip` or `Swap` depending on slot occupancy
    - equipped items show `Unequip` and `Upgrade`
    - `Upgrade` is shown only for currently equipped items
    - gold cost is shown directly above the `Upgrade` button
    - tapping `Upgrade` upgrades the corresponding **slot** immediately without opening another popup
  - Locked the new `Blacksmith` layout presentation:
    - root-equipment slot is a square icon-sized slot above the material-slot area
    - owned-equipment list in Blacksmith uses the same square-icon `5`-column grid as the main Equipment screen
    - Blacksmith owned-item grid matches the same icon size and spacing as the main Equipment screen
  - Updated UI-readability wording so AI Dev should not keep the deprecated small upgrade popup flow or guess a different inventory-grid style

- **v20 — 14/04/2026**
  - Corrected the ownership model of `Equipment Upgrade`:
    - `Upgrade` is now explicitly a **slot upgrade**, not an individual-equipment-item upgrade
    - upgrading `Weapon / Auxiliary Equipment / Helmet / Armor` increases the base stats of that **slot**
    - when the player swaps a different equipment piece into that slot later, the newly equipped piece still receives the upgraded slot base stats
  - Clarified that `Equipment Merge Tier` remains piece-based while `Equipment Upgrade` is slot-based, so the two progression layers now have explicit separate ownership:
    - `Upgrade` = slot ownership
    - `Merge Tier` = equipment-piece ownership
  - Updated the official `Equipment UI Flow` so the approved `Upgrade` popup is now defined as a slot-upgrade popup, not an item-upgrade popup
  - Updated progression / economy / readability wording where needed so AI Dev should not accidentally implement per-item upgrade persistence for equipment

- **v19 — 14/04/2026**
  - Promoted the previously reviewed `Equipment UI Flow` working draft into the official main GDD UI source of truth
  - Locked the exact `Home -> Equipment` entry and the base Equipment-screen layout with `4` equipped slots, owned-equipment list, and bottom `Blacksmith` entry
  - Locked the exact `Upgrade` popup flow:
    - tap equipped slot -> small popup
    - popup is for **slot upgrade**, not per-item upgrade
    - show `current slot stats`, `next slot stats`, `gold cost`, `Upgrade` button
    - dedicated `X` close button at the popup's top-right
    - upgrade applies immediately and keeps the player in the same Equipment UI
    - swapping a different equipment piece into that slot later still keeps the upgraded slot base stats
  - Locked the exact `Blacksmith` merge popup flow:
    - dedicated `X` close button at the popup's top-right
    - root equipment selected from the full owned-equipment list
    - owned item tap auto-fills the first valid slot
    - tapping a filled slot item removes it
    - `Merge` button sits directly below the material-slot area
    - when merge requirements are not met, `Merge` stays visible and tapping it shows a toast explaining what is missing
    - no pre-merge result preview is shown
  - Locked owned-equipment readability rules in the Equipment / Blacksmith UI:
    - equipped items show a small `E` tag at the icon's bottom-right
    - equipped items cannot be consumed as fodder and show a lock overlay when not consumable
    - equipped items are prioritized to the top of the owned-equipment list, then sorted by slot type, then higher tier first
  - Locked merge-success behavior:
    - merged result flies to the center of the screen, then returns into the owned-equipment list
    - if the root equipment was equipped before merge, the merged result automatically stays equipped

- **v18-working-equipment-ui — 14/04/2026**
  - Added a working-draft `Equipment UI Flow` section without bumping the main approved document version
  - Locked the current proposed `Home -> Equipment` entry flow for equipment management
  - Locked the current proposed `Upgrade` popup flow inside the Equipment UI:
    - tap equipped slot -> open small popup
    - show `current stats`, `next stats`, `gold cost`, and `Upgrade` button
    - keep the player inside the same Equipment UI after upgrade
    - close popup with a dedicated `X` button
  - Locked the current proposed `Blacksmith` merge popup flow:
    - open from a bottom `Blacksmith` button inside Equipment UI
    - use a top root-item slot and recipe-driven material slots
    - select root equipment from the full owned-equipment list
    - tap owned equipment once to auto-fill the first valid material slot
    - tap a filled material item once to remove it from that slot
    - show a dedicated `Merge` button directly below the material-slot area
  - Locked working-draft readability rules for owned-equipment presentation:
    - equipped items are prioritized to the top of the owned-equipment list
    - equipped items show a small `E` tag at the bottom-right of the icon
    - equipped items cannot be used as merge fodder and must show a lock overlay on the icon
  - Locked the current proposed merge-success feedback in the working draft:
    - merged equipment flies up to the center of the screen
    - then returns into the owned-equipment list area
    - if the root equipment was equipped before merge, the merged result automatically remains equipped

- **v18 — 14/04/2026**
  - Locked the current approved equipment-economy currency direction:
    - `Equipment Upgrade` uses `gold`
    - `Equipment Merge Tier` uses `gold`
  - Locked the current approved economy-role split for equipment spending:
    - `Upgrade` is the cheaper sink
    - `Merge` is the more expensive sink
    - current approved target ratio = `merge at equivalent power step costs about 3x upgrade`
  - Locked the current approved equipment-cost direction:
    - upgrade is cheaper in early progression
    - merge starts becoming significantly more expensive from `Tier 3` onward
  - Locked the current exact approved cost tables:
    - `Equipment Upgrade` target costs from `Lv2 -> Lv20`
    - `Equipment Merge Tier` gold costs from `T1 -> T6`, in addition to the already locked material recipe
  - Updated progression / economy / equipment-framework references so exact equipment currencies and current approved cost tables are no longer treated as unresolved for the current temporary framework

- **v17 — 14/04/2026**
  - Locked the exact `Tier 2` numeric values for the current approved temporary `Equipment Merge Tier` framework:
    - `Weapon = +1 dmgMin, +1 dmgMax`
    - `Auxiliary Equipment = +1 dmgMin, +1 dmgMax`
    - `Helmet = +10 Max HP`
    - `Armor = +10 Max HP`
  - Clarified that `Tier 2` remains a light base-growth step, but is no longer numerically open in the current approved direction
  - Updated the equipment-framework references, long-term progression references, and open-question list so `exact Tier 2 numeric values` are no longer treated as an unresolved item

- **v16 — 14/04/2026**
  - Replaced the previous `Equipment Merge Tier` tier-ladder direction with the current approved temporary `6-tier` structure:
    - `Tier 1 = Base / Unmerged`
    - `Tier 2 = base growth light`
    - `Tier 3 = Line 1`
    - `Tier 4 = Line 2`
    - `Tier 5 = Line 3`
    - `Tier 6 = Line 4`
  - Clarified that the current game currently stops at `Tier 6`, and `Tier 6` is a temporary current cap rather than the final long-term cap
  - Locked the current `Archero 2`-cadence merge recipe for `Tier 1 -> Tier 6`:
    - `T1 -> T2 = 2x exact duplicate`
    - `T2 -> T3 = 2x exact duplicate`
    - `T3 -> T4 = 2x exact duplicate`
    - `T4 -> T5 = 1x same-slot same-family fodder`
    - `T5 -> T6 = 2x same-slot same-family fodder`
  - Locked merge recipe definitions and runtime guardrails:
    - `exact duplicate` = same piece, same slot, same family / set
    - `same-slot same-family fodder` = same slot, same family / set, not required to be the exact same piece
    - merge has no fail chance in the current approved direction
  - Locked that `Tier 2` is only a light base-growth step
  - Locked the current full `Line 1 -> Line 4` stat tables for all `4` family sets across `Weapon / Auxiliary Equipment / Helmet / Armor`
  - Kept open items explicit after this update:
    - exact bag-reward-weighting interaction
    - future tier expansion beyond the current temporary `Tier 6` cap

- **v15 — 14/04/2026**
  - Locked the next approved framework layer for `Equipment Merge Tier` using an `Archero 2`-like piece-by-piece model instead of a hard full-set-bonus model
  - Locked that each equipment piece unlocks additional stat lines when merged to higher tiers; family bias comes from the combined unlocked lines across multiple pieces
  - Locked that there are `4` equipment sets / family directions in the current framework; current working labels remain:
    - `Stability`
    - `Burst`
    - `Guard`
    - `Sustain`
    while display wording may still be refreshed later without changing the underlying direction
  - Locked that every equipment set maps to `1` family direction, and each piece inside that set contributes stats toward that family identity
  - Renamed `Ring` to `Auxiliary Equipment` in the equipment-framework direction
  - Locked that the first unlocked stat line of each `Auxiliary Equipment` must strongly signal the family:
    - `Stability` -> `+dmgMin`
    - `Burst` -> `+Double Strike Chance`
    - `Guard` -> `+Block Chance`
    - `Sustain` -> `+post-combat heal`
  - Locked signal distribution across pieces:
    - `Auxiliary Equipment` = strongest family signal
    - `Weapon` = second-strongest family signal
    - `Helmet` and `Armor` = lighter support lines
  - Locked that `Helmet` and `Armor` family roles are not globally fixed and may vary by family
  - Locked the current merge-tier structure direction:
    - `Tier 1` = base bias stat
    - `Tier 2` = unlock `Line 1`
    - `Tier 3` = unlock `Line 2`
    - `Tier 4` = upgrade `Line 1 + Line 2`
    - `Tier 5` = unlock `Line 3` as a light capstone
  - Locked a readability guardrail for merge lines:
    - do not use hidden percentile / backend-roll-window conditions
    - merge lines may use only always-on stats or conditions that are clearly readable from UI / combat state
    - current approved readable condition examples: `enemy < 50% HP`, `first hit each combat`, `Night`, `after winning combat`
  - Clarified that exact merge-tier stat lines for `Weapon / Auxiliary Equipment / Helmet / Armor`, exact recipe cost, exact currencies, and exact interaction with bag reward weighting remain open and must not be guessed

- **v14 — 13/04/2026**
  - Locked the first numeric baseline package for `Equipment Upgrade` in the current approved direction:
    - `Weapon = +1 dmgMin, +2 dmgMax per upgrade level`
    - `Auxiliary Equipment = +2 dmgMin, +1 dmgMax per upgrade level`
    - `Helmet = +10 Max HP per upgrade level`
    - `Armor = +10 Max HP per upgrade level`
  - Clarified that equipment damage growth must still respect the current player damage-guard philosophy; future runtime resolution / UI flow / currencies remain open
  - Rebased the current player damage-width anchor by changing the current reference `Slime HP` from `40` to `50`
  - Locked the new current baseline implication:
    - player damage width cap changes from `20` to `25`
    - player baseline band remains `20-40` with design band `50% -> 100%`
  - Updated the current enemy baseline playtest table to:
    - `Slime = HP 50, DMG 30-40, spd 1-1`
    - `Wind = HP 30, DMG 20-30, spd 2-4`
    - `Worm = HP 70, DMG 40-50, spd 2-2`
    - `Fire = HP 50, DMG 50-60, spd 1-3`
  - Updated the approved enemy per-level scaling cadence from `HP +10 each level / DMG +10 every 2 levels` to:
    - `HP +10 each level`
    - `DMG +10 every 3 levels`
    - `moveSpeed` still remains fixed by archetype identity
  - Updated combat, progression, difficulty-scaling, enemy-type, and open-question references so the new equipment baseline package and enemy-balance package are now the main source of truth instead of staying only in working notes

- **v13 — 11/04/2026**
  - Approved a structural system-change direction for out-of-run progression instead of keeping the old `Equipment = baseline-only` role split
  - Locked the new merge-ready out-of-run role split:
    - `Gold Tech Tree = pure base power / economy smoothing`
    - `Equipment Upgrade = base power`
    - `Equipment Merge Tier = family bias`
  - Locked a new build-completion guardrail:
    - a full build direction should require `2–3 packages`
    - `Equipment Merge Tier` may provide `1 package`
    - `Battlefield Bag + Fusion` in-run must still provide at least `1` important additional package
  - Clarified that `Gold Tech Tree` may later support `capacity / build bandwidth`, but must not become the dominant family-direction system
  - Added guardrail wording for the two main framework risks:
    - `stat inflation`
    - `in-run identity suppression`
  - Merged the new framework only at the role / guardrail / TBD level; exact equipment currencies, tier ladder, merge recipes, package taxonomy, armor rule, and bag-slot expansion path remain open and must not be guessed

- **v12 — 10/04/2026**
  - Added a new on-board `enemy threat preview` during the player turn in both `BeforeRoll` and `AfterRoll`
  - Locked threat-preview behavior:
    - shown for all alive enemies by default
    - player-facing HUD toggle may turn the preview `on / off`
    - preview uses real reachable tiles from each enemy's current position
    - preview must respect obstacle, walkability, and pathing rules
    - `dark red` = tiles reachable by that enemy's current-phase `moveSpeedMin`
    - `light red` = tiles reachable by that enemy's current-phase `moveSpeedMax`
    - preview always uses the current board phase; during `Night` it must reflect Night movement range
  - Replaced the old `BeforeRoll tap enemy -> enemy info tooltip` rule with a small tooltip shown directly above the tapped enemy
  - Locked enemy-tooltip behavior:
    - usable only in `BeforeRoll`
    - tap an enemy once to show its tooltip
    - tap the same enemy again to close its tooltip
    - only `1` tooltip may be visible at a time
    - tooltip shows `archetype name`, `level`, `HP`, `DMG min-max`, and `moveSpeed min-max`
  - Updated core loop, controls, core rules, movement, threat communication, UI/readability, and regression references so Cursor must not keep the old popup behavior or guess the threat-preview calculation

- **v11 — 10/04/2026**
  - Locked a new `Skip Turn` control in `BeforeRoll` so the player may end the player turn without rolling or moving
  - Locked `Skip Turn` behavior:
    - usable only in `BeforeRoll`
    - consumes no roll because the player does not roll at all
    - immediately ends the player turn
    - has no usage limit in the current approved direction
  - Updated core loop, controls, core rules, movement, UI/readability references, and anti-forced-move direction so the player is no longer forced to leave an already-optimal position
  - Locked a new wave-content rule: every wave must spawn at least `1` new mystery cell belonging to that wave
  - Clarified that old uncollected mystery cells may still carry over, but carry-over mystery does **not** satisfy the new-per-wave mystery requirement by itself
  - Updated mystery-cell, wave-system, core-loop, and difficulty / anti-frustration references so every wave must provide an early route target instead of letting the player only wait for enemies to approach

- **v10 — 10/04/2026**
  - Reworked next-wave preview timing so the game now previews both `enemy spawn tiles` and `new mystery-cell spawn tiles` earlier, with more preparation time and information for the player
  - Locked two valid wave-clear entry cases for the preview state:
    - wave ends during `Player turn`
    - wave ends during `Enemy turn` because the acting enemy dies while attacking the player
  - Locked the new preview markers:
    - red `X` = next-wave enemy spawn position
    - green `X` = next-wave mystery-cell spawn position
  - Locked the new spawn timing:
    - preview appears immediately when the current wave ends
    - the player then gets `1` full player turn to prepare
    - on the following `Enemy turn`, next-wave enemies and next-wave mystery cells spawn on their marked tiles
  - Locked the current next-wave spawn-act rule:
    - normal next-wave enemies do **not** act in the same enemy turn in which they spawn
    - special overlap exception: if a next-wave enemy spawns on the player's tile, it attacks immediately
    - special overlap exception: if a next-wave mystery cell spawns on the player's tile, the player receives that mystery immediately
  - Kept that old uncollected mystery cells carry over into the new wave, while the preview now also shows the incoming mystery-cell positions for the next wave
  - Updated core loop, core rules, wave system, mystery-cell rules, UI/readability references, and spawn-overlap handling so Cursor must not guess the warning-state timing or overlap outcomes

- **v9 — 09/04/2026**
  - Locked the first detailed `Gold Tech Tree v1` structure for DiceBound as an `8-node` tree with `1` free structural root and `3` lanes: `Sustain`, `Combat`, and `Economy`
  - Locked the current v1 topology direction:
    - `Root` opens all `3` lanes
    - `Sustain` lane = `Iron Hide -> Veteran Body`
    - `Combat` lane = `Steady Hand -> Finisher's Edge`
    - `Economy` lane = `Clean Loot -> Contract Bonus`
    - final capstone = `Campaign Command`
  - Locked the current `gold efficiency` definition as: `a percentage bonus added to the total gold tally at the end of the run`, not per-enemy runtime gold modification
  - Refreshed the current v9 tree numbers to the new economy baseline:
    - tier-1 lane starts = `16 / 24 / 36`
    - tier-2 lane milestones = `28 / 42 / 60`
    - capstone = `52 / 72 / 96`
    - full tree total = `838`
  - Kept the current node values and role split:
    - `Iron Hide` = `+10 / +20 / +30 HP`
    - `Steady Hand` = `+3 / +3 / +4 dmgMin`
    - `Clean Loot` = `+5% / +6% / +7% total gold`
    - `Veteran Body` = `+5 / +10 / +15 HP`
    - `Finisher's Edge` = `+3 / +3 / +4 dmgMax`
    - `Contract Bonus` = `+4% / +5% / +6% total gold`
    - `Campaign Command` = `+2 dmgMin / +2 dmgMax / +5% total gold`
  - Locked the exact current v1 gold-economy source side for the tree:
    - economy gold bands are separate from combat threat bands
    - `Low = 1 gold`, `Mid = 2 gold`, `High = 4 gold`
    - `Slime` is the current reference `Mid` enemy and therefore grants `2 gold`
    - future boss reward is `gold only` and currently equals `8x Slime = 16 gold`
  - Locked enemy gold-band ownership as `archetype base + content override`
    - current default archetype mapping = `Wind Low`, `Slime Mid`, `Worm High`, `Fire High`
    - content override is allowed only for `elite / boss` entries and `chapter milestone` entries
  - Locked the exact current tech-tree save direction inside `diceBoundPlayerData` as a dedicated sub-object:
    - `goldTechTree.version`
    - semantic node ids
    - per-node fields = `level` + `purchasedAt`
    - `unlocked` is derived at runtime from prerequisites, not persisted separately
  - Locked the exact current v1 tech-tree UI direction:
    - entry point = dedicated button in `Home`
    - layout = vertical tree growing from bottom to top
    - no separate tooltip / side panel / bottom sheet
    - each node must show `icon`, `name`, `level`, `cost`, and `main effect` directly on the node card
    - node states = `Locked / Available / Purchased / Max`
    - interaction = `tap node to buy immediately`
  - Kept the combat-lane invariant that `dmgMax` progression cannot open before the prerequisite `dmgMin` node in the same branch is fully maxed
  - Kept the tech-tree damage-guard invariant: every permanent `dmgMin / dmgMax` node path must continue to respect the current player damage guard rules:
    - `player.dmg.max - player.dmg.min <= 50% x slime.hp_reference`
    - `player.dmg.min >= 50% x player.dmg.max`
  - Consolidated long-term progression, Gold Tech Tree mechanic definition, progression system, economy, upgrade, difficulty-scaling, enemy reward mapping, tech-tree UI, and persistence references so v9 now contains the current locked tree description in one file

- **v8 — 08/04/2026**
  - Added a new out-of-run `Gold Tech Tree` direction as the main permanent base-power lane for DiceBound
  - Locked the dominant job of the new system as `base power / power floor`, with `retention per run` as a secondary role
  - Locked that enemy kills grant gold during the run, and collected gold is carried out on both `win` and `lose`
  - Locked that deeper progress naturally yields more gold because the player kills more enemies; if future boss content is added later, boss kills should grant higher gold than a normal enemy kill
  - Locked the current first approved node categories for the tech tree:
    - `HP`
    - `dmgMin`
    - `dmgMax`
    - `gold efficiency`
  - Locked the current node-upgrade structure:
    - each node has `3` levels
    - the tech tree opens from the start of the game
    - upward progression uses `local full prerequisite` logic inside a branch
    - the player does **not** need to full-clear an entire lower tier across the whole tree to open every higher branch
  - Locked that the tech tree may have only `light` family / lane signaling at milestone nodes; the dominant build-identity system in run remains `Battlefield Bag + fusion`
  - Locked that the system has **no prestige / reset loop** in the current approved direction
  - Updated product vision / market fit, commercial guardrails, meta loop, long-term progression, win / lose carry-over, progression system, economy, upgrade, difficulty scaling, and UI flow references to reflect the new tech-tree direction
  - Recorded that exact numeric gold drops, node costs, branch count, total node count, exact data schema, and exact UI layout for the tech tree are still not yet locked and must not be guessed

- **v7 — 08/04/2026**
  - Rebased the combat-number foundation from single-digit values to `x10` scale so percentage-based combat stats have better numeric granularity
  - Updated current baseline combat reference from Player `HP 18 / DMG 2-4` to Player `HP 180 / DMG 20-40`
  - Updated current baseline enemy reference from Slime / Wind / Worm / Fire `HP 2-6 / DMG 2-6` into `HP 20-60 / DMG 20-60`, while preserving the same relative archetype roles and hit-count anchors
  - Updated current heal baseline from `+1 HP` to `+10 HP`
  - Updated flat-value item and flat-value fusion bonus numbers to the new combat scale, while keeping percentage-based item stats and movement-roll stats unchanged
  - Revised `Step Anchor` from `+1 / +1 / +2 minRoll` to `+1 / +2 / +3 minRoll` so every normal-item upgrade creates an immediate visible or felt gain
  - Updated enemy level-scaling cadence from `HP +1 each level / DMG +1 every 2 levels` to `HP +10 each level / DMG +10 every 2 levels` to match the new combat-number foundation
  - Kept the current visible power readout direction as single-number `HP + dmgMax` for the map/HUD baseline, and kept the existing requirement that secondary cues must communicate threat not captured by that number
  - Recorded that the new scale solves much of the numeric-granularity problem for `%` combat stats, but does not by itself formalize unresolved rules such as enemy damage-band formula, crit-damage formula, or rounding policy for percentage-based effects

- **v6 — 07/04/2026**
  - Locked player starting movement roll baseline from `minRoll = 1`, `maxRoll = 4` to `minRoll = 1`, `maxRoll = 3`
  - Updated core loop, movement, difficulty, and regression references to use the new baseline starting movement range `1-3`
  - Updated movement design goal: after player gains power from in-run items, gameplay currently feels too easy, so baseline movement is reduced to restore positional pressure and keep route choice meaningful
  - Expanded the design goal of `Enemy death drop + battlefield bag`:
    - fighting a single enemy must not feel dull
    - each enemy death should continue to grant a power-item reward opportunity
    - enemy-by-enemy combat should have immediate payoff and keep build growth exciting across the level

- **v5 — 07/04/2026**
  - Locked `BeforeRoll` enemy-info interaction: player may `tap` an enemy to open an enemy info tooltip before rolling
  - Clarified that `BeforeRoll` remains observation-first: outside of `tap enemy -> info popup`, the player has no other gameplay interaction before pressing `Roll`
  - Locked the full-bag reward branch so `Battlefield Bag` no longer leaves replace behavior open when all `4` slots are occupied
  - Locked full-bag replace flow: after the player taps a new reward item while the bag is full, the next branch is only `replace an existing bag item immediately` or `skip the reward`
  - Locked replace interaction to `tap new item -> tap old bag item to replace immediately`, with no extra confirm step
  - Locked that once the player has committed to a full-bag replacement candidate, the flow does not return to the original `3-choice` popup state; there is no cancel-back branch, only `replace` or `skip`
  - Updated controls, bag mechanic, inventory, UI state rules, and regression language so Cursor must not guess enemy-info interaction or full-bag replacement behavior

- **v4 — 06/04/2026**
  - Reworked `Battlefield Bag` structure from `1 utility / tactic-preferred + 3 combat-preferred` into `4` fully neutral active slots
  - Locked that any power item may enter any available bag slot; bag structure no longer separates slot identity by utility/combat type
  - Removed slot-type presentation from bag UI so Cursor must not label slots as `utilityPreferred` or `combatPreferred`
  - Kept utility/combat distinction at the item-pool and reward-weighting layer; the slot neutralization does not remove current item families, phase weights, or family/recovery/day-night bias rules
  - Removed slot-type-dependent `SlotNeedBias` from the current reward-table formula so reward logic no longer depends on preferred-slot assumptions
  - Updated bag mechanic, inventory, reward-table, UI, and regression language so the current source of truth now treats all `4` bag slots as neutral

- **v3 — 06/04/2026**
  - Locked controls presentation so movement drag shows `path preview only`; the character remains on the current tile until `release-to-commit`
  - Clarified that drag input must start from the player's current position, not from a nearest reachable-tile proxy
  - Locked that mid-path `mystery cell` interaction opens the reward popup and then continues along the remaining pre-dragged path after the popup resolves
  - Kept the existing mid-path `enemy combat` rule: if the player wins, movement continues along the remaining pre-dragged path
  - Updated controls, movement, core loop, UI/UX, and regression criteria so Cursor must not implement drag as `dragging the character object` or terminate movement incorrectly on mystery interaction

- **v2 — 06/04/2026**
  - Reworked `Mystery Cell` from a direct stat-reward source into a `Battlefield Bag` reward source
  - Removed the old Mystery reward pool: `+1 HP`, `+1 min DMG`, `+1 max DMG`
  - Locked that both `enemy death` and `mystery cell` now open the same `3-choice Battlefield Bag` popup flow
  - Added `1` full reroll per level for Battlefield Bag choices
  - Locked reroll behavior: reroll replaces all `3` current choices
  - Added `Skip` as a valid reward action: player may close the popup and receive no item
  - Locked full Battlefield Bag readability requirements:
    - item icon
    - item name
    - current level
    - affected stat(s)
    - current value -> next value
    - family / recipe relation
    - slot impact
    - state tag: `New / Upgrade / Fusion Ready`
  - Locked Heal Potion presentation as a required readable on-board pickup with visible icon / silhouette and pickup feedback
  - Locked explicit `WinText -> power-up selection -> next level` timing
  - Updated reward-flow, inventory, UI, and technical-contract sections so Cursor must not leave reward interactions in a dead-choice / dead-flow state
  - Escalated telegraphed-spawn overlap handling as an explicit implementation branch that must not be silently guessed; exact overlap outcome still needs a future rule if a non-default runtime behavior is required

- **v1 — 04/04/2026**
  - Reset the document versioning scheme from the previous `1.2.x` chain to a new integer-only version sequence starting from `v1`
  - Fixed the confirmed internal conflict around `Lifesteal` classification
  - Locked `Lifesteal` as a non-chance percentage stat that heals from final damage actually dealt
  - Locked that the current temporary `50%` cap applies only to chance-based item stats: `Crit Chance`, `Block Chance`, and `Double Strike Chance`

- **v1.2.9 — 04/04/2026**
  - Added a deferred balance note that the current enemy damage range does not yet follow a formal percentage-based rule
  - Recorded this issue across enemy scaling, combat, and design-note scope so it is visible in future balance review
  - Locked the note as a **deferred balance issue**, not an active gameplay rule
  - Locked an implementation guardrail that AI / Cursor must not silently invent a new `%` rule for enemy damage range until a later update explicitly approves one
  - Locked a revisit reminder: when future discussion touches enemy damage range, enemy variance band, or balance readability, this issue must be surfaced and asked again before updating rules
- **v1.2.8 — 04/04/2026**
  - Locked the first official enemy level-scaling framework for the prototype after the player/item curve had been stabilized through v1.2.4–v1.2.6
  - Locked the design goal that enemy scaling must create a stable difficulty rise across levels and waves without unreasonable spikes
  - Locked the scale axis so enemy level modifies `HP + DMG` only, while `moveSpeed` remains fixed by archetype identity
  - Locked the cadence rule: enemy `HP +1` every enemy level, enemy `DMG +1` every `2` enemy levels
  - Locked the rule that each level has a `base enemy level`, and later waves in that level scale upward from that base
  - Locked phase-based composition ratios for `Low / Mid / High` enemy threat bands:
    - Early = `60 / 30 / 10`
    - Mid = `40 / 40 / 20`
    - End = `25 / 45 / 30`
  - Locked hybrid threat-band mapping:
    - enemy `archetype + level` creates real stats
    - real stats are then mapped back into visible threat bands relative to current player power
    - `Low < 80%`, `Mid = 80%–120%`, `High > 120%` of current player power
  - Locked the anti-frustration scaling rule that, even as player power rises through items and fusion within a level, each level must still contain a composition of enemies weak enough for the player to defeat and keep momentum
  - Updated difficulty-scaling notes so future enemy table tuning should follow this locked framework rather than starting from scratch
- **v1.2.7 — 04/04/2026**
  - Added a deferred design note in the GDD to record that three anti-bad-draft valve ideas must be revisited later instead of being treated as already locked rules:
    - `Fusion-near bias`
    - `Soft pity for progress item`
    - explicit split between `survival recovery` and `build recovery`
  - Locked the governance note that these three valves are currently **not approved implementation rules** for DiceBound
  - Recorded that, against the current Magic Survival framework reference, the first two valves are **not source-backed**, while the third exists only as a **design interpretation / equivalent pattern** rather than a formal confirmed rule
  - Added an implementation note that AI / Cursor must not silently assume these valves are active; if anti-bad-draft logic is revisited later, this issue must be surfaced and asked again
- **v1.2.6 — 04/04/2026**
  - Locked the remaining item-system runtime rules needed for full-loop coding and playtesting without implementation guesswork
  - Locked combat item-stat order of operations as a per-hit resolve flow: each hit runs its own crit / block / lifesteal logic, and `Double Strike` creates at most one additional hit
  - Locked a temporary global cap of `50%` for the current chance-based item stats in the prototype pass: `Crit Chance`, `Block Chance`, and `Double Strike Chance`
  - Locked `Lifesteal` to heal from final damage actually dealt
  - Locked `Double Strike` to be non-chaining: one attack can create at most one extra hit, and the extra hit may still crit according to current `Crit Chance`
  - Locked phase-item timing so `Day` / `Night` item effects become active from the start of the relevant phase and apply consistently during that phase
  - Locked `Battlefield Bag` choice-offer structure into `1 progress item + 1 recovery item + 1 wildcard item` as the current anti-dead-draft UX rule
  - Locked fusion UX trigger so valid recipes enter a `fusion ready` state inside the bag and the player chooses when to execute the fusion manually
- **v1.2.5 — 04/04/2026**
  - Locked the first official numeric bonus table for every fusion endpoint item
  - Converted the previous generic fusion-bonus rule into exact per-endpoint values for all `5` utility / tactic endpoints and all `10` combat endpoints
  - Kept the protected rule that a fusion endpoint keeps the full effect of its `2` recipe items at `Lv3`, then gains only `1` additional synergy bonus smaller than the total gain of a full normal item `Lv3`
  - Recorded the balancing intent that fusion bonus must feel immediate and meaningful, but must still leave room for future enemy level-scaling and must not erase the value of the normal-item curve
  - Updated item-content and reward-table references so fusion endpoint power is now explicit instead of left at generic framework level
- **v1.2.4 — 04/04/2026**
  - Locked the first official per-item numeric table for normal bag items at `Lv1 / Lv2 / Lv3`
  - Locked the rule that every normal-item upgrade must increase visible or felt player power immediately; `Lv3` may not be a no-gain upgrade
  - Revised the first numeric pass to a more moderate curve so future enemy level-scaling can be built on top of the locked player/item curve
  - Locked `Damage Guard` resolution for bag items that modify `dmgMin / dmgMax`, reusing the current player damage guard philosophy so item upgrades remain readable without breaking current damage-width constraints
  - Locked exact numeric values for the current base-item pool, including revised values for `Step Anchor`, `Moon Ward`, `Guard Crest`, `Keen Eye`, `Fatal Fang`, `Iron Guard`, `Blood Charm`, and `Twin Sigil`
  - Locked the first official `Battlefield Bag` offer-weight mechanism:
    - `BasePhaseWeight` by `Early / Mid / End`
    - `Dynamic Modifiers` for upgrade bias, slot need, family direction, recovery, and Day / Night phase bias
  - Recorded the current balancing direction that enemy stat scaling by enemy level remains intentionally pending until the player/item stat curve is locked, and future enemy scaling should be tuned against this locked item baseline
- **v1.2.3 — 04/04/2026**
  - Locked the first official `Battlefield Bag Item-Synergy & Fusion Framework` into the GDD
  - Locked out-of-run `Equipment` as baseline-only progression for each run: `+Max HP / +dmgMin / +dmgMax`
  - Locked in-run item-build structure into `3` phases:
    - `Early phase` = survive long enough to choose a build
    - `Mid phase` = develop the strongest synergy for the current build
    - `End phase` = maximize synergy through fusion for the final stretch of the level
  - Locked enemy-death bag reward flow:
    - each enemy death opens a popup with `3` power-item choices
    - one or more choices may be an already-owned item and function as an upgrade
    - if a chosen item is new, it enters the appropriate bag slot
    - if a chosen item matches an owned item, that owned item gains `+1` level up to `level 3`
  - Locked normal power items to `level 1 -> 3`; locked fusion requirement to `2 items at level 3`
  - Locked fusion result as an endpoint item:
    - fusion item has **no level**
    - fusion item cannot be upgraded further
    - fusion item is treated as `1 completed family package that expresses 1 dominant combat role`
  - Locked bag structure for the current framework:
    - `4` total active slots inside a level
    - `1` utility / tactic-preferred slot
    - `3` combat-preferred slots
    - slot preference is directional, not a hard global ban for all future exceptions
  - Locked first official item/stat pool for the bag framework:
    - `5` utility / tactic base items
    - `10` combat base items
    - includes `Day / Night`-aware items
    - includes `Double Strike Chance`
  - Locked first official endpoint synergy set:
    - `5` utility / tactic fusion-end synergies
    - `10` combat fusion-end synergies
    - total `15` endpoint synergies
  - Locked `Double Strike Chance` direction:
    - chance-on-hit effect
    - extra hit may still crit according to current `Crit Chance`
  - Updated progression, inventory, reward-table, item-content, UI, and acceptance sections to reflect the new item-synergy-fusion framework
- **v1.2.2 — 03/04/2026**

  - Added repeating `Day / Night` cycle mechanic for level flow
  - Locked cycle baseline: level starts in `Day`; cycle uses `4` Day full rounds then `2` Night full rounds, and repeats until the level ends
  - Locked turn-counting rule: Day / Night counts by `full rounds` (`Player turn + Enemy turn`), not by player-only turns
  - Locked Night timing rule: Night buff becomes active from the start of the Night round and applies to enemy movement and combat during that phase, including combats triggered by the player touching an enemy at Night
  - Locked Night stat rule: all enemies gain `x2` move-speed range (`moveSpeedMin`, `moveSpeedMax`) and `x2` attack range (`dmgMin`, `dmgMax`) during Night
  - Added UI/readability rule: gameplay must show phase label and a clear Night warning cue that tells the player enemies are `speed x2 / atk x2`
  - Updated core-loop, core-rules, combat, difficulty, enemy-type, UI, and acceptance sections to reflect the Day / Night mechanic
- **v1.2.1 — 02/04/2026**
  - Added next-wave spawn telegraph rule before a new wave starts
  - When a non-final wave is cleared, the spawn positions of the next wave are marked with a red `X` for `1` full player turn
  - During that warning turn, the player gets a full normal turn to prepare: roll, move, and collect remaining pickups as usual
  - The telegraph only shows red `X` markers and does **not** reveal exact enemy info, to keep some lucky / unlucky feeling for the player
  - Telegraphed tiles do **not** block player movement or standing position; the next-wave enemy still spawns on its marked tile after the warning turn
  - Updated wave-system, core-loop, UI/readability, and acceptance sections to reflect the new warning-turn behavior
- **v1.2.0 — 30/3/2026**
  - Changelog refreshed on `02/04/2026` to record additional locked decisions while keeping document version at `1.2.0`
  - Bổ sung mục `UI Wireframe References` trong phần UI / UX Structure để dùng làm visual source cho Cursor khi build UI
  - Khóa rule lưu wireframe bằng relative path cùng cấp thư mục với file GDD
  - Ghi nhận wireframe đã có cho version hiện tại:
    - `Home` → `./ui-wireframe-home-v1.png`
    - `Gameplay — BeforeRoll` → `./ui-wireframe-gameplay-before-roll-v1.png`
    - `Combat` → `./ui-wireframe-combat-v1.png`
    - `WinText` → `./ui-wireframe-win-text-v1.png`
    - `LoseText` → `./ui-wireframe-lose-text-v1.png`
  - Ghi nhận các wireframe hiện **chưa có** cho version hiện tại:
    - `Gameplay — ReachablePreview`
    - `Gameplay — EnemyTurn`
    - `Enemy Intro Popup`
    - `Mystery Reward Feedback`
    - các UI khác ngoài danh sách trên
  - Ghi nhận hướng cập nhật để align với template v1.2.0:
    - thêm `Product Vision & Market Fit`
    - thêm `Design Pillars`
    - thêm `Commercial Guardrails`
    - thêm `Readability / fairness` trong Acceptance Criteria
  - Ghi nhận hướng level/combat reward mới:
    - 1 màn có thể gồm nhiều wave enemy theo thứ tự cố định
    - wave kết thúc khi toàn bộ enemy của wave hiện tại bị tiêu diệt
    - mystery cell chưa ăn của wave trước được giữ lại sang wave sau; wave mới có thể thêm mystery cell mới
    - enemy chết tạo `power item` đưa vào `Battlefield Bag` UI ngoài battle
    - `Battlefield Bag` có số slot **configurable**; nếu đầy, player có quyền swap item mới với item đang có
    - power item effect duy trì xuyên suốt màn hiện tại cho đến khi player chết / thua
    - exact power item list / effect / per-item odds hiện vẫn `TBD`
  - Ghi nhận hướng heal drop từ enemy:
    - enemy có `30%` cơ hội sinh heal potion khi chết
    - heal potion hồi `+1 HP`, clamp ở max HP
    - heal potion spawn ở `1` ô hợp lệ cách vị trí enemy chết `1` ô theo hình chữ thập
    - player nhặt heal potion ngay khi bước vào ô hoặc đi ngang qua ô đó
  - Ghi nhận thay đổi input/movement direction:
    - sau khi Roll, player tự `drag path` thay vì chỉ tap destination cell
    - path hợp lệ có độ dài từ `1 -> rolled value`
    - player **không được đi lại ô cũ trong cùng lượt**
    - thả tay là commit move
    - nếu gặp enemy giữa đường thì combat mở ngay; nếu player thắng thì tiếp tục đi phần path còn lại đã drag
    - UI khi drag phải có path preview và interaction preview
  - Khóa baseline roll range khởi đầu của player:
    - `minRoll = 1`
    - `maxRoll = 4`
    - future power item có thể thay đổi `minRoll / maxRoll`, nhưng loại item / effect chi tiết hiện vẫn `TBD`
- **v1.1.3 — 30/3/2026**
  - Khóa `Enemy schema` cho data khởi tạo enemy: `id`, `archetype`, `level`, `hp`, `dmgMin`, `dmgMax`, `moveSpeedMin`, `moveSpeedMax`
  - Ghi rõ các field **không lưu trong enemy schema**: `badge/power` (tính runtime), `position` (nằm trong level placement), `introSeen` (lưu ở save/global flag riêng)
  - Xác nhận runtime states hiện vẫn tồn tại trong build: `BeforeRoll`, `ReachablePreview`, `Moving`, `Combat`, `EnemyTurn`, `WinText`, `LoseText`
  - Khóa rule làm tròn cho player DMG width cap theo Slime HP: nếu Slime HP là số lẻ thì làm tròn xuống về số nguyên gần nhất
  - Khóa odds của mystery power cell: `+1 HP = 34%`, `+1 min DMG = 33%`, `+1 max DMG = 33%`
  - Khóa overflow rule cho `+1 max DMG`: nếu vượt width cap hoặc đi ra ngoài band player DMG thì reward chuyển thành `+1 min DMG`; trong fallback này `min DMG` có thể cao hơn mốc `50%`, còn `max DMG` không tăng thêm
  - Dọn stale questions liên quan `Rat / Goblin / Orc / Dragon`; xác nhận `World map` và `Boss` hiện là **chưa mô tả**
  - Khóa thêm các schema/contract ở mức business data: enemy placement dùng `enemyId + position {x, y}`; `playerStart` dùng object `{x, y}`; mystery cell dùng `id, x, y, rewardPoolId`; special tile dùng schema tối giản `type, x, y`
  - Khóa level schema tổng thể ở mức current prototype: `mapSize`, `playerStart`, `enemyPlacements`, `mysteryCells`, `specialTiles`, `objective`
  - Khóa save/global schema: `introSeen` lưu theo archetype; player save schema gồm `hp`, `dmgMin`, `dmgMax`, `gold`, `permanentUpgrades`, `selectedMap`; economy schema gồm `totalGold`, `earnedThisRun`, `spentTotal`
  - Khóa runtime/save-resume direction: runtime enemy schema gồm `currentHp`, `alive`, `currentPosition`; current direction cho save/resume giữa màn là lưu player state + enemy runtime state + tile state
  - Khóa objective schema ở mức `objectiveType + targetValue`; xác nhận không tách archetype config schema riêng ở current GDD; source-of-truth mapping chi tiết theo file vẫn cần kiểm tra lại codebase; UI/rule/folder ownership vẫn để trạng thái Partial
- **v1.1.2 — 27/3/2026**
  - Bổ sung mystery power cell có thể tăng `min DMG` cho player
  - Bổ sung design rule: player DMG phải được giữ trong band `50% -> 100%` (`player.dmg.min` đủ gần `player.dmg.max`)
  - Bổ sung rule fallback: nếu `player.dmg.min == player.dmg.max` thì mystery cell sẽ hiện `+1 max DMG` thay vì `+1 min DMG`
  - Cập nhật bảng chỉ số baseline mới sau khi tính lại enemy DMG: Player `HP 18 / DMG 2-4`; Slime `HP 4 / DMG 3-4`; Wind `HP 2 / DMG 2-3`; Worm `HP 6 / DMG 4-5`; Fire `HP 4 / DMG 5-6`
- **v1.1.1 — inherited baseline**
  - Giữ bộ archetype `Slime / Wind / Worm / Fire`, enemy speed cố định theo archetype, HP/DMG scale theo enemy level
  - Giữ anti-frustration rules, readable power system, mystery cell fixed placement, và các rule damage anchor đã có ở bản trước

---

## 2. Game Overview
- **Genre:** Turn-based tactical grid game
- **Platform:** Web game prototype
- **Target device:** Mobile-first
- **Orientation:** Portrait
- **Input:** Touch
- **Session length:** 30 phút
- **Core fantasy:**
  - Lên kế hoạch cho lượt di chuyển dựa trên roll mỗi turn
  - Tự đọc tương quan mạnh / yếu giữa player và enemy để ra quyết định chiến thuật
  - Chọn đường đi an toàn trong khi quản lý rủi ro combat
  - Tăng sức mạnh của player theo từng run và từng level
- **Prototype goal:** Kiểm chứng loop chiến thuật theo turn, movement theo dice, combat theo vị trí, readable enemy pressure, in-run power swing, meta progression và between-level upgrades
- **Out of scope:** IAP, Ads placement

### 2.1 Current behavior
DiceBound là một game chiến thuật theo lượt trên grid, có:
- movement dựa trên dice
- di chuyển trên grid và combat theo vị trí
- player tự quan sát tương quan mạnh / yếu giữa mình và enemy qua visible stats / power readout
- player turn có thể dùng tooltip + threat preview để đọc stat enemy và vùng rủi ro di chuyển của enemy
- persistent meta progression từ Home screen
- between-level upgrade selection
- in-run power growth có yếu tố random
- hỗ trợ mobile-first UI
- có nhắc đến PWA-style behavior trong wider hub

### 2.2 Editable parameters
- objective type
- input mode
- session target
- mức độ mobile-first optimization

### 2.3 Protected invariants
- Game vẫn là turn-based tactical grid prototype.
- Core fantasy vẫn xoay quanh dice-driven movement và positional combat.

### 2.4 Design goal
- Tạo trải nghiệm tactical turn-based ngắn, rõ, có cảm xúc từ mỗi lần roll, có quyết định chiến thuật dựa trên quan sát mạnh / yếu, và có chiều sâu tăng dần nhờ progression.

### 2.5 Source of truth
- Product definition / Design document

### 2.6 Current status
- Filled

---

### 2.7 Product Vision & Market Fit
- **Product vision statement:** Current source does not yet lock a separate commercial product vision statement. The closest source-backed statement is still the current design goal in `2.4`: tạo trải nghiệm tactical turn-based ngắn, rõ, có cảm xúc từ mỗi lần roll, có quyết định chiến thuật dựa trên quan sát mạnh / yếu, và có chiều sâu tăng dần nhờ progression.
- **Target audience:** Chưa mô tả trong current GDD
- **Player fantasy at product level:**
  - Lên kế hoạch cho lượt di chuyển dựa trên roll mỗi turn
  - Tự đọc tương quan mạnh / yếu giữa player và enemy để ra quyết định chiến thuật
  - Chọn đường đi an toàn trong khi quản lý rủi ro combat
  - Tăng sức mạnh của player theo từng run và từng level
  - Thấy rằng mỗi run đều đóng góp vào account progress, kể cả khi thua
- **Why players should choose this game:**
  - Kết hợp turn-based tactical grid với dice-driven movement
  - Player tự đọc threat / power thay vì hệ thống auto-judge mạnh yếu
  - Positional combat đi cùng in-run power swing và progression
  - Mỗi run có permanent progress layer rõ hơn nhờ role split mới giữa `Tree / Equipment / Bag-Fusion`
- **Product differentiation / unique market angle:** Current source-backed angle vẫn nằm ở tổ hợp `dice-driven movement` + `readable threat / visible power` + `positional combat`; trong lớp progression, direction mới của v13 là dùng `Gold Tech Tree` cho power-floor / economy smoothing, `Equipment Upgrade` cho stable account power, `Equipment Merge Tier` cho account-level family tilt, trong khi `Battlefield Bag + Fusion` vẫn là nơi build direction trở nên concrete trong run
- **Return motivation / retention promise:**
  - mỗi run / level-sized segment nên luôn tạo account progress vì enemy kill cho gold
  - gold được mang ra ngoài ở cả `win` lẫn `lose`
  - thắng vẫn tốt hơn vì đi xa hơn thì giết được nhiều enemy hơn và nhận nhiều gold hơn
  - nếu về sau có boss content thì boss nên là gold spike cao hơn enemy thường
  - current approved target loops cho system này là `per run + daily`
  - main run vẫn cho `gold` progress, còn `Rune Trial` cho `Rune Shard` để nuôi tree progression
  - ngoài layer gold progress, account còn được phép có cảm giác `build tilt` qua `Equipment Merge Tier`, nhưng không được làm mất ý nghĩa của in-run commitment
- **Session role in daily life:**
  - current whole-session target của sản phẩm vẫn là khoảng `30 phút`
  - target `~10 phút` hiện được hiểu là cho `1 run / 1 level-sized segment`, không phải toàn bộ session
  - `Rune Trial` stage target hiện là `1–2` phút
- **Monetization philosophy:** current approved direction là `low-intensity monetization`; `Gold Tech Tree` có thể là lane monetization nhẹ kiểu accelerator/resource/convenience, còn `Equipment Merge Tier` có thể tạo chase rõ hơn ở lớp account progression, nhưng không system nào được trở thành dominant product identity thay cho tactical gameplay hoặc xóa mất giá trị của in-run commit
- **Scalability / live product promise:**
  - `Gold Tech Tree` mở rộng permanent baseline progression theo branch / lane
  - `Equipment` hiện đã được tách role ở mức framework thành `Upgrade` và `Merge Tier`; current source đã khóa temporary `Tier 1 -> Tier 6` ladder, current merge recipe cadence, và current family line tables cho temporary cap này, còn exact currencies, package taxonomy, và long-term live cadence beyond `Tier 6` vẫn chưa được khóa
  - current source vẫn đang test `10 level` mid-game difficulty curve

#### Current behavior
Current GDD hiện đã đủ để mô tả rõ hơn return motivation ở lớp product: Home/meta progression không còn chỉ là generic stat growth. Ở v13, source chính thức đã chấp nhận một role split mới ở lớp out-of-run progression để phục vụ framework gần hơn với build-centric / monetizable direction, nhưng vẫn giữ tactical readability là identity chính. Exact target audience, market positioning, exact live-product promise, exact monetization implementation, exact equipment economy, và exact content scale plan vẫn chưa được khóa đầy đủ.

#### Editable parameters
- target audience
- market positioning
- retention promise
- monetization philosophy
- scalability promise
- exact role split giữa whole session và run-sized segment
- exact role split giữa `Tree / Equipment Upgrade / Equipment Merge Tier / Bag-Fusion`

#### Protected invariants
- Product vision không được mâu thuẫn trực tiếp với core fantasy và prototype goal đã khóa
- Không được dùng product vision để biện minh cho feature phá gameplay readability / fairness nếu chưa có yêu cầu rõ
- `Gold Tech Tree` phải giữ job dominant là `base power / power floor` + `economy smoothing`
- `Equipment Upgrade` phải giữ job là `base power`
- `Equipment Merge Tier` có thể tạo family bias nhưng không được tự complete full build direction
- `Battlefield Bag + Fusion` vẫn phải là dominant `in-run build identity / commit layer`

#### Design goal
- Làm rõ game này dành cho ai, khác gì, vì sao người chơi muốn quay lại, và vì sao một run thua vẫn còn cảm giác có tiến bộ mà không làm thắng/thua mất ý nghĩa
- Làm rõ rằng out-of-run progression có thể bias hướng build, nhưng run vẫn phải còn chỗ cho commit thật sự bên trong màn

#### Source of truth
- Product definition / Design document

#### Dependencies / impact
- progression
- retention direction
- monetization direction
- economy
- difficulty scaling
- content roadmap
- live ops direction

#### Current status
- Partial

### 2.8 Design Pillars
- **Pillar 1:** Every roll must create a meaningful tactical decision.
- **Pillar 2:** Players must read threat clearly and decide for themselves.
- **Pillar 3:** Positioning and route choice must matter every turn.
- **Optional Pillar 4:** The board must stay dynamic so each roll carries pressure and emotion.
- **Optional Pillar 5:** Power growth must create comeback and surprise without breaking readability / fairness.
- **Feature filter question:** Does this feature strengthen at least one pillar without weakening the others?
  - Out-of-run progression may bias direction, but must not solve the run before meaningful in-run bag / fusion decisions happen.

#### Current behavior
Current source đã chứa các ý trên rải ở `2.4 Design goal`, `3.1 Core loop`, `4.3 Movement`, `5.9 Difficulty scaling`, và `7.7 UI / UX Design goal`, nhưng trước đây chưa có một block riêng ghi chúng thành product-level design pillars chính thức.

#### Editable parameters
- số lượng pillar
- wording của từng pillar
- feature filter question

#### Protected invariants
- Pillar phải là nguyên tắc cấp sản phẩm, không chỉ là mô tả một mechanic đơn lẻ
- Mỗi pillar phải đủ ngắn và đủ rõ để dùng làm tiêu chí chấp nhận / từ chối feature

#### Design goal
- Tạo bộ lọc cấp sản phẩm để loại feature không phù hợp, ưu tiên đúng hướng và giữ tính nhất quán của game

#### Source of truth
- Product definition / Design document

#### Dependencies / impact
- feature prioritization
- mechanic changes
- UI / UX direction
- content selection
- roadmap decisions

#### Current status
- Partial

### 2.9 Commercial Guardrails
- **Retention boundary:** out-of-run progression hiện được phép mạnh hơn và chia role rõ hơn để hỗ trợ `per run + daily` return reason; main run vẫn không cần thêm `energy / lives / timer`, còn `Rune Trial` là daily-gated side mode với `2` rewarded wins / ngày
- **Monetization boundary:** current approved direction là `low-intensity`; `Gold Tech Tree` có thể hỗ trợ monetization nhẹ kiểu `gold / tree resource accelerator` hoặc `unlock / reset convenience`, còn `Equipment Merge Tier` có thể là lane chase mạnh hơn ở lớp account progression; tuy vậy, không system nào được trở thành dominant spend identity của sản phẩm hoặc thay thế tactical gameplay làm hook chính
- **Fairness / anti-pay-to-win boundary:** Difficulty / readability / fairness không được bị phá; `Gold Tech Tree` và `Equipment Upgrade` chỉ nên nâng `power floor` dài hạn, còn `Equipment Merge Tier` chỉ nên tạo family bias. Outcome trong run vẫn phải phụ thuộc mạnh vào route choice, threat reading, bag/fusion decisions, combat timing, và in-run package formation
- **Session pressure boundary:** Main run không có `energy / lives / timer`; target `~10 phút` chỉ áp cho `1 run / 1 level-sized segment`, không phải ép cả session ngắn theo commercial pressure loop; `Rune Trial` là mode ngắn `1–2` phút với `2` rewarded wins / ngày
- **Scalability / content production boundary:** `Tree` chỉ nên mở rộng ở mức đọc được và maintain được; `Equipment` có thể mở thêm chiều sâu meta, nhưng exact branch count, total node count, node cost curve, package taxonomy, future tier expansion beyond current `Tier 6`, future boss/live-scale content, và bag-slot expansion path vẫn chưa được khóa
- **Readability / UX boundary:** Out-of-run framework mới phải vẫn đọc được ở first contact; player phải hiểu `Tree` tăng nền gì, `Equipment Upgrade` làm họ mạnh nền ra sao, `Equipment Merge Tier` đang nghiêng account theo lane nào, và vì sao run vẫn cần thêm package trong `Battlefield Bag + Fusion`

#### Current behavior
Current source hiện đã khóa thêm một phần guardrail ở lớp retention / monetization: out-of-run progression được phép mạnh lên rõ hơn, nhưng vẫn phải giữ low-intensity commercial boundary và không được đè lên tactical fairness. V13 đã chính thức tách role giữa `Tree / Equipment Upgrade / Equipment Merge Tier`, nhưng exact monetization implementation, exact equipment economy, và exact merge chase pacing vẫn chưa được khóa thành rule chi tiết.

#### Editable parameters
- retention philosophy
- monetization constraints
- fairness limits
- scalability constraints
- session pressure policy
- exact accelerator / convenience boundaries
- exact merge-tier chase intensity

#### Protected invariants
- Commercial guardrails không được mâu thuẫn với design pillars đã khóa
- Không được dùng guardrail để bỏ qua core fairness / readability nếu game vẫn dựa vào tactical decision-making
- `Gold Tech Tree` không được làm `Battlefield Bag + Fusion` mất vai trò build-identity dominant trong run
- `Equipment Merge Tier` không được pre-solve phần lớn run bằng cách tự complete build direction trước màn

#### Design goal
- Khóa rõ ranh giới thương mại của `Tree / Equipment / Bag-Fusion` để hệ progression mới tăng return reason và account chase mà không biến DiceBound thành meta-stack nặng hoặc pay-to-win nặng

#### Source of truth
- Product definition / Design document

#### Dependencies / impact
- economy
- progression
- monetization
- retention systems
- difficulty scaling
- UI clarity
- live ops scope

#### Current status
- Partial

## 3. Core Gameplay Loop
**Section source of truth:** Gameplay Logic + State Flow

### 3.1 Core loop
- **Start from:** Player turn starts
- **Player action:** Ở `BeforeRoll`, player có thể quan sát board, tap enemy để bật / tắt tooltip stat, chọn `Roll` để drag `path preview` trực tiếp từ ô hiện tại của character rồi thả tay để commit di chuyển, hoặc chọn `Skip Turn` để kết thúc lượt ngay mà không roll
- **System response:** Resolve interactions trên đường đi hoặc tại cell đích, đồng thời cập nhật Day / Night phase theo full-round counter của level
- **Reward:** Có thể nhận mystery-driven bag opportunity, enemy-death power item / heal opportunity, gold, random `Tier 1 Equipment` drop opportunity, between-level power-up opportunity, warning information về vị trí spawn wave kế tiếp, và tiến gần objective
- **Loop back:** Kết thúc player turn, chuyển sang enemy turn; full-round counter có thể đổi Day / Night phase, đồng thời ở đầu các `Day` player turn tiếp theo game có thể spawn thêm wave đã được schedule trước đó, rồi lặp lại cho đến khi level objective hoàn thành hoặc player chết

#### Current behavior
1. Player turn starts  
2. Ở `BeforeRoll`, player có các hành động hợp lệ:
   - nhấn `Roll`
   - nhấn `Skip Turn` để kết thúc lượt ngay mà không roll và không di chuyển
   - `tap` vào từng enemy để bật / tắt tooltip nhỏ ngay trên đầu enemy đó; tooltip này chỉ tồn tại ở `BeforeRoll`, chỉ có `1` tooltip visible tại một thời điểm, và hiển thị `archetype name`, `level`, `HP`, `DMG min-max`, `moveSpeed min-max`
   - quan sát `enemy threat preview` nếu HUD toggle của tính năng này đang bật  
3. Trong player turn, threat preview có thể xuất hiện ở cả `BeforeRoll` và `AfterRoll`:
   - hiển thị cho tất cả enemy còn sống theo mặc định
   - có HUD toggle `on / off`
   - dùng real reachable tiles từ vị trí hiện tại của từng enemy, có xét obstacle, walkability, và pathing
   - `đỏ đậm` = vùng reachable theo `moveSpeedMin` của phase hiện tại
   - `đỏ nhạt` = vùng reachable theo `moveSpeedMax` của phase hiện tại
   - nếu board đang ở `Night`, preview phải phản ánh luôn Night movement range  
4. Nếu player nhấn `Roll`, roll result defines the allowed move distance range for this turn; baseline starting movement roll is now `minRoll = 1`, `maxRoll = 3`, and player được drag một `path preview` hợp lệ có độ dài từ `1 -> rolled value`, bắt đầu từ đúng ô hiện tại của character  
5. Trong lúc drag, character vẫn đứng yên ở ô hiện tại; UI chỉ hiển thị route preview và interaction sắp xảy ra trên đường đi  
5. Path không được đi lại ô đã đi qua trong cùng lượt  
6. Player thả tay để commit đúng `1` lần di chuyển; bước dư bị bỏ  
7. Character bắt đầu di chuyển theo path đã drag và resolve interactions theo thứ tự: special tile → combat → mystery reward flow → gold  
8. Nếu player bước vào mystery cell, reward flow mở Battlefield Bag UI với đúng `3` power-item choices; player có thể `pick 1`, `reroll` toàn bộ `3` choice nếu màn đó còn lượt reroll, hoặc `skip` để không nhận gì  
9. Sau khi mystery popup resolve xong, character tiếp tục đi theo phần path còn lại đã drag  
10. Nếu enemy chết trong combat, reward flow cũng mở Battlefield Bag UI với đúng `3` power-item choices theo cùng logic `pick / reroll / skip`, đồng thời enemy đó vẫn có `30%` chance sinh heal potion trên board  
11. Sau khi combat UI đóng và reward UI của enemy-death resolve xong, enemy đó còn sinh runtime drop feedback cho `Gold`, và có khoảng `20%` chance sinh thêm `1` random `Tier 1 Equipment`  
12. Các runtime drop này nhảy ra từ xác enemy, chờ khoảng `0.5s`, rồi bay vào túi mục tiêu ở góc trên bên phải của HUD gameplay  
13. Reward popup vẫn dùng current bag framework: normal item `level 1 -> 3`, valid fusion recipes chỉ chuyển item sang trạng thái `fusion ready` trong bag thay vì auto-fusion, và reward source không được làm kẹt flow dù offer không đúng kỳ vọng build  
14. Nếu player chọn `1` power item mới từ `3` choices và item đó không phải duplicate-upgrade, player có thể đưa item mới vào slot trống hoặc swap với một current power item đang sở hữu, kể cả khi bag chưa đầy  
15. Nếu combat xảy ra giữa đường và player thắng thì character tiếp tục đi theo phần path còn lại đã drag  
16. Wave progression hiện không còn chờ player phải clear sạch wave hiện tại mới được gọi wave tiếp theo  
17. Nếu level còn wave chưa spawn sau `Wave 1`, board chỉ được preview các vị trí spawn đã schedule của wave kế tiếp khi đang tiến vào cửa sổ spawn hợp lệ kế tiếp của `Day` block:
   - `X` đỏ = vị trí enemy của wave kế tiếp
   - `X` xanh = vị trí mystery cell mới của wave kế tiếp
   - preview không được auto-visible ngay từ lúc vào level theo default  
18. Chỉ ở đầu `Player turn` đầu tiên của mỗi `Day` block, nếu còn wave đã schedule nhưng chưa spawn thì wave đó mới được spawn; `3` `Day` turns còn lại và `2` `Night` turns không spawn queued waves  
19. Khi wave mới spawn:
   - enemy của wave mới được thêm lên board theo các ô `X` đỏ đã preview
   - mystery cell mới của wave đó được thêm theo các ô `X` xanh đã preview
   - enemy cũ chưa chết **không bị xóa**; overlap giữa wave cũ và wave mới là rule hiện hành
   - special overlap exception: nếu enemy spawn chồng lên ô player thì enemy đó đánh ngay player
   - special overlap exception: nếu mystery cell spawn chồng lên ô player thì player nhận mystery đó ngay  
20. Mỗi wave vẫn phải có ít nhất `1` mystery cell mới thuộc về chính wave đó; mystery carry-over từ wave trước vẫn có thể tồn tại, nhưng không được thay thế requirement này  
21. Player turn ends  
22. Enemy turn runs sequentially for each alive enemy  
23. Level đồng thời chạy Day / Night cycle lặp lại: bắt đầu từ Day, đếm theo full rounds (`Player turn + Enemy turn`), `4` rounds Day rồi `2` rounds Night, sau đó lặp lại cho đến hết level  
24. Từ đầu Night round, toàn bộ enemy được `x2` move-speed range và `x2` damage range trong suốt Night phase đó, kể cả combat do player chủ động chạm enemy  
25. Lặp lại cho đến khi level objective hoàn thành hoặc player chết

#### Editable parameters
- loại interactions được resolve trong movement
- cách reward xuất hiện trong loop
- objective type
- visible tactical readability rules
- Day / Night cycle length and phase effects

#### Protected invariants
- Loop vẫn phải xoay quanh Roll → Move → Resolve → Enemy Turn
- Sau khi player commit move, turn được resolve theo flow hiện tại trừ khi có yêu cầu rõ

#### Design goal
- Mỗi lượt phải tạo cảm giác quyết định và rủi ro rõ ràng, kể cả trong các turn mà đáp án tốt nhất là giữ nguyên vị trí.
- Player phải có đủ thông tin để tự quan sát tương quan mạnh / yếu giữa mình và enemy trước khi quyết định route, combat, hoặc `Skip Turn`.
- Trước khi roll, player phải có một cách đọc stat enemy nhanh và tại chỗ ngay trên board, không cần mở popup lớn làm ngắt flow quan sát.
- Threat communication phải mở rộng từ `visible power` sang `movement-risk preview`, để player nhìn được vùng đe doạ do enemy movement tạo ra trong phase hiện tại.
- Enemy phải di chuyển để board state luôn thay đổi, từ đó khiến mỗi lần player roll movement trở nên có cảm xúc, có áp lực và có ý nghĩa chiến thuật.
- Chuyển wave phải readable nhưng áp lực hơn: queued wave chỉ được gọi ở `Player turn` đầu tiên của mỗi `Day` block, không phải ở mọi `Day` turn; nhịp này phải tránh việc vừa vào level đã lộ warning của wave sau hoặc spam spawn quá dày.
- In-run power vector phải tạo khả năng lật kèo và giữ một mức bất ngờ nhất định, để outcome không bị solve hoàn toàn từ turn đầu tiên.
- Battlefield bag phải tạo được cảm giác build theo phase: early chọn hướng, mid đẩy synergy, end chốt fusion để đánh wave / stretch cuối của level.
- Mystery phải trở thành một nguồn build opportunity thực sự trên board, thay vì chỉ là stat bump tách rời khỏi bag system.
- Mỗi wave phải có ít nhất `1` mystery cell mới để player có mục tiêu route đầu wave; đồng thời vị trí spawn của wave kế tiếp vẫn phải được preview bằng `X` đỏ / `X` xanh theo cửa sổ spawn hợp lệ của `Day` block kế tiếp, không auto-hiện từ lúc vào level.
- Day / Night cycle phải tạo nhịp độ lên xuống rõ hơn, khiến timing combat và route choice thay đổi theo từng phase; ban ngày là cửa sổ có lợi hơn để chủ động đánh enemy.

#### Source of truth
- Gameplay Logic
- State Flow

#### Dependencies / impact
- movement
- combat trigger
- reward timing
- enemy turn
- objective completion
- HUD readability
- phase timing / threat timing

#### Current status
- Filled

---
### 3.2 Meta loop
- **End of level / run:** Player hoặc `clear level` hoặc `die / fail run`
- **Reward granted:** Gold từ enemy kill trong main run được tally và persist ở cả `win` lẫn `lose`; flow kết thúc run phải hiển thị `result table`; nếu `win`, flow hiện tại vẫn thêm `between-level power-up selection`; `Rune Trial` grants `Rune Shard` only
- **Upgrade / selection:**
  - `win` → chọn between-level power-up
  - out-of-run / Home → dùng `Rune Shard / Mảnh Ấn` để unlock hoặc upgrade node trong cây power hiện đang dùng source name `Gold Tech Tree`
  - out-of-run / Home → dùng `gold` cho các sink khác hiện vẫn khóa bằng `gold`
- **Next level / replay flow:**
  - `win` → `WinText` → result table → power-up selection → next level
  - `lose` → `LoseText` → result table → về Home với gold đã giữ lại
  - daily tree-resource loop → vào `Modes` → chơi `Rune Trial` để nhận `Rune Shard` → quay về Home rồi spend vào tree

#### Current behavior
Current approved direction giữ nguyên between-level power-up flow khi thắng, đồng thời chính thức tách source progression như sau:

1. Trong main run, enemy kill vẫn cho `gold`
2. Gold đó vẫn được cộng dồn theo số enemy player giết được trong run
3. Nếu player thắng main level:
   - hiện `WinText / win result`
   - tally gold của run
   - hiện `result table` cho run vừa kết thúc
   - result table phải hiển thị ít nhất:
     - `Win`
     - `Enemies killed`
     - `Gold earned`
     - danh sách `Equipment obtained during the run`; không hiển thị `power item` đã nhận trong run
   - chuyển sang power-up selection
   - player chọn `1` between-level power-up
   - chọn xong mới sang level kế tiếp
4. Nếu player thua main run:
   - hiện `LoseText`
   - tally gold của run
   - gold vẫn được giữ lại
   - hiện `result table` cho run vừa kết thúc
   - result table phải hiển thị ít nhất:
     - `Lose`
     - `Enemies killed`
     - `Gold earned`
     - danh sách `Equipment obtained during the run`; không hiển thị `power item` đã nhận trong run
   - về Home
5. Tree progression không còn dùng `gold`
   - tree node upgrade dùng `Rune Shard / Mảnh Ấn`
   - `Rune Shard` được kiếm từ `Rune Trial`
6. `Rune Trial` là một mode stage-based PvE riêng nằm trong `Modes`
   - reward chỉ là `Rune Shard`
   - mỗi ngày có `2` rewarded wins
   - thua không mất rewarded win
   - thắng mới tiêu `1` rewarded win
   - dùng hết `2` rewarded wins thì không vào mode nữa trong ngày
   - reset lúc `7:00`
7. `Rune Trial` thắng stage hiện tại sẽ mở stage kế tiếp
8. Player có thể quay lại bất kỳ stage đã clear nào trong `Rune Trial`
9. Bất kỳ stage đã clear nào cũng có thể dùng `sweep / auto-win` để claim reward nhanh
   - stage cao nhất hiện có cũng được phép sweep nếu stage đó đã clear
   - sweep tiêu `1` rewarded win
   - sweep reward = manual-clear reward
10. `Rune Trial` hiện không cho `gold` và không thay thế main run trong vai trò dominant gameplay hook

Current configured between-level power-up effects vẫn gồm:
- Heal +1
- Heal +2
- Increase min damage
- Increase max damage

#### Editable parameters
- loại power-up
- số lượng lựa chọn
- giá trị power-up
- thời điểm xuất hiện power-up selection
- thời điểm tally gold
- nội dung result table sau main run
- future `Rune Trial` stage-reward expansion beyond the current initial `20` stages
- future tree-cost expansion beyond the current locked rune-shard table

#### Protected invariants
- Between-level upgrade selection vẫn tồn tại như một phần của `win` flow
- `WinText -> result table -> power-up selection -> next level` là flow hiện hành nếu không có yêu cầu đổi rõ
- Gold collected from enemy kills must persist on both `win` and `lose` of the main run
- `Rune Trial` only grants `Rune Shard`
- `Rune Trial` losing does **not** consume a rewarded win; winning does

#### Design goal
- Làm cho main run luôn có tiến bộ dài hạn qua `gold`, kể cả khi thua, nhưng vẫn giữ `win` có giá trị cao hơn nhờ đi xa hơn, giết nhiều enemy hơn, và nhận nhiều gold hơn
- Tách tree khỏi `gold` để tree có loop daily riêng qua `Rune Trial`
- Tạo một mode ngắn để đo sức mạnh account mỗi ngày, kéo daily return mà không chặn main run bằng energy/lives
- Chặn khoảng mờ giữa result flow, tree-resource flow, và daily-mode flow để AI Dev không tự đoán sai đường quay lại Home / next level / mode select

#### Source of truth
- Gameplay Logic
- Config Data
- Persistence

#### Dependencies / impact
- progression
- economy
- result flow
- home flow
- modes flow
- daily refresh system
- persistence schema
- difficulty scaling

#### Current status
- Filled
### 3.3 Long-term progression loop
- **Persistent resource:** `Gold` + `Rune Shard / Mảnh Ấn`
- **Permanent upgrades / progression roles:**
  - `Gold Tech Tree` nodes, but current approved tree currency = `Rune Shard`
  - `Equipment Upgrade`
  - `Equipment Merge Tier`
- **Approved permanent node categories for current locked tree:**
  - `HP`
  - `dmgMin`
  - `dmgMax`
  - `gold efficiency`
- **Locked v1 topology for current tree:**
  - total `8` nodes
  - `1` free structural root
  - `3` lanes: `Sustain`, `Combat`, `Economy`
  - final capstone after all `3` lanes are fully progressed
- **Unlock structure:**
  - tree opens from the start of the game
  - each upgradable node has `3` levels
  - upward progression inside a branch uses `local full prerequisite`
  - root fans out into `3` lanes
  - player does **not** need to full-clear an entire lower tier across the whole tree to access every higher branch
- **Return motivation:** `per run + daily`; mỗi main run vẫn cho `gold`, còn `Rune Trial` cho `Rune Shard` để kéo daily return riêng cho tree
- **Build-completion guardrail:** a complete build direction should require `2–3 packages`; `Equipment Merge Tier` may provide `1 package`, while `Battlefield Bag + Fusion` must still provide at least `1` important additional package during the run
- **Prestige / reset:** Không có trong current approved direction
- **Official daily mode direction:**
  - mode name = `Rune Trial`
  - stage-based PvE riêng
  - purpose feel = `daily power check + daily return reason`
  - `20` handmade stages in the initial structure
  - each stage targets `1–2` minutes
  - each stage uses `2` short waves
  - uses `movement + combat` only
  - no `Battlefield Bag`
  - no `Fusion`
  - no `Mystery cell`
  - no `Day / Night`
  - `2` rewarded wins mỗi ngày
  - thua không mất lượt
  - thắng mới tiêu rewarded win
  - thắng mở stage kế tiếp
  - bất kỳ stage đã clear nào cũng có thể quay lại và dùng `sweep / auto-win`

#### Current behavior
Meta progression hiện không còn được đọc chỉ như `Gold Tech Tree + baseline equipment` nữa. Ở v13, source chính thức đã chấp nhận một role split mới cho out-of-run progression:
- `Gold Tech Tree` = pure base power / economy smoothing
- `Equipment Upgrade` = base power
- `Equipment Merge Tier` = family bias

Trong 3 lớp trên:
- `Gold Tech Tree` giữ nguyên topology, node values, save direction, và UI layout của current tree
- nhưng tree-upgrade currency hiện đã đổi từ `gold` sang `Rune Shard / Mảnh Ấn`
- `Rune Shard` hiện chỉ đến từ `Rune Trial`
- `Equipment Upgrade` và `Equipment Merge Tier` vẫn dùng `gold`

Current approved Rune Trial direction:
- mode là `stage-based PvE`
- mỗi stage là `handmade`
- map size nhỏ hơn main mode
- mỗi stage dài khoảng `1–2` phút
- mỗi stage có `2` wave ngắn
- objective = defeat all enemies across `2` waves
- fail = player chết
- `Wave 1` nhẹ hơn; `Wave 2` nặng hơn rõ
- `Wave 2` dùng đúng current main-mode `X` đỏ visual language, rồi spawn ngay khi `Wave 1` bị clear
- mode dùng full current account power
- enemy level scaling dùng cùng approved enemy-level framework như main mode
- early stages dùng subset roster; later stages mở full roster
- reward chỉ là `Rune Shard`
- exact stage reward table hiện đã khóa:
  - `Stage 1 = 7`, `Stage 2 = 9`, `Stage 3 = 10`, `Stage 4 = 11`, `Stage 5 = 12`
  - `Stage 6 = 13`, `Stage 7 = 14`, `Stage 8 = 15`, `Stage 9 = 16`, `Stage 10 = 17`
  - `Stage 11 = 18`, `Stage 12 = 19`, `Stage 13 = 20`, `Stage 14 = 21`, `Stage 15 = 22`
  - `Stage 16 = 23`, `Stage 17 = 24`, `Stage 18 = 25`, `Stage 19 = 26`, `Stage 20 = 27`
- không có first-clear bonus
- exact tree cost table hiện đã khóa theo legacy table `1:1` đổi currency sang `Rune Shard`

#### Editable parameters
- future node additions after the current `8-node` v1 tree
- future tree cost expansion after the current locked rune-shard table
- future stage expansion beyond the current initial `20` stages
- future UI polish / animation / visual treatment

#### Protected invariants
- `Gold Tech Tree` phải giữ job dominant là `base power / power floor` + `economy smoothing`
- tree không được cạnh tranh trực tiếp với `Battlefield Bag + Fusion` ở vai trò build identity dominant trong run
- `Rune Trial` không được thay main run làm dominant gameplay hook
- `Rune Trial` only grants `Rune Shard`
- no prestige / reset in current approved direction

#### Design goal
- Làm rõ rằng out-of-run progression giờ có `per run + daily` structure: main run nuôi `gold`, còn `Rune Trial` nuôi tree progression bằng `Rune Shard`
- Tạo daily return reason rõ nhưng không biến sản phẩm thành energy-gated main run
- Giữ family / build identity vẫn nằm chủ yếu ở `Equipment Merge Tier + Battlefield Bag + Fusion`, không bị tree hoặc daily mode nuốt mất

#### Source of truth
- Persistence
- Config Data
- Gameplay Logic

#### Dependencies / impact
- meta loop
- economy
- home flow
- modes flow
- progression pacing
- difficulty scaling
- persistence schema

#### Current status
- Filled
## 4. Gameplay Mechanics
**Section source of truth:** Gameplay Logic

### 4.1 Controls
- **Input type:** Touch
- **Click / tap / drag behavior:**
  - Trước khi roll, player có thể `tap` vào enemy để bật / tắt tooltip nhỏ trên đầu enemy đó
  - Trong player turn, board có thể hiển thị threat preview vùng di chuyển của enemy với HUD toggle `on / off`
  - Ở `BeforeRoll`, player có thể nhấn `Roll` hoặc `Skip Turn`
  - Sau khi roll, drag `path preview` trực tiếp từ ô hiện tại của character để xác định đường đi
  - Trong lúc drag, character đứng yên; UI không được trình bày như đang kéo sprite character
  - Thả tay để commit move
  - Không dùng tap-target shortest-path như rule cũ
- **Disabled input states:**
  - Manual `End Turn` hiện đang bị remove khỏi visible UI và hidden / disabled trong runtime flow hiện tại
- **Confirmation rules:** Không cần confirm trước khi move; `Skip Turn` cũng không có confirm riêng; full-bag replace cũng không có confirm riêng

#### Current behavior
Ở `BeforeRoll`, player có thể quan sát board, đọc visible power, và `tap` trực tiếp vào enemy để bật / tắt một tooltip nhỏ ngay trên đầu enemy đó; interaction này không tiêu hao roll, không commit move, và không đổi turn state sang movement. Chỉ `1` tooltip được visible tại một thời điểm; nếu player tap sang enemy khác thì tooltip cũ đóng và tooltip mới mở. Tooltip hiện `archetype name`, `level`, `HP`, `DMG min-max`, `moveSpeed min-max`. Trong player turn, board cũng có thể hiển thị `enemy threat preview` cho tất cả enemy alive theo mặc định, với HUD toggle `on / off`; preview dùng real reachable tiles theo phase hiện tại, có xét obstacle, walkability, và pathing; `đỏ đậm` cho `moveSpeedMin`, `đỏ nhạt` cho `moveSpeedMax`. Ở cùng state đó, player có `2` hành động chính: `Roll` hoặc `Skip Turn`. Nếu nhấn `Skip Turn`, player turn kết thúc ngay, không roll và không di chuyển. Nếu nhấn `Roll`, player drag trực tiếp một `path preview` hợp lệ trên grid, bắt đầu từ đúng ô hiện tại của character. Trong lúc drag, character vẫn đứng yên ở ô đang đứng; UI chỉ hiển thị route preview và interaction sắp xảy ra trên đường đi. Khi thả tay, move được commit ngay; path không được đi lại ô đã đi qua trong cùng lượt; bước dư bị bỏ. Current playtest hiện cần có button `Skip Turn` trên UI thay cho hướng cũ ẩn manual end-turn.

#### Editable parameters
- input mode
- enemy info tooltip trigger/presentation
- enemy threat-preview toggle / presentation
- `Skip Turn` button presentation / placement
- drag path validation
- drag preview presentation
- confirm move
- manual End Turn visibility

#### Protected invariants
- Drag input là thao tác lên `path`, không phải thao tác kéo trực tiếp actor sprite
- Một lần commit move không được tự sinh nhiều phase ngoài flow hiện tại
- `BeforeRoll` tap-to-read-info không được tiêu hao roll hoặc tự mở movement flow
- Enemy info ở `BeforeRoll` hiện dùng tooltip nhỏ trên đầu enemy, không còn dùng popup info cũ
- Chỉ được có `1` enemy tooltip visible tại một thời điểm
- `Skip Turn` hiện chỉ được dùng ở `BeforeRoll`, không roll, không move, và kết thúc lượt ngay

#### Design goal
- Input phải nhanh, rõ, không thừa bước và phù hợp với mobile-first.
- Trước khi commit lượt, player phải có một cách rõ ràng để đọc enemy info ngay trên board mà không bắt Cursor tự suy đoán interaction.
- Controls và on-board info phải giúp player đọc rủi ro movement của enemy nhanh hơn ngay trong player turn, không buộc phải suy luận hoàn toàn từ stat thô.
- Controls phải cho phép player chủ động giữ vị trí khi đứng yên là đáp án chiến thuật tốt nhất, thay vì ép một lượt di chuyển miễn cưỡng.
- Player phải kiểm soát chính xác đường đi mình muốn đi để thể hiện ý đồ chiến thuật thay vì bị hệ thống áp shortest-path ngoài ý muốn.
- Điều khiển phải tạo cảm giác `vẽ đường đi chiến thuật` chứ không phải kéo nhân vật như một object trên board.

#### Source of truth
- UI Presentation
- State Flow

#### Current status
- Filled

---

### 4.2 Core rules
- **Turn structure:** Player turn → Enemy turn, với Day / Night phase chạy song song theo full-round counter của level
- **Action order:** `BeforeRoll` → (`Roll` → Drag path → Release to commit → Move → Resolve interactions) hoặc `Skip Turn` → End turn → Enemy acts sequentially
- **Priority rules:** special tile → combat → mystery reward → gold
- **Mid-path continuation rule:** `enemy combat` và `mystery reward popup` đều là interaction resolve giữa path; nếu không có fail state hoặc hard-stop state khác, movement phải tiếp tục theo phần path còn lại đã drag
- **State transitions:** Để kiểm tra lại trong build hiện tại; current locked design direction bổ sung global phase transition giữa Day và Night

#### Current behavior
- Player move dựa trên `minRoll - maxRoll`
- Với một roll value `X`, player được drag đúng 1 path hợp lệ có length từ `1 -> X`
- Player không được chọn đứng yên `0 ô`; bước dư bị bỏ sau khi thả tay commit move
- Trong cùng một lượt, path không được đi lại ô đã đi qua
- Enemy act one-by-one
- Day / Night cycle bắt đầu từ Day, đếm theo full rounds (`Player turn + Enemy turn`), chạy `4` full rounds Day rồi `2` full rounds Night, sau đó lặp lại
- Từ đầu Night round, Night buff active ngay cho toàn bộ enemy, gồm cả movement trong enemy turn và combat xảy ra trong phase Night do player chủ động chạm enemy
- Current playtest: enemy target player
- Ở `BeforeRoll`, player có thể chọn `Roll` hoặc `Skip Turn`; `Skip Turn` kết thúc player turn ngay, không roll và không di chuyển
- Ở `BeforeRoll`, player có thể tap vào từng enemy để bật / tắt tooltip nhỏ trên đầu enemy; tooltip hiện `archetype name`, `level`, `HP`, `DMG min-max`, `moveSpeed min-max`, và chỉ `1` tooltip được visible tại một thời điểm
- Trong player turn (`BeforeRoll` và `AfterRoll`), board có thể hiển thị threat-preview của tất cả enemy alive theo default HUD toggle; preview dùng real reachable tiles theo phase hiện tại, với `đỏ đậm` cho `moveSpeedMin` và `đỏ nhạt` cho `moveSpeedMax`
- Player và enemy đều có visible power value để player tự so trực tiếp; hệ thống không auto-judge mạnh / yếu thay cho player
- Move speed của enemy là thuộc tính cố định theo enemy archetype trong baseline ban ngày; HP và DMG có thể thay đổi theo từng enemy level
- Global Day / Night cycle hiện dùng `4` Day full rounds → `2` Night full rounds lặp lại; từ đầu Night round, toàn bộ enemy nhận `x2` move-speed range và `x2` damage range
- Nếu enemy enters player cell thì combat trigger ngay
- Nếu player movement gặp enemy trên đường đi thì combat UI mở ra ngay; nếu player thắng thì character tiếp tục đi theo phần path còn lại đã drag
- Nếu player movement gặp mystery cell trên đường đi thì reward popup mở ra ngay; sau khi player `pick / reroll / skip`, character tiếp tục đi theo phần path còn lại đã drag
- Mystery popup không được tự coi là end-turn trigger; popup resolve xong phải trả flow về movement resolver của cùng turn đó
- Nếu level còn wave chưa spawn sau `Wave 1`, board chỉ được preview trước vị trí spawn của wave kế tiếp khi đang tiến vào cửa sổ spawn hợp lệ kế tiếp của `Day` block:
  - hiện `X` đỏ cho enemy spawn positions của wave mới
  - hiện `X` xanh cho mystery spawn positions của wave mới
  - preview không được auto-hiện ngay từ lúc vào level theo default
- Chỉ ở đầu `Player turn` đầu tiên của mỗi `Day` block, nếu còn wave đã schedule nhưng chưa spawn thì wave mới và mystery mới mới được spawn ngay tại các ô đã preview, kể cả khi enemy của wave cũ vẫn còn sống
- Overlap giữa wave cũ và wave mới là rule hiện hành; enemy còn sống của wave trước phải được giữ lại trên board
- Special overlap exception:
  - nếu enemy spawn chồng lên ô player thì enemy đó đánh ngay player
  - nếu mystery cell spawn chồng lên ô player thì player nhận mystery đó ngay
- Night buff không cần chờ đến enemy chủ động hành động; chỉ cần đang ở Night phase thì mọi combat với enemy đều dùng enemy move/damage state của Night theo đúng ngữ cảnh

#### Editable parameters
- action order
- enemy tooltip presentation
- threat-preview toggle / presentation
- `Skip Turn` button presentation
- enemy targeting rule
- enemy behavior attribute
- turn ending rule
- dragged-path validity rule
- revisit restriction
- power display formula
- Day / Night cycle length
- Night stat multipliers

#### Protected invariants
- Game vẫn turn-based
- Enemy turn vẫn chạy sequentially trừ khi có yêu cầu khác
- `Skip Turn` chỉ hợp lệ ở `BeforeRoll`; không mở thêm non-move interaction nào khác ngoài rule quan sát hiện có
- Enemy info ở `BeforeRoll` hiện dùng tooltip nhỏ trên đầu enemy, không dùng popup info cũ
- Threat preview phải bám movement runtime thật của enemy theo phase hiện tại, không dùng fake geometric range nếu có obstacle/pathing khác biệt

#### Design goal
- Thứ tự resolve phải đủ rõ để người chơi hiểu vì sao kết quả xảy ra.
- Visible info phải đủ để player tự đưa ra quyết định chiến thuật thay vì hệ thống tự kết luận mạnh / yếu.
- Threat communication phải cho player nhìn được vùng đe doạ movement của enemy trong phase hiện tại, để route choice và risk assessment chính xác hơn.
- Enemy-info interaction ở `BeforeRoll` phải nhanh, gọn, và tại chỗ, để player đọc stat mà không bị ngắt flow quan sát board.
- Core rules phải cho phép player chủ động bỏ lượt khi giữ nguyên vị trí là phương án chiến thuật tối ưu, thay vì ép movement không mong muốn.
- Enemy có thể mang nhiều behavior attribute khác nhau theo archetype; current playtest tạm giữ rule đuổi player để test feeling.
- Day / Night phase phải tạo timing decision rõ: cùng một board nhưng window đánh / né / reposition có thể đổi theo phase.
- Wave-preview state phải cho player nhiều thời gian và nhiều thông tin hơn để chuẩn bị trước wave mới, nhưng vẫn giữ phần bất định ở mức identity enemy chưa bị lộ.

#### Source of truth
- Gameplay Logic
- State Flow

#### Edge cases
- Khi dragged path đi qua enemy thì combat mở ngay; nếu player thắng thì character tiếp tục đi theo phần path còn lại đã drag
- Khi dragged path đi qua mystery cell thì popup mở ngay; resolve xong thì character tiếp tục đi theo phần path còn lại đã drag
- Player có thể chọn đi ít hơn rolled value miễn tổng path length nằm trong `1 -> rolled value`
- Player không được drag path đi lại ô đã đi qua trong cùng lượt
- Các edge cases khác chưa mô tả trong version 1.1.0

#### Current status
- Partial

---

### 4.3 Movement
- **Move trigger:** Từ `BeforeRoll`, player nhấn `Roll` rồi drag `path preview` trực tiếp trên grid từ ô hiện tại của character; nếu không muốn move thì có thể dùng `Skip Turn` ngay ở `BeforeRoll`
- **Range rule:** Roll result quyết định tổng độ dài path hợp lệ từ `1 -> rolled value`
- **Pathfinding rule:** Player tự vẽ path; hệ thống chỉ chấp nhận path liên tiếp qua các ô đi được; điểm bắt đầu luôn là ô hiện tại của character
- **Reachable tile rule:** UI phải hỗ trợ preview path hợp lệ và phần interaction sắp xảy ra trên path đang drag; preview không được trình bày như đang kéo sprite character
- **Mid-path interactions:** Resolve ngay khi bước vào tile; enemy combat và mystery reward popup đều là interaction giữa path, xong sẽ tiếp tục resolve phần path còn lại nếu không có fail state
- **Move end condition:** Sau khi thả tay commit `1` lần move và resolve xong toàn bộ path còn lại, turn kết thúc
- **Stop mid-path:** Không có move thứ hai trong cùng turn; bước dư bị bỏ

#### Current behavior
- Player roll range được điều khiển bởi run stats `minRoll - maxRoll`
- Current baseline starting movement roll stats là `minRoll = 1`, `maxRoll = 3`
- Sau khi roll ra giá trị `X`, player drag trực tiếp một `path preview` hợp lệ trên grid với tổng độ dài từ `1 -> X`, bắt đầu từ đúng ô hiện tại của character
- Trong lúc drag, UI chỉ hiển thị route preview và interaction sắp xảy ra; character không di chuyển cho đến khi player thả tay commit
- Hệ thống validate path theo từng bước; path phải liên tiếp qua các ô đi được và không được đi lại ô đã đi qua trong cùng lượt
- Current behavior: player thả tay để commit đúng `1` lần move; bước dư bị bỏ; resolve xong thì turn kết thúc
- Current v11 direction thêm `Skip Turn` button ở `BeforeRoll`; nếu player dùng `Skip Turn` thì turn kết thúc ngay, không roll và không di chuyển
- Trong player turn, movement-reading layer còn có `enemy threat preview`: highlight dùng real reachable tiles của từng enemy theo phase hiện tại, có xét obstacle / walkability / pathing; `đỏ đậm` cho `moveSpeedMin`, `đỏ nhạt` cho `moveSpeedMax`, và có HUD toggle `on / off`
- Player vẫn không được đứng yên như một kết quả của action `Roll`; đứng yên chỉ hợp lệ qua `Skip Turn` ở `BeforeRoll`
- Interaction trên đường đi resolve ngay khi bước vào tile
- Nếu combat xảy ra giữa đường và player thắng thì character tiếp tục đi theo phần path còn lại đã drag
- Nếu mystery cell xảy ra giữa đường thì reward popup resolve xong, character tiếp tục đi theo phần path còn lại đã drag

#### Editable parameters
- starting `minRoll` / `maxRoll`
- run-time `minRoll` / `maxRoll` modifiers
- dragged-path validity rule
- path preview rule
- revisit restriction
- move commitment
- `Skip Turn` availability / presentation
- enemy threat-preview presentation
- unused step discard rule

#### Protected invariants
- Movement vẫn dựa trên dice roll range khi player chọn `Roll`
- Player move vẫn theo path hợp lệ
- Enemy phải có movement riêng, không phải obstacle tĩnh
- `Skip Turn` không được biến thành một path length `0`; nó là một action riêng ở `BeforeRoll`

#### Design goal
- Mỗi lần roll phải tạo cảm xúc: hy vọng, áp lực, tiếc nuối, hoặc cơ hội chiến thuật.
- Baseline movement range phải được khóa rõ để balance và content tuning có mốc tham chiếu ổn định.
- Sau khi player có buff từ item, gameplay hiện tại đang trở nên quá dễ; vì vậy baseline movement được giảm từ `1-4` xuống `1-3` để giảm khả năng tiếp cận quá nhiều value trong một lượt, kéo lại positional pressure, và giữ route choice có ý nghĩa chiến thuật rõ hơn.
- Player phải được quyền chọn dùng ít hơn rolled value để tối ưu route và tự quyết định chính xác đường đi chiến thuật mình muốn thực hiện, nhưng vẫn chỉ commit một lần để tránh cảm giác đi đi lại lại.
- Nếu vị trí hiện tại đã là đáp án tốt nhất, player phải có quyền giữ nguyên vị trí bằng `Skip Turn` thay vì bị ép move sang chỗ kém hơn.
- Input phải làm rõ fantasy `plan route first, move after release` thay vì kéo nhân vật trực tiếp.
- Enemy movement phải làm cho giá trị của roll thay đổi theo tình huống thực tế trên board.
- Route reading phải được hỗ trợ bởi threat-preview đủ rõ để player thấy được rủi ro do enemy movement trong phase hiện tại, thay vì chỉ đọc từ stat số.

#### Source of truth
- Gameplay Logic
- State Flow
- Content Data

#### Dependencies / impact
- combat trigger
- tile effects
- enemy threat
- objective pacing

#### Current status
- Filled

---

### 4.4 Combat
- **Combat trigger:** Khi player hoặc enemy chủ động chạm vào bên còn lại
- **Combat flow:** Turn-based exchanges trong dedicated combat screen
- **Attack order:** Bên chủ động chạm vào trước sẽ đánh trước
- **Damage formula:** Player và enemy đều có DMG roll range
- **Exit condition:** Một bên hết HP
- **Post-combat position/state:** Encounter resolve tại vị trí player và enemy gặp nhau; với combat xảy ra trong lúc movement, nếu player thắng thì player tiếp tục di chuyển đến destination đã chọn
- **Combat screen type:** Full-screen
- **Flee / escape:** Không
- **Item-stat resolve order:** mỗi hit resolve theo thứ tự `base damage roll -> crit check -> block check -> final damage -> lifesteal`; sau đó mới check `Double Strike`; extra hit nếu có sẽ chạy lại toàn bộ flow riêng của một hit mới
- **Chance-stat cap:** current prototype pass dùng cap tạm thời `50%` cho các chance-based item stats: `Crit Chance`, `Block Chance`, `Double Strike Chance`
- **Double Strike chain rule:** không chain; mỗi attack tạo tối đa `1` extra hit

#### Current behavior
Combat được hiển thị trên dedicated full-screen combat screen.
- Player stats:
  - HP: `current / max`
  - DMG roll range: `dmg.min - dmg.max`
  - Current baseline playtest start stats: `HP 180`, `DMG 20-40`, power `220`
- Enemy stats:
  - HP: `enemy.hp.current / enemy.hp.max`
  - DMG roll range: `enemy.dmg.min - enemy.dmg.max`
  - SPD: theo archetype, cố định cho từng loại enemy
  - Current baseline playtest table:
    - `enemy_slime` → `spd 1-1`, `HP 50`, `DMG 30-40`, badge `90`
    - `enemy_wind` → `spd 2-4`, `HP 30`, `DMG 20-30`, badge `60`
    - `enemy_worm` → `spd 2-2`, `HP 70`, `DMG 40-50`, badge `120`
    - `enemy_fire` → `spd 1-3`, `HP 50`, `DMG 50-60`, badge `110`
- Enemy HP và DMG có thể thay đổi theo từng enemy level; move speed giữ cố định theo archetype ở baseline ban ngày
- Day / Night modifier hiện hành: từ đầu Night round, toàn bộ enemy được `x2` `moveSpeedMin`, `x2` `moveSpeedMax`, `x2` `dmgMin`, `x2` `dmgMax` trong suốt Night phase
- Balance anchor cho player DMG range cap là `enemy_slime`
- Player DMG width cap rule: `player.dmg.max - player.dmg.min` không được vượt quá `50%` HP của Slime dùng làm mốc balance cho level hiện tại; nếu Slime HP là số lẻ thì làm tròn xuống đến số nguyên gần nhất
- Width cap rounding rule: nếu Slime HP của level là số lẻ thì mốc `50%` được làm tròn xuống đến số nguyên gần nhất
- Player DMG band rule: `player.dmg.min` nên nằm trong band `50% -> 100%` của `player.dmg.max`; đây là design rule để player damage không quá swing
- Current baseline reference: Slime `HP 50` → player DMG width cap `25` → current baseline player `DMG 20-40`; player DMG band `50% -> 100%`
- Enemy damage balancing direction:
  - `enemy_slime` là enemy chuẩn cho mốc survivability của player; enemy chuẩn phải cần tối thiểu `5` hit để giết player
  - `enemy_fire` là enemy mạnh nhất theo ý nghĩa sát thương; enemy mạnh nhất về sát thương phải cần tối thiểu `3` hit để giết player
  - Enemy DMG range nên nằm trong band `70% -> 100%`; đây là design rule để giữ `enemy.dmg.min` đủ gần `enemy.dmg.max`, tránh damage swing quá lớn
- On defeat:
  - Player defeated → game over
  - Enemy defeated → removed from grid
- Nếu player đi vào enemy trong lượt của player thì player đánh trước
- Nếu enemy đi vào player trong lượt của enemy thì enemy đánh trước
- Không có flee / escape
- Current combat item-stat resolve flow của player hit là: `roll damage -> check crit -> apply crit damage if success -> defender check block -> apply final damage -> heal lifesteal from final damage actually dealt -> check Double Strike`; nếu `Double Strike` proc thì tạo đúng `1` extra hit và extra hit này lại tự resolve toàn bộ flow riêng, đồng thời vẫn có thể crit theo `Crit Chance` hiện có
- Current item-stat cap direction của prototype là các chance-based item stats (`Crit Chance`, `Block Chance`, `Double Strike Chance`) đều bị clamp ở `50%`; `Lifesteal` không thuộc nhóm chance-based

#### Editable parameters
- attack order
- damage formula
- combat pacing
- animation behavior
- defeat handling
- enemy hits-to-kill player targets by archetype role
- enemy DMG variance band / min-max proximity rule
- Day / Night modifiers by archetype
- Day / Night multipliers

#### Protected invariants
- Combat vẫn là turn-based exchanges
- Combat vẫn dùng dedicated full-screen combat screen trừ khi có yêu cầu đổi flow
- Night modifier chỉ là phase-based combat modifier; không thay thế baseline archetype identity của từng enemy

#### Design goal
- Combat phải đủ rõ, đủ nhanh và đủ căng để hỗ trợ cảm xúc của movement chứ không phá nhịp lượt chơi.
- Damage variance của enemy phải được khống chế để player vẫn đọc được mức nguy hiểm thực tế; `enemy.dmg.min` nên đủ gần `enemy.dmg.max`.
- Mốc survivability của player phải có neo rõ: enemy chuẩn không được giết player quá nhanh, còn enemy mạnh nhất về sát thương phải nguy hiểm hơn nhưng vẫn readable.
- Night phase phải làm combat nguy hiểm lên rõ rệt và buộc player cân nhắc timing đánh nhau, nhưng vẫn phải được communicate đủ rõ để không thành cảm giác bị lừa bởi readout ban ngày.

#### Source of truth
- Gameplay Logic
- Config Data
- State Flow

#### Dependencies / impact
- HP system
- enemy removal
- win/lose
- combat UI

#### Edge cases
- Với combat xảy ra giữa movement, player tiếp tục movement sau combat nếu thắng
- Nếu player thua thì game kết thúc luôn
- Nếu combat xảy ra trong Night phase, enemy dùng Night-modified `dmgMin - dmgMax` ngay cả khi combat được trigger bởi player chạm vào enemy

#### Current status
- Filled

---

### 4.5 Other mechanics

#### Mechanic name: Mystery power cell
- **Purpose:** Tạo thêm một nguồn Battlefield Bag opportunity trên board, để route lấy mystery cũng là quyết định build thật sự trong màn
- **Trigger:** Bước vào cell `?`
- **Rules:**
  - Mystery cell mở `Battlefield Bag` popup
  - Popup hiển thị đúng `3` power-item choices
  - Player có thể:
    - chọn `1` item
    - dùng `reroll` nếu level hiện tại chưa dùng lượt reroll
    - `skip` để đóng popup và không nhận gì
  - Reroll thay toàn bộ `3` current choices
  - `Reroll` là resource cấp màn: chỉ dùng được `1` lần trong toàn bộ level hiện tại
  - Mystery cell đã ăn sẽ biến mất khỏi board
  - Mystery cell **chưa ăn** của wave trước vẫn được giữ lại khi wave mới bắt đầu
- **Reward / consequence:**
  - cùng loại power-item pool với reward popup từ enemy death
  - không còn reward stat trực tiếp kiểu mystery cũ
- **Removed from current prototype:**
  - `+1 HP`
  - `+1 min DMG`
  - `+1 max DMG`
  - mystery-specific odds / fallback rules của reward stat cũ
- **Placement rule:** Mystery cell được đặt theo từng wave; mỗi wave phải spawn mới ít nhất `1` mystery cell thuộc về chính wave đó; mystery cell **chưa ăn** của wave trước sẽ được giữ lại khi wave mới bắt đầu; nếu wave kế tiếp tồn tại thì vị trí mystery cell mới của wave đó được preview trước bằng `X` xanh
- **Ownership:** Chỉ player dùng mystery reward flow

##### Current behavior
Trong v11, mystery cell `?` không còn là stat pickup trực tiếp. Khi player bước vào mystery cell, game mở cùng `Battlefield Bag` popup như reward từ enemy death. Popup luôn phải hiển thị đúng `3` power-item choices, và player luôn phải có ít nhất một hành động hợp lệ trong popup: chọn `1` item, dùng `reroll` nếu màn đó còn lượt reroll, hoặc `skip` để không nhận gì. Reroll thay toàn bộ `3` current choices và chỉ có `1` lượt cho toàn bộ level. Mystery cell đã ăn sẽ biến mất; mystery cell chưa ăn vẫn carry sang wave sau trong cùng level. Đồng thời, mỗi wave vẫn phải có ít nhất `1` mystery cell mới thuộc riêng wave đó; carry-over mystery không được thay thế requirement này. Nếu còn wave kế tiếp sau `Wave 1`, game còn phải preview trước các vị trí mystery cell mới của wave đó bằng `X` xanh theo cửa sổ spawn hợp lệ kế tiếp của `Day` block, không auto-hiện từ lúc vào level. Chỉ tại đầu `Player turn` đầu tiên của `Day` block đủ điều kiện, các mystery cell mới đó mới xuất hiện thật trên board. Special overlap exception hiện hành: nếu mystery cell mới spawn chồng lên ô player thì player nhận mystery đó ngay tại thời điểm spawn. Toàn bộ mystery-specific reward logic cũ (`+1 HP / +1 min DMG / +1 max DMG`) không còn là rule hiện hành của v2.

##### Editable parameters
- mystery placement per wave
- số lượng mystery cell
- visual presentation của mystery reward source
- reroll count per level
- skip availability
- future differentiation giữa mystery reward source và enemy-death reward source nếu có yêu cầu sau này

##### Protected invariants
- Mystery reward vẫn là one-cell interaction nếu không có yêu cầu khác
- Mystery cell **chưa ăn** phải được carry qua wave mới trong cùng level
- Mỗi wave phải có ít nhất `1` mystery cell mới của chính wave đó
- Mystery không còn cho stat reward trực tiếp trong current prototype v2

##### Design goal
- Biến mystery thành một nguồn build opportunity thật sự trên board, thay vì chỉ là stat bump đơn lẻ.
- Mỗi wave phải luôn có ít nhất `1` mystery mới để player có mục tiêu route đầu wave.
- Tăng giá trị route choice và target priority: player cân nhắc lấy mystery bây giờ hay giữ vị trí / nhịp đánh enemy.
- Preview mystery mới sớm hơn để player có thêm thời gian và thông tin chuẩn bị cho wave sau.
- Đồng bộ ngôn ngữ reward giữa mystery và enemy death để UI/readability nhất quán hơn.
- Giảm dead-choice bằng cách cho mystery dùng cùng safety valve `reroll / skip` của bag popup.

##### Source of truth
- Gameplay Logic
- Config Data
- UI Presentation

##### Dependencies / impact
- progression
- reward tables
- inventory
- wave transition
- reward readability
- difficulty scaling

##### Current status
- Filled

#### Mechanic name: Wave system
- **Purpose:** Chia 1 level thành nhiều nhịp đụng độ để tạo pacing đều hơn, tái tạo board priority nhiều lần trong cùng 1 màn, và tránh nhịp chơi bị chùng vì một enemy cuối wave còn sót lại
- **Trigger:** `Wave 1` spawn khi level bắt đầu ở `Day 1 Turn 1`; nếu còn wave chưa spawn thì wave kế tiếp chỉ được vào ở đầu `Player turn` đầu tiên của `Day` block kế tiếp
- **Rules:** Wave chạy theo thứ tự cố định; mỗi wave có enemy placement và mystery cell placement riêng; mỗi wave phải spawn mới ít nhất `1` mystery cell thuộc về chính wave đó
- **Wave progression rule:** Wave mới không còn bị chặn bởi việc phải clear sạch toàn bộ enemy của wave trước
- **Preview rule:** Nếu wave tiếp theo tồn tại sau `Wave 1`, game phải preview trước các vị trí spawn đã schedule của wave đó theo cửa sổ spawn hợp lệ kế tiếp của `Day` block; preview không được auto-visible từ lúc vào level theo default
- **Preview marker rule:**
  - `X` đỏ = vị trí enemy của wave kế tiếp
  - `X` xanh = vị trí mystery cell của wave kế tiếp
- **Preview information rule:** Preview chỉ hiện vị trí, không hiện exact enemy info, để vẫn giữ một phần cảm giác may / xui
- **Preview occupancy rule:** Player vẫn có thể đi qua hoặc đứng trên ô preview
- **Spawn rule:** Chỉ ở đầu `Player turn` đầu tiên của mỗi `Day` block, nếu còn wave đã schedule nhưng chưa spawn thì enemy mới và mystery mới spawn tại các ô đã preview
- **Overlap rule:** Nếu enemy của wave cũ vẫn còn sống khi wave mới spawn thì chúng được giữ lại; enemy wave cũ và wave mới cùng tồn tại trên board
- **Special overlap exception:**
  - nếu enemy spawn chồng lên ô player thì enemy đó đánh ngay player
  - nếu mystery spawn chồng lên ô player thì player nhận mystery đó ngay
- **Carry-over rule:** Mystery cell **chưa ăn** của các wave trước vẫn giữ lại khi wave mới bắt đầu, đồng thời mystery mới của wave sau được preview bằng `X` xanh
- **Completion rule:** Level chỉ hoàn thành khi toàn bộ enemy của tất cả wave đã spawn bị tiêu diệt

##### Current behavior
Một level hiện được mô tả theo cấu trúc nhiều wave cố định. Mỗi wave có thể có số lượng enemy, vị trí enemy, số lượng mystery cell và vị trí mystery cell khác nhau. Trong current locked direction, mỗi wave phải spawn mới ít nhất `1` mystery cell thuộc về chính wave đó; mystery carry-over từ wave trước vẫn được phép tồn tại nhưng không được tính là đã thỏa requirement của wave mới. Wave đầu spawn khi level bắt đầu. Với các wave tiếp theo, nếu wave đó đã được schedule nhưng chưa spawn thì board phải preview trước:
- `X` đỏ cho các vị trí enemy của wave kế tiếp
- `X` xanh cho các vị trí mystery cell của wave kế tiếp

Trong current locked direction mới, `Wave 1` vào ở `Day 1 Turn 1`. Sau đó, mỗi `Day` block chỉ có đúng `1` cửa sổ spawn queued wave: đầu `Player turn` đầu tiên của block đó. Điều này có nghĩa là `3` `Day` turns còn lại trong cùng block và toàn bộ `2` `Night` turns không spawn queued waves. Nếu vẫn còn wave đã schedule nhưng chưa spawn khi tới cửa sổ hợp lệ này, wave kế tiếp mới spawn tại các ô đã preview, kể cả khi trên board vẫn còn enemy của các wave trước. Điều này có nghĩa là overlap giữa wave cũ và wave mới là rule hiện hành; game không xóa enemy cũ chỉ vì wave mới bắt đầu. Preview chỉ cho biết vị trí, không cho biết exact enemy info, để vừa readable hơn vừa vẫn giữ cảm giác may / xui. Preview của queued wave cũng không được auto-hiện ngay từ lúc vào level theo default; nó phải bám theo cửa sổ spawn hợp lệ kế tiếp. Toàn bộ mystery cell **chưa ăn** đang còn trên màn sẽ được giữ lại và cộng dồn với mystery của wave mới. Ô preview không chặn player; player vẫn có thể đi qua hoặc đứng trên đó. Current locked overlap outcome của v23/v28 là:
- enemy còn sống của wave trước vẫn tiếp tục tồn tại khi wave mới spawn
- special overlap exception: nếu enemy spawn chồng lên ô player thì enemy đó đánh ngay player
- special overlap exception: nếu mystery spawn chồng lên ô player thì player nhận mystery đó ngay

##### Editable parameters
- number of waves
- per-wave enemy count / placement
- per-wave mystery count / placement
- per-wave minimum new-mystery requirement
- spawn timing between waves
- preview timing before a Day-turn spawn
- wave transition presentation / telegraph marker

##### Protected invariants
- Wave order là cố định trong level nếu không có yêu cầu khác
- Clear condition của wave là giết hết enemy của wave đó
- Mỗi wave phải spawn mới ít nhất `1` mystery cell thuộc về chính wave đó
- Nếu còn wave tiếp theo sau `Wave 1`, game phải preview cả `X` đỏ cho enemy spawn positions và `X` xanh cho mystery spawn positions theo cửa sổ spawn hợp lệ kế tiếp của `Day` block; preview không được auto-hiện từ initial level entry
- Trong mỗi `Day` block, chỉ `Player turn` đầu tiên mới là cửa sổ được phép spawn queued wave
- Mystery cell **chưa ăn** không bị xóa khi sang wave mới

##### Design goal
- Tạo dynamic ưu tiên mục tiêu theo thời gian thay vì chỉ giải 1 board tĩnh từ đầu màn.
- Mỗi wave phải luôn cho player một mục tiêu route đầu wave thông qua ít nhất `1` mystery cell mới, để giảm cảm giác đứng chờ và tăng anti-frustration.
- Tăng readability / fairness của chuyển wave bằng preview gắn với cửa sổ spawn hợp lệ của `Day` block kế tiếp, đồng thời tránh vừa vào level đã lộ warning của wave sau hoặc gọi wave mới ở mọi `Day` turn.
- Tạo cơ hội để player chuẩn bị tài nguyên cho wave sau bằng cách giữ lại mystery cell chưa ăn và nhìn trước cả vị trí spawn mới.
- Làm cho lựa chọn route, target priority và timing pickup có ý nghĩa xuyên suốt cả level.

##### Source of truth
- Gameplay Logic
- Content Data
- State Flow

##### Dependencies / impact
- core loop
- objective evaluator
- level schema
- difficulty scaling
- UI transition

##### Current status
- Partial

#### Mechanic name: Enemy death drop + battlefield bag
- **Purpose:** Tạo in-run build system rõ ràng, buộc player chọn giữ / nâng / bỏ item theo phase build, đồng thời giới hạn tăng trưởng sức mạnh trong level bằng số lượng slot và fusion endpoint
- **Trigger:** Enemy chết, hoặc player bước vào mystery cell
- **Rules:**
  - Khi enemy chết hoặc player bước vào mystery cell, ngoài battle sẽ hiện `Battlefield Bag` popup
  - Popup hiển thị đúng `3` power-item choices cho player
  - Player luôn có các hành động hợp lệ sau:
    - chọn `1` item
    - dùng `reroll` nếu level hiện tại chưa dùng lượt reroll
    - `skip` để đóng popup và không nhận gì
  - Reroll thay toàn bộ `3` current choices
  - Level chỉ có `1` lượt reroll cho toàn bộ `Battlefield Bag` reward flow
  - Một choice có thể là item mới hoặc một item player đã sở hữu để dùng làm `upgrade`
  - Normal power item có `level 1 -> 3`
  - Nếu player chọn đúng item đã sở hữu thì item đó tăng `+1` level, tối đa `level 3`
  - Nếu player chọn item mới và bag còn slot trống thì item đó đi vào bất kỳ slot trống nào của bag
  - Nếu player chọn item mới khi bag đã đầy thì flow chuyển sang replace branch:
    - player `tap` item mới trước
    - sau đó `tap` một item cũ trong bag để thay ngay
    - hoặc `skip` reward đó
    - không có confirm riêng
    - không có cancel quay lại trạng thái `3-choice` ban đầu sau khi đã commit vào replace branch
  - Bag có `4` slot active trong level và cả `4` slot đều hoàn toàn trung tính
  - Bất kỳ power item nào cũng có thể vào bất kỳ slot nào; current framework không dùng slot identity utility/combat ở cấp bag structure
  - Nếu đủ `2` item `level 3` đúng recipe thì player có thể fusion chúng thành `1` fusion item endpoint
  - Fusion item:
    - không có level
    - không upgrade tiếp
    - không fusion chồng thêm
    - được xem là `1 completed family package that expresses 1 dominant combat role`
  - Trong current framework, mỗi endpoint fusion item chỉ tồn tại như `1` synergy hoàn chỉnh; player được khuyến khích theo nhiều synergy khác nhau thay vì chồng nhiều endpoint giống nhau
  - Power item đang nằm trong bag sẽ cộng chỉ số xuyên suốt level hiện tại cho đến khi player chết / thua
- **Selection / odds rule:**
  - Reward popup luôn hiển thị `3` choices
  - Candidate items được rút từ power-item pool hiện hành
  - Offer dùng `BasePhaseWeight` theo `Early / Mid / End` rồi nhân với `Dynamic Modifiers` theo build state hiện tại
  - Dynamic modifiers hiện hành gồm: `UpgradeBias`, `FamilyBias`, `RecoveryBias`, `DayNightBias`
  - Exact weight tables hiện đã được khóa trong `5.8 Gacha / chest / reward tables`
- **Required UI readability on each choice card:**
  - item icon
  - item name
  - current level
  - affected stat(s)
  - current value -> next value
  - family / recipe relation
  - slot impact
  - state tag: `New / Upgrade / Fusion Ready`
- **Ownership:** Chỉ player dùng bag

##### Current behavior
Trong v5, battlefield bag là reward flow dùng chung cho `enemy death` và `mystery cell`. Mỗi lần reward popup mở, game phải hiển thị đúng `3` power-item choices và player phải luôn có ít nhất một hành động hợp lệ: `pick 1`, `reroll`, hoặc `skip`. Reroll thay toàn bộ `3` current choices và chỉ có đúng `1` lượt cho toàn bộ level. Skip chỉ đóng popup và không cho reward bù. Một choice có thể là item hoàn toàn mới hoặc là item player đang sở hữu để nâng cấp thêm `+1` level. Normal item có `level 1 -> 3`; level 3 là max. Khi player sở hữu đúng `2` item `level 3` theo recipe, hai item đó có thể được fusion thành một endpoint item mới. Fusion item không có level, không upgrade tiếp, và đóng vai trò một package synergy hoàn chỉnh cho đoạn cuối của màn chơi. Current framework ở v4 khóa bag active size là `4` slot và cả `4` slot đều hoàn toàn trung tính. Utility/combat distinction vẫn tồn tại ở lớp item pool, family identity, và reward weighting, nhưng không còn tồn tại ở cấp slot structure hay slot validation của bag. Mỗi card trong reward popup phải diễn đạt đủ rõ icon, level, affected stat, current -> next value, family / recipe relation, slot impact, và state tag để player không bị rơi vào dead-choice do UI mơ hồ.

##### Editable parameters
- reward-popup visual presentation
- future special cross-domain recipe list
- exact slot UI layout
- exact replace / swap presentation if slot conflict occurs
- future tuning of locked numeric values after enemy level-scaling table is authored
- reroll count per level
- skip availability

##### Protected invariants
- Reward popup luôn phải cho player ít nhất một action hợp lệ: `pick`, `reroll` nếu còn, hoặc `skip`
- Current v3 dùng chung một reward-flow standard cho `enemy death` và `mystery cell`
- Normal power items phải dùng `level 1 -> 3`
- Fusion phải cần `2` items ở `level 3`
- Fusion item không có level và không được upgrade tiếp
- Active power của bag chỉ tồn tại trong level hiện tại; không được trở thành meta progression

##### Design goal
- Tạo hệ build dễ hiểu nhưng đủ sâu: early chọn hướng, mid phát triển synergy, end chốt fusion để đánh màn / wave cuối.
- Dùng slot pressure và fusion endpoint để giữ cho in-run growth không tăng vô hạn và không phá tactical core của DiceBound.
- Kết hợp ngôn ngữ `stat synergy` kiểu Forge Master với `phase + commit` kiểu Magic Survival, nhưng vẫn giữ readability và player agency trên board.
- Chặn dead-choice / dead-flow: offer xấu không được biến reward popup thành ngõ cụt hoặc UI bế tắc.
- Đánh từng enemy riêng lẻ không được tạo cảm giác ngán hoặc payoff rỗng; vì vậy mỗi enemy death phải tiếp tục tạo `power-item reward opportunity` để combat có phần thưởng rõ ngay lập tức và giữ nhịp build growth hứng thú xuyên suốt level.

##### Source of truth
- Config Data
- Gameplay Logic
- UI Presentation

##### Dependencies / impact
- progression
- inventory
- reward tables
- UI popup flow
- balance
- difficulty scaling

##### Current status
- Filled

#### Mechanic name: Heal potion
- **Purpose:** Tạo cơ hội hồi phục ngắn hạn sau kill, giúp player có thêm đường vượt màn nếu ưu tiên đúng target
- **Trigger:** Enemy chết
- **Rules:**
  - Mỗi enemy có `30%` chance sinh 1 bình máu
  - Bình máu spawn ở 1 ô hợp lệ cách vị trí enemy chết 1 ô theo hình chữ thập (trên / dưới / trái / phải)
  - Ô spawn hợp lệ là ô player có thể di chuyển vào được
  - Player đi vào ô hoặc đi ngang qua ô trong lúc move sẽ nhặt ngay
  - Heal amount: `+10 HP`, clamp ở max HP
  - No-valid-tile case: current design assumption từ user là **không xảy ra**, vì nếu cả 4 ô orthogonal đều không di chuyển vào được thì encounter với enemy đó sẽ không còn hợp lệ theo luật hiện tại
- **Required presentation rule:**
  - Heal potion phải có icon / silhouette riêng trên board
  - Icon phải đủ nhìn rõ trên nền map hiện hành
  - Spawn phải có feedback rõ
  - Pickup phải có feedback rõ

##### Current behavior
Khi enemy chết, ngoài power item flow qua bag UI, enemy đó còn có `30%` chance sinh 1 bình máu trên 1 ô hợp lệ xung quanh xác enemy theo hình chữ thập. Bình máu được dùng như một phần của target priority: player có thể cố tình chọn giết enemy yếu hơn hoặc dễ tiếp cận hơn trước để mở ra đường hồi máu và vượt qua màn. Player sẽ nhặt bình máu ngay khi bước vào hoặc đi ngang qua ô đó trong lúc movement. Heal potion hiện hồi `+10 HP`, clamp ở max HP. Trong v3, heal potion không được phép chỉ tồn tại bằng logic vô hình; board phải thể hiện được đây là một pickup hồi máu đọc được bằng mắt.

##### Editable parameters
- heal potion chance
- heal amount
- spawn presentation
- pickup feedback
- icon / silhouette styling

##### Protected invariants
- Heal potion phải spawn ở 1 ô orthogonal hợp lệ quanh xác enemy
- Pickup phải xảy ra ngay khi player đi vào hoặc đi ngang qua ô đó
- Heal potion là reward ngắn hạn trên board, không đưa vào meta inventory

##### Design goal
- Tạo comeback window vừa đủ mà không biến level thành bài toán stat chắc thắng.
- Làm cho thứ tự giết enemy có giá trị chiến thuật rõ ràng: giết đúng enemy có thể mở heal route tốt hơn.
- Kết hợp với mystery / bag opportunity để player luôn có ít nhất vài hướng tối ưu khác nhau thay vì chỉ một lời giải duy nhất.
- Heal route phải nhìn thấy được như một tactical option thật, không chỉ tồn tại trong logic.
- Kết thúc run phải cho player thấy rõ outcome, công sức và phần thưởng đã kiếm được trong run đó.
- Enemy reward feedback phải đủ rõ và satisfying: ngoài power-item choice, gold và equipment drop cần được nhìn thấy nhảy ra rồi bay vào túi để player cảm được progress và loot gain.

##### Source of truth
- Gameplay Logic
- Content Data
- UI Presentation

##### Dependencies / impact
- enemy death handling
- movement pickup
- balance
- route readability

##### Current status
- Filled

#### Mechanic name: Day / Night cycle
- **Purpose:** Tạo nhịp độ combat lên xuống theo thời gian và buộc player chọn timing đánh / né / reposition theo phase
- **Trigger:** Global level phase chạy tự động từ lúc level bắt đầu
- **Rules:**
  - Level luôn bắt đầu ở `Day`
  - Chu kỳ đếm theo `full rounds` = `Player turn + Enemy turn`
  - Chu kỳ lặp là `4` full rounds Day → `2` full rounds Night → lặp lại cho đến khi level kết thúc
  - Từ đầu Night round, Night buff active ngay cho toàn bộ enemy
- **Reward / consequence:**
  - Trong Night, toàn bộ enemy được `x2` `moveSpeedMin` và `x2` `moveSpeedMax`
  - Trong Night, toàn bộ enemy được `x2` `dmgMin` và `x2` `dmgMax`
  - Buff Night áp dụng cho movement của enemy và cho mọi combat xảy ra trong Night phase, kể cả combat do player chủ động chạm enemy
  - Ban ngày trở thành cửa sổ có lợi hơn để chủ động đánh enemy
- **Odds:** Không áp dụng
- **Cap rule:** Không áp dụng ngoài chu kỳ phase đã khóa
- **Stack rule:** Không stack nhiều lớp Night buff; phase chỉ có active / inactive
- **Placement rule:** Không áp dụng; đây là mechanic cấp level / state flow
- **Ownership:** Global level rule; buff chỉ tác động lên enemy

##### Current behavior
Current locked direction bổ sung một global `Day / Night` cycle cho toàn level. Level bắt đầu ở `Day`, đếm theo `full rounds` (`Player turn + Enemy turn`), chạy `4` rounds Day rồi `2` rounds Night, sau đó lặp lại cho đến khi level kết thúc. Từ đầu Night round, enemy nhận ngay buff `x2` move-speed range và `x2` damage range. Buff này áp dụng không chỉ cho movement ở enemy turn mà còn cho combat xảy ra trong Night phase khi player chủ động chạm enemy. Mechanic này được dùng để tạo nhịp độ rõ hơn: ban ngày là cửa sổ đánh nhau có lợi hơn, còn ban đêm đẩy pressure, timing choice và board dynamic lên cao hơn.

##### Editable parameters
- Day round count
- Night round count
- start phase
- Night movement multiplier
- Night damage multiplier
- UI warning / phase cue

##### Protected invariants
- Chu kỳ hiện tại phải bắt đầu ở `Day` nếu không có yêu cầu khác
- Day / Night phải đếm theo `full rounds`, không phải theo player-only turns
- Night buff phải active từ đầu Night round
- Night buff phải tác động lên toàn bộ enemy và áp dụng cho cả combat phát sinh trong Night phase

##### Design goal
- Tạo pacing rõ hơn giữa các lượt và buộc player nhìn timing như một biến chiến thuật thật sự.
- Làm cho ban ngày trở thành window chủ động đánh enemy có lợi hơn, còn ban đêm tạo áp lực rõ để player cân nhắc né, setup, hoặc chấp nhận combat rủi ro hơn.
- Tạo thêm board dynamic và pressure mỗi turn mà không cần thay đổi layout tĩnh của level.

##### Source of truth
- Gameplay Logic
- State Flow
- UI Presentation

##### Dependencies / impact
- core loop
- enemy movement
- combat threat
- difficulty scaling
- UI warning / readability

##### Current status
- Partial


#### Mechanic name: Gold Tech Tree
- **Purpose:** Tạo một out-of-run permanent base-power system rõ ràng, đồng thời bảo đảm mỗi run đều tạo account progress kể cả khi player thua
- **Trigger:**
  - trong main run: enemy chết thì cho gold
  - ngoài run: player vào Home / tree để spend `Rune Shard`
- **Rules:**
  - mỗi enemy kill trong main run cho gold
  - player đi càng xa / giết càng nhiều enemy trong main run thì tổng gold càng cao
  - gold được carry ra ngoài ở cả `win` lẫn `lose` của main run
  - `Gold Tech Tree` không còn dùng `gold` làm approved upgrade currency
  - `Gold Tech Tree` hiện dùng `Rune Shard / Mảnh Ấn` để unlock / upgrade node
  - `Rune Shard` hiện chỉ được kiếm từ `Rune Trial`
  - tree mở từ đầu game
  - current v1 tree có `8` nodes tổng cộng:
    - `1` free structural root
    - `3` lanes: `Sustain`, `Combat`, `Economy`
    - `1` final capstone
  - mỗi upgradable node có `3` cấp
  - unlock dùng `local full prerequisite + branching`:
    - root mở ra 3 lane ngay từ đầu
    - node ở trên trong cùng branch chỉ mở khi node prerequisite bên dưới đã full
    - player không cần full toàn bộ một tầng dưới trên toàn cây để mở mọi branch phía trên
  - approved node categories hiện tại:
    - `HP`
    - `dmgMin`
    - `dmgMax`
    - `gold efficiency`
  - family / lane signaling chỉ được phép ở mức nhẹ, chủ yếu qua lane identity và milestone node; tree không được cạnh tranh trực tiếp vai trò build-identity của `Battlefield Bag + fusion`
  - không có prestige / reset cho tree trong current approved direction
  - `gold efficiency` được định nghĩa là `% bonus cộng vào tổng gold cuối run sau khi tally base gold của run`
  - tree này vẫn được tune với mục tiêu: một early progress step nên cảm thấy đáng quay lại hằng ngày, nhưng exact rune-shard costs phải được re-lock sau khi rescale xong từ legacy gold table
- **Locked v1 topology:**
  - `Base Camp` = free structural root
  - `Iron Hide -> Veteran Body` = sustain lane
  - `Steady Hand -> Finisher's Edge` = combat lane
  - `Clean Loot -> Contract Bonus` = economy lane
  - `Campaign Command` = capstone node, unlock khi `Veteran Body`, `Finisher's Edge`, và `Contract Bonus` đều đã max
- **Locked node values:**
  - `Iron Hide` = `+10 / +20 / +30 HP`
  - `Steady Hand` = `+3 / +3 / +4 dmgMin`
  - `Clean Loot` = `+5% / +6% / +7% total gold`
  - `Veteran Body` = `+5 / +10 / +15 HP`
  - `Finisher's Edge` = `+3 / +3 / +4 dmgMax`
  - `Contract Bonus` = `+4% / +5% / +6% total gold`
  - `Campaign Command` = `Lv1: +2 dmgMin`, `Lv2: +2 dmgMax`, `Lv3: +5% total gold`
- **Current cost direction after v28:**
  - legacy gold cost table is no longer the approved spend sink for tree progression
  - tree keeps the same topology and node values
  - approved conversion rule = keep the previous tree costs `1:1` and change only the spend currency from `gold` to `Rune Shard`
  - exact current approved node costs are now:
    - `Iron Hide = 16 / 24 / 36 Rune Shard`
    - `Steady Hand = 16 / 24 / 36 Rune Shard`
    - `Clean Loot = 16 / 24 / 36 Rune Shard`
    - `Veteran Body = 28 / 42 / 60 Rune Shard`
    - `Finisher's Edge = 28 / 42 / 60 Rune Shard`
    - `Contract Bonus = 28 / 42 / 60 Rune Shard`
    - `Campaign Command = 52 / 72 / 96 Rune Shard`
  - full tree total = `838 Rune Shard`
- **Locked gold source mapping:**
  - economy gold bands are separate from combat threat bands
  - `Low = 1 gold`
  - `Mid = 2 gold`
  - `High = 4 gold`
  - mapping ownership = `archetype base + content override`
  - default archetype mapping:
    - `Wind = Low`
    - `Slime = Mid`
    - `Worm = High`
    - `Fire = High`
  - content override is allowed only for:
    - `elite` entries
    - `boss` entries
    - `chapter milestone` entries
  - current slime reference reward = `2 gold`
  - future boss reward is `gold only` and currently equals `8x Slime = 16 gold`
- **Combat-lane guard rule:**
  - `dmgMax` progression không được mở trước khi `Steady Hand` đã max
  - mọi thay đổi tương lai vào combat-lane nodes phải tiếp tục pass damage guard hiện hành:
    - `player.dmg.max - player.dmg.min <= 50% x slime.hp_reference`
    - `player.dmg.min >= 50% x player.dmg.max`
- **Locked save direction:**
  - save container vẫn cần `diceBoundPlayerData.goldTechTree`
  - tree node state vẫn cần `version`, semantic node ids, và per-node `level + purchasedAt`
  - `unlocked` không lưu; tính runtime từ prerequisite
  - persistence layer ngoài tree còn phải có `Rune Shard` balance và `Rune Trial` progress state
  - exact current approved persistence fields are:
    - `diceBoundPlayerData.runeProgress.runeShardBalance`
    - `diceBoundPlayerData.runeProgress.highestClearedStage`
    - `diceBoundPlayerData.runeProgress.stageClearMap`
    - `diceBoundPlayerData.runeProgress.dailyRewardedWinsUsed`
    - `diceBoundPlayerData.runeProgress.lastDailyResetAt`
- **Locked UI layout:**
  - entry point to the tree vẫn là dedicated entry từ `Home`
  - layout = vertical tree from bottom to top
  - no tooltip / side panel / bottom sheet riêng
  - mỗi node phải tự hiển thị trực tiếp:
    - `icon`
    - `name`
    - `level`
    - `cost`
    - `main effect`
  - node states:
    - `Locked`
    - `Available`
    - `Purchased`
    - `Max`
  - interaction = `tap node to buy immediately`
- **Reward / consequence:**
  - player có permanent progress kể cả khi thua main run
  - thắng main run vẫn tốt hơn vì thường giết được nhiều enemy hơn và nhận nhiều gold hơn
  - tree progression có daily lane riêng qua `Rune Trial`
  - baseline power floor tăng dần qua nhiều ngày / nhiều run
- **Odds:** Không áp dụng trực tiếp ngoài gold-band/content table đã khóa ở current v1
- **Cap rule:** mỗi node tối đa `3` cấp; root là structural node free
- **Stack rule:** cùng một node tăng tuần tự `Lv1 -> Lv2 -> Lv3`; node phía trên không mở nếu prerequisite trong branch chưa full
- **Placement rule:** Không áp dụng; đây là out-of-run meta system
- **Ownership:** Chỉ player dùng

##### Current behavior
Current approved direction giữ nguyên `Gold Tech Tree v1` như một cây cụ thể ở lớp role / topology / node values / save direction / UI layout, nhưng official currency ownership hiện đã đổi: tree không còn dùng `gold`, mà dùng `Rune Shard / Mảnh Ấn`. `Rune Shard` hiện chỉ đến từ `Rune Trial`. Main run vẫn dùng `gold` làm currency combat-economy ngoài run cho các sink khác. Exact current approved node costs are: `Iron Hide = 16 / 24 / 36`, `Steady Hand = 16 / 24 / 36`, `Clean Loot = 16 / 24 / 36`, `Veteran Body = 28 / 42 / 60`, `Finisher's Edge = 28 / 42 / 60`, `Contract Bonus = 28 / 42 / 60`, `Campaign Command = 52 / 72 / 96`, all in `Rune Shard`; full tree total = `838 Rune Shard`.

##### Editable parameters
- future elite / boss / chapter-milestone gold overrides ngoài current default mapping
- future node additions after the current `8-node` v1 tree
- future UI polish / animation / visual treatment for the current locked layout
- future tree-cost expansion beyond the current locked rune-shard table

##### Protected invariants
- dominant job của system là `base power / power floor` + `economy smoothing`
- retention per run là vai trò phụ, không phải lý do để biến system thành monetization-heavy meta stack
- tree không được cạnh tranh trực tiếp với `Battlefield Bag + fusion` ở vai trò build identity dominant trong run
- no prestige / reset in current approved direction
- combat lane phải giữ đúng thứ tự `dmgMin -> dmgMax`
- future combat-lane edits phải tiếp tục giữ damage guard hiện hành của player
- `gold efficiency` phải tiếp tục là end-of-run tally bonus nếu không có yêu cầu đổi rõ
- economy gold bands phải tiếp tục là lớp riêng với combat threat bands nếu không có yêu cầu đổi rõ

##### Design goal
- Cho player cảm giác `run nào cũng có tiến bộ` qua gold ở main run, đồng thời có thêm `daily progress` rõ cho tree qua `Rune Trial`
- làm cho thất bại vẫn tạo progress nhưng chiến thắng main run vẫn có giá trị cao hơn
- tăng baseline growth dài hạn mà không phá tactical clarity, route choice, hay đọc threat trong từng run
- làm cho tree đủ rõ để người chơi không cần mở panel phụ mới hiểu node tăng gì và có nên mua hay không

##### Source of truth
- Gameplay Logic
- Config Data
- Persistence
- UI Presentation

##### Dependencies / impact
- meta loop
- economy
- long-term progression
- home flow
- modes flow
- upgrade structure
- difficulty scaling
- monetization guardrails
- UI / UX readability
- persistence schema

##### Current status
- Filled

#### Mechanic name: Rune Trial
- **Purpose:** Tạo một mode ngắn để kiểm tra mốc sức mạnh account hằng ngày, đồng thời cung cấp `Rune Shard / Mảnh Ấn` cho tree progression
- **Trigger:**
  - ngoài run: player vào `Modes` rồi chọn `Rune Trial`
  - thắng một stage trong mode sẽ nhận `Rune Shard`
- **Rules:**
  - mode là `stage-based PvE`
  - initial structure = `20` stages
  - mỗi stage là `handmade`
  - map size nhỏ hơn main mode
  - mỗi stage target `1–2` phút
  - mỗi stage có `2` wave ngắn
  - objective = defeat all enemies across `2` waves
  - fail = player chết
  - mode dùng `movement + combat`
  - mode không dùng `Battlefield Bag`
  - mode không dùng `Fusion`
  - mode không dùng `Mystery cell`
  - mode không dùng `Day / Night`
  - mode dùng full current account power của player
  - enemy level scaling dùng cùng approved enemy-level framework như main mode
  - early stages dùng subset roster; later stages mở full roster
  - `Wave 1` nhẹ hơn; `Wave 2` nặng hơn rõ
  - `Wave 2` dùng `X` đỏ preview rồi spawn ngay khi `Wave 1` bị clear
  - player có `2` rewarded wins mỗi ngày
  - reset time = `7:00`
  - thua không mất rewarded win
  - chỉ khi thắng mới tiêu `1` rewarded win
  - dùng hết `2` rewarded wins thì player không vào mode nữa trong ngày
  - thắng stage hiện tại sẽ mở stage kế tiếp
  - player có thể quay lại bất kỳ stage đã clear nào
  - bất kỳ stage đã clear nào cũng có button `sweep / auto-win` để nhận reward
  - stage cao nhất hiện có cũng được phép sweep nếu stage đó đã clear
  - sweep tiêu `1` rewarded win
  - sweep reward = manual-clear reward
  - reward hiện chỉ là `Rune Shard`
  - stage cao hơn cho nhiều `Rune Shard` hơn
  - không có first-clear bonus
  - mode này không thay thế main run; nó là daily power-check + tree-resource loop riêng
- **Reward / consequence:**
  - thắng = nhận `Rune Shard`, mở stage kế tiếp, và tiêu `1` rewarded win
  - thua = không nhận reward, không mất rewarded win
  - stage cũ đã clear = có thể quick-play để claim reward nhanh
- **Odds:** Không áp dụng trong current approved direction
- **Cap rule:** `2` rewarded wins / ngày
- **Stack rule:** stage tiến tuần tự; player phải thắng stage hiện tại mới mở stage sau
- **Placement rule:** Không áp dụng; đây là out-of-run mode
- **Ownership:** Chỉ player dùng

##### Current behavior
`Rune Trial` là mode daily riêng để cấp `Rune Shard / Mảnh Ấn` cho tree. Mode này ngắn hơn main run, không dùng bag/fusion/mystery/day-night, và được dùng như daily checkpoint xem account power hiện tại đã đủ vượt mốc chưa. Player có `2` rewarded wins mỗi ngày; thua không mất lượt; chỉ thắng mới trừ lượt. Khi thắng, player nhận `Rune Shard` và mở stage kế tiếp. Player được phép quay về bất kỳ stage đã clear nào; bất kỳ stage đã clear nào cũng có thể dùng `sweep / auto-win` để claim reward nhanh. Stage cao nhất hiện có cũng được phép sweep nếu stage đó đã clear. Sweep tiêu `1` rewarded win và reward bằng manual-clear reward. Reward của mode hiện chỉ là `Rune Shard`, không có `gold`. Exact current approved reward table là: `Stage 1 = 7`, `Stage 2 = 9`, `Stage 3 = 10`, `Stage 4 = 11`, `Stage 5 = 12`, `Stage 6 = 13`, `Stage 7 = 14`, `Stage 8 = 15`, `Stage 9 = 16`, `Stage 10 = 17`, `Stage 11 = 18`, `Stage 12 = 19`, `Stage 13 = 20`, `Stage 14 = 21`, `Stage 15 = 22`, `Stage 16 = 23`, `Stage 17 = 24`, `Stage 18 = 25`, `Stage 19 = 26`, `Stage 20 = 27`. Incoming `Wave 2` preview reuses the current main-mode red `X` visual language. After the player has used both daily rewarded wins, attempting to enter the mode again that day shows a short toast on the `Modes` screen.

##### Editable parameters
- exact map-size presets for Rune Trial stages
- exact per-stage enemy composition and level table
- future stage-reward expansion beyond the current initial `20` stages

##### Protected invariants
- mục tiêu chính của mode là `short session + daily power check + daily return reason`
- thua không được tiêu lượt
- thắng mới tiêu rewarded win
- reward hiện chỉ là `Rune Shard`
- mode không được thay main run làm dominant gameplay hook
- mode không được dùng để thay thế role của `gold` trong main-run combat economy
- mode không dùng `Battlefield Bag`, `Fusion`, `Mystery cell`, hoặc `Day / Night`

##### Design goal
- Cho player một bài test ngắn mỗi ngày để xem account đã mạnh lên đến đâu
- Tạo daily return loop rõ cho tree progression mà không phạt player nặng khi thất bại
- Giảm friction của daily farm bằng khả năng replay stage đã clear và sweep stage đã clear
- Giữ Rune Trial là bài test ngắn, không biến nó thành grind loop dài cạnh tranh với main run

##### Source of truth
- Gameplay Logic
- Config Data
- Persistence
- UI Presentation

##### Dependencies / impact
- meta loop
- long-term progression
- economy
- Home / Modes flow
- persistence schema
- daily refresh system
- reward claim UX
- content burden

##### Current status
- Filled

### 4.6 Win / Lose / Fail states / Retry flow
### 4.6 Win / Lose / Fail states / Retry flow
- **Win condition:** `defeat_all` across toàn bộ wave của level; clear wave cuối thì thắng level
- **Lose condition:** Player defeated
- **Fail state variants:** Game over khi player thua combat / chết trong level
- **Retry flow:** Không có retry
- **Level restart behavior:** Không có retry; thua thì kết thúc về Home
- **Carry-over after fail:**
  - `Gold` từ enemy kill được giữ lại
  - in-run bag power bị mất
  - mystery / heal potion / wave progress trên board bị reset
  - between-level power-up chỉ xuất hiện ở `win`, không xuất hiện ở `lose`

#### Current behavior
Objective type hiện dùng là `defeat_all`, nhưng với level nhiều wave thì ý nghĩa của objective là đánh bại toàn bộ enemy của từng wave theo thứ tự cho đến wave cuối.

- Player defeated → game over
- Enemy defeated → removed from grid
- Enemy kill đồng thời đóng góp gold cho current run total
- Nếu còn wave chưa spawn sau `Wave 1` và tới đầu `Player turn` đầu tiên của `Day` block hợp lệ → wave kế tiếp spawn tại các ô đã được preview trước, kể cả khi enemy của các wave trước vẫn còn sống; `3` `Day` turns còn lại và `2` `Night` turns không spawn queued waves
- Mystery cell **chưa ăn** vẫn được giữ lại khi sang wave mới
- Không có retry
- Sau khi player thua:
  - game lose
  - tally gold của run
  - gold được giữ lại
  - hiện `result table` của run
  - về Home
  - player có thể spend `Rune Shard / Mảnh Ấn` vào Gold Tech Tree trước run mới
- Power item đang nằm trong bag chỉ tồn tại trong level hiện tại; player chết / thua thì mất toàn bộ in-run bag state
- Sau khi player thắng wave cuối / level objective:
  1. hiện `WinText / win result`
  2. tally gold của run
  3. hiện `result table` của run
  4. chuyển sang between-level power-up selection
  5. chọn xong mới sang level kế tiếp

#### Editable parameters
- objective type
- fail handling
- restart behavior
- carry-over rule between waves
- carry-over rule after fail
- end-of-level reward timing
- gold tally timing

#### Protected invariants
- Win/lose phải luôn đưa game về state rõ ràng, không treo flow
- Wave clear và level clear phải tách rõ
- In-run bag power không được chuyển thành meta progression nếu không có yêu cầu khác
- Current `win` flow dùng explicit `WinText -> result table -> power-up selection -> next level`
- Gold collected from enemy kills must carry out on `lose`

#### Design goal
- Thắng / thua phải rõ, dứt khoát, dễ hiểu và không tạo flow mơ hồ
- Multi-wave level phải cho cảm giác tiến độ rõ: clear wave là cột mốc ngắn, clear wave cuối là kết thúc màn
- Thất bại vẫn phải có progress đủ để player muốn quay lại run tiếp, nhưng không được cho hết mọi reward của chiến thắng

#### Source of truth
- Gameplay Logic
- State Flow
- UI Presentation
- Persistence

#### Dependencies / impact
- result handling
- progression
- economy
- level flow
- wave transition
- bag reset
- between-level reward flow
- home tech-tree flow

#### Edge cases
- Heal potion no-valid-tile case hiện được ghi nhận là design assumption **không xảy ra** theo placement logic user mô tả; exact validation rule trong content pipeline vẫn chưa khóa ở codebase
- Nếu enemy của wave mới spawn chồng lên ô player thì enemy đó phải đánh ngay player như một special overlap exception
- Nếu mystery cell của wave mới spawn chồng lên ô player thì player phải nhận mystery đó ngay

#### Current status
- Partial

## 5. Systems Design
**Section source of truth:** Config Data + Gameplay Logic + Persistence

### 5.1 Progression system
- **Out-of-run baseline progression:** `Gold Tech Tree + Equipment Upgrade`
- **Out-of-run family-bias progression:** `Equipment Merge Tier`
- **Gold Tech Tree effect:** permanent baseline growth ngoài run, hiện được khóa ở topology `8` nodes / `3` lanes / `1` capstone; current approved currency = `Rune Shard / Mảnh Ấn`, not `gold`
- **Equipment Upgrade effect:** slot-based base power ngoài run; current approved clarification on top of the locked numeric direction is:
  - slot baseline already exists at `Lv1`
  - `Weapon slot Lv1 = +1 dmgMin, +2 dmgMax`
  - `Auxiliary Equipment slot Lv1 = +2 dmgMin, +1 dmgMax`
  - `Helmet slot Lv1 = +10 Max HP`
  - `Armor slot Lv1 = +10 Max HP`
  - slot stats apply to the character only when the corresponding equipment piece is currently equipped in that slot
  - if that slot is unequipped, that slot's stats do not apply to the character
  - each further upgrade level continues using the currently locked slot-upgrade numeric direction
  - current approved currency = `gold`; current approved target-cost table is:
  - `Lv1 = 0`
  - `Lv2 = 20`
  - `Lv3 = 25`
  - `Lv4 = 30`
  - `Lv5 = 35`
  - `Lv6 = 45`
  - `Lv7 = 60`
  - `Lv8 = 75`
  - `Lv9 = 90`
  - `Lv10 = 100`
  - `Lv11 = 115`
  - `Lv12 = 130`
  - `Lv13 = 145`
  - `Lv14 = 160`
  - `Lv15 = 180`
  - `Lv16 = 205`
  - `Lv17 = 225`
  - `Lv18 = 250`
  - `Lv19 = 275`
  - `Lv20 = 300`
- **Equipment Merge Tier effect:** family bias ngoài run using an `Archero 2`-like piece-by-piece merge model; current locked framework direction = `4` family sets, current temporary cap at `Tier 6`, `Tier 1 = Base / Unmerged`, `Tier 2 = base growth light`, `Tier 3 -> Tier 6 = Line 1 -> Line 4`, and per-piece unlocked stat lines; current material recipe is locked for `T1 -> T6`, current approved currency = `gold`, and current approved additional gold costs are:
  - `T1 -> T2 = 90`
  - `T2 -> T3 = 180`
  - `T3 -> T4 = 300`
  - `T4 -> T5 = 480`
  - `T5 -> T6 = 750`
  Current approved economy-role split:
  - `Upgrade` is the cheaper sink
  - `Merge` is the more expensive sink
  - current approved target ratio = `merge at equivalent power step costs about 3x upgrade`
- **Daily tree-resource mode:** `Rune Trial`
  - stage-based PvE riêng
  - `20` handmade stages in the initial structure
  - map size nhỏ hơn main mode
  - each stage targets `1–2` minutes
  - each stage has `2` short waves
  - only `movement + combat`
  - no `Battlefield Bag`, `Fusion`, `Mystery cell`, or `Day / Night`
  - reward = `Rune Shard` only
  - player has `2` rewarded wins per day; losing does not consume, winning does
  - after both rewarded wins are used, the mode cannot be entered again that day
  - any cleared stage may be replayed; sweep is allowed on any already-cleared stage, including the highest cleared stage
- **Current tree-cost direction after v28:**
  - tree keeps the current topology and node values
  - the old gold cost table is no longer the approved spend sink for tree progression
  - approved conversion rule = keep the previous tree costs `1:1` and change only the spend currency from `gold` to `Rune Shard`
  - exact current approved node costs are:
    - `Iron Hide = 16 / 24 / 36 Rune Shard`
    - `Steady Hand = 16 / 24 / 36 Rune Shard`
    - `Clean Loot = 16 / 24 / 36 Rune Shard`
    - `Veteran Body = 28 / 42 / 60 Rune Shard`
    - `Finisher's Edge = 28 / 42 / 60 Rune Shard`
    - `Contract Bonus = 28 / 42 / 60 Rune Shard`
    - `Campaign Command = 52 / 72 / 96 Rune Shard`
  - full tree total = `838 Rune Shard`

#### Current behavior
Current locked direction của v13 tách progression thành nhiều lớp rõ hơn. V27 giữ nguyên role split đó, nhưng chốt thêm rằng tree currency nay là `Rune Shard / Mảnh Ấn` và mode daily chính thức để nuôi tree là `Rune Trial`. Main run vẫn là nơi cho `gold`; `Rune Trial` không thay thế main run mà chỉ thêm một lane daily ngắn cho baseline progression. Exact current approved `Rune Trial` rewards are `7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27` from `Stage 1 -> Stage 20`.

#### Editable parameters
- future stage expansion beyond the current initial `20` stages
- future tree expansion beyond the current `8-node` layout
- future tree-cost expansion beyond the current locked rune-shard table
- future Rune Trial reward expansion beyond the current initial `20` stages

#### Protected invariants
- `Gold Tech Tree` phải tiếp tục là `base power / power floor`
- `Equipment Upgrade` vẫn là base power sink dùng `gold`
- `Equipment Merge Tier` vẫn là family-bias sink dùng `gold`
- `Rune Trial` không được cạnh tranh với `Battlefield Bag + Fusion` ở vai trò build-identity dominant của main run

#### Design goal
- Tách rõ `per run` progress và `daily` progress mà không biến sản phẩm thành multi-currency rối hoặc energy-gated main run
- Giữ tree là lane baseline growth dài hạn, còn main run vẫn là sân khấu gameplay/build chính

#### Source of truth
- Config Data
- Gameplay Logic
- Persistence

#### Dependencies / impact
- economy
- meta loop
- home flow
- modes flow
- progression pacing
- persistence

#### Current status
- Filled
### 5.2 Economy
- **Currency types:** `Gold` + `Rune Shard / Mảnh Ấn`
- **Earn sources:**
  - `Gold`
    - enemy kill trong main run
    - giết càng nhiều enemy / đi càng xa trong main run thì tổng gold càng nhiều
    - current gold bands are separate from combat threat bands:
      - `Low = 1 gold`
      - `Mid = 2 gold`
      - `High = 4 gold`
    - current default archetype mapping:
      - `Wind = Low`
      - `Slime = Mid`
      - `Worm = High`
      - `Fire = High`
    - content override is allowed only for `elite / boss` entries and `chapter milestone` entries
    - current slime reference reward = `2 gold`
    - future boss reward is `gold only` and currently equals `8x Slime = 16 gold`
  - `Rune Shard`
    - thắng trong `Rune Trial`
    - mode reward hiện chỉ là `Rune Shard`
    - thua trong mode không mất rewarded win và không cho reward
    - thắng mới tiêu `1` rewarded win
    - exact current approved stage reward table:
      - `Stage 1 = 7`, `Stage 2 = 9`, `Stage 3 = 10`, `Stage 4 = 11`, `Stage 5 = 12`
      - `Stage 6 = 13`, `Stage 7 = 14`, `Stage 8 = 15`, `Stage 9 = 16`, `Stage 10 = 17`
      - `Stage 11 = 18`, `Stage 12 = 19`, `Stage 13 = 20`, `Stage 14 = 21`, `Stage 15 = 22`
      - `Stage 16 = 23`, `Stage 17 = 24`, `Stage 18 = 25`, `Stage 19 = 26`, `Stage 20 = 27`
- **Spend sinks:** current approved sinks = `Gold Tech Tree` dùng `Rune Shard`; `Equipment Upgrade` dùng `gold`; `Equipment Merge Tier` dùng `gold`
- **Carry-over rules:**
  - `Gold` được persist ở cả `win` lẫn `lose` của main run
  - `Rune Shard` là persistent resource ngoài run
- **Locked gold-efficiency formula:** `% bonus cộng vào tổng gold cuối run sau khi tally base gold của run`
- **Current tree-cost direction:**
  - previous gold table no longer acts as the approved spend sink for tree progression
  - tree topology and node values stay the same
  - approved conversion rule = keep the previous tree costs `1:1` and change only the spend currency from `gold` to `Rune Shard`
  - exact current approved node costs are:
    - `Iron Hide = 16 / 24 / 36 Rune Shard`
    - `Steady Hand = 16 / 24 / 36 Rune Shard`
    - `Clean Loot = 16 / 24 / 36 Rune Shard`
    - `Veteran Body = 28 / 42 / 60 Rune Shard`
    - `Finisher's Edge = 28 / 42 / 60 Rune Shard`
    - `Contract Bonus = 28 / 42 / 60 Rune Shard`
    - `Campaign Command = 52 / 72 / 96 Rune Shard`
  - full tree total = `838 Rune Shard`
- **Approved Rune Trial reward curve:**
  - exact current approved stage reward table is locked as:
    - `Stage 1 = 7`, `Stage 2 = 9`, `Stage 3 = 10`, `Stage 4 = 11`, `Stage 5 = 12`
    - `Stage 6 = 13`, `Stage 7 = 14`, `Stage 8 = 15`, `Stage 9 = 16`, `Stage 10 = 17`
    - `Stage 11 = 18`, `Stage 12 = 19`, `Stage 13 = 20`, `Stage 14 = 21`, `Stage 15 = 22`
    - `Stage 16 = 23`, `Stage 17 = 24`, `Stage 18 = 25`, `Stage 19 = 26`, `Stage 20 = 27`
  - there is no first-clear bonus
  - sweep reward equals manual-clear reward
- **Economy pacing intent:**
  - main run vẫn phải cho cảm giác `đi xa hơn = gold progress nhanh hơn`
  - tree progression có daily lane riêng qua `Rune Trial`
  - `Rune Trial` phải là một bài test ngắn và một nguồn daily-return, không phải một grind loop dài thay main run
- **Inflation control:** future `Rune Shard` table, future stage rewards, future elite/boss/chapter gold overrides, và future tree size phải tiếp tục giữ:
  - main run vẫn có giá trị rõ qua `gold`
  - tree vẫn có progress daily qua `Rune Shard`
  - không biến sản phẩm thành multi-currency rối khó đọc
- **Economy persistence schema:** persistence layer requires balances for both `Gold` and `Rune Shard`; exact current approved rune-trial / rune-shard fields are:
  - `diceBoundPlayerData.runeProgress.runeShardBalance`
  - `diceBoundPlayerData.runeProgress.highestClearedStage`
  - `diceBoundPlayerData.runeProgress.stageClearMap`
  - `diceBoundPlayerData.runeProgress.dailyRewardedWinsUsed`
  - `diceBoundPlayerData.runeProgress.lastDailyResetAt`
- **Gameplay flow status:** Gold flow của main run vẫn giữ source side và carry-over hiện hành; v26 chỉ tách tree khỏi gold và thêm một resource riêng cho tree

#### Current behavior
Current approved source side for progression now splits cleanly:
- `Gold` = main run combat / progression currency outside run for non-tree sinks and overall run progress feeling
- `Rune Shard / Mảnh Ấn` = daily tree-upgrade currency from `Rune Trial`

`Rune Trial` does not generate `gold`, and main run does not generate `Rune Shard`.

#### Editable parameters
- future gold overrides for elite / boss / chapter milestones
- future economy polish for daily-mode reward presentation
- future tree-cost expansion beyond the current locked rune-shard table
- future stage-reward expansion beyond the current initial `20` stages

#### Protected invariants
- `Gold` must remain the main-run combat-economy currency
- `Rune Shard` must remain the tree-upgrade currency
- `Rune Trial` must not become a broad multi-reward farm mode
- Economy must stay readable at first contact

#### Design goal
- Tách cây sức mạnh nền ra khỏi gold để tree có loop daily rõ ràng
- Giữ `gold` và `Rune Shard` có job khác nhau, không bị chồng vai
- Đảm bảo player hiểu rất nhanh: main run kiếm gì, Rune Trial kiếm gì, và tiêu ở đâu

#### Source of truth
- Config Data
- Persistence
- Gameplay Logic

#### Dependencies / impact
- long-term progression
- meta loop
- home flow
- modes flow
- save schema

#### Current status
- Filled
### 5.3 Inventory
### 5.3 Inventory
- **Has inventory:** Có bag UI dùng trong level
- **Inventory type:** Limited-slot battlefield bag with item levels and fusion endpoints
- **Capacity:** `4` active slots
- **Slot structure:** `4` neutral active slots
- **Item persistence:** Chỉ tồn tại trong level hiện tại; hết khi player chết / thua
- **Equip/use rules:**
  - item đang nằm trong bag sẽ cộng chỉ số xuyên suốt level hiện tại
  - normal item có `level 1 -> 3`
  - chọn đúng item đang có = upgrade item đó lên tối đa `level 3`
  - nếu chọn item mới và bag còn slot trống, player có thể đưa item mới vào một slot trống bất kỳ hoặc chọn swap với một current power item đang sở hữu
  - nếu chọn item mới và bag đã đầy, flow chuyển sang replace branch: player `tap` item mới trước, rồi `tap` một item cũ để thay ngay; hoặc `skip` reward đó
  - `2` items `level 3` đúng recipe có thể fusion thành `1` endpoint item
  - fusion item không có level và không upgrade tiếp
  - reward popup phải luôn cho player ít nhất một action hợp lệ:
    - `pick`
    - `reroll` nếu level hiện tại còn lượt reroll
    - `skip`

#### Current behavior
Current v5 bag framework khóa `4` active slots trong level. Bag đóng vai trò inventory build chứ không chỉ là chỗ chứa item. Cả `4` slot đều hoàn toàn trung tính; bag không còn chia utility slot hay combat slot. Bag dùng normal items có `level 1 -> 3`; nếu player nhận lại item đã có thì item đó tăng level. Khi đủ `2` items `level 3` theo recipe, bag hiển thị trạng thái `fusion ready`; player tự bấm để thực hiện fusion thủ công thay vì auto-fusion ngay lúc nhận item. Endpoint item không có level và không thể tăng cấp tiếp. Current framework coi fusion item là `1 completed family package that expresses 1 dominant combat role`. Current numeric rule cũng khóa rằng mỗi lần upgrade normal item phải cho power gain nhìn thấy hoặc cảm được ngay, để player có động lực rõ ràng khi chọn upgrade thay vì chỉ chạy theo ngưỡng fusion. Trong v5, inventory/reward flow không được rơi vào trạng thái “hiện 3 choice nhưng không bấm được choice nào” hoặc “bag đầy nhưng không còn action hợp lệ”; ít nhất một trong ba hành động `pick / reroll / skip` luôn phải tồn tại. Khi bag chưa đầy và player chọn một item mới không phải duplicate-upgrade, current approved direction cho phép player hoặc đưa item đó vào slot trống, hoặc chọn swap với một current power item đang sở hữu. Khi bag đầy và player chọn một item mới, current locked flow vẫn không quay lại popup `3-choice` ban đầu: player phải hoặc `tap` một item cũ để thay ngay, hoặc `skip` reward đó.

#### Editable parameters
- exact slot UI
- future exception rules for cross-domain recipes
- replace / conflict resolution presentation
- exact non-full-bag swap presentation
- visual treatment of `fusion ready` state
- item-level numeric values
- future slot-count experiments
- reroll count per level
- skip availability

#### Protected invariants
- Bag chỉ là in-run system, không phải permanent inventory
- Capacity mặc định của framework hiện tại là `4`
- Bag phải giữ đúng `4` active slots và cả `4` slot đều là neutral slots
- Fusion endpoint không được có level hoặc upgrade tiếp trong current framework
- Reward popup không được tạo dead-flow; ít nhất một action hợp lệ phải luôn tồn tại
- Full-bag replace flow không có cancel-back branch sau khi player đã commit vào một item mới

#### Design goal
- Tạo giới hạn rõ cho in-run build để player phải chọn hướng thật sự.
- Cho player đủ chỗ để theo đuổi nhiều synergy, nhưng không đủ rộng để ôm toàn bộ pool.
- Làm cho inventory trở thành công cụ đọc build identity, không chỉ là chỗ chứa số liệu.
- Chặn dead-choice / dead-flow trong reward interaction để Cursor không tự sinh ra state kẹt.
- Khi bag đầy, choice thay đồ phải rõ và ít bước: chọn item mới, rồi chạm item cũ để thay ngay hoặc bỏ reward.
- Khi bag chưa đầy, player vẫn được quyền chủ động đổi hướng build bằng cách swap với current power item thay vì luôn phải nhét item mới vào slot trống.

#### Source of truth
- Gameplay Logic
- State Flow
- UI Presentation

#### Current status
- Filled

---
### 5.4 Upgrade
- **Upgrade categories:**
  - Permanent Home / Gold Tech Tree nodes:
    - `Iron Hide` (`HP`)
    - `Steady Hand` (`dmgMin`)
    - `Clean Loot` (`gold efficiency`)
    - `Veteran Body` (`HP`)
    - `Finisher's Edge` (`dmgMax`)
    - `Contract Bonus` (`gold efficiency`)
    - `Campaign Command` (`combat + economy capstone`)
  - Between-level power-ups:
    - Heal +1
    - Heal +2
    - Increase min damage
    - Increase max damage
- **Temporary / permanent:** Có cả temporary và permanent
- **Upgrade source:** Home / Gold Tech Tree, level completion
- **Upgrade limits:**
  - root là structural free node
  - mỗi tech-tree node có `3` cấp
  - between-level power-ups theo flow hiện hành của level clear
  - no prestige / reset for Gold Tech Tree in current approved direction
- **Stack rules:**
  - cùng một node tăng tuần tự `Lv1 -> Lv2 -> Lv3`
  - node phía trên trong cùng branch chỉ mở khi prerequisite node phía dưới đã full
  - player không cần full toàn bộ lower tier trên toàn cây để mở mọi branch phía trên
  - `Finisher's Edge` không được mở trước khi `Steady Hand` đã full
- **Locked current values:**
  - `Iron Hide` = `+10 / +20 / +30 HP`
  - `Steady Hand` = `+3 / +3 / +4 dmgMin`
  - `Clean Loot` = `+5% / +6% / +7% total gold`
  - `Veteran Body` = `+5 / +10 / +15 HP`
  - `Finisher's Edge` = `+3 / +3 / +4 dmgMax`
  - `Contract Bonus` = `+4% / +5% / +6% total gold`
  - `Campaign Command` = `Lv1: +2 dmgMin`, `Lv2: +2 dmgMax`, `Lv3: +5% total gold`
- **Locked cost direction:**
  - tree no longer uses the legacy gold cost table as the approved spend sink
  - tree topology and node values stay the same
  - approved conversion rule = keep the previous tree costs `1:1` and change only the spend currency from `gold` to `Rune Shard`
  - exact current approved node costs are:
    - `Iron Hide = 16 / 24 / 36 Rune Shard`
    - `Steady Hand = 16 / 24 / 36 Rune Shard`
    - `Clean Loot = 16 / 24 / 36 Rune Shard`
    - `Veteran Body = 28 / 42 / 60 Rune Shard`
    - `Finisher's Edge = 28 / 42 / 60 Rune Shard`
    - `Contract Bonus = 28 / 42 / 60 Rune Shard`
    - `Campaign Command = 52 / 72 / 96 Rune Shard`
  - full tree total = `838 Rune Shard`
- **Locked upgrade UI direction:**
  - tree entered from `Home`
  - layout = vertical bottom-up
  - each node shows `icon / name / level / cost / main effect`

#### Current behavior
Current approved direction keeps the same tree topology and node effects, but tree node upgrades now consume `Rune Shard / Mảnh Ấn`, not `gold`. `gold` remains used by other approved sinks. Exact current approved node costs are: `Iron Hide = 16 / 24 / 36`, `Steady Hand = 16 / 24 / 36`, `Clean Loot = 16 / 24 / 36`, `Veteran Body = 28 / 42 / 60`, `Finisher's Edge = 28 / 42 / 60`, `Contract Bonus = 28 / 42 / 60`, `Campaign Command = 52 / 72 / 96`, all in `Rune Shard`; full tree total = `838 Rune Shard`.

#### Editable parameters
- future tree expansion after the current `8-node` layout
- future UI polish / animation
- future tree-cost expansion beyond the current locked rune-shard table

#### Protected invariants
- Tree must keep the current branch structure and node effects unless a later update changes them explicitly
- `Finisher's Edge` must remain gated behind `Steady Hand`
- No prestige / reset loop for the tree

#### Design goal
- Giữ tree đủ rõ và quen thuộc ở mặt topology / values, nhưng đổi sang currency daily riêng để tạo return loop mới mà không phá identity của main run

#### Source of truth
- Config Data
- Gameplay Logic
- UI Presentation

#### Dependencies / impact
- economy
- long-term progression
- home flow
- persistence

#### Current status
- Filled
### 5.5 Shop
### 5.5 Shop
- **Has shop:** Không có trong build hiện tại
- **Shop location:** Not in current prototype
- **Shop inventory:** Not in current prototype
- **Refresh rules:** Not in current prototype
- **Purchase rules:** Not in current prototype

#### Current behavior
- Không có trong build hiện tại và chưa có mô tả trong version 1.1.0

#### Editable parameters
- [Chưa áp dụng]

#### Design goal
- Not in current prototype

#### Source of truth
- Config Data
- Gameplay Logic
- UI Presentation

#### Current status
- Not in current prototype

---

### 5.6 Mission / quest
- **Objective structure:** `objectiveType`, `targetValue`
- **Mission source:** Code logic
- **Reward:** Chưa mô tả trong version 1.1.0
- **Tracking UI:** Chưa mô tả trong version 1.1.0

#### Current behavior
Current objective type in use là `defeat_all`.
Objective này được define ở code logic. Current objective schema ở mức business data là:
- `objectiveType`
- `targetValue`

#### Editable parameters
- objective type
- target value
- reward logic
- tracking UI

#### Protected invariants
- Objective phải được định nghĩa rõ theo level hoặc global rules

#### Design goal
- Giữ objective rõ, dễ đọc, dễ test trong prototype.

#### Source of truth
- Gameplay Logic
- Config Data
- UI Presentation

#### Current status
- Partial

---

### 5.7 Energy / lives / timer
- **Has energy/lives/timer:** Không có trong build hiện tại
- **Consumption rule:** Not in current prototype
- **Refill rule:** Not in current prototype
- **Session pressure rule:** Not in current prototype

#### Current behavior
- Không có trong build hiện tại và chưa có mô tả trong version 1.1.0

#### Editable parameters
- [Chưa áp dụng]

#### Design goal
- Not in current prototype

#### Source of truth
- Config Data
- Persistence
- Gameplay Logic

#### Current status
- Not in current prototype

---

### 5.8 Gacha / chest / reward tables
- **Has chest/reward table:** Có random reward tables cho `Battlefield Bag` offer
- **Mystery reward logic:** Mystery cell không còn dùng stat reward pool riêng; mystery cell mở cùng bag popup với enemy death
- **Battlefield bag offer logic:** `enemy death` hoặc `mystery cell` đều có thể mở `3` item choices từ current bag power-item pool
- **Offer composition rule:**
  - choice có thể là item mới
  - choice có thể là item player đã sở hữu để dùng làm upgrade
  - offer dùng `BasePhaseWeight` theo `Early / Mid / End` và được chỉnh tiếp bởi `Dynamic Modifiers`
- **Player action rule on popup:**
  - player có thể chọn `1`
  - player có thể `reroll` toàn bộ `3` current choices nếu level hiện tại còn lượt reroll
  - player có thể `skip` và không nhận gì
  - nếu item đã chọn là item mới không phải duplicate-upgrade, current approved direction cho phép player swap với current power item đang sở hữu kể cả khi bag chưa đầy
- **Fusion rule dependency:** reward table phải cho phép player tiến từ normal item → level 3 → fusion endpoint nếu build được nuôi đúng
- **Damage Guard rule for bag items:** mọi item hoặc phase bonus chạm `dmgMin / dmgMax` phải đi qua cùng triết lý guard của player damage hiện hành để giữ readability và không phá width cap hiện tại

#### Current behavior
Mystery power cell trong v2 không còn dùng pool:
- `+1 HP`
- `+1 min DMG`
- `+1 max DMG`

Thay vào đó, cả mystery cell và enemy death đều dùng cùng `Battlefield Bag` reward flow:
- mỗi reward popup mở `3` item choices
- player có thể chọn `1`
- player có thể `reroll` toàn bộ `3` choice nếu level hiện tại chưa dùng lượt reroll
- player có thể `skip` để đóng popup và không nhận gì
- nếu item đã chọn là item mới không phải duplicate-upgrade, current approved direction cho phép player swap với current power item đang sở hữu kể cả khi bag chưa đầy
- normal items dùng `level 1 -> 3`
- exact numeric values cho normal items và fusion-end bonus hiện đã được khóa ở `6.5 Items / skills / characters`
- offer dùng `BasePhaseWeight` theo `Early / Mid / End`
- `FinalWeight = BasePhaseWeight × UpgradeBias × FamilyBias × RecoveryBias × DayNightBias`
- Trong v4, slot-type-dependent `SlotNeedBias` không còn active vì bag không còn chia utility/combat slots

**A. Base phase weights — Utility / tactic items**

| Item | Early | Mid | End |
|---|---:|---:|---:|
| Pathfinder Token | 14 | 8 | 4 |
| Step Anchor | 13 | 8 | 4 |
| Field Kit | 9 | 7 | 4 |
| Sun Compass | 10 | 9 | 4 |
| Moon Ward | 6 | 9 | 12 |

**B. Base phase weights — Combat items**

| Item | Early | Mid | End |
|---|---:|---:|---:|
| Guard Crest | 14 | 10 | 6 |
| Stable Edge | 13 | 11 | 7 |
| Power Edge | 10 | 10 | 8 |
| Keen Eye | 8 | 10 | 9 |
| Fatal Fang | 5 | 8 | 10 |
| Iron Guard | 8 | 9 | 10 |
| Blood Charm | 7 | 9 | 9 |
| Twin Sigil | 6 | 9 | 10 |
| Sun Fang | 10 | 10 | 5 |
| Moon Fang | 5 | 8 | 12 |

**C. Dynamic modifiers**

| Condition | Modifier |
|---|---:|
| item đã có và chưa max | ×2.0 |
| item đang ở Lv2 và còn thiếu Lv3 để mở fusion recipe hiện tại | ×2.8 |
| item cùng family với build direction hiện tại | ×1.5 |
| item là nguyên liệu trực tiếp để hoàn thành fusion đang mở | ×2.2 |
| player HP ≤ 50% max và item thuộc nhóm Guard / Iron Guard / Blood Charm / Field Kit / Moon Ward | ×1.7 |
| current phase là Day và item là Sun Compass / Sun Fang | ×1.35 |
| current phase là Night và item là Moon Ward / Moon Fang | ×1.5 |
| sau fusion đầu tiên mà item hoàn toàn lệch build hiện tại | ×0.45 |
| recipe này tạo ra fusion item mà player đã có sẵn trong run hiện tại | ×0 |

**D. Weight intent**
- `Early` ưu tiên survivability, stable damage, route stability và build opening clarity
- `Mid` cân bằng giữa base power, family direction và tiến độ chạm `level 3`
- `End` ưu tiên item giúp hoàn thành fusion endpoint hoặc sống sót / kết liễu trong stretch cuối của level
- Dynamic modifiers tồn tại để hỗ trợ `bad draft recovery` nhưng không triệt tiêu hoàn toàn cảm giác random của reward popup

Current locked bag framework dùng base pool gồm:
- `5` utility / tactic base items
- `10` combat base items

Current locked endpoint target gồm:
- `5` utility / tactic fusion-end synergies
- `10` combat fusion-end synergies

#### Editable parameters
- future tuning of base phase weights after enemy level-scaling table is authored
- future tuning of dynamic-modifier multipliers after playtest
- duplicate / upgrade bias fine-tuning
- reroll count per level
- skip availability
- future reward-table UX cues if the weighting needs to be surfaced more clearly to the player

#### Design goal
- Reward random phải đủ đơn giản để player hiểu nhanh, nhưng đủ thông minh để build không chết quá sớm vì offer xấu. Utility/combat distinction có thể tiếp tục tồn tại ở lớp item pool và weighting, nhưng không được quay lại thành slot-type logic ở cấp bag.
- Offer table phải nuôi được phase structure của build: early chọn hướng, mid đẩy synergy, end tìm fusion.
- Reward table phải giữ cho từng lần upgrade có cảm giác mạnh lên rõ ngay, thay vì tạo các cấp độ “chỉ để mở fusion”.
- Reward table không được phá readability bằng cách cho quá nhiều hệ số ẩn hoặc quá nhiều ngoại lệ khó đoán.
- Mystery và enemy death phải dùng một ngôn ngữ reward nhất quán để player đọc hệ nhanh hơn.

#### Source of truth
- Config Data
- Gameplay Logic
- UI Presentation

#### Current status
- Filled

---
### 5.9 Difficulty scaling
- **Difficulty drivers:**
  - enemy archetypes
  - movement speed
  - special tiles
  - reward opportunities
  - progression systems
  - wave count / wave transition pacing
  - battlefield bag slot pressure / power-item access từ `enemy death + mystery cell`
  - early-wave route target availability từ mystery-cell-per-wave rule
  - heal potion access from kill order
  - enemy survivability / damage targets vs player
  - Day / Night timing pressure
  - Gold Tech Tree permanent baseline growth
- **Per level scaling:** Locked in v1.2.8. Enemy level scaling exists and is intended to create a stable difficulty rise across levels and waves without unreasonable spikes; current approved cadence is `HP +10 each level / DMG +10 every 3 levels`.
- **Per enemy scaling:** Locked framework in v14. `moveSpeed` remains fixed by archetype; enemy level modifies `HP + DMG` only, with current approved cadence `HP +10 each level` and `DMG +10 every 3 levels`.
- **Per reward scaling:** current tree source side is locked enough for v1:
  - economy gold bands are separate from combat threat bands
  - `Low = 1`, `Mid = 2`, `High = 4`
  - default archetype mapping = `Wind Low`, `Slime Mid`, `Worm High`, `Fire High`
  - content override is allowed only for `elite / boss` and `chapter milestone` entries
  - future boss reward = `16 gold`
- **Global phase scaling:** Current locked direction dùng `4` Day full rounds → `2` Night full rounds lặp lại; Night làm enemy nguy hiểm hơn bằng movement và damage multipliers
- **Current tech-tree pressure allowance:** Gold Tech Tree được phép tạo rõ cảm giác mạnh lên ở early / mid game, nhưng later content phải bù lại bằng content scaling thay vì để permanent growth xóa sạch tactical pressure
- **Current locked full-tree baseline contribution:**
  - `+90 HP`
  - `+12 dmgMin`
  - `+12 dmgMax`
  - `+38% total gold`
- **Current combat-lane guard:**
  - `dmgMax` node path không được mở trước khi `dmgMin` prerequisite đã full
  - mọi thay đổi tương lai vào combat-lane path phải tiếp tục giữ:
    - `player.dmg.max - player.dmg.min <= 50% x slime.hp_reference`
    - `player.dmg.min >= 50% x player.dmg.max`

#### Current behavior
Current approved difficulty direction của v9 là:
- Gold Tech Tree được phép tạo rõ cảm giác mạnh lên ở early / mid game
- later content phải bù lại bằng content scaling thay vì để permanent growth xóa sạch tactical pressure
- bag/fusion vẫn phải là nguồn swing / build-expression dominant trong run
- current v1 tree đã được tune để combat-lane order không phá player damage-guard rule hiện hành
- current reward/difficulty reading phải chấp nhận rằng economy gold bands và combat threat bands là hai lớp khác nhau; enemy có thể nguy hiểm theo combat readout nhưng vẫn dùng economy band riêng cho source/sink tuning

Current protected implication của tree v1:
- mỗi wave phải có ít nhất `1` mystery cell mới để player có route target sớm thay vì chỉ đứng đợi enemy tiến tới
- early account growth chủ yếu đến từ `HP`, `dmgMin`, và end-of-run `gold efficiency`
- `dmgMax` được mở muộn hơn để tránh làm player damage swing quá rộng quá sớm
- future changes vào Equipment hoặc tree values phải được review cùng nhau, không được tune từng lớp độc lập rồi làm vỡ total permanent baseline
- future changes vào gold reward pacing cũng phải được review cùng tree cost table, không được tune source side tách khỏi sink side

#### Editable parameters
- enemy move speed by archetype
- enemy HP / DMG by enemy level (current approved cadence = `HP +10 each level / DMG +10 every 3 levels`)
- player baseline stats
- starting `minRoll` / `maxRoll`
- reward density
- hazard density
- per-wave minimum new-mystery requirement
- wave count / wave composition
- battlefield bag slot count
- heal potion chance / value
- power visibility formula
- Day / Night cycle length / Night multipliers
- player DMG width cap vs reference Slime HP
- enemy standard / strongest-damage hits-to-kill-player targets
- enemy DMG variance band rule
- future elite / boss / chapter-milestone gold overrides
- future tech-tree growth speed after the current v1 tree

#### Protected invariants
- Difficulty scaling không được phá tính readable và fairness
- Mỗi wave phải có ít nhất `1` mystery cell mới để tạo early route target và giảm passive waiting ở đầu wave
- Player DMG range width phải luôn tôn trọng cap theo Slime HP reference của level hiện tại; nếu Slime HP là số lẻ thì mốc `50%` được làm tròn xuống
- Player DMG phải được giữ trong band `50% -> 100%` để damage không quá swing
- Gold Tech Tree không được làm route choice, threat reading, và in-run build timing mất ý nghĩa
- economy gold bands và combat threat bands không được vô tình nhập làm một nếu chưa có yêu cầu rõ

#### Design goal
- Giữ cho permanent growth tạo cảm giác mạnh lên rõ ràng nhưng không làm flatten tactical game quá sớm
- Bảo đảm mỗi wave có một route target sớm để player không bị ép vào trạng thái chỉ chờ enemy tiếp cận
- Làm cho reward pacing và difficulty pacing cùng đọc được: enemy giết khó hơn có thể cho nhiều progress hơn, nhưng system vẫn phải dễ tune và không bị khóa cứng vào combat readout

#### Source of truth
- Config Data
- Content Data
- Gameplay Logic

#### Current status
- Filled

## 6. Content Structure
**Section source of truth:** Content Data + Config Data

### 6.1 Level / chapter / stage structure
- **Main-run number of levels:** 10
- **Main-run grouping logic:** Đang test 10 level để xem progress về độ khó; hiện ở giai đoạn mid game
- **Main-run objective types:** `defeat_all` across fixed waves in the level
- **Main-run transition flow:** Trong level chính: preview / spawn flow bám theo rule wave hiện hành của main mode
- **Primary main-run map size:** 8x11 (current playtest setting đã được xác nhận lại)
- **Current conceptual level schema blocks for main run:** `mapSize`, `playerStart`, `waves`, `specialTiles`, `objective`
- **Secondary stage structure:** `Rune Trial`
  - initial structure = `20` stages
  - mỗi stage là `handmade`
  - map size nhỏ hơn main mode
  - mỗi stage có `2` short waves
  - objective = defeat all enemies across the stage's `2` waves
  - `Wave 1` nhẹ hơn, `Wave 2` nặng hơn rõ
  - `Wave 2` uses red `X` preview and then spawns immediately when `Wave 1` is cleared
  - no `Mystery cell`
  - no `Day / Night`
  - any previously cleared stage may be replayed; sweep is allowed on any already-cleared stage, including the current highest cleared stage

#### Current behavior
Main-run content có thể đến từ:
- `level-design.js`
- `repo-maps.js`
- `maps/*.json`
- `maps/manifest.json`
- `map-editor.html` + localStorage playtest payload

Map hỗ trợ preset grid như:
- `9x12`
- `8x11`
- `8x10`
- `7x10`

Current playtest của main mode đang bám vào preset `8x11`.

Current approved secondary-mode direction adds `Rune Trial` as a separate stage line:
- `20` stages initially
- stage content is `handmade`
- each stage is shorter than a main run level and targets `1–2` minutes
- each stage contains `2` waves only
- no bag / fusion / mystery / day-night in this mode
- reward = `Rune Shard` only
- exact current approved reward table is:
  - `Stage 1 = 7`, `Stage 2 = 9`, `Stage 3 = 10`, `Stage 4 = 11`, `Stage 5 = 12`
  - `Stage 6 = 13`, `Stage 7 = 14`, `Stage 8 = 15`, `Stage 9 = 16`, `Stage 10 = 17`
  - `Stage 11 = 18`, `Stage 12 = 19`, `Stage 13 = 20`, `Stage 14 = 21`, `Stage 15 = 22`
  - `Stage 16 = 23`, `Stage 17 = 24`, `Stage 18 = 25`, `Stage 19 = 26`, `Stage 20 = 27`
- current implementation scope may ship the mode framework plus `3` sample stages before the full handmade `20`-stage content table is hand-locked

#### Editable parameters
- main-run map size
- main-run source content
- main-run objective type
- `Rune Trial` map-size presets
- exact `Rune Trial` per-stage enemy table
- future `Rune Trial` stage expansion beyond the current initial `20`

#### Protected invariants
- main run and Rune Trial are separate content lines with separate jobs
- Rune Trial must stay short and should not become a long-form content treadmill competing directly with the main run

#### Design goal
- Giữ main run là sân khấu gameplay/build chính, còn Rune Trial là content lane ngắn để kiểm tra power floor và nuôi tree-resource daily

#### Source of truth
- Content Data
- Gameplay Logic
- Config Data

#### Dependencies / impact
- modes flow
- economy
- long-term progression
- persistence
- content burden

#### Current status
- Filled
### 6.2 World map
- **Has world map:** Chưa mô tả trong current GDD
- **Structure:** Chưa mô tả trong version 1.1.0
- **Unlock path:** Chưa mô tả trong version 1.1.0
- **Navigation rule:** Chưa mô tả trong version 1.1.0
- **Visual vs gameplay role:** Chưa mô tả trong version 1.1.0

#### Current behavior
- Chưa mô tả trong version 1.1.0

#### Editable parameters
- [Chưa mô tả trong version 1.1.0]

#### Design goal
- Chưa mô tả trong version 1.1.0

#### Source of truth
- Content Data
- UI Presentation

#### Current status
- Missing

---

### 6.3 Enemy types

#### Enemy type: Slime
- **Visual ID:** `enemy_slime`
- **Role:** Enemy cơ bản; enemy chuẩn cho mốc survivability của player
- **Base stats:** `HP 50`, `DMG 30-40`, badge `90`
- **Move rule:** archetype-fixed `spd 1-1` ở Day; Night modifier `2-2`
- **Level scaling rule:** HP và DMG có thể thay đổi theo từng enemy level; move speed giữ nguyên theo archetype
- **Combat rule:** theo combat system chung; Night modifier `DMG 60-80`
- **Special ability:** Chưa mô tả trong version 1.1.0
- **Encounter intro:** Có
- **Reward / drop:** Current consolidated direction: enemy death triggers generic reward flow gồm `1` power item qua battlefield bag UI, `30%` chance sinh heal potion, current default economy gold band `Mid = 2 gold`, và khoảng `20%` chance rớt `1` random `Tier 1 Equipment`; sau khi combat UI đóng, dropped `Gold` và `Equipment` nhảy ra từ xác enemy, chờ khoảng `0.5s`, rồi bay vào túi mục tiêu ở góc trên bên phải

#### Enemy type: Wind
- **Visual ID:** `enemy_wind`
- **Role:** Fast mover / speed archetype
- **Base stats:** `HP 30`, `DMG 20-30`, badge `60`
- **Move rule:** archetype-fixed `spd 2-4` ở Day; Night modifier `4-8`
- **Level scaling rule:** HP và DMG có thể thay đổi theo từng enemy level; move speed giữ nguyên theo archetype
- **Combat rule:** theo combat system chung; Night modifier `DMG 40-60`
- **Special ability:** Chưa mô tả trong version 1.1.0
- **Encounter intro:** Có
- **Reward / drop:** Current consolidated direction: enemy death triggers generic reward flow gồm `1` power item qua battlefield bag UI, `30%` chance sinh heal potion, current default economy gold band `Low = 1 gold`, và khoảng `20%` chance rớt `1` random `Tier 1 Equipment`; sau khi combat UI đóng, dropped `Gold` và `Equipment` nhảy ra từ xác enemy, chờ khoảng `0.5s`, rồi bay vào túi mục tiêu ở góc trên bên phải

#### Enemy type: Worm
- **Visual ID:** `enemy_worm`
- **Role:** Tank / high-HP archetype
- **Base stats:** `HP 70`, `DMG 40-50`, badge `120`
- **Move rule:** archetype-fixed `spd 2-2` ở Day; Night modifier `4-4`
- **Level scaling rule:** HP và DMG có thể thay đổi theo từng enemy level; move speed giữ nguyên theo archetype
- **Combat rule:** theo combat system chung; Night modifier `DMG 80-100`
- **Special ability:** Chưa mô tả trong version 1.1.0
- **Encounter intro:** Có
- **Reward / drop:** Current consolidated direction: enemy death triggers generic reward flow gồm `1` power item qua battlefield bag UI, `30%` chance sinh heal potion, current default economy gold band `High = 4 gold`, và khoảng `20%` chance rớt `1` random `Tier 1 Equipment`; sau khi combat UI đóng, dropped `Gold` và `Equipment` nhảy ra từ xác enemy, chờ khoảng `0.5s`, rồi bay vào túi mục tiêu ở góc trên bên phải

#### Enemy type: Fire
- **Visual ID:** `enemy_fire`
- **Role:** High-threat attacker; enemy mạnh nhất theo ý nghĩa sát thương
- **Base stats:** `HP 50`, `DMG 50-60`, badge `110`
- **Move rule:** archetype-fixed `spd 1-3` ở Day; Night modifier `2-6`
- **Level scaling rule:** HP và DMG có thể thay đổi theo từng enemy level; move speed giữ nguyên theo archetype
- **Combat rule:** theo combat system chung; Night modifier `DMG 100-120`
- **Special ability:** Chưa mô tả trong version 1.1.0
- **Encounter intro:** Có
- **Reward / drop:** Current consolidated direction: enemy death triggers generic reward flow gồm `1` power item qua battlefield bag UI, `30%` chance sinh heal potion, current default economy gold band `High = 4 gold`, và khoảng `20%` chance rớt `1` random `Tier 1 Equipment`; sau khi combat UI đóng, dropped `Gold` và `Equipment` nhảy ra từ xác enemy, chờ khoảng `0.5s`, rồi bay vào túi mục tiêu ở góc trên bên phải

##### Current behavior
Current baseline playtest table đang dùng:
- Player → move `dice-based`, `HP 180`, `DMG 20-40`, power `220`
- `enemy_slime` → `spd 1-1`, `HP 50`, `DMG 30-40`, badge `90`
- `enemy_wind` → `spd 2-4`, `HP 30`, `DMG 20-30`, badge `60`
- `enemy_worm` → `spd 2-2`, `HP 70`, `DMG 40-50`, badge `120`
- `enemy_fire` → `spd 1-3`, `HP 50`, `DMG 50-60`, badge `110`
- Current Day / Night modifier direction:
  - Slime Night → `spd 2-2`, `DMG 60-80`
  - Wind Night → `spd 4-8`, `DMG 40-60`
  - Worm Night → `spd 4-4`, `DMG 80-100`
  - Fire Night → `spd 2-6`, `DMG 100-120`

Balancing direction for enemy-to-player pressure:
- `enemy_slime` là enemy chuẩn cho mốc survivability của player; target là enemy chuẩn cần tối thiểu `5` hit để giết player
- `enemy_fire` là enemy mạnh nhất theo ý nghĩa sát thương; target là enemy mạnh nhất về sát thương cần tối thiểu `3` hit để giết player
- Enemy DMG range nên nằm trong band `70% -> 100%`; đây là design rule, chưa khóa exact rounding formula

Enemy number badge hiển thị trên map là:
- `enemy.hp.current + enemy.dmg.max`

Player visible power value dùng để player tự so trực tiếp với enemy:
- current v7 playtest direction: `player.hp.current + player.dmg.max`

Balance note:
- `enemy_slime` là balance anchor cho player DMG range cap
- current baseline reference Slime `HP 50` → player DMG width cap `25`; player DMG design band `50% -> 100%` so với `player.dmg.max`

Enemy intro popup:
- hiện lần đầu gặp một archetype
- seen flags lưu ở `dicebound_enemy_intro_seen_v1`
- popup cần phục vụ việc giúp player nhận ra và nhớ movement characteristic của enemy archetype

Current playtest:
- enemy target player
- behavior theo kiểu “yếu hơn thì đuổi item, mạnh hơn thì đuổi player” mới chỉ được ghi nhận như một loại enemy behavior attribute cho tương lai, chưa áp dụng toàn bộ
- Move speed là đặc tính cố định theo archetype ở baseline ban ngày; HP và DMG là phần có thể scale theo enemy level
- Nếu đang ở Night phase thì toàn bộ enemy dùng Night-modified move-speed range và damage range đã khóa cho mechanic Day / Night
- Balance anchor cho player DMG range cap là `enemy_slime`; current baseline reference Slime `HP 50` → player DMG width cap `25`; player DMG design band là `50% -> 100%` so với `player.dmg.max`
- Current consolidated reward direction: mọi enemy khi chết đều đi qua generic enemy-death reward flow gồm `1` power item qua battlefield bag UI, `30%` chance sinh heal potion, gold theo archetype economy band, và khoảng `20%` chance rớt `1` random `Tier 1 Equipment`; sau khi combat UI đóng, dropped `Gold` và `Equipment` nhảy ra từ xác enemy, chờ khoảng `0.5s`, rồi bay vào túi mục tiêu ở góc trên bên phải; default economy gold mapping theo archetype hiện là `Wind 1 / Slime 2 / Worm 4 / Fire 4`, và content override chỉ được phép cho `elite / boss` hoặc `chapter milestone` entries

##### Editable parameters
- base HP / DMG
- move speed by archetype
- level scaling for HP / DMG
- intro popup content
- badge / power formula
- archetype defaults
- target behavior attribute
- enemy-to-player hits-to-kill targets by archetype role
- enemy DMG variance band / min-max proximity rule

##### Protected invariants
- Enemy archetype data phải tách rõ với UI display
- Intro seen flag không được tự đổi key nếu không có lý do rõ
- Enemy luôn phải có movement để board state thay đổi liên tục
- Current build không được tự biến enemy thành obstacle tĩnh
- Move speed phải giữ vai trò nhận diện archetype; HP / DMG mới là phần có thể scale theo level nếu không có yêu cầu khác

##### Design goal
- Enemy movement phải làm cho mỗi lần player roll movement trở nên có cảm xúc và có ý nghĩa chiến thuật hơn.
- Player phải nhận ra được ít nhất sự khác nhau cơ bản về movement characteristic giữa các enemy để lập chiến thuật.
- Player phải tự đọc được tương quan mạnh / yếu giữa mình và enemy bằng visible info trên màn hình.
- Baseline combat readability hiện hướng tới:
  - Slime chịu tối đa `2` hit của player
  - Wind chịu tối đa `1` hit của player
  - Worm chịu tối đa `3` hit của player
  - Fire chịu tối đa `2` hit của player
- Baseline enemy-to-player pressure hiện hướng tới:
  - Slime, với vai trò enemy chuẩn, cần tối thiểu `5` hit để giết player
  - Fire, với vai trò enemy mạnh nhất theo sát thương, cần tối thiểu `3` hit để giết player
  - DMG range của enemy nên giữ trong band `70% -> 100%` để damage không quá swing
- Day / Night phase phải làm timing combat khác đi đủ rõ để player thấy giá trị của việc đánh vào ban ngày và chuẩn bị cho ban đêm

##### Source of truth
- Config Data
- Content Data
- UI Presentation

##### Current status
- Filled
---

### 6.4 Obstacles

#### Obstacle: Lava
- **Symbol / ID:** `lava`
- **Walkable or blocked:** Chưa mô tả trong version 1.1.0
- **Trigger condition:** bước vào special grid
- **Effect:** damage
- **Affects:** player và enemy
- **Duration:** Chưa mô tả trong version 1.1.0
- **Visual feedback:** Chưa mô tả trong version 1.1.0

#### Obstacle: Swamp
- **Symbol / ID:** `swamp`
- **Walkable or blocked:** Chưa mô tả trong version 1.1.0
- **Trigger condition:** bước vào special grid
- **Effect:** damage hoặc trap behavior
- **Affects:** player và enemy
- **Duration:** Chưa mô tả trong version 1.1.0
- **Visual feedback:** Chưa mô tả trong version 1.1.0

#### Obstacle: Canon
- **Symbol / ID:** `canon`
- **Walkable or blocked:** Chưa mô tả trong version 1.1.0
- **Trigger condition:** bước vào special grid
- **Effect:** teleport behavior
- **Affects:** player và enemy
- **Duration:** Chưa mô tả trong version 1.1.0
- **Visual feedback:** Chưa mô tả trong version 1.1.0

##### Current behavior
Cả player và enemy đều có thể bị ảnh hưởng bởi special grids.
Current special tile schema ở mức tối giản là:
- `type`
- `x`
- `y`

##### Editable parameters
- damage
- trap rule
- teleport rule
- trigger timing

##### Protected invariants
- Special grids phải giữ tách biệt với movement core rule

##### Design goal
- Tạo biến số vị trí và tăng lựa chọn / rủi ro trên board.

##### Source of truth
- Gameplay Logic
- Content Data
- UI Presentation

##### Edge cases
- Chưa mô tả trong version 1.1.0

##### Current status
- Partial

---

### 6.5 Items / skills / characters

#### Item / Skill / Character: Mystery power cell `?`
- **Type:** Reward cell / bag-opportunity source
- **Source:** Được đặt theo từng wave trong quá trình thiết kế màn chơi
- **Effect:** mở `Battlefield Bag` popup thay vì cho stat reward trực tiếp
- **Duration:** popup resolve ngay khi player collect; item effect sau đó tùy theo item player chọn vào bag
- **Stack rule:** Mystery cell là source cell trên board; player có thể nhận nhiều mystery cell khác nhau trong cùng level
- **Ownership:** Chỉ player nhận mystery reward flow
- **Carry-over across waves:** Mystery cell **chưa ăn** vẫn tồn tại khi wave mới bắt đầu
- **UI feedback:** on-cell reward feedback + mở bag popup; không còn HP/DMG fly-to-HUD kiểu stat pickup cũ

##### Current behavior
- Player collect mystery cell:
  - mở reward popup ngay
  - popup dùng cùng chuẩn `Battlefield Bag` như enemy death
  - hiển thị đúng `3` item choices
  - player có thể `pick`, `reroll` nếu level hiện tại còn lượt reroll, hoặc `skip`
- Current prototype dùng mystery power cell như vector mở thêm build opportunity trong màn chơi
- Mystery cell schema ở mức current v3: `id`, `x`, `y`
- Mystery cell **chưa ăn** được giữ lại khi wave mới bắt đầu
- Mystery-specific stat pool cũ (`+1 HP / +1 min DMG / +1 max DMG`) không còn là current rule của v2

##### Editable parameters
- mystery placement
- animation
- popup timing
- battlefield bag power item list / per-item odds
- reroll count per level
- skip availability
- per-wave placement

##### Protected invariants
- Mystery power cell vẫn là one-cell interaction dành cho player trừ khi có yêu cầu đổi
- Mystery cell **chưa ăn** phải tồn tại qua wave mới trong cùng level
- Mystery không còn cho stat reward trực tiếp trong current prototype v2

##### Design goal
- Tạo một reward source nhìn thấy được trên board để player cân nhắc route và tempo.
- Giữ mystery đủ bất ngờ, nhưng dùng cùng ngôn ngữ reward với enemy death để UI/readability nhất quán hơn.
- Tránh việc mystery trở thành một hệ stat riêng gây chồng chéo với bag system.

##### Source of truth
- Config Data
- Content Data
- Gameplay Logic
- UI Presentation

##### Current status
- Filled

#### Item / Skill / Character: Power item from battlefield reward flow
- **Type:** In-run power item / bag item
- **Source:** Spawn qua battlefield reward flow và được xử lý trong battlefield bag UI
- **Reward sources hiện hành:** `enemy death`, `mystery cell`
- **Placement rule:** Không đặt sẵn trên map; item xuất hiện qua UI reward popup
- **Effect:** đến từ power-item pool hiện hành; mỗi item thuộc một family rõ và cộng đúng loại stat được khóa bởi framework
- **Duration:** active xuyên suốt level hiện tại khi item còn nằm trong bag; kết thúc khi player chết / thua
- **Normal item level rule:** `level 1 -> 3`
- **Fusion rule:** `2` items `level 3` đúng recipe có thể fusion thành `1` endpoint item
- **Fusion endpoint rule:** fusion item không có level, không upgrade tiếp, không fusion chồng tiếp trong current framework
- **Cap rule:** bị giới hạn bởi bag slot count hiện hành là `4`
- **Stack rule:** số item active đồng thời bị giới hạn bởi `4` slot; endpoint fusion item chiếm slot như item active
- **Ownership:** Chỉ player dùng
- **UI feedback:** bag popup hiển thị `3` item choices, trạng thái upgrade nếu item đã có, các slot hiện có, trạng thái `fusion ready` nếu đủ recipe, và current reroll availability của level

##### Current behavior
Current v3 khóa exact framework cho power items, including per-endpoint fusion bonuses và các rule runtime còn thiếu để code/playtest full loop.


**Runtime item rules additionally locked in v1.2.6****Runtime item rules additionally locked in v1.2.6**
- Mọi phase-based item effect của player (`Sun Compass`, `Moon Ward`, `Sun Fang`, `Moon Fang`, và fusion bonus phase-based liên quan) active ngay từ đầu phase tương ứng và kéo dài xuyên suốt phase đó
- Các chance-based item stats hiện dùng cap tạm thời `50%` trong current prototype pass: `Crit Chance`, `Block Chance`, `Double Strike Chance`
- `Lifesteal` là non-chance percentage stat và hồi theo final damage thực sự đã gây ra
- `Double Strike Chance` là chance-on-hit, không chain, và nếu proc thì chỉ tạo tối đa `1` extra hit; extra hit vẫn có thể crit theo `Crit Chance` hiện có
- Khi đủ recipe, bag chỉ chuyển item sang trạng thái `fusion ready`; player chủ động bấm fusion trong bag để hoàn tất endpoint item

**A. Out-of-run baseline**
- `Equipment` chỉ tăng:
  - `+Max HP`
  - `+dmgMin`
  - `+dmgMax`

**B. Utility / tactic base item pool (`5`)**

| Item | Family | Stat chính | Lv1 | Lv2 | Lv3 | Role shorthand |
|---|---|---|---:|---:|---:|---|
| Pathfinder Token | Mobility | `+maxRoll` | +1 | +2 | +3 | reach / route mở rộng |
| Step Anchor | Control | `+minRoll` | +1 | +2 | +3 | route ổn định hơn mà không giết cảm giác roll |
| Field Kit | Sustain Utility | `+Heal Efficiency` | +10 HP | +20 HP | +30 HP | heal reward đáng giá hơn |
| Sun Compass | Day Mobility | `+Day Mobility` | Day: +1 `maxRoll` | +2 | +3 | greed / setup tốt hơn vào Day |
| Moon Ward | Night Guard | `+Night Guard` | Night: giảm 10% damage nhận vào | 20% | 30% | phòng thủ / giữ vị trí tốt hơn vào Night |

**C. Combat base item pool (`10`)**

| Item | Family | Stat chính | Lv1 | Lv2 | Lv3 | Role shorthand |
|---|---|---|---:|---:|---:|---|
| Guard Crest | Guard | `+Max HP` | +20 HP | +30 HP | +40 HP | survivability nền |
| Stable Edge | Stability | `+dmgMin` | +10 | +20 | +30 | damage ổn định |
| Power Edge | Burst | `+dmgMax` | +10 | +20 | +30 | tăng trần damage |
| Keen Eye | Precision | `+Crit Chance` | +8% | +16% | +24% | mở hướng crit |
| Fatal Fang | Execution | `+Crit Damage` | +20% | +40% | +60% | crit nặng hơn |
| Iron Guard | Fortify | `+Block Chance` | +8% | +16% | +24% | rủi ro thua combat thấp hơn |
| Blood Charm | Sustain Combat | `+Lifesteal` | +6% | +12% | +18% | đánh để hồi |
| Twin Sigil | Tempo Burst | `+Double Strike Chance` | +6% | +12% | +18% | chance-on-hit để đánh thêm `1` hit; extra hit vẫn có thể crit theo `Crit Chance` hiện có nhưng không được chain tiếp |
| Sun Fang | Day Combat | `+Day Power` | Day: +10 `dmgMin` & +10 `dmgMax` | +20 / +20 | +30 / +30 | tận dụng Day để đánh chủ động |
| Moon Fang | Night Combat | `+Night Power` | Night: +10 `dmgMin` & +10 `dmgMax` | +20 / +20 | +30 / +30 | giữ sức đánh khi buộc phải combat trong Night |

**D. Damage Guard resolution for bag items**
- Mọi item hoặc phase bonus chạm `dmgMin / dmgMax` phải đi qua cùng triết lý guard như current player damage rules
- Nếu tăng `dmgMax` làm vượt width cap hiện tại thì phần vượt phải được dồn sang `dmgMin`
- Nếu tăng `dmgMin` làm vượt `dmgMax` thì phần vượt phải được dồn sang `dmgMax`
- Mục tiêu là giữ cho mỗi upgrade làm đổi stat line thấy được ngay, nhưng không phá readability của current damage band / width constraints

**E. Fusion bonus rule**
- Fusion item giữ full effect của `2` normal items `Lv3` dùng trong recipe
- Fusion item cộng thêm `1` bonus synergy nhỏ đúng dominant combat role của endpoint đó
- Bonus synergy phải nhỏ hơn tổng power gain của cả một normal item `Lv3`, để fusion vẫn là spike lớn nhưng không làm normal-item curve trở nên vô nghĩa
- Fusion bonus hiện đã được khóa thành **exact numeric values per endpoint** cho pass đầu tiên

**F. Utility / tactic fusion-end synergies (`5`)**

| Fusion item | Recipe | Family package | Dominant role | Stat package | Locked fusion bonus |
|---|---|---|---|---|---|
| Route Master | Pathfinder Token Lv3 + Step Anchor Lv3 | Mobility + Control | route consistency | `maxRoll + minRoll` | `+1 maxRoll` |
| Field Marshal | Step Anchor Lv3 + Field Kit Lv3 | Control + Sustain Utility | safe sustain planning | `minRoll + Heal Efficiency` | `+10 Heal Efficiency` |
| Scavenger Sprint | Pathfinder Token Lv3 + Field Kit Lv3 | Mobility + Sustain Utility | pickup routing | `maxRoll + Heal Efficiency` | `+1 maxRoll` |
| Sunrunner | Pathfinder Token Lv3 + Sun Compass Lv3 | Mobility + Day Mobility | day greed / day setup | `maxRoll + Day Mobility` | `Day: +1 maxRoll` |
| Night Shelter | Step Anchor Lv3 + Moon Ward Lv3 | Control + Night Guard | night-safe reposition | `minRoll + Night Guard` | `Night: +10% damage reduction` |

**G. Combat fusion-end synergies (`10`)**

| Fusion item | Recipe | Family package | Dominant role | Stat package | Locked fusion bonus |
|---|---|---|---|---|---|
| Bulwark Line | Guard Crest Lv3 + Stable Edge Lv3 | Guard + Stability | safe bruiser | `Max HP + dmgMin` | `+20 Max HP` |
| Siege Heart | Guard Crest Lv3 + Power Edge Lv3 | Guard + Burst | tanky finisher | `Max HP + dmgMax` | `+10 dmgMax` |
| Hunter Guard | Guard Crest Lv3 + Keen Eye Lv3 | Guard + Precision | reliable duelist | `Max HP + Crit Chance` | `+8% Crit Chance` |
| Last Stand | Guard Crest Lv3 + Fatal Fang Lv3 | Guard + Execution | comeback bruiser | `Max HP + Crit Damage` | `+20% Crit Damage` |
| Iron Rhythm | Stable Edge Lv3 + Iron Guard Lv3 | Stability + Fortify | low-risk attrition | `dmgMin + Block Chance` | `+8% Block Chance` |
| Sustain Rhythm | Stable Edge Lv3 + Blood Charm Lv3 | Stability + Sustain Combat | drain fighter | `dmgMin + Lifesteal` | `+6% Lifesteal` |
| Critical Burst | Power Edge Lv3 + Fatal Fang Lv3 | Burst + Execution | explosive closer | `dmgMax + Crit Damage` | `+10 dmgMax` |
| Twin Reaper | Twin Sigil Lv3 + Power Edge Lv3 | Tempo Burst + Burst | double-hit finisher | `Double Strike Chance + dmgMax` | `+6% Double Strike Chance` |
| Death Mark | Keen Eye Lv3 + Fatal Fang Lv3 | Precision + Execution | crit assassin | `Crit Chance + Crit Damage` | `+8% Crit Chance` |
| Sunbreaker | Sun Fang Lv3 + Keen Eye Lv3 | Day Combat + Precision | day-phase kill window | `Day Power + Crit Chance` | `Day: +8% Crit Chance` |

**H. Current endpoint count**
- `5` utility / tactic endpoint synergies
- `10` combat endpoint synergies
- total `15` endpoint synergies

**I. Current framework interpretation**
- Fusion item = `1 completed family package that expresses 1 dominant combat role`
- The framework is designed so the player can reach a target build for the final stretch of the level, and if that build fails, choose a different synergy direction on the next attempt.
- Every normal-item upgrade must create a felt power gain immediately; `Lv3` may not be a no-gain step.

##### Editable parameters
- future tuning of the locked numeric values after enemy level-scaling is authored
- future tuning of the locked offer-weight table after playtest
- future special cross-domain fusion recipes
- visual identity / iconography
- future endpoint expansion beyond the first `15`

##### Protected invariants
- Current v1.2.3 item list is the locked reference pool for the first bag framework pass
- Every normal-item upgrade from `Lv1 -> Lv2 -> Lv3` must change at least one visible or felt power output immediately; no normal item may use a no-gain `Lv3` just to gate fusion
- Normal items must use `level 1 -> 3`
- Fusion endpoint items must have no level and no further upgrade path
- Day / Night-aware items must stay part of the first official pool because Day / Night is a locked core mechanic of the level flow

##### Design goal
- Dùng một pool item nhỏ nhưng đủ ngôn ngữ build để player hiểu nhanh mình đang đi hướng gì.
- Buộc player đổi tactic theo Day / Night thay vì chỉ cộng raw combat stats.
- Tạo cảm giác tốt trong combat qua các stat dễ hiểu như crit, block, lifesteal và `Double Strike Chance`.
- Mỗi lần upgrade item thường phải cho cảm giác mạnh lên rõ ràng để player có động lực nâng cấp và đọc được tiến độ build.
- Đảm bảo build endgame có đích rõ: fusion endpoint để đánh stretch cuối của level.

##### Source of truth
- Config Data
- Gameplay Logic
- UI Presentation

##### Current status
- Filled

#### Item / Skill / Character: Heal potion
- **Type:** Board pickup / sustain reward
- **Source:** `30%` chance từ enemy death
- **Placement rule:** spawn ở 1 ô hợp lệ theo hình chữ thập quanh vị trí enemy chết
- **Effect:** hồi máu `+10 HP` cho player, clamp ở max HP
- **Duration:** tức thời khi pickup
- **Cap rule:** heal không vượt max HP
- **Stack rule:** Không áp dụng theo kiểu inventory; pickup là dùng ngay
- **Ownership:** Chỉ player nhận
- **UI feedback:** pickup feedback trên board; exact presentation `TBD`

##### Current behavior
Current GDD draft bổ sung heal potion như reward ngắn hạn từ enemy death. Mỗi enemy có `30%` chance sinh 1 bình máu ở 1 ô hợp lệ cách xác enemy 1 ô theo hình chữ thập. Heal potion hồi `+10 HP`, clamp ở max HP. Player sẽ nhặt ngay khi bước vào ô đó hoặc đi ngang qua ô đó trong lúc move. Case không có ô hợp lệ hiện được ghi nhận là design assumption **không xảy ra** theo logic placement user mô tả.

##### Editable parameters
- heal chance
- heal amount
- pickup feedback
- max HP clamp rule

##### Protected invariants
- Heal potion là on-board pickup dùng ngay
- Pickup phải xảy ra khi step-in hoặc pass-through
- Heal potion không đi vào bag

##### Design goal
- Tạo thêm tuyến phục hồi ngắn hạn để player có thể vượt màn bằng target priority tốt hơn.
- Kết hợp với mystery cell để mở ra nhiều route hợp lý trong cùng một board state.

##### Source of truth
- Config Data
- Content Data
- Gameplay Logic
- UI Presentation

##### Current status
- Partial

#### Item / Skill / Character: Roll range modifier items (integrated into current bag framework)
- **Type:** Utility / tactic power-item families inside battlefield bag
- **Source:** Enemy death bag offers
- **Placement rule:** Qua `3-choice` bag popup
- **Effect:** Hiện đã được khóa vào base item pool qua:
  - `Pathfinder Token` → `+maxRoll`
  - `Step Anchor` → `+minRoll`
  - `Sun Compass` → `+Day Mobility`
  - các fusion-end utility items liên quan
- **Duration:** active khi item còn nằm trong bag trong level hiện tại
- **Cap rule:** bị giới hạn bởi bag slot count và item/fusion rules
- **Stack rule:** theo slot + item level + fusion endpoint rules hiện hành
- **Ownership:** Player
- **UI feedback:** bag popup / slot display / fusion-ready signal

##### Current behavior
Current v1.2.3 không còn để nhóm roll-range modifier items ở trạng thái chỉ là `future direction`. Một phần của hướng này đã được tích hợp trực tiếp vào official bag item framework thông qua utility / tactic item pool và utility fusion-end synergies. Các item này là lớp build dùng để khai thác movement, route choice, Day / Night timing và heal routing mà không đụng vào lớp Equipment ngoài run.

##### Editable parameters
- exact values for `minRoll`, `maxRoll`, `Day Mobility`
- future additional mobility items
- future special cross-domain recipes

##### Protected invariants
- Mobility / movement modifier items phải tiếp tục phục vụ tactical layer, không được làm game trượt thành raw stat race thuần
- Equipment ngoài run vẫn không được dùng để thay thế utility / tactic item layer trong run

##### Design goal
- Đưa growth qua movement vào đúng chỗ: inside-run, tied to tactic, tied to route, tied to phase timing.

##### Source of truth
- Config Data
- Gameplay Logic
- UI Presentation

##### Current status
- Filled
---

### 6.6 Boss design
- **Has boss:** Chưa mô tả trong version 1.1.0
- **Boss stage location:** Chưa mô tả trong current GDD
- **Boss identity:** Chưa mô tả trong current GDD
- **Mechanics:** Chưa mô tả trong version 1.1.0
- **Phase structure:** Chưa mô tả trong version 1.1.0
- **Reward:** Chưa mô tả trong version 1.1.0
- **Difficulty role:** Chưa mô tả trong version 1.1.0

#### Current behavior
- Chưa mô tả trong version 1.1.0

#### Editable parameters
- [Chưa mô tả trong version 1.1.0]

#### Protected invariants
- Không tự thêm boss nếu chưa có yêu cầu rõ

#### Design goal
- Chưa mô tả trong version 1.1.0

#### Source of truth
- Content Data
- Config Data
- Gameplay Logic
- UI Presentation

#### Current status
- Missing

---

## 7. UI / UX Structure
**Section source of truth:** UI Presentation + State Flow

### 7.1 Screen list
- Home
- Modes
- Modes / Rune Trial Stage Select
- Home / Gold Tech Tree [UI form Locked for current v1 layout]
- Gameplay
- Combat
- Result flow for Win / Lose + run result table
- Upgrade / Power-up Selection [UI form vẫn Partial nhưng timing và readability rule đã khóa trong v2]

### 7.2 HUD structure
- **Top HUD (main mode):**
  - HP
  - DMG
  - Move range
  - Player power value để so trực tiếp với enemy (current playtest direction: `player.hp.current + player.dmg.max`)
  - Day / Night phase label + round progress cue
  - bag target at the top-right for collected `Gold` and dropped `Equipment` feedback
- **Top HUD (Rune Trial):**
  - HP
  - DMG
  - Move range
  - Player power value để so trực tiếp với enemy
  - no Day / Night phase label
  - no bag / fusion HUD layer
- **Context panel:** Không có panel thông tin tách riêng cho gameplay drag preview; với Gold Tech Tree cũng không có tooltip / side panel / bottom sheet riêng ở current v1 layout
- **Action buttons:** Roll, Skip Turn, Threat Preview Toggle
- **Modal / popup:**
  - enemy intro popup (phục vụ việc giới thiệu movement characteristic lần đầu gặp)
  - enemy tooltip nhỏ trên đầu enemy khi player `tap` vào enemy ở `BeforeRoll`
  - reward feedback
  - run result table inside the current Win / Lose result flow
  - battlefield bag popup khi `enemy chết` hoặc `player bước vào mystery cell` trong main mode
  - full-bag replace state bên trong battlefield bag flow: player đã chọn item mới thì `tap` một item cũ để thay ngay, hoặc `skip`
  - Day / Night phase warning, đặc biệt khi vào Night phải báo rõ `Enemy speed x2 / atk x2` trong main mode
  - power-up selection sau `WinText`
  - `Rune Trial` stage-select UI with stage number / reward / clear status / sweep button

### 7.3 UI state rules
- **Runtime states currently present in build:** `BeforeRoll`, `ReachablePreview`, `Moving`, `Combat`, `EnemyTurn`, `WinText`, `LoseText`
- **BeforeRoll:** Player có thể quan sát board, đọc visible power / enemy info, và `tap` vào enemy để bật / tắt tooltip nhỏ trên đầu enemy đó; tooltip hiện `archetype name`, `level`, `HP`, `DMG min-max`, `moveSpeed min-max`
- **AfterRoll:** player drag path preview rồi release để commit
- **Wave preview in main mode:** dùng current preview rules của main mode (`X` đỏ / `X` xanh)
- **Wave preview in Rune Trial:** only red `X` preview for incoming `Wave 2`; no green `X` because the mode has no mystery; visual treatment reuses the current main-mode red `X` language
- **Modes / Rune Trial card:** phải hiển thị `remaining rewarded wins` và `highest cleared stage`
- **Rune Trial stage select:** phải hiển thị `stage number`, `reward`, `clear status`, và `sweep button`; không hiện `recommended power`
### 7.4 Current behavior
- Top HUD hiển thị HP, DMG, Move range, và player power value để so trực tiếp với enemy
- Enemy hiển thị on-body power value trên map (current formula: `enemy.hp.current + enemy.dmg.max`)
- Current baseline playtest table để player đọc mạnh / yếu là: Player `HP 180`, `DMG 20-40`, power `220`; Slime `80`; Wind `50`; Worm `110`; Fire `100`
- Current balance direction: player DMG range width cap theo Slime HP reference và player DMG band `50% -> 100%` phải được communicate đủ rõ để không làm player đọc sai threat
- Enemy damage tuning direction (`enemy chuẩn >= 5` hit để giết player; `enemy mạnh nhất theo sát thương >= 3` hit để giết player; enemy DMG band `70% -> 100%`) phải không bị UI diễn đạt sai
- Nếu power number chưa truyền đạt đủ độ nguy hiểm thực tế của enemy, UI hoặc intro popup cần có cue phụ để tránh player đọc sai kèo
- Sau khi roll, gameplay UI phải hỗ trợ drag `path preview` trực tiếp trên grid từ đúng ô hiện tại của character; preview phải cho player thấy route đang kéo và interaction sắp xảy ra trên đường đi
- Trong lúc drag, character phải đứng yên ở ô hiện tại; UI không được trình bày như đang kéo sprite character theo ngón tay
- Sau khi clear một wave chưa phải wave cuối trong main mode, gameplay UI phải đánh dấu các ô spawn của wave kế tiếp theo current approved preview rules
- Gameplay UI phải hiển thị phase label và phase warning rõ cho Day / Night trong main mode; vào Night phải báo thẳng cho player rằng enemy `speed x2 / atk x2`
- Current v3 dùng bag popup ngoài battle cho cả `enemy death` và `mystery cell` trong main mode
- Current Gold Tech Tree screen được vào từ dedicated button ở `Home`
- Tree layout hiện hành là vertical bottom-up
- Mỗi node card phải tự hiển thị trực tiếp `icon / name / level / cost / main effect`
- `Rune Trial` hiện được vào từ `Modes`
- Card của `Rune Trial` phải hiển thị `remaining rewarded wins` và `highest cleared stage`
- Rune Trial stage-select phải hiển thị `stage number`, `reward`, `clear status`, và `sweep button`
- Rune Trial không hiển thị `recommended power`
- Sau khi player đã dùng hết `2` rewarded wins trong ngày, nếu thử vào lại `Rune Trial` từ `Modes` thì UI phải hiện một toast ngắn báo không còn rewarded win cho hôm đó
- Trong Rune Trial battle không có Day / Night cue, không có bag HUD, và không có mystery-related UI
### 7.5 Editable parameters
- text
- layout
- reward animation timing
- run result table layout / wording
- HUD readability
- drag path preview styling
- bag popup layout / replace presentation
- preview interaction clarity
- popup behavior
- wave warning marker style / timing
- power display formula
- secondary danger cue / warning cue
- End Turn visibility
- player DMG width cap presentation / supporting cue
- player DMG band presentation / supporting cue
- reroll visibility / wording
- skip visibility / wording
- heal icon / silhouette styling

### 7.6 Protected invariants
- UI không được tự đổi gameplay logic
- HUD phải giữ readable trong mobile layout nếu không có yêu cầu đổi
- Bag popup không được che mất việc player đọc item state / recipe relation / slot impact
- Heal potion phải luôn có board-readable representation
- Result flow phải luôn hiển thị summary rõ của run trước khi chuyển state tiếp theo

### 7.7 Design goal
- UI phải rõ, gọn, readable trên mobile và không làm chậm nhịp ra quyết định.
- Power readout phải giúp player tự đánh giá mạnh / yếu, nhưng không được gây hiểu nhầm về mức nguy hiểm thực tế của enemy.
- Drag path preview phải giúp player kiểm soát chính xác route và đọc trước tactical consequence của đường đi mình đang chọn.
- Warning marker của wave kế tiếp phải giúp player chuẩn bị trước, tăng fairness và tactical prep, nhưng vẫn giữ một phần tension vì không lộ exact enemy info.
- Battlefield bag popup phải giúp player hiểu rõ item mới, slot hiện có, state hiện tại và tác động của choice đủ nhanh để không làm đứt nhịp chiến thuật quá lâu.
- Mystery và enemy death phải dùng một ngôn ngữ reward nhất quán để player đọc hệ nhanh hơn.
- Day / Night cue phải giúp player đọc đúng timing window: ban ngày là lúc đánh chủ động có lợi hơn, ban đêm là lúc enemy pressure tăng mạnh.
- Heal route phải nhìn thấy được như một tactical option thật, không chỉ tồn tại trong logic.

### 7.8 Source of truth
- UI Presentation
- State Flow

### 7.9 Current status
- Filled

---


### 7.11 Equipment UI Flow
- **Status:** Approved main UI source of truth
- **Design goal:** Equipment interaction must read fast, stay in one screen, keep friction low, and make item identity, equipped state, tier progression, slot-upgrade value, and merge requirements readable directly from the same Equipment / Blacksmith flow

#### 7.11.1 Entry
- `Home` contains a dedicated `Equipment` button
- Tapping `Equipment` opens a dedicated `Equipment` screen
- The screen has a dedicated `Back` button at the top-left

#### 7.11.2 Equipment UI base layout
- The top area shows `4` equipped slots for in-run equipment:
  - `Weapon`
  - `Auxiliary Equipment`
  - `Helmet`
  - `Armor`
- Equipped-slot presentation is arranged as:
  - `2` slots on the left side
  - character display at the center
  - `2` slots on the right side
- The lower area shows the owned-equipment list
- On the main Equipment screen, equipment pieces that are currently equipped in the top area do not appear again in this lower owned-equipment list
- The owned-equipment list uses square equipment icons in a `5`-column grid
- The bottom area contains a dedicated `Blacksmith` button for merge-tier actions

#### 7.11.3 Item-info popup flow
- Tapping an equipment icon opens an item-info popup
- The item-info popup must stay inside the same Equipment UI flow; it is not a separate full-screen branch
- The first information block in the popup shows the current slot stats for that equipment slot
- This slot-stat block must read before the equipment's tier progression lines
- The popup must show the equipment's tier progression lines
- Tier lines that are not yet unlocked still remain visible, but stay dimmed until the correct tier is reached
- Tapping an unequipped item shows:
  - `Equip` if the corresponding slot is currently empty
  - `Swap` if the player is already using another equipment piece of that same slot type
- Tapping a currently equipped item shows:
  - `Unequip`
  - `Upgrade`
- Gold cost for `Upgrade` is shown directly above the `Upgrade` button

#### 7.11.4 Upgrade flow
- `Equipment Upgrade` remains a **slot-upgrade** flow, not an item-upgrade flow
- Slot-upgrade stats already exist at `Lv1` as the baseline of that slot
- `Upgrade` is shown only when the tapped equipment is currently equipped
- Tapping `Upgrade` upgrades the corresponding slot immediately and spends gold immediately
- Tapping `Upgrade` does **not** open an additional popup
- Slot stats apply to the character only while a corresponding equipment piece is currently equipped in that slot
- If that slot is unequipped, the slot stats from that slot do not apply to the character
- After the slot is upgraded, any equipment piece later equipped into that same slot still receives the upgraded slot base stats

#### 7.11.5 Blacksmith merge flow
- Tapping `Blacksmith` opens a dedicated `Blacksmith` popup
- The `Blacksmith` popup has a dedicated `X` close button at the top-right
- The popup has `2` main parts:
  - **Top area**
    - `1` root slot for the equipment that will be tier-upgraded
    - the root slot uses a square icon-sized presentation that matches equipment icon language
    - recipe-driven material slots shown according to the root equipment's current tier step
    - each material slot must show a small text line explaining what type of equipment can be inserted there
  - **Bottom area**
    - owned-equipment list for selection
    - equipped items are prioritized to the top of this list
    - the list uses the same square-icon `5`-column grid as the main Equipment screen
    - icon size and spacing match the main Equipment screen
- Root equipment is selected from the full owned-equipment list, not only from currently equipped slots
- Tapping an owned equipment item once auto-fills the **first valid material slot**
- Tapping an already-filled material item once removes it from that slot
- A dedicated `Merge` button sits directly below the material-slot area
- If merge requirements are not met, the `Merge` button still remains visible; tapping it shows a toast / short feedback that explains what is missing
- No separate pre-merge result preview is shown before the player presses `Merge`

#### 7.11.6 Owned-equipment readability rules in Equipment / Blacksmith
- On the main `Equipment` screen, currently equipped pieces do not appear again in the lower owned-equipment list, so that lower list does not need an `E` tag rule
- In `Blacksmith`, the previous equipped-item readability rules remain active:
  - equipped items show a small `E` tag at the bottom-right of the icon
  - equipped items cannot be consumed as merge fodder
  - equipped items that are not valid consumable fodder must show a lock overlay on the icon
  - inventory sorting is `equipped items first`, then same slot type, then higher tier first

#### 7.11.7 Merge success feedback
- On successful merge, the new equipment flies up to the center of the screen first
- After that, it returns into the lower owned-equipment list area
- If the root equipment was equipped before merge, the merged result automatically remains equipped

#### 7.11.8 Locked clarifications
- `Equipment Upgrade` keeps the current ownership model:
  - `Upgrade` = slot ownership
  - `Merge Tier` = equipment-piece ownership
- The deprecated `tap equipped slot -> small slot-upgrade popup` flow is no longer the current UI source of truth
- `Merge` button remains visible even when requirements are missing; tapping it shows a short missing-requirement toast
- No pre-merge result preview is shown before pressing `Merge`

### 7.10 UI Wireframe References
- **Wireframe path rule:** nếu có wireframe cho version hiện tại, file ảnh phải được tham chiếu bằng relative path cùng cấp thư mục với file GDD để Cursor có thể đọc trực tiếp làm visual reference
- **Usage rule:** wireframe chỉ là visual reference cho layout / hierarchy / game-feel; gameplay logic, state flow và UI invariants vẫn phải theo các section text của GDD này

#### Home
- **Has wireframe for this version:** Yes
- **File:** `./ui-wireframe-home-v1.png`

#### Gameplay — BeforeRoll
- **Has wireframe for this version:** Yes
- **File:** `./ui-wireframe-gameplay-before-roll-v1.png`

#### Gameplay — ReachablePreview
- **Has wireframe for this version:** No
- **File:** [Not available in v2]

#### Gameplay — EnemyTurn
- **Has wireframe for this version:** No
- **File:** [Not available in v2]

#### Combat
- **Has wireframe for this version:** Yes
- **File:** `./ui-wireframe-combat-v1.png`

#### WinText
- **Has wireframe for this version:** Yes
- **File:** `./ui-wireframe-win-text-v1.png`

#### LoseText
- **Has wireframe for this version:** Yes
- **File:** `./ui-wireframe-lose-text-v1.png`

#### Enemy Intro Popup
- **Has wireframe for this version:** No
- **File:** [Not available in v2]

#### Mystery Reward Feedback / Mystery Bag Popup
- **Has wireframe for this version:** No
- **File:** [Not available in v2]

#### Power-up Selection
- **Has wireframe for this version:** No
- **File:** [Not available in v2]

#### Other UI in current GDD
- **Has wireframe for this version:** No
- **Covered items:** `Gameplay Threat Readability`, `Gameplay Mobile Fit`, `Heal Potion Readability`, và các UI block khác chưa được wireframe riêng
- **File:** [Not available in v2]

## 8. Technical Architecture for AI Dev
**Section source of truth:** Codebase structure + module ownership

### 8.1 Architecture overview
- Presentation layer
- State / orchestration layer
- Domain / gameplay rules layer
- Data / config layer
- Persistence layer
- Shared types / schema: **Partial**
  - Enemy init schema: `id`, `archetype`, `level`, `hp`, `dmgMin`, `dmgMax`, `moveSpeedMin`, `moveSpeedMax`
  - `badge/power` không lưu trong enemy schema; được tính runtime
  - `position` không lưu trong enemy schema; nằm trong level placement data
  - `introSeen` không lưu trong enemy schema; là save/global flag riêng
  - Enemy placement schema: `enemyId`, `position: { x, y }`
  - `playerStart` schema: `{ x, y }`
  - Mystery cell schema current v3: `id`, `x`, `y`
  - Mystery cell không còn cần `rewardPoolId` trong current v3 vì reward source đã khóa là `Battlefield Bag popup`
  - Special tile schema: `type`, `x`, `y`
  - Level schema blocks hiện hành của v2: `mapSize`, `playerStart`, `enemyPlacements`, `mysteryCells`, `specialTiles`, `objective`
  - Draft direction sau update wave/bag: level content cần thêm layer `waves`; exact serialized schema chưa khóa hoàn toàn
  - Objective schema: `objectiveType`, `targetValue`
  - `introSeen` save/global schema lưu theo archetype
  - Player save schema: `hp`, `dmgMin`, `dmgMax`, `gold`, `permanentUpgrades`, `selectedMap`, `goldTechTree`
  - Economy schema: `totalGold`, `earnedThisRun`, `spentTotal`
  - Gold Tech Tree save schema current v1:
    - container = `diceBoundPlayerData.goldTechTree`
    - fields = `version`, `nodes`
    - node ids use semantic ids
    - each node stores `level`, `purchasedAt`
    - `unlocked` is derived at runtime
  - Runtime enemy schema: `currentHp`, `alive`, `currentPosition`
  - Runtime reward-popup state cần đủ để phân biệt:
    - `rewardSource = enemy_death | mystery_cell`
    - `rerollAvailableThisLevel`
    - `choiceType = new | upgrade | fusion_ready | off_path`
    - `slotImpact`
    - `recipeRelation`
  - Save/resume giữa màn hiện direction là lưu player state + enemy runtime state + tile state
  - Không tách archetype config schema riêng trong current GDD; stats hiện được ghi trực tiếp theo content/level data
  - Mapping source-of-truth chi tiết theo file vẫn cần kiểm tra lại codebase
  - Draft direction sau update wave/bag cũng cần contract cho bag state, reward-popup state và heal potion board pickup; exact serialized contract vẫn Partial

### 8.2 File/module ownership
- **Language:** JavaScript
- **Render:** DOM
- **UI files:** Chưa mô tả trong version 1.1.0
- **Rule files:** Chưa mô tả trong version 1.1.0
- **Data files:**
  - `level-design.js`
  - `repo-maps.js`
  - `maps/*.json`
  - `maps/manifest.json`
  - `powerup-config.js`
  - enemy config file [tên file cần kiểm tra lại]
- **Save files / keys:**
  - `diceBoundPlayerData`
  - `diceBoundTotalGold`
  - `dicebound_enemy_intro_seen_v1`
  - `dicebound_playtest_map`
- **Shared contracts:** Partial
  - UI và gameplay được phép tin rằng enemy init data luôn có: `id`, `archetype`, `level`, `hp`, `dmgMin`, `dmgMax`, `moveSpeedMin`, `moveSpeedMax`
  - Level content được phép tin rằng enemy placement dùng `enemyId` + `position { x, y }`
  - `playerStart` dùng object `{ x, y }`
  - Mystery cell dùng `id`, `x`, `y`
  - Special tile dùng `type`, `x`, `y`
  - Objective dùng `objectiveType`, `targetValue`
  - `badge/power` phải được tính trong game, không đọc từ stored data
  - `position` phải lấy từ level placement data, không đọc từ enemy schema
  - `introSeen` phải đọc từ save/global flag theo archetype, không đọc từ enemy schema
  - Player save/load được phép tin rằng player save object có: `hp`, `dmgMin`, `dmgMax`, `gold`, `permanentUpgrades`, `selectedMap`
  - Runtime reward-popup state, nếu có, phải biết được reward source, reroll availability, choice type, slot impact, và recipe relation
  - Runtime resume giữa màn, nếu dùng, phải có đủ player state + enemy runtime state + tile state
  - Draft direction: level content sẽ cần wave-aware content block; bag state / active bag items / heal potion pickups cần contract riêng nếu feature được implement
- **Folder/module structure:** Chưa khóa; current GDD giữ trạng thái Partial và cần kiểm tra lại codebase

### 8.3 Editable boundaries
#### UI request
- **Allowed:** HUD, reward feedback, popup presentation, layout, animation
- **Forbidden:** combat formula, movement rule, persistence keys
- **Source of truth:**
  - UI Presentation
  - State Flow

#### Data request
- **Allowed:** level content, map JSON, power-up config, enemy archetype data
- **Forbidden:** core combat flow, save schema
- **Source of truth:**
  - Config Data
  - Content Data

#### Mechanic request
- **Allowed:** movement logic, combat logic, reward logic, special tile logic
- **Forbidden:** unrelated UI, persistence keys, unrelated content format
- **Source of truth:**
  - Gameplay Logic
  - State Flow

#### Win/Lose request
- **Allowed:** objective evaluator, defeat/victory trigger, related result presentation
- **Forbidden:** unrelated reward logic, unrelated archetype data
- **Source of truth:**
  - Gameplay Logic
  - UI Presentation

### 8.4 Protected invariants
- Persistence keys không đổi tùy tiện
- Map content pipeline không đổi format nếu không có yêu cầu
- Enemy intro seen key phải được Reset Progress xóa đúng
- Single committed move resolves turn là current runtime behavior
- Enemy placement, playerStart, mystery cell, special tile, objective, player save và runtime enemy schema phải giữ đúng format current GDD nếu chưa có yêu cầu đổi
- Nếu implement layer `waves` / battlefield bag / heal potion, exact serialized schema phải được khóa trước khi đổi content pipeline hiện có
- Reward popup không được để dead-choice / dead-flow trong implementation
- Nếu runtime cần xử lý trường hợp player đứng trên ô telegraph tại thời điểm wave mới spawn, branch xử lý đó phải được viết rõ; AI / Cursor không được tự đoán lặng lẽ outcome ngoài GDD

### 8.5 Design goal
- Tách phần đủ rõ để AI Dev sửa đúng chỗ và không phá phần khác.

### 8.6 Current behavior
Codebase hiện xác nhận:
- dùng JavaScript
- render gameplay bằng DOM
- có data/content pipeline và persistence tương đối rõ
- enemy init schema, level schema blocks, player save schema, economy schema và runtime enemy schema đã được chốt ở mức business/data contract
- source-of-truth mapping chi tiết theo file vẫn chưa khóa và cần kiểm tra lại codebase
- folder/module ownership vẫn chưa đủ chi tiết để khóa chính xác
- trong v2, reward popup cần thêm runtime context cho reward source và reroll availability
- mystery cell không còn dùng mystery-specific stat reward pool trong current rule set

### 8.7 Current status
- Partial

## 9. Acceptance Criteria / Regression Checklist

### 9.1 Gameplay
- Baseline starting movement roll stats phải là `minRoll = 1`, `maxRoll = 3`
- Ở `BeforeRoll`, tap vào enemy phải mở đúng enemy info tooltip và không được tiêu hao roll / commit move
- Roll phải quyết định đúng tổng độ dài path tối đa của lượt
- Player chỉ được drag path hợp lệ qua các ô đi được, với tổng độ dài nằm trong `1 -> rolled value`
- Drag path phải bắt đầu từ đúng ô hiện tại của player, không được dùng ô proxy / nearest reachable tile
- Trong lúc drag, character không được rời ô hiện tại; UI chỉ hiển thị `path preview`
- Player không được drag path đi lại ô đã đi qua trong cùng lượt
- Thả tay phải commit move đúng 1 lần; bước dư bị bỏ
- Interactions phải resolve đúng thứ tự: special tile → combat → mystery reward flow → gold
- Enemy turn phải chạy sequentially
- Enemy enters player cell hoặc player gặp enemy trên dragged path phải trigger combat đúng
- Nếu player thắng combat giữa movement thì tiếp tục di chuyển theo phần path còn lại đã drag
- Enemy chết phải removed from grid
- Player chết phải game over rồi về Home
- Nếu level dùng fixed waves và còn wave chưa spawn trong main mode sau `Wave 1`, board phải preview đúng `X` đỏ cho enemy spawn positions và `X` xanh cho mystery spawn positions của wave kế tiếp theo cửa sổ spawn hợp lệ kế tiếp của `Day` block; preview không được auto-hiện ngay từ lúc vào level theo default
- Dấu preview của main mode chỉ được hiện vị trí, không hiện exact enemy info
- Ô preview không được chặn movement của player hoặc làm spawn bị hủy
- Trong main mode, chỉ ở đầu `Player turn` đầu tiên của mỗi `Day` block, nếu còn wave đã schedule nhưng chưa spawn thì enemy mới và mystery mới phải spawn đúng tại các ô đã preview; `3` `Day` turns còn lại và `2` `Night` turns không spawn queued waves
- Nếu trên board vẫn còn enemy của wave cũ khi wave mới spawn trong main mode thì chúng phải được giữ lại; overlap giữa wave cũ và wave mới là rule hiện hành
- Level không được coi là hoàn thành chỉ vì một wave mới đã spawn; player vẫn phải tiêu diệt hết toàn bộ enemy của tất cả wave đã spawn
- `Rune Trial` phải có đúng `2` wave cho mỗi stage theo current initial structure
- `Rune Trial` objective = defeat all enemies across the stage's `2` waves
- `Rune Trial` fail = player chết
- `Rune Trial` không dùng `Battlefield Bag`, `Fusion`, `Mystery cell`, hoặc `Day / Night`
- `Rune Trial` dùng `Wave 2` red `X` preview rồi spawn ngay khi `Wave 1` bị clear
- `Rune Trial` thắng mới tiêu `1` rewarded win; thua không tiêu
- Sau khi dùng hết `2` rewarded wins trong ngày, player không được vào `Rune Trial` nữa cho đến khi reset lúc `7:00`
- `Rune Trial` sweep được dùng cho bất kỳ stage nào đã clear, bao gồm cả stage cao nhất hiện có; reward phải bằng manual-clear reward
### 9.2 UI
- Top HUD luôn giữ readable trên mobile
- Drag path preview phải hiển thị rõ route đang kéo và interaction sắp xảy ra
- Reward feedback đủ rõ
- Battlefield bag popup phải hiển thị rõ `3` item choices, `4` neutral slots hiện có / slot trống, trạng thái upgrade của item đang có, và trạng thái fusion-ready nếu đủ recipe trong main mode
- UI phải hiển thị rõ level hiện tại của normal item (`1 -> 3`) và phân biệt được fusion endpoint item với normal item
- Mỗi bag choice card phải hiển thị đủ: icon, name, affected stat(s), current value -> next value, family / recipe relation, slot impact, và state tag
- Wave warning của main mode phải hiển thị đúng dấu `X` đỏ và `X` xanh theo current rules
- Enemy intro popup chỉ hiện lần đầu theo seen flag
- Trước khi Roll, tap vào enemy phải mở enemy info tooltip rõ ràng
- Combat screen hiển thị đúng HP và DMG info
- Win / Lose hiển thị dưới dạng text effect đúng lúc
- Sau `WinText`, UI phải vào `result table` trước, rồi mới vào power-up selection trước khi sang level kế tiếp
- Trước khi Roll, player có thể `tap` enemy để mở enemy info tooltip; ngoài interaction đọc info này, không có tương tác gameplay khác
- UI phải hiển thị đúng Day / Night phase label trong main mode
- Khi vào Night trong main mode, UI phải báo rõ `Enemy speed x2 / atk x2`
- Heal potion trên board phải có icon / silhouette đủ nhìn rõ và có spawn / pickup feedback
- UI phải communicate rõ trạng thái reroll `available / used` trong level
- Nếu bag đầy và player đã chọn item mới, UI phải chuyển rõ sang replace state: chọn 1 item cũ để thay ngay hoặc skip; không được cho cảm giác còn quay lại popup `3-choice` ban đầu
- `Modes` screen phải có card `Rune Trial`
- Card `Rune Trial` phải hiển thị `remaining rewarded wins` và `highest cleared stage`
- `Rune Trial` stage-select phải hiển thị `stage number`, `reward`, `clear status`, và `sweep button`
- `Rune Trial` must not show `recommended power`
- `Rune Trial` battle must not show Day / Night phase UI, bag UI, fusion UI, or mystery-related UI
### 9.3 Data
- Level content phải load đúng từ các nguồn được hỗ trợ
- Map preset phải parse được
- Power-up definitions phải đọc đúng từ `powerup-config.js`
- Enemy stats phải load đúng từ file config
- Enemy placement phải parse đúng theo `enemyId + position { x, y }`
- `playerStart` phải parse đúng theo object `{ x, y }`
- Mystery cell phải parse đúng theo `id`, `x`, `y`
- Special tile phải parse đúng theo `type`, `x`, `y`
- Objective phải parse đúng theo `objectiveType`, `targetValue`
- Nếu implement level `waves`, bag state hoặc heal pickup state, chỉ được parse theo approved schema đã khóa; current codebase mapping vẫn đang Partial
- Runtime reward-popup state, nếu được serialize hoặc truyền qua module, phải phân biệt được `rewardSource`, `rerollAvailableThisLevel`, `choiceType`, `slotImpact`, và `recipeRelation`
- `Rune Trial` stage data phải parse đúng tách biệt với main-run level data
- `Rune Trial` stage-select data phải phân biệt được ít nhất:
  - `stageId / stageIndex`
  - `reward`
  - `clear status`
  - `isHighestCleared`
  - `sweepAvailable`
- `Rune Trial` content data không được chứa `Mystery cell` hoặc `Day / Night` dependency nếu mode này chưa khóa lại theo hướng khác
### 9.4 Persistence
- `diceBoundPlayerData` save/load đúng
- `diceBoundTotalGold` save/load đúng
- `dicebound_enemy_intro_seen_v1` phải persist đúng và reset đúng
- `dicebound_playtest_map` chỉ phục vụ playtest flow
- Player save object phải giữ đúng các field cốt lõi hiện có: `hp`, `dmgMin`, `dmgMax`, `gold`, `permanentUpgrades`, `selectedMap`, `goldTechTree`
- `introSeen` phải lưu theo archetype
- Nếu có save/resume giữa màn, phải lưu đủ player state + enemy runtime state + tile state
- In-run battlefield bag state không được persist thành permanent progression nếu chưa có yêu cầu rõ
- Gold Tech Tree save state phải tiếp tục giữ `version`, semantic node ids, và per-node `level + purchasedAt`; `unlocked` vẫn phải được tính runtime
- Persistence layer hiện phải có thêm exact fields sau:
  - `diceBoundPlayerData.runeProgress.runeShardBalance`
  - `diceBoundPlayerData.runeProgress.highestClearedStage`
  - `diceBoundPlayerData.runeProgress.stageClearMap`
  - `diceBoundPlayerData.runeProgress.dailyRewardedWinsUsed`
  - `diceBoundPlayerData.runeProgress.lastDailyResetAt`
### 9.5 Readability / fairness
- Visible power / threat readout phải đủ để player tự so mạnh / yếu, không auto-judge thay player
- Drag path preview không được diễn đạt sai route thực tế hoặc interaction sẽ xảy ra trên đường đi
- Nếu power number chưa phản ánh đủ độ nguy hiểm thực tế do speed variance / damage variance, UI hoặc intro popup phải có cue phụ
- Wave warning phải tăng readability / fairness của chuyển wave nhưng không được tiết lộ exact enemy info đến mức làm mất hẳn cảm giác may / xui
- Trong `1-2` lượt đầu phải có ít nhất `1` route hợp lệ không dẫn ngay đến combat bất lợi rõ ràng, hoặc có route sớm tới reward / mystery power cell
- Roll thấp ở lượt đầu / lượt sớm không được bắt player va chạm combat hoặc trap nặng mà không có lựa chọn né hợp lệ
- Mystery cell trong v2 không còn dùng stat reward pool cũ; nếu code vẫn cho `+1 HP / +1 min DMG / +1 max DMG` từ mystery thì là sai rule
- Battlefield bag popup, mystery reward flow và heal potion spawn không được làm mờ target priority; player vẫn phải đọc được vì sao route / kill order hiện tại có lợi hơn
- Night danger phải được communicate đủ rõ để player không dùng readout ban ngày rồi hiểu sai threat thực tế của Night combat / movement

### 9.6 Regression rules
- Ngoài scope không được thay đổi
- Nếu có impact chéo, phải nêu rõ
- Không phá protected invariants

### 9.7 Source of truth
- Mixed

### 9.8 Current status
- Filled

---
## 10. AI Dev Prompt Contract
Mỗi lần làm việc với AI Dev, output phải có:
1. Change type
2. Section bị ảnh hưởng
3. Source of truth của thay đổi đó
4. File/module được phép sửa
5. File/module không được sửa
6. Invariants phải giữ
7. Risk / dependency
8. Danh sách file đã đổi

### 10.1 Current behavior
Hiện tài liệu đã đủ để phân loại thay đổi thành:
- UI request
- Data request
- Mechanic request
- Win/Lose request
- Khi file/module ownership vẫn còn `Partial`, AI Dev phải inspect codebase trước và trả lại proposed file/module list trước khi bắt đầu implementation

### 10.2 Protected invariants
- Không tự vượt scope
- Không sửa lan sang section khác
- Không đổi source of truth nếu không có yêu cầu rõ

### 10.3 Source of truth
- Design document + module ownership rules

### 10.4 Current status
- Partial

---


### 10.5 Deferred design note — anti-bad-draft valves vs Magic Survival source-backed scope
- This note is intentionally recorded as an **open design issue to revisit later**.
- Purpose of this note:
  - remind future review that some proposed anti-bad-draft valves for DiceBound are **not currently locked as gameplay rules**,
  - distinguish clearly between what is **source-backed from the Magic Survival framework reference** and what is only a **design suggestion for DiceBound**,
  - prevent AI / Cursor from silently assuming these valves already exist in DiceBound without an explicit future lock.

#### Current conclusion
The following three candidate valves have been discussed as possible improvements for DiceBound item-offer logic:
1. `Fusion-near bias`
2. `Soft pity for progress item`
3. explicit split between `survival recovery` and `build recovery`

At the current stage:
- none of the three valves above are locked as active DiceBound rules,
- they must be treated as **future design questions**, not implementation defaults.

#### Reference note against Magic Survival framework
Based on the consolidated Magic Survival framework reference:
- `Fusion-near bias` is **not source-backed** as a confirmed rule from Magic Survival,
- `Soft pity for progress item` is **not source-backed** as a confirmed rule from Magic Survival,
- the separation between `survival recovery` and `build recovery` exists only as a **framework interpretation / equivalent pattern**, not as a formally confirmed named rule in Magic Survival.

#### Implementation rule for now
- Do **not** auto-add these three valves into DiceBound offer logic, weight logic, fusion logic, or anti-bad-draft logic unless a later update locks them explicitly.
- If the user later asks again about anti-bad-draft logic, recovery logic, or offer valves, this note must be surfaced and re-asked instead of silently treating the three valves as already approved.

#### Design goal
- preserve source-backed discipline,
- avoid mixing reverse-engineered inspiration from Magic Survival with locked DiceBound implementation,
- ensure future item-system tuning revisits this issue consciously.


### 10.6 Deferred balance note — enemy damage range `%` rule is not yet formalized
- This note is intentionally recorded as a **deferred balance issue to revisit later**.
- Purpose of this note:
  - remind future review that the current enemy `dmgMin - dmgMax` scaling and range shape do **not yet** follow a separately locked formal `%` rule,
  - prevent AI / Cursor from silently inventing or assuming a new enemy-damage `%` rule without explicit approval,
  - ensure this issue is surfaced again when future discussion touches enemy scaling, damage variance, readability, or fairness.

#### Current conclusion
- Enemy level-scaling is currently locked at the macro level:
  - `HP +10` every enemy level,
  - `DMG +10` every `3` enemy levels,
  - `moveSpeed` remains fixed by archetype.
- However, the **shape of the enemy damage range itself** still does not have a separately approved `%` rule comparable to the player-side guard philosophy.
- Therefore, the current enemy damage range behavior should be treated as **working balance output**, not as a finalized `%`-based invariant.

#### Implementation rule for now
- Do **not** auto-add or auto-assume a new formal `%` rule for enemy damage range.
- Do **not** rewrite enemy `dmgMin / dmgMax` progression to match a hypothetical `%` band unless a later update explicitly locks that rule.
- If future discussion asks about enemy damage variance, enemy damage range readability, or enemy scaling fairness, this deferred issue must be surfaced and re-asked first.

#### Design goal
- preserve balance discipline while enemy scaling is still being finalized,
- avoid backfilling a fake formal rule that has not actually been approved,
- keep future balance review conscious about enemy damage readability and fairness.


## 11. Consolidated Questions for User

### 11.1 Questions by section
#### 2.7 Product Vision & Market Fit
1. Target audience chính của DiceBound là ai ở current product direction?
2. DiceBound muốn khác ở lớp gameplay hook, product positioning, hay cả hai?
3. Return motivation / retention promise ở cấp sản phẩm muốn khóa thêm gì ngoài progression hiện có?
4. Session role in daily life muốn định nghĩa là dạng nào?
5. Monetization philosophy và scalability / live product promise có muốn khóa ngay trong current GDD không, hay giữ ở trạng thái `Not decided`?

#### 2.8 Design Pillars
6. Bộ pillar này muốn khóa chính thức ở dạng `3 pillar` hay `5 pillar`?
7. Có muốn giữ wording tiếng Anh cho pillars hay chuyển sang tiếng Việt?

#### 2.9 Commercial Guardrails
8. Có muốn khóa rõ commercial boundaries cho retention / monetization / fairness / scalability ngay trong current GDD không?

#### 3. Core Gameplay Loop
9. Long-term progression hiện tại có unlock theo mốc nào không, hay chỉ là danh sách upgrades thẳng?
10. Dù flow level complete đã tự sang level kế tiếp, hiện tại power-up selection xuất hiện trước hay sau Win text effect?

#### 4. Gameplay Mechanics
11. `Carry-over after fail` nghĩa là: sau khi thua, có thứ gì vẫn được giữ lại từ run vừa thua không? Ví dụ:
   - gold vừa nhặt trong run
   - stat tăng tạm trong run
   - progress của level
   - không giữ gì cả

#### 5. Systems Design
12. Muốn ghi rõ economy là: **persistence exists, but economy loop not implemented yet** chứ?
13. Với enemy level-scaling đã khóa `HP +10 mỗi level / DMG +10 mỗi 3 level`, có cần thêm bảng override theo chapter / wave không?
14. Upgrade limits / stack rules cho Home upgrades và between-level power-ups muốn khóa thế nào?
15. Bag slot count config mặc định muốn khóa là bao nhiêu, hay tiếp tục giữ ở trạng thái configurable but not specified?
16. Exact power item list / effect definitions / per-item odds của battlefield bag muốn khóa khi nào?

#### 5. Systems Design — Equipment Framework v17
17. Sau current temporary cap `Tier 6`, future breakpoint / tier-expansion path muốn map tiếp theo cadence nào?
18. `Equipment Merge Tier` có ảnh hưởng vào bag reward weighting không, hay chỉ ảnh hưởng stat / package identity?
19. Nếu tree được phép mở `capacity / build bandwidth`, exact bag-slot expansion path muốn là gì?
20. Current working family labels có giữ nguyên `Stability / Burst / Guard / Sustain`, hay muốn đổi wording hiển thị chính thức mà vẫn giữ nguyên direction?

#### 6. Content Structure
23. Tên file config chứa enemy stats là gì?
24. Effect của special tiles xảy ra khi bước vào, khi đứng trên đó, hay cuối turn?
25. Lava gây bao nhiêu damage?
26. Swamp trap behavior cụ thể là gì?
27. Canon teleport theo rule nào?
28. Exact serialized schema / file mapping cho layer `waves`, battlefield bag state và heal pickup state trong codebase hiện tại là gì?

#### 7. UI / UX Structure
29. Power-up selection UI hiện là:
   - modal popup
   - full-screen panel
   - bottom sheet
   - chưa có UI hoàn chỉnh trong current GDD
30. `On win` UI flow hiện tại là gì ngoài text effect?
31. `Upgrade` ở screen list có phải là một screen thật hay chỉ là một step logic chưa có UI riêng?

#### 8. Technical Architecture for AI Dev
32. Tên file/source-of-truth chi tiết của từng schema (enemy stats, level schema, save schema, rule schema) là gì trong codebase hiện tại?


### 11.2 Question rules
- Chỉ hỏi phần còn thiếu hoặc mâu thuẫn
- Không hỏi lại những gì user đã trả lời
- Ưu tiên phần ảnh hưởng implementation trước
- Mỗi câu hỏi chỉ hỏi 1 vấn đề chính
- Nếu cần khóa rule hoặc làm rõ nhanh, đưa **5 lựa chọn A, B, C, D, E** để user chọn nhanh hoặc trả lời khác



### 10.7 Deferred balance note — percentage-effect runtime rules still need formalization after the v7 combat-number rebase
- The v7 combat-number rebase improves numeric granularity for percentage-based combat stats by moving HP / DMG / heal / flat-value item stats to a `x10` scale.
- This rebase is intended to reduce cases where a valid percentage stat feels like `no effect` only because current numbers are too small.
- However, the rebase does **not** by itself formalize the following runtime rules:
  - exact heal rounding policy for `Lifesteal`
  - exact damage-reduction rounding policy for `Moon Ward` / other future percentage reduction effects
  - exact combat formula for `Crit Damage`
  - exact formal `%` formula for enemy `dmgMin` relative to `dmgMax`
- Until these are locked explicitly, AI / Cursor must not silently invent one canonical formula and treat it as already approved source-of-truth.

#### Current design conclusion
- v7 solves much of the **numeric granularity** problem.
- v7 does **not** fully solve the **missing-formula / missing-rounding-rule** problem.
- Future combat-formula discussion must revisit these rules explicitly instead of assuming the number rebase solved them automatically.

#### Design goal
- separate numeric-scale problems from formula-definition problems,
- keep balance review honest,
- prevent hidden implementation assumptions after the v7 combat-number rebase.
