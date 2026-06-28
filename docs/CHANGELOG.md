# Changelog

This file records changes that are useful for debugging, rollback decisions, and launch-readiness review.

## 2026-06-28

### Wend board arrow placement fix

- Moved Wend route direction arrows from cell interiors to the boundary between the current letter cell and the next letter cell, preventing arrows from overlapping the large letter text.
- Corrected the directional edge mapping so right, left, down, and up arrows sit on the matching cell edge.
- Added parity test coverage to keep route arrows below letter text and anchored to the correct inter-cell boundaries.

### P0 production monitoring and crawlability checks

- Added `scripts/monitor-production.mjs` and `npm run monitor:production` to check production uptime, core-page noindex regressions, robots/sitemap crawlability, Today page freshness, and the latest legacy archive `308` redirect.
- Added `.github/workflows/monitor-production.yml` to run the production monitor every five minutes, send Discord-compatible or Telegram alerts through shared ops secrets, and open a `automation` / `monitoring` / `p0` GitHub issue on failure.
- Added `scripts/ops-alert.mjs` and updated daily Wend publishing to reuse the same ops alert channel while preserving `WEND_ALERT_WEBHOOK_URL` compatibility.
- Added monitoring test coverage and a dedicated monitoring runbook, including the rule that analytics or tracking packages must not be added without matching privacy and Cookie Notice updates.

## 2026-06-27

### Homepage dynamic Wend hero copy

- Replaced the static homepage Hero headline with the dynamic search phrase `Wend answer today for {date} puzzle no {number}`.
- Added a one-line Hero status bar that shows `Wend #{number} answer`, the current Wend date, and the 8:00 UTC daily update signal.
- Updated homepage metadata to use the same dynamic date and puzzle-number source as the visible Hero copy, covering searches such as `wend answer today`, `wend answer june 28`, and `wend #20 answer`.

### Publish Wend #19 and make daily source extraction real

- Added verified Wend #19 data for June 27, 2026 with the 8x8 board, blocked cells, answer words, and full path coordinates.
- Upgraded `publish-wend-daily.mjs` so it can extract a Wend puzzle from HTML containing `data-row`, `data-col`, `data-word-index`, and `data-letter-index` cell attributes, instead of only accepting prebuilt JSON.
- Added a public fallback source URL for the daily publish job when `WEND_DAILY_SOURCE_URL` is not configured, while still allowing `WEND_DAILY_INPUT_FILE` to override the network source for manual publishes.
- Added a GitHub Actions failure-issue fallback so a broken daily publish creates a visible `automation` / `wend-publish` issue instead of silently falling behind.
- Updated latest-date, LinkedIn parity, and publish automation tests to guard Wend #19 and the HTML extraction path.

### Remove verification-pending UI from public pages

- Removed the public verification-pending notice component and all pending/not-published copy from the homepage and Today page.
- Kept the freshness check, but when the current-day puzzle is missing or unverified the pages now render the latest verified Wend puzzle through the normal answer module.
- Updated tests to forbid pending/verification copy in public page sources and require the consistent `displayWend` fallback path.

### Wend pending fallback game module

- Kept the freshness gate intact when the current Wend date is missing or unverified, but replaced the empty game area with the latest verified archived Wend puzzle.
- Updated the verification-pending notice to explicitly explain that the visible game module is a fallback and not today's unverified answer.
- Added freshness test coverage so homepage and Today page continue to render the latest verified game module while the current-day answer is pending.

### Wend answer layout density pass

- Compressed the right-side answer reveal panel with a desktop two-column word-card grid, smaller in-panel letter bubbles, and shorter reveal buttons so its height better matches the Wend board area.
- Reused compact archive card styles for homepage recent answers and the archive page, including two-line hint truncation for steadier card heights.
- Reworked the related Wend resources area into a responsive resource grid and aligned the dormant game card component with the same compact card/link system.

### Wend readiness, SEO, and solver polish

- Restored readiness-aware Today page metadata: verified puzzles use a date-and-puzzle-number title/description/social subtitle, while pending puzzles keep generic metadata so stale dates are not promoted.
- Switched `/` and `/linkedin-wend-answer-today` from full `force-dynamic` rendering to 60-second ISR, preserving freshness checks without forcing every request to hit server rendering.
- Updated the Wend Solver page to reuse the upgraded word-card, letter-bubble, progress-bar, and reveal-action styling from the Today answer module.
- Added a shared `FaqDetails` component so homepage and Today page FAQ disclosures use the same rotating chevron feedback.
- Strengthened `WendVerificationNotice` with a direct link to the latest verified archive detail page.
- Added narrow-screen CSS tuning for Wend board letters, start rings, check badges, arrows, word cards, and letter bubbles.
- Updated runbooks and tests to guard verified metadata, 60-second ISR, solver UI parity, mobile checks, and real legacy archive redirect verification.

## 2026-06-26

### Wend interactive path styling

- Studied `wendanswertoday.me` interaction behavior: board-cell click reveals the matching answer bubble, `Reveal Word` completes one word, and `Reveal all` draws colored route tubes with start markers, check badges, and direction arrows.
- Reworked `WendGrid` to render colored path tubes, circular start markers, check markers, and directional arrows for revealed cells instead of simple color blocks.
- Reworked `WendAnswerReveal` to show a `Words found` progress bar, circular answer bubbles, per-word `Reveal Letter` and `Reveal Word` controls, completed word-card styling, and full clear/reveal states.
- Added responsive CSS for the Wend board and word cards so the 7x7 board fits mobile without horizontal overflow.
- Updated tests to guard the path-tube, start-marker, check-marker, progress, and bubble UI primitives.

### LinkedIn Wend board parity investigation

- Replaced the June 25 placeholder 5x5 Wend grid with the 6x6 letter layout and gray blocked-cell regions shown in the LinkedIn screenshot.
- Added the June 26 Wend #18 verified 7x7 board, blocked cells, answer words, and official path coordinates: `ADD`, `PLUS`, `EXTRA`, `CREATE`, `PREMIUM`, and `POSITIVE`.
- Filled the June 25 Wend #17 verified answer words and paths: `TOY`, `RACK`, `SPIRAL`, `AUCTION`, and `QUANTITY`.
- Updated `WendGrid` to render variable board sizes, LinkedIn-style light square cells, and connected gray wall blocks with dark borders instead of hard-coded 5-column card tiles.
- Removed the custom site watermark from the rendered Wend board so the game surface is closer to LinkedIn's native board.
- Fixed the proxy rule that accidentally redirected `/linkedin-wend-answer-today` as if it were an old dated archive URL.
- Changed Wend grid data to allow `null` blocked cells and updated TypeScript types accordingly.
- Strengthened publish validation to follow LinkedIn's orthogonal adjacency rule, reject paths through blocked cells, reject overlapping answer paths, and require every open cell to be used exactly once before verified publication.
- Added `tests/wend-linkedin-parity.test.mjs` to guard against regressing back to the placeholder 5x5 board or stale daily data.
- Updated the latest-date expectation so `todayWend` resolves to June 26 / Wend #18 instead of June 25 / Wend #17.

### Wend publish reliability hardening

- Added `scripts/validate-wend-puzzle.mjs` to validate required fields, expected publish date, verified status, grid shape, in-grid path coordinates, adjacent path steps, and path-spelled answer words before publishing.
- Updated `scripts/publish-wend-daily.mjs` to use the dedicated validator, support `WEND_PERSIST_TO_GIT=true`, commit generated Wend data back to the repository, and send a single webhook alert through `WEND_ALERT_WEBHOOK_URL` on failure.
- Updated `.github/workflows/publish-wend-daily.yml` to retry at `0,1,3,5 8 * * *` UTC, serialize overlapping runs, and grant `contents: write` for generated data commits.
- Added dynamic freshness protection for `/` and `/linkedin-wend-answer-today`; stale or unverified data now shows a verification-pending notice instead of old answers, hints, or reveal controls.
- Added `src/lib/wend-status.ts` and `src/components/WendVerificationNotice.tsx`.
- Updated `scripts/smoke-local.mjs` to derive the latest Wend archive URL from data instead of hard-coding a dated puzzle.
- Added `tests/wend-freshness.test.mjs` and `tests/wend-validator.test.mjs`; expanded publish automation coverage for git persistence and webhook alerting.
- Updated launch docs to call out the official LinkedIn scraping spike as a Phase 0 risk check rather than assuming unauthenticated official-page scraping is reliable.

## 2026-06-25

### Wend fast publishing and canonical archive URLs

- Added `scripts/publish-wend-daily.mjs` and `npm run publish:wend` as the daily automation entry point for publishing verified Wend data inside the five-minute post-reset window.
- Added `.github/workflows/publish-wend-daily.yml` to run the publish command every day at 8:00 UTC and via manual workflow dispatch.
- The publish script validates required JSON fields, refuses unverified public data by default, regenerates `src/lib/generated/wend-puzzles.ts`, runs fast route/data tests, and can run an optional deployment command through `WEND_DEPLOY_COMMAND`.
- Added canonical archive URL support using `/wend-answer-puzzle-{number}-{month-day-year}`, for example `/wend-answer-puzzle-17-june-25-2026`.
- Updated archive links, sitemap entries, static params, neighboring puzzle links, and smoke coverage to use the canonical archive URL.
- Legacy `/linkedin-wend-answer-{number}-{date}` archive URLs now redirect to the matching canonical archive URL.
- Added `tests/wend-archive-url.test.mjs` and `tests/wend-publish-automation.test.mjs` with npm scripts to guard the new URL and automation behavior.
- Updated `README.md`, `docs/DAILY_UPDATE_RUNBOOK.md`, and `docs/SEO_RUNBOOK.md` with the fast publish workflow and canonical URL rules.

### P0 launch hardening

- Added `data/puzzles/wend/2026-06-25.json` so the MVP no longer serves June 24 as the latest Wend entry on June 25.
- Marked the June 25 entry as `isVerified: false`; replace it with verified real puzzle data before public promotion.
- Added `scripts/generate-wend-puzzles.mjs` and `npm run generate:wend` to generate `src/lib/generated/wend-puzzles.ts` from every `data/puzzles/wend/YYYY-MM-DD.json` file.
- Updated `src/lib/puzzles.ts` so `todayWend` comes from the generated newest-first list instead of a manually hard-coded dated import.
- Added `prebuild` and `pretypecheck` hooks so the generated Wend index is refreshed before build/typecheck.
- Locked all `package.json` dependencies and devDependencies to exact versions; no `latest`, `^`, or `~` ranges remain.
- Synchronized `package-lock.json` after pinning versions.
- Paused `/wend-unlimited` as a public SEO page because the current implementation is a single practice puzzle, not a true unlimited mode.
- Removed `/wend-unlimited` from `RelatedGames`, `llms.txt`, `sitemap.ts`, and the main Today / how-to-solve user paths.
- Set `/wend-unlimited` to `noindex,follow` and removed the non-functional `New Puzzle` and `Share` buttons.
- Updated `tests/latest-date.test.mjs`, `tests/wend-mvp.test.mjs`, `tests/seo-metadata.test.mjs`, and `scripts/smoke-local.mjs` to guard the new behavior.

### Known Risk

- The June 25 Wend JSON is an unverified placeholder. Do not treat it as a final public answer until real puzzle data is checked.
- `npm audit --omit=dev` reports two moderate issues from Next's internal `postcss` dependency range. npm's suggested automatic fix would install an incompatible old Next version, so this was not applied.

## 2026-06-24

### Centered MVP homepage redesign

- Reworked the homepage to match the approved centered mockup direction.
- Removed the separate right-side `Today's Wend plan` / snapshot-style panel because it looked like a feature but duplicated the real answer controls.
- Changed the hero to a single-column centered layout with two anchors: `Get Today's Answer` to `#answer` and `Start with a Hint` to `#hints`.
- Moved the real interactive `WendAnswerReveal` module directly under the hero so the first functional section is the daily answer card.
- Updated `WendAnswerReveal` to use the homepage module structure: title, date / puzzle / difficulty / word-count metadata, left grid, right reveal controls, and row-level `Get Word` buttons.
- Reorganized homepage support content into bordered modules for spoiler-safe hints, step-by-step explanation, Wend FAQ, fast tip, common mistake, difficulty note, and recent Wend answers.
- Reduced shared card radius from `rounded-xl` to `rounded-lg` to stay closer to the approved 8px bordered-card visual style.
- Updated `tests/seo-metadata.test.mjs` to prevent reintroducing a right-side plan/snapshot panel and to require the centered hero plus real answer reveal module.

### Structured card-based frontend polish

- Added shared layout classes in `src/app/globals.css`: `content-card`, `section-heading`, `section-icon`, and `inner-card`.
- Applied a clearer card-and-divider structure inspired by the referenced Wend answer page: each major module now has a white card, light gray border, icon-led heading, and inner bordered rows.
- Updated the homepage right-side action card, archive block, FAQ block, and help block to use the shared card structure.
- Updated `/linkedin-wend-answer-today` sections for hero, answer reveal, hints, explanation, tips, practice CTA, related resources, and visible FAQ.
- Rendered the existing Today FAQ as visible accordion-style rows instead of only JSON-LD.
- Updated `HintAccordion`, `ArchiveList`, `RelatedGames`, and `WendAnswerReveal` to use the same visual language.
- Added regression coverage so the shared card primitives remain present and the answer reveal keeps the icon-led card structure.

### Homepage hero action card clarification

- Replaced the homepage right-side static Wend grid preview with a `Today’s Wend plan` action card.
- The old grid looked interactive but only acted as a visual preview, which made the homepage purpose unclear.
- The new card explains the intended flow: start with a hint, reveal one word, then reveal all only if needed.
- Primary homepage CTA now points to `/linkedin-wend-answer-today#answer`, where the real interactive answer reveal lives.
- Updated `tests/seo-metadata.test.mjs` to prevent reintroducing a fake interactive grid preview on the homepage.

### Wend user-pain P0/P1 optimization

- Added `src/components/WendAnswerReveal.tsx`, a Wend-first answer card with `Reveal Letter`, `Get Word`, `Reveal all`, and `Clear all`.
- Reused the existing `WendGrid` path-highlighting logic and extended its cell click callback so clicked cells can reveal a single letter without exposing the full answer.
- Replaced the generic solver block on `/linkedin-wend-answer-today` with the Wend answer reveal card.
- Replaced the archived full-path reveal block on Wend history pages with the same Wend answer reveal card.
- Added daily puzzle fields: `fastTip`, `commonMistake`, and `difficultyNote`.
- Rendered fast solving tip, common mistake, and difficulty note on Today and history detail pages.
- Added `/where-is-linkedin-wend` for users who cannot find Wend or need the direct official game link.
- Expanded FAQ coverage for Wend access, Wend not showing, loading issues, and streak-safe help.
- Removed `Practice` from primary desktop and mobile navigation so `/wend-unlimited` stays a retention CTA instead of competing with Today.
- Added `npm run test:wend-mvp` and `tests/wend-mvp.test.mjs` to guard the Wend-first MVP behavior.
- Updated `README.md`, `docs/DAILY_UPDATE_RUNBOOK.md`, and `docs/SEO_RUNBOOK.md` with the new checks, JSON fields, and access page.

### Wend-first information architecture

- Repositioned the homepage around Wend only instead of a broad LinkedIn Games hub.
- Removed the homepage `All Games` section and active secondary-game promotion.
- Updated homepage title and description to focus on Wend daily hints, solver help, and archives.
- Updated `RelatedGames` into `More Wend Resources`, removing Patches and Zip links.
- Updated `site.description`, FAQ copy, and `public/llms.txt` to describe the site as a Wend resource.
- Updated `tests/seo-metadata.test.mjs` to guard against homepage, related-link, and `llms.txt` promotion of secondary games during the Wend-first MVP window.

### Homepage TDK update

- Updated the homepage title to `Wend Answer Today & LinkedIn Games Answers | Daily Hints & Solutions`; later superseded by the Wend-first title above.
- Updated the homepage description to target daily LinkedIn Games answers, spoiler-safe hints, and solvers; later narrowed by the Wend-first positioning above.
- Added homepage keywords for Wend answer intent.
- Extended `pageMetadata()` with `keywords` and `absoluteTitle` support so the homepage title can render exactly without the root layout title template appending the brand.
- Updated `tests/seo-metadata.test.mjs` to guard the homepage TDK.
- Updated `docs/SEO_RUNBOOK.md` with the current homepage TDK.

### SEO P0/P1 metadata hardening

- Added dynamic Open Graph image generation at `/api/og` with a `1200x630` ImageResponse.
- Updated `pageMetadata()` to output Open Graph images, Twitter `summary_large_image`, optional article times, page-specific OG copy, and optional robots settings.
- Shortened core Wend TDK titles so the root layout can append the brand without making titles too long.
- Added route-specific sitemap priorities and change frequencies.
- Temporarily set Patches and Zip pages to `noindex,follow` and removed them from `sitemap.ts` until their daily data is verified.
- Updated `scripts/smoke-local.mjs` so noindex pages are checked separately from public indexable pages.
- Added `tests/seo-metadata.test.mjs` and `npm run test:seo-metadata`.
- Added `docs/SEO_RUNBOOK.md` for TDK, OG image, index strategy, and sitemap rules.

### Duplicate SEO route removal

- Removed the indexable `/linkedin-games-answers-today` page that reused the homepage content.
- Added a route handler that returns a `301` redirect from `/linkedin-games-answers-today` to `/`.
- Removed `/linkedin-games-answers-today` from `src/app/sitemap.ts`.
- Updated `scripts/smoke-local.mjs` to verify the legacy URL redirects instead of treating it as a normal public page.
- Added `tests/seo-routes.test.mjs` and `npm run test:seo-routes` to prevent this duplicate page from returning.

### Wend daily data freshness

- Added `data/puzzles/wend/2026-06-24.json` for the June 24, 2026 Wend page.
- Updated `src/lib/puzzles.ts` so `todayWend` now imports the June 24, 2026 JSON first.
- Added `scripts/latest-date.mjs` to find the newest `YYYY-MM-DD.json` file under `data/puzzles/wend`.
- Added `npm run latest:wend` for quick latest-date inspection.
- Added `tests/latest-date.test.mjs` and `npm run test:latest-date`.
- Updated local smoke coverage to include `/linkedin-wend-answer-16-june-24-2026`.

### Verification

The following checks passed after the change:

```bash
npm run test:latest-date
npm run latest:wend
npm run typecheck
npm run build
npm run smoke:local
```

### Known Risk

- `data/puzzles/wend/2026-06-24.json` is marked with `isVerified: false`. Before public launch, replace the placeholder content with verified real puzzle data and set `isVerified` according to the actual verification status.

## Pending Launch Items

These are known issues from the current audit and are not resolved by the June 24 data freshness change:

- Add analytics, preferably Plausible for a lightweight MVP.
