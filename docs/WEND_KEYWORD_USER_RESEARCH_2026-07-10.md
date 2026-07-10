# LinkedIn Wend 关键词、用户需求与产品机会调研

> 调研日期：2026-07-10
> 市场范围：英语市场、公开可访问网页与社媒讨论
> 目标站点：WendAnswerToday.org
> 关键词：`linkedin wend`、`wend linkedin`、`linkedin wend answer`、`wend answer today`

## 1. 执行摘要

### 核心判断

1. 四组词背后不是四个独立需求，而是两个主需求簇：
   - **导航/发现需求**：找到官方 Wend、解决 Wend 不显示或打不开。
   - **解题/救急需求**：找今天的答案、最小提示、正确路径，避免丢失 streak。
2. **“今天答案 + 分级提示”是最高优先级**。它兼具每日复发、时间敏感和高行动意图；`linkedin wend answer`、`wend answer today` 及其变体已经进入 Google 自动补全，SERP 也出现大量日更答案页。
3. **“LinkedIn Wend”是用户量最大的头部词，但意图更混合**。它同时包含去官方游戏、了解规则、找今天答案、解决“不显示”等需求。用户甚至在 LinkedIn 官方评论中明确表示，只有在搜索引擎输入 “Wend LinkedIn” 才能进入游戏。
4. **“真正可玩的 Unlimited/Practice”是最清晰的新功能机会**。Google 自动补全已经出现 `wend linkedin game practice`、`wend linkedin game unlimited`；Reddit 用户也已主动迁移到第三方 unlimited 产品。目前本站 `/wend-unlimited` 只是历史答案板的 reveal 浏览器，不是真正的可玩、无限生成产品。
5. **当前最大经营风险不是缺少更多 SEO 文章，而是日更时效**。2026-07-10 官方 Wend #32 已上线约 5 小时并有 232 条评论时，本站公开首页仍显示 2026-07-09 的 #31。对于 `answer today` 需求，迟到几小时就会直接损害信任和排名。
6. **不要为四个短语各建一个近重复页面**。推荐把 `/` 定位为品牌/导航枢纽，把 `/linkedin-wend-answer-today` 定位为唯一“今日答案”页面；否则当前两页的标题、内容和组件高度重叠，存在关键词内耗和重复内容风险。

### 建议优先级

- **P0：日更可靠性、唯一今日答案页、意图路由、分级提示体验、关键事件测量。**
- **P1：原创真 Unlimited、可点击/可拖拽解题模式、补齐完整历史、移动端替代交互、反馈闭环。**
- **P2：个人练习数据、无剧透分享卡、难度/技巧专题、本地化。**

### 本轮实施状态

日更可靠性子项已完成 P0/P1：洛杉矶时区、外部安全触发、公开 freshness API、双源一致性、几何校验、真实 provenance、生产可见性闸门、恢复闭环和透明 pending UI 均已落地。部署后还需配置外部 scheduler 与一分钟状态监控；“唯一今日答案 URL”、真 Unlimited、历史补齐等产品/SEO 项仍按本报告原优先级单独推进。

## 2. 研究方法与限制

### 使用的可观察信号

- LinkedIn 官方新闻、帮助中心、官方 Wend 日更帖及其公开互动数。
- Google Suggest 在 2026-07-10 的自动补全结果。
- 公开 Reddit 帖子和 LinkedIn 评论中的第一人称问题与行为。
- 四组关键词的 SERP 页面类型、更新日期和功能对比。
- 本地项目代码与线上站点的页面、功能、数据覆盖和埋点审计。

### 不能从公开网页可靠获得的数据

- 四个关键词的精确月搜索量。
- Wend 独立 DAU/MAU、地域和设备构成。
- 本站 Google Search Console 的展示、点击、CTR、平均排名。
- 本站 GA4/Plausible 的独立访客、回访和 reveal 行为分布。

因此，本文中的“用户量”和“频率”是**相对等级与方向性判断**，不是虚构的月搜索量。后续必须用 GSC、站内分析和付费关键词工具校准。

### 社媒覆盖说明

本轮能公开复核、带日期和互动信息的第一人称样本主要来自 LinkedIn 与 Reddit。X、Threads、Facebook、YouTube、Bluesky 的公开搜索没有返回足够可靠的 Wend 用户交流样本，TikTok 还限制了自动访问；这表示“本轮缺少可审计证据”，不表示这些平台没有讨论。若后续要估算跨平台声量，应使用合规的 social-listening 工具或各平台官方数据权限继续验证。

## 3. 市场与用户规模背景

### 3.1 官方事实

- LinkedIn 在 2026-06-08 发布 Wend，定位为“词汇 + 模式识别 + 轻逻辑”的短时工作间隙游戏；每个字母只使用一次。[LinkedIn Newsroom](https://news.linkedin.com/2026/LinkedIn-AnnouncesWend)
- LinkedIn Games 每天在太平洋时间午夜更新，旧题同时过期；官方提供 streak、排行榜、分享和日更讨论。[LinkedIn Games Help](https://www.linkedin.com/help/linkedin/answer/a6863543)
- 官方说明访客可以在不登录的情况下玩游戏，但不会保存成绩、streak 或排行榜权益。[Guest Mode Help](https://www.linkedin.com/help/linkedin/answer/a6880616)
- LinkedIn 公布的“数十亿次解题、86% 次日回访、82% 七日后仍在玩”是**整个 LinkedIn Games 产品组合的数据，不是 Wend 单品数据**。[LinkedIn Newsroom](https://news.linkedin.com/2026/LinkedIn-AnnouncesWend)

### 3.2 可观察的 Wend 早期活跃度

- Wend #24 至 #31 的 8 条完整日更帖，平均每帖约 **484 次 reaction、539 条评论**；大量评论是玩家自动分享的成绩，也夹杂真实的卡点、难度和产品反馈。[官方 Wend 页面](https://www.linkedin.com/showcase/wend-games/)
- 2026-07-10 的 Wend #32 上线约 5 小时即有 **211 次 reaction、232 条评论**。[Wend #32 帖子](https://www.linkedin.com/posts/wend-games_wend-linkedingames-activity-7481240815399251968-EW-r)
- 首题发布帖公开显示 2,798 次 reaction、815 条评论，说明新品发布获得了显著初始曝光。[Wend No.1 帖子](https://www.linkedin.com/posts/wend-game_wend-no-1-activity-7470006830098747392-o-q_)

这些互动数只能证明“每天有数百名公开互动的高参与玩家”，不能等同于总玩家数或搜索用户数。真实玩家规模必然更大，但公开证据不足以给出数字。

## 4. 四组关键词：相对用户量、频率与真实意图

评分说明：用户量 1–5 是 Wend 细分市场内的相对覆盖；频率区分一次性、偶发和每日复发；优先级综合搜索意图、复发、痛点和本站可承接性。

| 关键词 | 相对用户量 | 频率 | 主要意图 | 证据与噪音 | 产品优先级 |
|---|---:|---|---|---|---|
| `linkedin wend` | 5/5 | 混合：首次发现 + 每日导航 | 找官方入口；了解是什么；今天答案；不显示 | Google 补全出现 `answer`、`today`、`not showing up`、`solution`；SERP 同时有官方游戏、答案站和少量无关 Wend 公司 | P0，作为品牌/导航簇 |
| `wend linkedin` | 4/5 | 混合，较强导航性 | 同上，但更像用户自然倒装表达 | Google 补全出现 `answer today`、`game`、`practice`、`unlimited`；SERP 更容易混入叫 Wend 的公司、项目和人名 | P0 词面覆盖，不单建页面 |
| `linkedin wend answer` | 4/5 | **每日复发** | 卡住后要答案、路径或确认 | Google 补全出现 `answers today`、`solution today`、`game answer today`；SERP 高密度日更答案页 | **P0，最高转化意图** |
| `wend answer today` | 3/5 | **每日复发** | 最短路径拿当天答案 | 自动补全第一项就是原词并出现 `wend answer today linkedin`；有少量 Wendy/新闻语义噪音 | **P0，纳入唯一今日答案页** |

Google Suggest 快照：

- [`linkedin wend`](https://suggestqueries.google.com/complete/search?client=firefox&q=linkedin%20wend)
- [`wend linkedin`](https://suggestqueries.google.com/complete/search?client=firefox&q=wend%20linkedin)
- [`linkedin wend answer`](https://suggestqueries.google.com/complete/search?client=firefox&q=linkedin%20wend%20answer)
- [`wend answer today`](https://suggestqueries.google.com/complete/search?client=firefox&q=wend%20answer%20today)

### 4.1 相关需求词的增量价值

| 相关词/意图 | 公开信号 | 判断 |
|---|---|---|
| `linkedin wend not showing up` / `where is linkedin wend` | 自动补全 + 多个独立 Reddit 主题 + LinkedIn 官方评论 | 上线初期高痛点，可能随 rollout 稳定而衰减；适合常青排障页和首页直达按钮 |
| `wend linkedin game unlimited` / `practice` | 自动补全 + Reddit 主动迁移 + 多个竞品已做 | 绝对量未知，但复发和留存价值高；P1 产品机会 |
| `linkedin wend how to play` | 自动补全可返回精确短语；官方首帖评论存在规则误解 | 一次性需求，中等流量；内容质量比数量重要 |
| `linkedin wend solver` | 自动补全没有形成有效 Wend 建议，返回结果噪音大 | 目前不应把“solver”当最大 SEO 词；它更适合作为 answer 页面内的核心工具 |
| `reset time` / `streak` | 官方机制 + 社媒反复提到 streak | 复发度高，但官方已强满足；本站只需倒计时、直达和准确说明 |

## 5. 全网社媒真实交流：用户在说什么

### 5.1 找不到游戏：不是理论需求，而是用户真实搜索行为

- 发布当天的 Reddit 讨论中，多名用户表示新版 Wend 不在 Games Hub 或手机 App 中，最终靠 `linkedin.com/games/wend` 直达；帖子获得 27 票并持续收到相同问题。[Reddit：New game on LinkedIn](https://www.reddit.com/r/linkedin/comments/1u0xwo9/new_game_on_linkedin/)
- 另一讨论中，用户已经尝试更新 App、重装、切桌面、清缓存，仍只能用直达链接；回复者也表示 App 和网页均看不到。[Reddit：Wend not appearing](https://www.reddit.com/r/linkedin/comments/1u4rgow/new_game_wend_not_appearing_for_me/)
- Wend #13 的 LinkedIn 官方帖下，有用户明确说只能在搜索引擎输入 **“Wend LinkedIn”** 才能找到游戏。这直接验证了用户给出的第二组关键词。[LinkedIn Wend #13](https://www.linkedin.com/posts/wend-games_wend-13-activity-7474355446187986944-U_gj)

**真实 JTBD**：我知道有 Wend，但 LinkedIn 入口不可靠；请让我一键进入，不要让我研究平台导航。

### 5.2 卡住但不想完全作弊：需要“最小有效帮助”

- Wend #30 评论里，有人花了大部分时间找第一个词，找到后其他词才连锁出现；也有人因为没先看词长而走错方向。[LinkedIn Wend #30](https://www.linkedin.com/posts/wend-games_wend-linkedingames-activity-7480516066268340225-YX1g)
- Wend #31 评论中，公开高互动表达是“第一个词马上找到，然后卡住”；这类用户需要的是第二步锚点，而非直接显示完整答案。[LinkedIn Wend #31](https://www.linkedin.com/posts/wend-games_wend-linkedingames-activity-7480878437377732608-hQ-d)
- Wend #13 的高难度题中，用户把无主题词表形容成 “alphabet soup”，并多次反馈长词很难、找词过程痛苦。[LinkedIn Wend #13](https://www.linkedin.com/posts/wend-games_wend-13-activity-7474355446187986944-U_gj)
- Reddit 上创建日更答案站的用户将需求描述为：走错一步就会破坏整盘，需要快速、稳定、免费地检查答案和路径。[Reddit：daily Wend answer resource](https://www.reddit.com/r/wordlegame/comments/1u5cxn5/i_created_a_daily_resource_for_linkedin_wend/)

**真实 JTBD**：我不是想看整盘答案；我只想知道第一个可靠锚点、下一个字母或哪条路径错了，从而自己完成。

### 5.3 Streak、速度和社交比较推动每日复发

- 官方结果卡反复突出耗时、是否使用 hints、backtracks、百分位、与 CEO/连接人的比较和连续胜利天数；这些字段占据了日更帖的大部分公开评论。[Wend #32](https://www.linkedin.com/posts/wend-games_wend-linkedingames-activity-7481240815399251968-EW-r)
- LinkedIn 明确要求玩家在太平洋时间午夜前完成题目才能维持 streak，并提供 streak freeze。[Streaks Help](https://www.linkedin.com/help/linkedin/answer/a6296670)
- Reddit 用户因为首日入口缺失导致 streak 与题号错位而明显懊恼。[Reddit：New game on LinkedIn](https://www.reddit.com/r/linkedin/comments/1u0xwo9/new_game_on_linkedin/)

**真实 JTBD**：我每天只想花几分钟完成并保住 streak；卡住时的帮助必须快、准确、可控。

### 5.4 无限练习已经出现迁移行为

- Reddit 用户在上线讨论中直接表示已转去有 unlimited puzzles 的第三方站点。[Reddit：New game on LinkedIn](https://www.reddit.com/r/linkedin/comments/1u0xwo9/new_game_on_linkedin/)
- r/puzzles 的长期 LinkedIn Games 讨论在 2026-06-30 新增了“有没有类似 Wend 的替代品”的问题。[Reddit：LinkedIn Games alternatives](https://www.reddit.com/r/puzzles/comments/1gqmcwb/linkedin_games/)
- Google 自动补全已出现 `wend linkedin game practice`、`wend linkedin game unlimited`。[Google Suggest](https://suggestqueries.google.com/complete/search?client=firefox&q=wend%20linkedin)

**真实 JTBD**：每日一题不够；我想继续练、提高速度，最好不用登录，也不要等到明天。

### 5.5 移动端拖拽失败是高痛点的小众需求

- Reddit 用户反馈几乎每天会遇到 tap-hold-drag 后手机无响应，找到词也无法选中。[Reddit：WEND, LinkedIn's hidden new game](https://www.reddit.com/r/linkedin/comments/1u7b8on/wend_linkedins_hidden_new_game/)

**真实 JTBD**：我已经知道答案，但官方触控交互不工作；请给我可点击、可撤销的替代输入方式或明确排障路径。

## 6. 需求矩阵与优先级

综合分公式（方向性）：用户覆盖 30% + 复发 25% + 紧迫性 20% + 市场缺口 15% + 证据置信度 10%，换算为 100 分。

| 排名 | 用户/触发 | 核心任务 | 覆盖 | 复发 | 紧迫 | 缺口 | 置信度 | 综合分 | 优先级 |
|---:|---|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 今日卡住；`answer today` | 立即得到正确词和路径 | 5 | 5 | 5 | 3 | 5 | **94** | P0 |
| 2 | 想自己完成；`hint` / `solution` | 只获得下一个有效线索 | 4 | 5 | 5 | 3 | 5 | **88** | P0 |
| 3 | 每日题难度波动 | 先找到可靠锚点、避免假词和回退 | 4 | 5 | 3 | 3 | 5 | **80** | P0/P1 |
| 4 | 每日一题不够；`unlimited` / `practice` | 连续玩原创题并提高速度 | 3 | 5 | 3 | 5 | 4 | **78** | P1 |
| 5 | Wend 不显示；`linkedin wend` | 一键去官方游戏并快速排障 | 4 | 3 | 4 | 4 | 5 | **77** | P0，短期更高 |
| 6 | 手机拖拽失败 | 用点击/键盘完成路径或查错 | 2 | 4 | 5 | 5 | 3 | **73** | P1 |
| 7 | 喜欢分享成绩和连续记录 | 记录练习表现、分享无剧透结果 | 3 | 5 | 2 | 2 | 5 | **67** | P2；官方已强满足 |
| 8 | 关心 reset/streak | 知道剩余时间并避免错过 | 3 | 4 | 3 | 2 | 5 | **66** | P1，小功能 |
| 9 | 新玩家；`how to play` | 理解规则和第一套可复用策略 | 4 | 1 | 3 | 2 | 4 | **55** | P1 内容 |
| 10 | 错过历史题；`archive` | 按日期/题号回看答案与路径 | 2 | 2 | 2 | 3 | 4 | **47** | P1/P2 |

## 7. 竞品与 SERP 供给

| 页面/站点 | 核心供给 | 优势 | 明显缺口 |
|---|---|---|---|
| [WendAnswerToday.org](https://wendanswertoday.org/) | 今日答案、逐字/逐词 reveal、提示、归档、solver | 自定义 HTML 路径、默认不剧透、验证状态、品牌免责声明 | 2026-07-10 仍停在 #31；首页和 today 页重复；不是真 Unlimited；本地历史从 06-22 才开始 |
| [PlayWendGame](https://www.playwendgame.com/) | 当日可玩题、Unlimited、完整归档、无登录 | #32 当天已上线；真正可玩；保存进度 | 更接近复制官方游戏，品牌/IP 风险更高；答案救急和逐级帮助不如本站明确 |
| [WendPlay Practice](https://wendplay.com/practice) | 50+ 练习题、难度筛选、进度 | 强留存和训练定位 | 可能夸大与官方规则的完全一致性；内容和原创验证透明度有限 |
| [WendLinkedIn](https://wendlinkedin.com/) | 答案、solver、archive、practice | 功能组合完整 | 2026-07-10 仍为 #30；答案词在顶部直接可见，与“spoiler-safe”承诺冲突 |
| [Try Hard Guides](https://tryhardguides.com/linkedin-wend-answer-today/) | 当天答案图、按月历史 | 成熟域名、答案直接 | 以静态图为主、容易整盘剧透；规则文案仍按首题固定 4 个词描述，无法覆盖后续变化 |
| [PuzzNest](https://puzznest.com/linkedin-games/archives/wend) | 从首题开始的答案归档 | 历史覆盖早、跨游戏导流 | 静态答案为主、缺少最小提示和交互路径 |
| [WendGames](https://wendgames.org/) | 规则、答案、Unlimited | 产品页完整、解释丰富 | 写着官方版必须登录，但 LinkedIn 帮助中心说明 Guest Mode 可用，准确性可被本站超越 |
| [Today’s Pinpoint Wend](https://todayspinpoint.com/answers/linkedin-wend-today/) | 当天占位页、交互答案承诺 | 抢占当天 URL | 抓取结果曾同时显示“已验证”标题和“仍在准备”正文，信任风险高 |

### 竞品格局结论

1. **日更答案已经是拥挤赛道**，仅发布“答案词列表”不足以形成壁垒。
2. **真正差异化来自三个维度**：最快可靠发布、最小剧透交互、原创可玩练习。
3. 竞品已经把 `Unlimited` 变成用户预期；本站如果继续把历史 reveal 浏览器称为 Unlimited，会产生承诺落差。
4. 准确性仍有明显市场缺口：固定词数、必须登录、当天占位与实际内容不一致等错误普遍存在。

## 8. 对本站的代码与线上现状审计

### 已覆盖且应保留

- 今日答案、逐字/逐词/全路径 reveal。
- spoiler-safe hints、难度、常见错误和说明。
- 官方游戏直达、倒计时、最新验证题 fallback。
- 题号/日期归档和每题独立 URL。
- Plausible、GTM、Clarity 基础分析设施；reveal 行为已有自定义事件。
- 无官方截图、使用自定义网格、明确非官方关系。

### 关键缺口

1. **线上日更迟到**：2026-07-10 官方 #32 已上线，站点仍显示 #31。[官方 #32](https://www.linkedin.com/posts/wend-games_wend-linkedingames-activity-7481240815399251968-EW-r) / [本站线上](https://wendanswertoday.org/)
2. **首页与 `/linkedin-wend-answer-today` 重复**：两页均使用相同今日数据、answer reveal、hints 和近似标题，应该明确唯一主页面。
3. **`WendSolver` 名称高于实际能力**：当前组件是答案 reveal viewer，不能让用户输入和验证自己的路径。
4. **`/wend-unlimited` 不是真 Unlimited**：只是 17 个历史 verified board 的前后切换，并继续使用 reveal 控件；页面目前 `noindex,follow` 是正确保护，但产品命名需要更准确。
5. **历史数据不完整**：本地 `data/puzzles/wend` 从 2026-06-22 开始，而公开竞品已覆盖首题至今。
6. **how-to 内容过薄**：没有完整解释词长、墙、所有开放格必须恰好用一次、错误候选词如何造成孤岛等核心认知。
7. **缺少行为闭环**：没有追踪官方入口点击、hint 层级、practice start/complete、stale fallback exposure，也没有询问用户为何卡住。

## 9. 三种网站定位方案

### 方案 A：答案优先站

- `/` 继续直接做“今日答案”。
- `/linkedin-wend-answer-today` 301 到 `/` 或 canonical 到 `/`。
- 优点：保留当前首页已有的答案词排名和最短转化链路。
- 缺点：`linkedin wend` 的入口、规则、排障、练习等混合意图被挤压。

### 方案 B：品牌入口 Hub + 独立今日答案页（推荐）

- `/` 目标词：`linkedin wend`、`wend linkedin`；提供四个明确入口：Play Official、Hints、Today’s Answer、Unlimited Practice，并在 Wend 不显示时给直达/排障。
- `/linkedin-wend-answer-today` 作为唯一日更答案页，目标词：`linkedin wend answer`、`wend answer today` 及日期/题号长尾。
- 优点：与四组词的两大意图完全对齐，减少重复，便于未来扩展真 Unlimited。
- 缺点：需要谨慎迁移首页现有排名；上线前要用 GSC 确认 `/` 当前承接的 query 比例。

### 方案 C：做完整第三方游戏替代站

- 首页直接可玩当天题，外加 unlimited、账户、个人 streak 和排行榜。
- 优点：留存上限最高。
- 缺点：开发成本、内容审核、商标/游戏资产/IP 和与 LinkedIn 正面竞争的风险最高。

**推荐方案 B**：以“官方入口 + 最小剧透帮助 + 原创练习”为产品边界，不复制 LinkedIn 的社交排行榜和完整外观。

## 10. 功能与内容方向

### P0：0–30 天

#### P0-1 日更发布 SLO 与可见状态

- 目标：至少 99% 的天数在 Pacific midnight 后 5 分钟内发布 verified 当天题（PDT 为 07:05 UTC，PST 为 08:05 UTC）；失败时在 1 分钟内告警。
- 页面状态必须明确区分：`Today verified`、`Solving now`、`Latest verified fallback`，禁止标题说今天已验证而正文仍是昨天。
- 记录事件：`daily_ready_at`、`stale_fallback_view`、`publish_retry_count`。
- KPI：按时率、旧题曝光占比、当天答案页 Search Console CTR。

#### P0-2 确定唯一今日答案 URL

- 在读取 GSC 后选择方案 A 或 B；推荐 B。
- 对重复页使用 301/canonical，不要继续让两页同时完整渲染同一 answer 和 hints。
- 每日题页保留永久日期/题号 archive URL，避免“today”内容变更后丢失历史价值。

#### P0-3 顶部意图路由

首屏四个动作：

1. **Play Official Wend**：满足品牌导航和不显示问题。
2. **Give Me a Hint**：滚到分级提示，不剧透。
3. **Reveal Today’s Answer**：直接到 answer viewer。
4. **Practice More**：在真 Unlimited 完成前标为 Practice Archive，不要承诺 endless。

#### P0-4 把 hints 变成结构化“帮助阶梯”

推荐顺序：

1. 只显示词长和难度。
2. 提示最受限/最长锚点所在区域。
3. 给单词定义或首尾字母，不显示完整词。
4. reveal 下一个字母。
5. reveal 单个词。
6. reveal 完整路径。

每层单独埋点，最终用真实行为决定保留多少层。

#### P0-5 补齐测量

至少新增：

- `Official Wend Click`
- `Hint Opened`：hint level、puzzle number、page type
- `Reveal Letter` / `Reveal Word` / `Reveal All`
- `Archive Opened`
- `Practice Started` / `Practice Completed`
- `Not Showing Help Clicked`
- `Stale Fallback Viewed`

### P1：30–60 天

#### P1-1 真正原创的 Wend Unlimited

- 使用原创词库和原创网格生成，不复制官方每日题。
- 允许点击或拖拽路径、撤销、重置、提交和即时验证。
- 难度至少用：网格大小、词长、重复字母、墙数量、分支数衡量。
- 首期只做 30–50 个高质量手工验证题也可以，质量优先于“无限”文案。
- KPI：practice start rate、完成率、每次会话题数、7 日回访。

#### P1-2 移动端替代交互

- 支持“依次点击字母”构建路径，不强制拖拽。
- 提供键盘可访问性、撤销、当前路径预览和非法移动原因。
- 这个功能既服务原创 practice，也能把 solver 从 reveal viewer 升级为真正路径验证器。

#### P1-3 完整历史和可筛选 Archive

- 补齐首题到 2026-06-21 的缺失历史。
- 可按日期、题号、难度、词长和最长词筛选。
- 每页必须有独特的难点/锚点/常见误区，避免模板化薄内容。

#### P1-4 改写 How-to / Strategy 内容

重点内容：

- 不是普通 word search；路径可以转弯但不能对角。
- 所有开放字母恰好使用一次，词之间不能共享格。
- 先看词长和受限格；长词通常路径更少，但角/边也可能是更强锚点。
- 如何识别假词导致的孤立格、错误 backtrack 和重复字母路径。
- 用 Wend #13 这种长词题做“高难题怎么拆”的案例，但避免未经许可复制官方画面。

#### P1-5 一键问题反馈

在 reveal 后问一个匿名单选：

- Couldn’t find the first word
- Knew the word, not the path
- One word blocked the rest
- Mobile input did not work
- Just checking my answer

每周用反馈比例调整 hints 和首页 CTA。

### P2：60–90 天

- 本地保存的 practice streak、平均时间、hint 使用率；不必复制 LinkedIn 排行榜。
- 无剧透分享卡：题号、时间、使用几次提示，不包含答案词。
- “本周最难 Wend”“常见假词”“重复字母技巧”等数据内容。
- 仅在 GSC 显示明显非英语需求后再做本地化。
- 暂不扩展其他 LinkedIn Games；先证明 Wend 的搜索流量、回访和原创 practice 留存。

## 11. 内容架构建议

| 页面 | 主意图 | 目标关键词 | 内容边界 |
|---|---|---|---|
| `/` | 品牌/导航 Hub | `linkedin wend`, `wend linkedin` | 官方入口、今天状态、四类任务路由、简短规则、not showing 快速帮助 |
| `/linkedin-wend-answer-today` | 今日解题 | `linkedin wend answer`, `wend answer today` | 今日 verified 数据、提示阶梯、逐词/逐路径 reveal、当天难点 |
| 每日永久 URL | 日期/题号长尾 | `wend #32 answer`, `wend answer july 10 2026` | 归档的唯一答案、路径和独特分析 |
| `/where-is-linkedin-wend` | 入口/排障 | `linkedin wend not showing up`, `where is linkedin wend` | 官方直达、平台发现路径、设备排障、Guest Mode 说明 |
| `/how-to-play-linkedin-wend` | 新手规则 | `linkedin wend how to play` | 完整准确规则、交互说明、简单例子 |
| `/how-to-solve-linkedin-wend` | 策略 | `linkedin wend tips`, `how to solve wend` | 锚点、词长、墙、重复字母、孤岛、backtrack |
| `/wend-unlimited` | 原创留存 | `linkedin wend unlimited`, `wend practice` | 真可玩后才 index；原创题、难度、进度 |

### 不建议做

- 为四个词序变体分别复制页面。
- 自动生成大量只有日期和答案词不同的薄页面。
- 把 `solver` 堆进每个标题；搜索证据暂不支持它是最大词。
- 抓取 LinkedIn 账号数据、排行榜或评论做产品内容。
- 复制 LinkedIn Logo、蓝色整体视觉、官方截图或近似官方游戏 UI。

## 12. 30/60/90 天实验路线

### 0–30 天：守住“今天”

- 修复日更链路并建立 Pacific midnight +5 分钟 SLO，自动适配夏令时。
- 获取 GSC 四组词和相关词过去 28 天数据，按 URL 看内耗。
- A/B 测试首屏：当前 answer-first vs 四任务 intent router。
- 完成 hint 分层埋点和 stale fallback 埋点。
- 补齐首题以来历史数据。

**继续标准**：按时发布 ≥99%；今日页 query CTR 上升；至少能确认用户更常使用逐字/逐词帮助还是 Reveal All。

### 31–60 天：验证“继续玩”

- 上线 30–50 个原创可玩练习题或可靠生成器 beta。
- 支持点击路径和移动端验证。
- 用首页/完成后 CTA 导流到 practice。
- 收集匿名卡点反馈。

**继续标准**：practice start rate、每会话题数和 7 日回访明显高于 archive 浏览；若没有，暂停扩建生成器。

### 61–90 天：建立留存与差异化

- 根据真实数据增加难度筛选、个人练习统计和无剧透分享。
- 产出高难题策略专题，不扩大低价值日更模板。
- 评估是否需要本地化、PWA 或浏览器提醒。

**继续标准**：非答案页自然流量占比提升，practice 产生稳定回访，且不损害今日答案页速度和准确率。

## 13. 测量计划

### North Star

**Weekly Helped Solvers**：一周内完成一次有价值动作的独立用户，包括官方直达、hint、逐词/逐字 reveal、archive 或 practice 完成；排除只打开即离开的访问。

### 经营指标

| 目标 | 指标 |
|---|---|
| 获取 | GSC impressions、clicks、CTR、position，按四组词和 URL 分组 |
| 时效 | verified publish time、Pacific midnight +5 分钟达标率、stale fallback views |
| 解题价值 | hint open rate、letter/word/all reveal 分布、time to first action |
| 导航价值 | Official Wend click-through、not-showing 页进入官方比例 |
| 留存 | 1/7/28 日回访、practice sessions per user、连续练习天数 |
| 内容质量 | archive 长尾点击、how-to 到 today/practice 的转化、错误反馈率 |
| 风险护栏 | unverified publish = 0、错误答案 = 0、意外剧透反馈、页面性能 |

### GSC 必须回答的五个问题

1. `/` 当前到底由 `linkedin wend` 还是 `answer today` 获得更多展示？
2. `/` 与 `/linkedin-wend-answer-today` 是否同时竞争同一 query？
3. 移动端展示是否远高于桌面，且 CTR/参与度是否更差？
4. `unlimited`、`not showing`、`how to play` 的真实展示量是否已形成？
5. 哪些日期/题号页已被收录，首题缺口是否损失长尾？

## 14. 风险与边界

### 商标与视觉

LinkedIn 要求第三方避免造成官方赞助/关联误解，不要模仿整体 look-and-feel，也明确反对在域名中使用 `LinkedIn`。当前 `wendanswertoday.org` 不含该商标且有免责声明，是较稳妥的基础；仍应使用描述性文字、不使用官方 Logo，并让站点自有品牌更突出。[LinkedIn Brand Guidelines](https://brand.linkedin.com/en-us) / [Business & Media Usage](https://brand.linkedin.com/business-books-and-media-usage)

### 抓取和数据来源

LinkedIn 的 Crawling Terms 和 User Agreement 限制未经许可的自动抓取、复制和模拟服务。不要把官方页面 scraping 作为日更主链路；优先使用人工验证、授权/自有输入、公开允许的数据或原创题。[Crawling Terms](https://www.linkedin.com/legal/crawling-terms) / [User Agreement](https://www.linkedin.com/legal/user-agreement)

### 游戏内容与复制

- 答案帮助、评论性分析和自定义渲染应保持最小必要使用。
- Unlimited 必须原创，不复制官方当日题库、图片、动效或整体 UI。
- 如果后续大规模商业化、广告投放或直接托管官方同款游戏，应让专业律师审核商标、版权、数据库权利和不正当竞争风险。

### Spoiler 与信任

- 默认隐藏答案，用户主动选择 reveal。
- 标题、结构化数据和正文的日期/题号必须一致。
- 未验证路径不能发布为答案；fallback 必须明确标为旧题。

## 15. 最终产品方向

一句话定位建议：

> **The fastest verified, spoiler-safe companion for LinkedIn Wend — play officially, get only the hint you need, or practice original boards.**

中文解释：本站不应成为“另一个复制答案的 SEO 站”，而应成为 **官方游戏入口 + 最小剧透救急工具 + 原创训练场**。这三个场景分别承接品牌词、答案词和 unlimited 增量词，并以“当天可靠、准确、可控”形成差异化。
