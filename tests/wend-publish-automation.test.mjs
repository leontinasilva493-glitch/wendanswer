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
  "WEND_DEPLOY_COMMAND",
  "WEND_PERSIST_TO_GIT",
  "WEND_ALERT_WEBHOOK_URL",
  "MAX_PUBLISH_WINDOW_MS",
  "validateWendPuzzle",
  "generate-wend-puzzles.mjs",
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
  /notifyFailure/,
  "publish script should send a single-channel failure alert",
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
assert.match(workflowSource, /concurrency:/, "workflow should serialize overlapping retry runs");
assert.match(workflowSource, /npm run publish:wend/, "workflow should run the Wend publish command");
assert.match(workflowSource, /WEND_PERSIST_TO_GIT:\s*"true"/, "workflow should persist generated daily JSON back to git");
assert.match(workflowSource, /WEND_ALERT_WEBHOOK_URL/, "workflow should pass the alert webhook secret to the publish script");
assert.match(workflowSource, /workflow_dispatch/, "workflow should support manual publishing");

console.log("wend publish automation test passed");
