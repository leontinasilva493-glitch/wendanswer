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
  "WEND_DEPLOY_COMMAND",
  "WEND_PERSIST_TO_GIT",
  "sendOpsAlert",
  "MAX_PUBLISH_WINDOW_MS",
  "validateWendPuzzle",
  "generate-wend-puzzles.mjs",
  "extractPuzzleFromHtml",
  "data-row",
  "data-word-index",
]) {
  assert.match(scriptSource, new RegExp(expected), `publish script should include ${expected}`);
}
assert.match(
  scriptSource,
  /8:00 UTC/,
  "publish script should document the daily Wend release time",
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

const workflowSource = read(".github/workflows/publish-wend-daily.yml");
assert.match(workflowSource, /0,1,3,5 8 \* \* \*/, "workflow should retry during the 8:00-8:05 UTC publish window");
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

console.log("wend publish automation test passed");
