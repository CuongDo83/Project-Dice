# Magic Survival Skill System Framework — Consolidated for Game Design Use

- Document version: 1.0.0
- Last updated: 2026-04-03
- Purpose: Tổng hợp toàn bộ framework của hệ thống skill trong *Magic Survival* theo hướng game designer, để dùng làm nguồn tham chiếu khi thiết kế hệ thống skill / build / draft cho game khác như DiceBound.
- Source type: Reverse-engineered framework từ community wiki + community discussion, **không phải design doc chính thức của dev**.
- Reliability note:
  - Các phần ghi **Source-backed** là thông tin đọc được trực tiếp từ wiki/community sources.
  - Các phần ghi **Design interpretation** là suy luận framework ở góc game design dựa trên dữ liệu hiện có.

---

## Changelog

### v1.0.0 — 2026-04-03
- Consolidated toàn bộ nội dung đã phân tích trong chat thành một framework hoàn chỉnh.
- Gom lại theo cấu trúc game-designer-friendly: layers, phases, random/control, recovery, family signaling, commit system, unknowns, và lessons for DiceBound.
- Tách rõ phần nào là source-backed, phần nào là design interpretation.

---

## 1. Executive Summary

## 1.1 Framework statement

**Magic Survival không vận hành như một skill tree cố định.**
Nó là một **multi-layer draft build system** trong đó:

1. người chơi được đưa ra các lựa chọn magic/passive trong run,
2. các offensive/utility skills tạo thành engine ban đầu,
3. regular passives tạo chassis nền,
4. special passives và artifacts tạo family identity,
5. fusion ép người chơi commit build,
6. class / subject / research bias build từ trước run,
7. growth passives giữ cho run không dead progression sau khi build đã hoàn thiện.

## 1.2 Short-form model

```text
Meta bias (Class / Subject / Research)
        +
Random draft layer (level-up choices)
        +
Core spell layers (Offensive / Utility)
        +
Chassis layer (Regular Passives)
        +
Family amplifier layer (Special Passives / Artifacts)
        +
Commit layer (Fusion at 25/50/75)
        +
Late scaling layer (Growth Passives after 100)
```

## 1.3 Why this system feels deep

Design interpretation:

Hệ này sâu không phải vì có quá nhiều skill gốc, mà vì nó chồng nhiều lớp quyết định lên nhau:
- chọn **đánh kiểu gì**,
- chọn **skill đó sẽ đóng vai trò gì**,
- chọn **build family nào**,
- chọn **hy sinh gì để commit fusion**,
- rồi mới tối ưu hóa engine đã commit.

---

## 2. Source-Backed Core Facts

## 2.1 Magic taxonomy

Source-backed:
- Có **51 spells** tổng cộng trên trang Magic.
- Gồm:
  - **17 offensive magics**
  - **4 utility magics**
  - **8 regular passive magics**
  - **22 special passive magics**
- Trang Magic cũng có mục riêng cho **Growth Passive Magics**.

## 2.2 Fusion windows

Source-backed:
- Magic Combination / Fusion mở tại **character level 25, 50, 75**.
- Fusion kết hợp **2 max level spells**.
- Một spell là **Primary** được cường hóa.
- Spell còn lại là **Secondary** bị mất và không thể dùng / combine tiếp.
- Wiki hiện ghi có **60 fusions** trên trang Magic Combination.

## 2.3 Meta systems

Source-backed:
- **Classes**: có **24 classes**.
- **Subjects**: có **25 subjects**; mỗi subject cho **starting artifact**, và khi unlock còn cho **permanent stat boost** kể cả khi subject đó không được chọn.
- **Research**: là permanent upgrades; có **20 perks**.

## 2.4 Recovery / level-up control

Source-backed:
- **MP Taken** là lựa chọn cuối trên màn level-up.
- Chọn MP Taken cho thêm MP theo % hiển thị; community/wiki mô tả điều này giúp giảm yêu cầu MP của level kế tiếp khoảng **1/4**.
- Một số class / research / artifact có thể tăng cơ hội có **4 magic choices** trên màn level-up.

## 2.5 Growth scaling

Source-backed:
- Sau mốc **level 100**, game vẫn có lớp **Growth Passives / Additional Passives** để tiếp tục tăng các stat nền.

---

## 3. The 5 Core Layers

> Ghi chú: Trong framework này, **Growth Passives không được xem là lớp thứ 6 riêng**, mà là **late extension của Regular Passives**.

## 3.1 Layer 1 — Offensive Skills

### Source-backed
- Đây là nguồn damage chính của build.
- Có 17 offensive magics.
- Phần lớn offensive có cadence nâng cấp đến **max level 7**.

### Framework role
- Dựng **damage engine**.
- Trả lời câu hỏi: **“Mình đánh kiểu gì?”**

### Design function
- Quy định fantasy chiến đấu chính của run.
- Quy định vector clear enemies ban đầu.
- Là nguyên liệu chính cho specialization và fusion.

### Example interpretations
- projectile core
- beam core
- orbit core
- zone core
- summon/companion-like core
- AoE burst core

---

## 3.2 Layer 2 — Utility Skills

### Source-backed
- Có 4 utility magics.
- Utility max level 5.
- Utility thiên về buff offense/defense hoặc thay đổi trạng thái combat hơn là làm core DPS thuần.

### Framework role
- Dựng **tempo / survival / state control layer**.
- Trả lời câu hỏi: **“Làm sao mình sống đủ lâu và vận hành build này mượt hơn?”**

### Design function
- Giữ cho run không gãy sớm.
- Tạo panic button / survival window / offense amp window.
- Sau mid game, utility trở thành support engine thay vì chỉ là “cứu mạng”.

---

## 3.3 Layer 3 — Regular Passives

### Source-backed
- Có 8 regular passive magics.
- Bao gồm các nhóm buff nền như ATK, cooldown, HP, movement speed, size, duration, crit, pickup range.

### Framework role
- Dựng **chassis layer** cho build.
- Trả lời câu hỏi: **“Build này cần nền nào để chạy ổn?”**

### Design function
- Tạo các lựa chọn universal hoặc semi-universal.
- Giúp build sống được ngay cả khi draft xấu.
- Là lớp tối ưu hóa chính sau khi build đã commit.
- Ở hậu kỳ, lớp này tiếp tục sống dưới dạng Growth Passives.

---

## 3.4 Layer 4 — Special Passives

### Source-backed
- Có 22 special passive magics.
- Mỗi special passive thường chỉ có 1 level.
- Nhiều special passive buff theo **họ magic / family**.
  - Ví dụ: fire family, lightning family, nature family, energy family.

### Framework role
- Dựng **family amplifier layer**.
- Trả lời câu hỏi: **“Build này thuộc family nào, và family đó được khuếch đại ra sao?”**

### Design function
- Dạy người chơi rằng các spell được gom thành những “họ build” hợp lệ.
- Đẩy build từ mức collection sang mức identity.
- Làm cho player hiểu “mình đang đi Fire”, “mình đang đi Lightning”, “mình đang đi Energy”...

---

## 3.5 Layer 5 — Fusion

### Source-backed
- Fusion là lựa chọn thêm tại level 25, 50, 75.
- Fusion ghép 2 max level spells.
- Primary được cường hóa.
- Secondary bị mất và không dùng / combine tiếp được.

### Framework role
- Dựng **commit layer**.
- Trả lời câu hỏi: **“Mình sẵn sàng hy sinh cái gì để khóa identity build?”**

### Design function
- Tạo opportunity cost thật.
- Chuyển build từ “nhặt thứ tốt” sang “commit recipe”.
- Là nơi mạnh nhất để tạo build identity.

---

## 4. Phase Framework — How the 5 Layers Move Through a Run

## 4.1 Phase 1 — Early Run

### Main goal
- dựng damage core
- sống sót
- trả lời: **“Đánh kiểu gì?”**

### Layer roles
- **Offensive skills** → Main driver
- **Utility skills** → Survival / tempo support
- **Regular passives** → Early chassis
- **Special passives** → Có thể xuất hiện nhưng chưa là trọng tâm
- **Fusion** → Chưa active

### Design interpretation
Đây là phase mà player thường đang:
- lấy 1–2 offensive cores,
- lấy 1 utility hoặc 1–2 passive nền,
- cố gắng không chết trước khi build thành hình.

---

## 4.2 Phase 2 — Mid Run

### Main goal
- bắt đầu chuyên hóa
- trả lời: **“Skill này sẽ đóng vai trò gì?”**

### Layer roles
- **Offensive skills** → bắt đầu branch / attribute shaping
- **Utility skills** → bắt đầu role specialization
- **Regular passives** → support specialization
- **Special passives** → bắt đầu có giá trị lớn vì family identity xuất hiện
- **Fusion** → recipe prep starts

### Notes
- Đây là phase của **breakpoints**.
- Nhiều offensive chạm attribute ở mốc cuối.
- Utility thường chạm breakpoint sớm hơn vì cadence max level 5.
- **Magic Bolt** là ngoại lệ lớn: có nhiều attribute windows hơn chuẩn, nên branch sớm hơn.

---

## 4.3 Phase 3 — Commit Window

### Main goal
- chuyển build từ collection sang identity
- trả lời: **“Mình commit build nào?”**

### Layer roles
- **Fusion** → central layer
- **Offensive skills** → fusion materials
- **Utility skills** → support hoặc đôi khi là materials
- **Regular passives** → tạm lùi vai trò
- **Special passives** → direction signal / family confirmation

### Design interpretation
Đây là phase có sức nặng quyết định lớn nhất vì người chơi:
- phải chấp nhận mất spell Secondary,
- phải khóa hướng build,
- phải ngừng giữ quá nhiều phương án mở.

---

## 4.4 Phase 4 — Optimization

### Main goal
- tối ưu engine đã commit
- trả lời: **“Làm sao để engine này chạy hiệu quả nhất?”**

### Layer roles
- **Offensive / Utility / Fusion** → engine being optimized
- **Regular passives** → main optimization layer
- **Special passives** → family amplifier mạnh nhất ở phase này
- **Class / Artifact bonuses** → biến opening bias thành efficiency thật

### Design interpretation
Đây là phase mà regular passives và special passives đạt giá trị cao nhất vì build identity đã rõ.

---

## 4.5 Phase 5 — Endless Scaling

### Main goal
- giữ progression không chết sau khi khung build đã hoàn thiện
- trả lời: **“Mình tiếp tục kéo build theo chiều nào?”**

### Layer roles
- **Offensive / Utility / Fusion** → stable engine, không còn là nguồn identity mới chính
- **Regular passives** → tiếp tục scale dưới dạng Growth Passives
- **Special passives** → phần lớn giữ giá trị đã có, không phải nguồn endless scaling chính

### Design interpretation
Đây không phải là phase “mở lớp gameplay mới”, mà là phase **kéo dài lớp chassis**.

---

## 5. Random Draft Layer vs Control Layer

## 5.1 Random Draft Layer

### Source-backed / partially backed
- Player nhận các lựa chọn magic / passive trên màn level-up.
- Website/community cho thấy màn chọn thường có **3 đến 4 choices** tùy điều kiện.
- Website **không công khai weight chính xác của từng skill**.

### Design meaning
Game có RNG ở đầu vào lựa chọn.
Build không hoàn toàn cố định từ đầu run.

---

## 5.2 Control Layer

### Source-backed
Các lớp làm giảm sự phụ thuộc hoàn toàn vào RNG gồm:
- **Class** → cho opening bias
- **Subject** → cho starting artifact + permanent stat bias
- **Research** → cho permanent baseline bias
- **Artifacts** → run-wide amplification
- **MP Taken** → safety valve khi level-up options xấu
- **Fusion recipes** → constrain build theo recipe cố định

### Design meaning
Hệ này **không random hoàn toàn từ đầu đến cuối game**.
Nó là một hệ **semi-random draft with bias and constraints**.

---

## 6. Bad Draft Recovery

## 6.1 Definition

**Bad draft recovery** = khả năng của hệ thống cho người chơi cứu build khi draft bị xấu.

Tức là khi người chơi:
- chưa ra đúng offensive core,
- pick lệch vài lượt,
- thiếu recipe piece,
- hoặc gặp level-up options rất tệ,

game vẫn cho họ đường sống để run không gãy hoàn toàn.

## 6.2 Recovery tools in Magic Survival

### Source-backed / supported
- **Regular passives**: nhiều passive có giá trị khá rộng.
- **Utility skills**: giúp sống sót khi build chưa xong.
- **MP Taken**: cho phép skip bad choices để lấy thêm tempo XP/MP.
- **Class / Research / Subject / Artifact bias**: giúp build bắt đầu với xu hướng tốt hơn.

## 6.3 MP Taken's exact role

MP Taken là:
- **draft safety valve**
- **RNG forgiveness mechanic**
- **một local recovery tool**, không phải toàn bộ recovery system

Nó giúp người chơi:
- không bị ép pick rác,
- lên level tiếp nhanh hơn,
- mua thêm thời gian để roll ra lựa chọn phù hợp hơn.

Nó **không tự giải quyết hết** mọi vấn đề draft xấu như:
- thiếu engine damage thật sự,
- thiếu survivability ngay lập tức,
- thiếu fusion material đúng recipe.

---

## 7. Spell Design Grammar

## 7.1 Standard offensive grammar

Design interpretation, source-supported:

Một offensive skill thường đi theo mô hình:

```text
Acquire skill
→ tăng các chỉ số như damage / number / size / interval / duration
→ mở attribute ở breakpoint cuối
```

### Design function
- early levels: làm người chơi cảm thấy spell đang mạnh lên rõ ràng
- breakpoint cuối: đổi từ tăng số sang đổi vai trò

---

## 7.2 Standard utility grammar

Utility thường đi theo mô hình:

```text
Acquire utility
→ tăng cooldown efficiency / duration / state value
→ mở attribute / specialization ở breakpoint cuối
```

### Design function
- utility không cần làm core DPS
- utility tạo tempo, survival, offense amp, reset window, hoặc emergency layer

---

## 7.3 Special case: Magic Bolt

### Source-backed
Magic Bolt là trường hợp ngoại lệ nổi bật trong community descriptions:
- nó có nhiều lần attribute / branching hơn grammar chung
- vì vậy đóng vai trò như một teaching spell cho branching + combination thinking

### Design meaning
Magic Bolt cho thấy dev chấp nhận có **exception-based tutorial skill** trong hệ.
Nghĩa là không nhất thiết mọi spell phải tuân cùng một cadence cứng.

---

## 8. Family Signaling Framework

## 8.1 Why family signaling matters

Magic Survival không chỉ cho nhiều spell rời rạc.
Nó còn tạo ra cảm giác rằng có những **họ build hợp lệ**.

## 8.2 Family signaling sources

### Source-backed
- **Special passives** buff theo nhóm spell families.
- **Artifacts** cũng thường buff theo family hoặc theo spell cụ thể.
- **Classes** thường bias theo một core magic nào đó.
- **Subjects** cũng cho starting artifact và stat bias theo hướng tương ứng.

## 8.3 Design interpretation

Đây là framework rất quan trọng:
- spell không chỉ có giá trị riêng lẻ,
- mà còn được game “gợi ý” nên ghép thành team/family.

Điều này giúp:
- giảm cognitive load,
- dạy synergy không cần tutorial quá dài,
- giúp player nhận ra build direction nhanh hơn.

---

## 9. Artifacts as Run-Wide Amplification Layer

## 9.1 Source-backed
Artifacts có thể rơi trong run và có nhiều loại hiệu ứng:
- buff ATK / HP / cooldown,
- buff magic-specific,
- buff family-specific,
- thêm effect kích hoạt mới,
- thêm random spell casts,
- hoặc mở utility/combat hooks đặc biệt.

## 9.2 Framework role

Artifacts **không chỉ là optimization layer cuối game**.
Nên xem chúng là một **run-wide amplification layer** ảnh hưởng xuyên suốt nhiều phase.

## 9.3 Design interpretation

Artifacts giúp hệ build không chỉ xoay quanh level-up picks.
Chúng thêm một nguồn biến số ngoài draft chính, nhưng vẫn reinforce build identity qua family buffs hoặc spell-specific buffs.

---

## 10. Meta Bias Layer

## 10.1 Class

### Source-backed
- 24 classes
- class có thể cho spell Lv+1
- class có thể buff cooldown / number / damage
- một số class tác động vào chance có 4 magic choices
- một số class buff hẳn combination damage

### Framework role
- opening bias
- identity bias trước run
- giảm RNG ngay từ giai đoạn draft đầu

---

## 10.2 Subject

### Source-backed
- 25 subjects
- mỗi subject cho starting artifact
- unlock subject còn cho permanent stat boost kể cả khi không chọn subject đó cho run hiện tại
- subject được chọn không cần trùng class

### Framework role
- loadout bias
- build pre-tilt
- giúp run bắt đầu với một vector rõ hơn

---

## 10.3 Research

### Source-backed
- 20 perks
- là permanent upgrades mua bằng Gold

### Framework role
- baseline smoothing
- permanent RNG forgiveness
- long-term account progression layer

---

## 11. What Is Known vs Unknown

## 11.1 Known / strongly supported

- số lượng offensive / utility / passive layers
- 3 fusion windows tại 25 / 50 / 75
- primary enhanced, secondary lost
- class / subject / research tồn tại như meta bias layer
- MP Taken là recovery safety valve
- game có growth passives / additional passives sau level 100

## 11.2 Unknown / not confirmed from website

- **weight chính xác của từng skill** trong draft
- tỷ lệ xuất hiện chính xác của từng offensive / utility / passive
- sau khi fusion xong thì **base skills có còn có thể xuất hiện lại trong draft hay không** (website không xác nhận rõ)
- exact hidden rules của pool filtering / reroll weighting

## 11.3 How to treat unknowns in design reference

Khi dùng tài liệu này cho design work:
- dùng phần **known** như framework structural reference
- không nên copy giả định về exact odds / hidden weights nếu chưa có datamine hoặc source chính thức

---

## 12. Lessons for Designing a Similar System for DiceBound

> Phần này là **design interpretation**, không phải mô tả của Magic Survival.

## 12.1 What should be borrowed structurally

### Borrow 1 — Multi-layer build, not flat upgrade list
Thay vì chỉ có một pool item/upgrade phẳng, nên tách rõ:
- core engine layer
- utility/tempo layer
- chassis layer
- family amplifier layer
- commit layer

### Borrow 2 — Phase-aware build progression
Hệ build nên có các phase rõ:
- early: pick cách chơi
- mid: pick vai trò
- commit: khóa identity
- optimization: tối ưu identity
- late: kéo dài identity

### Borrow 3 — Strong family signaling
Nếu muốn người chơi hiểu build nhanh, nên có lớp signal rõ:
- passive buff theo family
- item buff theo family
- loadout bias theo family

### Borrow 4 — Recovery tools
Nếu build có draft ngẫu nhiên, phải có:
- universal picks
- survival layer
- skip bad choice / tempo option kiểu MP Taken
- meta bias giúp run không bắt đầu từ zero variance

### Borrow 5 — Commit with cost
Điểm rất mạnh của Magic Survival là **identity có cost thật**.
Nếu áp dụng cho DiceBound, nên có cơ chế tương đương bag-slot pressure / replacement / fusion-like sacrifice / cap-limited commitment.

---

## 12.2 What should NOT be copied blindly

### Do not copy 1 — Hidden odds assumptions
Website không công khai exact skill weights, nên không nên học sai rằng “phải random y hệt như vậy”.

### Do not copy 2 — Skill count as depth by itself
Chiều sâu của Magic Survival không đến từ “nhiều spell”, mà từ **nhiều lớp quyết định**.

### Do not copy 3 — Commit too early without recovery
Nếu commit quá sớm mà không có recovery, người chơi dễ cảm thấy bị RNG giết.

---

## 13. Reusable Designer Checklist

Khi thiết kế một hệ build lấy cảm hứng từ Magic Survival, hãy kiểm 10 câu sau:

1. Core engine layer của người chơi là gì?
2. Utility / tempo layer có tồn tại không?
3. Có lớp chassis đủ rộng để cứu bad draft không?
4. Game có dạy người chơi family identity không?
5. Có lớp amplifier riêng cho family không?
6. Có commit layer thật sự hay chỉ là nhặt đồ tốt?
7. Commit có cost thật không?
8. Có safety valve khi level-up options xấu không?
9. Có meta bias layer ngoài run không?
10. Sau khi build hoàn chỉnh, progression còn tiếp tục được không?

---

## 14. Final Consolidated Model

```text
OUT-OF-RUN META BIAS
  ├─ Class
  ├─ Subject
  └─ Research

RUN-WIDE AMPLIFICATION
  └─ Artifacts

IN-RUN BUILD LAYERS
  ├─ Offensive Skills      = damage engine
  ├─ Utility Skills        = tempo / survival / state control
  ├─ Regular Passives      = chassis / broad optimization
  ├─ Special Passives      = family amplifier
  └─ Fusion                = commit identity

PROGRESSION PHASES
  Phase 1  Early Run       = choose how to fight
  Phase 2  Mid Run         = choose what role the skill will play
  Phase 3  Commit Window   = choose identity via fusion
  Phase 4  Optimization    = optimize committed engine
  Phase 5  Endless Scaling = continue scaling via Growth Passives

RECOVERY / RNG CONTROL
  ├─ MP Taken
  ├─ broad regular passives
  ├─ utility survival tools
  └─ meta bias from class/subject/research/artifacts
```

---

## 15. Source Notes

Primary community sources used for this framework:
- Magic page
- Magic Combination page
- Classes page
- Subject page
- Research page
- Artifact page
- MP Taken page
- selected community discussion on Additional / Growth Passives

This document intentionally avoids pretending to know hidden weights or unpublished formulas that are not clearly stated in public community sources.
