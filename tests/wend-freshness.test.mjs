import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

assert.equal(exists("src/lib/wend-status.ts"), true, "Wend freshness status helper should exist");
assert.equal(exists("src/components/WendVerificationNotice.tsx"), true, "pending verification notice should exist");

const statusSource = read("src/lib/wend-status.ts");
assert.match(statusSource, /WEND_RELEASE_HOUR_UTC\s*=\s*8/, "status helper should use the 8:00 UTC Wend reset");
assert.match(statusSource, /expectedWendDate/, "status helper should expose expectedWendDate");
assert.match(statusSource, /isWendReadyForToday/, "status helper should expose isWendReadyForToday");
assert.match(statusSource, /puzzle\.isVerified/, "freshness should require verified puzzle data");

const noticeSource = read("src/components/WendVerificationNotice.tsx");
assert.match(noticeSource, /being verified/i, "pending notice should tell users today's Wend is being verified");
assert.match(noticeSource, /Last verified puzzle/i, "pending notice should show the last verified puzzle");

for (const page of ["src/app/page.tsx", "src/app/linkedin-wend-answer-today/page.tsx"]) {
  const source = read(page);
  assert.match(source, /revalidate\s*=\s*60/, `${page} should use 60-second ISR so freshness checks update without forcing every request dynamic`);
  assert.match(source, /isWendReadyForToday/, `${page} should check whether today's Wend data is verified and current`);
  assert.match(source, /WendVerificationNotice/, `${page} should show a pending verification notice when data is stale or unverified`);
  assert.match(source, /wendReady \?/, `${page} should gate answer reveals behind the readiness check`);
}

console.log("wend freshness test passed");
