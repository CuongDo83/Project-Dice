# DiceBound v33 Migration — Final Summary + Archive Plan

- **Migration start:** 2026-04-21 (Session 1)
- **Migration end:** 2026-04-21 (Session 23)
- **Sessions completed:** 23
- **Status:** ✅ COMPLETE — v33 is the canonical GDD for DiceBound
- **Tag:** `v33-initial`

---

## What was delivered

### 10 canonical v33 GDD files (279 KB total)

| File | Size | Purpose |
|---|---|---|
| `_INDEX.md` | 12 KB | Meta, Task Map, glossary, reading rules |
| `_CHANGELOG.md` | 64 KB | Append-only session history (Sessions 1-23) |
| `00_vision.md` | 15 KB | Product vision + 5 pillars + monetization philosophy |
| `01_rules.md` | 88 KB | 31 rule sections across 4 Parts (Combat/Level/Economy/UI) |
| `02_balance_values.md` | 54 KB | 398+ IDs across 33 sections (authoritative numeric source) |
| `03_content.md` | 26 KB | Entity behaviors: 4 archetypes + 3 bosses + 15 bag items + 15 fusion endpoints + 6 tree nodes + 4 merge families + 8 level manifests |
| `04_schema.md` | 23 KB | Runtime + config + save + event schemas |
| `05_ui_and_presentation.md` | 7 KB | UI pointer + scope boundary registry |
| `06_verification.md` | 23 KB | V1-V18 methodology + difficulty scoring extensions |
| `07_open_questions.md` | 8 KB | 3 open questions (RT-TZ, FUS-SLOT, LOOP-2) |

### 3 tooling artifacts

| File | Size | Purpose |
|---|---|---|
| `gdd_lint.py` | 20 KB | 6-check Python validator (refs/duplicates/literals/markers/headers/cross-refs) |
| `gdd_lint_README.md` | 3 KB | Lint script usage guide |
| `gdd_llm_validation_suite.md` | 18 KB | 20-question accuracy test for LLM-readability |

### 1 setup artifact

| File | Purpose |
|---|---|
| `project_instructions_v33.md` | Ready-to-paste Claude Project Custom Instructions |

**Total artifacts:** 14 files, ~340 KB.

---

## Archive plan — files to remove from Project Knowledge

These v31/v32/framework/research files should be moved to `_archive/` folder OUTSIDE Project Knowledge OR deleted entirely. Their content is either fully migrated to v33 or is human-only historical reference.

### Category A — v31/v32 source (fully migrated)

- `dicebound_gdd_v31.md` (275 KB — was the monolith source)
- `dicebound_gdd_v32_part1.md`
- `dicebound_gdd_v32_part2.md`

**Migration status:** All content migrated to `00_vision.md`, `01_rules.md`, `02_balance_values.md`, `03_content.md`, `04_schema.md`. Handoff Session 16 patched v31 power-up feature removal (no longer in v33).

### Category B — Handoff logs (session-specific)

- `GDD_v32_handoff_VI.md`
- `GDD_v32_handoff_VI_Claude.md`

**Migration status:** Session-by-session handoff logs. History preserved in `_CHANGELOG.md`. Originals not needed.

### Category C — Framework + workflow docs (methodology absorbed)

- `DB_Balance_Framework_00_Index.md`
- `DB_Balance_Framework_01_Relationships.md`
- `DB_Balance_Framework_02_Sequencing.md`
- `DB_Balance_Framework_03_Combat_Stat.md`
- `DB_Balance_Framework_04_Difficulty.md`
- `DB_Balance_Framework_05_Economy.md`
- `DB_Balance_Framework_06_Progression.md`
- `DB_Balance_Framework_07_Unified_Workflow.md`
- `DB_Tuning_Proposals_v1_0.md`
- `Difficulty_Balance_V1_3_0.md`
- `dicebound_change_workflow_en_v1_2_0.md`
- `gdd_template_multillm_v1_2_0.md`
- `dicebound_cursor_code_rules_v2.md`

**Migration status:** V1-V18 invariant methodology absorbed into `06_verification.md`. Change workflow becomes the migration process itself. Templates superseded by v33 structure.

### Category D — Research / reference docs (not authoritative)

- `Claude_dicebound-vision-pillars.md` (migrated into `00_vision.md`)
- `Claude_Lessmore_minimalist_simplicity_define_VN.md`
- `Claude_Moment_to_moment_definition_VN.md`
- `tong_hop_4_game_va_simplicity_lessmore.md`
- `List_website_game_designer_market.md`
- `02_three_mobile_games_feature_info.md`
- `DiceBound_WAW_ForgeMaster_No_Energy_Analysis.md`
- `Magic_Survival_Skill_System_Framework_Consolidated.md`

**Migration status:** Research notes that informed v33 design decisions. Principles baked into v33 files; originals not needed as active context.

### How to archive

**Option 1 — Git repository (recommended for solo GD with versioning):**
```
git mv dicebound_gdd_v31.md _archive/
git mv dicebound_gdd_v32_part1.md _archive/
# ... etc
git commit -m "archive: move v31/v32/framework files to _archive/ per v33 migration"
git tag v33-initial
```

**Option 2 — Delete entirely:**
If the v31/v32 files are only in Project Knowledge (no local Git), simply delete them from Project Knowledge after confirming v33 files are uploaded and working. The sessions 1-23 migration in `_CHANGELOG.md` preserves what was migrated and why.

**Option 3 — Separate "archive" Project:**
Create a second Claude Project called "DiceBound Archive" with the v31/v32 files for historical lookup. Keep the active DiceBound project clean with only v33 files.

### Critical archive rule

**Do NOT keep v31/v32 files in the active DiceBound Project Knowledge.** They will pollute context and cause Claude to pull stale information (the trap scenario tested in Q20 of the validation suite).

---

## Migration retrospective — 23 sessions

### Phase 1 — Setup + Balance (Sessions 1-5)

Established `_INDEX.md` + `_CHANGELOG.md` structure. Extracted 404 IDs into `02_balance_values.md` across 33 sections. Resolved 6 conflicts between v31/v32 sources (documented in Appendix A).

### Phase 2 — Rules (Sessions 6-13, patch 16)

Authored `01_rules.md` with 31 sections across 4 Parts:
- Part A Combat + State Flow (§1-15)
- Part B Level + Wave + Mystery (§16-20)
- Part C Economy + Progression (§21-28 — §28 later removed as placeholder)
- Part D UI + Invariants (§29-31)

Session 9 patched bag offer weight tables into balance_values §33.

Session 16 patch removed v31 power-up feature — it was never in v32 but my initial migration preserved it verbatim. User correction led to cleaning up 4 files.

### Phase 3 — Content + Schema + Verification (Sessions 14-16)

Authored `03_content.md` (level manifests per user Q3 decision: count + type only, no wave composition).

Authored `04_schema.md` (runtime + save + event schemas matching v31 `diceBoundPlayerData` structure).

Authored `06_verification.md` (V1-V18 methodology + MO/BO/HO formulas previously deferred from rules §19.8).

Authored `07_open_questions.md` (originally 7 questions, Session 16 patch reduced to 3).

### Phase 4 — Cleanup (Sessions 17-20)

Session 17: Terminology standardization ("power item" → "bag item" in 3 remaining references), cross-reference validation (removed stale §28.5 reference after §28 became placeholder), file header consistency.

Session 18: Migrated `00_vision.md` from `Claude_dicebound-vision-pillars.md` with v33 updates (tree 8→6 nodes, gold→RS currency, gold bands 1/2/4→3/8/13, removed power-up references).

Session 19: Thorough duplication audit — file separation confirmed healthy, no consolidation needed.

Session 20: `05_ui_and_presentation.md` expanded with 3 missing TBD categories from v32 §10 (Narrative, Tutorial UX, Social features), now functions as canonical "what's NOT in v33 scope" registry.

### Phase 5 — Tooling + Test (Sessions 21-22)

Session 21: Python lint script `gdd_lint.py` with 6 automated checks. Runs clean on v33 (0 errors, 0 warnings). Fixed `02_balance_values.md` header "Authoritative:" → "Authoritative for:" during testing.

Session 22: 20-question LLM validation test suite covering 7 categories including anti-confabulation trap questions (Q2 gold bands, Q20 post-Win flow).

### Phase 6 — Archive + Handoff (Session 23)

This session. Delivered Project Instructions draft + this summary + archive plan.

---

## Key decisions preserved

| Decision | Origin session | File location |
|---|---|---|
| No delta overlay rule | Session 1 | `_INDEX.md` §1 |
| Concern-based file organization | Session 1 | `_INDEX.md` §2 |
| `{ID}` syntax for cross-file references | Session 1 | `_INDEX.md` §4 |
| UPPER_SNAKE_CASE IDs with scope prefixes | Session 1 | `_INDEX.md` §4 |
| English rules + Vietnamese commentary | Session 1 | `_INDEX.md` header |
| Level manifests = count + type only (user Q3) | Session 14 | `03_content.md` §8 |
| 1 level = 1 run (Model A) | Session 16 | confirmed at post-patch clarification |
| Power-up feature removed | Session 16 patch | `01_rules.md` §28 placeholder |
| UI pointer file instead of separate 05 content | Session 17 | `05_ui_and_presentation.md` |
| V14 SIRC 50% framework-fixed (not stored as ID) | Session 16 | `06_verification.md` §5.2 |
| V18 separate from V14 (30-day window vs per-day) | Session 13 | `01_rules.md` §31.5 |

---

## Metrics

| Metric | Count |
|---|---|
| Sessions | 23 |
| Canonical v33 files | 10 |
| Tooling files | 3 |
| Setup files | 1 |
| Total rule sections (`01_rules.md`) | 31 |
| Total balance IDs | 398+ |
| `{ID}` references across files | 282 |
| Cross-file section references | 72 |
| Invariants defined (V1-V18) | 18 |
| Open questions resolved during migration | 7 (4 deleted, 3 tracked) |
| Open questions remaining | 3 (RT-TZ, FUS-SLOT, LOOP-2) |
| Major feature corrections | 1 (power-up removal, Session 16 patch) |
| Lint pass rate on v33 | 100% (0 errors, 0 warnings) |

---

## What the user should do now

### Immediate (before next work session)

1. **Download all 14 deliverables** from this conversation's outputs.
2. **Upload v33 canonical 10 files to Project Knowledge** (replacing any old versions).
3. **Upload 3 tooling files** (`gdd_lint.py`, `gdd_lint_README.md`, `gdd_llm_validation_suite.md`).
4. **Remove v31/v32/framework files from Project Knowledge** per archive plan above.
5. **Paste `project_instructions_v33.md` contents into Claude Project Custom Instructions.**

### Short-term (this week)

6. **Run `gdd_lint.py --strict`** locally to confirm clean state.
7. **Run LLM validation suite** against Claude Opus 4.7 (or another LLM). Target ≥90% accuracy. Record results in the scoring template of `gdd_llm_validation_suite.md`.
8. **Resolve 3 open questions** through playtest or design session (RT-TZ timezone confirmation, FUS-SLOT Model X confirmation, LOOP-2 first-draft values if/when ready).

### Medium-term (next month)

9. **Build Cursor prototype** using v33 files as reference.
10. **Log any GDD ambiguity** discovered during prototype build. Fix in files, update changelog, re-run lint + validation suite.
11. **Set up Git repo** if not already done. Tag commit `v33-initial` after all files stabilized.

### Long-term (post-Test-Đợt-1)

12. **Playtest observations** on flagged items: V16 wave stacking (Lv5/6/8), V10 "Merge-only test" layer orthogonality, G1/G2/G3 anti-frustration gates.
13. **Draft Loop 2+ tree scaling** per the 6 principles in `07_open_questions.md` LOOP-2.
14. **Consider v34 migration** only if structural changes require (new systems, major rebalance). Most changes should be in-place v33 edits.

---

## Lessons learned

1. **Always cross-validate v31 features against v32 before preserving.** The Session 16 power-up discovery cost 1 patch session. Future migrations: check each feature against latest version explicitly.

2. **Compressed timelines work when audit passes are thorough.** Phases 4-5 completed in fewer sessions than originally planned because Session 17 audit confirmed clean state. Pre-planning cleanup sessions was over-conservative.

3. **Pointer files prevent index drift.** `05_ui_and_presentation.md` as thin pointer avoids two-source-of-truth problem for UI rules.

4. **Separate "what IS in scope" from "what is NOT in scope."** The 05 registry of explicitly-deferred items (narrative, tutorial UX, social, etc.) prevents scope creep during rule authoring.

5. **Framework-fixed values belong in rules, not balance.** V14 SIRC threshold 50% is NOT stored as an ID because changing it would redefine what SIRC means. `02_balance_values.md` is for TUNABLE numbers; framework constants stay in rule text.

6. **Anti-confabulation traps are essential in LLM test suites.** Q2 and Q20 in the validation suite specifically test "does the LLM pull stale v31 info when v33 files are available?" — without this test, silent drift can happen for months.

---

## Acknowledgments

Solo GD workflow + AI-assisted migration process. v33 GDD migration 2026-04-21 across 23 sessions. All decisions logged in `_CHANGELOG.md`.

---

**END OF MIGRATION.** v33 ship-ready. Next work: Cursor prototype + playtest.
