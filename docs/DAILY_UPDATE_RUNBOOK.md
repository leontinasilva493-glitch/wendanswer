# Daily Update Runbook

Use this runbook during the first 14 launch days to keep the daily pages fresh, fast, and easy to trace.

## Goal

Publish the newest verified daily puzzle data within five minutes of Wend's midnight reset in `America/Los_Angeles`, confirm the exact record is visible in production, and keep a traceable provenance record.

## Fast Publish Target

The daily operating target is:

- Midnight Pacific Time: Wend is expected to release a new puzzle. This is 07:00 UTC during PDT and 08:00 UTC during PST.
- Reset to +5 minutes: verify, publish, and confirm the exact date and puzzle number in production.
- If the official page is slow, blocked, or ambiguous, do not publish placeholder data as verified.

The automated entry point is:

```bash
npm run publish:wend
```

The script supports these environment variables:

- `WEND_DAILY_SOURCE_URL`: normalized official-page capture that returns the daily Wend JSON, an HTML page containing a `wend-puzzle-data` JSON script tag, or an HTML page with `data-row`, `data-col`, `data-word-index`, and `data-letter-index` cell attributes.
- `WEND_DAILY_FALLBACK_SOURCE_URL`: optional public fallback source used when `WEND_DAILY_SOURCE_URL` is not configured. The script defaults this to the public HTML fallback source currently used by the automation.
- `WEND_DAILY_SECONDARY_SOURCE_URL`: independent public word-list source required to agree with automatic public ingestion. Defaults to `https://wendgames.org/src/answers-data.js`.
- `WEND_DAILY_INPUT_JSON`: trusted normalized JSON supplied only through an authenticated manual GitHub workflow run.
- `WEND_DAILY_INPUT_FILE`: local JSON file fallback for manual emergency publishing. Trusted JSON still requires `WEND_VERIFIED_BY` and geometry validation.
- `WEND_VERIFIED_BY`: authenticated operator identity. GitHub Actions sets this to `github.actor` for trusted manual input.
- `WEND_DEPLOY_COMMAND`: optional deployment command to run after generation and fast tests.
- `WEND_PERSIST_TO_GIT`: set to `true` in CI so generated JSON and `src/lib/generated/wend-puzzles.ts` are committed and pushed before deploy.
- `OPS_ALERT_WEBHOOK_URL`: preferred Discord-compatible webhook for publish failures and production monitoring failures.
- `OPS_ALERT_TELEGRAM_BOT_TOKEN` and `OPS_ALERT_TELEGRAM_CHAT_ID`: optional Telegram alert channel.
- `WEND_ALERT_WEBHOOK_URL`: legacy Discord-compatible webhook for publish failures. Keep it only for backward compatibility; new setup should use `OPS_ALERT_WEBHOOK_URL`.
- `WEND_EXPECTED_DATE`: optional override for manual backfills. Normal publishing uses the current date in `America/Los_Angeles`.
- `MAX_PUBLISH_WINDOW_MS`: defaults to 300000, or five minutes.
- `ALLOW_UNVERIFIED_WEND_PUBLISH`: only set to `true` for private dry runs. Public publishing should keep this unset.

GitHub Actions keeps fallback retries at `7,22,37,52 7 * * *` and `7,22,37,52 8 * * *` UTC so both PDT and PST reset windows are covered at off-peak minutes. Scheduled Actions can be delayed or dropped, so they are not the primary five-minute trigger.

Configure an external scheduler to call the secured application route throughout both reset windows, for example at minutes 00, 02, 05, and 08 of 07:00 and 08:00 UTC. Calls are idempotent and the application calculates the expected date in Los Angeles; no caller-supplied source URL is accepted.

```bash
curl -X POST https://wendanswertoday.org/api/ops/wend-dispatch \
  -H "Authorization: Bearer $CRON_SECRET"
```

The Vercel application requires `CRON_SECRET`, `GITHUB_DISPATCH_TOKEN`, and `WEND_GITHUB_REPOSITORY=owner/repository`. The GitHub token must be restricted to the target repository and only the permission needed to create repository dispatches. The route returns `202` after GitHub accepts the trigger, `401` for invalid credentials, `503` for missing server configuration, and a sanitized `502` for upstream failure.

The current public fallback strategy is:

- `wendanswertoday.me` embeds the current solved board directly in server-rendered HTML using cell attributes such as `data-row`, `data-col`, `data-word-index`, and `data-letter-index`. The importer reconstructs the grid, paths, and words from those attributes but does not trust that page alone.
- `wendgames.org/src/answers-data.js` is an independent, manually maintained word-list source. Automatic publishing fails closed unless its date, puzzle number, and complete normalized answer-word set agree with the primary source.
- LinkedIn's official Wend page remains the preferred source if a stable, compliant, verified capture is available. Public competitor pages are fallback signals and must pass the same geometry validator before publishing.

Trusted manual JSON has higher priority than the emergency file, which has higher priority than automatic public sources. A manual workflow run can provide `expected_date` and `puzzle_json`; GitHub records the authenticated actor as the verifier. Never copy trusted JSON into `repository_dispatch` client payloads or public endpoints.

For an official human-verified correction, create a temporary request body in your operator environment (do not commit it):

```json
{
  "ref": "main",
  "inputs": {
    "expected_date": "2026-07-10",
    "puzzle_json": "<single-line normalized Wend JSON>"
  }
}
```

Then dispatch the authenticated workflow through GitHub:

```bash
curl -L -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPOSITORY/actions/workflows/publish-wend-daily.yml/dispatches \
  --data-binary @workflow-dispatch.json
```

Delete `workflow-dispatch.json` after the request. The token needs access to run this workflow; it is separate from the application dispatch token and must never be written into repository files or logs.

After a Git push, `npm run wait:wend-production` polls `/api/wend-status` until production reports the exact local date and puzzle number. Only then may production smoke and IndexNow run. Production monitoring runs separately as a 15-minute GitHub fallback; an external uptime service should poll the status endpoint every minute around reset. See `docs/MONITORING_RUNBOOK.md`.

## Phase 0 Risk Check

Before treating official LinkedIn scraping as the primary path, run a spike:

- Confirm whether the official Wend page exposes puzzle data without a logged-in session.
- If a logged-in session is required, treat scraping as a risky auxiliary signal because session cookies, two-factor prompts, and account checks can fail without warning.
- Until that is proven stable, use the authenticated `WEND_DAILY_INPUT_JSON` path for human-verified official data or the automatic two-public-source quorum as a fallback.
- Never publish old answers as today. If the latest local puzzle is stale or unverified, public pages show a visible verification-pending notice and label the fallback as the latest verified puzzle.

## Publish Validation

The publish script refuses data unless:

- Required fields are present.
- `game` is `wend`.
- `date` equals the expected publish date.
- `isVerified` is `true`.
- Trusted JSON has a non-empty verifier identity, or automatic public data has date/number/word agreement from two sources.
- New records include a stable SHA-256 source hash and real capture/verification timestamps.
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
- optional `publication` provenance for older records; all newly published records receive it automatically

3. Regenerate the Wend puzzle index:

```bash
npm run generate:wend
```

This updates `src/lib/generated/wend-puzzles.ts` from every `YYYY-MM-DD.json` file under `data/puzzles/wend/`.
Do not hand-edit dated Wend imports in `src/lib/puzzles.ts`. The generated list is split into an internal raw dataset and a public verified dataset:

```ts
export const allWendPuzzles = generatedWendPuzzles as unknown as WendPuzzle[];
export const verifiedWendPuzzles = allWendPuzzles.filter((puzzle) => puzzle.isVerified);
export const wendPuzzles = verifiedWendPuzzles;
export const todayWend = verifiedWendPuzzles[0] ?? allWendPuzzles[0];
```

Public homepage, Today, Solver, Archive, sitemap, and archive detail routes must consume `wendPuzzles` / `todayWend`, not `allWendPuzzles`, so unverified captures never appear as public answers.

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
npm run test:wend-schedule
npm run test:wend-validator
npm run test:wend-source-verification
npm run test:wend-ops-routes
npm run test:wend-production-gate
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
- The verification-pending card states the expected puzzle and identifies the latest verified fallback.
- A 375-390px wide mobile viewport keeps Wend board tubes, start markers, check badges, and letter bubbles legible without horizontal overflow.
- A legacy archive URL returns a real `308` redirect in the running app, not just in source-level tests.

## Troubleshooting

If the Today page shows yesterday's puzzle:

- Run `npm run generate:wend`.
- Run `npm run latest:wend`.
- Check `src/lib/generated/wend-puzzles.ts` lists the newest JSON first.
- Confirm the newest current-day JSON has `isVerified: true`; otherwise public pages intentionally keep showing the latest verified puzzle.
- Confirm `todayWend` comes from `verifiedWendPuzzles[0]`, with `allWendPuzzles[0]` used only as an emergency empty-data fallback.
- Restart `npm run dev` if the dev server was already running.
- Inspect `https://wendanswertoday.org/api/wend-status`; HTTP `503` means the fallback is intentional and the current puzzle is still pending.

If a new archive page returns 404:

- Confirm `findWendByArchiveSlug()` can find the puzzle.
- Confirm the generated slug matches `/wend-answer-puzzle-{number}-{date}`.
- Confirm the puzzle has `isVerified: true` and is included in public `wendPuzzles`; unverified raw files stay out of archive detail pages.

If smoke testing fails:

- Read the failed path in the smoke output.
- Open that exact localhost URL.
- Check whether the page is missing security headers, brand text, or returning a non-2xx response.

If build fails after adding JSON:

- Check JSON syntax first.
- Check `grid` shape and `answers.path` coordinate arrays.
- Run `npm run typecheck` to locate TypeScript import or type issues.
