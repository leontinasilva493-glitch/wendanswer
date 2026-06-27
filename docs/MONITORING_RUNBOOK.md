# Monitoring Runbook

This runbook covers the P0 monitoring requirements for WendAnswerToday.org.

## What Is Monitored

GitHub Actions runs `.github/workflows/monitor-production.yml` every five minutes and through manual dispatch.

The monitor runs:

```text
npm run monitor:production
```

It checks:

- Production uptime for `/`, `/linkedin-wend-answer-today`, `/linkedin-wend-archive`, and the latest Wend archive detail page.
- Core pages do not send `x-robots-tag: noindex`.
- Core pages do not render a `robots` meta tag containing `noindex`.
- `/robots.txt` allows crawling and points to the production sitemap.
- `/sitemap.xml` includes the homepage, Today page, Archive page, and latest archive detail page.
- The homepage Hero uses the expected Wend date and puzzle number.
- The Today page shows the expected Wend date and puzzle number after the 8:00 UTC reset.
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

## Daily Publish Failure Alerts

`.github/workflows/publish-wend-daily.yml` passes the same ops alert secrets into `scripts/publish-wend-daily.mjs`.

When daily publishing fails, the script sends:

- Expected Wend date.
- Elapsed publish time.
- Error message.

The workflow also creates a `automation, wend-publish` GitHub issue if the run fails.

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

The project currently does not install first-party analytics or third-party error tracking packages.

If analytics, ad pixels, session replay, or tracking cookies are added later, update:

- `privacy-policy`.
- `terms`.
- `disclaimer` if needed.
- A visible Cookie Notice or consent flow.

Do not merge analytics code until the legal pages and notice match the new collection behavior.
