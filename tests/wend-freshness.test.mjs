import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

assert.equal(exists("src/lib/wend-status.ts"), true, "Wend freshness status helper should exist");
assert.equal(exists("src/components/WendFreshnessNotice.tsx"), true, "verification pending UI should exist");

const statusSource = read("src/lib/wend-status.ts");
assert.match(statusSource, /\.\/wend-schedule/, "status helper should use the America/Los_Angeles Wend schedule");
assert.match(statusSource, /expectedWendDate/, "status helper should expose expectedWendDate");
assert.match(statusSource, /expectedWendDisplay/, "status helper should expose dynamic homepage date and puzzle-number display data");
assert.match(statusSource, /wendDateLabel/, "status helper should format the dynamic Wend date label");
assert.match(statusSource, /isWendReadyForToday/, "status helper should expose isWendReadyForToday");
assert.match(statusSource, /puzzle\.isVerified/, "freshness should require verified puzzle data");

const noticeSource = read("src/components/WendFreshnessNotice.tsx");
assert.match(noticeSource, /Verification pending/i, "notice should state the current verification status");
assert.match(noticeSource, /being verified/i, "notice should explain that today's answer is still being verified");
assert.match(noticeSource, /Latest verified/i, "notice should label fallback data accurately");
assert.match(noticeSource, /expectedPuzzleNumber/, "notice should identify the expected puzzle number");
assert.match(noticeSource, /fallbackPuzzleNumber/, "notice should identify the fallback puzzle number");

for (const page of ["src/app/page.tsx", "src/app/linkedin-wend-answer-today/page.tsx"]) {
  const source = read(page);
  assert.match(source, /revalidate\s*=\s*60/, `${page} should use 60-second ISR so freshness checks update without forcing every request dynamic`);
  assert.match(source, /isWendReadyForToday/, `${page} should check whether today's Wend data is verified and current`);
  assert.match(source, /lastVerifiedWend/, `${page} should keep a latest verified fallback puzzle`);
  assert.match(source, /displayWend/, `${page} should render a consistent game module from current or latest verified data`);
  assert.match(source, /expectedWendDisplay/, `${page} should expose the expected date and puzzle number while pending`);
  assert.match(source, /<WendFreshnessNotice/, `${page} should render an explicit pending notice`);
  assert.match(source, /<WendAnswerReveal archived=\{!wendReady\} puzzle=\{displayWend\}/, `${page} should show the latest verified game module as archived fallback`);
}

const homeSource = read("src/app/page.tsx");
assert.match(homeSource, /being verified/i, "homepage metadata and hero should use status wording while pending");
assert.match(homeSource, /Latest Verified Answer/, "homepage pending CTA should not call the fallback today's answer");

const todaySource = read("src/app/linkedin-wend-answer-today/page.tsx");
assert.match(todaySource, /\{displayWend\.dateLabel\}/, "Today page badges should use the displayed verified puzzle");
assert.match(todaySource, /Puzzle #\{displayWend\.puzzleNumber\}/, "Today page badges should use the displayed verified puzzle number");
assert.doesNotMatch(todaySource, />\{todayWend\.dateLabel\}</, "Today page must not badge stale raw data as today's date");

const solverPage = read("src/app/linkedin-wend-solver/page.tsx");
assert.match(solverPage, /isWendReadyForToday/, "Solver page should check whether the displayed Wend puzzle is current");
assert.match(solverPage, /solverWend/, "Solver page should use an explicit verified fallback puzzle variable");
assert.match(solverPage, /Latest verified puzzle/, "Solver page should label fallback data as latest verified puzzle");
assert.match(solverPage, /<WendSolver puzzle=\{solverWend\}/, "Solver page should render the verified fallback puzzle");
assert.doesNotMatch(solverPage, /<WendSolver puzzle=\{todayWend\}/, "Solver page should not render raw todayWend directly");

console.log("wend freshness test passed");
