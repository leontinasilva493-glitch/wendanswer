import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

assert.equal(exists("scripts/publish-wend-daily.mjs"), true, "daily publish automation script should exist");
assert.equal(exists("scripts/validate-wend-puzzle.mjs"), true, "daily publish should use a dedicated Wend validator");
assert.equal(
  exists(".github/workflows/publish-wend-daily.yml"),
  true,
  "daily publish GitHub Actions workflow should exist",
);

const scriptSource = read("scripts/publish-wend-daily.mjs");
for (const expected of [
  "WEND_DAILY_SOURCE_URL",
  "WEND_DAILY_FALLBACK_SOURCE_URL",
  "WEND_DAILY_INPUT_JSON",
  "WEND_DAILY_INPUT_FILE",
  "WEND_DAILY_SECONDARY_SOURCE_URL",
  "WEND_VERIFIED_BY",
  "WEND_DEPLOY_COMMAND",
  "WEND_PERSIST_TO_GIT",
  "sendOpsAlert",
  "MAX_PUBLISH_WINDOW_MS",
  "validateWendPuzzle",
  "generate-wend-puzzles.mjs",
  "extractPuzzleFromHtml",
  "prepareTrustedPuzzle",
  "preparePublicPuzzle",
  "parseSecondaryAnswerData",
  "logPublishContext",
  "Primary Wend puzzle extracted",
  "Secondary Wend source matched",
  "data-row",
  "data-word-index",
]) {
  assert.match(scriptSource, new RegExp(expected), `publish script should include ${expected}`);
}
assert.ok(
  scriptSource.indexOf("if (inlineInput)") < scriptSource.indexOf("if (inputFile)"),
  "trusted inline JSON should take priority over the emergency input file",
);
assert.ok(
  scriptSource.indexOf("if (inputFile)") < scriptSource.indexOf("fetch(sourceUrl"),
  "the emergency input file should take priority over automatic public sources",
);
assert.doesNotMatch(scriptSource, /T08:01:00Z/, "publish script must not fabricate an 08:01 UTC update timestamp");
assert.match(
  scriptSource,
  /midnight in America\/Los_Angeles/,
  "publish script should document the daylight-saving-aware Wend release time",
);
assert.doesNotMatch(
  scriptSource,
  /tests\/latest-date\.test\.mjs/,
  "publish script should not call the hard-coded MVP latest-date test during future daily publishing",
);
assert.match(
  scriptSource,
  /verifyLatestDate/,
  "publish script should verify the generated latest date against the published puzzle date",
);
assert.match(
  scriptSource,
  /persistToGit/,
  "publish script should be able to commit and push generated daily data",
);
assert.match(
  scriptSource,
  /wendanswertoday\.me/,
  "publish script should have a public HTML fallback source when no secret source is configured",
);
assert.match(
  scriptSource,
  /notifyFailure/,
  "publish script should send a failure alert",
);

const packageJson = JSON.parse(read("package.json"));
assert.equal(
  packageJson.scripts["publish:wend"],
  "node scripts/publish-wend-daily.mjs",
  "package.json should expose npm run publish:wend",
);
assert.equal(
  packageJson.scripts["wait:wend-production"],
  "node scripts/wait-for-wend-production.mjs",
  "package.json should expose the production visibility gate",
);

const workflowSource = read(".github/workflows/publish-wend-daily.yml");
assert.match(workflowSource, /7,22,37,52 7 \* \* \*/, "workflow should retry during the daylight-saving publish window");
assert.match(workflowSource, /7,22,37,52 8 \* \* \*/, "workflow should retry during the standard-time publish window");
assert.match(workflowSource, /contents:\s*write/, "workflow should be able to push generated JSON back to the repository");
assert.match(workflowSource, /issues:\s*write/, "workflow should be able to open a failure issue when daily publishing breaks");
assert.match(workflowSource, /concurrency:/, "workflow should serialize overlapping retry runs");
assert.match(workflowSource, /npm run publish:wend/, "workflow should run the Wend publish command");
assert.match(workflowSource, /WEND_PERSIST_TO_GIT:\s*"true"/, "workflow should persist generated daily JSON back to git");
assert.match(workflowSource, /WEND_DAILY_FALLBACK_SOURCE_URL/, "workflow should allow overriding the public fallback source URL");
assert.match(workflowSource, /WEND_ALERT_WEBHOOK_URL/, "workflow should pass the alert webhook secret to the publish script");
assert.match(workflowSource, /OPS_ALERT_WEBHOOK_URL/, "workflow should pass the shared ops webhook secret to the publish script");
assert.match(workflowSource, /OPS_ALERT_TELEGRAM_BOT_TOKEN/, "workflow should pass Telegram alert secrets to the publish script");
assert.match(workflowSource, /actions\/github-script/, "workflow should create a visible GitHub issue on publish failure");
assert.match(workflowSource, /wend-publish/, "workflow failure issues should use a stable Wend publish label");
assert.match(workflowSource, /createLabel/, "workflow should create missing failure labels before opening an issue");
assert.match(workflowSource, /workflow_dispatch/, "workflow should support manual publishing");
assert.match(workflowSource, /repository_dispatch/, "workflow should support external cron dispatching");
assert.match(workflowSource, /expected_date/, "manual and external dispatch should be able to set the expected Wend date");
assert.match(workflowSource, /source_url/, "manual and external dispatch should be able to set a one-off source URL");
assert.match(workflowSource, /puzzle_json/, "manual workflow runs should accept trusted normalized JSON");
assert.match(workflowSource, /WEND_VERIFIED_BY:\s*\$\{\{ github\.actor \}\}/, "trusted JSON should record the authenticated workflow actor");
assert.match(workflowSource, /WEND_DAILY_SECONDARY_SOURCE_URL/, "automatic publishing should use an independently configured secondary source");
assert.match(workflowSource, /npm run wait:wend-production/, "workflow should wait until the verified puzzle is visible in production");
assert.doesNotMatch(workflowSource, /skipping production smoke/i, "production smoke must never silently skip");
assert.ok(
  workflowSource.indexOf("npm run wait:wend-production") < workflowSource.indexOf("npm run smoke:local") &&
    workflowSource.indexOf("npm run smoke:local") < workflowSource.indexOf("npm run indexnow:submit"),
  "production visibility must gate smoke and IndexNow in that order",
);
assert.match(workflowSource, /Close recovered publish issues/, "successful publishing should close stale failure issues");
assert.match(workflowSource, /state:\s*"closed"/, "publish recovery should close issues after commenting");
assert.match(workflowSource, /npm run indexnow:submit/, "workflow should notify IndexNow after publishing and smoke checks");

console.log("wend publish automation test passed");
