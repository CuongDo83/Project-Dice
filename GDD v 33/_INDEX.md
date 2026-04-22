# DiceBound GDD v33 — Index

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 23 — MIGRATION COMPLETE)
- **Status:** ✅ SHIP-READY. 15 deliverables. v33-initial tag.
- **Language rule:** English for rules/values/schema. Vietnamese for commentary and open questions.

---

## 0. Reading Rule for LLM

### 0.1 Default reading order per session
1. `_INDEX.md` (this file) — ALWAYS first
2. `02_balance_values.md` — ALWAYS paste when task touches numbers
3. Task-specific file(s) per Task Map below
4. `06_verification.md` — paste when task is a balance change

### 0.2 When to paste `_CHANGELOG.md`
Only when the user explicitly asks "what changed" or "history of X". NOT in routine balance/rule tasks. Inline markers in `02_balance_values.md` and `01_rules.md` are the primary source for "when was this last changed".

### 0.3 When to paste archived v31/v32 files
Never. They are archived for human historical reference only. v33 is self-contained and authoritative.

---

## 1. Source of Truth Priority

When there is a conflict:
1. User's latest explicit instruction
2. `_INDEX.md` rules (this file)
3. `02_balance_values.md` for numbers
4. System-specific file (01, 03, 04, 05) for rules and content
5. `06_verification.md` for cross-system invariants
6. Git history — reference only, NOT source of truth

**No delta overlay rule:** Any change must edit the relevant file directly. Delta files are forbidden. Changelog is append-only record, not a content layer.

---

## 2. File Manifest

| File | Purpose | Owner content | Read when |
|---|---|---|---|
| `_INDEX.md` | This file — meta, task map, glossary | Reading rules, ID conventions, glossary | Every session |
| `_CHANGELOG.md` | Append-only version log | Short "what" entries | On explicit history query |
| `00_vision.md` | Product vision, 3-tier strategy (vision/retention/monetization), 5 pillars | Strategy statements, pillar filter | Vision/pillar/feature filter decisions |
| `01_rules.md` | All gameplay/UI/system rules (incl. UI §29-30) | Rules only, no numbers | Rule change, rule lookup |
| `02_balance_values.md` | All numbers (authoritative) | Values with IDs | Any task touching numbers |
| `03_content.md` | Authored content specs | Enemy/bag/tree/merge specs, level enemy manifests | Content task |
| `04_schema.md` | State/save/event schema | Data shapes | Code/telemetry task |
| `05_ui_and_presentation.md` | **Pointer file** — UI rules at `01_rules.md` §29-30; documents scope boundaries (what's not in GDD) | Scope statement only | UI scope question |
| `06_verification.md` | V1-V18 invariant methodology, difficulty formulas | Cross-system check procedures | Balance change |
| `07_open_questions.md` | TBD tracker with interim/deferred/user-decision status | Unresolved decisions | Open question review |

---

## 3. Task Map

When the user requests task X, paste these files into context:

| Task type | Required files | Optional files |
|---|---|---|
| Combat rule change | `_INDEX`, `01_rules`, `02_balance_values` | `06_verification`, `03_content` |
| Enemy archetype change | `_INDEX`, `03_content`, `02_balance_values` | `01_rules`, `06` |
| New enemy archetype | `_INDEX`, `03_content`, `02_balance_values`, `01_rules` | `06` |
| Level enemy count adjustment | `_INDEX`, `03_content`, `02_balance_values` | `06` (check SIRC), `01_rules` (wave rule) |
| Economy tuning | `_INDEX`, `02_balance_values`, `01_rules` (economy section) | `06` (SIRC), `03` (if costs touch content) |
| Progression tuning (tree/equipment/merge/bag) | `_INDEX`, `02_balance_values`, `03_content`, `01_rules` | `06` |
| UI change | `_INDEX`, `05_ui_and_presentation` | `01_rules` (if UI exposes gameplay state) |
| State flow change | `_INDEX`, `01_rules`, `04_schema` | `05` |
| Add telemetry event | `_INDEX`, `04_schema` | `01_rules` (fire trigger) |
| Resolve open question | `_INDEX`, `07_open_questions`, relevant system file | `06`, `_CHANGELOG` |
| History lookup | `_INDEX`, `_CHANGELOG`, relevant file with inline marker | — |

---

## 4. ID Naming Convention

### 4.1 Balance value IDs
Format: `UPPER_SNAKE_CASE`, scope-prefixed.

| Scope prefix | Example |
|---|---|
| `PLAYER_` | `PLAYER_HP_BASELINE`, `PLAYER_DMG_MIN`, `PLAYER_ROLL_MAX` |
| `WIND_`, `SLIME_`, `WORM_`, `FIRE_` | `WIND_HP_LV1`, `SLIME_DMG_MAX_LV1` |
| `BOSS_` | `BOSS_ELITE_WORM_LV3_HP` |
| `EQUIPMENT_` | `EQUIPMENT_LV2_COST`, `EQUIPMENT_WEAPON_LV20_DMG_MAX` |
| `MERGE_` | `MERGE_STABILITY_T5_DMG_MIN` |
| `TREE_` | `TREE_STEADY_HAND_DMG_MIN` |
| `BAG_` | `BAG_GUARD_CREST_LV1_HP_PCT` |
| `GOLD_` | `GOLD_BAND_LOW`, `GOLD_BAND_BOSS` |
| `RUNE_` | `RUNE_TRIAL_STAGE_BASE_REWARD` |
| `IDLE_` | `IDLE_LV10_GOLD_PER_TICK` |
| `HEAL_` | `HEAL_POTION_DROP_PCT`, `HEAL_POTION_MAGNITUDE_PCT` |
| `WAVE_` | `WAVE_DAY_BLOCK_LENGTH`, `WAVE_NIGHT_MULTIPLIER` |
| `CHANCE_CAP_` | `CHANCE_CAP_CRIT`, `CHANCE_CAP_LIFESTEAL` |
| `THRESHOLD_` | `THRESHOLD_SIRC_STRICT`, `THRESHOLD_DAMAGE_GUARD_RATIO` |

### 4.2 Reference syntax
In `01_rules.md`, `03_content.md`, and other files referencing balance values:

```
Player starts with {PLAYER_HP_BASELINE} HP and deals {PLAYER_DMG_MIN}-{PLAYER_DMG_MAX} damage.
```

**Rule:** No numeric literals in files 01, 03, 04, 05 except examples in comments. All numbers live in 02 and are referenced by ID.

### 4.3 Section anchor IDs
Markdown section headers use kebab-case anchors. Inline marker format at end of each rule section in `01_rules.md`:

```
<!-- Locked: v33 | Last changed: v33 | CL: — -->
```

When a rule changes:
```
<!-- Locked: v33 | Last changed: v34 | CL: v34 -->
```

Balance values in `02_balance_values.md` use a `Lock` column in the table, not HTML comments.

---

## 5. Glossary (canonical terms)

Terminology lock — these are the only forms used in v33. Aliases from v31/v32 listed for historical reference.

| Canonical term | Definition | Aliases (deprecated) |
|---|---|---|
| Run | One attempt from level start to win/lose in Main Run mode | — |
| Session | Continuous play period by one player across multiple runs | — |
| Bag item | Item held in Battlefield Bag during a run | Power item (v31) |
| Threat tier | Enemy danger classification: Low, Mid, High, Boss | — |
| UPI | Unified Power Index — aggregate combat power metric per DB_Balance_Framework P6 | — |
| SIRC | Supplemental Income Ratio Check — Idle vs Active gold ratio invariant | — |
| DSSM | Dual-currency Source-Sink Map — Gold vs Rune Shard flow separation | — |
| MMRM | Multi-Mode Role Map — role uniqueness across Main Run / Rune Trial / Idle | — |
| Day-depth | Number of day cycles survived in a run | Day/Night count (informal) |
| Wave | Enemy spawn group within a level; cleared when all enemies in wave die | — |
| Loop (tree) | Completed cycle of Gold Tech Tree nodes | — |
| Tier (merge) | Equipment merge level T1-T6 | — |
| Fresh state | Player baseline without any bag items picked | — |

**Commentary (VI):**
> v31 dùng "power item", v32 part1 dùng lẫn lộn "bag item" và "power item". v33 lock "bag item" là canonical. Mọi file v33 phải dùng từ này. Khi migrate content từ v31/v32, find-replace "power item" → "bag item".
>
> Nếu trong quá trình migration phát hiện v31 dùng "power item" với nghĩa KHÁC "bag item" (ví dụ power item = drop từ enemy, bag item = item đã vào bag), cần tách thành 2 term và bổ sung Glossary. Flag cho user quyết trong Session 2 khi bắt đầu extract.

---

## 6. Change Protocol

### 6.1 For any content change to v33 files
1. Edit the relevant file directly
2. If value change: update `02_balance_values.md` row, bump Lock column to new version
3. If rule change: update `01_rules.md` section, update HTML comment marker
4. Append entry to `_CHANGELOG.md` — short "what" + optional reason
5. Run lint script (when available)
6. Commit with version tag

### 6.2 For conflicts discovered during migration
When merging v31/v32 content into v33 and finding a conflict:
1. Always take the newer value (v32 over v31)
2. Note in `02` row: `Replaced X (v31 value)`
3. Log in `_CHANGELOG.md` under v33 migration entry
4. If conflict is between v32 part1 and part2, escalate to user decision

### 6.3 Forbidden
- Writing "v33.1 delta file" or similar — ALL edits direct
- Copying values from `02` into `01` or `03` as literal — must use `{ID}` reference
- Duplicating the same fact in multiple files (enforced by lint when available; best-effort before lint exists)
- Leaving `<!-- Locked: ... -->` markers stale after edits

---

## 7. Lint Rules (for future script)

A lint script (not yet written) must check:
1. Every `{ID}` reference in files 01/03/04/05 exists in `02_balance_values.md`
2. Every row in `02` has unique ID
3. No numeric literal in files 01/03/04/05 outside commented examples
4. Every section in `01_rules.md` has HTML comment marker
5. Every entry in `_CHANGELOG.md` has version header + date
6. Every open question in `07` has owner + resolve-by fields

---

## 8. Migration Notes

v33 was created 2026-04-XX by merging:
- `dicebound_gdd_v31.md` (275KB) — base mechanics
- `dicebound_gdd_v32_part1.md` — balance rebalance + level 1-8 enemy manifests
- `dicebound_gdd_v32_part2.md` — economy, progression, verification
- `GDD_v32_handoff_VI.md` — session state, cascade log, re-derivation requirements
- Relevant sections from `Claude_dicebound-vision-pillars.md`, DB_Balance_Framework parts, DB_Tuning_Proposals

All source files archived in `_archive/` after v33 validation. v33 is self-contained — do not reference archived files for active work.

### 8.1 Scope decisions locked before migration (per user)
- **Option B** — merge + cleanup, no redesign of placeholders
- **Concern-based file structure** — rules, values, content, schema separated
- **Level content:** only enemy count + type per level (for simulation). No wave composition, no mystery placement, no spawn timing in v33. Level layout designed later, must satisfy balance information requirements.
- **Language:** English for rules/values/schema; Vietnamese for commentary and open questions
- **ID format:** `UPPER_SNAKE_CASE`
- **Reference syntax:** `{PLAYER_HP_BASELINE}` curly braces
- **Version scheme:** sequential `v33`, `v34`, `v35`... User decides when to bump

---

## 9. Open Decisions Logged for Migration

**Commentary (VI):** Những quyết định còn chờ user hoặc playtest, sẽ ghi vào `07_open_questions.md` sau Session 16. Tham chiếu nhanh cho migration:

- Level content detail: per Q3 decision, v33 lưu enemy count + type cho simulation, không lưu wave composition cụ thể. Wave layout thiết kế sau.
- Boss detail design: deferred per v32 §10.10.
- Tree Loop 2-3 scaling, Monetization model, UI wireframe full set, Audio direction: deferred.
- Coupling re-derivation (Weapon/Aux/Helm/Armor per-level rates, Tree combat lane values) after Player DMG 20-40 → 10-15 change: MUST re-derive via UPI ratio during v33 migration if not already locked in v32. Flag in cascade log.

Full list populated in `07_open_questions.md` after Session 16.
