# 血染钟楼 AI 对战评测系统 — 上手指南

## 这是什么

这是一个纯 Node.js 的全 AI 对战评测脚本。12 个不同的大模型各扮演一个玩家，在「暗流涌动」剧本下进行 12 人局的血染钟楼对战。脚本自动运行完整的游戏流程（夜晚结算 → 白天讨论 → 提名投票 → 处决），最终统计每个模型的胜率并生成排行榜。

**当前配置：使用专业说书人预设配板（5 组可选），每组配板 12 局轮转，每个模型把 12 个角色各玩一遍。**

### 核心特性

- **预设配板模式**：由专业说书人精心设计的 5 组均衡配板，避免随机配板导致的天然不公平
- **公平轮转**：每组 12 局，12 个模型轮转 12 个座位，每个模型恰好扮演每个角色一次
- **统一 OpenRouter 路由**：所有参赛模型和说书人模型均通过 OpenRouter 统一接口调用
- **推理链记录**：所有 LLM 调用启用 reasoning（effort=high），思维链完整记录到轨迹文件
- **说书人 LLM 决策**：说书人（裁判）由独立 LLM 驱动，动态决定信息真伪、间谍/陌客注册档案等关键裁判判定
- **每日总结压缩**：每个白天结束时自动压缩会话历史，善恶阵营使用差异化压缩模板，防止长局 context 超限
- **私聊与邪恶密聊**：第一个白天支持玩家间私聊交换线索，邪恶阵营可在公开讨论前进行内部密聊协调战术
- **断点续跑**：中断后重新运行相同命令即可继续

---

## 环境要求

- **Node.js 18+**（需要内置 `fetch` 支持）
- **OpenRouter API Key**（调用所有模型，包括参赛模型和说书人模型）

检查 Node 版本：
```bash
node --version  # 需要 v18.0.0 或更高
```

---

## 快速开始

### 第一步：设置 API Key 

```bash
export OPENROUTER_API_KEY="sk-or-v1-你的key"
```

OpenRouter Key 去 [openrouter.ai](https://openrouter.ai) 注册获取。确保账户有余额。

### 第二步：先跑 1 局试试

```bash
node benchmark/run.js --limit 1
```

默认使用第 1 组预设配板。可以通过 `--board-group` 指定其他组：

```bash
node benchmark/run.js --limit 1 --board-group 3
```

运行前会先进行**模型连通性探测**（probe），逐个检查 12 个参赛模型和说书人模型是否可用。如果想跳过探测：

```bash
node benchmark/run.js --limit 1 --skip-probe
```

你会看到类似输出：
```
=== Blood on the Clocktower — AI Benchmark ===

Run tag: 20260402_143025
Results dir: ./results/20260402_143025
Progress mode: concise

Running model connectivity probe...
  Benchmark models:
  - GPT-5.4 [openai/gpt-5.4] ... OK (hello)
  - Gemini 3.1 Pro [google/gemini-3.1-pro-preview] ... OK (hello)
  ...
Model connectivity probe passed.

Generating schedule...
  [Schedule] Board mode: group 1, 12 games (rotation)
  [Schedule] Board verification passed

[1/1] Running game_001...
    [game_001] Game start | seed=42000
    [game_001] Night 1 start
    [game_001] Night 1 end | dead=none
    [game_001] Day 1 discussion start | rounds=3
    [game_001] Day 1 session compression start
    [game_001] Day 1 session compression done
    [game_001] Day 1 nomination start
    [game_001] Day 1 execution | 玩家5
    ...
    Trajectories saved to ./results/20260402_143025/raw/game_001_trajectories/ (13 files)
  ✓ game_001 done — good wins (demon_killed) — 4 days — $0.350 — 120s
```

每次运行**默认带时间戳**，结果自动保存到独立目录（如 `results/20260402_143025/`），不会覆盖之前的结果。

### 第三步：检查结果

结果保存在 `results/<timestamp>/raw/game_001.json`。

```bash
# 查看基本信息
node -e "
  const g = require('./results/<timestamp>/raw/game_001.json');
  console.log('胜方:', g.winner, '(' + g.winCondition + ')');
  console.log('天数:', g.totalDays, '夜数:', g.totalNights);
  console.log('花费: \$' + (g.totalCost || 0).toFixed(3));
  console.log('玩家:');
  g.players.forEach(p => console.log('  ' + p.name, p.role, '(' + p.team + ')', p.alive ? '存活' : '死亡'));
"
```

### 第四步：检查轨迹

每局结束后会自动生成**每个玩家的独立轨迹文件**：

```
results/<timestamp>/raw/game_001_trajectories/
├── 玩家1_openai_gpt-5.4.jsonl
├── 玩家2_google_gemini-3.1-pro-preview.jsonl
├── ...
└── 说书人_google_gemini-3.1-pro-preview.jsonl
```

每个 `.jsonl` 文件按时间顺序记录该玩家的所有 LLM 调用（system prompt + user message + assistant response）。如果模型支持推理，还会包含 `reasoning_content` 字段记录思维链。

**检查要点：**
- 游戏是否正常结束（winner 不是 "draw"）
- 天数是否合理（通常 3-8 天）
- Token 用量是否合理
- 轨迹文件中 AI 是否在用中文正常讨论

### 第五步：跑完整 12 局

```bash
node benchmark/run.js
```

**支持断点续跑**：如果中途中断（Ctrl+C 或网络错误），再次运行**相同的命令**即可。但注意：由于默认带时间戳，第二次运行会创建新目录。如果要续跑同一批，用 `--run-tag` 指定相同的标签：

```bash
node benchmark/run.js --run-tag my_run_01
# 中断后续跑：
node benchmark/run.js --run-tag my_run_01
```

### 第六步：多组配板运行与汇总

5 组预设配板，每组可跑一批 12 局：

```bash
# 第 1 组配板
node benchmark/run.js --board-group 1

# 第 2 组配板
node benchmark/run.js --board-group 2

# 汇总所有批次，生成总排行榜
node benchmark/stats.js --scan-all
```

`--scan-all` 会扫描 `results/` 下所有子目录的游戏结果，汇总输出到 `results/leaderboard_all.json`。也可以指定输出路径：

```bash
node benchmark/stats.js --scan-all --out results/my_leaderboard.json
```

### 第七步：查看排行榜与数据浏览器

```bash
# 在项目根目录启动 HTTP 服务器
cd /mnt/user-ssd/yangqibin/The-Bloody
python3 -m http.server 8000
```

- **排行榜**：浏览器打开 `http://localhost:8000/leaderboard.html`
- **数据浏览器**：浏览器打开 `http://localhost:8000/viewer.html`（需要先生成文件索引：`node benchmark/gen-index.js`）

排行榜默认读取 `results/leaderboard.json`。如果用了 `--scan-all`，需要把生成的文件复制过去：

```bash
cp results/leaderboard_all.json results/leaderboard.json
```

---

## 命令行参数

### `run.js`

```bash
node benchmark/run.js [options]
```

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `--limit N` | 无限制 | 只跑前 N 局 |
| `--board-group N` / `--board N` | 1 | 使用第几组预设配板（1-5） |
| `--progress MODE` | concise | 日志详细程度：`concise` / `balanced` / `detailed` |
| `--run-tag TAG` | 无 | 指定运行标签（用于结果目录名和断点续跑） |
| `--timestamped` | 默认开启 | 使用时间戳作为运行标签 |
| `--no-timestamp` | — | 关闭时间戳，结果直接写入 `results/raw/` |
| `--skip-probe` | — | 跳过模型连通性探测 |

**Progress 模式说明：**

- **`concise`**：只显示游戏级别关键节点（夜晚开始/结束、白天讨论/提名/处决）
- **`balanced`**：增加每次 LLM 调用完成通知（含耗时和累计 token/费用）、讨论轮次、提名和投票详情、每日总结压缩状态；每 10 秒打印 LLM 等待心跳
- **`detailed`**：增加每次 LLM 调用的开始、回复前 80 字符预览、私聊检测、夜晚具体行动、会话压缩详情

```bash
# 调试时用 detailed 查看完整日志
node benchmark/run.js --progress detailed --limit 1
```

### `stats.js`

```bash
node benchmark/stats.js [options]
```

| 参数 | 说明 |
|------|------|
| `--scan-all` | 扫描 `results/` 下所有子目录汇总生成排行榜 |
| `--out PATH` | 指定排行榜输出路径（默认 `results/leaderboard_all.json`） |
| 无参数 | 只读取 `config.rawDir` 下的结果 |

### `gen-index.js`

```bash
node benchmark/gen-index.js
```

扫描 `results/` 目录生成 `results/file_index.json`，供 `viewer.html` 数据浏览器使用。每次有新游戏结果后重新运行即可更新索引。

---

## 文件说明

```
benchmark/
├── config.js            # 配置：模型列表、配板、API参数、说书人模型
├── llm.js               # LLM 调用封装（OpenRouter 统一接口，含推理链支持与本地定价估算）
├── schedule.js          # 角色分配调度器（预设配板轮转 / 随机配板）
├── engine.js            # 游戏引擎（完整游戏机制 + 说书人LLM决策 + 每日总结压缩）
├── run.js               # 主入口（模型探测 + 运行评测 + 保存结果和轨迹）
├── stats.js             # 统计汇总（生成排行榜 JSON，支持多批次汇总）
├── gen-index.js         # 生成文件索引（供数据浏览器使用）
├── role_boards.json     # 5 组预设配板（JSON 格式）
├── role_assignment.txt  # 原始配板描述（人类可读版本）
└── README.md            # 本文档

results/
├── <timestamp>/           # 每次运行的独立目录
│   ├── raw/               # 每局结果
│   │   ├── game_001.json
│   │   ├── game_001_trajectories/   # 每个玩家的轨迹 JSONL
│   │   │   ├── 玩家1_openai_gpt-5.4.jsonl
│   │   │   └── ...
│   │   └── ...
│   └── leaderboard.json   # 该批次的排行榜
├── file_index.json        # gen-index.js 生成的文件索引
├── leaderboard_all.json   # --scan-all 汇总排行榜
└── leaderboard.json       # 排行榜网页读取的文件

# 项目根目录
leaderboard.html           # 排行榜网页
viewer.html                # 数据浏览器网页
```

---

## 配置说明（config.js）

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `totalGames` | 12 | 总局数（必须是 12 的倍数） |
| `groups` | 1 | 分组数（totalGames / 12） |
| `seed` | 42 | 随机种子 |
| `boardFile` | `"./benchmark/role_boards.json"` | 预设配板文件路径，设为 `""` 则用随机配板 |
| `boardGroup` | 1 | 使用第几组配板（1-5），可被 `--board-group` 覆盖 |
| `discussionRounds` | 3 | 每个白天讨论轮数 |
| `maxNominationsPerDay` | 3 | 每天最多提名次数 |
| `temperature` | 0.6 | LLM 温度（较低值使模型输出更稳定一致） |
| `maxDays` | 10 | 单局最大天数（防死循环） |
| `timeoutMs` | 120000 | 单次 LLM 调用超时（毫秒），引擎层另有 600 秒硬超时兜底 |
| `maxRetries` | 3 | LLM 调用最大重试次数 |
| `storytellerModel` | `google/gemini-3.1-pro-preview` | 说书人模型（裁判，不参与排名） |
| `models` | 12 个模型 | 参赛模型列表（必须恰好 12 个） |
| `openrouterApiKey` | 环境变量 | OpenRouter API Key |

### 当前参赛模型列表

| 序号 | 模型 ID | 显示标签 |
|------|---------|---------|
| 1 | `openai/gpt-5.4` | GPT-5.4 |
| 2 | `google/gemini-3.1-pro-preview` | Gemini 3.1 Pro |
| 3 | `anthropic/claude-sonnet-4.6` | Claude Sonnet 4.6 |
| 4 | `xiaomi/mimo-v2-pro` | MiMo V2 Pro |
| 5 | `minimax/minimax-m2.7` | MiniMax M2.7 |
| 6 | `x-ai/grok-4.20-beta` | Grok 4.20 Beta |
| 7 | `deepseek/deepseek-v3.2` | DeepSeek V3.2 |
| 8 | `qwen/qwen3.5-397b-a17b` | Qwen3.5 397B |
| 9 | `bytedance-seed/seed-2.0-lite` | Seed 2.0 Lite |
| 10 | `stepfun/step-3.5-flash` | step 3.5 flash |
| 11 | `z-ai/glm-5` | GLM-5 |
| 12 | `moonshotai/kimi-k2.5` | kimi k2.5 |

---

## 预设配板模式

系统默认使用预设配板模式（`boardFile` 非空时启用）。`role_boards.json` 中有 5 组由专业说书人设计的均衡配板，每组指定了：

- 12 个座位各自的角色（包括酒鬼的表观角色）
- 恶魔的 3 个不在场身份（bluffs）
- 占卜师的干扰项（red herring）

每组配板生成 12 局轮转赛程：第 i 局中，模型按 `(座位 - i + 12) % 12` 的公式轮转，确保每个模型恰好扮演每个座位一次。

### 5 组配板概览

| 组别 | 恶魔 | 爪牙 | 外来者 | 酒鬼表观 | 干扰项 | bluffs |
|------|------|------|--------|---------|--------|--------|
| 第1组 | 小恶魔(2号) | 红唇女郎(7号)、投毒者(11号) | 酒鬼(1号)、陌客(4号) | 贞洁者 | 无 | 占卜师、送葬者、圣徒 |
| 第2组 | 小恶魔(9号) | 男爵(7号)、投毒者(10号) | 圣徒(2号)、陌客(5号)、管家(4号)、酒鬼(8号) | 洗衣妇 | 圣徒(2号) | 共情者、送葬者、镇长 |
| 第3组 | 小恶魔(7号) | 投毒者(4号)、红唇女郎(9号) | 圣徒(2号)、陌客(12号) | 无 | 无 | 管家、占卜师、镇长 |
| 第4组 | 小恶魔(8号) | 投毒者(4号)、男爵(10号) | 陌客(6号)、圣徒(9号)、管家(12号)、酒鬼(5号) | 僧侣 | 士兵(2号) | 厨师、共情者、送葬者 |
| 第5组 | 小恶魔(5号) | 间谍(7号)、投毒者(9号) | 酒鬼(4号)、圣徒(8号) | 守鸦人 | 无 | 管家、占卜师、厨师 |

> 注：第2、4组含男爵，会额外 +2 外来者 -2 镇民。

如需回退到随机配板模式，将 `config.js` 中的 `boardFile` 设为 `""`。

---

## 模型路由

所有 LLM 调用统一通过 **OpenRouter** 接口路由，无需额外配置其他 API 通道。

所有调用均启用推理链（`reasoning: { effort: "high" }`）。支持推理的模型会返回 `reasoning_content` 字段，记录到轨迹文件中。

### 费用估算

`llm.js` 内置了 40+ 个模型的本地定价表（USD per 1M tokens）用于费用估算。费用计算优先级：
1. API 返回的 `usage.cost` 字段
2. API 返回的 `data.total_cost` 字段
3. 本地定价表估算

### 重试机制

- **429 限流**：指数退避，优先使用 `Retry-After` 响应头
- **5xx 服务端错误**：指数退避（3s × 2^attempt）
- **超时/中断**：自动重试，最多 3 次

---

## 游戏引擎核心机制

游戏引擎（`engine.js`）实现了完整的《血染钟楼·暗流涌动》规则，包含以下核心子系统：

### 说书人 LLM 决策系统

说书人不是简单的规则执行者，而是通过**多次独立 LLM 调用**做出战略性裁判决策：

| 决策函数 | 用途 | Temperature |
|---------|------|-------------|
| `storytellerChooseRegistrationProfile()` | 决定间谍/陌客的注册档案（在信息结算中如何伪装） | 0.2 |
| `storytellerChooseInfo()` | 决定给醉酒/中毒玩家真信息还是假信息 | 0.2 |
| `storytellerChooseTrueInfoPair()` | 为信息角色选择最优的真实信息配对 | 0.2 |
| `storytellerJudgeRecluseSlayer()` | 判断陌客面对猎手开枪时是否注册为恶魔 | 0.2 |
| `storytellerChooseMayorRedirect()` | 决定镇长替死时重定向到哪个好人 | 0.2 |

说书人使用较低的 temperature（0.2）以确保裁判决策的稳定性和一致性。

### 间谍/陌客注册系统（Registration System）

这是游戏中最复杂的信息机制之一：

- **间谍**（间谍）：可以注册为善良阵营/镇民/外来者角色，欺骗洗衣妇、图书管理员、调查员等信息收集角色
- **陌客**（陌客）：可以注册为邪恶阵营/爪牙/恶魔角色，污染信息收集角色的结果
- 注册档案由说书人 LLM 根据当前局势（存活善恶比例、已有宣称、游戏平衡）**动态决定**
- 配有规则化 fallback 机制，在 LLM 失败时使用概率规则保证游戏继续

### 夜晚信息结算

各信息角色在夜晚获取信息的流程：

| 角色 | 信息内容 | 特殊处理 |
|------|---------|---------|
| 洗衣妇 | 首夜得知两人与一个镇民角色 | 受间谍/陌客注册影响 |
| 图书管理员 | 首夜得知两人与一个外来者角色 | 可能得知"没有外来者" |
| 调查员 | 首夜得知两人与一个爪牙角色 | 受间谍/陌客注册影响 |
| 厨师 | 首夜得知相邻邪恶玩家对数 | 间谍/陌客可能扭曲计数 |
| 共情者 | 每晚得知邻座存活邪恶人数 | 受注册档案影响 |
| 占卜师 | 每晚选两人查是否有恶魔 | 干扰项始终显示为恶魔 |
| 送葬者 | 非首夜得知当天处决者角色 | 受醉酒/中毒影响可能错误 |
| 守鸦人 | 夜晚死亡时查一人角色 | 仅在死亡时触发 |
| 僧侣 | 非首夜保护一名玩家 | 保护目标免于恶魔杀害 |
| 管家 | 每晚选主人 | 次日仅在主人投票时才能投票 |

**醉酒/中毒处理**：醉酒或中毒玩家的信息**可能错误**，由说书人 LLM 决定给真信息还是假信息（通过 `storytellerChooseInfo` 函数）。

### 白天流程

#### 邪恶阵营密聊（仅第一个白天前）

在第一个白天的公开讨论之前，邪恶阵营所有成员先进行一次**内部密聊**（仅邪恶成员可见）：
- 最多 3 轮，每人每轮最多 3 条消息
- 用于讨论不在场身份分配、伪装策略、目标选择
- 恶魔告知爪牙三个不在场身份，协调各自穿什么伪装

#### 公开讨论

- 每个白天有 `discussionRounds`（默认 3）轮公开讨论
- 所有存活玩家依次发言，AI 基于已知信息、私聊记录、阵营指南等生成发言
- 讨论中支持**猎手声明**：任何人可声称开枪，但必须使用严格格式 `"我是猎手，我要向玩家X开枪"`

#### 私聊系统（仅第一个白天）

- 仅第一个白天开放私聊
- 玩家通过 AI 决策选择是否发起私聊及与谁私聊
- 私聊内容仅双方可见
- 善良阵营可交换线索、建立信任；邪恶阵营可协调伪装
- 第一天之后，私聊内容通过日总结压缩保留

### 提名与投票

1. **提名**：每个存活玩家决定是否提名以及提名谁（含理由）
2. **约束**：每人每天最多提名一次，每人每天最多被提名一次，每天最多 `maxNominationsPerDay`（默认 3）次提名
3. **辩护**：被提名者有辩护机会
4. **投票**：从被提名者邻座开始轮流投票，得票大于等于存活玩家半数则处决
5. **死人票**：死亡玩家在之后的游戏中有且仅有一票死人票（遗言票）
6. **管家限制**：管家仅在主人投赞成票时才能投赞成票（醉酒/中毒时不受限）

### 特殊角色机制

| 角色 | 触发条件 | 效果 |
|------|---------|------|
| **贞洁者** | 首次被提名，如果提名者为镇民时 | 提名者被立即处决（每局限一次，需未醉酒/中毒） |
| **猎手** | 白天公开声明开枪（严格格式） | 若命中恶魔则恶魔死亡（每局限一次，需清醒且未中毒） |
| **圣徒** | 被处决 | 善良阵营立即失败 |
| **红唇女郎** | 如果存活玩家 >= 5 | 小恶魔死亡，且自身自动成为新的小恶魔，游戏继续 |
| **镇长** | 仅剩 3 人且白天无人处决 | 善良阵营获胜（镇长日） |
| **镇长** | 夜晚即将被杀 | 可能由另一名好人替死（说书人 LLM 决定） |
| **士兵** | 被恶魔选为夜杀目标 | 免疫恶魔杀害 |
| **小恶魔** | 选择自杀 | 一名爪牙成为新的小恶魔（传刀） |

### 胜利条件

| 条件 | 获胜方 |
|------|-------|
| 恶魔死亡或猎手击杀（无红唇女郎接替） | 善良阵营 |
| 镇长日（仅剩 3 人且白天无处决） | 善良阵营 |
| 存活玩家 <= 2 且恶魔存活 | 邪恶阵营 |
| 圣徒被处决（未醉酒/中毒） | 邪恶阵营 |
| 超过最大天数限制（`maxDays`） | 强制结束 |

---

## 每日总结压缩

为防止长局游戏中会话历史超出模型 context 限制，系统在**每个白天结束时**自动压缩会话历史：

1. 对每个存活玩家的 `"chat"` 和 `"json"` 两个会话分别处理
2. 保留 system messages（角色档案、规则等），压缩 user/assistant 对话历史
3. 调用玩家自己的模型生成一段总结，以该玩家的视角保留所有关键信息
4. 用总结替换原有对话历史，后续调用在总结基础上继续追加
5. 每天的总结都会保留，不会被后续压缩覆盖

### 阵营差异化压缩

- **善良阵营模板**：侧重宣称分析、矛盾追踪、可信度评估、调查计划
- **邪恶阵营模板**：侧重队友协调、伪装身份维护、威胁评估、下一步行动计划

### 增量上下文系统

系统使用 `publicChatCursorBySession` 和 `privateInfoCursorBySession` 追踪每个玩家在每个会话中已看到的消息偏移量。后续 prompt 只注入**增量新增内容**，避免重复注入已知信息，节省 token 消耗。

每个白天结束时都会执行压缩（只要有对话历史）。压缩失败不影响游戏继续。

---

## 模型连通性探测（Probe）

每次运行前会自动探测所有模型是否可用：

- **参赛模型**：并发发送测试请求。不可用的模型会自动 fallback 到备用模型（`xiaomi/mimo-v2-pro`）
- **说书人模型**：同理，不可用时也 fallback 到备用模型
- 运行日志会明确显示哪些模型被替换了，并打印最终参赛名单

如果备用模型也不可用，程序会报错退出。

用 `--skip-probe` 跳过探测（已确认模型可用时加速启动）。

---

## 常见问题

### Q: 报错 "OPENROUTER_API_KEY not set"
设置环境变量：`export OPENROUTER_API_KEY="你的key"`

### Q: 报错 "fetch is not defined"
Node.js 版本低于 18，请升级。

### Q: 某个模型探测失败
模型会自动 fallback 到备用模型（`xiaomi/mimo-v2-pro`）。如果备用也失败，检查 API Key 和网络。

### Q: 跑到一半中断了
用 `--run-tag` 指定相同标签即可续跑：`node benchmark/run.js --run-tag 之前的标签`

### Q: 想换配板组
```bash
node benchmark/run.js --board-group 3  # 使用第 3 组配板
```

### Q: 想用随机配板而不是预设配板
将 `config.js` 中的 `boardFile` 设为 `""`，然后正常运行。随机模式下每个模型恰好当 1 次恶魔、2 次爪牙、9 次好人。

### Q: 一局要跑多久
12 人局通常 3-6 小时/局。

### Q: 大概花多少钱
每一局花费 $5-$18。运行时终端会实时显示每局花费。

### Q: 想换模型怎么办
编辑 `config.js` 的 `models` 数组。必须恰好 12 个。所有模型使用 OpenRouter 格式（如 `"openai/gpt-5.4"`）。支持重复模型——例如用 11 个 `xiaomi/mimo-v2-pro` + 1 个 `deepseek/deepseek-v3.2` 来测试特定模型的表现，系统会自动为重复的模型 ID 添加 `#1`、`#2` 等后缀以区分，API 调用时会自动去掉后缀。

### Q: 想只重新生成排行榜（不重跑游戏）
```bash
# 单批次
node benchmark/stats.js

# 汇总所有批次
node benchmark/stats.js --scan-all
```

### Q: 不想每次都生成新目录
```bash
node benchmark/run.js --no-timestamp
```
结果会写入 `results/raw/`，每次运行会跳过已完成的局。

### Q: 如何使用数据浏览器
```bash
node benchmark/gen-index.js           # 生成文件索引
python3 -m http.server 8000           # 启动 HTTP 服务
# 浏览器打开 http://localhost:8000/viewer.html
```
