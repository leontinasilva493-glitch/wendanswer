import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  archiveCoverage,
  archiveGridSize,
  archiveMonthKey,
  defaultArchiveFilters,
  filterArchivePuzzles,
} from "../src/lib/wend-archive.ts";

function puzzle(puzzleNumber, date, dateLabel, difficulty, rows, columns, words) {
  return {
    game: "wend",
    puzzleNumber,
    date,
    dateLabel,
    difficulty,
    grid: Array.from({ length: rows }, () => Array.from({ length: columns }, () => "A")),
    answers: words.map((word) => ({ word, path: [] })),
    quickHint: `${words[0]} starts near an edge.`,
    hints: [],
    explanation: "",
    fastTip: "",
    commonMistake: "",
    difficultyNote: "",
    relatedGames: [],
    isVerified: true,
    updatedAt: `${date}T00:00:00Z`,
  };
}

const puzzles = [
  puzzle(3, "2026-06-11", "June 11, 2026", "Hard", 4, 5, ["TRUTH"]),
  puzzle(2, "2026-06-10", "June 10, 2026", "Easy", 3, 3, ["IVY", "HIGH"]),
  puzzle(1, "2026-06-09", "June 9, 2026", "Medium", 5, 5, ["WIN"]),
];

assert.equal(archiveMonthKey(puzzles[0]), "2026-06");
assert.equal(archiveGridSize(puzzles[1]), "3×3");
assert.deepEqual(defaultArchiveFilters, { difficulty: "all", gridSize: "all", month: "all", query: "" });

assert.deepEqual(filterArchivePuzzles(puzzles, { ...defaultArchiveFilters, query: "#2" }).map((item) => item.puzzleNumber), [2]);
assert.deepEqual(filterArchivePuzzles(puzzles, { ...defaultArchiveFilters, query: "june 9" }).map((item) => item.puzzleNumber), [1]);
assert.deepEqual(filterArchivePuzzles(puzzles, { ...defaultArchiveFilters, query: "truth" }).map((item) => item.puzzleNumber), [3]);
assert.deepEqual(filterArchivePuzzles(puzzles, { ...defaultArchiveFilters, difficulty: "Easy" }).map((item) => item.puzzleNumber), [2]);
assert.deepEqual(filterArchivePuzzles(puzzles, { ...defaultArchiveFilters, gridSize: "5×5" }).map((item) => item.puzzleNumber), [1]);
assert.deepEqual(
  filterArchivePuzzles(puzzles, { difficulty: "Hard", gridSize: "4×5", month: "2026-06", query: "truth" }).map((item) => item.puzzleNumber),
  [3],
);
assert.equal(filterArchivePuzzles(puzzles, { ...defaultArchiveFilters, month: "2026-07" }).length, 0);

assert.deepEqual(archiveCoverage([puzzles[0], puzzles[2]]), {
  firstPuzzleNumber: 1,
  latestPuzzleNumber: 3,
  missingPuzzleNumbers: [2],
  verifiedCount: 2,
});

console.log("wend archive filter test passed");

const root = process.cwd();
const listSource = fs.readFileSync(path.join(root, "src", "components", "ArchiveList.tsx"), "utf8");
const archivePageSource = fs.readFileSync(path.join(root, "src", "app", "linkedin-wend-archive", "page.tsx"), "utf8");
assert.match(listSource, /^"use client";/, "full archive filters should be a client-side enhancement");
assert.match(listSource, /filterArchivePuzzles/, "archive list should use the tested pure filter helper");
for (const label of ["Search by puzzle, date, or answer", "Month", "Difficulty", "Grid size", "Reset filters"]) {
  assert.match(listSource, new RegExp(label), `archive filters should include ${label}`);
}
assert.match(listSource, /filteredPuzzles\.length/, "archive should report the filtered result count");
assert.doesNotMatch(listSource, /useSearchParams|URLSearchParams|router\.push/, "archive filters should not create crawlable query combinations");
assert.match(archivePageSource, /archiveCoverage/, "archive page should calculate verified coverage");
assert.match(archivePageSource, /missingPuzzleNumbers/, "archive page should state whether coverage has gaps");

console.log("wend archive filter UI contract test passed");
