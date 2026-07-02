# SEO Runbook

This document records the launch SEO rules for WendAnswerToday.org.

## Domain

The canonical production domain is:

```text
https://wendanswertoday.org
```

The domain is configured in `src/lib/site.ts` and used by canonical URLs, sitemap URLs, robots, and metadata helpers.

## Metadata Helper

Page metadata should use `pageMetadata()` from `src/lib/seo.ts`.

The helper sets:

- Title and description.
- Optional keyword list.
- Canonical URL.
- Open Graph title, description, URL, site name, type, and image.
- Twitter `summary_large_image`.
- Optional article published and modified times.
- Optional per-page robots settings.
- Optional exact title with `absoluteTitle` when a page title should not inherit the root title template.

## MVP Positioning

The launch MVP is Wend-first. Other LinkedIn games can be added after the site is live and real data is available, but they should not be promoted from the homepage, related-link modules, sitemap, or `llms.txt` during the initial Wend validation window.

The desktop header should keep the primary user path short:

- `Today`
- `Solver`
- `Archive`
- `Play Game`

The `Play Game` dropdown should contain:

- `Official Wend`: external link to `https://www.linkedin.com/games/wend`, labeled `Official`, opening in a new tab with `nofollow noopener`.
- `Wend Unlimited`: internal link to `/wend-unlimited`.

Do not add `FAQ`, `Find Wend`, a mobile bottom-nav game item, or a `/wend-game` intermediary page during Phase 1. Keep the mobile bottom navigation focused on `Today`, `Solver`, and `Archive`. Keep `Find Wend` available from the FAQ page, and keep `How to Play` / `Solving Tips` in related-resource modules and contextual body links.

Footer navigation should stay limited to `Contact`, `Disclaimer`, `Privacy Policy`, and `Terms`.

## OG Image

Social previews use the dynamic image route:

```text
/api/og
```

The route generates a `1200x630` image with:

- WendAnswerToday.org branding.
- The blue path `W` logo over yellow-and-white puzzle tiles.
- Page-specific title and subtitle.
- Hints, Solver, and Archive labels.
- The display domain `wendanswertoday.org`.

When adding a new important page, pass `imageTitle` and `imageSubtitle` to `pageMetadata()`.

## Brand Logo Assets

The canonical site logo is the rounded yellow-and-white puzzle tile mark with a blue winding `W` path. Keep these generated assets in sync:

- `public/images/wend-logo.png`: original source image.
- `public/images/wend-logo-512.png`: Open Graph and large app icon source.
- `public/images/wend-logo-192.png`: browser/app icon.
- `public/images/wend-logo-180.png`: Apple touch icon.
- `public/images/wend-logo-128.png`: header and footer logo source.
- `public/images/wend-logo-64.png`: small favicon source.

`src/lib/site.ts` owns the shared logo path, alt text, and description. Header, Footer, root metadata icons, `/icon.svg`, and `/api/og` should use that shared brand definition rather than hard-coded text-only logo blocks.

## TDK Rules

Use short page titles. The root layout appends the brand name automatically.

Exception: the homepage uses `absoluteTitle: true` because its launch title already includes the intended full SERP title.

Recommended intent split:

- `/`: `Wend Answer Today - {date} | Wend #{number} Answer`
- `/linkedin-wend-answer-today`: `LinkedIn Wend Answer Today - {date}`
- `/linkedin-wend-solver`: `LinkedIn Wend Solver for Today's Puzzle`
- `/linkedin-wend-archive`: `LinkedIn Wend Answer Archive`
- `/wend-unlimited`: `Wend Practice Puzzle` with `noindex,follow` until real unlimited mode exists.
- `/wend-answer-puzzle-{number}-{month-day-year}`: `LinkedIn Wend Answer #{number} - {date}`

Avoid making every page compete for the same generic keyword.

## Homepage TDK

Current homepage TDK:

```text
Title:
Wend Answer Today - {date} | Wend #{number} Answer

Description:
Wend answer today for {date} puzzle no {number}. Get spoiler-safe hints, word paths, solver help, and recent Wend archive pages.

Keywords:
wend answer today, wend answer {date}, wend #{number} answer, wend answers, wend full answer, wend answer for date, wend answer for LinkedIn Games
```

Homepage Hero copy should use the same source as metadata:

```text
Wend answer today for {date} puzzle no {number}
```

The status line above the Hero headline should include:

```text
Wend #{number} answer | {date} | updated daily at 8:00 UTC
```

## Next Puzzle Countdown

The homepage includes a compact next-puzzle countdown inside the lower half of the Hero, directly after the primary CTA buttons. It targets adjacent search intent such as `next wend puzzle`, `when does linkedin wend update`, `wend answer tomorrow`, and date-based next-puzzle searches without publishing unverified answers or adding a separate mid-page section.

The countdown must use `nextWendDisplay()` from `src/lib/wend-status.ts`, which is tied to the shared `WEND_RELEASE_HOUR_UTC = 8` rule. The server-rendered copy should include:

```text
Next Wend #{number} unlocks in
Expected {date} at 8:00 UTC
```

Only the live hours/minutes/seconds values are client-side. The date, puzzle number, and release-time promise should remain visible in the page HTML for users and crawlers. Keep the module visually subordinate to the Hero headline and CTA, but use the centered white-card treatment so it reads as a useful first-screen status signal. The time blocks should stay compact, with each value and unit on one horizontal row to avoid inflating the Hero height.

## Structured Data

Structured data is part of the launch SEO baseline:

- Home and Today pages use FAQPage where visible FAQ content exists.
- Wend how-to pages use HowTo schema through `howToJson()`.
- Wend archive detail pages use Article, BreadcrumbList, and FAQPage schema.
- Solver uses BreadcrumbList and FAQPage schema.

When adding a new instructional page, add visible steps and `howToJson()`. When adding a new recurring answer/detail page, add visible FAQ content and `faqJson()` so structured data matches on-page text.

## IndexNow

IndexNow is wired through:

```bash
npm run indexnow:submit
```

Configure these values in GitHub/Vercel:

```text
INDEXNOW_KEY
INDEXNOW_SITE_URL=https://wendanswertoday.org
INDEXNOW_ENDPOINT=https://api.indexnow.org/indexnow
```

The site serves the verification key at `/indexnow-key.txt` and submits that URL as `keyLocation`. The daily publish workflow runs IndexNow submission after production smoke checks. If `INDEXNOW_KEY` is missing, the command skips safely.

## Index Strategy

Current launch focus is Wend.

Indexable:

- Home.
- Wend Today.
- Wend Solver.
- Wend Archive.
- Wend history detail pages.
- Wend how-to pages.
- FAQ, contact, and legal pages.

Temporarily `noindex,follow`:

- `/linkedin-patches-answer-today`
- `/linkedin-patches-archive`
- `/linkedin-zip-answer-today`
- `/linkedin-zip-solver`
- `/wend-unlimited`

Reason: Patches and Zip are not yet part of the verified daily update workflow. Wend Unlimited is paused during the MVP because the current page is a single practice puzzle, not a true unlimited generator. Keeping these routes out of search, sitemap, related-link modules, mobile navigation, and `llms.txt` prevents thin or stale pages from diluting launch quality. The desktop `Play Game` dropdown may still link to `/wend-unlimited` as a controlled high-intent practice entry while the page remains `noindex,follow`.

To make Patches or Zip indexable later:

1. Add verified daily data.
2. Remove `robots: noindexFollow` from the page metadata.
3. Add the route back to `src/app/sitemap.ts`.
4. Update `scripts/smoke-local.mjs`.
5. Run the full verification commands.

## Wend URL Strategy

Use one permanent high-authority daily URL plus canonical dated archives:

- Daily evergreen URL: `/linkedin-wend-answer-today`
- Archive URL pattern: `/wend-answer-puzzle-{puzzleNumber}-{month-day-year}`
- Example archive URL: `/wend-answer-puzzle-17-june-25-2026`

The sitemap should publish only canonical archive URLs. Legacy archive URLs shaped like `/linkedin-wend-answer-{number}-{date}` should redirect to the matching canonical archive page to avoid duplicate indexed answer pages.

Homepage archive coverage:

- The homepage `All Wend Answers` block must render every verified Wend puzzle from `wendPuzzles`, not a sliced recent subset.
- `/linkedin-wend-archive` must also render every verified Wend puzzle from `wendPuzzles`.
- `tests/wend-archive-coverage.test.mjs` guards that every JSON file in `data/puzzles/wend` reaches the generated raw index, while only verified puzzles reach the public `wendPuzzles` archive, sitemap, static archive params, and homepage archive block.
- Keep unverified captures available only through `allWendPuzzles` for internal checks and future correction; do not link or index them as public answer pages.

## Stale Today Protection

After the 8:00 UTC reset, `/` and `/linkedin-wend-answer-today` must not label yesterday's answer as today's answer. The pages use 60-second ISR (`revalidate = 60`) so freshness checks update quickly without forcing every visitor request to render on the server. A puzzle is current only when the latest data is both:

- `isVerified: true`
- dated as the expected current Wend date for the 8:00 UTC release window

If either check fails, public pages should silently render the latest verified puzzle through the normal game module. Do not show a public verification-pending notice or promote a calendar-derived puzzle number before matching verified data exists.

Homepage consistency rule:

- The visible homepage Hero must use the same `displayWend` puzzle as the answer reveal module.
- Do not use calendar-derived `expectedWendDisplay()` values for visible Hero copy before matching verified puzzle data exists.
- The next-puzzle countdown should render only when `wendReady` is true. If the current expected puzzle is missing, hide the countdown rather than showing the following puzzle number beside an older game module.

The Today page metadata should follow the same readiness rule:

- Ready: include `dateLabel` and `Wend #{puzzleNumber}` in the title, description, and social image subtitle.
- Pending: avoid promoting an unverified answer as current. Use the latest verified puzzle or generic status-oriented metadata until the real current puzzle is published.

## Sitemap Priorities

Current priorities:

- `/`: `1.0`
- `/linkedin-wend-answer-today`: `0.95`
- `/linkedin-wend-solver`: `0.85`
- `/linkedin-wend-archive`: `0.75`
- `/where-is-linkedin-wend`: `0.65`
- Wend how-to pages: `0.65`
- Wend history detail pages: `0.65`
- FAQ/contact: `0.4`
- Legal pages: `0.25`

## SEO Verification

Run:

```bash
npm run test:seo-metadata
npm run test:seo-routes
npm run test:wend-mvp
npm run typecheck
npm run build
npm run smoke:local
```

Local spot checks:

- Home HTML includes `og:image` and `twitter:image`.
- `/api/og?title=LinkedIn%20Wend%20Answer%20Today` returns an image response.
- `/sitemap.xml` does not include temporary noindex pages.
- `/sitemap.xml` includes `/wend-answer-puzzle-{number}-{date}` archive URLs, not legacy `/linkedin-wend-answer-{number}-{date}` archive URLs.
- A legacy archive URL such as `/linkedin-wend-answer-18-june-26-2026` returns a permanent `308` redirect to the canonical archive URL.
- Patches, Zip, and paused practice pages include `noindex, follow`.

Production checks:

```bash
npm run monitor:production
```

The production monitor verifies that `/`, `/linkedin-wend-answer-today`, `/linkedin-wend-archive`, and the latest archive detail page are live, do not contain `noindex`, remain present in the sitemap, and that the latest legacy archive URL returns a real production `308` redirect.
