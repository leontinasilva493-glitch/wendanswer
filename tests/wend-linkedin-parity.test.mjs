import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const latest = JSON.parse(read("data/puzzles/wend/2026-06-25.json"));

assert.equal(latest.grid.length, 6, "LinkedIn Wend screenshot uses a 6-row board");
assert.equal(latest.grid.every((row) => row.length === 6), true, "LinkedIn Wend screenshot uses a 6-column board");
assert.deepEqual(latest.grid[0], ["Y", "O", "T", "S", "P", "I"], "top row should match the LinkedIn screenshot");
assert.deepEqual(latest.grid[1], ["C", "U", null, null, null, "R"], "second row should include the top wall");
assert.deepEqual(latest.grid[2], ["T", "A", "U", "A", null, "A"], "third row should include the top wall drop");
assert.deepEqual(latest.grid[3], ["I", null, "Q", "N", "T", "L"], "fourth row should include the lower wall stem");
assert.deepEqual(latest.grid[4], ["O", null, null, null, "I", "T"], "fifth row should include the lower wall");
assert.deepEqual(latest.grid[5], ["N", "R", "A", "C", "K", "Y"], "bottom row should match the LinkedIn screenshot");

const gridSource = read("src/components/WendGrid.tsx");
assert.match(gridSource, /gridTemplateColumns/, "WendGrid should support variable LinkedIn board sizes");
assert.match(gridSource, /isBlockedCell/, "WendGrid should render blocked gray cells");
assert.match(gridSource, /border-\[#444/, "WendGrid should use dark wall borders like LinkedIn");
assert.doesNotMatch(gridSource, /grid-cols-5/, "WendGrid must not hard-code a 5-column board");

console.log("wend linkedin parity test passed");
