import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
execFileSync(process.execPath, ["scripts/generate-wend-puzzles.mjs"], { cwd: root, encoding: "utf8" });

const puzzleDir = path.join(root, "data", "puzzles", "wend");
const latestName = fs
  .readdirSync(puzzleDir)
  .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
  .sort()
  .at(-1);
const latestDate = latestName.replace(/\.json$/, "");

const output = execFileSync(
  process.execPath,
  ["scripts/latest-date.mjs", "data/puzzles/wend", "--json"],
  { cwd: root, encoding: "utf8" },
);

const result = JSON.parse(output);
const generatedSource = fs.readFileSync(path.join(root, "src/lib/generated/wend-puzzles.ts"), "utf8");
const puzzleSource = fs.readFileSync(path.join(root, "src/lib/puzzles.ts"), "utf8");

assert.equal(result.latestDate, latestDate);
assert.equal(result.latestFile, path.normalize(`data/puzzles/wend/${latestName}`));
assert.equal(result.count, fs.readdirSync(puzzleDir).filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file)).length);
assert.match(generatedSource, new RegExp(`${latestDate}\\.json`), "generated Wend index should import the latest JSON first");
assert.match(generatedSource, /generatedWendPuzzles/, "generated Wend index should export generatedWendPuzzles");
assert.doesNotMatch(
  puzzleSource,
  /data\/puzzles\/wend\/\d{4}-\d{2}-\d{2}\.json/,
  "src/lib/puzzles.ts should not hard-code a dated Wend JSON import",
);

console.log("latest-date test passed");
