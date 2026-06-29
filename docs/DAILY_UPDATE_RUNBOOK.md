# Daily Update Runbook

Use this runbook during the first 14 launch days to keep the daily pages fresh, fast, and easy to trace.

## Goal

Publish the newest verified daily puzzle data within five minutes of the 8:00 UTC Wend reset, confirm the correct pages are served locally, and keep a small record of what changed.

## Fast Publish Target

The daily operating target is:

- 8:00 UTC: Wend is expected to release a new puzzle.
- 8:00-8:05 UTC: publish verified data to the site.
- If the official page is slow, blocked, or ambiguous, do not publish placeholder data as verified.

The automated entry point is:

```bash
npm run publish:wend
```

The script supports these environment variables:

- `WEND_DAILY_SOURCE_URL`: normalized official-page capture that returns the daily Wend JSON, an HTML page containing a `wend-puzzle-data` JSON script tag, or an HTML page with `data-row`, `data-col`, `data-word-index`, and `data-letter-index` cell attributes.
- `WEND_DAILY_FALLBACK_SOURCE_URL`: optional public fallback source used when `WEND_DAILY_SOURCE_URL` is not configured. The script defaults this to the public HTML fallback source currently used by the automation.
- `WEND_DAILY_INPUT_FILE`: local JSON file fallback for manual emergency publishing.
- `WEND_DEPLOY_COMMAND`: optional deployment command to run after generation and fast tests.
- `WEND_PERSIST_TO_GIT`: set to `true` in CI so generated JSON and `src/lib/generated/wend-puzzles.ts` are committed and pushed before deploy.
- `OPS_ALERT_WEBHOOK_URL`: preferred Discord-compatible webhook for publish failures and production monitoring failures.
- `OPS_ALERT_TELEGRAM_BOT_TOKEN` and `OPS_ALERT_TELEGRAM_CHAT_ID`: optional Telegram alert channel.
- `WEND_ALERT_WEBHOOK_URL`: legacy Discord-compatible webhook for publish failures. Keep it only for backward compatibility; new setup should use `OPS_ALERT_WEBHOOK_URL`.
- `WEND_EXPECTED_DATE`: optional override for manual backfills. Normal daily publishing uses the current UTC date.
- `MAX_PUBLISH_WINDOW_MS`: defaults to 300000, or five minutes.
- `ALLOW_UNVERIFIED_WEND_PUBLISH`: only set to `true` for private dry runs. Public publishing should keep this unset.

GitHub Actions runs `.github/workflows/publish-wend-daily.yml` through the first publish window at `0,1,3,5,7,9,12,15,20,30,45 8 * * *` UTC, then runs catch-up checks at `5,20,35,50 9 * * *` UTC. It can also be triggered manually with optional `expected_date` and `source_url` inputs, or by an external cron through `repository_dispatch` type `publish-wend-daily`.

The expanded schedule exists because the public Actions page showed the June 29 publish did not run even though the importer could generate Wend #21 locally in two seconds. Do not rely on GitHub's scheduled workflow as the only trigger for a five-minute answer site. Use an external cron or uptime monitor to call GitHub's `repository_dispatch` endpoint at 8:00:10, 8:01, 8:03, and 8:05 UTC with this payload shape:

```json
{
  "event_type": "publish-wend-daily",
  "client_payload": {
    "expected_date": "2026-06-29",
    "source_url": "https://wendanswertoday.me/"
  }
}
```

The current public fallback strategy is:

- `wendanswertoday.me` embeds the current solved board directly in server-rendered HTML using cell attributes such as `data-row`, `data-col`, `data-word-index`, and `data-letter-index`. The importer can reconstruct the grid, paths, and words from those attributes.
- `wendgames.org/answers` loads `src/answers-data.js`, which is explicitly marked as manually maintained and usually contains words plus solved-board screenshots. Treat it as a cross-check source, not as the primary source for our interactive board, because it may not expose full path coordinates.
- LinkedIn's official Wend page remains the preferred source if a stable, compliant, verified capture is available. Public competitor pages are fallback signals and must pass the same geometry validator before publishing.

Production monitoring runs separately in `.github/workflows/monitor-production.yml` every five minutes. It checks uptime, noindex regressions, robots/sitemap crawlability, Today page freshness, and the latest legacy archive `308` redirect. See `docs/MONITORING_RUNBOOK.md`.

## Phase 0 Risk Check

Before treating official LinkedIn scraping as the primary path, run a spike:

- Confirm whether the official Wend page exposes puzzle data without a logged-in session.
- If a logged-in session is required, treat scraping as a risky auxiliary signal because session cookies, two-factor prompts, and account checks can fail without warning.
- Until that is proven stable, use `WEND_DAILY_SOURCE_URL` as a normalized verified JSON feed or use `WEND_DAILY_INPUT_FILE` for human-verified emergency publishing.
- Never publish old answers as today. If the latest local puzzle is stale or unverified, public pages render the latest verified Wend module while monitoring raises a freshness failure after the 8:00 UTC reset.

## Publish Validation

The publish script refuses data unless:

- Required fields are present.
- `game` is `wend`.
- `date` equals the expected publish date.
- `isVerified` is `true`.
- Answer paths stay inside the grid.
- Consecutive path cells are adjacent.
- Each path spells the declared answer word.
- No path enters a blocked `null` cell.
- Answer paths do not overlap.
- The final answer set uses every open letter cell exactly once.

## Wend Board Data Model

Match LinkedIn's live board exactly:

- `grid` can be any rectangular board size, not only 5x5.
- Use a string for visible letter cells, for example `"Y"`.
- Use `null` for gray blocked wall cells.
- Do not fill `answers` with placeholder words. If the board is captured but the official solution is not verified, keep `answers: []` and `isVerified: false`.
- When `isVerified` is `false`, do not publish the puzzle as today's answer. Public pages should keep showing the latest verified module and production monitoring should alert on the freshness gap.

## Wend Daily Data Update

1. Add a new JSON file under `data/puzzles/wend/` using this naming format:

```text
YYYY-MM-DD.json
```

Example:

```text
data/puzzles/wend/2026-06-27.json
```

2. Fill the JSON fields carefully:

- `puzzleNumber`
- `date`
- `dateLabel`
- `updatedAt`
- `difficulty`
- `grid`
- `hints`
- `answers`
- `explanation`
- `quickHint`
- `fastTip`
- `commonMistake`
- `difficultyNote`
- `relatedGames`
- `isVerified`

3. Regenerate the Wend puzzle index:

```bash
npm run generate:wend
```

This updates `src/lib/generated/wend-puzzles.ts` from every `YYYY-MM-DD.json` file under `data/puzzles/wend/`.
Do not hand-edit dated Wend imports in `src/lib/puzzles.ts`; `todayWend` comes from the generated newest-first list:

```ts
export const wendPuzzles = generatedWendPuzzles as unknown as WendPuzzle[];
export const todayWend = wendPuzzles[0];
```

4. If the new puzzle creates a new archive detail page slug, add that route to `scripts/smoke-local.mjs` so local smoke testing covers it.

Canonical archive URLs use this format:

```text
/wend-answer-puzzle-{puzzleNumber}-{month-day-year}
```

Example:

```text
/wend-answer-puzzle-18-june-26-2026
```

The older `/linkedin-wend-answer-{number}-{date}` URLs are legacy and should redirect to the canonical archive URL.

5. Update `docs/CHANGELOG.md` with:

- Date of change.
- New data file added.
- Import or route changes.
- Verification commands that passed.
- Any known risk, especially if `isVerified` is `false`.

## Latest-Date Check

Run:

```bash
npm run latest:wend
```

Expected output shape:

```json
{
  "latestDate": "2026-06-27",
  "latestFile": "data\\puzzles\\wend\\2026-06-27.json",
  "count": 6
}
```

If the latest date is wrong, check:

- The file name matches `YYYY-MM-DD.json`.
- The file is placed under `data/puzzles/wend/`.
- The date was not accidentally saved in another game folder.

## Local Verification

Run these before considering the daily update done:

```bash
npm run generate:wend
npm run test:latest-date
npm run test:wend-freshness
npm run test:wend-validator
npm run test:wend-mvp
npm run test:wend-publish
npm run test:seo-metadata
npm run test:seo-routes
npm run typecheck
npm run build
```

Then start the local server:

```bash
npm run start -- -H 127.0.0.1 -p 3000
```

In another terminal, run:

```bash
npm run smoke:local
```

Open these pages locally:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/linkedin-wend-answer-today`
- The newest Wend archive detail page, for example `http://127.0.0.1:3000/wend-answer-puzzle-18-june-26-2026`
- The matching legacy archive URL redirects, for example `http://127.0.0.1:3000/linkedin-wend-answer-18-june-26-2026`

Confirm the visible page shows the newest date and puzzle number.

Extra checks after UI or routing changes:

- `/` and `/linkedin-wend-answer-today` still export `revalidate = 60`, not `force-dynamic`.
- The Today page title/description include the date and puzzle number only when the latest puzzle is verified for the current Wend release window.
- The Solver page uses the same colored word cards, letter bubbles, and reveal controls as the Today answer module.
- The FAQ disclosure control rotates consistently on the homepage and Today page.
- The verification-pending card links directly to the latest verified archive detail page.
- A 375-390px wide mobile viewport keeps Wend board tubes, arrows, and letter bubbles legible without horizontal overflow.
- A legacy archive URL returns a real `308` redirect in the running app, not just in source-level tests.

## Troubleshooting

If the Today page shows yesterday's puzzle:

- Run `npm run generate:wend`.
- Run `npm run latest:wend`.
- Check `src/lib/generated/wend-puzzles.ts` lists the newest JSON first.
- Confirm `todayWend = wendPuzzles[0]`.
- Restart `npm run dev` if the dev server was already running.

If a new archive page returns 404:

- Confirm `findWendByArchiveSlug()` can find the puzzle.
- Confirm the generated slug matches `/wend-answer-puzzle-{number}-{date}`.
- Confirm the puzzle is included in `wendPuzzles`.

If smoke testing fails:

- Read the failed path in the smoke output.
- Open that exact localhost URL.
- Check whether the page is missing security headers, brand text, or returning a non-2xx response.

If build fails after adding JSON:

- Check JSON syntax first.
- Check `grid` shape and `answers.path` coordinate arrays.
- Run `npm run typecheck` to locate TypeScript import or type issues.
