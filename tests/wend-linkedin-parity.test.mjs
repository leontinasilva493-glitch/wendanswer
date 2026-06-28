import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const june25 = JSON.parse(read("data/puzzles/wend/2026-06-25.json"));
const june26 = JSON.parse(read("data/puzzles/wend/2026-06-26.json"));
const latest = JSON.parse(read("data/puzzles/wend/2026-06-27.json"));

assert.equal(june25.grid.length, 6, "June 25 LinkedIn Wend screenshot uses a 6-row board");
assert.equal(june25.grid.every((row) => row.length === 6), true, "June 25 LinkedIn Wend screenshot uses a 6-column board");
assert.deepEqual(june25.grid[0], ["Y", "O", "T", "S", "P", "I"], "June 25 top row should match the LinkedIn screenshot");
assert.deepEqual(june25.grid[1], ["C", "U", null, null, null, "R"], "June 25 second row should include the top wall");
assert.deepEqual(june25.grid[2], ["T", "A", "U", "A", null, "A"], "June 25 third row should include the top wall drop");
assert.deepEqual(june25.grid[3], ["I", null, "Q", "N", "T", "L"], "June 25 fourth row should include the lower wall stem");
assert.deepEqual(june25.grid[4], ["O", null, null, null, "I", "T"], "June 25 fifth row should include the lower wall");
assert.deepEqual(june25.grid[5], ["N", "R", "A", "C", "K", "Y"], "June 25 bottom row should match the LinkedIn screenshot");
assert.deepEqual(june25.answers.map((answer) => answer.word), ["TOY", "RACK", "SPIRAL", "AUCTION", "QUANTITY"]);

assert.equal(june26.grid.length, 7, "June 26 LinkedIn Wend uses a 7-row board");
assert.equal(june26.grid.every((row) => row.length === 7), true, "June 26 LinkedIn Wend uses a 7-column board");
assert.deepEqual(june26.grid[0], [null, null, "A", "D", "D", null, null], "June 26 top row should match the official payload");
assert.deepEqual(june26.grid[6], [null, null, "P", "O", "S", null, null], "June 26 bottom row should match the official payload");
assert.deepEqual(june26.answers.map((answer) => answer.word), ["ADD", "PLUS", "EXTRA", "CREATE", "PREMIUM", "POSITIVE"]);

assert.equal(latest.grid.length, 8, "Latest LinkedIn Wend uses an 8-row board");
assert.equal(latest.grid.every((row) => row.length === 8), true, "Latest LinkedIn Wend uses an 8-column board");
assert.deepEqual(latest.grid[0], ["F", "D", "L", "O", "G", "A", "E", "S"], "June 27 top row should match the verified payload");
assert.deepEqual(latest.grid[7], ["L", "E", "M", "O", "D", "E", "B", "L"], "June 27 bottom row should match the verified payload");
assert.deepEqual(latest.answers.map((answer) => answer.word), ["CARDINAL", "GOLDFISH", "LEMONADE", "BROCCOLI", "SEAWATER", "LAVENDER"]);
assert.equal(latest.isVerified, true, "Latest Wend data should be verified before today pages reveal answers");

const gridSource = read("src/components/WendGrid.tsx");
const cssSource = read("src/app/globals.css");
assert.match(gridSource, /gridTemplateColumns/, "WendGrid should support variable LinkedIn board sizes");
assert.match(gridSource, /isBlockedCell/, "WendGrid should render blocked gray cells");
assert.match(gridSource, /border-\[#2f2f2f\]|border-\[#444/, "WendGrid should use dark wall borders like LinkedIn");
assert.match(gridSource, /wend-cell-tube/, "WendGrid should render colored path tubes for revealed words");
assert.match(gridSource, /wend-cell-start/, "WendGrid should render a circular start marker");
assert.match(gridSource, /wend-cell-check/, "WendGrid should render a solved-word check marker");
assert.match(cssSource, /\.wend-cell-arrow-right\s*\{[\s\S]*?right:\s*0;/, "right arrows should sit on the right cell boundary");
assert.match(cssSource, /\.wend-cell-arrow-left\s*\{[\s\S]*?left:\s*0;/, "left arrows should sit on the left cell boundary");
assert.match(cssSource, /\.wend-cell-arrow-down\s*\{[\s\S]*?bottom:\s*0;/, "down arrows should sit on the bottom cell boundary");
assert.match(cssSource, /\.wend-cell-arrow-up\s*\{[\s\S]*?top:\s*0;/, "up arrows should sit on the top cell boundary");
assert.match(cssSource, /\.wend-cell-arrow\s*\{[\s\S]*?z-\[3\]/, "arrows should render below letter text to avoid overlap");
assert.doesNotMatch(gridSource, /grid-cols-5/, "WendGrid must not hard-code a 5-column board");
assert.doesNotMatch(gridSource, /wendanswertoday\.org/, "WendGrid should not add a site watermark inside the game board");

console.log("wend linkedin parity test passed");
