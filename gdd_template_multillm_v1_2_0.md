# Prototype GDD Template for AI Dev Web Game (Cross-LLM)

- **Template version:** 1.2.0
- **Last updated:** 01/04/2026
- **Based on review against:** DiceBound GDD 1.2.0 + DiceBound Change Workflow 1.1.0


## Changelog

### v1.2.0 — 01/04/2026
- Added **Product Vision & Market Fit** block to make the template usable not only for prototype gameplay definition but also for commercial mobile product framing.
- Added **Design Pillars** block so product-level pillars can be written explicitly and used to accept or reject features.
- Added **Commercial Guardrails** block so retention / monetization / fairness / scalability boundaries can be recorded explicitly instead of being left implied.
- Added question slots for the 3 new blocks in **Consolidated Questions for User**.
- Updated the template rules so missing product / market / commercial assumptions must be recorded explicitly when relevant.
- Added **Document Changelog** support inside the template so future version bumps can be tracked cleanly.

### v1.1.0 — Previous baseline
- Cross-LLM prototype GDD template focused on gameplay logic, systems, content, UI, architecture, and consolidated questions.

## Mục đích
Template này dùng để:
- mô tả **Prototype GDD** cho web game,
- dùng làm nguồn chuẩn để viết prompt cho nhiều **LLM** khác nhau,
- kiểm soát phạm vi thay đổi khi sửa **UI / data / mechanic / win-lose / progression / content**,
- gom toàn bộ câu hỏi còn thiếu xuống cuối tài liệu để dễ trả lời,
- buộc mô hình phải hỏi lại nếu chưa rõ thay đổi đang tác động vào section hoặc mechanic nào,
- buộc mô hình phải hỏi thêm **mục tiêu thay đổi** rồi cập nhật mục tiêu đó vào đúng cơ chế tương ứng,
- giữ rõ các phần liên quan tới **readability / fairness / anti-frustration** khi game có tactical information hoặc power readout,
- và khi cần có thể mở rộng sang lớp **product vision / market fit / retention / monetization philosophy / scalability guardrails** cho mobile game thương mại.

---

## Cách dùng trên LLM khác
Dán toàn bộ file này vào model khác rồi thêm một câu như:

> Tôi sẽ cung cấp mô tả game hoặc thay đổi mới từng phần. Hãy dùng đúng template này, không suy đoán, map thông tin vào đúng section, gom toàn bộ câu hỏi xuống cuối, và nếu có thay đổi mới thì phải hỏi rõ mechanic nào bị tác động và mục tiêu của thay đổi đó là gì. Nếu game đang hướng tới commercial mobile product, hãy điền rõ thêm product vision, target audience, differentiation, return motivation, monetization philosophy, scalability, design pillars và commercial guardrails thay vì để chúng bị ngầm hiểu.

---

## Rules cho model
1. Không được tự suy đoán nếu tài liệu hoặc câu trả lời của user chưa nói rõ.
2. Nếu thông tin còn thiếu, mơ hồ, xung đột, hoặc chưa đủ để implement chính xác, phải hỏi lại.
3. Không được chèn câu hỏi vào giữa các section của template.
4. Mọi câu hỏi phải nằm trong mục **Consolidated Questions for User** ở cuối cùng.
5. Luôn phân biệt rõ:
   - **Current behavior** = hiện đang hoạt động thế nào
   - **Editable parameters** = phần được phép thay đổi
   - **Protected invariants** = phần không được đổi nếu không có yêu cầu rõ
   - **Design goal** = mục tiêu thiết kế của loop / system / mechanic / content block đó
   - **Source of truth** = nguồn quyết định đúng của phần đó
   - **Dependencies / impact** = đổi phần này sẽ ảnh hưởng phần nào
6. Nếu user bổ sung thay đổi mới:
   - trước hết xác định thay đổi đó thuộc section nào,
   - nếu chưa rõ thì hỏi lại,
   - sau đó hỏi mục tiêu của thay đổi đó là gì,
   - cập nhật cả **nội dung thay đổi** lẫn **Design goal** của cơ chế bị tác động.
7. Nếu một phần chưa có trong build hiện tại, ghi rõ **Not in current prototype**.
8. Không tự thêm feature mới nếu user chưa yêu cầu.
9. Nếu thay đổi chạm tới **difficulty / fairness / readability / power readout / threat communication**, phải kiểm tra thêm impact tối thiểu ở:
   - **5.9 Difficulty scaling**
   - **6.x content block liên quan**
   - **7. UI / UX Structure**
10. Nếu một mechanic có **random outcome**, phải cố gắng ghi riêng:
   - random cái gì,
   - odds,
   - cap rule,
   - stack rule,
   - placement rule,
   - ownership.
11. Nếu một content type có **archetype** hoặc **level scaling**, phải tách rõ:
   - stat nào cố định theo archetype,
   - stat nào scale theo level,
   - stat/readout nào chỉ phục vụ readability.
12. Nếu game được định hướng như **commercial mobile product**, không được để ngầm các phần sau; phải ghi rõ hoặc đánh dấu là Missing / Not decided:
   - target audience
   - product differentiation
   - return motivation / retention promise
   - monetization philosophy / commercial boundary
   - scalability / live product promise
13. **Design Pillars** phải là bộ lọc cấp sản phẩm: ngắn, rõ, đủ mạnh để giúp loại feature không phù hợp.
14. **Commercial Guardrails** phải nêu rõ ít nhất các boundary liên quan tới retention, monetization, fairness và scalability, hoặc ghi rõ là chưa được quyết định.

---

## Source of truth labels
Chỉ dùng các nhãn sau:
- **Gameplay Logic** = luật chơi nằm trong engine / domain logic
- **State Flow** = thứ tự phase / state transition / screen transition
- **Config Data** = số liệu, balance, reward table, upgrade values
- **Content Data** = level, map, enemy placement, obstacle placement, chapter data
- **UI Presentation** = text, layout, animation, icon, HUD, hiển thị
- **Persistence** = save / load / localStorage / profile / meta progression
- **Mixed** = chỉ dùng khi thật sự có từ 2 nguồn trở lên

---

# Prototype GDD for AI Dev Web Game

## 1. Document Control
- Project name:
- Prototype name:
- Version:
- Owner:
- Last updated:
- Purpose of this doc:
- Intended use:
  - Design alignment
  - AI Dev prompt source
  - Change management
  - Regression control

### 1.1 Document rules
- AI Dev không được tự thêm feature nếu không có yêu cầu rõ
- Chỉ sửa đúng section liên quan
- Nếu một thay đổi ảnh hưởng section khác, phải nêu rõ impact
- Không đổi schema / architecture / flow ngoài scope

### 1.2 Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

### 1.3 Source of truth
- Product definition / Design document

### 1.4 Changelog
- [Add version-by-version changes here when this document is versioned up]

---

## 2. Game Overview
- Genre:
- Platform:
- Target device:
- Orientation:
- Input:
- Session length:
- Core fantasy:
- Prototype goal:
- Out of scope:

### 2.1 Current behavior
- [Mô tả build hiện tại]

### 2.2 Editable parameters
- [Ví dụ: session target, input mode, objective type]

### 2.3 Protected invariants
- [Ví dụ: game vẫn là turn-based grid prototype]

### 2.4 Design goal
- [Mục tiêu thiết kế cấp sản phẩm / prototype]

### 2.5 Source of truth
- Product definition / Design document

### 2.6 Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

### 2.7 Product Vision & Market Fit
- Product vision statement:
- Target audience:
- Player fantasy at product level:
- Why players should choose this game:
- Product differentiation / unique market angle:
- Return motivation / retention promise:
- Session role in daily life:
- Monetization philosophy:
- Scalability / live product promise:

#### Current behavior
- [Điền hoặc Not in current prototype nếu game mới chỉ ở mức gameplay prototype]

#### Editable parameters
- target audience
- market positioning
- retention promise
- monetization philosophy
- scalability promise

#### Protected invariants
- Product vision không được mâu thuẫn trực tiếp với core fantasy và prototype goal đã chốt
- Không được dùng product vision để biện minh cho feature phá gameplay readability / fairness nếu chưa có yêu cầu rõ

#### Design goal
- [Mục tiêu là làm rõ game này dành cho ai, khác gì, vì sao người chơi muốn quay lại, và sản phẩm sẽ sống như thế nào trên mobile]

#### Source of truth
- Product definition / Design document

#### Dependencies / impact
- progression
- retention
- monetization
- content roadmap
- live ops direction

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

### 2.8 Design Pillars
- Pillar 1:
- Pillar 2:
- Pillar 3:
- Optional Pillar 4:
- Optional Pillar 5:
- Feature filter question:
  - Does this feature strengthen at least one pillar without weakening the others?

#### Current behavior
- [Điền hoặc Missing nếu chưa khóa chính thức]

#### Editable parameters
- số lượng pillar
- wording của từng pillar
- feature filter question

#### Protected invariants
- Pillar phải là nguyên tắc cấp sản phẩm, không chỉ là mô tả mechanic đơn lẻ
- Mỗi pillar phải đủ ngắn và đủ rõ để dùng làm tiêu chí chấp nhận / từ chối feature

#### Design goal
- [Mục tiêu là tạo bộ lọc cấp sản phẩm để loại feature không phù hợp, ưu tiên đúng hướng và giữ tính nhất quán của game]

#### Source of truth
- Product definition / Design document

#### Dependencies / impact
- feature prioritization
- mechanic changes
- UI/UX direction
- content selection
- roadmap decisions

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

### 2.9 Commercial Guardrails
- Retention boundary:
- Monetization boundary:
- Fairness / anti-pay-to-win boundary:
- Session pressure boundary:
- Scalability / content production boundary:
- Readability / UX boundary:

#### Current behavior
- [Điền hoặc Not decided / Not in current prototype]

#### Editable parameters
- retention philosophy
- monetization constraints
- fairness limits
- scalability constraints
- session pressure policy

#### Protected invariants
- Commercial guardrails không được mâu thuẫn với design pillars đã khóa
- Không được dùng guardrail để bỏ qua core fairness / readability nếu game vẫn dựa vào tactical decision-making

#### Design goal
- [Mục tiêu là khóa rõ các ranh giới thương mại để feature, economy, retention và live content không phá sản phẩm về fairness, clarity hoặc identity]

#### Source of truth
- Product definition / Design document

#### Dependencies / impact
- economy
- progression
- monetization
- retention systems
- live ops scope

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

## 3. Core Gameplay Loop
**Section source of truth:** Gameplay Logic + State Flow

### 3.1 Core loop
- Start from:
- Player action:
- System response:
- Reward:
- Loop back:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của core loop]

#### Source of truth
- Gameplay Logic
- State Flow

#### Dependencies / impact
- [Điền]

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 3.2 Meta loop
- End of level:
- Reward granted:
- Upgrade / selection:
- Next level / replay flow:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của meta loop]

#### Source of truth
- Gameplay Logic
- Config Data
- Persistence

#### Dependencies / impact
- [Điền]

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 3.3 Long-term progression loop
- Persistent resource:
- Permanent upgrades:
- Unlock structure:
- Return motivation:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của long-term progression]

#### Source of truth
- Persistence
- Config Data
- Gameplay Logic

#### Dependencies / impact
- [Điền]

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

## 4. Gameplay Mechanics
**Section source of truth:** Gameplay Logic

### 4.1 Controls
- Input type:
- Click / tap / drag behavior:
- Disabled input states:
- Confirmation rules:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của controls]

#### Source of truth
- UI Presentation
- State Flow

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 4.2 Core rules
- Turn structure:
- Action order:
- Priority rules:
- State transitions:
- Readable comparison rule:
- Actor scaling rule:
- Threat communication rule:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của core rules]

#### Source of truth
- Gameplay Logic
- State Flow

#### Edge cases
- [Điền]

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 4.3 Movement
- Move trigger:
- Range rule:
- Pathfinding rule:
- Reachable tile rule:
- Mid-path interactions:
- Move end condition:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của movement]

#### Source of truth
- Gameplay Logic
- State Flow
- Content Data

#### Dependencies / impact
- [Điền]

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 4.4 Combat
- Combat trigger:
- Combat flow:
- Attack order:
- Damage formula:
- Exit condition:
- Post-combat position/state:
- Baseline playtest reference:
- Actor stat schema:
- Fixed-by-archetype vs level-scaled stats:
- Visible combat readout:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của combat]

#### Source of truth
- Gameplay Logic
- Config Data
- State Flow

#### Dependencies / impact
- [Điền]

#### Edge cases
- [Điền]

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 4.5 Other mechanics
#### Mechanic name:
- Purpose:
- Trigger:
- Rules:
- Reward / consequence:
- Odds:
- Cap rule:
- Stack rule:
- Placement rule:
- Ownership:

##### Current behavior
- [Điền]

##### Editable parameters
- [Điền]

##### Protected invariants
- [Điền]

##### Design goal
- [Mục tiêu thiết kế của mechanic này]

##### Source of truth
- [Gameplay Logic / Config Data / Content Data / UI Presentation / Persistence / Mixed]

##### Dependencies / impact
- [Điền]

##### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 4.6 Win / Lose / Fail states / Retry flow
- Win condition:
- Lose condition:
- Fail state variants:
- Retry flow:
- Level restart behavior:
- Carry-over after fail:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của win/lose flow]

#### Source of truth
- Gameplay Logic
- State Flow
- UI Presentation

#### Dependencies / impact
- [Điền]

#### Edge cases
- [Điền]

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

## 5. Systems Design
**Section source of truth:** Config Data + Gameplay Logic + Persistence

### 5.1 Progression system
- In-run progression:
- Between-level progression:
- Permanent progression:
- Unlock logic:
- Entry power assumption / reference:
- Role of each progression layer:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của progression system]

#### Source of truth
- Config Data
- Gameplay Logic
- Persistence

#### Dependencies / impact
- [Điền]

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 5.2 Economy
- Currency types:
- Earn sources:
- Spend sinks:
- Carry-over rules:
- Inflation control:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của economy]

#### Source of truth
- Config Data
- Persistence

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 5.3 Inventory
- Has inventory:
- Inventory type:
- Capacity:
- Item persistence:
- Equip/use rules:

#### Current behavior
- [Điền hoặc Not in current prototype]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của inventory]

#### Source of truth
- Gameplay Logic
- State Flow
- Persistence

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 5.4 Upgrade
- Upgrade categories:
- Temporary / permanent:
- Upgrade source:
- Upgrade limits:
- Stack rules:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của upgrade]

#### Source of truth
- Config Data
- Gameplay Logic
- Persistence

#### Dependencies / impact
- [Điền]

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 5.5 Shop
- Has shop:
- Shop location:
- Shop inventory:
- Refresh rules:
- Purchase rules:

#### Current behavior
- [Điền hoặc Not in current prototype]

#### Editable parameters
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của shop]

#### Source of truth
- Config Data
- Gameplay Logic
- UI Presentation

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 5.6 Mission / quest
- Objective structure:
- Mission source:
- Reward:
- Tracking UI:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của mission/quest]

#### Source of truth
- Gameplay Logic
- Config Data
- UI Presentation

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 5.7 Energy / lives / timer
- Has energy/lives/timer:
- Consumption rule:
- Refill rule:
- Session pressure rule:

#### Current behavior
- [Điền hoặc Not in current prototype]

#### Editable parameters
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của energy/lives/timer]

#### Source of truth
- Config Data
- Persistence
- Gameplay Logic

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 5.8 Gacha / chest / reward tables
- Has chest/reward table:
- Trigger:
- Reward pool:
- Odds:
- Duplicate rule:
- Placement / delivery rule:
- Ownership rule:
- Cap / stack rule:

#### Current behavior
- [Điền hoặc Not in current prototype]

#### Editable parameters
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của reward table]

#### Source of truth
- Config Data
- Gameplay Logic
- UI Presentation

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 5.9 Difficulty scaling
- Difficulty drivers:
- Per level scaling:
- Per enemy scaling:
- Per reward scaling:
- Reference player power / entry assumption:
- Readability risk:
- Archetype silhouette / role clarity:
- Anti-frustration rules:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của difficulty scaling]

#### Source of truth
- Config Data
- Content Data
- Gameplay Logic

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

## 6. Content Structure
**Section source of truth:** Content Data + Config Data

### 6.1 Level / chapter / stage structure
- Number of levels:
- Grouping logic:
- Stage objective types:
- Transition flow:
- Replay rules:
- Primary map size:
- Test band / intended progression band:

#### Current behavior
- [Điền]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của level structure]

#### Source of truth
- Content Data
- Config Data

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 6.2 World map
- Has world map:
- Structure:
- Unlock path:
- Navigation rule:
- Visual vs gameplay role:

#### Current behavior
- [Điền hoặc Not in current prototype]

#### Editable parameters
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của world map]

#### Source of truth
- Content Data
- UI Presentation

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 6.3 Enemy types
#### Enemy type: [Name]
- Visual ID:
- Role:
- Base stats:
- Move rule:
- Level scaling rule:
- Combat rule:
- Visible power / badge rule:
- Target behavior attribute:
- Encounter intro:
- Reward / drop:

##### Current behavior
- [Điền]

##### Editable parameters
- [Điền]

##### Protected invariants
- [Điền]

##### Design goal
- [Mục tiêu thiết kế của enemy này hoặc của enemy movement]

##### Source of truth
- Config Data
- Content Data
- UI Presentation

##### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 6.4 Obstacles
#### Obstacle: [Name]
- Symbol / ID:
- Walkable or blocked:
- Trigger condition:
- Effect:
- Affects player / enemy / both:
- Duration:
- Visual feedback:

##### Current behavior
- [Điền]

##### Editable parameters
- [Điền]

##### Protected invariants
- [Điền]

##### Design goal
- [Mục tiêu thiết kế của obstacle này]

##### Source of truth
- Gameplay Logic
- Content Data
- UI Presentation

##### Edge cases
- [Điền]

##### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 6.5 Items / skills / characters
#### Item / Skill / Character: [Name]
- Type:
- Source:
- Placement rule:
- Effect:
- Duration:
- Cap rule:
- Stack rule:
- Ownership:
- UI feedback:

##### Current behavior
- [Điền]

##### Editable parameters
- [Điền]

##### Protected invariants
- [Điền]

##### Design goal
- [Mục tiêu thiết kế của item / skill / character này]

##### Source of truth
- Config Data
- Content Data
- Gameplay Logic
- UI Presentation

##### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

### 6.6 Boss design
- Has boss:
- Boss stage location:
- Boss identity:
- Mechanics:
- Phase structure:
- Reward:
- Difficulty role:

#### Current behavior
- [Điền hoặc Not in current prototype]

#### Editable parameters
- [Điền]

#### Protected invariants
- [Điền]

#### Design goal
- [Mục tiêu thiết kế của boss]

#### Source of truth
- Content Data
- Config Data
- Gameplay Logic
- UI Presentation

#### Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

## 7. UI / UX Structure
**Section source of truth:** UI Presentation + State Flow

### 7.1 Screen list
- Home
- Gameplay
- Combat
- Result
- Upgrade
- [Điền thêm]

### 7.2 HUD structure
- Top HUD:
- Context panel:
- Action buttons:
- Modal / popup:
- Visible power / threat readout:
- Secondary danger cue / warning cue:

### 7.3 UI state rules
- Before roll:
- During movement:
- During combat:
- On reward:
- On win:
- On lose:
- Observation-only state:

### 7.4 Current behavior
- [Điền]

### 7.5 Editable parameters
- text
- layout
- animation timing
- visibility rules
- highlight styles
- power display formula
- secondary danger cue / warning cue

### 7.6 Protected invariants
- UI không được tự đổi gameplay logic
- UI chỉ đọc từ approved state / selectors

### 7.7 Design goal
- [Mục tiêu thiết kế của UI/UX hiện tại]

### 7.8 Source of truth
- UI Presentation
- State Flow

### 7.9 Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

## 8. Technical Architecture for AI Dev
**Section source of truth:** Codebase structure + module ownership

### 8.1 Architecture overview
- Presentation layer
- State / orchestration layer
- Domain / gameplay rules layer
- Data / config layer
- Persistence layer
- Shared types / schema

### 8.2 File/module ownership
- Language:
- Render:
- UI files:
- Rule files:
- Data files:
- Save files:
- Shared contracts:
- Folder/module structure:

### 8.3 Editable boundaries
#### UI request
- Allowed:
- Forbidden:
- Source of truth:
  - UI Presentation
  - State Flow

#### Data request
- Allowed:
- Forbidden:
- Source of truth:
  - Config Data
  - Content Data

#### Mechanic request
- Allowed:
- Forbidden:
- Source of truth:
  - Gameplay Logic
  - State Flow

#### Win/Lose request
- Allowed:
- Forbidden:
- Source of truth:
  - Gameplay Logic
  - UI Presentation

### 8.4 Protected invariants
- State schema:
- Level data schema:
- Save schema:
- Core architecture boundaries:

### 8.5 Design goal
- [Mục tiêu thiết kế của architecture đối với AI Dev editing]

### 8.6 Current behavior
- [Điền]

### 8.7 Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

## 9. Acceptance Criteria / Regression Checklist

### 9.1 Gameplay
- [Điền]

### 9.2 UI
- [Điền]

### 9.3 Data
- [Điền]

### 9.4 Persistence
- [Điền]

### 9.5 Readability / fairness
- [Điền]

### 9.6 Regression rules
- Ngoài scope không được thay đổi
- Nếu có impact chéo, phải nêu rõ
- Không phá protected invariants

### 9.7 Source of truth
- Mixed

### 9.8 Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

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
- [Điền]

### 10.2 Protected invariants
- Không tự vượt scope
- Không sửa lan sang section khác
- Không đổi source of truth nếu không có yêu cầu rõ

### 10.3 Source of truth
- Design document + module ownership rules

### 10.4 Current status
- Filled / Partial / Missing / Conflict / Not in current prototype

---

## 11. Consolidated Questions for User
**Lưu ý:** Tất cả câu hỏi phải nằm ở đây, không được chen vào các section phía trên.

### 11.1 Questions by section
#### 1. Document Control
- [Điền câu hỏi còn thiếu]

#### 2. Game Overview
- [Điền câu hỏi còn thiếu]

#### 2.7 Product Vision & Market Fit
- [Điền câu hỏi còn thiếu]

#### 2.8 Design Pillars
- [Điền câu hỏi còn thiếu]

#### 2.9 Commercial Guardrails
- [Điền câu hỏi còn thiếu]

#### 3. Core Gameplay Loop
- [Điền câu hỏi còn thiếu]

#### 4. Gameplay Mechanics
- [Điền câu hỏi còn thiếu]

#### 5. Systems Design
- [Điền câu hỏi còn thiếu]

#### 6. Content Structure
- [Điền câu hỏi còn thiếu]

#### 7. UI / UX Structure
- [Điền câu hỏi còn thiếu]

#### 8. Technical Architecture for AI Dev
- [Điền câu hỏi còn thiếu]

#### 9. Acceptance Criteria / Regression Checklist
- [Điền câu hỏi còn thiếu]

#### 10. AI Dev Prompt Contract
- [Điền câu hỏi còn thiếu]

### 11.2 Question rules
- Chỉ hỏi phần còn thiếu hoặc mâu thuẫn
- Không hỏi lại những gì user đã trả lời
- Ưu tiên phần ảnh hưởng implementation trước
- Mỗi câu hỏi chỉ hỏi 1 vấn đề chính
- Nếu cần khóa rule hoặc làm rõ nhanh, đưa **5 lựa chọn A, B, C, D, E** để user chọn nhanh hoặc trả lời khác
