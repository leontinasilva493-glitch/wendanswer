import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { validateWendPuzzle } from "../scripts/validate-wend-puzzle.mjs";
import { sourceHash } from "../scripts/wend-source-verification.mjs";

const root = process.cwd();
const puzzleDir = path.join(root, "data", "puzzles", "wend");
const files = fs
  .readdirSync(puzzleDir)
  .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
  .sort();
const puzzles = files.map((file) => ({
  file,
  puzzle: JSON.parse(fs.readFileSync(path.join(puzzleDir, file), "utf8")),
}));

const expectedBackfills = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 37, 39, 40, 41, 43, 46]);
const errors = [];
const numbers = new Set();
const dates = new Set();

function expectedDateLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`));
}

for (const { file, puzzle } of puzzles) {
  if (file !== `${puzzle.date}.json`) errors.push(`${file}: filename must match puzzle.date ${puzzle.date}`);
  if (numbers.has(puzzle.puzzleNumber)) errors.push(`${file}: duplicate puzzle number ${puzzle.puzzleNumber}`);
  if (dates.has(puzzle.date)) errors.push(`${file}: duplicate date ${puzzle.date}`);
  numbers.add(puzzle.puzzleNumber);
  dates.add(puzzle.date);

  if (puzzle.dateLabel !== expectedDateLabel(puzzle.date)) {
    errors.push(`${file}: dateLabel ${puzzle.dateLabel} does not match ${puzzle.date}`);
  }
  if (expectedBackfills.has(puzzle.puzzleNumber) && !puzzle.isVerified) {
    errors.push(`${file}: backfilled puzzle must be verified before publication`);
  }

  try {
    validateWendPuzzle(puzzle, { allowUnverified: !puzzle.isVerified, expectedDate: puzzle.date });
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }

  if (puzzle.publication) {
    if (puzzle.publication.sourceHash !== sourceHash(puzzle)) {
      errors.push(`${file}: publication.sourceHash does not match normalized puzzle data`);
    }
  } else if (expectedBackfills.has(puzzle.puzzleNumber)) {
    errors.push(`${file}: backfilled puzzle requires publication provenance`);
  }
}

const verifiedNumbers = new Set(puzzles.filter(({ puzzle }) => puzzle.isVerified).map(({ puzzle }) => puzzle.puzzleNumber));
const latestNumber = Math.max(...verifiedNumbers);
const missingNumbers = Array.from({ length: latestNumber }, (_, index) => index + 1).filter((number) => !verifiedNumbers.has(number));
if (missingNumbers.length > 0) errors.push(`missing puzzle numbers: ${missingNumbers.join(", ")}`);

assert.deepEqual(errors, [], `Wend dataset validation failed:\n- ${errors.join("\n- ")}`);
console.log(`wend dataset validation passed for ${puzzles.length} puzzles (#1-#${latestNumber})`);
