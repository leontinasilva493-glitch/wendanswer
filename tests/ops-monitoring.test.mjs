import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

assert.equal(exists("scripts/ops-alert.mjs"), true, "shared ops alert helper should exist");
assert.equal(exists("scripts/monitor-production.mjs"), true, "production monitor script should exist");
assert.equal(exists("scripts/robots-policy.mjs"), true, "production monitor should use a dedicated robots parser");
assert.equal(exists(".github/workflows/monitor-production.yml"), true, "production monitor workflow should exist");

const packageJson = JSON.parse(read("package.json"));
assert.equal(
  packageJson.scripts["monitor:production"],
  "node scripts/monitor-production.mjs",
  "package.json should expose npm run monitor:production",
);

const alertSource = read("scripts/ops-alert.mjs");
assert.match(alertSource, /OPS_ALERT_WEBHOOK_URL/, "ops alerts should support a Discord-compatible webhook");
assert.match(alertSource, /WEND_ALERT_WEBHOOK_URL/, "ops alerts should keep backward compatibility with Wend publish alerts");
assert.match(alertSource, /OPS_ALERT_TELEGRAM_BOT_TOKEN/, "ops alerts should support Telegram bot alerts");
assert.match(alertSource, /OPS_ALERT_TELEGRAM_CHAT_ID/, "ops alerts should support Telegram chat routing");

const monitorSource = read("scripts/monitor-production.mjs");
for (const expected of [
  "https://wendanswertoday.org",
  "MONITOR_BASE_URL",
  "MONITOR_CANONICAL_SITE_URL",
  "sendOpsAlert",
  "expectedWendDisplay",
  "Wend answer today for",
  "Puzzle #",
  "robots.txt",
  "sitemap.xml",
  "noindex",
  "x-robots-tag",
  "redirect: \"manual\"",
  "response.status !== 308",
  "/linkedin-wend-answer-today",
  "/linkedin-wend-archive",
]) {
  assert.match(monitorSource, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `monitor should check ${expected}`);
}

const monitorWorkflow = read(".github/workflows/monitor-production.yml");
assert.match(monitorWorkflow, /\*\/5 \* \* \* \*/, "production monitor should run every five minutes");
assert.match(monitorWorkflow, /npm run monitor:production/, "workflow should run the production monitor");
assert.match(monitorWorkflow, /OPS_ALERT_WEBHOOK_URL/, "workflow should pass the webhook alert secret");
assert.match(monitorWorkflow, /OPS_ALERT_TELEGRAM_BOT_TOKEN/, "workflow should pass Telegram bot secret");
assert.match(monitorWorkflow, /issues:\s*write/, "workflow should be able to open monitoring failure issues");
assert.match(monitorWorkflow, /automation[\s\S]*monitoring[\s\S]*p0/, "workflow should label monitoring failures as P0 automation issues");
assert.match(monitorWorkflow, /github-script/, "workflow should create a visible failure issue");

const publishWorkflow = read(".github/workflows/publish-wend-daily.yml");
assert.match(publishWorkflow, /OPS_ALERT_WEBHOOK_URL/, "daily publish workflow should use the shared ops webhook alert secret");
assert.match(publishWorkflow, /OPS_ALERT_TELEGRAM_BOT_TOKEN/, "daily publish workflow should support Telegram failure alerts");

const publishScript = read("scripts/publish-wend-daily.mjs");
assert.match(publishScript, /sendOpsAlert/, "daily publish script should use the shared ops alert helper");
assert.match(publishScript, /Wend publish failed/, "daily publish script should alert on publish failure");

const packageSource = read("package.json");
assert.equal(packageSource.includes("@vercel/analytics"), false, "analytics should not be enabled without a matching cookie notice plan");
assert.equal(packageSource.includes("@sentry/nextjs"), false, "Sentry should not be partially installed without configuration docs and secrets");

console.log("ops monitoring test passed");
