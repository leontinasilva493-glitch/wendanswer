# Monitoring Runbook

This runbook covers the P0 monitoring requirements for WendAnswerToday.org.

## What Is Monitored

GitHub Actions runs `.github/workflows/monitor-production.yml` at off-peak minutes `2,17,32,47` and through manual dispatch. This is a 15-minute fallback, not a one-minute SLO mechanism; scheduled Actions can be delayed or dropped.

The monitor runs:

```text
npm run monitor:production
```

It checks:

- `/api/wend-status` returns HTTP `200`, `status: current`, and the exact expected Los Angeles date and puzzle number.
- Production uptime for `/`, `/linkedin-wend-answer-today`, `/linkedin-wend-archive`, and the latest Wend archive detail page.
- Core pages do not send `x-robots-tag: noindex`.
- Core pages do not render a `robots` meta tag containing `noindex`.
- `/robots.txt` allows crawling and points to the production sitemap. The monitor treats bot-specific `Disallow: /` groups as expected managed blocks and only flags a true global crawl block.
- `/sitemap.xml` includes the homepage, Today page, Archive page, and latest archive detail page.
- The homepage Hero uses the expected Wend date and puzzle number.
- The Today page shows the expected Wend date and puzzle number after midnight Pacific Time (07:00 UTC in PDT, 08:00 UTC in PST).
- The latest legacy archive URL returns a real production `308` redirect to the canonical archive URL.

## Alert Channels

Configure at least one alert channel in GitHub repository secrets:

```text
OPS_ALERT_WEBHOOK_URL
```

Use this for a Discord-compatible webhook.

Optional Telegram alternative:

```text
OPS_ALERT_TELEGRAM_BOT_TOKEN
OPS_ALERT_TELEGRAM_CHAT_ID
```

`WEND_ALERT_WEBHOOK_URL` is still supported for backward compatibility with the daily publish workflow, but new setup should use `OPS_ALERT_WEBHOOK_URL`.

If no external alert secret is configured, failed monitor runs still create a GitHub issue labeled:

```text
automation, monitoring, p0
```

When a later run succeeds, the workflow comments with the recovery run URL and closes all open `automation, monitoring` issues. The daily publish workflow does the same for `automation, wend-publish` issues after production visibility, smoke, and IndexNow have all passed.

## Public Freshness Endpoint

Poll this endpoint from an external uptime service every minute around both UTC reset windows:

```bash
curl -i https://wendanswertoday.org/api/wend-status
```

Contract:

- HTTP `200`, `status: "current"`: `latestVerified` matches the current `America/Los_Angeles` date.
- HTTP `503`, `status: "pending"`: the response includes both `expected` and `latestVerified`; alert if this persists past the five-minute SLO.
- `Cache-Control: no-store`: monitors should never accept a cached freshness result.

The endpoint is intentionally public and contains no credentials. The separate `/api/ops/wend-dispatch` route is protected by `Authorization: Bearer CRON_SECRET` and must never be used as the public health check.

## Daily Publish Failure Alerts

`.github/workflows/publish-wend-daily.yml` passes the same ops alert secrets into `scripts/publish-wend-daily.mjs`.

When daily publishing fails, the script sends:

- Expected Wend date.
- Elapsed publish time.
- Error message.

The workflow also creates an `automation, wend-publish` GitHub issue if ingestion, source quorum, geometry validation, production visibility, smoke, or IndexNow fails.

## Production Indexability Checks

The monitor is the automated production check for:

- No accidental noindex on core pages.
- No `Disallow: /` in robots.
- Sitemap coverage for core Wend pages.
- Production legacy URL redirect behavior.

Manual verification is still required in Google Search Console after deployment:

1. Inspect `https://wendanswertoday.org/`.
2. Inspect `https://wendanswertoday.org/linkedin-wend-answer-today`.
3. Inspect `https://wendanswertoday.org/linkedin-wend-archive`.
4. Inspect the latest `/wend-answer-puzzle-{number}-{date}` page.
5. Confirm each page is allowed to be indexed and can be crawled.

## Analytics And Cookie Notice

The project uses three analytics layers loaded through `src/components/Analytics.tsx`:

- Google Tag Manager with the default container `GTM-5C5M7XPH`, intended for GA4 and future tag governance.
- Microsoft Clarity with the default project `xff0m0uvmc`, intended for interaction-quality and layout-friction review.
- Plausible for lightweight aggregate analytics and reveal funnel events.

Google Tag Manager can be disabled with:

```text
NEXT_PUBLIC_GTM_DISABLED=true
```

The GTM container can be changed without code by setting:

```text
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Microsoft Clarity can be disabled with:

```text
NEXT_PUBLIC_CLARITY_DISABLED=true
```

The Clarity project can be changed without code by setting:

```text
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```

Plausible can be disabled with:

```text
NEXT_PUBLIC_PLAUSIBLE_DISABLED=true
```

Current funnel events:

- `Wend Reveal`: Today and archive answer reveal actions.
- `Wend Solver Reveal`: Solver reveal actions.

Each event includes `action`, `pageType`, `puzzleNumber`, and `word` properties.

The privacy policy has been updated to describe aggregate page usage, reveal button click analytics, Google Tag Manager, Google Analytics, Microsoft Clarity, and analytics cookies.

If ad pixels, session replay, remarketing, or consent-gated tracking is added later, update:

- `privacy-policy`.
- `terms`.
- `disclaimer` if needed.
- A visible Cookie Notice or consent flow.

Do not merge new tracking code until the legal pages and notice match the new collection behavior.
