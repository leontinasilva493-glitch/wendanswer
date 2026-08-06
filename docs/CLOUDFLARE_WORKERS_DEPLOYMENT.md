# Cloudflare Workers Deployment Runbook

This runbook migrates WendAnswerToday from a Vercel origin to a Next.js Worker built directly from GitHub. Do not remove the Vercel rollback path until the Cloudflare production domain has remained healthy for 24 hours.

## Target Architecture

```text
GitHub Actions publishes verified Wend data to main
  -> Cloudflare Workers Builds detects the commit
  -> OpenNext builds .open-next/worker.js and .open-next/assets
  -> Worker wendanswer serves the application
  -> R2 bucket wendanswer-next-cache stores ISR data
  -> Durable Object NEXT_CACHE_DO_QUEUE coordinates time-based revalidation
```

The `name` in `wrangler.jsonc` and the `WORKER_SELF_REFERENCE.service` value must both remain `wendanswer`.

## Repository Verification

Run on Linux, WSL, or Cloudflare CI:

```bash
npm ci
npm run test:cloudflare-opennext
npm run typecheck
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --dry-run
```

Required artifacts:

- `.open-next/worker.js`
- `.open-next/assets/`

Record the dry-run compressed upload size. A successful local Next.js build is not proof that Cloudflare accepted or deployed the Worker.

The 2026-08-06 WSL verification produced the required artifacts and reported `1330.39 KiB` gzip in Wrangler's dry-run, below the current Workers Free compressed-script limit of `3 MB`. Recheck this value after dependency or route changes.

## One-Time Cloudflare Setup

1. Create R2 bucket `wendanswer-next-cache` in the same Cloudflare account as Worker `wendanswer`.
2. Connect repository `leontinasilva493-glitch/wendanswer` to Worker `wendanswer`.
3. Set production branch to `main` and leave root directory empty.
4. Set build command to `npx opennextjs-cloudflare build`.
5. Set deploy command to `npx opennextjs-cloudflare deploy`.
6. Set non-production deploy command to `npx opennextjs-cloudflare upload`.

Build-time public variables belong in **Settings -> Build -> Variables and secrets**:

- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_GTM_DISABLED`
- `NEXT_PUBLIC_CLARITY_ID`
- `NEXT_PUBLIC_CLARITY_DISABLED`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC`
- `NEXT_PUBLIC_PLAUSIBLE_DISABLED`

Runtime values belong in **Settings -> Variables & Secrets**:

- Secret: `CRON_SECRET`
- Secret: `GITHUB_DISPATCH_TOKEN`
- Variable: `WEND_GITHUB_REPOSITORY=leontinasilva493-glitch/wendanswer`

Never commit or paste secret values into issues, pull requests, chat, screenshots, `.env` files, or `.dev.vars.example`.

## workers.dev Release Gate

Before binding the production domain, verify the exact Git commit on the Worker preview domain:

- `/`
- `/sitemap.xml`
- `/api/wend-status`
- `/linkedin-wend-archive`
- `/linkedin-wend-statistics`
- the latest `/wend-answer-puzzle-*` route
- `/linkedin-wend-answer-today` returns a permanent redirect to `/`

Pass criteria:

- expected pages return `200`
- status JSON reports `current: true`
- the legacy Today URL redirects permanently
- canonical URLs use `https://wendanswertoday.org`
- no response contains `x-vercel-id`
- the deployed Worker version corresponds to the expected Git commit

## Custom-Domain Cutover

The Cloudflare zone must be **Active**, not Pending or Invalid nameservers. Prefer the existing Cloudflare account that owns `hope.ns.cloudflare.com` and `joel.ns.cloudflare.com`. If the zone is moved to another account, preserve mail and site-verification records and complete the registrar nameserver change before adding the Worker custom domain.

After the `workers.dev` gate passes:

1. Open Worker `wendanswer` -> **Settings -> Domains & Routes**.
2. Add custom domain `wendanswertoday.org`.
3. Let Cloudflare create the Worker DNS record and TLS certificate; do not add Cloudflare anycast A/AAAA addresses manually.
4. Configure `www.wendanswertoday.org` as a separate permanent redirect to `https://wendanswertoday.org/`.
5. Verify HTTP-to-HTTPS, root, sitemap, status API, canonical URLs, redirects, and absence of Vercel response headers.

## Rollback and Vercel Removal

If production checks fail, detach the Worker custom domain and restore the last known-good origin/DNS configuration. Keep the Vercel project and its domain settings unchanged during the first 24 hours of Cloudflare production traffic.

Only after 24 stable hours should the Vercel domains and Git integration be removed. `WEND_DEPLOY_COMMAND` may remain empty because a commit to `main` triggers Workers Builds; keep `WEND_PUBLIC_BASE_URL=https://wendanswertoday.org`.
