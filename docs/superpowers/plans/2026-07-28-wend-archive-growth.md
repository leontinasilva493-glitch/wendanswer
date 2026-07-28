# Wend Archive Growth Implementation Plan

> **Execution:** implement in order with test-driven development. Do not publish a historical record until source quorum and geometry validation pass.

**Goal:** Complete the verified Wend archive, make daily pages more differentiated, improve archive discovery, and add an original verified-data statistics page.

**Architecture:** Preserve dated JSON as the source of truth. Add a reproducible historical parser, a pure metrics module, local-state archive filters, and one server-rendered statistics route. Reuse existing validator, provenance, SEO, card, and navigation patterns without new dependencies.

**Tech stack:** Next.js 16 App Router, React 19, TypeScript 6, Node ESM scripts/tests.

## Task 1: Lock dataset invariants

- [x] Add a failing dataset validation test.
- [x] Require unique puzzle numbers/dates, filename/date agreement, a valid date label, full geometry validation, and a matching provenance hash.
- [x] Verify and repair invalid #14/#15 records plus the unverified #16 placeholder.

## Task 2: Add a reproducible history parser

- [x] Add failing parser/source-quorum tests with minimal HTML and secondary-source fixtures.
- [x] Extract reusable archive-item parsing and source selection helpers.
- [x] Add a backfill command restricted to an explicit puzzle-number allowlist.
- [x] Dry-run all target puzzle numbers and review source agreement before writing.

## Task 3: Backfill verified permanent pages

- [x] Generate #1-#16 (replacing invalid #14-#16 records), #37, #39-#41, #43, and #46.
- [x] Regenerate `src/lib/generated/wend-puzzles.ts`.
- [x] Run parser, source-verification, geometry, dataset, archive-coverage, route, and sitemap tests.
- [x] Commit, push, merge, deploy, and verify the new production URLs before continuing.

## Task 4: Add puzzle-derived metrics

- [x] Add failing unit tests for grid, cell, word-length, turn, and start-position metrics.
- [x] Implement `src/lib/wend-statistics.ts` as pure functions.
- [x] Add a concise facts section to archive detail pages.
- [x] Confirm each verified puzzle produces a distinct metrics summary.

## Task 5: Upgrade Archive discovery

- [x] Add failing filter behavior and SEO guardrail tests.
- [x] Add local text/month/difficulty/grid-size filters and reset/empty states to `ArchiveList`.
- [x] Generate coverage and month summaries from verified data.
- [x] Keep result links server-visible and avoid query-string index pages.

## Task 6: Add LinkedIn Wend Statistics

- [x] Add failing route, metadata, sitemap, and aggregate tests.
- [x] Implement the verified-data statistics page with transparent methodology.
- [x] Add Archive/Header/related internal links and sitemap entry.
- [x] Verify self-canonical metadata and breadcrumb JSON-LD.

## Task 7: Handoff and release

- [ ] Update README and `docs/CHANGELOG.md` with the shipped routes, data workflow, deployment target, and recent changes.
- [ ] Run all repository tests, `npm run typecheck`, `npm run build`, and local smoke.
- [ ] Visually check homepage, detail, Archive, and Statistics at desktop and 390px.
- [ ] Push, create PR, wait for the Vercel check, merge, and verify production routes and sitemap.
