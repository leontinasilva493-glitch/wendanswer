# WendAnswerToday

WendAnswerToday is a Next.js App Router site for publishing daily LinkedIn Wend answer pages, solver pages, archive pages, and SEO-friendly supporting pages.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Useful Commands

```bash
npm run generate:wend
npm run latest:wend
npm run publish:wend
npm run test:latest-date
npm run test:wend-archive-url
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

- The desktop header includes `Today`, `Solver`, `Archive`, and a compact `Play Game` dropdown.
- The `Play Game` dropdown links to `Official Wend` and the indexable `/wend-unlimited` practice tool.
- Mobile bottom navigation stays limited to `Today`, `Solver`, and `Archive`.
- The footer stays limited to `Contact`, `Press`, `Disclaimer`, `Privacy Policy`, and `Terms`.
- `/press` lists trusted external links, including Ko-fi updates, Linktree, and the public GitHub repository.
- FAQ remains available through page FAQ blocks and contextual links instead of the primary navigation.
- `/wend-unlimited` uses verified Wend puzzles as a playable practice tool with `New puzzle`, `Previous` / `Next`, `Hint`, `Undo`, solved state, share result, and local progress.
- Centered hero with `Get Today's Answer` and `Start with a Hint` anchor CTAs.
- Full-width `Today's LinkedIn Wend Answer` card immediately after the hero.
- Left side of the answer card renders the Wend grid; right side handles `Reveal all`, `Clear all`, and row-level `Get Word`.
- Supporting sections follow the answer card: spoiler-safe hints, step-by-step explanation, FAQ, solving notes, and recent Wend answers.
- Do not add a separate right-side plan, snapshot, or fake preview card to the hero. If extra daily metadata is needed, keep it inside the real answer card.

## Daily Publishing

Wend's target release time is treated as 8:00 UTC. The production goal is to publish verified daily data inside five minutes:

- `npm run publish:wend` reads `WEND_DAILY_INPUT_FILE`, `WEND_DAILY_SOURCE_URL`, or the public `WEND_DAILY_FALLBACK_SOURCE_URL`, validates the normalized Wend JSON or HTML cell-coordinate extraction, writes `data/puzzles/wend/YYYY-MM-DD.json`, regenerates the puzzle index, and optionally runs `WEND_DEPLOY_COMMAND`.
- `.github/workflows/publish-wend-daily.yml` retries during the launch window at `0,1,3,5 8 * * *` UTC and also supports manual `workflow_dispatch`.
- The script refuses to publish `isVerified: false` data unless `ALLOW_UNVERIFIED_WEND_PUBLISH=true` is explicitly set for private dry runs.
- The script validates Wend geometry before publishing: coordinates must be in-grid, adjacent, and spell each answer word.
- In CI, `WEND_PERSIST_TO_GIT=true` commits generated daily JSON and the generated puzzle index back to the repository before deployment.
- `WEND_ALERT_WEBHOOK_URL` can point at one Discord-compatible webhook for publish failure alerts.
- `/linkedin-wend-answer-today` remains the permanent daily entry. Archive pages use `/wend-answer-puzzle-{number}-{month-day-year}`, for example `/wend-answer-puzzle-17-june-25-2026`.

The source URL can be a normalized, verified Wend JSON source, a page with a `wend-puzzle-data` JSON script tag, or an HTML page whose puzzle cells expose `data-row`, `data-col`, `data-word-index`, and `data-letter-index` attributes. Do not assume LinkedIn's official game page is crawlable without a logged-in session; test that separately before treating official scraping as the primary path.

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
