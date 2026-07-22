# LinkedIn Wend On-Page SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the daily answer intent on `/`, improve truthful Ready/Pending metadata and visible copy, add useful server-rendered LinkedIn Wend content, and align internal SEO signals and documentation.

**Architecture:** Keep the homepage as the single indexable daily-answer canonical. Replace `/linkedin-wend-answer-today` with a permanent redirect to `/`, drive Ready and Pending metadata from the existing freshness state, and keep the interactive answer tool above added educational copy. Reuse current page, SEO, navigation, puzzle, and test patterns without new dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node assertion tests, Tailwind CSS.

## Global Constraints

- Keep `/` as the only canonical daily LinkedIn Wend answer URL.
- Preserve accurate pending-state labeling; never call a fallback puzzle today's answer.
- Keep the answer interface spoiler-safe and above long-form explanatory content.
- Target roughly 1,200-1,300 rendered English words without keyword stuffing.
- Remove `nofollow` only from first-party LinkedIn game links; retain safe new-tab rel values.
- Add no dependencies and do not change the framework architecture.
- Preserve `America/Los_Angeles` scheduling and the existing verified-data gate.

---

### Task 1: Lock the canonical Today URL and internal-link contract

**Files:**
- Create: `src/app/linkedin-wend-answer-today/route.ts`
- Delete: `src/app/linkedin-wend-answer-today/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `scripts/submit-indexnow.mjs`
- Modify: `src/lib/puzzles.ts`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/BottomNav.tsx`
- Modify: `src/components/RelatedGames.tsx`
- Modify: supporting pages that still link to `/linkedin-wend-answer-today`
- Test: `tests/seo-routes.test.mjs`
- Test: `tests/seo-metadata.test.mjs`
- Test: `tests/navigation-simplification.test.mjs`
- Test: `tests/wend-freshness.test.mjs`
- Test: `tests/wend-mvp.test.mjs`
- Test: `tests/growth-guardrails.test.mjs`

**Interfaces:**
- Consumes: `Request.url`, homepage `/#answer`, existing Next.js redirect patterns.
- Produces: `GET(request)` and `HEAD(request)` responses with permanent status `301`, plus a single sitemap/canonical destination at `/`.

- [x] **Step 1: Write failing redirect, sitemap, and internal-link assertions**

Add source-level assertions that the legacy Today route exports `GET` and `HEAD`, redirects to `/` with status `301`, is absent from the sitemap and IndexNow submissions, and is no longer used by internal navigation or content links.

- [x] **Step 2: Run focused tests and verify RED**

Run: `npm run test:seo-routes && npm run test:seo-metadata && npm run test:navigation-simplification && npm run test:wend-freshness && npm run test:wend-mvp && npm run test:growth-guardrails`

Expected: FAIL because the route is still an indexable page and internal links still target it.

- [x] **Step 3: Implement the redirect and canonical link cleanup**

Use the existing route-handler pattern:

```ts
import { NextResponse } from "next/server";

function redirectToHome(request: Request) {
  return NextResponse.redirect(new URL("/", request.url), 301);
}

export function GET(request: Request) {
  return redirectToHome(request);
}

export function HEAD(request: Request) {
  return redirectToHome(request);
}
```

Replace Today links with `/` or `/#answer`, remove the legacy URL from sitemap/public discovery, and keep archive URLs unchanged.

- [x] **Step 4: Run focused tests and verify GREEN**

Run the Step 2 command again.

Expected: all six scripts pass.

---

### Task 2: Lock truthful metadata, headings, and visible copy

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/WendAnswerReveal.tsx`
- Test: `tests/seo-metadata.test.mjs`
- Test: `tests/wend-freshness.test.mjs`
- Test: `tests/wend-archive-coverage.test.mjs`

**Interfaces:**
- Consumes: `isWendReadyForToday(todayWend)`, `expectedWendDisplay(todayWend)`, `displayWend`, and existing `pageMetadata()`.
- Produces: Ready/Pending title and description strings, one stable H1, dynamic answer-module headings, and expanded server-rendered content.

- [x] **Step 1: Write failing metadata and copy assertions**

Require the exact Ready title `LinkedIn Wend Answer Today #${number} — ${date}`, Pending suffix `(Verifying)`, matching H1, descriptive section headings, expanded copy markers, truthful pending FAQ copy, and updated reveal labels.

- [x] **Step 2: Run focused tests and verify RED**

Run: `npm run test:seo-metadata && npm run test:wend-freshness && npm run test:wend-archive-coverage`

Expected: FAIL because the old `Status - date | Wend #` metadata and thin content are still present.

- [x] **Step 3: Implement minimal page and component changes**

Create small metadata helpers in `src/app/page.tsx`, derive FAQ content from `wendReady`, add the approved hero and explanatory sections after the utility content, update headings naturally, and change visible repeated controls to `Not revealed`, `Next letter`, and `Show word` while preserving descriptive `aria-label` values.

- [x] **Step 4: Run focused tests and verify GREEN**

Run the Step 2 command again.

Expected: all three scripts pass.

---

### Task 3: Align trusted outbound links and operational coverage

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/app/where-is-linkedin-wend/page.tsx`
- Modify: `scripts/monitor-production.mjs`
- Test: `tests/wend-game-nav.test.mjs`
- Test: `tests/ops-monitoring.test.mjs`
- Test: `tests/seo-metadata.test.mjs`

**Interfaces:**
- Consumes: official `https://www.linkedin.com/games/wend` URL and production monitor route list.
- Produces: `rel="noopener noreferrer"` for official game links and monitor coverage of the canonical homepage rather than the deprecated Today URL.

- [x] **Step 1: Write failing link and monitor assertions**

Require official game links to omit `nofollow`, retain `noopener noreferrer`, and require the production monitor to check `/` without checking the deprecated Today URL.

- [x] **Step 2: Run focused tests and verify RED**

Run: `node tests/wend-game-nav.test.mjs && npm run test:ops-monitoring && npm run test:seo-metadata`

Expected: FAIL on old rel values and legacy monitor route coverage.

- [x] **Step 3: Implement rel and monitor changes**

Update only official LinkedIn game links. Do not change rel policies for press, user-generated, sponsored, or unrelated external links.

- [x] **Step 4: Run focused tests and verify GREEN**

Run the Step 2 command again.

Expected: all three scripts pass.

---

### Task 4: Update documentation and verify the complete change

**Files:**
- Modify: `docs/SEO_RUNBOOK.md`
- Modify: `docs/DAILY_UPDATE_RUNBOOK.md`
- Modify: `docs/MONITORING_RUNBOOK.md`
- Modify: `docs/CHANGELOG.md`
- Modify: `public/llms.txt`
- Modify: `docs/superpowers/plans/2026-07-22-linkedin-wend-onpage-seo.md`

**Interfaces:**
- Consumes: implemented canonical, copy, link, and monitoring behavior.
- Produces: durable operator guidance and an auditable implementation record.

- [x] **Step 1: Update canonical, TDK, freshness, monitoring, and content guidance**

Document `/` as the only daily-answer canonical, the legacy redirect, Ready/Pending metadata templates, official-link rel policy, expanded content blocks, and the reason fixed word-count scoring is not the primary success metric.

- [x] **Step 2: Mark completed plan checkboxes and self-review documentation**

Run: `rg -n "TBD|TODO|implement later|/linkedin-wend-answer-today.*indexable" docs/SEO_RUNBOOK.md docs/DAILY_UPDATE_RUNBOOK.md docs/MONITORING_RUNBOOK.md docs/superpowers/plans/2026-07-22-linkedin-wend-onpage-seo.md`

Expected: no unresolved placeholders or stale indexable-Today guidance.

- [x] **Step 3: Run full verification**

Run all 22 `tests/*.test.mjs` files, then `npm run typecheck`, `npm run build`, and the local production smoke test.

Expected: zero test failures, typecheck exit 0, build exit 0, and all smoke routes return their expected status/content.

- [x] **Step 4: Inspect the rendered homepage**

Verify Ready and Pending source invariants, one H1, canonical `/`, descriptive links, no horizontal overflow at 390px, and approximately 1,200-1,300 visible English words without exposing answers by default.

- [x] **Step 5: Review, commit, and push**

Stage only files in this plan, commit with a conventional SEO message, and push `codex/linkedin-wend-onpage-seo` to `origin`.

## Verification Evidence

- All 22 `tests/*.test.mjs` files passed.
- `npm run typecheck` and `npm run build` completed successfully.
- Local production smoke checks passed for 16 routes, including the legacy Today URL returning `301` to `/`.
- Browser verification at 390 px found one H1, canonical `/`, 1,279 visible words, no horizontal overflow, working spoiler controls, and no console or page errors.
