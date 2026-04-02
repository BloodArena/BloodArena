# 血染钟楼 AI 对战评测系统 — 上手指南

## 这是什么

这是一个纯 Node.js 的全 AI 对战评测脚本。12 个不同的大模型各扮演一个玩家，在「暗流涌动」剧本下进行 12 人局的血染钟楼对战。脚本自动运行完整的游戏流程（夜晚结算 → 白天讨论 → 提名投票 → 处决），最终统计每个模型的胜率并生成排行榜。

**当前配置：每次 12 局（1 组），每个模型恰好当 1 次恶魔、2 次爪牙、9 次好人。可多次运行后汇总。**

---

## 环境要求

- **Node.js 18+**（需要内置 `fetch` 支持）
- **OpenRouter API Key**（一个 Key 调用所有模型）

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

去 [openrouter.ai](https://openrouter.ai) 注册获取。确保账户有余额。

### 第二步：先跑 1 局试试

```bash
node benchmark/run.js --limit 1
```

运行前会先进行**模型连通性探测**（probe），逐个检查 12 个参赛模型和说书人模型是否可用。不可用的模型会自动 fallback 到备用模型。如果想跳过探测：

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
  [Schedule] Verification passed (12 games, 1 groups)

[1/1] Running game_001...
    [game_001] Game start | seed=42000
    [game_001] Night 1 start
    [game_001] Night 1 end | dead=none
    [game_001] Day 1 discussion start | rounds=3
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
  const g = require('./results/20260402_143025/raw/game_001.json');
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
results/20260402_143025/raw/game_001_trajectories/
├── 玩家1_openai_gpt-5.4.jsonl
├── 玩家2_google_gemini-3.1-pro-preview.jsonl
├── ...
└── 说书人_xiaomi_mimo-v2-pro.jsonl
```

每个 `.jsonl` 文件按时间顺序记录该玩家的所有 LLM 调用（system prompt + user message + assistant response），可用来分析 AI 的推理过程。

也可以查看汇总的轨迹统计：
```bash
node -e "
  const g = require('./results/20260402_143025/raw/game_001.json');
  console.log('LLM调用总数:', g.trajectoryLog.length);
  console.log('Token用量:');
  Object.entries(g.tokenUsage).forEach(([model, u]) =>
    console.log('  ' + model + ': ' + u.calls + '次, ' + u.totalTokens + ' tokens, \$' + (u.cost||0).toFixed(4))
  );
"
```

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

### 第六步：多批次运行与汇总

每次运行 12 局使用不同的 seed，可以测多批次：

```bash
# 第 1 批（seed=42，默认）
node benchmark/run.js

# 修改 config.js 的 seed 为 43
node benchmark/run.js

# 修改 config.js 的 seed 为 44
node benchmark/run.js

# 汇总所有批次，生成总排行榜
node benchmark/stats.js --scan-all
```

`--scan-all` 会扫描 `results/` 下所有子目录的游戏结果，汇总输出到 `results/leaderboard_all.json`。也可以指定输出路径：

```bash
node benchmark/stats.js --scan-all --out results/my_leaderboard.json
```

### 第七步：查看排行榜网页

```bash
# 在项目根目录启动 HTTP 服务器
cd /mnt/user-ssd/yangqibin/The-Bloody
python3 -m http.server 8000
```

浏览器打开 `http://localhost:8000/leaderboard.html`。排行榜默认读取 `results/leaderboard.json`。如果用了 `--scan-all`，需要把生成的文件复制过去：

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
| `--progress MODE` | concise | 日志详细程度：`concise` / `balanced` / `detailed` |
| `--run-tag TAG` | 无 | 指定运行标签（用于结果目录名和断点续跑） |
| `--timestamped` | 默认开启 | 使用时间戳作为运行标签 |
| `--no-timestamp` | — | 关闭时间戳，结果直接写入 `results/raw/` |
| `--skip-probe` | — | 跳过模型连通性探测 |

**Progress 模式说明：**

- **`concise`**：只显示游戏级别关键节点（夜晚开始/结束、白天讨论/提名/处决）
- **`balanced`**：增加每次 LLM 调用完成通知、讨论轮次、提名和投票详情
- **`detailed`**：增加每次 LLM 调用的开始、回复预览、私聊检测、夜晚具体行动

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

---

## 文件说明

```
benchmark/
├── config.js      # 配置：模型列表、局数、API参数、说书人模型
├── llm.js         # OpenRouter API 调用封装（含本地定价 fallback）
├── schedule.js    # 角色分配调度器（保证公平轮换）
├── engine.js      # 游戏引擎（核心逻辑）
├── run.js         # 主入口（模型探测 + 运行评测 + 保存结果和轨迹）
├── stats.js       # 统计汇总（生成排行榜 JSON，支持多批次汇总）
└── README.md      # 本文档

results/
├── <timestamp>/           # 每次运行的独立目录
│   ├── raw/               # 每局结果
│   │   ├── game_001.json
│   │   ├── game_001_trajectories/   # 每个玩家的轨迹 JSONL
│   │   │   ├── 玩家1_openai_gpt-5.4.jsonl
│   │   │   └── ...
│   │   └── ...
│   └── leaderboard.json   # 该批次的排行榜
├── leaderboard_all.json   # --scan-all 汇总排行榜
└── leaderboard.json       # 排行榜网页读取的文件

leaderboard.html           # 排行榜网页（项目根目录）
```

---

## 配置说明（config.js）

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `totalGames` | 12 | 总局数（必须是 12 的倍数） |
| `groups` | 1 | 分组数（totalGames / 12） |
| `seed` | 42 | 随机种子（控制角色分配，改 seed 可跑不同分配） |
| `discussionRounds` | 3 | 每个白天讨论轮数 |
| `maxNominationsPerDay` | 3 | 每天最多提名次数 |
| `temperature` | 0.7 | LLM 温度 |
| `maxDays` | 20 | 单局最大天数（防死循环） |
| `storytellerModel` | xiaomi/mimo-v2-pro | 说书人用的模型（裁判，不参与排名） |
| `models` | 12 个模型 | 参赛模型列表（必须恰好 12 个） |

---

## 模型连通性探测（Probe）

每次运行前会自动探测所有模型是否可用：

- **参赛模型**：逐个发送测试请求。不可用的模型会自动 fallback 到 `xiaomi/mimo-v2-pro`（统一备用模型）
- **说书人模型**：同理，不可用时也 fallback
- 运行日志会明确显示哪些模型被替换了

如果备用模型也不可用，程序会报错退出。

用 `--skip-probe` 跳过探测（已确认模型可用时加速启动）。

---

## 常见问题

### Q: 报错 "OPENROUTER_API_KEY not set"
设置环境变量：`export OPENROUTER_API_KEY="你的key"`

### Q: 报错 "fetch is not defined"
Node.js 版本低于 18，请升级。

### Q: 某个模型探测失败
模型会自动 fallback 到备用模型。如果备用也失败，检查 API Key 和网络。

### Q: 跑到一半中断了
用 `--run-tag` 指定相同标签即可续跑：`node benchmark/run.js --run-tag 之前的标签`

### Q: 想跑多批次不同角色分配
每次修改 `config.js` 的 `seed`，然后运行。最后用 `node benchmark/stats.js --scan-all` 汇总。

### Q: 一局要跑多久
12 人局通常 5-15 分钟/局，12 局大约 1-3 小时。

### Q: 大概花多少钱
12 局预计 $1-10。运行时终端会实时显示每局花费。

### Q: 想换模型怎么办
编辑 `config.js` 的 `models` 数组。必须恰好 12 个。模型 ID 使用 OpenRouter 格式（如 `"openai/gpt-5.4"`）。

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
