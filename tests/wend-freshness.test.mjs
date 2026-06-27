import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

assert.equal(exists("src/lib/wend-status.ts"), true, "Wend freshness status helper should exist");
assert.equal(exists("src/components/WendVerificationNotice.tsx"), false, "verification pending UI should not exist");

const statusSource = read("src/lib/wend-status.ts");
assert.match(statusSource, /WEND_RELEASE_HOUR_UTC\s*=\s*8/, "status helper should use the 8:00 UTC Wend reset");
assert.match(statusSource, /expectedWendDate/, "status helper should expose expectedWendDate");
assert.match(statusSource, /expectedWendDisplay/, "status helper should expose dynamic homepage date and puzzle-number display data");
assert.match(statusSource, /wendDateLabel/, "status helper should format the dynamic Wend date label in UTC");
assert.match(statusSource, /isWendReadyForToday/, "status helper should expose isWendReadyForToday");
assert.match(statusSource, /puzzle\.isVerified/, "freshness should require verified puzzle data");

const forbiddenVisibleText = [
  /Verification pending/i,
  /being verified/i,
  /expected Wend date/i,
  /not showing an old or unverified answer/i,
  /answer is not published yet/i,
  /after verification/i,
  /passes verification/i,
  /fallbackShown/i,
  /WendVerificationNotice/i,
];

for (const page of ["src/app/page.tsx", "src/app/linkedin-wend-answer-today/page.tsx"]) {
  const source = read(page);
  assert.match(source, /revalidate\s*=\s*60/, `${page} should use 60-second ISR so freshness checks update without forcing every request dynamic`);
  assert.match(source, /isWendReadyForToday/, `${page} should check whether today's Wend data is verified and current`);
  assert.match(source, /lastVerifiedWend/, `${page} should keep a latest verified fallback puzzle`);
  assert.match(source, /displayWend/, `${page} should render a consistent game module from current or latest verified data`);
  assert.match(source, /<WendAnswerReveal archived=\{!wendReady\} puzzle=\{displayWend\}/, `${page} should show the latest verified game module without a pending notice`);
  for (const pattern of forbiddenVisibleText) {
    assert.doesNotMatch(source, pattern, `${page} should not render pending or verification copy: ${pattern}`);
  }
}

console.log("wend freshness test passed");
