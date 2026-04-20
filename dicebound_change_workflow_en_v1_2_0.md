# DiceBound Change Intake & Update Workflow

- Workflow version: 1.2.0
- Last updated: 02/04/2026

## Changelog

### v1.2.0 — 02/04/2026
- Changed the changelog rule: **every time a new file is created, a changelog must be added**, even if the document version is not bumped.
- Clarified that **draft / working files** must also include a changelog section.
- Kept the existing rule that, if a document is versioned up, the new version must be recorded clearly in the changelog.
- Updated the short-form rule summary to reflect the new-file changelog requirement.

### v1.1.0 — 01/04/2026
- Added a rule: whenever clarification is needed from the user, provide **5 suggestions in the format A, B, C, D, E** so the user can answer quickly by choosing an option or giving a different answer.
- Added a rule in the update step: always ask **whether the document should be versioned up**.
- Added a rule: if there is a new version, **a changelog must always be added** for that version.
- Updated the short-form rule summary to reflect the clarification flow + versioning + changelog requirements.

## Purpose
This file records the workflow to follow when the user adds new information to the DiceBound project or to the GDD template.

This workflow is used to ensure that:
- the wrong section is not updated,
- the **design goal** of a change is not missed,
- AI Dev does not unintentionally modify unrelated parts,
- every change is mapped to the correct **mechanic / system / loop / content block**,
- when clarification is needed, the user can answer quickly through clear choices,
- document updates are always controlled through proper **versioning** and **changelog** handling.

---

## 1. Current workstreams
There are currently 3 main workstreams:

### Workstream 1 — Cross-LLM GDD Template
A general template that can be pasted into different **LLMs**.

### Workstream 2 — DiceBound Project GDD
The project-specific GDD document for DiceBound.

### Workstream 3 — Change Intake Workflow
The rules for handling new user information or changes to an existing mechanic.

### Current conclusion
Other than the 3 workstreams above, there is currently no separate fourth workstream.
Everything else is considered a sub-task inside these 3 workstreams, for example:
- locking missing rules,
- updating design goals,
- locking module ownership,
- clarifying state transitions,
- finalizing special tile rules.

---

## 2. Workflow when the user provides new information

### Step 1 — Identify the type of information
New information may belong to one of these groups:
- a new design goal,
- a change to an existing mechanic,
- a loop change,
- a system change,
- a content change,
- a UI / UX change,
- a data / config change,
- a win / lose / progression flow change.

### Step 2 — If it is unclear what it affects, ask first
If the user’s statement is not clear enough to determine which:
- section,
- mechanic,
- system,
- or content block

is being affected, then clarification must be requested before updating the document.

### Step 2.1 — When asking, always include 5 suggestions: A, B, C, D, E
Whenever clarification is needed, provide **5 suggestions** in this format:
- A
- B
- C
- D
- E

The user may:
- answer by choosing one or more options,
- or answer differently if the correct answer is not among those 5 suggestions.

The purpose of this rule is to:
- help the user answer quickly,
- reduce misunderstanding,
- keep the update flow structured,
- avoid overly open-ended questions when a rule needs to be locked.

### Step 3 — Ask for the goal of the change
After the correct affected section / mechanic has been identified, ask:

> What is the goal of this change?

This goal must be saved into the **Design goal** of the affected mechanic.

### Step 4 — Update two information layers
Each change must update both of these layers at the same time:

#### A. Implementation layer
- which rule changes,
- which flow changes,
- which data changes,
- which UI changes,
- which content changes.

#### B. Design-goal layer
- why the change is being made,
- what feeling it is meant to create,
- what problem it is meant to solve,
- what clarity / tension / pacing / fairness / reward feeling it is meant to improve.

### Step 5 — State the impact clearly
If the change affects other sections, that impact must be stated clearly.

Examples:
- changing enemy movement → affects movement, difficulty scaling, enemy types, core loop
- changing power-up selection → affects meta loop, UI, progression, balance
- changing lose flow → affects win/lose, UI, state flow, persistence

### Step 6 — Before updating the document, ask about versioning
At the document update step, also ask:

> Should this change bump the document version?

The user may:
- allow a new version,
- request to keep the current version,
- or request an update only in a draft / working file.

### Step 7 — Every new file must include a changelog
If a **new file** is created, it is mandatory to:
- include a **changelog** section in that file,
- record the **update date** if the document tracks dates,
- describe the main changes of that file clearly and briefly.

This applies to:
- new versioned documents,
- draft files,
- working files,
- consolidated files,
- or any other newly created document file.

A new file must never be created without a changelog.

### Step 8 — If there is a new version, record it clearly in the changelog
If the document is bumped to a new version, it is also mandatory to:
- record the **new version**,
- add a **changelog entry for that version**, and
- keep the version history clear and brief.

A new version must never be created without a changelog entry for that version.

---

## 3. Rules for updating the document

### If it is a mechanic change
Update:
- **Current behavior**
- **Editable parameters**
- **Protected invariants** if needed
- the **Design goal** of that mechanic
- **Dependencies / impact** if needed

### If it is a loop change
Update:
- **Core loop / Meta loop / Long-term progression loop**
- the **Design goal** of that loop
- related flow sections

### If it is a system change
Update:
- the relevant section in **Systems Design**
- the **Design goal** of that system
- the impact on economy / progression / balance / persistence

### If it is a content change
Update:
- **Content Structure**
- the relevant enemy / obstacle / item / level block
- the **Design goal** of that content block

### If it is a UI change
Update:
- **UI / UX Structure**
- display states, layout, popup, effect, readability
- the **Design goal** of that UI block

### If it creates a new file
In addition to the above, also update:
- **Changelog**
- **Last updated** if applicable
- a short summary of what this file adds or changes

### If it is an update with a new version
In addition to the above, also update:
- **Version**
- **Last updated** if applicable
- **Changelog**

---

## 4. Example already locked

### Change
> Enemies must move.

### Reason from user
> So that each player movement roll feels emotional.

### Correct section mapping
- 4.3 Movement
- 4.2 Core rules
- 6.3 Enemy types
- 3.1 Core loop
- 5.9 Difficulty scaling

### Updated design goal
**Enemy movement must keep the board state changing, so that each player movement roll feels emotional, creates pressure, and carries more tactical meaning.**

---

## 5. Sample question patterns for future use
If the user gives a new change but it is still unclear what it affects, use questions like these:

### Question 1 — identify scope
> Which mechanic / system / loop / UI / content area does this change affect?

### Question 2 — identify goal
> What is the goal of this change? What problem should it solve, or what feeling should it create for the player?

### Question 3 — ask with 5 suggestions
When a rule needs to be locked quickly, ask like this:

> Which direction do you want for this rule?
> A. ...
> B. ...
> C. ...
> D. ...
> E. ...
> Or answer differently if the correct answer is not among the options above.

### Question 4 — confirm document versioning
> Should this change bump the document version?

If yes:
- a new version must be added
- a changelog entry must be added for that version

### Question 5 — confirm new-file handling
> Should this update create a new file, or modify the current file only?

If a new file is created:
- a changelog must be included in that file

---

## 6. Short-form rule to apply every turn
1. Receive the new information.
2. If the affected section / mechanic is unclear → ask for clarification.
3. When asking for clarification → always include 5 suggestions: A, B, C, D, E, so the user can answer quickly or answer differently.
4. Once clear → ask for the goal of the change.
5. Also ask whether this change should bump the document version.
6. Update both the **implementation** and the **Design goal**.
7. If a **new file** is created → always add a **changelog**.
8. If there is a **new version** → always add a **changelog entry** for that version.
9. State the impact clearly if other sections are affected.
