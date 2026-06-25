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
npm run test:latest-date
npm run test:wend-mvp
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

- Centered hero with `Get Today's Answer` and `Start with a Hint` anchor CTAs.
- Full-width `Today's LinkedIn Wend Answer` card immediately after the hero.
- Left side of the answer card renders the Wend grid; right side handles `Reveal all`, `Clear all`, and row-level `Get Word`.
- Supporting sections follow the answer card: spoiler-safe hints, step-by-step explanation, FAQ, solving notes, and recent Wend answers.
- Do not add a separate right-side plan, snapshot, or fake preview card to the hero. If extra daily metadata is needed, keep it inside the real answer card.

## Documentation Rule

Any functional change should update Markdown documentation in the same pass when it affects one of these areas:

- Daily puzzle data, import paths, archive routes, or sitemap entries.
- Dependency version pins or package-lock changes.
- SEO metadata, canonical URLs, redirects, robots, sitemap, or social sharing previews.
- Analytics, event tracking, launch checks, smoke tests, or build scripts.
- User-facing game pages, solver behavior, archive behavior, or error/status pages.

For small code-only fixes, add one short entry to `docs/CHANGELOG.md`. For changes that alter the daily workflow, also update `docs/DAILY_UPDATE_RUNBOOK.md`.
