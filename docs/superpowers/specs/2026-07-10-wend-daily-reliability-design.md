# Wend Daily Reliability P0/P1 Design

## Context

Wend releases at midnight in `America/Los_Angeles`. The current application assumes a fixed 08:00 UTC release, relies on GitHub scheduled workflows that run far less frequently than configured, and can promote a self-consistent competitor page to `isVerified: true` without source provenance. Recent production history showed a median delay of 215 minutes even though the importer runs in about two seconds and Vercel normally deploys within a minute.

The user approved implementing the P0 and P1 recommendations from the 2026-07-10 reliability audit.

## Approaches Considered

### A. Harden the existing Git/Vercel pipeline — selected

Keep dated JSON in Git and Vercel Git deployments, but replace fixed UTC logic, add an independently callable dispatch endpoint, require source verification, expose machine-readable freshness, and wait for production visibility before declaring success.

Benefits: smallest safe change, preserves archive generation and current hosting, can reach a sub-10-minute target without a new database. Drawback: GitHub and Vercel remain in the critical path.

### B. Move daily state to a database or KV store

Write a verified puzzle record to durable storage and invalidate the current page without a Git build. This is the best long-term architecture, but it introduces a new data service, migration, secrets, rollback model, and operational ownership. It remains P2 and is explicitly excluded from this implementation.

### C. Manual-only publishing

Require a human to edit and push the JSON every day. Accuracy can be high, but availability depends entirely on an operator. This remains an emergency path, not the only production path.

## Scope

### P0

1. Calculate the expected Wend date and next release from `America/Los_Angeles`, including daylight-saving transitions.
2. Replace fixed 08:00 UTC copy and workflow assumptions.
3. Add a secured, independently callable API route that dispatches the existing GitHub publish workflow.
4. Add a public, no-store status endpoint for external one-minute monitoring.
5. Wait until the production status endpoint reports the expected date and puzzle number before smoke tests and IndexNow.
6. Show a visible verification-pending state and clearly label the latest verified fallback.
7. Record real capture and verification timestamps instead of a fabricated 08:01 UTC value.
8. Close stale monitoring/publish issues after recovery.
9. Keep sitemap `lastModified` values tied to real content updates.

### P1

1. Accept trusted normalized JSON through the existing authenticated GitHub workflow dispatch surface.
2. Store optional publication provenance on new puzzle records: state, source type, source URLs, source hash, capture time, verification time, verification method, and verifier.
3. For automatic public HTML ingestion, require a second public source to agree on date, puzzle number, and answer words before publishing.
4. Keep geometry validation mandatory after source verification.
5. Preserve `WEND_DAILY_INPUT_FILE` as an emergency manual path.
6. Extend production monitoring to validate the machine-readable status response.

## Architecture

```text
External scheduler
  -> GET /api/ops/wend-dispatch (Bearer CRON_SECRET)
  -> GitHub repository_dispatch
  -> publish-wend-daily workflow
  -> trusted JSON OR primary HTML + secondary word-list quorum
  -> geometry validator
  -> provenance-enriched dated JSON
  -> git push
  -> Vercel deployment
  -> /api/wend-status reports production_verified
  -> production smoke
  -> IndexNow
```

GitHub schedule remains a fallback. The external scheduler must call both the 07:00 and 08:00 UTC windows year-round; the handler uses Los Angeles local date, making duplicate or pre-release calls idempotent across daylight-saving changes.

## Components

### `src/lib/wend-schedule.ts`

Pure functions for Los Angeles date calculation, next release calculation, and date labels. The frontend status logic delegates to this module.

### `scripts/wend-schedule.mjs`

Node-compatible equivalent used by CI scripts. It has the same DST fixtures as the TypeScript module.

### `/api/ops/wend-dispatch`

Server-only route. Requires `Authorization: Bearer CRON_SECRET`, `GITHUB_DISPATCH_TOKEN`, and `WEND_GITHUB_REPOSITORY`. It sends `publish-wend-daily` with the Los Angeles expected date. Tokens are never returned or logged.

### `/api/wend-status`

Public no-store JSON endpoint. Returns HTTP 200 only when the latest verified data matches the Los Angeles expected date; otherwise returns 503 with `pending` and the expected/latest puzzle metadata.

### Source verification

Manual normalized JSON is trusted only when it still passes geometry validation and a verifier identity is present. Automatic HTML ingestion must match a secondary source word list. A hash of the normalized source and timestamps are stored in the puzzle record.

### Production gate

`scripts/wait-for-wend-production.mjs` polls `/api/wend-status` until it sees the exact expected date and puzzle number. A workflow cannot proceed to smoke tests or IndexNow before this gate passes.

## Error Handling

- Unauthorized dispatch returns 401.
- Missing server configuration returns 503 without revealing which secret value is present.
- GitHub API failures return a sanitized 502.
- Primary source unavailable, secondary source unavailable, or quorum mismatch fails closed and sends the existing operations alert.
- Manual input without a verifier fails validation.
- Pending production status is explicit to users and monitoring; the latest verified puzzle remains available only with an archive label.
- Repeated triggers are safe: unchanged data produces no new commit.

## Security and Compliance

- No LinkedIn credentials or cookies are introduced.
- The official/manual normalized input path is preferred.
- Public competitor sources are cross-check signals, not sufficient individually.
- Secrets remain server-side and are documented by name only.
- Arbitrary source URLs are not accepted by the public dispatch route.

## Testing

- Unit fixtures cover PDT, PST, and both DST boundary dates.
- Route helper tests cover authorization and GitHub request construction.
- Source tests cover manual verification, matching quorum, mismatch, stale date, and provenance hashing.
- Freshness page tests require pending copy and prohibit a stale board from being presented as today's answer.
- Monitoring tests require status endpoint validation and recovery issue closure.
- Full typecheck, build, existing Node tests, local smoke, and browser checks run before commit.

## Success Criteria

- No fixed `WEND_RELEASE_HOUR_UTC = 8` remains.
- A July 07:00 UTC boundary and a January 08:00 UTC boundary both select the correct Wend date.
- A publish job cannot reach IndexNow until production reports the expected puzzle.
- Automatic HTML data cannot publish without a matching secondary source.
- New data records include real timestamps and source provenance.
- During a gap, users see “being verified” and the fallback is labeled “latest verified,” not “today.”
- External monitoring can alert from `/api/wend-status` independently of GitHub Actions.

## Non-goals

- Migrating daily data to a database/KV store.
- Automatically scraping LinkedIn with a logged-in account.
- Building a full operator dashboard.
- Consolidating the two current answer URLs; that SEO migration remains a separate change.

