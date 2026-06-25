import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

assert.equal(exists("scripts/publish-wend-daily.mjs"), true, "daily publish automation script should exist");
assert.equal(
  exists(".github/workflows/publish-wend-daily.yml"),
  true,
  "daily publish GitHub Actions workflow should exist",
);

const scriptSource = read("scripts/publish-wend-daily.mjs");
for (const expected of [
  "WEND_DAILY_SOURCE_URL",
  "WEND_DEPLOY_COMMAND",
  "MAX_PUBLISH_WINDOW_MS",
  "isVerified",
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

const packageJson = JSON.parse(read("package.json"));
assert.equal(
  packageJson.scripts["publish:wend"],
  "node scripts/publish-wend-daily.mjs",
  "package.json should expose npm run publish:wend",
);

const workflowSource = read(".github/workflows/publish-wend-daily.yml");
assert.match(workflowSource, /0 8 \* \* \*/, "workflow should run at 8:00 UTC daily");
assert.match(workflowSource, /npm run publish:wend/, "workflow should run the Wend publish command");
assert.match(workflowSource, /workflow_dispatch/, "workflow should support manual publishing");

console.log("wend publish automation test passed");
