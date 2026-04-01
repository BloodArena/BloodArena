# 血染钟楼 AI 对战评测系统 — 上手指南

## 这是什么

这是一个纯 Node.js 的全 AI 对战评测脚本。12 个不同的大模型各扮演一个玩家，在「暗流涌动」剧本下进行 12 人局的血染钟楼对战。脚本自动运行完整的游戏流程（夜晚结算 → 白天讨论 → 提名投票 → 处决），最终统计每个模型的胜率并生成排行榜。

**当前配置：12 局（1 组），每个模型恰好当 1 次恶魔、2 次爪牙、9 次好人。**

---

## 环境要求

- **Node.js 18+**（需要内置 `fetch` 支持）
- **OpenRouter API Key**（一个 Key 调用所有模型）

检查 Node 版本：
```bash
node --version  # 需要 v18.0.0 或更高
```

如果版本低于 18，请升级 Node.js。

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

这会运行第 1 局（game_001），大约需要 5-15 分钟（取决于模型响应速度）。

你会看到类似输出：
```
=== Blood on the Clocktower — AI Benchmark ===

Generating schedule...
  [Schedule] Verification passed (12 games, 1 groups)
Schedule: 12 games in 1 group(s)

[1/1] Running game_001...
    Players: 玩家1(占卜师), 玩家2(小恶魔), ...
  ✓ game_001 done — good wins (demon_killed) — 4 days — $0.350 — 120s
```

### 第三步：检查结果

结果保存在 `results/raw/game_001.json`。打开看看：

```bash
# 查看基本信息（不含完整聊天记录）
node -e "
  const g = require('./results/raw/game_001.json');
  console.log('胜方:', g.winner, '(' + g.winCondition + ')');
  console.log('天数:', g.totalDays, '夜数:', g.totalNights);
  console.log('花费: $' + (g.totalCost || 0).toFixed(3));
  console.log('玩家:');
  g.players.forEach(p => console.log('  ' + p.name, p.role, '(' + p.team + ')', p.alive ? '存活' : '死亡'));
"
```

### 第四步：检查轨迹是否正常

轨迹记录了每一次 LLM 调用的完整 prompt 和回复：

```bash
# 查看 LLM 调用次数和各模型调用量
node -e "
  const g = require('./results/raw/game_001.json');
  console.log('LLM调用总数:', g.trajectoryLog.length);
  console.log('Token用量:');
  Object.entries(g.tokenUsage).forEach(([model, u]) =>
    console.log('  ' + model + ': ' + u.calls + '次, ' + u.totalTokens + ' tokens, $' + (u.cost||0).toFixed(4))
  );
"
```

```bash
# 查看前 5 条聊天记录
node -e "
  const g = require('./results/raw/game_001.json');
  g.chatLog.slice(0, 5).forEach(c => console.log('[' + c.phase + '] ' + c.speaker + ': ' + c.text.slice(0, 80)));
"
```

```bash
# 查看某个 AI 玩家的一次发言的完整 prompt（第一条玩家类型的轨迹）
node -e "
  const g = require('./results/raw/game_001.json');
  const t = g.trajectoryLog.find(t => t.actorId !== 'storyteller');
  if (t) {
    console.log('玩家:', t.actor, '阶段:', t.phase);
    t.messages.forEach(m => console.log('--- ' + m.role + ' ---\n' + m.content.slice(0, 200) + '...'));
    console.log('--- 回复 ---\n' + t.response.slice(0, 200));
  }
"
```

**检查要点：**
- 游戏是否正常结束（winner 不是 "draw"）
- 天数是否合理（通常 3-8 天）
- 聊天记录中 AI 是否在用中文正常讨论
- Token 用量是否合理（每局通常 50K-300K tokens）
- 花费是否在预期范围内

### 第五步：如果没问题，跑完整 12 局

```bash
node benchmark/run.js
```

**支持断点续跑**：如果中途中断（Ctrl+C 或网络错误），再次运行同样的命令即可，已完成的局会自动跳过。

完成后会自动生成排行榜：
```
=== Completed 12/12 games — Total cost: $X.XXX ===

Generating leaderboard...

  Leaderboard (12 games, $X.XX total):
  -------------------------------------------
  Rank  Model                  Overall  Towns    ...
  -------------------------------------------
  1     GPT-5.4                75.0%    80.0%    ...
  2     Claude Opus 4.6        66.7%    ...
  ...
```

### 第六步：查看排行榜网页

排行榜数据在 `results/leaderboard.json`，网页在项目根目录的 `leaderboard.html`。

```bash
# 在项目根目录启动 HTTP 服务器
cd /mnt/user-ssd/yangqibin/The-Bloody
python3 -m http.server 8000
```

然后浏览器打开 `http://localhost:8000/leaderboard.html`。

---

## 文件说明

```
benchmark/
├── config.js      # 配置：模型列表、局数、API参数
├── llm.js         # OpenRouter API 调用封装
├── schedule.js    # 角色分配调度器（保证公平轮换）
├── engine.js      # 游戏引擎（核心逻辑，~2000行）
├── run.js         # 主入口（运行评测）
├── stats.js       # 统计汇总（生成排行榜JSON）
└── README.md      # 本文档

results/
├── raw/           # 每局结果（game_001.json, game_002.json, ...）
└── leaderboard.json  # 排行榜汇总数据

leaderboard.html   # 排行榜网页（项目根目录）
```

---

## 配置说明（config.js）

如果需要修改配置，编辑 `benchmark/config.js`：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `totalGames` | 12 | 总局数（必须是 12 的倍数） |
| `groups` | 1 | 分组数（totalGames / 12） |
| `discussionRounds` | 3 | 每个白天讨论轮数 |
| `temperature` | 0.7 | LLM 温度 |
| `maxDays` | 20 | 单局最大天数（防死循环） |
| `storytellerModel` | deepseek-chat-v3-0324 | 说书人用的模型（裁判，不参与排名） |
| `models` | 12 个模型 | 参赛模型列表（必须恰好 12 个） |

**扩展到 120 局**：改 `totalGames: 120` 和 `groups: 10`，每个模型将恰好当 10 次恶魔、20 次爪牙、90 次好人。

---

## 常见问题

### Q: 报错 "OPENROUTER_API_KEY not set"
设置环境变量：`export OPENROUTER_API_KEY="你的key"`

### Q: 报错 "fetch is not defined"
Node.js 版本低于 18，请升级。

### Q: 某个模型一直报错
可能是 OpenRouter 上该模型不可用或余额不足。检查 OpenRouter 控制台确认模型状态。脚本会自动重试 3 次，超时 60 秒。

### Q: 跑到一半中断了
直接再运行 `node benchmark/run.js`，已完成的局会自动跳过。

### Q: 一局要跑多久
取决于模型响应速度。12 人局通常 5-15 分钟/局。12 局大约 1-3 小时。

### Q: 大概花多少钱
取决于模型定价。12 局预计 $1-10（主要看是否包含 Claude Opus 等贵模型）。运行时终端会实时显示每局花费。

### Q: 想换模型怎么办
编辑 `benchmark/config.js` 的 `models` 数组。模型 ID 必须是 OpenRouter 支持的格式（如 `"openai/gpt-5.4"`）。必须恰好 12 个模型。改完后删掉 `results/raw/` 下的旧结果再重跑。

### Q: 想只重新生成排行榜（不重跑游戏）
```bash
node -e "require('./benchmark/stats').generateLeaderboard()"
```
