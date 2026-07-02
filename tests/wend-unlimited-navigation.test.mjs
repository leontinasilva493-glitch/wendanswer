import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const source = read("src/app/wend-unlimited/page.tsx");

for (const removed of [
  "Full unlimited mode is paused",
  "MVP launch",
  "single unofficial practice puzzle",
  "Today's Answer",
  "Wend Solver",
]) {
  assert.doesNotMatch(source, new RegExp(removed), `/wend-unlimited should not expose ${removed}`);
}

assert.match(source, /searchParams/, "Wend Unlimited should read the requested practice puzzle from query params");
assert.match(source, /wendPuzzles/, "Wend Unlimited should use the verified Wend puzzle list as its practice set");
assert.match(source, /Practice Puzzle \{currentPuzzleNumber\} of \{practicePuzzles\.length\}/, "navigation should show current practice puzzle position");
assert.match(source, /Previous/, "navigation should include Previous");
assert.match(source, /Next/, "navigation should include Next");
assert.match(source, /Difficulty/, "navigation should show difficulty metadata");
assert.match(source, /Letters/, "navigation should show letter-count metadata");
assert.match(source, /\/wend-unlimited\?puzzle=/, "navigation links should keep users on /wend-unlimited with a puzzle query");
assert.match(source, /robots:\s*noindexFollow/, "Wend Unlimited should remain noindex");

console.log("wend unlimited navigation test passed");
