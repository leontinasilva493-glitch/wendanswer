import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const output = execFileSync(
  process.execPath,
  ["scripts/latest-date.mjs", "data/puzzles/wend", "--json"],
  { cwd: root, encoding: "utf8" },
);

const result = JSON.parse(output);

assert.equal(result.latestDate, "2026-06-24");
assert.equal(result.latestFile, path.normalize("data/puzzles/wend/2026-06-24.json"));
assert.equal(result.count, 3);

console.log("latest-date test passed");
