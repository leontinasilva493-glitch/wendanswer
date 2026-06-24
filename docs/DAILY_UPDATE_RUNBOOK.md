# Daily Update Runbook

Use this runbook during the first 14 launch days to keep the daily pages fresh and make local failures easy to trace.

## Goal

Publish the newest daily puzzle data, confirm the correct page is served locally, and keep a small record of what changed.

## Wend Daily Data Update

1. Add a new JSON file under `data/puzzles/wend/` using this naming format:

```text
YYYY-MM-DD.json
```

Example:

```text
data/puzzles/wend/2026-06-24.json
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

3. Update `src/lib/puzzles.ts` so the newest Wend JSON is imported as `wendToday`.

The order should stay newest first:

```ts
export const wendPuzzles = [wendToday, wendPrevious, wendOlder] as WendPuzzle[];
export const todayWend = wendPuzzles[0];
```

4. If the new puzzle creates a new archive detail page slug, add that route to `scripts/smoke-local.mjs` so local smoke testing covers it.

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
  "latestDate": "2026-06-24",
  "latestFile": "data\\puzzles\\wend\\2026-06-24.json",
  "count": 3
}
```

If the latest date is wrong, check:

- The file name matches `YYYY-MM-DD.json`.
- The file is placed under `data/puzzles/wend/`.
- The date was not accidentally saved in another game folder.

## Local Verification

Run these before considering the daily update done:

```bash
npm run test:latest-date
npm run test:wend-mvp
npm run test:seo-metadata
npm run test:seo-routes
npm run typecheck
npm run build
```

Then start the local server:

```bash
npm run dev
```

In another terminal, run:

```bash
npm run smoke:local
```

Open these pages locally:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/linkedin-wend-answer-today`
- The newest Wend archive detail page, for example `http://127.0.0.1:3000/linkedin-wend-answer-16-june-24-2026`

Confirm the visible page shows the newest date and puzzle number.

## Troubleshooting

If the Today page shows yesterday's puzzle:

- Check `src/lib/puzzles.ts` imports.
- Run `npm run latest:wend`.
- Confirm `todayWend = wendPuzzles[0]`.
- Restart `npm run dev` if the dev server was already running.

If a new archive page returns 404:

- Confirm `findWendBySlug()` can find the puzzle.
- Confirm the generated slug matches the expected route.
- Confirm the puzzle is included in `wendPuzzles`.

If smoke testing fails:

- Read the failed path in the smoke output.
- Open that exact localhost URL.
- Check whether the page is missing security headers, brand text, or returning a non-2xx response.

If build fails after adding JSON:

- Check JSON syntax first.
- Check `grid` shape and `answers.path` coordinate arrays.
- Run `npm run typecheck` to locate TypeScript import or type issues.
