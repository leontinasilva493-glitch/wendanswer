# Wend Daily Reliability P0/P1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Wend daily publishing daylight-saving-aware, independently triggerable, source-verifiable, production-gated, transparent during delays, and externally monitorable.

**Architecture:** Preserve dated JSON in Git and Vercel Git deployments. Add Los Angeles scheduling, secured dispatch and public status routes, provenance-aware source quorum, and a production visibility gate before smoke/indexing.

**Tech Stack:** Next.js 16 App Router, TypeScript 6, Node.js 24 ESM scripts, GitHub Actions, Vercel.

**Status:** Completed, fully verified, committed, and pushed to `codex/wend-freshness-fix` on 2026-07-10.

## Global Constraints

- Keep Git/Vercel as the P0/P1 publishing path; database/KV migration is P2.
- Never introduce LinkedIn credentials or logged-in scraping.
- Automatic public HTML needs two-source agreement plus geometry validation.
- Manual normalized JSON needs an explicit verifier identity plus geometry validation.
- Never expose dispatch or GitHub tokens in responses or logs.
- Use test-first red/green cycles for every behavior change.

---

### Task 1: Los Angeles release schedule

**Files:**
- Create: `src/lib/wend-schedule.ts`
- Create: `scripts/wend-schedule.mjs`
- Create: `tests/wend-schedule.test.mjs`
- Modify: `src/lib/wend-status.ts`
- Modify: `scripts/monitor-production.mjs`
- Modify: `.github/workflows/publish-wend-daily.yml`
- Modify: `.github/workflows/monitor-production.yml`

**Interfaces:**
- Produces: `expectedWendDate(now)`, `nextWendRelease(now)`, `wendDateLabel(date)` in TypeScript and Node ESM.
- Consumers: pages, production monitor, dispatch route, publish script.

- [x] Write DST boundary tests for July PDT at 07:00 UTC and January PST at 08:00 UTC.
- [x] Run `node tests/wend-schedule.test.mjs` and confirm the missing modules/functions fail.
- [x] Implement the minimal Los Angeles date and next-midnight functions.
- [x] Delegate `src/lib/wend-status.ts` and monitor date calculation to the new helpers.
- [x] Change GitHub fallback schedules to off-peak retry minutes in both 07:00 and 08:00 UTC windows.
- [x] Run schedule, freshness, publish, and monitoring tests until green.

### Task 2: Status and dispatch APIs

**Files:**
- Create: `src/lib/wend-dispatch.ts`
- Create: `src/app/api/wend-status/route.ts`
- Create: `src/app/api/ops/wend-dispatch/route.ts`
- Create: `tests/wend-ops-routes.test.mjs`
- Modify: `tests/seo-routes.test.mjs`

**Interfaces:**
- Produces: `authorizeBearer(header, secret)` and `buildRepositoryDispatch(...)` pure helpers.
- Produces: `GET /api/wend-status` and authenticated `GET|POST /api/ops/wend-dispatch`.

- [x] Write route/helper tests for 401, missing configuration, dispatch payload, current status, and pending status.
- [x] Run `node tests/wend-ops-routes.test.mjs` and confirm failure because routes/helpers do not exist.
- [x] Implement pure dispatch helpers and thin Next.js route handlers.
- [x] Set both endpoints to `force-dynamic`; set the status response to `Cache-Control: no-store`.
- [x] Run route, SEO-route, and typecheck tests until green.

### Task 3: Source quorum, manual input, and provenance

**Files:**
- Create: `scripts/wend-source-verification.mjs`
- Create: `tests/wend-source-verification.test.mjs`
- Modify: `scripts/publish-wend-daily.mjs`
- Modify: `scripts/validate-wend-puzzle.mjs`
- Modify: `.github/workflows/publish-wend-daily.yml`
- Modify: `src/lib/puzzles.ts`

**Interfaces:**
- Produces: secondary source parsing, normalized word comparison, SHA-256 source hashing, and publication metadata.
- Consumes: `WEND_DAILY_INPUT_JSON`, `WEND_VERIFIED_BY`, `WEND_DAILY_SECONDARY_SOURCE_URL`.

- [x] Write tests for trusted manual JSON, matching public-source quorum, mismatch rejection, stale secondary date, and stable source hashes.
- [x] Run the new source test and confirm the missing module fails.
- [x] Implement source normalization and quorum helpers.
- [x] Make inline/manual JSON the highest-priority source, followed by file, configured URL, and public fallback.
- [x] Require secondary agreement for automatic HTML sources before setting `isVerified: true`.
- [x] Store `publication` provenance with real `capturedAt`, `verifiedAt`, verifier, method, source URLs, and hash.
- [x] Extend the `WendPuzzle` type with optional publication metadata so old records remain valid.
- [x] Run validator, publish, source, and typecheck tests until green.

### Task 4: Production visibility gate and recovery

**Files:**
- Create: `scripts/wait-for-wend-production.mjs`
- Create: `tests/wend-production-gate.test.mjs`
- Modify: `package.json`
- Modify: `.github/workflows/publish-wend-daily.yml`
- Modify: `.github/workflows/monitor-production.yml`
- Modify: `scripts/monitor-production.mjs`
- Modify: `tests/ops-monitoring.test.mjs`

**Interfaces:**
- Produces: `npm run wait:wend-production`.
- Consumes: `WEND_PUBLIC_BASE_URL`, `WEND_PRODUCTION_WAIT_MS`, latest local puzzle.

- [x] Write tests asserting the gate polls status, rejects mismatched date/number, and times out with a useful error.
- [x] Run the gate test and confirm it fails because the script is missing.
- [x] Implement the poller with dependency-injected fetch/sleep functions for real behavior tests.
- [x] Place the gate before production smoke and IndexNow; remove the optional skip behavior.
- [x] Add monitoring of `/api/wend-status`.
- [x] Add success steps that close open monitoring/publish failure issues with a recovery comment.
- [x] Run gate, monitoring, and publish tests until green.

### Task 5: Transparent pending UI and accurate sitemap

**Files:**
- Create: `src/components/WendFreshnessNotice.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/linkedin-wend-answer-today/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/wend-freshness.test.mjs`
- Modify: `tests/seo-metadata.test.mjs`

**Interfaces:**
- Consumes: `expectedWendDisplay`, current readiness, and latest verified puzzle.
- Produces: explicit pending/fallback copy and content-derived sitemap timestamps.

- [x] Rewrite freshness tests to require pending copy, expected date/number, “latest verified” labeling, and midnight PT copy.
- [x] Run freshness/metadata tests and confirm they fail against the current hidden fallback behavior.
- [x] Implement the notice and use `displayWend` consistently in badges and answer modules.
- [x] Use expected current metadata only with status wording while pending; omit Article JSON-LD until current verified data exists.
- [x] Tie dynamic sitemap timestamps to `todayWend.updatedAt` and omit artificial `new Date()` values from unchanged static pages.
- [x] Run freshness, metadata, route, and typecheck tests until green.

### Task 6: Documentation and full verification

**Files:**
- Modify: `docs/DAILY_UPDATE_RUNBOOK.md`
- Modify: `docs/MONITORING_RUNBOOK.md`
- Modify: `docs/CHANGELOG.md`
- Modify: `docs/WEND_COMPETITOR_SEO_RESEARCH_2026-07-10.md`
- Add to commit: `docs/WEND_KEYWORD_USER_RESEARCH_2026-07-10.md`

**Interfaces:**
- Documents required Vercel/GitHub environment variables, external scheduler calls, manual official JSON flow, source quorum, status codes, recovery, and SLO checks.

- [x] Update runbooks with exact secrets and 07:00/08:00 trigger windows.
- [x] Add curl examples for status, dispatch, and manual GitHub workflow input.
- [x] Record P0/P1 implementation and remaining P2 non-goals in the competitor report and changelog.
- [x] Run every `test:*` script, `npm run typecheck`, and `npm run build`.
- [x] Start the production build locally, run `npm run smoke:local`, and inspect pending/current behavior with browser automation.
- [x] Inspect `git diff --check`, staged diff, and secrets before committing.
- [x] Stage only P0/P1 code, tests, and documentation; leave `prd-export.txt` and tool artifacts untracked.
- [x] Commit with a Conventional Commit message and push `codex/wend-freshness-fix` to `origin`.
