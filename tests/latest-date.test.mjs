import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
execFileSync(process.execPath, ["scripts/generate-wend-puzzles.mjs"], { cwd: root, encoding: "utf8" });

const output = execFileSync(
  process.execPath,
  ["scripts/latest-date.mjs", "data/puzzles/wend", "--json"],
  { cwd: root, encoding: "utf8" },
);

const result = JSON.parse(output);
const generatedSource = fs.readFileSync(path.join(root, "src/lib/generated/wend-puzzles.ts"), "utf8");
const puzzleSource = fs.readFileSync(path.join(root, "src/lib/puzzles.ts"), "utf8");

assert.equal(result.latestDate, "2026-06-26");
assert.equal(result.latestFile, path.normalize("data/puzzles/wend/2026-06-26.json"));
assert.equal(result.count, 5);
assert.match(generatedSource, /2026-06-26\.json/, "generated Wend index should import the latest JSON first");
assert.match(generatedSource, /generatedWendPuzzles/, "generated Wend index should export generatedWendPuzzles");
assert.doesNotMatch(
  puzzleSource,
  /data\/puzzles\/wend\/\d{4}-\d{2}-\d{2}\.json/,
  "src/lib/puzzles.ts should not hard-code a dated Wend JSON import",
);

console.log("latest-date test passed");
