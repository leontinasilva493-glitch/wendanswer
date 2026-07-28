# WendAnswerToday

WendAnswerToday is a Next.js App Router site for publishing daily LinkedIn Wend answer pages, solver pages, a verified/filterable archive, archive statistics, and SEO-friendly supporting pages.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Deployment

- Production: `https://wendanswertoday.org`
- Source repository: `https://github.com/leontinasilva493-glitch/wendanswer`
- Release branch: `main`
- Hosting: Vercel Git deployments. The custom domain is fronted by Cloudflare, while the Next.js application is served by Vercel.
- A push or local build is not deployment proof. Confirm the Vercel commit status and then test the production domain, sitemap, and status endpoint.

## Useful Commands

```bash
npm run generate:wend
npm run latest:wend
npm run publish:wend
npm run backfill:wend-history -- --numbers=1,2,3 --dry-run
npm run test:wend-dataset
npm run test:latest-date
npm run test:wend-archive-url
npm run test:wend-archive-filter
npm run test:wend-statistics
npm run test:wend-statistics-page
npm run test:wend-mvp
npm run test:wend-publish
npm run test:seo-metadata
npm run test:seo-routes
npm run typecheck
npm run build
npm run smoke:local
```

## Documentation

- [Daily Update Runbook](docs/DAILY_UPDATE_RUNBOOK.md): how to add daily puzzle data, update imports, and verify the local site.
- [SEO Runbook](docs/SEO_RUNBOOK.md): TDK rules, index strategy, OG image behavior, and sitemap priorities.
- [Changelog](docs/CHANGELOG.md): feature and operational changes that affect launch, SEO, data freshness, or troubleshooting.

## Homepage Structure

The MVP homepage is intentionally Wend-first and answer-first:

- The desktop header includes `Today`, `Solver`, `Archive`, `Statistics`, and a compact `Play Game` dropdown.
- The `Play Game` dropdown links to `Official Wend` and the internal `/wend-unlimited` practice page; `/wend-unlimited` stays `noindex,follow` until it becomes a true unlimited generator.
- Mobile bottom navigation stays limited to `Today`, `Solver`, and `Archive`.
- The footer stays limited to `Contact`, `Press`, `Disclaimer`, `Privacy Policy`, and `Terms`.
- `/press` lists trusted external links, including Ko-fi updates, Linktree, and the public GitHub repository.
- FAQ remains available through page FAQ blocks and contextual links instead of the primary navigation.
- `/wend-unlimited` uses verified Wend puzzles as a practice set with `Previous` / `Next` navigation, current puzzle position, difficulty, and letter-count metadata.
- Centered hero with `Get Today's Answer` and `Start with a Hint` anchor CTAs.
- Full-width `Today's LinkedIn Wend Answer` card immediately after the hero.
- Left side of the answer card renders the Wend grid; right side handles `Reveal all`, `Clear all`, and row-level `Get Word`.
- Supporting sections follow the answer card: spoiler-safe hints, step-by-step explanation, FAQ, solving notes, and recent Wend answers.
- Do not add a separate right-side plan, snapshot, or fake preview card to the hero. If extra daily metadata is needed, keep it inside the real answer card.

## Daily Publishing

Wend resets at midnight in `America/Los_Angeles`; the UTC hour changes with daylight saving time. The production goal is to publish verified daily data inside five minutes:

- `npm run publish:wend` reads `WEND_DAILY_INPUT_FILE`, `WEND_DAILY_SOURCE_URL`, or the public `WEND_DAILY_FALLBACK_SOURCE_URL`, validates the normalized Wend JSON or HTML cell-coordinate extraction, writes `data/puzzles/wend/YYYY-MM-DD.json`, regenerates the puzzle index, and optionally runs `WEND_DEPLOY_COMMAND`.
- `.github/workflows/publish-wend-daily.yml` runs four off-peak retries in both the 07:00 and 08:00 UTC windows (`7,22,37,52`) to cover PDT and PST, and also supports manual `workflow_dispatch`.
- The script refuses to publish `isVerified: false` data unless `ALLOW_UNVERIFIED_WEND_PUBLISH=true` is explicitly set for private dry runs.
- The script validates Wend geometry before publishing: coordinates must be in-grid, adjacent, and spell each answer word.
- In CI, `WEND_PERSIST_TO_GIT=true` commits generated daily JSON and the generated puzzle index back to the repository before deployment.
- `OPS_ALERT_WEBHOOK_URL` is the preferred Discord-compatible alert channel; `WEND_ALERT_WEBHOOK_URL` remains a legacy fallback.
- `/` is the only indexable daily entry. `/linkedin-wend-answer-today` is a permanent `301` compatibility redirect to `/`.
- Archive pages use `/wend-answer-puzzle-{number}-{month-day-year}`, for example `/wend-answer-puzzle-17-june-25-2026`.

The source URL can be a normalized, verified Wend JSON source, a page with a `wend-puzzle-data` JSON script tag, or an HTML page whose puzzle cells expose `data-row`, `data-col`, `data-word-index`, and `data-letter-index` attributes. Do not assume LinkedIn's official game page is crawlable without a logged-in session; test that separately before treating official scraping as the primary path.

## Historical Archive Backfill

The verified archive currently covers Wend #1 through #49 without missing puzzle numbers. Historical records are reproducible rather than manually transcribed:

- `scripts/backfill-wend-history.mjs` extracts complete grids and ordered paths from the archived primary source.
- A secondary source must match the date, puzzle number, and normalized answer words before `preparePublicPuzzle()` marks the record verified.
- `validateWendPuzzle()` then proves that paths are orthogonal, spell the answers, never reuse cells, and cover every open cell exactly once.
- `npm run test:wend-dataset` validates every stored record, checks unique dates/numbers and filename/date agreement, and verifies provenance hashes.
- The command requires an explicit `--numbers=` allowlist. Always run `--dry-run` before writing files, then regenerate the puzzle index.

The public `/linkedin-wend-archive` page keeps every verified answer link in the initial server-rendered HTML, then adds local browser filters for puzzle number/date/answer word, month, difficulty, and grid size. Filters do not create query-string index pages. The page also derives its verified-count, first/latest puzzle coverage, missing-number notice, and monthly totals directly from `wendPuzzles`.

The public `/linkedin-wend-statistics` page is generated from the same verified dataset. It reports archive coverage, answer totals, average board/path metrics, grid-size and monthly distributions, the longest stored answer, and the most winding puzzle. Calculated metrics stay separate from the editorial difficulty label, and the methodology is visible on the page.

## Recent Changes

- 2026-07-28: added the indexable LinkedIn Wend Statistics page with verified aggregate metrics, transparent methodology, sitemap coverage, and Header/Archive/related-resource links.
- 2026-07-28: upgraded the complete LinkedIn Wend archive with local search and month/difficulty/grid-size filters, generated coverage summaries, reset/empty states, and server-visible answer links.
- 2026-07-28: completed and repaired the verified Wend #1-#49 archive, added a reproducible historical backfill command, and added full-dataset validation.
- 2026-07-28: added puzzle-derived facts and distinct Meta Descriptions to all 49 permanent answer pages.
- 2026-07-28: deployed the canonical daily-page consolidation; `/linkedin-wend-answer-today` now redirects permanently to `/` and is absent from the sitemap.
- Detailed operational history remains in `docs/CHANGELOG.md`.

## Wend Board Model

Wend pages should mirror LinkedIn's real board, not placeholder examples:

- Use the actual LinkedIn grid dimensions for that day. Recent captured boards include June 25's 6x6 board and June 26's 7x7 board.
- Represent blocked gray wall cells as `null` in `grid`.
- Keep open letter cells as one-letter strings.
- Do not publish answer words or paths unless they are verified against the official puzzle.
- A verified solution must use every open cell exactly once, never pass through `null` cells, and connect letters orthogonally.

## Documentation Rule

Any functional change should update Markdown documentation in the same pass when it affects one of these areas:

- Daily puzzle data, import paths, archive routes, or sitemap entries.
- Dependency version pins or package-lock changes.
- SEO metadata, canonical URLs, redirects, robots, sitemap, or social sharing previews.
- Analytics, event tracking, launch checks, smoke tests, or build scripts.
- User-facing game pages, solver behavior, archive behavior, or error pages.

For small code-only fixes, add one short entry to `docs/CHANGELOG.md`. For changes that alter the daily workflow, also update `docs/DAILY_UPDATE_RUNBOOK.md`.
