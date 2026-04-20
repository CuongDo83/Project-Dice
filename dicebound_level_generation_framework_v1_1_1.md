# DiceBound Level Generation Framework

- Project: DiceBound
- Based on source version: GDD 1.1.1
- Purpose: Dùng làm framework để hỏi đúng thông tin cần thiết trước khi tạo màn chơi, sau đó sinh ra bảng level spec ngắn gọn nhưng đủ dùng cho level tuning / feeling test.
- Scope của framework này: tạo **level spec ở mức content + balance summary**, tập trung vào:
  - số lượng enemy theo từng archetype
  - số lượng mystery power cell
  - đánh giá độ khó
  - tactical option
  - lucky feeling
- Không dùng framework này để tự suy diễn thêm feature mới.

---

## 1. Source-of-truth constraints

Framework này chỉ dùng các thông tin hiện đã có trong source hiện tại:

- Game là turn-based tactical grid game, core loop là `Roll -> Move -> Resolve -> Enemy Turn`.
- Player tự đọc tương quan mạnh / yếu qua visible power readout.
- Current mid-game test đang dùng **10 level** để xem progress độ khó.
- Current playtest map size chính là **8x11**.
- Objective type hiện dùng là `defeat_all`.
- Chỉ số player và enemy không được quy định lại trong framework này; phải lấy từ **GDD hiện hành**.
- Enemy speed là đặc tính cố định theo archetype; HP, DMG, visible power và các số balance khác phải đọc từ **GDD hiện hành**.
- Current baseline archetype set hiện dùng là: Slime / Wind / Worm / Fire.
- Mystery power cell `?` hiện là:
  - placed cố định khi thiết kế màn
  - chỉ player nhận
  - random `+1 HP` hoặc `+1 max DMG`
  - odds tương đương nhau
  - không có cap trong 1 run
  - có thể stack
- Anti-frustration direction hiện có:
  - Trong 1-2 lượt đầu phải có ít nhất 1 route hợp lệ không dẫn ngay đến combat bất lợi rõ ràng, hoặc cho player đường tiếp cận sớm tới mystery power cell.
  - Không được tạo tình huống mà chỉ vì roll thấp ở lượt đầu / lượt sớm, player bị bắt buộc va chạm combat hoặc trap nặng mà không có lựa chọn né hợp lệ.
  - Nếu power number không phản ánh đủ độ nguy hiểm thực tế của enemy do speed variance / damage variance, UI hoặc popup phải có cue phụ để player không đọc sai kèo.

---

## 2. Khi nào phải hỏi lại trước khi tạo level

Theo workflow của project, nếu thông tin user đưa ra chưa rõ đang tác động vào đâu hoặc chưa rõ mục tiêu thiết kế là gì, thì phải hỏi lại trước.

Với task tạo level, luôn xem đây là thay đổi / tạo mới thuộc:
- Content Structure
- Difficulty Scaling
- Có thể kéo theo UI readability nếu visible power không đủ truyền đạt nguy hiểm thực tế

Vì vậy, trước khi tạo level, phải xác định rõ:
1. level này thuộc use case nào
2. mục tiêu thiết kế của level là gì
3. output user muốn ở mức nào

---

## 3. Mandatory Intake Questions

> Chỉ hỏi những câu dưới đây trước khi sinh level spec. Nếu user đã trả lời rồi thì không hỏi lại.

### 3.1 Nhóm câu hỏi bắt buộc

1. **Level này là màn standalone để test feeling, hay là một màn trong chuỗi 10 level mid-game?**
   - Standalone feeling test
   - Level trong chuỗi 10 màn mid-game

2. **Nếu là level trong chuỗi 10 màn, đây là level số mấy?**
   - Nhập số từ 1 đến 10

3. **Mục tiêu thiết kế chính của màn này là gì?**
   - Tăng pressure từ số lượng enemy
   - Tăng pressure từ stat enemy
   - Giữ raw pressure tương tự nhưng tăng lucky swing
   - Tạo tactical choice rõ hơn
   - Boundary test / stress test fairness

4. **Target difficulty của màn này là gì?**
   - Very Easy
   - Easy
   - Medium
   - Hard
   - Very Hard

5. **Màn này phải khó hơn, dễ hơn, hay ngang với màn trước?**
   - Harder than previous
   - Same band, different texture
   - Easier reset / relief
   - Standalone, không so với màn trước

6. **Khi chốt difficulty, dùng reference player power nào?**
   - Dùng giá trị từ GDD hiện hành
   - Dùng giá trị khác do user cung cấp

7. **Có cho phép dùng đủ 4 archetype hiện tại không?**
   - Cho phép đủ cả 4: Slime / Wind / Worm / Fire
   - Chỉ cho phép một số archetype do user chỉ định

8. **Lucky feeling của màn này muốn ở mức nào?**
   - Low: gần như không trông vào mystery
   - Medium: mystery giúp cứu nhẹ
   - High: mystery có thể lật kèo mạnh

9. **Màn này có cần ưu tiên anti-frustration mạnh hơn bình thường không?**
   - Có
   - Không

10. **User chỉ cần bảng balance summary hay cần thêm layout / placement spec?**
    - Chỉ cần balance summary
    - Cần thêm placement spec

### 3.2 Câu hỏi chỉ hỏi khi thiếu dữ liệu

11. **Nếu user không dùng reference player power từ GDD, expected player entry power override là bao nhiêu?**

12. **Nếu level là một phần của chuỗi 10 màn, level trước có summary gì?**
- enemy composition
- mystery count
- difficulty score
- target feeling

13. **Có cho phép special tiles không?**
- Mặc định framework v1 này: không trộn special tiles vào scoring chính vì rule của Lava / Swamp / Canon chưa đủ formal để làm công thức ổn định.
- Nếu user vẫn muốn dùng, phải ghi rõ đây là phần ngoài scoring core và cần review tay.

---

## 4. Minimal input object

Khi đã có câu trả lời của user, quy về object tối thiểu sau:

```json
{
  "mode": "midgame_chain | standalone_test",
  "levelIndex": 1,
  "designGoal": "increase_count_pressure",
  "targetDifficulty": "Medium",
  "relativeToPrevious": "harder_than_previous",
  "referencePlayerPower": "from_gdd",
  "allowedArchetypes": ["slime", "wind", "worm", "fire"],
  "luckyFeelingTarget": "high",
  "antiFrustrationPriority": true,
  "outputMode": "balance_summary"
}
```

---

## 5. Balance model

### 5.1 Core principle

Độ khó của 1 màn trong DiceBound được định nghĩa là:

> Áp lực mà player chịu từ sức mạnh trung bình của nhóm enemy cộng với áp lực số lượng, sau khi trừ đi cơ hội lật kèo từ mystery cell, rồi cộng lại phần risk về readability / fairness.

Công thức làm việc:

```text
Difficulty = Stat Pressure + Count Pressure - Mystery Opportunity + Readability Risk
```

---

### 5.2 Baseline values

Framework này **không tự chứa chỉ số player và enemy**.

Khi dùng framework để sinh level spec, luôn lấy các giá trị sau từ **GDD hiện hành**:

```text
referencePlayerPower = value from GDD
enemyVisiblePowerByArchetype = values from GDD
enemyHPByArchetypeOrLevel = values from GDD
enemyDMGByArchetypeOrLevel = values from GDD
```

Nếu user muốn override cho một level test riêng, phải ghi rõ override đó trong input và notes.

---

### 5.3 Enemy Stat Pressure (ESP)

```text
avgEnemyPower = average(enemy visible power values in the level, sourced from GDD/current content)
statRatio = avgEnemyPower / referencePlayerPower
```

```text
ESP =
0 nếu statRatio < 0.60
1 nếu 0.60 <= statRatio < 0.90
2 nếu 0.90 <= statRatio < 1.10
3 nếu 1.10 <= statRatio < 1.30
4 nếu statRatio >= 1.30
```

Ý nghĩa:
- ESP tăng khi mix enemy trung bình mạnh hơn player.
- Nếu tăng ESP mà không tăng count, màn sẽ khó hơn theo cảm giác "từng combat nặng hơn".

---

### 5.4 Enemy Count Pressure (ECP)

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

Ý nghĩa:
- ECP tăng khi board đông hơn.
- Nếu tăng ECP mà giữ ESP gần như cũ, màn sẽ khó hơn theo cảm giác "bị dí nhịp / bị ép route".

---

### 5.5 Mystery Opportunity (MO)

```text
mysteryDensity = mysteryCellCount / enemyCount
```

```text
MO =
0 nếu mysteryDensity = 0
1 nếu 0 < mysteryDensity <= 0.34
2 nếu 0.34 < mysteryDensity <= 0.75
3 nếu mysteryDensity > 0.75
```

Ý nghĩa:
- MO 0: hầu như không có cửa đổi vận
- MO 1: có cửa cứu nhẹ
- MO 2: vùng tốt nhất cho mid-game test
- MO 3: swing mạnh, dễ làm level bớt readable nếu dùng quá nhiều

---

### 5.6 Readability Risk (RR)

Do Wind và Fire là nhóm gây pressure động / threat cao hơn, dùng rule cực ngắn sau:

```text
highDisruptionCount = windCount + fireCount
```

```text
RR = 0 mặc định
RR = RR + 1 nếu highDisruptionCount >= 2
RR = RR + 1 nếu highDisruptionCount >= 4 hoặc MO = 3
```

Ý nghĩa:
- RR không đo raw power, mà đo nguy cơ level khó đọc hoặc swing quá mạnh.
- RR giúp giữ đúng invariant: difficulty không được phá readability / fairness.

---

### 5.7 Difficulty score tổng

```text
difficultyScore = ESP + ECP - min(MO, 2) + RR
```

---

### 5.8 Difficulty tiers

| difficultyScore | Tier | Reading |
|---:|---|---|
| 0-1 | Very Easy | áp lực thấp, player khá rảnh tay |
| 2-3 | Easy | có áp lực nhưng còn thoải mái |
| 4-5 | Medium | bắt đầu cần route/combat choice rõ |
| 6-7 | Hard | phải đọc board tốt và chọn timing đúng |
| 8+ | Very Hard | boundary test, dễ lộ risk fairness/readability |

---

## 6. Cách tăng độ khó giữa hai màn

Một màn được coi là khó hơn màn trước nếu có ít nhất một trong các việc sau:

```text
1) ESP tăng 1 tier
hoặc
2) ECP tăng 1 tier
hoặc
3) MO giảm 1 tier
hoặc
4) RR tăng 1 tier
```

Diễn giải theo cảm giác:

- **ESP +1**: từng combat nặng hơn
- **ECP +1**: board đông hơn, route bị ép hơn
- **MO -1**: ít cửa đổi vận hơn
- **RR +1**: cùng raw score nhưng pressure khó đọc hơn

### 6.1 Priority tuning order

Để tăng khó mà vẫn giữ tactical + lucky feeling, dùng thứ tự này:

1. tăng **enemy count** trước
2. sau đó tăng **enemy stat pressure**
3. sau đó mới giảm **mystery opportunity**
4. chỉ tăng **RR** để test texture khó hơn hoặc boundary test

---

## 7. Anti-frustration gate

Trước khi chốt level spec, luôn kiểm 3 câu này:

1. **Trong 1-2 lượt đầu, level có ít nhất 1 route hợp lệ không dẫn ngay đến combat bất lợi rõ ràng, hoặc có route sớm tới mystery không?**
2. **Roll thấp ở lượt đầu / lượt sớm có bắt player phải va chạm bất lợi ngay không?**
3. **Nếu level dùng nhiều Wind / Fire hoặc MO cao, player còn đọc đúng nguy hiểm thực tế qua power readout và cue phụ không?**

Nếu câu trả lời cho bất kỳ câu nào là **không**, thì level spec chưa đạt anti-frustration gate.

---

## 8. Level generation workflow

### Step 1 - Ask questions
Hỏi Mandatory Intake Questions.

### Step 2 - Normalize input
Chuyển câu trả lời thành `minimal input object`.

### Step 3 - Generate candidate composition
Tạo composition sơ bộ gồm:
- số Slime
- số Wind
- số Worm
- số Fire
- số mystery cell

### Step 4 - Score candidate
Tính:
- enemyCount
- avgEnemyPower (from GDD-backed enemy values in the chosen composition)
- ESP
- ECP
- MO
- RR
- difficultyScore
- tier

### Step 5 - Check design goal fit
Kiểm xem candidate có đúng mục tiêu level không:
- increase_count_pressure
- increase_stat_pressure
- same_band_different_texture
- comeback_heavy
- fairness_boundary_test

### Step 6 - Check anti-frustration gate
Nếu fail, sửa composition hoặc giảm swing.

### Step 7 - Output level summary table
Sinh bảng kết quả cuối cùng.

---

## 9. Output table format

Kết quả mặc định phải ra đúng bảng sau:

| Field | Value |
|---|---|
| Level |  |
| Mode |  |
| Design Goal |  |
| Target Difficulty |  |
| Relative To Previous |  |
| Reference Player Power |  |
| Slime Count |  |
| Wind Count |  |
| Worm Count |  |
| Fire Count |  |
| Total Enemy Count |  |
| Mystery Cell Count |  |
| Average Enemy Power |  |
| ESP |  |
| ECP |  |
| MO |  |
| RR |  |
| Difficulty Score |  |
| Final Difficulty Tier |  |
| Why Harder / Easier Than Previous |  |
| Tactical Option |  |
| Lucky Feeling |  |
| Anti-Frustration Check | Pass / Fail |
| Notes |  |

---

## 10. Tactical option writing rule

Khi sinh `Tactical Option`, phải viết theo một trong các kiểu dưới đây:

- chọn đánh target nào trước
- chọn đi lấy mystery trước hay đánh trước
- chọn route an toàn hơn hay route tham buff
- chọn xử lý high-threat unit trước hay tank trước
- chọn giảm pressure ngay hay giữ vị trí để đợi timing tốt hơn

Không viết quá chung chung kiểu:
- "player cần chơi chiến thuật"
- "player phải cân nhắc"

Phải viết thành **một lựa chọn cụ thể mà player có thể thấy trên board**.

---

## 11. Lucky feeling writing rule

Khi sinh `Lucky Feeling`, phải nói rõ mystery đang đóng vai trò gì:

- không có đổi vận đáng kể
- cứu một combat xấu
- mở ra cửa comeback vừa phải
- có thể lật kèo mạnh nếu player đi đúng route
- swing quá mạnh, cần cẩn thận vì có nguy cơ phá readability

---

## 12. Composition heuristics by target difficulty

Đây là guideline để generate candidate nhanh. Không phải luật cứng.

### Very Easy
- Ưu tiên enemy count thấp
- Ưu tiên mix có nhiều Slime / Wind hơn Worm / Fire
- Mystery nên ở MO 2 nếu muốn level vui hơn

### Easy
- Enemy count còn thấp hoặc vừa
- Có thể có 1 Fire hoặc 1 Worm, nhưng không nên dồn cả hai loại nặng quá sớm
- Mystery nên ở MO 1 hoặc MO 2

### Medium
- Enemy count vừa
- Bắt đầu xuất hiện mix rõ vai trò giữa basic / speed / tank / threat
- Mystery nên ở MO 1 hoặc MO 2

### Hard
- Enemy count cao hơn hoặc avgEnemyPower cao hơn
- Có thể dùng nhiều Fire / Worm hơn
- Mystery vẫn nên còn ít nhất MO 1 để còn cửa comeback

### Very Hard
- Dùng để test boundary
- Có thể có count cao, disruption cao, hoặc mystery ít hơn
- Nếu MO = 3 ở very hard thì phải review readability kỹ

---

## 13. Output JSON template

```json
{
  "level": 1,
  "mode": "midgame_chain",
  "designGoal": "increase_count_pressure",
  "targetDifficulty": "Medium",
  "relativeToPrevious": "harder_than_previous",
  "referencePlayerPower": "from_gdd",
  "enemyComposition": {
    "slime": 1,
    "wind": 1,
    "worm": 1,
    "fire": 0
  },
  "enemyCount": 3,
  "mysteryCellCount": 2,
  "avgEnemyPower": "from_gdd_or_computed_from_gdd_values",
  "enemyStatPressure": {
    "statRatio": "computed",
    "tier": 1
  },
  "enemyCountPressure": {
    "tier": 2
  },
  "mysteryOpportunity": {
    "density": "computed",
    "tier": 2
  },
  "readabilityRisk": {
    "highDisruptionCount": "computed",
    "tier": 0
  },
  "difficultyScore": "computed",
  "finalDifficultyTier": "computed",
  "whyHarderOrEasierThanPrevious": "",
  "tacticalOption": "Detour for mystery first or engage the highest-threat enemy first.",
  "luckyFeeling": "Two mystery cells can create a meaningful comeback window.",
  "antiFrustrationCheck": "Pass",
  "notes": []
}
```

---

## 14. Ready-to-use prompt block

```text
Bạn đang dùng DiceBound Level Generation Framework dựa trên GDD 1.1.1.

Nhiệm vụ của bạn là tạo level spec ngắn gọn nhưng dùng được ngay cho balance / feeling test.

Bắt buộc làm theo đúng thứ tự sau:
1. Hỏi Mandatory Intake Questions trước. Nếu user đã trả lời câu nào rồi thì không hỏi lại câu đó.
2. Không tự suy đoán ngoài source hiện có. Chỉ số player và enemy phải lấy từ GDD hiện hành, không lấy từ framework này.
3. Nếu user muốn dùng special tiles, phải ghi rõ rằng special tiles hiện chưa nằm trong scoring core của framework v1 vì rule formal còn thiếu.
4. Sau khi có đủ dữ liệu, normalize input thành minimal input object.
5. Sinh candidate composition gồm số lượng enemy từng loại và số mystery cell.
6. Tính ESP, ECP, MO, RR và difficultyScore theo đúng công thức trong framework.
7. Kiểm anti-frustration gate trước khi chốt output.
8. Xuất ra:
   - bảng level summary
   - JSON object

Các field bắt buộc trong output cuối:
- slimeCount
- windCount
- wormCount
- fireCount
- mysteryCellCount
- difficultyScore
- finalDifficultyTier
- whyHarderOrEasierThanPrevious
- tacticalOption
- luckyFeeling
- antiFrustrationCheck

Không được trả lời chung chung. Phải cho ra composition cụ thể.
```

---

## 15. Missing-from-source note

Framework này cố ý chưa đưa vào scoring core các phần sau vì source hiện chưa đủ formal để làm công thức ổn định:

- special tile logic chi tiết của Lava / Swamp / Canon
- expected player entry power curve chính thức cho từng level trong chuỗi 10 màn
- bảng level scaling formal cho HP / DMG theo enemy level
- layout solver tự động

Vì vậy, framework này phù hợp nhất để:
- hỏi đúng thông tin đầu vào
- sinh composition spec nhanh
- so difficulty giữa các màn
- giữ tactical option và lucky feeling ở mức có chủ đích

Chưa nên dùng framework này như bộ cân bằng final cho toàn game.
