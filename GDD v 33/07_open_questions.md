# DiceBound Open Questions — v33

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 16 patch — A.7-A.10 removed, feature not in v33)
- **Status:** ✅ 3 questions tracked after power-up feature removal cleanup.
- **Authoritative for:** Known unresolved design questions, their interim answers, and what would trigger re-evaluation.
- **NOT authoritative for:** Final answers (final answers move to `01_rules.md` / `02_balance_values.md` / `03_content.md` when resolved, and this file deletes the entry).

---

## Reading rules

1. Each question has a status tag:
   - **v33 INTERIM** — answer chosen for v33, subject to playtest confirmation.
   - **NEEDS USER DECISION** — question requires solo GD (you) input; cannot resolve from v31/v32 source.
   - **DEFERRED** — explicitly deferred to future session/milestone with documented principles.
2. When a question is resolved, remove the entry from this file and update the canonical source (`01_rules.md`, etc.).
3. New questions flagged during later sessions get appended with `QN.N` numbering (next available: Q8).

---

## Section map

| § | Question ID | Topic | Status |
|---|---|---|---|
| 1 | RT-TZ | Rune Trial daily reset timezone | v33 INTERIM |
| 2 | FUS-SLOT | Fusion slot accounting | v33 INTERIM |
| 3 | LOOP-2 | Loop 2+ tree scaling | DEFERRED with principles |

---

## Session 16 resolution note — removed questions

**A.7, A.8, A.9, A.10 (power-up selection) are NOT applicable to v33.**

v31 listed a "between-level power-up selection" feature (Heal+1/+2/+dmgMin/+dmgMax) appearing after Win. This feature was removed during v32 design iteration. User confirmed at Session 16:

> "Chơi xong 1 màn, dù thắng hay thua chỉ hiển thị màn hình kết quả, xem nhận vật phẩm gì, nhận gold và equipment. Đâu có power up gì mang đi."

v33 flow: Win/Lose → Result table → banking (gold + equipment) → Home. Progression between levels flows ENTIRELY through Home (Gold Tech Tree, Equipment Upgrade, Equipment Merge). No transient power-up mechanic exists.

§28 in `01_rules.md` is preserved as a placeholder (section number kept for stable numbering) with removal notice.

---

## 1. RT-TZ — Rune Trial daily reset timezone

**Status:** **v33 INTERIM** — local device time.

**Question:** What timezone does the "7:00 reset" for Rune Trial daily wins follow?

**Options:**
- **Local device time** — 7:00 AM wherever the player's device says it is.
- **UTC** — fixed global reset regardless of location.
- **Server time** — requires server infrastructure.

**v33 INTERIM answer:** Local device time 7:00.

**Reasoning:**
- DiceBound is single-player, no server required for core gameplay.
- Local time matches player circadian rhythm (morning = reset) across global players.
- UTC would mean 2 PM reset in Vietnam (UTC+7), 3 AM PST — awkward for both.
- Server time adds infrastructure cost not justified for a solo-dev scope.

**Known edge cases (minor, accepted):**
- Player changes device timezone → could double-consume a daily (once in old tz, once in new tz) or skip a day. Acceptable — not exploit-worthy given no PvP/leaderboard.
- DST transitions → 1-hour shift twice a year; no material game impact.

**Location if locked:** Update `01_rules.md` §23.5 to remove flag, add clarification paragraph.

---

## 2. FUS-SLOT — Fusion slot accounting

**Status:** **v33 INTERIM** — consume 2 slots, place fusion in 1, net +1 free slot.

**Question:** When fusion executes, what is the net slot delta?

**Three possible models:**

**Model X (v33 INTERIM):** Consume 2 recipe slots → place fusion in 1 → net +1 free slot.
- Fusion feels rewarding (inventory freed up).
- Enables chain-fusion setups (free slot + fusion-ready state on next pick).

**Model Y:** Consume 2 slots → fusion occupies 2 slots (double footprint).
- Fusion feels "heavy" — it's a powerful item, takes the room.
- Prevents bag from expanding via fusion chains.

**Model Z:** Consume 2 slots → fusion occupies 1 slot + 1 permanent locked slot.
- Visually shows "this slot used to be a partner item."
- Confusing UX; probably reject.

**v33 chooses Model X** because:
- Matches rogue-lite "stronger + simpler" reward intuition.
- Allows fusion chains (strategic depth).
- Consistent with item-level-up mechanic (combine → upgrade → single item).

**Trigger to revisit:** Playtest shows bag slot inflation (player accumulates 5+ fusion endpoints + base items, gameplay becomes cluttered). If so → Model Y.

**Location if locked:** Update `01_rules.md` §26.8 to remove flag, confirm Model X.

---

## 3. LOOP-2 — Loop 2+ tree scaling

**Status:** **DEFERRED with principles** (post-Test-Đợt-1).

**Question:** What are the RS costs and stat values for Gold Tech Tree Loop 2 and beyond?

**What v33 has locked:**
- Loop 1: 6 nodes, 3 tiers each, total RS cost ~315 RS per loop (per `02_balance_values.md` §16.6).
- Loop 1 compound cap: `{TREE_LOOP_1_LANE_AB_COMPOUND_CAP_PCT}`% (30%) for gold efficiency.

**What v33 does NOT lock:**
- Loop 2 RS costs per tier.
- Loop 2 stat magnitudes.
- Whether Loop 3, Loop 4, ... exist or cap at some point.

**DEFERRAL rationale:** Loop 2+ is post-Đợt-1 content. Locking now would hard-code values that playtest data would reshape.

**Principles the future Loop 2 spec MUST follow:**

1. **Same topology.** Same 6 nodes (Root, Steady Hand, Finisher's Edge, Clean Loot, Contract Bonus, Capstone). No new node types in Loop 2.
2. **Cost monotonicity.** Each tier RS cost in Loop 2 ≥ equivalent tier in Loop 1. Never cheaper.
3. **Stat stacking.** Loop 2 stats add to Loop 1 stats (additive). Not a replacement.
4. **Gold% compound cap preserved.** Total gold efficiency across all loops caps at `{TREE_LOOP_1_LANE_AB_COMPOUND_CAP_PCT}`% — Loop 2 gold lanes can contribute but cannot push past cap.
5. **Unlock gate.** Loop 2 unlocks only when Loop 1 all 6 nodes are at Tier 3.
6. **Save compatibility.** `goldTechTree.currentLoop` field must migrate cleanly from Loop 1-only save data (v33 initial state).

**Trigger to revisit:** Test Đợt 1 playtest shows player reaching Loop 1 full earlier than 3-week target → start Loop 2 design. Or player interviews surface desire for additional meta-progression depth.

**Location if locked:** Update `01_rules.md` §27.9 to remove "deferred" tag; add Loop 2 values to `02_balance_values.md` §16.

---

## Summary — all questions after Session 16 patch

**Closed with v33 INTERIM (2):**
- RT-TZ timezone = local device 7:00.
- FUS-SLOT = Model X (net +1 free slot).

**Deferred with principles (1):**
- LOOP-2 Loop 2+ tree scaling (6 principles locked for future authoring).

**Removed during Session 16 patch (4):**
- A.7 Run structure — resolved as Model A (1 level = 1 run) per user confirmation.
- A.8 Selection count — not applicable (feature removed).
- A.9 Power-up magnitudes — not applicable (feature removed).
- A.10 Heal pool expansion — not applicable (feature removed).

<!-- Locked: v33 | Last changed: v33 patch | CL: Session 16 — A.7-A.10 removed after user confirmation that power-up selection feature was dropped in v32 -->

---

**End of `07_open_questions.md`.** 3 questions tracked after cleanup. 2 closed (v33 interim), 1 deferred with principles. No blocking user decisions remaining for Test Đợt 1 scope.
