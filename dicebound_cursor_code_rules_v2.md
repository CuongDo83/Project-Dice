# DiceBound Cursor Coding Architecture Rules

## Purpose
This document defines the mandatory programming architecture, file ownership, schema rules, and editing behavior for Cursor when working on the DiceBound web prototype.

Cursor must follow this document for all future implementation work, including gameplay features, UI work, level content, balance tuning, persistence, and refactors.

This document contains:
- **confirmed project constraints** from the current DiceBound source of truth and user instructions
- **chosen implementation conventions** for the redevelopment structure where the project is intentionally being redefined

If a mechanic, rule, or system is not defined by the DiceBound GDD, by this document, or by the user's explicit request, Cursor must **ask before inventing behavior**.

---

## Source-of-truth priority
When there is a conflict, Cursor must use this priority order:

1. The user's latest explicit instruction
2. The DiceBound GDD and approved source files
3. This architecture rules document
4. The existing codebase implementation

If the codebase conflicts with the GDD or with an explicit user instruction, Cursor must follow the higher-priority source and clearly report the conflict before changing code.

---

## Non-negotiable technical constraints
Cursor must keep these constraints unless the user explicitly changes them:

- **Entry point:** `index.html`
- **Language:** plain JavaScript
- **Module system:** ES modules (`import` / `export`)
- **Runtime stack:** HTML + CSS + JavaScript only
- **Rendering approach:** DOM-based web prototype
- **Programming style:** function-based modules
- **Dependencies:** do not add new libraries or dependencies unless explicitly requested

Do not introduce TypeScript, React, Vue, build tools, or framework-specific patterns unless the user explicitly requests a stack migration.

---

## Mandatory architecture
DiceBound must use a **data-driven layered architecture**.

Cursor must keep gameplay logic, state flow, content authoring, balance data, UI rendering, and persistence clearly separated.

### Required layers
1. **Presentation layer**
2. **State / orchestration layer**
3. **Gameplay rules layer**
4. **Content layer**
5. **Data / balance layer**
6. **Persistence layer**
7. **Shared utility / schema support layer**

### Architecture rule
Cursor must not mix responsibilities across layers unless the requested change explicitly requires cross-layer work.

Examples:
- UI code must not implement combat formulas.
- Gameplay rules must not manipulate DOM directly.
- Level JSON must not contain computed runtime-only state.
- Persistence code must not own gameplay resolution logic.
- Balance config must not hardcode screen behavior.

---

## Target folder structure
The project may be redefined. Cursor should move the codebase toward this structure and keep future files aligned with it.

```text
index.html
src/
  ui/
    components/
    hud/
    screens/
    renderers/
  state/
    game-state.js
    turn-flow.js
    selectors.js
    actions.js
  gameplay/
    movement/
    combat/
    rewards/
    objectives/
    special-cells/
  content/
    levels/
    level-generator.js
    level-validator.js
    level-loader.js
  data/
    balance-config.js
    player-baseline-config.js
    enemy-balance-config.js
    mystery-reward-config.js
    tile-assets-config.js
  persistence/
    save-store.js
    save-schema.js
    save-migration.js
  shared/
    constants.js
    coords.js
    validation.js
    ids.js
```

### Folder rules
- `src/ui/*` is for DOM rendering and presentation only.
- `src/state/*` is for runtime flow and state ownership.
- `src/gameplay/*` is for game rules only.
- `src/content/*` is for level authoring, loading, compiling, and validation.
- `src/data/*` is for balance/config/static gameplay values.
- `src/persistence/*` is for save/load and versioned persistence only.
- `src/shared/*` is for reusable helpers with no layer-specific ownership.

Do not place level design logic in `ui/`.
Do not place balance data in `gameplay/`.
Do not place save code in `content/`.

---

## Layer ownership and forbidden coupling

### 1. Presentation layer
**Owns:**
- HUD
- popups
- animations
- feedback text
- combat display
- selection highlights
- mobile readability

**Must not own:**
- combat formulas
- movement rules
- reward probabilities
- persistence schema
- level generation rules

**Rule:** UI reads state and emits user intents. UI does not decide core game rules.

---

### 2. State / orchestration layer
**Owns:**
- top-level runtime state
- turn sequencing
- phase transitions
- action dispatch
- coordination between player turn and enemy turn
- resolve order between systems

**Must not own:**
- raw level authoring data
- DOM implementation details
- static balance tables

**Rule:** this layer coordinates systems. It does not become a dumping ground for all logic.

---

### 3. Gameplay rules layer
**Owns:**
- movement validation
- path resolution
- combat resolution
- reward application
- objective checks
- special-cell effects
- win/lose trigger logic

**Must not own:**
- DOM rendering
- save serialization
- authored level JSON

**Rule:** gameplay modules should be deterministic and testable from input state + input action + config data.

---

### 4. Content layer
**Owns:**
- authored level JSON
- level validation
- level compilation/generation
- placement rules for player, enemies, mystery cells, and terrain

**Must not own:**
- combat formulas
- player profile persistence
- runtime DOM behavior

**Rule:** content is authored as data. Runtime systems consume compiled content.

---

### 5. Data / balance layer
**Owns:**
- player baseline stats
- enemy stat tables
- reward odds
- asset mappings for terrain types
- tunable numbers used by gameplay systems

**Must not own:**
- turn sequencing
- authored map coordinates
- DOM behavior

**Rule:** values live in config files, not inside gameplay code paths.

---

### 6. Persistence layer
**Owns:**
- save/load
- save schema
- schema versioning
- migrations
- profile reset behavior

**Must not own:**
- movement logic
- combat formulas
- authored content generation

**Rule:** persistence can evolve, but any schema change must be documented and must list migration impact.

---

### 7. Shared utility / schema support layer
**Owns:**
- generic validation helpers
- coordinate helpers
- ID builders
- shared constants
- schema helper functions

**Must not own:**
- concrete feature logic that belongs to a layer-specific module

**Rule:** use `shared/` only for truly shared utilities, not as a misc folder.

---

## Runtime state names and flow invariants
Cursor must preserve the current runtime model unless the user explicitly requests a design change.

### Required named states
Use explicit, readable state names such as:
- `BeforeRoll`
- `ReachablePreview`
- `Moving`
- `Combat`
- `EnemyTurn`
- `WinText`
- `LoseText`

Additional states may be added only when justified by a real mechanic or UI flow.

### Required runtime invariants
- **Single committed move resolves the turn** unless the design is explicitly changed.
- **Enemy actions resolve sequentially**.
- The state/orchestration layer must define the order of resolution.
- Gameplay systems must not bypass the state flow with hidden side effects.

### Recommended player turn order
Unless the user requests otherwise, keep this order:
1. Roll
2. Preview reachable cells
3. Select target cell
4. Move
5. Resolve special-cell effects
6. Resolve combat if triggered
7. Resolve mystery rewards if triggered
8. Check objective / win / lose
9. End player turn
10. Run enemy turn sequentially

---

## Level authoring pipeline for future ChatGPT level design
A core project requirement is that DiceBound level design must be easy to generate later through ChatGPT or another LLM.

Because of that, Cursor must keep level authoring:
- machine-readable
- JSON-based
- simple enough for an LLM to generate reliably
- strict enough for a validator to reject invalid levels

### Architecture rule for levels
- **Authored level files** live in `src/content/levels/*.json`
- **`src/content/level-generator.js`** converts authored JSON into runtime-ready level data
- **`src/content/level-validator.js`** validates authored level JSON before runtime use
- Runtime gameplay must consume validated/generated content, not raw unchecked authoring data

---

## Level JSON schema
The authored level format must remain simple and explicit.

### Required fields
Each level JSON must contain at least:

- `id`
- `gridWidth`
- `gridHeight`
- `playerSpawn`
- `enemySpawns`
- `mysteryCells`
- `walkableCells`
- `blockedCells`
- `cellAssets`

### Required schema shape
```json
{
  "id": "level_001",
  "gridWidth": 8,
  "gridHeight": 11,
  "playerSpawn": { "x": 1, "y": 1 },
  "enemySpawns": [
    {
      "id": "enemy_001",
      "archetype": "slime",
      "level": 1,
      "position": { "x": 4, "y": 2 }
    }
  ],
  "mysteryCells": [
    {
      "id": "mystery_001",
      "position": { "x": 2, "y": 5 }
    }
  ],
  "walkableCells": [
    { "x": 1, "y": 1 },
    { "x": 2, "y": 1 },
    { "x": 3, "y": 1 }
  ],
  "blockedCells": [
    { "x": 0, "y": 0 },
    { "x": 0, "y": 1 }
  ],
  "cellAssets": {
    "walkable": "assets/tiles/floor_basic.png",
    "blocked": "assets/tiles/wall_basic.png"
  }
}
```

### Why this schema is chosen
This authoring format is intentionally simple for LLM-based level generation:
- explicit player position
- explicit enemy positions and enemy types
- explicit mystery cell positions
- explicit walkable coordinates
- explicit non-walkable coordinates
- explicit asset mapping for walkable and blocked cells

This reduces ambiguity and makes future automated level generation easier.

---

## Recommended optional level fields
The following fields are allowed, but not required for every level:

- `objective`
- `specialCells`
- `scenery`
- `notes`
- `tags`
- `version`

### Recommended optional shapes
```json
{
  "objective": { "type": "defeat_all" },
  "specialCells": [
    {
      "id": "lava_001",
      "type": "lava",
      "position": { "x": 3, "y": 3 },
      "params": {}
    }
  ],
  "scenery": [
    {
      "id": "rock_001",
      "asset": "assets/scenery/rock_small.png",
      "position": { "x": 5, "y": 5 }
    }
  ],
  "notes": "Keep early route safe for the first two moves.",
  "tags": ["tutorial", "low_pressure"],
  "version": 1
}
```

### Special-cell rule
Special cells are allowed in the schema now, but their full mechanic behavior must not be invented.

If a special-cell type is not fully defined by the GDD or by the user, Cursor may:
- support the data field in schema
- support validation shape
- avoid implementing full gameplay behavior until clarified

Do not invent Lava, Swamp, Cannon, or other special-cell behavior without source-of-truth confirmation.

---

## Level validation rules
`src/content/level-validator.js` must reject invalid level JSON.

### Validation requirements
Cursor must validate at least the following:

- all coordinates are inside the grid
- `playerSpawn` exists and is unique
- every enemy has `id`, `archetype`, `level`, and `position`
- every mystery cell has `id` and `position`
- no duplicate coordinates inside `walkableCells`
- no duplicate coordinates inside `blockedCells`
- the same coordinate cannot be both walkable and blocked
- player spawn must be on a walkable cell
- enemy spawns must be on walkable cells
- mystery cells must be on walkable cells
- enemy positions cannot overlap the player spawn
- enemy positions cannot overlap each other unless the user explicitly requests stackable entities
- mystery cells cannot overlap blocked cells
- cell asset paths must be defined for both `walkable` and `blocked`

### Design rules for future level generation
Unless the user explicitly requests otherwise, generated levels should follow these design conventions:

- mystery cells use fixed placement in authored data
- the opening route should avoid unnecessary frustration
- the player should have at least one valid early route
- avoid unavoidable early disadvantage without warning
- do not place essential entities on blocked cells

These are content-authoring conventions, not replacements for gameplay difficulty design.

---

## Data / balance file ownership
The project must split balance and config into multiple files.

### Required balance files
- `src/data/balance-config.js` → top-level balance/config export or aggregator
- `src/data/player-baseline-config.js` → starting player stats from GDD baseline
- `src/data/enemy-balance-config.js` → enemy balance rows
- `src/data/mystery-reward-config.js` → mystery reward odds and reward rules
- `src/data/tile-assets-config.js` → terrain and asset mappings

### Balance rules
- Player starting stats come from the GDD baseline.
- Mystery reward odds must live in a dedicated config file.
- Do not hardcode balance values inside gameplay modules.
- Do not hardcode enemy archetype names in gameplay logic.

### Enemy balance table rule
Enemy balance should be represented as row-based data.
Each row should contain at least:

- `archetype`
- `level`
- `hp`
- `minDamage`
- `maxDamage`
- any other explicitly approved gameplay stat

Example shape:
```js
export const enemyBalanceRows = [
  {
    archetype: 'slime',
    level: 1,
    hp: 3,
    minDamage: 1,
    maxDamage: 2
  }
];
```

This keeps future scaling data explicit and easy to edit.

---

## Persistence policy
The existing persistence keys are **not locked** for the redevelopment structure.

Cursor may redefine save keys and save schema if needed, but must do so in a controlled way.

### Persistence requirements
- all persistence logic must live in `src/persistence/*`
- save schema must be versioned
- schema changes must document migration impact
- reset behavior must explicitly list what is cleared
- gameplay modules must not write directly to localStorage
- UI modules must not write directly to localStorage unless routed through persistence APIs

### Recommended naming convention
Use a stable namespace such as:
- `dicebound.save.version`
- `dicebound.profile`
- `dicebound.meta`
- `dicebound.playtest`

This is a convention, not a required final key list.

---

## UI boundary rules
These rules are mandatory.

- UI must not change gameplay rules directly.
- HUD must read state, not own balance logic.
- Gameplay code must not manipulate DOM directly.
- DOM rendering must be contained in the presentation layer.
- Power-up selection flow is **not fully specified yet**.

### Power-up rule
Because the power-up selection UI is not fully specified yet:
- Cursor may structure code to support it
- Cursor must not invent a final UI pattern or final mechanic behavior unless the user requests it

---

## Archetype policy
Do not hardcode a closed list of enemy archetypes in architecture rules.

Enemy archetypes must be **data-defined**, not hardcoded into unrelated modules.

If the project currently uses archetypes like `slime`, `wind`, `worm`, or `fire`, those should be treated as content/config data, not as permanent architecture assumptions.

---

## Cursor behavior for future development
These are mandatory operating rules for Cursor.

### Before changing code, Cursor must output:
1. **Change type**
2. **Affected section / layer**
3. **Source of truth**
4. **Files allowed to change**
5. **Files not allowed to change**
6. **Invariants that must remain true**
7. **Risk / dependency notes**
8. **Files changed**

### Scope rules
- No new feature without explicit request.
- No dependency addition without explicit request.
- No broad refactor unless necessary for the requested change.
- No schema change without clearly stating impact first.
- No mechanic invention when rules are missing from the source of truth.
- If a request is mixed-layer, Cursor should split the work by layer and explain that split.

### Refactor rule
Refactor only when one of the following is true:
- the requested feature cannot be implemented safely without it
- the current code violates the mandatory architecture
- the refactor is small, local, and reduces clear risk

Do not use refactoring as an excuse to redesign unrelated systems.

---

## Coding standards
Cursor must use the following code conventions unless the user explicitly changes them:

- ES module syntax only
- function-based modules
- `camelCase` for variables and functions
- `UPPER_SNAKE_CASE` for true constants only
- kebab-case file names
- avoid classes unless explicitly requested
- keep gameplay functions as pure as practical
- keep DOM selectors localized to UI modules
- keep config exports data-first and easy to scan

### Comment rule
Use comments only when they improve clarity.
Prefer:
- short module headers for non-obvious ownership
- short comments for tricky resolve order or schema constraints

Avoid verbose comments that repeat obvious code.

### Public API rule
Use concise JSDoc for exported functions that define important module contracts, especially in:
- `content/`
- `gameplay/`
- `persistence/`
- `state/`

---

## Manual testing requirement
Cursor must always provide a **manual test checklist** after making changes.

Because there is no fixed global definition of done in this document, the checklist must be **task-specific**.

### Minimum expectation
The manual checklist should cover at least:
- the direct feature that changed
- the nearest affected runtime flow
- any likely regression area caused by the change

### Example checklist format
```text
Manual test checklist
- Load level_001 and confirm the player spawns on a walkable cell.
- Confirm enemy positions load with the correct archetype and level.
- Confirm blocked cells cannot be selected as movement targets.
- Confirm mystery cells still resolve only when entered.
- Confirm no save/load regression for the modified flow.
```

---

## Implementation notes for redevelopment
The project is being redeveloped, so Cursor may define or rename files to match this architecture.

However, Cursor must still respect these rules:
- preserve source-of-truth mechanics from the GDD
- keep authored content LLM-friendly
- keep balance data separate from authored levels
- keep runtime logic separate from content authoring
- report any ambiguity before inventing unspecified behavior

---

## Final rule
For every future DiceBound task, Cursor must assume:

> DiceBound is a DOM-based web prototype that uses plain JavaScript, ES modules, function-based modules, JSON-authored level content, separate balance/config files, and a data-driven layered architecture.

Any new feature, mechanic, UI flow, or content pipeline added later must follow that structure unless the user explicitly approves an architecture change.
