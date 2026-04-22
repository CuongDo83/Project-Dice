# DiceBound Vision — v33

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 18 — migrated from `Claude_dicebound-vision-pillars.md` with v33 updates)
- **Based on:** v31/v32 mechanics + v33 migration clarifications + original vision statement (09/04/2026)
- **Status:** ✅ Locked. 3-tier strategy structure (Vision / Retention / Monetization) + 5 pillars.
- **Authoritative for:** Product vision statement, retention strategy cơ chế, monetization boundaries, design pillars.
- **NOT authoritative for:** Rules (see `01_rules.md`), values (see `02_balance_values.md`), content (see `03_content.md`).

---

## Reading rules

1. This file is the highest-level design document — it answers "what is DiceBound" and "why play it" before any rule detail.
2. Pillars are the feature filter: any proposed feature must strengthen at least one pillar without weakening others.
3. Monetization boundaries are hard limits — not tuning parameters.
4. When vision-level decisions are needed (scope cuts, feature priority, commercial tradeoffs), this file is the reference.

---

## Section map

| § | Topic | Audience |
|---|---|---|
| 1 | Product Vision statement | All stakeholders |
| 2 | Retention strategy (short-loop + long-loop) | GD, PM, data |
| 3 | Monetization philosophy + boundaries | Business, GD, PM |
| 4 | 5 Design Pillars | All — feature filter |
| 5 | Checklist — v33 canonical state | Historical reference |

---

## 1. Product Vision

### English (~70 words)

> DiceBound is a tactical game where a dice roll turns every turn into a routing puzzle on a board you can fully read. You see the threats, you see the rewards — but you never fully control what comes next. You draw your path, commit, and the outcome surprises you just enough to make every decision feel alive. Every run — win or lose — moves you forward.

### Tiếng Việt

> DiceBound là game chiến thuật nơi mỗi lần tung xúc xắc biến mỗi lượt thành một bài toán chọn đường trên board mà bạn đọc được hoàn toàn. Bạn thấy mối nguy, bạn thấy phần thưởng — nhưng bạn không bao giờ kiểm soát hoàn toàn điều gì xảy ra tiếp. Bạn vẽ đường đi, commit, và kết quả bất ngờ vừa đủ để mỗi quyết định đều sống động. Mỗi run — thắng hay thua — đều đưa bạn tiến lên.

### Vision component analysis

| Phrase | What it serves | v33 mechanism |
|---|---|---|
| *"tactical game where a dice roll turns every turn into a routing puzzle"* | Game genre + core mechanic | `01_rules.md` §4 dice roll + §5 path drag |
| *"on a board you can fully read"* | Differentiation — readable, no hidden info | §29-30 HUD + readout rules |
| *"you never fully control what comes next"* | Emotional hook — luck + surprise | §4 dice variance, §12 heal 30%, §16.4 wave preview |
| *"you draw your path, commit"* | Core action — unique mechanic identity | §5 drag path preview → release to commit |
| *"outcome surprises you just enough to make every decision feel alive"* | Emotional promise — why play | §6 mid-path priority (unexpected combat/mystery), §14 Day/Night timing shift |
| *"every run — win or lose — moves you forward"* | Progress promise — why not quit | §15.3 gold/equipment persist on lose; `03_content.md` §6 Gold Tech Tree permanent progression |

**Word budget:** Troy Dunniway guidance = <50 words preferred. Current 70-word version chosen for Vietnamese translation parity; short version below.

**Short version (~30 words):**
> DiceBound makes every turn a routing puzzle — fully readable board, but unpredictable outcomes. Draw your path, commit, and every run moves you forward whether you win or lose.

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 2. Retention Strategy

### 2.1 Short-loop (within session / per run)

Luck and bad luck create sharp emotional peaks — a heal potion arriving just in time, a brutal Night combat, a perfectly-timed mystery — moments vivid enough that the player remembers them after putting the phone down, and comes back chasing the next one.

**Supporting mechanisms (v33):**

| Mechanism | Emotional role |
|---|---|
| Dice roll (`{PLAYER_ROLL_MIN}`-`{PLAYER_ROLL_MAX}`) | Hope / regret — "if only I rolled one more" |
| Heal potion `{HEAL_POTION_DROP_PCT}%` | Unexpected save or regret when it doesn't drop |
| Bag offer (3 random + 1 reroll + skip) | Excitement on right item / frustration on wrong timing |
| Mystery cell (position known, reward unknown) | Tension — "should I detour for it?" |
| Wave telegraph (position known, enemy unknown) | Anticipation + surprise at new enemy types |
| Day/Night cycle (enemies ×`{NIGHT_DMG_MULTIPLIER}` DMG at Night) | Timing pressure — "can I finish before Night?" |
| In-run bag build (Lv1→Lv3 → fusion) | Satisfaction when synergy clicks / frustration missing one piece |

**Retention intent:** What makes the player **remember the game** and **want to return** — not because the game forces them to, but because the emotional peaks from luck/bad luck create a "personal story" each run.

### 2.2 Long-loop (across runs / across days)

Permanent progression compounds across every run, winning or losing. New content (level design, enemy behavior, tactical puzzle) gives the player reason to go deeper, where familiar mechanics meet new challenges.

**Supporting mechanisms (v33):**

| Mechanism | Retention role |
|---|---|
| Gold/equipment persist on Win AND Lose | Player never leaves empty-handed |
| Gold Tech Tree (6 nodes, 3 tiers each, ~315 RS per loop, multi-loop compound) | Permanent power floor — account growth visible |
| Equipment Upgrade (4 slots × Lv1-20) | Slot-specific investment accumulates across runs |
| Equipment Merge (4 families × 6 tiers, piece-based) | Build identity selection, commitment depth |
| Rune Trial (20 handmade stages, daily 2 wins) | Daily return hook — distinct from main run |
| Idle Reward (5-min ticks, 8hr cap, manual claim) | Passive progress for rest-of-day | 

**Target return cadence:** Per run + daily.

### 2.3 Intent not yet fully codified

| Intent | Status |
|---|---|
| Unique level design per level (beyond Lv1-Lv8 Test Đợt 1) | 🆕 Deferred — Lv9-10 + Đợt 2 content |
| Enemy diversity beyond 4 archetypes | 🆕 Deferred — placeholder in `03_content.md` §1.5 |
| Boss Passive Trait framework | 🆕 Deferred — placeholder per v31 §6 roadmap |

<!-- Locked: v33 | Last changed: v33 | CL: — 3 intent items flagged for post-Đợt-1 content expansion -->

---

## 3. Monetization Philosophy

### 3.1 Direction

**Low-intensity monetization.** Revenue via rewarded ads, not forced or pay-to-win.

### 3.2 Hard boundaries — what the game NEVER does

| Boundary | Rule |
|---|---|
| Forced ads | ⛔ Never |
| Energy / lives / timer | ⛔ Never |
| Pay-to-win | ⛔ In-run outcome depends on route choice, threat reading, build decision — never money |
| Monetization as dominant product identity | ⛔ Tactical gameplay is identity, not spending |

### 3.3 Permitted within limits

| Mechanism | Limit |
|---|---|
| Rewarded ads | Max **4 placements** — player chooses to watch |
| Gold / Rune Shard accelerator | Light convenience, must not break fairness |
| Unlock / reset convenience | Allowed if it doesn't turn Tree into dominant spend identity |

### 3.4 Core Principle

> Player returns because every run has meaning, not because the game punishes them for leaving.

### 3.5 v33 status

| Item | Status |
|---|---|
| Low-intensity direction | ✅ Locked |
| No energy/lives/timer | ✅ Locked (enforced in `01_rules.md` — no such mechanisms exist) |
| Fairness not broken by spending | ✅ Locked (V6 + V7 + V8 invariants enforce power budget caps regardless of spending lane) |
| No forced ads | ✅ Locked |
| Rewarded ads ≤ 4 placements | ✅ Locked |
| Exact ad placement locations | ❌ Deferred — implementation authoring task |
| Exact IAP implementation (if any) | ❌ Deferred — business/launch decision |

<!-- Locked: v33 | Last changed: v33 | CL: — -->

---

## 4. Key Pillars

Pillars are derived bottom-up from the design goals of v33 mechanics. Any proposed feature must strengthen at least one pillar without weakening the others.

### 4.1 Pillar 1 — The path IS the decision

**Đường đi chính là quyết định.**

You don't pick a destination tile — you draw a route through threat, reward, and terrain. Dice tells you how far you can go; you decide what to walk through. Planning and committing a path is the core skill.

**v33 mechanisms:** Roll range `{PLAYER_ROLL_MIN}`-`{PLAYER_ROLL_MAX}`, drag path preview, release-to-commit, mid-path resolve (combat + mystery + special tile), player may walk less than rolled value.

**Feature filter:** Does this feature preserve or enhance path drawing as the primary decision? If a feature auto-selects paths or reduces path-planning to a menu, it weakens this pillar.

### 4.2 Pillar 2 — The board shows everything; the player reads it

**Board cho thấy hết, player tự đọc.**

All information lives on the board: enemy stats, mystery location, heal pickup, wave telegraph, Day/Night status, item info in bag popup. The game never punishes the player for what they couldn't see. The value of the game comes from the player reading and deciding — not from the game hiding information.

**v33 mechanisms:** Visible power readout (`hp.current + dmg.max`), enemy tap-tooltip, threat preview (dark red / light red), bag popup with full stat/family info, Day/Night phase label + Night warning, wave telegraph red/green X, heal potion visible icon.

**Feature filter:** Does this feature add information the player can read, or does it hide state behind invisible logic? Hidden percentile proc triggers on merge lines are explicitly forbidden (per `01_rules.md` §25.7).

### 4.3 Pillar 3 — The board never sits still, outcomes are never certain

**Board không bao giờ đứng yên, kết quả không bao giờ chắc chắn.**

Enemies move every turn. Day shifts to Night. New waves spawn. Dice gives different moves each turn. Heal may or may not drop. Bag offers differ each time. Each random element creates a new puzzle the player must read and solve themselves — so every tactical decision carries emotion, not just arithmetic.

**v33 mechanisms:** Enemy sequential turn (§13), Day/Night cycle (`{DAY_BLOCK_TURNS}` Day → `{NIGHT_BLOCK_TURNS}` Night repeating), multi-wave per level, dice variance, heal `{HEAL_POTION_DROP_PCT}%` chance, bag random offer + reroll/skip, wave telegraph (position known, enemy unknown).

**Feature filter:** Does this feature add meaningful variance (emotional stakes), or noisy randomness (frustration)? Variance that rewards skillful reading is pillar-aligned; variance that overrides skill is not.

### 4.4 Pillar 4 — Every kill feeds your build

**Mỗi combat nuôi build.**

No hollow combat. Every enemy death opens a bag reward (3-choice popup), has `{HEAL_POTION_DROP_PCT}%` chance to spawn a heal potion, and grants gold. Kill order shapes heal route. Mystery cells open additional bag opportunities. Build escalates by phase: early choose direction → mid synergy → end fusion endpoint.

**v33 mechanisms:** Battlefield Bag `{BAG_ACTIVE_SLOTS}` neutral slots, items Lv1→Lv3, fusion recipe (`{FUSION_RECIPE_ITEM_COUNT}` × Lv3 → fusion endpoint), enemy-death + mystery use unified reward flow, heal potion spawn on kill, gold per kill by archetype band (Wind `{GOLD_BAND_LOW}` / Slime `{GOLD_BAND_MID}` / Worm+Fire `{GOLD_BAND_HIGH}`).

**Feature filter:** Does this feature preserve every kill as a meaningful reward event, or does it make some kills feel skippable? A skippable kill pattern weakens the pillar.

### 4.5 Pillar 5 — Losing still moves you forward; winning moves you further

**Thua không mất trắng, thắng vẫn tốt hơn.**

Gold and equipment drops from every run persist — win or lose. Gold Tech Tree raises permanent baseline (HP, dmgMin, dmgMax, gold efficiency) via Rune Shard from Rune Trial. But winning = going deeper = killing more enemies = more gold + more equipment. Losing has meaning; winning has clearly greater value.

**v33 mechanisms:** Gold persists on lose (§15.3), Gold Tech Tree (6 nodes / 3 tiers each / ~315 RS per loop, multi-loop compound), efficiency bonus scales with Day-depth reached (up to `{GOLD_EFFICIENCY_DAY_5_PLUS_PCT}`% at Day 5+), deeper progress = more kills = more gold + equipment drops.

**Feature filter:** Does this feature preserve lose-progress (no total wipes) while keeping winning strictly better? Systems that only reward winning (like v31's between-level power-up, since removed) over-weighted wins. Systems that reward losing as much as winning weaken the pillar.

<!-- Locked: v33 | Last changed: v33 | CL: — Pillar 5 mechanism list updated to v33 (removed between-level power-up reference, added Rune Shard/Rune Trial flow) -->

---

## 5. Checklist — v33 canonical state

The vision source doc (from 09/04/2026) flagged items to be locked into GDD. Status as of v33:

| # | Item | Where locked in v33 | Status |
|---|---|---|---|
| 1 | Short-loop retention intent (luck/bad luck emotional peaks) | §2.1 this file + `01_rules.md` §4, §12, §14 | ✅ Locked |
| 2 | Unique level design per level (Lv1-Lv8 scope) | `03_content.md` §8 | ✅ Test Đợt 1 scope locked; Lv9-10 deferred |
| 3 | Enemy diversity beyond 4 archetypes | `03_content.md` §1.5 | 🆕 Deferred — placeholder only |
| 4 | No forced ads | §3.2 this file | ✅ Locked |
| 5 | Rewarded ads max 4 placements | §3.3 this file | ✅ Locked |
| 6 | Exact ad placement locations | — | ❌ Deferred — implementation task |
| 7 | Gold Tech Tree topology (v32 = 6 nodes, not v31's 8) | `01_rules.md` §27, `03_content.md` §6, `02_balance_values.md` §16 | ✅ Locked |
| 8 | Rune Shard as Tree currency (not gold) | `01_rules.md` §21, §27 | ✅ Locked |
| 9 | Between-level power-up removal | `01_rules.md` §28 (placeholder), `07_open_questions.md` Session 16 resolution note | ✅ Removed (user confirmed Session 16) |
| 10 | Dual-currency architecture (Gold + RS strict separation) | `01_rules.md` §21, V13 invariant | ✅ Locked |

<!-- Locked: v33 | Last changed: v33 | CL: — Updated against v31→v32→v33 actual state -->

---

**End of `00_vision.md`.** 5 sections covering 3-tier strategy + 5 pillars + v33 canonical state checklist. Cross-references: rules → `01_rules.md`, values → `02_balance_values.md`, content → `03_content.md`.
