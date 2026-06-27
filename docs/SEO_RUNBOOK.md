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

## OG Image

Social previews use the dynamic image route:

```text
/api/og
```

The route generates a `1200x630` image with:

- WendAnswerToday.org branding.
- A simple W monogram.
- Page-specific title and subtitle.
- Hints, Solver, and Archive labels.
- The display domain `wendanswertoday.org`.

When adding a new important page, pass `imageTitle` and `imageSubtitle` to `pageMetadata()`.

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

## Index Strategy

Current launch focus is Wend.

Indexable:

- Home.
- Wend Today.
- Wend Solver.
- Wend Archive.
- Wend history detail pages.
- Wend how-to pages.
- FAQ, contact, status, and legal pages.

Temporarily `noindex,follow`:

- `/linkedin-patches-answer-today`
- `/linkedin-patches-archive`
- `/linkedin-zip-answer-today`
- `/linkedin-zip-solver`
- `/wend-unlimited`

Reason: Patches and Zip are not yet part of the verified daily update workflow. Wend Unlimited is paused during the MVP because the current page is a single practice puzzle, not a true unlimited generator. Keeping these routes accessible but out of search and out of primary navigation prevents thin or stale pages from diluting launch quality.

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

## Stale Today Protection

After the 8:00 UTC reset, `/` and `/linkedin-wend-answer-today` must not show yesterday's answer as today's answer. The pages use 60-second ISR (`revalidate = 60`) so freshness checks update quickly without forcing every visitor request to render on the server. Answer reveals show only when the latest puzzle is both:

- `isVerified: true`
- dated as the expected current Wend date for the 8:00 UTC release window

If either check fails, the page shows a verification-pending notice and keeps hints, word paths, and reveal controls hidden.

The Today page metadata should follow the same readiness rule:

- Ready: include `dateLabel` and `Wend #{puzzleNumber}` in the title, description, and social image subtitle.
- Pending: use a generic title and description so an old puzzle date is not promoted as today's answer.
- Pending notice: include a direct link to the latest verified archive detail page, plus archive and official game links.

## Sitemap Priorities

Current priorities:

- `/`: `1.0`
- `/linkedin-wend-answer-today`: `0.95`
- `/linkedin-wend-solver`: `0.85`
- `/linkedin-wend-archive`: `0.75`
- `/where-is-linkedin-wend`: `0.65`
- Wend how-to pages: `0.65`
- Wend history detail pages: `0.65`
- FAQ/contact/status: `0.4`
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
