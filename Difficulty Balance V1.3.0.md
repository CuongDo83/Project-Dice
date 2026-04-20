# Difficulty Balance V1.3.0

- Project: DiceBound
- Framework version: 1.3.0
- Based on source version: DiceBound GDD v1
- Last updated: 05/04/2026
- Purpose: Framework hợp nhất để **hỏi đúng thông tin trước khi tạo màn chơi**, sau đó sinh ra:
  - level balance summary
  - wave-by-wave difficulty table
  - layout / placement review
  - 2D matrix level design
  - updated difficulty score aligned with current GDD v1 systems
- Scope của framework này:
  - tạo **level spec ở mức content + layout + balance summary**
  - đánh giá difficulty ở **cấp toàn level**
  - dùng **bảng từng wave** để giải thích tại sao level khó / dễ hơn
  - giữ được:
    - tactical option
    - lucky feeling
    - readability / fairness
    - anti-frustration
- Không dùng framework này để tự suy diễn feature mới ngoài source-of-truth hiện hành.

---

## Changelog

### v1.3.0 — 05/04/2026
- Rebased framework from **Difficulty Balance V1.2.0** to the current **DiceBound GDD v1** source-of-truth.
- Replaced the old score core `ESP + ECP - MO + RR` with a new 2-layer model:
  - **Raw Combat Pressure**
  - **Growth / Recovery Relief**
- Added numeric-scoring participation for:
  - **Battlefield Bag Opportunity (BO)**
  - **Heal Opportunity (HO)**
  - **Tempo / Phase Pressure (TPP)** from Day / Night exposure
  - **Layout / Placement Risk (LPR)** at level level
- Updated enemy-pressure reading to use the current GDD threat-band logic:
  - `Low < 80%`
  - `Mid = 80%–120%`
  - `High > 120%`
  relative to current player power.
- Updated mystery scoring so carry-over mystery can affect effective comeback value instead of being review-only.
- Kept wave-by-wave review, matrix notation, anti-frustration gate, and layout / placement gate from v1.2.0.
- Narrowed the missing-from-source notes:
  - battlefield bag is no longer treated as TBD for scoring inclusion
  - exact telegraphed-spawn overlap runtime handling is still unresolved
  - deferred `%` enemy-damage-range rule remains unresolved and must not be invented here
  - anti-bad-draft valves beyond the current bag framework are still not approved rules

### v1.2.0 — Previous baseline
- Unified level design + difficulty balance.
- Used wave-aware layout review and 2D matrix notation.
- Used a simpler score core where battlefield bag and heal potion were review-only.

---

## 1. Source-of-truth constraints

Framework này chỉ dùng các thông tin hiện đã có trong source hiện tại:

- Game là turn-based tactical grid game.
- Core loop hiện hành là:
  - `Roll -> Drag path -> Release to commit -> Move -> Resolve -> Enemy Turn`
- Level hiện có thể gồm **nhiều wave cố định**.
- Nếu clear một wave chưa phải wave cuối:
  - các vị trí spawn của wave kế tiếp được đánh dấu bằng **dấu `X` đỏ**
  - trong **1 full player turn**
  - player vẫn được chơi turn bình thường
  - telegraph chỉ hiện vị trí, **không hiện exact enemy info**
- Mystery cell:
  - được đặt theo từng wave
  - **chưa ăn** thì giữ lại sang wave sau trong cùng level
  - chỉ player nhận
  - reward pool hiện hành:
    - `+1 HP = 34%`
    - `+1 min DMG = 33%`
    - `+1 max DMG = 33%`
- Heal potion:
  - enemy chết có `30%` chance tạo heal potion
  - heal potion hồi `+1 HP`, clamp ở max HP
  - heal potion spawn ở 1 ô orthogonal hợp lệ quanh xác enemy
- Battlefield bag:
  - enemy chết mở reward flow qua bag UI
  - normal items có `Lv1 -> Lv3`
  - bag active hiện có `4` slot
  - bag có `1 progress + 1 recovery + 1 wildcard` offer structure
  - current GDD đã khóa item pool, numeric values, offer weights, phase bias, fusion-ready flow, và fusion bonuses
- Difficulty vẫn phải giữ:
  - readable
  - fair
  - không cho player biết chắc thắng / thua ngay từ đầu chỉ bằng 1 phép tính tĩnh
- Anti-frustration direction hiện hành:
  - trong `1-2` lượt đầu phải có ít nhất `1` route hợp lệ không dẫn ngay đến combat bất lợi rõ ràng, hoặc có route sớm tới reward / mystery
  - roll thấp ở lượt đầu / lượt sớm không được bắt player va chạm combat / trap nặng ngay mà không có lựa chọn né hợp lệ
- Stat guardrails hiện hành vẫn phải giữ:
  - player DMG width cap theo Slime HP reference
  - player DMG band `50% -> 100%`
  - mystery fallback rules
  - Slime survivability anchor
  - Fire strongest-damage anchor
  - enemy DMG band `70% -> 100%`
- Enemy scaling hiện hành:
  - enemy level tăng `HP +1` mỗi level
  - enemy level tăng `DMG +1` mỗi `2` level
  - `moveSpeed` giữ cố định theo archetype identity
  - enemy stats sau đó được đọc lại theo threat bands so với current player power
- Global phase pressure hiện hành:
  - level bắt đầu ở `Day`
  - chu kỳ `4` full Day rounds -> `2` full Night rounds
  - trong Night, enemy được `x2` move-speed range và `x2` damage range

---

## 2. Framework direction

### 2.1 Core principle

Framework này xem **difficulty** là kết quả của **2 lớp gộp lại**:

1. **Raw Combat Pressure**
   - enemy stat pressure
   - enemy count pressure
   - tempo / phase pressure
   - readability risk

2. **Growth / Recovery Relief**
   - mystery opportunity
   - battlefield bag opportunity
   - heal opportunity

Sau đó cộng thêm **level-level modifiers**:
- wave count pressure
- layout / placement risk

### 2.2 Important design rule

> Cùng một composition enemy, nhưng nếu:
> - đặt khác vị trí,
> - chia wave khác nhau,
> - mystery đặt khác chỗ,
> - warning turn có / không có giá trị chuẩn bị,
> - bag progress window xuất hiện sớm / muộn khác nhau,
> thì **độ khó thực tế và cảm giác level sẽ khác**.

Vì vậy:
- **không được** coi level chỉ là “bao nhiêu enemy mỗi loại”
- **phải** review cả layout / placement, growth windows, và phase timing như một phần của difficulty

### 2.3 Interpretation rule

- **Score** = tóm tắt pressure sau khi đã tính cả cửa mạnh lên / hồi phục
- **Wave table** = giải thích pressure theo từng nhịp
- **Layout / placement review** = quyết định level có chơi ổn hay không
- **Matrix** = công cụ thiết kế và truyền đạt level
- **Bag / heal** = đã đi vào score ở mức heuristic, nhưng vẫn phải review bằng notes chứ không chỉ nhìn số

---

## 3. Khi nào phải hỏi lại trước khi tạo level

Theo workflow của project:
- nếu chưa rõ mechanic / section / design goal bị tác động -> phải hỏi lại
- nếu tạo file mới -> phải có changelog
- nếu update tài liệu -> phải rõ versioning / changelog

Với task tạo level, luôn xem đây là task chạm vào:
- **5.9 Difficulty scaling**
- **6.1 Level structure**
- **6.3 Enemy types**
- **6.5 Mystery / reward placement**
- **5.8 Reward tables / bag opportunity**
- **7. UI / readability / warning cue**
- và có thể kéo theo **anti-frustration / fairness**

---

## 4. Mandatory Intake Questions

> Chỉ hỏi những câu dưới đây trước khi sinh level spec.
> Nếu user đã trả lời rồi thì không hỏi lại.

### 4.1 Nhóm câu hỏi bắt buộc

1. **Level này là màn standalone để test feeling, hay là một màn trong chuỗi level hiện tại?**
   - Standalone feeling test
   - Level trong chuỗi hiện tại

2. **Nếu là level trong chuỗi hiện tại, đây là level số mấy?**
   - Nhập chỉ số level

3. **Target difficulty của cả level là gì?**
   - Very Easy
   - Easy
   - Medium
   - Hard
   - Very Hard

4. **Level này phải khó hơn, dễ hơn, hay ngang band với level trước?**
   - Harder than previous
   - Same band, different texture
   - Easier relief
   - Standalone, không so level trước

5. **Level này có bao nhiêu wave?**
   - Nhập số wave

6. **Mục tiêu thiết kế chính của level là gì?**
   - tăng pressure từ số lượng enemy
   - tăng pressure từ stat enemy
   - tăng pressure từ phase timing / Day-Night
   - giữ raw pressure tương tự nhưng tăng lucky swing
   - tăng tactical choice qua layout / placement
   - boundary test / fairness stress test

7. **Khi chấm difficulty, dùng player entry state nào?**
   - snapshot từ GDD hiện hành
   - snapshot từ chain trước đó
   - override do user cung cấp

8. **Nếu không dùng snapshot mặc định, expected player entry snapshot là gì?**
   - `hp`
   - `dmgMin`
   - `dmgMax`
   - visible power / power formula đang dùng
   - current bag state nếu có chain continuity

9. **Có cho phép dùng đủ archetype hiện tại không?**
   - Slime / Wind / Worm / Fire
   - hoặc user chỉ định subset

10. **Lucky feeling của level này muốn ở mức nào?**
    - Low
    - Medium
    - High

11. **Mystery của level này nên thiên về cảm giác nào?**
    - survivability swing (`+HP`)
    - stability swing (`+min DMG`)
    - spike swing (`+max DMG`)
    - mixed / theo odds hiện hành

12. **Level này có cần ưu tiên anti-frustration mạnh hơn bình thường không?**
    - Có
    - Không

13. **User chỉ cần balance summary, hay cần full layout / placement spec?**
    - balance summary only
    - full layout / placement spec

14. **Có cho phép special tiles không?**
    - Không
    - Có, nhưng chỉ review ngoài scoring core
    - Có, và user sẽ chỉ rõ tile rule / density

15. **Output có cần 2D matrix không?**
    - Có
    - Không

16. **Level này có muốn bag progress feel ở mức nào?**
    - low bag progress
    - medium bag progress
    - high bag progress

17. **Wave này / level này có chủ ý đẩy người chơi vào Night pressure không?**
    - mostly Day
    - mixed
    - Night-facing

### 4.2 Câu hỏi bổ sung khi thiếu dữ liệu

18. **Level trước có summary gì?**
- wave count
- enemy composition
- mystery count
- target feeling
- final difficulty tier
- bag state nếu level chain liên tục

19. **Mỗi wave có mục tiêu feel khác nhau không?**
- wave mở màn an toàn hơn
- wave giữa là pressure chính
- wave cuối là spike
- hoặc user mô tả khác

20. **Bạn có muốn mystery tập trung sớm, giữa, hay cuối level?**
- early
- mid
- late
- distributed

21. **Bạn có muốn warning turn của wave mới chủ yếu dùng để làm gì?**
- reposition
- lấy mystery còn sót
- chuẩn bị né spawn pressure
- mixed

22. **Nếu có layout / placement spec, có cần giữ map size cụ thể không?**
- default `8x11`
- size khác do user chỉ định

23. **Nếu level dùng nhiều Wind / Fire, có muốn review riêng readability risk không?**
- Có
- Không

24. **Bạn có muốn matrix chỉ mô tả base map + overlay từng wave, hay một matrix đầy đủ cho từng wave?**
- base map + wave overlay
- full matrix từng wave

25. **Bag opportunity nên được hiểu chủ yếu theo cửa nào?**
- upgrade progress
- fusion progress
- recovery bias
- mixed

---

## 5. Minimal input object

```json
{
  "mode": "midgame_chain | standalone_test",
  "levelIndex": 1,
  "targetDifficulty": "Medium",
  "relativeToPrevious": "harder_than_previous",
  "waveCount": 3,
  "designGoal": "increase_count_pressure",
  "playerEntryState": "from_gdd | from_previous_level | override",
  "playerEntrySnapshot": {
    "hp": "from_gdd_or_override",
    "dmgMin": "from_gdd_or_override",
    "dmgMax": "from_gdd_or_override",
    "visiblePower": "from_gdd_or_override",
    "bagState": "from_chain_or_override_if_needed"
  },
  "allowedArchetypes": ["slime", "wind", "worm", "fire"],
  "luckyFeelingTarget": "medium",
  "mysteryFeelingBias": "mixed",
  "bagFeelingTarget": "medium",
  "phasePressureIntent": "mixed",
  "antiFrustrationPriority": true,
  "specialTilesMode": "off | review_only | explicit",
  "needMatrix": true,
  "matrixStyle": "base_plus_overlay | full_per_wave",
  "outputMode": "balance_summary | full_layout_spec"
}
```

---

## 6. Balance model

## 6.1 Core scoring philosophy

Framework này **không tự chứa stat**.

Luôn lấy từ:
- **GDD hiện hành**
- hoặc **player entry snapshot / chain snapshot đã chốt**

```text
referencePlayerPower = value from GDD or approved player entry snapshot
enemyVisiblePowerByArchetype = values from GDD
enemyHPByArchetypeOrLevel = values from GDD
enemyDMGByArchetypeOrLevel = values from GDD
bagStateIfAny = approved chain snapshot only
```

## 6.2 Wave score formula

### 6.2.1 Raw Combat Pressure

```text
RawCombatPressure = ESP + ECP + TPP + RR
```

### 6.2.2 Growth / Recovery Relief

```text
GrowthRelief = MO_effective + BO + HO
```

### 6.2.3 Wave Difficulty

```text
waveDifficulty = max(0, RawCombatPressure - GrowthRelief)
```

### 6.2.4 Level Difficulty

```text
levelDifficultyScore = round(average(all waveDifficulty)) + WCP + LPR
```

---

## 6.3 Wave Enemy Stat Pressure (ESP)

Framework v1.3.0 đổi cách chấm ESP.

Không chỉ nhìn avg visible power thô.
Phải đọc **threat band** của từng enemy so với current player power.

### 6.3.1 Threat band mapping

```text
Low  = enemy < 80% of current player power
Mid  = enemy 80%–120% of current player power
High = enemy > 120% of current player power
```

### 6.3.2 Threat points

```text
Low = 0
Mid = 1
High = 2
```

### 6.3.3 ESP formula

```text
ESP = round( average(threat points of all enemies in the wave) )
```

### 6.3.4 Why this replaces the old method

- bám sát GDD hơn
- tương thích với enemy level scaling đã khóa
- tương thích với visible-power readability hiện hành

---

## 6.4 Wave Enemy Count Pressure (ECP)

```text
ECP =
0 nếu enemyCount = 1
1 nếu enemyCount = 2
2 nếu enemyCount = 3
3 nếu enemyCount = 4
4 nếu enemyCount = 5
5 nếu enemyCount = 6
6 nếu enemyCount >= 7
```

---

## 6.5 Tempo / Phase Pressure (TPP)

TPP là phần mới để phản ánh **Day / Night timing pressure**.

```text
TPP =
0 nếu wave dự kiến chủ yếu được giải ở Day hoặc pressure phase thấp
1 nếu wave có Day / Night overlap vừa phải hoặc warning turn tạo timing tension vừa phải
2 nếu wave có chủ ý ép player vào Night pressure hoặc phase timing là nguồn khó chính
```

### 6.5.1 Use rule

- Nếu level design goal là đánh timing Day / Night -> TPP phải được chấm rõ
- Nếu phase gần như không quyết định feel của wave -> TPP nên giữ thấp

---

## 6.6 Wave Readability Risk (RR)

RR trong v1.3.0 không chỉ là `Wind + Fire count`.
Nó là risk player **đọc sai threat thực tế** hoặc cảm thấy board quá swing / quá nhiễu.

```text
RR = 0 mặc định
RR = RR + 1 nếu wave có >= 2 disruption sources
RR = RR + 1 nếu board có nguy cơ làm player đọc sai kèo hoặc nếu warning-turn value quá thấp
```

### 6.6.1 Disruption sources gợi ý

Tính như disruption source khi wave có:
- nhiều Wind / Fire
- mystery dày và reachable quá mạnh
- Night timing pressure cao
- spawn clustering khiến threat thực tế cao hơn readout thô

### 6.6.2 Practical rule

Nếu designer không chắc:
- RR 0 = readable
- RR 1 = có nguy cơ đọc khó hơn bình thường
- RR 2 = boundary / fairness stress

---

## 6.7 Mystery Opportunity (MO_effective)

Framework v1.2.0 chỉ chấm mystery theo số mystery được gán cho wave đó.
V1.3.0 sửa lại để **carry-over mystery** có thể góp vào giá trị relief thực tế.

### 6.7.1 Base mystery density

```text
mysteryDensity = mysteryCellCountInWave / enemyCountInWave
```

```text
MO_base =
0 nếu mysteryDensity = 0
1 nếu 0 < mysteryDensity <= 0.34
2 nếu 0.34 < mysteryDensity <= 0.75
3 nếu mysteryDensity > 0.75
```

### 6.7.2 Carry-over adjustment

```text
carryOverMysteryBonus =
0 nếu không có mystery tồn từ wave trước hoặc mystery tồn không tactically relevant
1 nếu có mystery tồn từ wave trước và mystery đó reachable / tactically relevant
```

### 6.7.3 Effective mystery score

```text
MO_effective = min(3, MO_base + carryOverMysteryBonus)
```

### 6.7.4 Intent

- giữ mystery như nguồn lucky feeling chính
- nhưng không bỏ qua giá trị carry-over đã được khóa trong GDD

---

## 6.8 Battlefield Bag Opportunity (BO)

Bag trong v1.3.0 **đi vào score số ở mức heuristic**.
Không chấm bằng exact odds engine.
Chấm bằng **mức độ level / wave mở ra cửa progress build thực sự**.

```text
BO =
0 nếu wave hầu như không mở ra meaningful build progress
1 nếu wave có 1 meaningful build step
2 nếu wave có strong build progress window
```

### 6.8.1 Meaningful build step là gì

Một wave được xem là có meaningful build step nếu nó có khả năng thực tế mở ra ít nhất một trong các việc sau:
- lấp slot quan trọng đang thiếu
- nâng item đang có lên đúng hướng build
- tiến gần rõ rệt tới `Lv3`
- tạo `fusion ready`
- hoàn tất fusion endpoint
- mở recovery item đúng lúc cho wave sau

### 6.8.2 Suggested reading guide

- **BO 0** = reward có nhưng không thay đổi được decision layer đáng kể
- **BO 1** = có incremental progress rõ
- **BO 2** = có cửa build-jump hoặc phase-jump rõ

### 6.8.3 Important note

BO không thay thế review notes.
Nếu một wave được chấm BO cao, phải viết rõ nó cao vì:
- upgrade progress
- fusion progress
- recovery bias
- hay mixed

---

## 6.9 Heal Opportunity (HO)

Heal potion không còn chỉ là review-only.
Nó đi vào score nhẹ, vì đã là nguồn target-priority và route-sustain chính thức trong GDD.

```text
HO =
0 nếu wave gần như không có realistic heal-route value
1 nếu wave có kill-order / sustain value vừa phải
2 nếu wave có nhiều enemy dễ chuyển thành heal-route meaningful
```

### 6.9.1 Notes

- HO chỉ là **small relief term**
- Không được dùng HO để biện minh cho một level vốn hopeless nếu không có heal drop

---

## 6.10 Level Wave Count Pressure (WCP)

```text
WCP =
0 nếu waveCount = 1
1 nếu waveCount = 2
2 nếu waveCount >= 3
```

---

## 6.11 Level Layout / Placement Risk (LPR)

LPR là modifier cấp level.
Nó phản ánh việc **cùng score composition nhưng placement / route / telegraph / access** có thể làm level thực tế khó hơn.

```text
LPR =
0 nếu layout cho thấy route sớm rõ, warning turn có giá trị, tactical option nhìn thấy được
1 nếu cùng raw score nhưng placement làm route khó thực hiện hơn hoặc mystery / heal / telegraph value thấp đi rõ rệt
2 nếu placement tạo risk fairness / frustration cao
```

### 6.11.1 Use rule

- Chỉ thêm LPR sau khi đã làm xong layout / placement review
- Không dùng LPR để che một composition đang sai ngay từ gốc

---

## 6.12 Difficulty tiers

| levelDifficultyScore | Tier | Reading |
|---:|---|---|
| 0-2 | Very Easy | áp lực thấp, level khá thoải mái |
| 3-4 | Easy | có áp lực nhưng player còn nhiều cửa |
| 5-6 | Medium | cần route / timing / target priority rõ |
| 7-8 | Hard | pressure cao, phải đọc wave và board tốt |
| 9+ | Very Hard | boundary test / fairness stress band |

---

## 7. What makes a later level harder

Một level được coi là khó hơn level trước nếu có ít nhất một trong các việc sau:

```text
1) average ESP tăng
hoặc
2) average ECP tăng
hoặc
3) average TPP tăng
hoặc
4) average RR tăng
hoặc
5) average MO_effective giảm
hoặc
6) average BO giảm
hoặc
7) average HO giảm
hoặc
8) WCP tăng
hoặc
9) LPR tăng
```

Diễn giải theo cảm giác:
- **ESP tăng** -> combat nặng hơn
- **ECP tăng** -> board đông hơn / bị dí hơn
- **TPP tăng** -> timing khó hơn vì Day / Night
- **RR tăng** -> khó đọc hơn / swing mạnh hơn
- **MO_effective giảm** -> ít cửa đổi vận từ mystery hơn
- **BO giảm** -> ít cửa phát triển build đúng nhịp hơn
- **HO giảm** -> kill-order ít cứu hơn
- **WCP tăng** -> level dài hơi hơn, tốn tài nguyên hơn
- **LPR tăng** -> cùng composition nhưng route tệ hơn, warning turn bớt hữu ích hơn, tactical option khó thực hiện hơn

---

## 8. Layout / placement is part of difficulty

## 8.1 Rule

> Layout / placement là một phần của difficulty, không phải phần trình bày riêng.

Một level phải được review không chỉ bằng composition, mà còn bằng:
- vị trí player start
- vị trí enemy của từng wave
- vị trí mystery của từng wave
- quan hệ giữa mystery và hướng threat
- giá trị thực tế của warning turn
- safe route / reward route trong 1-2 lượt đầu
- khả năng tạo tactical option rõ ràng trên board
- heal-route value thực tế
- bag-progress timing value thực tế

## 8.2 Layout / placement review gates

Sau khi có candidate level, luôn kiểm 9 câu này:

1. **Trong 1-2 lượt đầu, player có ít nhất 1 route hợp lệ không dẫn ngay đến combat bất lợi rõ ràng, hoặc có route sớm tới mystery / reward không?**

2. **Roll thấp ở lượt đầu / lượt sớm có bắt player va chạm combat / trap nặng ngay không?**

3. **Mystery có được đặt ở vị trí thực sự tạo quyết định không?**
   - không quá free
   - không quá vô nghĩa
   - không quá xa tới mức gần như không bao giờ đáng lấy

4. **Warning turn của wave tiếp theo có tạo giá trị chuẩn bị thật không?**
   - reposition
   - lấy mystery sót lại
   - né spawn pressure
   - chuẩn bị target priority

5. **Cùng composition đó, placement có làm 1 loại enemy trở nên nguy hiểm hơn hẳn vì góc tiếp cận / khoảng cách / cụm spawn không?**
   - nếu có, phải ghi rõ trong notes

6. **Level có ít nhất 1 tactical option nhìn thấy được trên board không?**

7. **Heal route có reachable trong pathing thực tế không?**

8. **Bag progress feel có đến đúng phase mà level cần không?**
   - early chọn hướng
   - mid đẩy synergy
   - end chốt fusion / spike

9. **Nếu level dùng nhiều Wind / Fire, Night pressure cao, hoặc mystery dày, player còn đọc đúng threat thực tế qua power readout + cue phụ không?**

Nếu có câu nào trả lời là **không**, level spec chưa đạt.

---

## 9. Stat Validation Gate

Sau khi chấm score, luôn kiểm bằng stat lấy từ GDD / snapshot đã chốt.

### 9.1 Player damage guard

1. **Player DMG width cap**

```text
player.dmg.max - player.dmg.min <= 50% x slime.hp_reference_for_balance
```

2. **Player DMG band**

```text
player.dmg.min phải nằm trong band 50% -> 100% của player.dmg.max
```

3. **Mystery fallback**
- nếu `player.dmg.min == player.dmg.max`
- thì `+1 min DMG` phải dùng fallback theo GDD hiện hành

4. **Max-overflow fallback**
- nếu `+1 max DMG` vượt cap / band
- phải chuyển sang fallback theo GDD hiện hành

### 9.2 Enemy damage anchors

5. **Slime anchor**
- Slime là enemy chuẩn
- phải cần tối thiểu `5` hit để giết player

6. **Fire anchor**
- Fire là enemy mạnh nhất theo sát thương
- phải cần tối thiểu `3` hit để giết player

7. **Enemy damage stability**
- enemy DMG range nên nằm trong band `70% -> 100%`
- lưu ý: đây vẫn là **design rule**, chưa phải exact `% formula runtime`

Nếu score đúng nhưng gate fail -> level spec chưa đạt.

---

## 10. Anti-frustration gate

Trước khi chốt level, luôn kiểm:

1. Trong `1-2` lượt đầu, level có ít nhất `1` route hợp lệ không dẫn ngay đến combat bất lợi rõ ràng, hoặc có route sớm tới mystery / reward không?
2. Roll thấp ở lượt đầu / lượt sớm có bắt player va chạm combat hoặc trap nặng ngay không?
3. Nếu power number chưa phản ánh đủ threat thực tế, UI / cue phụ có đủ để player không đọc sai không?
4. Warning turn của wave mới có giúp level fair hơn mà không làm mất tension không?
5. Level có đang lệ thuộc quá mạnh vào heal drop, bag high-roll, hoặc mystery high-roll để mới trở nên thắng được không?

Nếu có câu nào là **không**, level spec chưa đạt.

---

## 11. 2D matrix design notation

Framework v1.3.0 hỗ trợ mô tả level bằng **ma trận 2 chiều**.

### 11.1 Base-map matrix

Dùng để mô tả:
- map size
- terrain walkability
- player start
- special tiles tĩnh

Ký hiệu gợi ý:
- `.` = walkable
- `#` = blocked
- `P` = player start
- `L` = Lava
- `T` = Swamp
- `C` = Canon
- `H` = heal potion spawn marker nếu cần mock review
- `X` = telegraph marker preview tile (chỉ dùng trong warning-turn overlay, không dùng cho base map final)

### 11.2 Wave overlay matrix

Dùng để mô tả placement riêng của từng wave.

Ký hiệu gợi ý:
- `s` = Slime
- `w` = Wind
- `m` = Worm
- `f` = Fire
- `?` = mystery cell của wave đó
- `x` = telegraphed spawn tile của wave kế tiếp trong warning turn
- `.` = không có entity mới ở ô đó

### 11.3 Recommended usage

- **Base map**: 1 matrix chung cho cả level
- **Wave overlays**: 1 matrix riêng cho từng wave
- **Warning overlay**: nếu cần, thêm 1 matrix cho warning turn của wave kế tiếp

### 11.4 Important note

Matrix là **level design notation**, không tự thay thế source schema code.
Nó dùng để:
- thiết kế nhanh
- review layout / placement
- thảo luận difficulty feel
- giao tiếp với LLM / designer

---

## 12. Level generation workflow

### Step 1 — Ask questions
Hỏi Mandatory Intake Questions.

### Step 2 — Normalize input
Chuyển câu trả lời thành `minimal input object`.

### Step 3 — Draft level structure
Tạo khung level:
- map size
- wave count
- base map
- target difficulty by level
- expected feeling by wave

### Step 4 — Draft wave compositions
Với từng wave, chốt:
- số Slime
- số Wind
- số Worm
- số Fire
- số mystery cell của wave đó
- expected phase pressure
- expected bag opportunity
- expected heal opportunity

### Step 5 — Draft layout / placement
Tạo:
- base-map matrix
- wave overlay matrix
- nếu cần, warning-turn spawn overlay

### Step 6 — Score waves
Tính:
- ESP
- ECP
- TPP
- RR
- MO_effective
- BO
- HO
- RawCombatPressure
- GrowthRelief
- waveDifficulty

### Step 7 — Score whole level
Tính:
- averageWaveDifficulty
- WCP
- LPR
- levelDifficultyScore
- finalDifficultyTier

### Step 8 — Check design-goal fit
Xem level có đạt đúng mục tiêu:
- increase_count_pressure
- increase_stat_pressure
- phase-pressure-heavy
- same_band_different_texture
- tactical-choice-heavy
- lucky-swing-heavy
- fairness boundary test

### Step 9 — Check Stat Validation Gate
Nếu fail -> chỉnh lại stats assumption hoặc composition.

### Step 10 — Check Layout / Placement Gate
Nếu fail -> chỉnh placement / mystery / wave order.

### Step 11 — Check Anti-frustration Gate
Nếu fail -> level chưa đạt.

### Step 12 — Review notes
Ghi rõ:
- bag opportunity reasoning
- heal-route reasoning
- warning-turn value
- tactical option
- lucky feeling source

### Step 13 — Output final spec
Xuất:
- per-wave table
- level summary table
- matrix section
- JSON object

---

## 13. Output tables

## 13.1 Per-wave table

| Field | Value |
|---|---|
| Level |  |
| Wave |  |
| Wave Goal |  |
| Slime Count |  |
| Wind Count |  |
| Worm Count |  |
| Fire Count |  |
| Total Enemy Count |  |
| Mystery Cell Count (Wave) |  |
| Carry-over Mystery Bonus |  |
| Mystery Feeling Bias |  |
| ESP |  |
| ECP |  |
| TPP |  |
| RR |  |
| MO_effective |  |
| BO |  |
| HO |  |
| Raw Combat Pressure |  |
| Growth Relief |  |
| Wave Difficulty |  |
| Placement Goal |  |
| Tactical Option |  |
| Lucky Feeling |  |
| Bag Opportunity Reason |  |
| Heal Route Reason |  |
| Warning-Turn Value for Next Wave |  |
| Layout / Placement Check | Pass / Fail |
| Notes |  |

## 13.2 Level summary table

| Field | Value |
|---|---|
| Level |  |
| Mode |  |
| Target Difficulty |  |
| Relative To Previous |  |
| Player Entry State |  |
| Player Entry Snapshot Source |  |
| Wave Count |  |
| Average Wave Difficulty |  |
| Wave Count Pressure (WCP) |  |
| Layout / Placement Risk (LPR) |  |
| Level Difficulty Score |  |
| Final Difficulty Tier |  |
| Why Harder / Easier Than Previous |  |
| Core Tactical Option Across Level |  |
| Main Lucky Feeling Source |  |
| Battlefield Bag Review | Included heuristically + review notes |
| Heal Potion Review | Included lightly + review notes |
| Stat Validation Gate | Pass / Fail |
| Anti-Frustration Check | Pass / Fail |
| Missing-from-Source Risk |  |
| Notes |  |

---

## 14. Tactical option writing rule

Khi sinh `Tactical Option`, phải viết thành **lựa chọn cụ thể nhìn thấy được trên board**.

Đúng:
- lấy mystery trước hay engage Fire trước
- giữ đường lui trước warning turn hay tranh thủ dứt wave hiện tại
- cắt Wind trước để giảm pressure động hay giữ Worm sau cùng
- ăn wave này để mở bag progress trước hay kéo turn để lấy mystery an toàn hơn

Sai:
- player cần chơi chiến thuật
- player phải cân nhắc

---

## 15. Lucky feeling writing rule

Khi sinh `Lucky Feeling`, phải nói rõ level / wave đang dùng **nguồn đổi vận nào**:

- mystery cứu một combat xấu
- mystery mở ra cửa comeback vừa phải
- mystery có thể lật kèo mạnh nếu đi đúng route
- heal potion làm kill-order đáng giá hơn
- battlefield bag mở ra đúng upgrade / fusion window
- warning turn cho player cơ hội “chuyển vận” bằng reposition / nhặt tài nguyên sót lại

Có thể dùng các tag:
- **survivability swing**
- **stability swing**
- **spike swing**
- **route swing**
- **prep-turn swing**
- **build-jump swing**

---

## 16. Composition heuristics by target difficulty

Đây là guideline để generate candidate nhanh. Không phải luật cứng.

### Very Easy
- enemy count thấp
- wave count thấp
- nhiều mystery hơn
- placement không ép sớm
- warning turn nếu có phải giá trị rõ
- BO không cần cao nhưng không được dead

### Easy
- count thấp hoặc vừa
- raw score chưa cao
- mystery còn đủ để cứu nhẹ
- layout cho thấy ít nhất 1 route “an toàn rõ ràng”
- bag progress nên giúp hiểu build direction sớm

### Medium
- count vừa
- mix archetype bắt đầu rõ vai trò
- warning turn bắt đầu có giá trị chiến thuật
- mystery nên còn ở vùng MO 1 hoặc MO 2
- bag progress nên mở đúng 1-2 bước rõ trong level

### Hard
- wave count cao hơn hoặc per-wave pressure cao hơn
- placement ép route nhiều hơn
- tactical option vẫn có nhưng không còn quá dễ
- mystery vẫn nên còn ít nhất vài cửa comeback
- phase timing hoặc bag timing bắt đầu quan trọng hơn

### Very Hard
- boundary test
- nhiều wave hoặc nhiều disruption
- mystery ít hơn hoặc khó lấy hơn
- warning turn phải review fairness kỹ
- không được để level thành hopeless từ đầu
- high BO không được dùng để che một composition / placement quá ác

---

## 17. Output JSON template

```json
{
  "level": 1,
  "mode": "midgame_chain",
  "targetDifficulty": "Medium",
  "relativeToPrevious": "harder_than_previous",
  "playerEntryState": "from_gdd",
  "playerEntrySnapshot": {
    "hp": "from_gdd_or_override",
    "dmgMin": "from_gdd_or_override",
    "dmgMax": "from_gdd_or_override",
    "visiblePower": "from_gdd_or_override",
    "bagState": "from_chain_or_empty"
  },
  "waveCount": 3,
  "allowedArchetypes": ["slime", "wind", "worm", "fire"],
  "waves": [
    {
      "waveIndex": 1,
      "waveGoal": "safe opener with visible tactical choice",
      "enemyComposition": {
        "slime": 1,
        "wind": 1,
        "worm": 0,
        "fire": 1
      },
      "enemyCount": 3,
      "mysteryCellCount": 2,
      "carryOverMysteryBonus": 0,
      "mysteryFeelingBias": "mixed",
      "ESP": 1,
      "ECP": 2,
      "TPP": 0,
      "RR": 1,
      "MO_effective": 2,
      "BO": 1,
      "HO": 1,
      "rawCombatPressure": 4,
      "growthRelief": 4,
      "waveDifficulty": 0,
      "placementGoal": "Give one safe early route and one risky mystery route.",
      "tacticalOption": "Take mystery first or engage Fire first.",
      "luckyFeeling": "Two mystery cells plus one likely bag progress step create a comeback window.",
      "bagOpportunityReason": "One meaningful build step is likely in this wave.",
      "healRouteReason": "Kill-order can open one reachable heal route.",
      "warningTurnValueForNextWave": "Reposition before the next spawn."
    }
  ],
  "averageWaveDifficulty": "computed",
  "waveCountPressure": "computed",
  "layoutPlacementRisk": "computed",
  "levelDifficultyScore": "computed",
  "finalDifficultyTier": "computed",
  "coreTacticalOptionAcrossLevel": "",
  "mainLuckyFeelingSource": "",
  "battlefieldBagReview": "Included heuristically via BO plus review notes.",
  "healPotionReview": "Included lightly via HO plus review notes.",
  "layoutPlacementCheck": "Pass",
  "statValidationGate": {
    "playerDamageWidthCap": "pass_or_fail",
    "playerDamageBand": "pass_or_fail",
    "mysteryFallbackRules": "pass_or_fail",
    "slimeHitsToKillPlayer": "pass_or_fail",
    "fireHitsToKillPlayer": "pass_or_fail",
    "enemyDamageBand": "pass_or_fail"
  },
  "antiFrustrationCheck": "Pass",
  "needMatrix": true,
  "matrixStyle": "base_plus_overlay",
  "matrix": {
    "baseMap": [],
    "waveOverlays": [],
    "warningOverlays": []
  },
  "missingFromSourceRisk": [
    "Exact runtime overlap handling on telegraphed spawn tiles is still not locked.",
    "Enemy damage range percentage rule is still a deferred issue and must not be invented here.",
    "Extra anti-bad-draft valves beyond the current bag framework are not approved rules yet.",
    "Full formal logic of Lava / Swamp / Canon is still not stable enough for the scoring core."
  ],
  "notes": []
}
```

---

## 18. Ready-to-use prompt block

```text
Bạn đang dùng Difficulty Balance V1.3.0 của DiceBound, dựa trên GDD v1.

Nhiệm vụ của bạn là tạo level spec ngắn gọn nhưng dùng được ngay cho:
- level design
- difficulty balance
- feeling test

Bắt buộc làm theo đúng thứ tự sau:
1. Hỏi Mandatory Intake Questions trước. Nếu user đã trả lời câu nào rồi thì không hỏi lại.
2. Không tự suy đoán ngoài source hiện có.
3. Chỉ số player và enemy phải lấy từ GDD hiện hành hoặc từ player entry snapshot mà user đã chốt.
4. Battlefield bag hiện ĐƯỢC đưa vào score ở mức heuristic thông qua BO, nhưng vẫn phải ghi review notes rõ ràng.
5. Heal potion hiện ĐƯỢC đưa vào score nhẹ thông qua HO, nhưng vẫn phải ghi review notes rõ ràng.
6. Sau khi có đủ dữ liệu, normalize input thành minimal input object.
7. Tạo:
   - base map
   - per-wave composition
   - per-wave placement
   - nếu cần, 2D matrix
8. Tính per-wave:
   - ESP
   - ECP
   - TPP
   - RR
   - MO_effective
   - BO
   - HO
   - RawCombatPressure
   - GrowthRelief
   - waveDifficulty
9. Tính whole level:
   - averageWaveDifficulty
   - WCP
   - LPR
   - levelDifficultyScore
   - finalDifficultyTier
10. Kiểm Stat Validation Gate.
11. Kiểm Layout / Placement Gate.
12. Kiểm Anti-frustration Gate.
13. Xuất ra:
   - per-wave table
   - level summary table
   - matrix section
   - JSON object

Các field bắt buộc trong output cuối:
- wave-by-wave enemy counts
- wave-by-wave mystery counts
- wave-by-wave waveDifficulty
- levelDifficultyScore
- finalDifficultyTier
- tacticalOption
- luckyFeeling
- bagOpportunityReason
- healRouteReason
- statValidationGate
- antiFrustrationCheck

Không được trả lời chung chung.
Phải cho ra:
- composition cụ thể
- placement logic rõ
- tactical option cụ thể
- lucky feeling source cụ thể
- lý do BO / HO cụ thể
```

---

## 19. Missing-from-source note

Framework này vẫn cố ý **chưa** đưa các phần sau vào exact scoring engine:

- exact runtime overlap handling when player stands on a telegraphed spawn tile at spawn time
- exact serialized wave schema in codebase
- full formal logic của Lava / Swamp / Canon để đưa vào stable scoring core
- exact `%` formula cho enemy damage range variance
- anti-bad-draft valves ngoài các rule bag hiện đã khóa

Vì vậy, v1.3.0 phù hợp nhất để:
- hỏi đúng input
- generate level spec
- generate per-wave composition + layout review
- dùng matrix 2D để thiết kế màn
- so difficulty giữa các level
- phản ánh đúng hơn current GDD v1 ở lớp bag / heal / phase timing / enemy scaling
- nhưng vẫn giữ framework ở mức heuristic dùng được cho level design, chưa phải solver final của toàn game
