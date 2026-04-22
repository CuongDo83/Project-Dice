# DiceBound UI & Presentation — v33

- **Version:** v33
- **Last updated:** 2026-04-21 (Session 20 — minor expansion, 3 TBD categories added)
- **Status:** ✅ Pointer file with scope boundary registry. Primary UI rules live in `01_rules.md` §29-§30.
- **Authoritative for:** Scope boundary — what IS and is NOT part of v33 GDD scope (UI + adjacent deferred concerns).
- **NOT authoritative for:** UI rule text itself (see `01_rules.md` §29-§30).

---

## Why this file is thin

UI rules ARE game design (what the player sees, what they can interact with, what state transitions exist). These live in `01_rules.md`. The game design vocabulary is not separated from the UI vocabulary in DiceBound because UI mediates every gameplay interaction.

Splitting UI rules into a separate file would create two sources of truth for the same contracts (e.g., "Roll button visible in BeforeRoll") and risk drift. `01_rules.md` §29-§30 is the single source.

This pointer file exists so:
1. `_INDEX.md` has no broken reference to `05_*`.
2. Future contributors see explicit scope boundaries (what's in GDD vs what's in art pipeline).
3. v33 migration structure stays consistent with original plan.

---

## What IS in v33 GDD UI scope (→ `01_rules.md`)

**Section map pointer:**

| Topic | File | Section |
|---|---|---|
| 7 runtime UI states | `01_rules.md` | §29.1 |
| Per-state UI element requirements | `01_rules.md` | §29.2 |
| UI state invariants | `01_rules.md` | §29.3 |
| Wireframe reference list | `01_rules.md` | §29.4 |
| Top HUD layout (main mode) | `01_rules.md` | §30.1 |
| Top HUD layout (Rune Trial) | `01_rules.md` | §30.2 |
| Visible power formula | `01_rules.md` | §30.3 |
| Threat preview rules | `01_rules.md` | §30.4 |
| Tap-enemy tooltip | `01_rules.md` | §30.5 |
| Wave preview markers | `01_rules.md` | §30.6 |
| Day/Night phase indicators | `01_rules.md` | §30.7 |
| Heal potion readout | `01_rules.md` | §30.8 |
| Bag summary HUD | `01_rules.md` | §30.9 |
| Equipment UI layout | `01_rules.md` | §30.10 |
| Blacksmith (Merge) UI layout | `01_rules.md` | §30.11 |
| Home / Idle Reward card | `01_rules.md` | §30.12 |
| Modes / Rune Trial card | `01_rules.md` | §30.13 |
| Rune Trial stage-select UI | `01_rules.md` | §30.14 |
| Gold Tech Tree UI | `01_rules.md` | §30.15 |
| Secondary danger cue coverage rule | `01_rules.md` | §30.16 |

**UI-related content elsewhere:**
- UI state enum in schema: `04_schema.md` §1.6 UIRuntimeState.
- Enemy archetype visual IDs: `03_content.md` §1.

---

## What is NOT in v33 GDD UI scope

The following are **art/frontend pipeline** concerns and live outside GDD files (typically in Figma, Unity project files, or dedicated art docs):

### Visual design tokens
- Color palette (primary/secondary/accent/error/success).
- Typography (font families, sizes, weights, line heights).
- Spacing system (grid, padding, margins).
- Iconography style.
- Illustration style for enemy archetypes, items, bosses.

### Animation specifications
- Timing (durations, easing curves) for state transitions.
- Feedback animations (pop-in, flash, shake) durations and intensity.
- Path drag animation speed.
- Combat hit feedback timing.
- Gold/equipment fly-to-bag animation (exact duration beyond "~0.5s delay mentioned in §30.9").

### Art direction
- Mood/theme per gameplay phase (Day warmth vs Night tension).
- Environmental ambience details.
- Enemy archetype visual personality beyond the functional description in `03_content.md` §1.
- Boss visual design (entrance, phase transitions, scale).

### Localization
- String key management for all player-facing text.
- Language support matrix (launch languages, text-length constraints).
- RTL/LTR considerations.

### Accessibility
- Color-blind modes.
- Text scaling / dynamic type support.
- Alternative danger cues beyond color (shape/pattern differentiation).
- Input method support (touch, controller, keyboard for Unity port).

### Asset management
- Asset naming conventions.
- Sprite atlases.
- Audio design (SFX catalog, music, timing rules).
- Haptics mapping.

### Platform-specific UI
- Mobile vs desktop differences.
- Safe area handling (notches, punchholes).
- Orientation support.

### Narrative / Worldbuilding
- Setting / lore.
- Character identity (who is the player avatar?).
- Enemy archetype narrative hooks (why these 4 creatures?).
- Boss encounter narrative (are they named? do they speak?).
- Progression narrative (Tree = ancient magic? Equipment = crafted gear?).
- Written narrative pacing across Lv1-Lv10.

### Tutorial UX flow
- First-time user flow (session 1 sequencing).
- Mystery cell first-interaction tutorial.
- Bag pick first-interaction tutorial.
- Day/Night phase first exposure + explanation.
- First boss encounter framing.
- Achievement / milestone feedback moments.
- Tooltip-on-first-use policy (enemy intro popups are locked; other tooltips TBD).

### Social features
- Friends / leaderboards (if any).
- Share run highlights.
- Guild / clan structure (future expansion).
- Community features (Discord integration, etc.).

---

## When to expand this file

If playtest, Cursor prototype, or Unity port requires codifying any "NOT in scope" item into reusable specs (art contractor handoff, localization vendor handoff, narrative writer handoff, platform QA), two options:

- **Option A: Expand this file** with inline spec. Suitable for compact items (1-2 page specs).
- **Option B: Add a new file** (`08_art_spec.md`, `09_localization.md`, `10_narrative.md`, etc.). Suitable for substantial items (5+ page specs).

**Current v33 status:** All "NOT in scope" items handled ad-hoc during implementation — solo GD workflow doesn't need formalized specs yet. The list above exists to:
1. Mark explicit boundaries (prevents scope creep during rules/content authoring).
2. Provide checklist when scaling beyond solo GD (e.g., hiring art contractor).
3. Mirror v32 part2 §10 TBD registry — ensures nothing drops silently between versions.

<!-- Locked: v33 | Last changed: v33 | CL: Session 20 — expanded with narrative/tutorial/social categories to mirror v32 §10 TBD full list -->

---

**End of `05_ui_and_presentation.md`.** Pointer file + scope boundary registry. Real UI rules at `01_rules.md` §29-§30.
