import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const source = read("src/app/wend-unlimited/page.tsx");
const toolSource = read("src/components/WendUnlimitedTool.tsx");

for (const removed of [
  "Full unlimited mode is paused",
  "MVP launch",
  "single unofficial practice puzzle",
  "Today's Answer",
  "Wend Solver",
]) {
  assert.doesNotMatch(source, new RegExp(removed), `/wend-unlimited should not expose ${removed}`);
}

assert.match(source, /title:\s*"Wend Unlimited - Play Wend Game Online"/, "Wend Unlimited should target the play intent in metadata");
assert.match(source, /wend unlimited[\s\S]*play wend unlimited[\s\S]*wend game online[\s\S]*linkedin wend game no login[\s\S]*wend practice puzzle/i, "metadata should include the target keyword set");
assert.doesNotMatch(source, /robots:\s*noindexFollow/, "Wend Unlimited should be indexable once it is a real tool page");
assert.match(source, /searchParams/, "Wend Unlimited should read the requested practice puzzle from query params");
assert.match(source, /wendPuzzles/, "Wend Unlimited should use the verified Wend puzzle list as its practice set");
assert.match(source, /Wend Unlimited/, "page H1 should use the target page name");
assert.match(source, /Play Wend Unlimited/, "page copy should include the play intent phrase");
assert.match(source, /WendUnlimitedTool/, "page should render the interactive unlimited tool");
assert.match(toolSource, /Previous/, "navigation should include Previous");
assert.match(toolSource, /Next/, "navigation should include Next");
assert.match(toolSource, /Difficulty/, "navigation should show difficulty metadata");
assert.match(toolSource, /Letters/, "navigation should show letter-count metadata");
assert.match(source, /\/wend-unlimited\?puzzle=/, "navigation links should keep users on /wend-unlimited with a puzzle query");
assert.match(source, /How to play Wend Unlimited/, "page should include How to play content below the playable tool");
assert.match(source, /Wend Unlimited FAQ/, "page should include FAQ content below the playable tool");
assert.match(source, /Official Wend vs Wend Unlimited/, "page should compare the official game with the practice tool");
assert.match(source, /\/linkedin-wend-answer-today/, "page should link to Today Answer");

assert.match(toolSource, /New puzzle/, "tool controls should include New puzzle");
assert.match(toolSource, /Hint/, "tool controls should include Hint");
assert.match(toolSource, /Undo/, "tool controls should include Undo");
assert.match(toolSource, /Solved/, "tool should expose a solved state");
assert.match(toolSource, /Share result/, "tool controls should include sharing");
assert.match(toolSource, /localStorage/, "tool should persist local progress");

console.log("wend unlimited navigation test passed");
