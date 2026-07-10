# Wend 三个新站竞品、SEO 与增长结构深度调研

> 调研日期：2026-07-10
> 对象：[wendgames.org](https://wendgames.org/)、[wendanswertoday.me](https://wendanswertoday.me/)、[wendanswer.com](https://wendanswer.com/)
> 对照站：[wendanswertoday.org](https://wendanswertoday.org/)
> 目标：解释三个 2026 年 6 月新站为何能快速获得搜索流量，并形成适合本站的页面、功能、SEO、内容和外链迭代方案。

## 1. 结论先行

### 1.1 三站快速起量，不是同一种打法

- **wendgames.org 是“全意图产品站”**：首页承接 `linkedin wend` / `wend game`，独立 `/answers` 承接答案词，独立 `/play` 承接 `unlimited`。用户不论是想找官方入口、找答案还是继续玩，都能在一个站里完成下一步。若用户提供的 19K 是同口径 SEO 估算，这个宽意图覆盖是最合理的解释。
- **wendanswertoday.me 是“单页重内容 + 强交互答案站”**：只有 3 个 sitemap URL，却把当天答案、逐字/逐词 reveal、分享和全部历史题集中做深。它证明“页面少也能起量”，但 1.9MB 的归档 HTML、错误规则和过度承诺不可照搬。
- **wendanswer.com 是“精准首页 + 程序化日页集群”**：根域名、Title、H1、日期、题号和用户查询高度一致；同时用 31 个独立历史题页形成主题集群。2026-07-10 的搜索快照中，它在 `wend answer today` 和 `linkedin wend answer` 均位于第一位。它是最值得本站研究的 SEO 结构样本。

### 1.2 排名的主要驱动力

按当前证据，优先级大致是：

1. **搜索意图和 URL 角色非常清楚**；
2. **每日内容及时更新，Title/H1/正文同步到当天题号和日期**；
3. **注册和上线早，尽快覆盖从第 1 题开始的历史库存**；
4. **答案、日期长尾和 unlimited 三类词形成内部链接集群**；
5. **首屏就能完成任务，不是先读一篇泛文章**；
6. 域名包含 `wend` / `answer`，有助于相关性理解和点击，但不是单独决定因素；
7. **公开外链目前很弱**，还没有证据表明三站靠成熟链接权重起量。

### 1.3 对本站最重要的战略调整

上一份关键词报告提出过“首页做 Hub、today 页做答案”的方案。加入这三个竞品的新证据后，建议采用更保守的 **Answer-first 首页方案**：

- `/` 保留为唯一“今日答案”主页面，继续承接 `wend answer today` 和 `linkedin wend answer`；
- `/linkedin-wend-answer-today` 在核对 GSC 后，301 到 `/`，消除两个实时答案页互相竞争；
- 首页下半部分承接 `linkedin wend` 的官方入口、规则、找不到游戏和 practice 导航；
- 每日永久归档页承接日期/题号长尾；
- `where-is`、how-to、strategy、archive 和未来真正可玩的 unlimited 各自承接独立意图。

原因很简单：本站域名本身就是 `wendanswertoday.org`，首页已有搜索可见度；竞品第一名也采用“根路径就是今日答案”。此时把首页大幅改成纯导航 Hub，迁移风险高于潜在收益。

## 2. 研究方法与数据边界

本轮使用了以下可公开复核的信号：

- 逐页抓取 robots、sitemap、canonical、Title、Description、H1/H2、内外链、结构化数据和服务端 HTML；
- 抽样首页、今日答案、玩法、归档、历史日页；
- 2026-07-10 的核心关键词 SERP 快照；
- RDAP 注册日期、HTTP 缓存和同一网络下的文档体积/响应时间；
- Google 可检索的外部引用、Reddit 建站帖和官方 LinkedIn 资料；
- 本地项目代码和线上 `wendanswertoday.org` 的同类指标。

### 流量数字的口径限制

用户提供的“19K、1K、1K”没有附工具名、国家、设备和统计周期。公开的 Similarweb/Semrush 页面暂时无法复核这三个小站，因此本文把它们视为**方向性的第三方估算**，而不是 GA4 实际访问量。

同一个“19K”可能是：

- SEO 工具估算的某国家自然搜索流量；
- Similarweb 估算的全渠道访问；
- 站长后台的页面浏览量；
- 30 天滚动值或自然月值。

在获得同一工具导出前，不应直接用 19K/1K 推导转化率或站点真实用户规模。

### 性能数据的口径限制

以下 HTML 体积和 TTFB 是 2026-07-10 从同一网络位置的单次横向快照，不等于真实用户 Core Web Vitals。Google PageSpeed 公共 API 本轮返回 429，因此没有伪造 Lighthouse 分数。

## 3. 四站横向对比

| 指标 | wendgames.org | wendanswertoday.me | wendanswer.com | 本站 |
|---|---:|---:|---:|---:|
| 用户提供月流量估算 | 19K | 1K+ | 1K+ | 未提供 |
| 可确认的最早信号 | 域名注册 06-10 | 早期 Reddit 建站帖 | 域名注册 06-10 | 域名注册 06-23 |
| sitemap URL 数 | 23 | 3 | 33 | 31 |
| 主要页面模型 | Hub + answers + unlimited + 日页 | 今日页 + 巨型归档 + how-to | 今日首页 + 归档 Hub + 独立题号页 | 今日首页 + today + archive + 日页 + 专题 |
| 首页服务端正文约 | 1,080 词 | 1,800 词 | 710 词 | 570 词 |
| 首页 HTML 体积 | 23KB | 128KB | 69KB | 83KB |
| 最大关键页 | answers 17KB | archive 1.90MB | archive 29KB | today 78KB |
| 单次首页 TTFB | 0.65s | 0.76s | 1.43s | 0.66s |
| 历史题独立 URL | 有，约从 06-21 | 无，全部在 `/archive` | 有，#2–#32 | 有，但首题库存不完整 |
| 真正可玩的 unlimited | 有 | 无 | 无明确完整产品 | 目前不是，且 noindex |
| 答案 reveal 交互 | 较弱/占位风险 | 很强 | 有 | 强，且默认防剧透 |
| 内容准确性 | 中低 | 低 | 中 | 高 |
| 可复核外部信号 | Brainly 引用 | Reddit 无链接品牌帖 | 未发现高质量公开入链 | 未发现明显公开入链 |

域名注册证据：[wendgames.org RDAP](https://rdap.org/domain/wendgames.org)、[wendanswer.com RDAP](https://rdap.org/domain/wendanswer.com)、[本站 RDAP](https://rdap.org/domain/wendanswertoday.org)。LinkedIn 官方于 2026-06-09发布 Wend，因此前两个域名几乎是题材出现后立即注册。[官方发布说明](https://www.linkedin.com/pulse/introducing-wend-our-eighth-linkedin-game-helen-smith-bpxec)

## 4. 为什么 wendgames.org 可能达到 19K

### 4.1 最大亮点：一个站覆盖三种高价值意图

它的首屏不是单一文章，而是双路径产品入口：

- **Official Wend**：去 LinkedIn 官方游戏；
- **Unlimited Wend**：留在站内继续玩；
- 下方再把被卡住的用户送到 `/answers`。

这使站点同时覆盖：

- `linkedin wend` / `wend game`：发现和导航；
- `wend answer today`：每日救急；
- `wend unlimited` / `wend practice`：高复发和留存。

相比只做答案页，这套结构拥有更大的关键词上限，也有更高的每次会话页数和回访潜力。[首页](https://wendgames.org/)

### 4.2 网站结构

```text
/
├─ /answers                 今日答案与归档入口
├─ /play                    真正可玩的 unlimited
└─ /wend-answer-{date}      每日永久答案页
```

23 个 sitemap URL 全部返回 200。首页、答案页、玩法页互链，日页又回链答案 Hub，形成“头部词—实时词—日期长尾—产品留存”的闭环。

### 4.3 内容与 on-page SEO

优点：

- 首页 Title 同时出现 Wend Game、LinkedIn、Daily、Answers、Unlimited；
- H1 与页面主任务一致；
- 首页约 1,080 词，包含规则、差异、FAQ、官方入口和玩法入口，不只是关键词列表；
- `/answers` 的 Title 动态包含题号和日期；
- 日页拥有独立 Title、canonical、Article/FAQ 数据和少量独特说明；
- 直接引用官方发布中的总体留存数据，增加主题说明的可信度。

产品亮点：

- `/play` 是真实浏览器游戏，不需要登录；
- 支持新题、前后切换、提示、撤销、进度保存；
- 这不是把历史答案浏览器包装成 unlimited，而是真正满足“我还想玩”的需求。[Unlimited 页面](https://wendgames.org/play)

### 4.4 明显问题与风险

- 首页仍把 Wend 描述成固定四个词、固定 3/4/5/6 词长和小型固定网格；后续官方题目已经变化；
- 多处声称官方版必须登录，但 LinkedIn 官方明确支持 Guest Mode，只是访客不能保存 streak、榜单等数据。[Guest Mode 说明](https://www.linkedin.com/help/linkedin/answer/a6880616)
- `/answers` 在当天未完成时仍生成了当天 Title 和题号，但正文显示示例或未验证内容，存在“搜索承诺已完成、页面实际上没答案”的信任风险；
- 首页使用近似 LinkedIn 的蓝色、官方风格截图和“practice clone”表述，品牌与外观风险高于本站；
- `/sitemap_index.xml` 和 `/llms.txt` 实际返回首页 HTML，不是对应格式；
- 玩法页服务端可见正文只有约 118 词，核心游戏依赖客户端逻辑，对非 Google 抓取器和无 JS 环境的信息表达较弱。

### 4.5 本站应该借鉴什么

- 借鉴**三意图漏斗**：Official / Hint & Answer / Practice；
- 借鉴真正可玩的 practice，而不是借鉴官方 UI；
- 借鉴首页到答案、答案到 practice、日页到相邻题的闭环内链；
- 不借鉴固定规则、登录错误、未验证占位和近官方视觉。

## 5. wendanswertoday.me：只有 3 个 URL 为什么也能起量

### 5.1 最大亮点：把答案消费体验做得最细

其首页首屏直接显示当天题号、日期、网格和答案控制，用户可以：

- 点击单个格子查看它属于哪个词；
- Reveal Letter；
- Reveal Word；
- Reveal All；
- 复制链接或分享到 X、Facebook、WhatsApp。

这与真实社媒需求“我只需要一点提示，不想整盘剧透”高度一致。其 Reddit 建站帖也明确把产品任务表述为：快速查看答案、看清路径、避免一步走错毁掉整盘，并主动征求移动端反馈。[今日页](https://wendanswertoday.me/) / [Reddit 建站帖](https://www.reddit.com/r/wordlegame/comments/1u5cxn5/i_created_a_daily_resource_for_linkedin_wend/)

### 5.2 SEO 强项

- 精确匹配域名 `wendanswertoday.me`；
- Title 是高意图短语 “Wend answer today”；
- H1 每天同步日期和 puzzle number；
- 首页服务端输出完整网格、答案词、长文和 FAQ，不依赖 Google 执行 JS 才看到核心内容；
- `/archive` 从第 1 题到当天全部放在一个页面，搜索引擎一次抓取就能发现所有题号、日期、词语和路径实体；
- 首页有 Article、FAQ、ItemList、WebPage、WebSite 等结构化数据。

### 5.3 归档策略的收益与代价

`/archive` 约 5,400 词、66 个 H2、1.90MB 未压缩 HTML，容纳全部 32 题的网格和答案。[归档页](https://wendanswertoday.me/archive)

它的短期收益：

- 新站只需要让 Google 理解一个强页面；
- 所有历史题一次可发现；
- 用户可以在日历中切换题目；
- 页面主题覆盖极深。

它的长期代价：

- 1.9MB 文档会随每天新题线性增长；
- 移动端解析、内存、交互和更新成本不断上升；
- 每个日期没有独立 canonical URL，无法单独优化和获得日期长尾着陆页；
- Google 只能把几十个不同日期的意图折叠在一个 URL；
- 页面修改任何一题都等于更新整个大页面。

正确借鉴方式是“历史全覆盖 + 可筛选日历”，不是“全部题目永久塞进一个 HTML”。

### 5.4 严重准确性和合规问题

页面存在多处可以被本站反向建立信任优势的错误：

- 称单词会在交叉点共享格子，但 Wend 要求每个字母格恰好使用一次，词之间不共享；
- 称可以对角线连接，实际规则是上下左右相邻；
- 一边承认题目会变化，一边又使用固定“最短/最长词”模板；
- 声称每天 08:00 UTC / 04:00 EDT 更新。官方规则是 **Pacific Time 午夜**；2026-07-10 为 PDT，因此实际是 07:00 UTC / 北京时间 15:00，冬令时才是 08:00 UTC；
- 声称自动从官方源提取且 100% 准确，这既无法公开验证，也与 LinkedIn 未经许可自动抓取限制存在直接风险。[LinkedIn 游戏时间与规则](https://www.linkedin.com/help/linkedin/answer/a6863543) / [Crawling Terms](https://www.linkedin.com/legal/crawling-terms)

### 5.5 外链与社媒事实

Reddit 帖是一个真实的品牌和用户研究信号，但正文只让用户搜索域名，没有提供可点击站外链接。因此它可能带来品牌搜索或直接访问，却不能等同于一个正常传递链接信号的 backlink。

### 5.6 本站应该借鉴什么

- 借鉴逐格、逐字、逐词、全盘 reveal 的帮助阶梯；
- 借鉴分享入口和“先最小帮助”的产品文案；
- 借鉴从首题开始完整保存历史；
- 不借鉴巨型单页、错误规则、固定 UTC、自动抓取与 100% 承诺、堆叠 schema。

## 6. wendanswer.com：新站如何快速占据答案词第一

### 6.1 最强点：根路径就是唯一答案意图页

2026-07-10 首页：

- Title：`LinkedIn Wend Answers and Hints - July 10, 2026 | Wend Answer`；
- H1 与日期一致；
- meta description 约 155 字符；
- 正文首屏就是当天答案/提示工具；
- 根域名 `wendanswer.com` 与 query 只有词序和 today 修饰词差异。

这套信号没有让搜索引擎猜“哪个页面是今天答案”。这也是它比本站当前 `/` 与 `/linkedin-wend-answer-today` 双页面结构更干净的地方。[首页](https://wendanswer.com/)

### 6.2 日页集群是排名的第二个支点

```text
/
├─ /archive
├─ /archive/2
├─ /archive/3
└─ ... /archive/32
```

- sitemap 共 33 个 URL；
- `/archive/2` 到 `/archive/32` 都有独立 URL、日期 Title 和 canonical；
- 每页约 470 词，并非只有几个答案词；
- 归档 Hub 链接全部历史题，日页形成主题库存；
- `llms.txt` 是有效 text/plain，并列出核心 URL。

这类结构特别适合新题材：每天自然增加一个可索引、可内链、可承接日期查询的页面，站点主题覆盖随时间稳定增长。

### 6.3 技术和 SEO 亮点

- canonical、sitemap、robots、Title/H1 一致性较完整；
- 首页有 WebSite、WebPage、BreadcrumbList、SoftwareApplication、FAQ 等 JSON-LD；
- 当前题和历史题都在服务端 HTML 中；
- archive Hub 约 29KB，远轻于 `.me` 的巨型归档；
- 首页内链到多个近期题，缩短抓取路径。

### 6.4 它并不是高质量内容的上限

- 文案残留“收养、庇护所、成功故事、合作伙伴”等与 Wend 无关的模板主题，明显削弱品牌可信度；
- 首页与当天 `/archive/32` Title/内容高度接近，两个 canonical 都存在，仍可能产生实时 query 内耗；
- `/archive/1` 404 且不在 sitemap，首题长尾缺失；
- HTML 响应为 private/no-store，同一网络单次 TTFB 约 1.43s，明显慢于另外三站；
- 部分 schema 类型与真实页面产品形态不完全匹配；
- 页脚存在指向无关 SaaS 目录内容的出站链接，更像模板/站群关系信号，不能当作权威背书；
- 没有发现可复核的高质量公开外部入链。

### 6.5 为什么内容不完美仍能第一

这是本轮最有价值的反例：**短期新题材 SEO 首先奖励意图对齐、更新和页面库存，不会等待品牌内容做到完美**。它不意味着低质量文案是优势，只意味着本站不应把精力先花在大量泛文扩写，而忽略 URL 决策、每日时效和历史覆盖。

## 7. 外链、社媒和品牌信号对比

### 7.1 当前能公开复核的信号

| 站点 | 公开信号 | 类型 | 判断 |
|---|---|---|---|
| wendgames.org | [Brainly 问答](https://brainly.in/question/62540002)把它列为 Wend 规则来源 | 可点击引用 | 主题相关，但属于 UGC，质量和持续价值有限 |
| wendanswertoday.me | [Reddit 建站帖](https://www.reddit.com/r/wordlegame/comments/1u5cxn5/i_created_a_daily_resource_for_linkedin_wend/) | 无链接品牌提及 | 有真实需求语言和品牌搜索价值，不是标准入链 |
| wendanswer.com | 未发现可复核高质量入链 | — | 排名更可能由 on-page、域名、时效和集群驱动 |

### 7.2 对“19K 是靠外链”的判断

目前证据不支持。更可能的因果链是：

```text
新游戏发布
→ 头部词与答案词供给不足
→ 精确域名和早上线页面快速被收录
→ 每日新题制造重复搜索
→ answers / unlimited 扩大关键词面和回访
→ 少量 UGC 提及帮助发现，但不是主要权重来源
```

### 7.3 本站的外链方向

目标应是 5–10 个真正相关的引用域，而不是 100 个目录垃圾链接。

优先做可被引用的资产：

1. **Wend 首月数据报告**：每题词数、网格大小、最长词、稀有字母、墙数量、路径转弯数、难度代理指标；
2. **完整题号/日期索引**：从 #1 到今天，提供可靠的永久链接和更正记录；
3. **移动端 Wend 操作与排障指南**：承接真实用户的拖拽失效和“找不到游戏”；
4. **无剧透日更分享卡**：只含题号、难度、用提示次数，不暴露答案；
5. **原创 practice 题库与方法说明**：可被 puzzle 博客和社区引用，而不是复制官方题库。

分发顺序：

- 先在已有 Reddit/LinkedIn 讨论里提供完整解决方案和官方入口，披露站点关系，遵守社区链接规则；
- 联系 The Word Finder、谜题博客、已有 Wend 攻略作者，提供可核验的数据资产或纠错信息；
- 建立 press/data 页面，公开数据口径和可引用图表；
- 不购买 PBN、不批量发 UGC 问答、不制造假用户推荐、不在官方日帖下刷答案链接。

## 8. 本站现状与差距

### 已有优势

- 默认不剧透，已有逐字、逐词、完整 reveal；
- 使用自定义网格而非官方截图，品牌/IP 边界优于竞品；
- 有 verified/fallback 思路和更明确的免责声明；
- sitemap、canonical、每日永久页和 archive 基础已经存在；
- 首页单次 TTFB 与 wendgames.org 接近，明显好于 wendanswer.com；
- 规则准确性和内容可信度明显高于三站。

### 当前差距

1. **实时答案 URL 重复**：`/` 与 `/linkedin-wend-answer-today` 都完整渲染当天答案、hints 和近似标题；
2. **上线晚约 13 天**：本站 06-23 注册，两个强竞品 06-10 注册，主题历史和首批抓取均落后；
3. **历史从约 06-22 开始**：没有覆盖 Wend #1 到 #13 左右的首批长尾；
4. **`/wend-unlimited` 不是可玩的 unlimited**：目前更接近历史 reveal 浏览器，继续使用 unlimited 文案会产生承诺落差；
5. how-to / strategy 服务端正文各约 180 词，无法充分回答规则、路径、墙、孤岛、错误候选和移动端问题；
6. 之前出现过当天官方题已上线、本站仍显示前一天的时效落差；
7. 公开可见的相关外链和品牌讨论很少。

## 9. 推荐信息架构

```text
/                                      唯一今日答案主页面
├─ 现有每日永久 URL                     日期/题号长尾，继续沿用，不改 URL
├─ /linkedin-wend-archive              完整归档 Hub、筛选和内链
├─ /how-to-play-linkedin-wend          准确规则与新手说明
├─ /how-to-solve-linkedin-wend         策略、路径、墙、孤岛、回退
├─ /where-is-linkedin-wend             官方直达、入口缺失和移动端排障
└─ /wend-unlimited                     真正可玩后再 index

/linkedin-wend-answer-today            核对 GSC 后 301 → /
```

### 今日首页的首屏顺序

1. `Verified for Wend #N · Date · updated X min ago`；
2. H1：`LinkedIn Wend Answer Today #N — Month D, 2026`；
3. 两个主 CTA：`Give me one hint`、`Reveal today's answer`；
4. 自定义可交互网格；
5. `Play Official Wend` 明确跳到官方；
6. 如果尚未验证，显示 `Solving now`，不得让 Title/正文暗示答案已经就绪；
7. 首屏下方才放简短规则、今日难点、近期题和专题入口。

### 推荐 metadata 模板

- 首页 Title：`LinkedIn Wend Answer Today #32 — July 10, 2026`
- 首页 Description：`Get verified hints, answer words, and exact paths for LinkedIn Wend #32. Reveal one letter, one word, or the full solution.`
- 永久日页：`Wend #32 Answer & Paths — July 10, 2026`
- 归档页：`LinkedIn Wend Answer Archive — Every Puzzle by Date`
- Unlimited：只有真正可玩后才用 `Play Wend Unlimited — Original Practice Puzzles`

## 10. 页面与内容方案

### 10.1 每日页：300–600 个有用词足够

不要学习 `.me` 每天近 1,800 词的重复说明，也不要只放答案词。每个永久页应包含：

- 日期、题号和验证时间；
- 默认隐藏的词与路径；
- 今日 theme 或词语关系；
- 最小无剧透提示；
- 最受限制的起点/边角锚点；
- 一个真正独特的 common trap；
- 最长或最难路径为何容易误判；
- 前一天、后一天、archive、官方游戏内链。

质量标准：删除日期和答案后，页面仍应有至少一段只属于这道题的分析。否则只是模板化薄页。

### 10.2 Archive：复制覆盖，不复制 1.9MB 实现

- 补齐 #1 到今天；
- 每题保留独立永久 URL；
- Hub 只输出题号、日期、主题、最长词、难度和链接；
- 支持日期、题号、词长、难度筛选；
- 默认只 SSR 最近 30–60 条，旧题分页或按月拆分；
- ItemList 可用于表达列表，FAQ 不必每页重复；
- 所有日页提供 prev/next 和返回 archive。

### 10.3 How-to / Strategy：用准确性超越三个竞品

必须准确说明：

- 路径只允许上下左右，不允许对角线；
- 每个开放字母格恰好使用一次；
- 不同单词不能共享格子；
- 墙会约束路径形状；
- 单词数量、词长和网格并非永久固定；
- 先看受限格、墙边和剩余格连通性，而不是永远从最短或最长词开始；
- 如何识别一个“看似正确的词”造成后续孤岛；
- 移动拖拽失败时的替代操作；
- Guest Mode 可玩，但不能保存 streak 等权益。

### 10.4 真正的 Unlimited

P1 版本不需要一开始就无限生成。更稳妥的 MVP：

- 30–50 个原创、人工验证的 practice boards；
- 点击和拖拽两种路径输入；
- Undo、Reset、Hint、非法移动原因；
- 本地保存进度；
- 完成后显示用时、提示数和下一题；
- 题库、图形、配色和文案与官方保持明显差异；
- 上线前继续 noindex；功能与内容达到承诺后再索引。

## 11. 技术 SEO 方案

### P0

1. **确定唯一 today canonical**：优先 `/`。对废弃重复页使用服务端 301，并让内链、canonical、sitemap 全部只指向主 URL。Google 把 redirect 和 canonical 都视为强信号，而 sitemap 只是较弱信号。[Google canonical 指南](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
2. **动态时区日更**：以 `America/Los_Angeles` 的午夜为触发，不写死 08:00 UTC。夏令时是 07:00 UTC，冬令时是 08:00 UTC。
3. **发布 SLO**：99% 的日期在官方 rollover 后 10 分钟内进入 `verified`；失败时 1 分钟内告警并显示明确 fallback。
4. **准确 lastmod**：只有正文、结构化数据或重要链接真实变化才更新；Google 会在 lastmod 一贯准确时用它安排抓取。[Google sitemap 指南](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
5. **完整 SSR**：题号、日期、状态、提示摘要和关键内链在初始 HTML 中；交互增强再交给 JS。Google 也建议服务端渲染或预渲染来改善用户和爬虫体验。[JavaScript SEO 指南](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
6. **状态一致**：Title、H1、canonical、JSON-LD、正文题号和日期必须来自同一数据对象；禁止 Title 是今天、正文是昨天。

### 结构化数据

- 首页：WebSite + WebPage；若正文确有问答可保留 FAQPage，但不要期待 FAQ 富结果；
- 永久日页：Article + BreadcrumbList；
- Archive：CollectionPage/ItemList；
- 真正可玩的 practice 才考虑 SoftwareApplication 或 VideoGame，并确保属性真实；
- 不为“看起来更多”堆 5–7 种无关 schema。

Google 已长期把普通站点的 FAQ 富结果限制在知名政府和健康网站；对本项目而言，FAQ schema 不是排名捷径。[FAQ rich result 说明](https://developers.google.com/search/blog/2023/08/howto-faq-changes)

### 性能

- 保持当前服务端缓存优势；
- 不采用 `.me` 的全历史单页渲染；
- 日页把动画和非首屏组件延迟加载；
- 只给首屏网格加载必要 JS；
- 图片设置固定尺寸，避免 CLS；
- 用 Search Console CWV 和真实用户监控决策，不依据本轮单次 TTFB 过度优化。

## 12. 迭代优先级与可行方案

| 优先级 | 工作 | 预期收益 | 成本 | 验收标准 |
|---|---|---|---|---|
| P0 | 日更时区、verified SLO、失败告警 | 保护每日最高意图流量和信任 | 中 | 30 天按时率 ≥99%，unverified 误发布为 0 |
| P0 | 合并 `/` 与 today 重复 URL | 集中排名、链接和行为数据 | 低–中 | GSC 不再出现两 URL 竞争同一 answer query |
| P0 | 补齐 #1 到今天 | 增加历史长尾和主题完整度 | 中 | 100% 题号有永久 200 URL、唯一 Title/canonical |
| P0 | 每日页独特难点模板 | 提高内容差异与用户价值 | 中 | 每页至少 1 个独特 anchor/trap/path 说明 |
| P0 | 准确 how-to 与官方来源 | 建立可信度差异 | 低 | 无固定词数、对角线、共享格、登录错误 |
| P0 | prev/next、recent、archive 内链 | 加快发现、提升会话深度 | 低 | 所有日页 ≤3 次点击从首页到达 |
| P1 | Archive 筛选与分页 | 完整覆盖且保持性能 | 中 | Hub HTML 不随历史无限膨胀 |
| P1 | 原创 practice 30–50 题 | 承接 unlimited、提高回访 | 高 | 可真实完成、移动可用、非复制官方题 |
| P1 | 移动端点击路径/校验器 | 解决真实拖拽痛点 | 中 | 点击、撤销、错误原因可用 |
| P1 | 首月数据报告与 press/data 页 | 获得高相关引用机会 | 中 | 获得首批 3–5 个相关域引用/提及 |
| P2 | 无剧透分享卡与个人 practice 统计 | 分享与留存 | 中 | share rate、7 日回访有显著提升 |

## 13. 30/60/90 天路线图

### 0–14 天：先把答案排名基础做干净

- 导出 GSC 过去 28 天 query × page 数据；
- 判断 `/` 与 `/linkedin-wend-answer-today` 谁在 answer 词上更强；默认保留 `/`，完成 301/canonical/sitemap/内链合并；
- 把发布计划改成 Los Angeles 时区；
- 补齐 #1 到今天的数据和永久页；
- 改写 how-to 中所有可能与当前规则不一致的表述；
- 每日页上线独特 anchor/trap 字段；
- 验证 Title、H1、JSON-LD、正文和 sitemap lastmod 一致。

### 15–45 天：从“答案页”升级成“帮助产品”

- 完成 archive 筛选、相邻题导航和近期题模块；
- 优化提示阶梯：区域 → 首尾字母 → 下一字母 → 单词 → 完整路径；
- 上线移动端点击路径验证；
- 收集 reveal 后匿名卡点反馈；
- 发布 Wend 首月数据报告和可引用图表；
- 开展少量高相关社区/作者触达。

### 46–90 天：验证留存而不是继续堆文章

- 上线 30–50 题原创 practice beta；
- 从 today 完成页和 archive 导流；
- 记录 practice start、complete、每会话题数和 D1/D7 回访；
- 若 practice 回访显著高于 archive 浏览，再投入生成器、难度分层和个人统计；
- 若没有，停止扩题，把资源回到每日时效、提示和搜索 CTR。

## 14. 测量与决策规则

### GSC 关键词分组

- Answer：`wend answer today`、`linkedin wend answer`、`wend solution today`；
- Brand/navigation：`linkedin wend`、`wend linkedin`、`where is wend`；
- Practice：`wend unlimited`、`wend practice`、`play wend`；
- History：题号、日期、`archive`；
- Rules：`how to play`、`how to solve`、`tips`。

### 核心指标

| 目标 | 指标 |
|---|---|
| 时效 | rollover 到 verified 的分钟数、按时率、stale fallback views |
| 搜索 | 分 query group 的 impressions、clicks、CTR、position、落地 URL |
| 收录 | 已发布日页数、已收录日页数、发现到首次抓取时间 |
| 帮助价值 | hint 层级分布、Reveal All 比例、首次有效动作时间 |
| 导航 | Official Wend CTR、where-is 页面到官方的 CTR |
| 留存 | practice start/complete、每会话题数、D1/D7/28 回访 |
| 外部信号 | 相关 referring domains、无链接品牌提及、数据报告引用 |
| 风险 | 错题、未验证误发布、意外剧透、商标/投诉、抓取失败 |

### URL 合并决策

不要同时对两个 today URL 做 SEO A/B。先看 28 天 GSC：

- 如果 `/` 在 answer query 上点击更多或平均排名明显更好，保留 `/`；
- 如果 today 路径明显更强，再评估让首页转为 Hub；
- 一旦选择，使用 301 + canonical + sitemap + 全站内链形成一致信号，至少观察 4–6 周，不反复切换。

## 15. 最终“抄什么、不抄什么”清单

### 应该借鉴

- wendgames.org：三意图漏斗、真实 unlimited、产品页互链；
- wendanswertoday.me：最小剧透 reveal、分享、首题起完整历史；
- wendanswer.com：根路径精准答案、动态日期 Title/H1、独立日页集群、轻量 archive；
- 三站共同点：首屏先完成任务，每日内容可抓取，内部链接清晰。

### 不应该借鉴

- 固定四词/固定网格等过时规则；
- 对角线、词共享格、必须登录等事实错误；
- “自动抓取官方源、100% 准确”的不可验证承诺；
- 1.9MB 且每日增长的巨型 archive；
- 标题显示今日、正文仍是占位或昨日；
- 与 Wend 无关的模板文案；
- 为数量堆 schema、关键词和低价值日页；
- 近似官方 UI、截图、Logo 和题库复制；
- PBN、批量 UGC 和无关目录链接。

## 16. 一句话产品方向

> **把 WendAnswerToday.org 做成最快更新、答案可验证、帮助程度可控的 Wend companion：今天卡住时只给你需要的那一步，完成后还能玩原创练习。**

短期靠“唯一今日页 + 时效 + 完整日页库存”追排名；中期靠“最小剧透交互 + 准确内容”建立信任；长期靠“原创 practice + 数据资产”获得回访和自然外链。这三层依次推进，胜率高于继续扩写泛 SEO 文章。

## 17. P0/P1 实施回写（2026-07-10）

本轮已完成“日更可靠性与及时性”相关 P0/P1，具体落地如下：

- **时区**：发布时间基准改为 `America/Los_Angeles` 午夜，自动适配 PDT 07:00 UTC 与 PST 08:00 UTC，并覆盖两次 DST 切换测试。
- **触发解耦**：新增受 `CRON_SECRET` 保护的外部触发 API；GitHub schedule 降级为两个 UTC 窗口的错峰兜底，解决 scheduled workflow 延迟/漏跑不能独立保证五分钟 SLO 的问题。
- **可观察性**：新增公开、`no-store` 的 `/api/wend-status`，当前题正确时返回 200，待核验时返回 503，并同时给出 expected 与 latest verified；适合外部服务每分钟监测。
- **来源可靠性**：自动公开来源必须由第二来源在日期、题号、完整答案词集合上达成一致，再通过路径几何校验；可信人工 JSON 必须记录 GitHub 操作者。
- **可追溯性**：新记录写入真实抓取/核验时间、来源 URL、SHA-256 来源哈希、验证方式与 verifier。当天 Wend #32 已通过双源与几何回放并完成 provenance 回填。
- **上线闸门**：发布后等待生产状态接口确认精确日期与题号，再执行 smoke，最后才提交 IndexNow；部署未可见时不会提前宣布成功或通知搜索引擎。
- **故障闭环**：发布/监控失败继续告警并开 issue，恢复后自动评论恢复证据并关闭旧 issue。
- **用户透明度**：当前题未完成核验时，页面显示 expected puzzle 和 `Verification pending`，旧题只标为 `Latest verified`；不再把昨日答案静默伪装成 today。
- **SEO 时间戳**：日更页面 sitemap `lastmod` 绑定最新 verified 内容时间，长期静态页不再每次请求伪造 `new Date()`。

仍需在部署平台完成一次性配置：Vercel 设置 `CRON_SECRET`、`GITHUB_DISPATCH_TOKEN`、`WEND_GITHUB_REPOSITORY`；外部 scheduler 覆盖 07:00/08:00 UTC 两个窗口，并对 `/api/wend-status` 做一分钟级监控。数据库/KV 直写、今日 URL 合并、历史补齐和原创 practice 仍按原路线图分别进入 P2 或后续 SEO/产品迭代，不在本轮可靠性改造中扩张范围。

## 主要来源

- [LinkedIn：Introducing Wend](https://www.linkedin.com/pulse/introducing-wend-our-eighth-linkedin-game-helen-smith-bpxec)
- [LinkedIn Games 帮助：规则、入口与更新时间](https://www.linkedin.com/help/linkedin/answer/a6863543)
- [LinkedIn Guest Mode](https://www.linkedin.com/help/linkedin/answer/a6880616)
- [LinkedIn Crawling Terms](https://www.linkedin.com/legal/crawling-terms)
- [wendgames.org 首页](https://wendgames.org/) / [答案页](https://wendgames.org/answers) / [Unlimited](https://wendgames.org/play)
- [wendanswertoday.me 今日页](https://wendanswertoday.me/) / [Archive](https://wendanswertoday.me/archive) / [Reddit 建站帖](https://www.reddit.com/r/wordlegame/comments/1u5cxn5/i_created_a_daily_resource_for_linkedin_wend/)
- [wendanswer.com 首页](https://wendanswer.com/) / [Archive](https://wendanswer.com/archive)
- [Brainly 对 wendgames.org 的引用](https://brainly.in/question/62540002)
- [Google canonical 指南](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google sitemap 指南](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google FAQ/HowTo rich result 变更](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
