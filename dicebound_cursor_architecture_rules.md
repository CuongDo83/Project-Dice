# DiceBound Cursor Architecture Rules

## Purpose
This document defines the mandatory programming architecture and editing boundaries for the DiceBound web prototype.

Cursor must follow this structure for all future work on DiceBound, including new mechanics, new systems, new UI, level/content work, win/lose flow changes, and data/config updates.

This document is based on the current DiceBound source-of-truth files and is intended to reduce cross-scope changes, protect runtime invariants, and keep future development consistent.

---

## Mandatory rule for Cursor
When developing or modifying DiceBound, **always keep the project in a data-driven layered architecture**.

Do **not** mix gameplay rules, UI presentation, content data, and persistence logic in the same change unless the request explicitly requires cross-layer work.

If the requested change is unclear, or if the source of truth does not define enough detail, **ask first**. Do not invent missing systems, ownership, or behavior.

Do **not** add new features without a clear request.

---

## Current architecture model
The current DiceBound technical architecture is defined as:

- Presentation layer
- State / orchestration layer
- Domain / gameplay rules layer
- Data / config layer
- Persistence layer
- Shared types / schema: **currently unclear; must be verified from codebase before relying on it**

This project should continue to use this architecture structure unless the user explicitly asks to change it.

---

## Why this architecture is required
DiceBound is a web prototype with the following current technical facts:

- Language: **JavaScript**
- Rendering: **DOM**
- The project already has a relatively clear data/content pipeline
- The project already has persistence behavior
- Exact folder/module ownership is **not fully documented yet**

Because of this, the safest and most scalable approach is to keep responsibilities separated by layer, so changes can be made in the correct place without breaking unrelated systems.

Design goal of this architecture:

> Separate responsibilities clearly enough so AI development tools can edit the correct part without breaking other parts.

---

## Architecture layers and responsibilities

### 1. Presentation layer
Responsible for visual presentation only.

Includes:
- HUD
- reward feedback
- popup presentation
- layout
- animation
- result text/effects
- combat screen presentation

Presentation layer must **not** own gameplay formulas or persistence schema.

Presentation layer should read runtime state and display it clearly.

---

### 2. State / orchestration layer
Responsible for runtime flow and sequencing.

Includes:
- turn flow
- phase transitions
- action order
- resolve order
- coordination between player turn and enemy turn

Current runtime flow from source of truth:
- Turn structure: **Player turn → Enemy turn**
- Action order: **Roll → Select target cell → Move → Resolve interactions → End turn → Enemy acts sequentially**

State/orchestration should coordinate systems, but should not become the place where raw content data is authored.

---

### 3. Domain / gameplay rules layer
Responsible for the rules of play.

Includes:
- movement logic
- combat logic
- reward logic
- special tile logic
- objective evaluator
- defeat/victory trigger rules

Gameplay rules must not be hidden inside UI code.

Gameplay rules should be deterministic relative to the current state, data/config, and requested action flow.

---

### 4. Data / config layer
Responsible for structured game data and tunable configuration.

Includes:
- power-up definitions
- enemy archetype data
- balance values
- map JSON and supported map content sources
- level content inputs

Known data/content files from current source of truth:
- `level-design.js`
- `repo-maps.js`
- `maps/*.json`
- `maps/manifest.json`
- `powerup-config.js`
- enemy config file: **file name must be verified from codebase**

Data/config should define values and content, not own runtime turn sequencing.

---

### 5. Persistence layer
Responsible for save/load behavior and persistent flags.

Known persistence keys from current source of truth:
- `diceBoundPlayerData`
- `diceBoundTotalGold`
- `dicebound_enemy_intro_seen_v1`
- `dicebound_playtest_map`

Persistence rules must remain stable unless the request explicitly requires changing them.

---

### 6. Shared contracts / schema
Current source of truth says this is **unclear**.

Therefore:
- Do not assume a shared schema layer already exists.
- Do not create a fake contract system just for style.
- If shared types/contracts are needed, first inspect the actual codebase and report what already exists.

---

## Editable boundaries

### UI request
Allowed:
- HUD
- reward feedback
- popup presentation
- layout
- animation

Forbidden:
- combat formula
- movement rule
- persistence keys

Primary source of truth:
- UI Presentation
- State Flow

---

### Data request
Allowed:
- level content
- map JSON
- power-up config
- enemy archetype data

Forbidden:
- core combat flow
- save schema

Primary source of truth:
- Config Data
- Content Data

---

### Mechanic request
Allowed:
- movement logic
- combat logic
- reward logic
- special tile logic

Forbidden:
- unrelated UI
- persistence keys
- unrelated content format

Primary source of truth:
- Gameplay Logic
- State Flow

---

### Win/Lose request
Allowed:
- objective evaluator
- defeat/victory trigger
- related result presentation

Forbidden:
- unrelated reward logic
- unrelated archetype data

Primary source of truth:
- Gameplay Logic
- UI Presentation

---

## Protected invariants
Cursor must preserve these unless the user explicitly requests otherwise:

- Persistence keys must not be changed casually.
- Map content pipeline format must not be changed unless explicitly requested.
- The enemy intro seen key must still be cleared correctly by Reset Progress.
- Single committed move resolves turn is the current runtime behavior.
- Enemy turns must run sequentially.
- Power-up definitions must still load correctly from `powerup-config.js`.
- `dicebound_playtest_map` is only for playtest flow.

If a requested change would break any invariant, Cursor must explicitly call that out before implementation.

---

## Current technical facts Cursor must respect
- DiceBound currently uses **JavaScript**.
- DiceBound currently renders gameplay using the **DOM**.
- UI files are **not documented clearly in the current source-of-truth document**.
- Rule files are **not documented clearly in the current source-of-truth document**.
- Folder/module structure is **not fully documented yet**.
- Shared contracts are **not clearly documented yet**.

Because of this, Cursor must not pretend these parts are already formally defined.

If implementation work needs exact module ownership, Cursor must first inspect the codebase and state clearly:
- which existing file(s) are involved,
- which layer each file belongs to,
- which files are safe to modify,
- which files must not be modified.

---

## Mandatory implementation behavior for all future features and mechanics
For every future request, Cursor must follow these rules:

### Rule 1 — Classify the change first
Before editing code, identify the request as one of the following:
- UI request
- Data request
- Mechanic request
- Win/Lose request
- Mixed request only if the request truly spans multiple layers

### Rule 2 — Change only the correct layer(s)
Do not modify unrelated layers.

Examples:
- A movement rule change must not casually rewrite HUD code.
- A map/content change must not casually alter save schema.
- A popup/UI change must not modify combat formulas.

### Rule 3 — Use data-driven design whenever possible
If a feature can be implemented by changing or extending data/config/content instead of hardcoding logic into UI or flow code, prefer the data-driven approach.

### Rule 4 — Do not bypass source of truth
If the GDD, supported data files, or current codebase behavior define how something works, follow that.

Do not replace an existing structure with a new architecture pattern unless the user explicitly requests it.

### Rule 5 — Do not invent missing behavior
If the request depends on information that is currently missing from the source of truth, ask for clarification or inspect the codebase and report findings first.

### Rule 6 — Report cross-impact clearly
If a change affects more than one layer, state the cross-impact explicitly.

Examples:
- movement change may affect gameplay logic, state flow, level difficulty, and enemy behavior
- win/lose change may affect gameplay logic, result presentation, and persistence
- power-up change may affect config data, gameplay logic, and reward presentation

### Rule 7 — Protect regression-sensitive behavior
After changes, the following must still work correctly unless intentionally changed:
- reachable cells logic
- valid path movement
- resolve order of interactions
- sequential enemy actions
- combat trigger conditions
- defeat_all objective completion
- HUD readability on mobile
- reward feedback clarity
- save/load keys behavior
- supported level content loading

---

## Required output format for Cursor before making or proposing changes
For each requested task, Cursor should provide this structure:

1. **Change type**
2. **Affected section(s)**
3. **Source of truth for this change**
4. **Files/modules allowed to change**
5. **Files/modules that must not change**
6. **Invariants that must be preserved**
7. **Risk / dependency**
8. **List of changed files**

This is mandatory for keeping DiceBound edits controlled and reviewable.

---

## Practical editing rules

### When adding a new mechanic
- Put gameplay behavior in gameplay/state layers.
- Put tunable values in config/data.
- Put level-specific placement in content data.
- Put visuals in presentation.
- Put save flags only in persistence if persistence is explicitly needed.

### When adding a new level or map variation
- Prefer supported content/data sources.
- Do not hardcode level content inside presentation code.
- Do not change map pipeline format unless explicitly requested.

### When adding a new popup, HUD state, or reward feedback
- Keep the change in presentation/state flow.
- Do not alter combat formulas or persistence schema unless explicitly requested.

### When changing progression, gold carry-over, or save-related behavior
- Treat persistence as a protected layer.
- Preserve existing key behavior unless the request explicitly requires a migration or schema change.

---

## What Cursor must not do
- Do not add features without a clear request.
- Do not infer undocumented folder ownership as if it were confirmed.
- Do not change persistence keys casually.
- Do not change map content format casually.
- Do not mix UI code and gameplay formulas without explicit reason.
- Do not change unrelated files just because they are nearby.
- Do not rewrite architecture style unless explicitly asked.

---

## If architecture detail is missing
If exact file/module ownership is needed but not documented, Cursor must do this:

1. Inspect the actual codebase.
2. Map the relevant files to one of the architecture layers.
3. State what is confirmed and what is still unclear.
4. Avoid inventing undocumented ownership.
5. Proceed only within the confirmed scope.

---

## Standard instruction to keep at the top of future Cursor tasks
Use this instruction in future DiceBound implementation tasks:

> Follow DiceBound's mandatory data-driven layered architecture. Keep Presentation, State/Orchestration, Gameplay Rules, Data/Config, and Persistence separated. Do not modify unrelated layers. Do not invent undocumented behavior. Preserve protected invariants. If exact module ownership is unclear, inspect the codebase first and report the allowed edit scope before changing anything.

---

## Status note
This architecture rule set reflects the current documented DiceBound source of truth.

What is already clear:
- architecture layers
- JavaScript
- DOM rendering
- data/content pipeline exists
- persistence exists
- editable boundaries exist
- regression-sensitive invariants exist

What is still not fully clear:
- exact UI file ownership
- exact rule file ownership
- exact shared contract/schema ownership
- full folder/module structure
- exact enemy config file name

Cursor must treat these unknowns as unknowns until verified from the codebase.
