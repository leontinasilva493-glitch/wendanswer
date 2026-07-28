import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  aggregateWendStatistics,
  deriveWendMetrics,
  wendPuzzleSummary,
} from "../src/lib/wend-statistics.ts";

const puzzle = {
  game: "wend",
  puzzleNumber: 2,
  date: "2026-06-10",
  dateLabel: "June 10, 2026",
  updatedAt: "2026-07-28T00:00:00Z",
  difficulty: "Medium",
  grid: [["C", "A", "T"], ["D", null, "S"], ["O", "G", "S"]],
  hints: [],
  answers: [
    { word: "CAT", path: [[0, 0], [0, 1], [0, 2]] },
    { word: "DOGSS", path: [[1, 0], [2, 0], [2, 1], [2, 2], [1, 2]] },
  ],
  explanation: "",
  quickHint: "",
  fastTip: "",
  commonMistake: "",
  difficultyNote: "",
  relatedGames: [],
  isVerified: true,
};

const metrics = deriveWendMetrics(puzzle);
assert.deepEqual(metrics, {
  answerCount: 2,
  averageWordLength: 4,
  blockedCells: 1,
  columns: 3,
  cornerStarts: 1,
  edgeStarts: 2,
  longestWord: "DOGSS",
  maxWordLength: 5,
  minWordLength: 3,
  mostWindingAnswer: { turns: 2, word: "DOGSS" },
  openCells: 8,
  rows: 3,
  totalTurns: 2,
});

const summary = wendPuzzleSummary(puzzle, metrics);
for (const phrase of ["Wend #2", "3×3 grid", "8 open cells", "1 blocked cell", "2 answers", "3 to 5 letters", "2 turns", "DOGSS"]) {
  assert.match(summary, new RegExp(phrase.replace("×", "×")), `summary should include ${phrase}`);
}

console.log("wend statistics metrics test passed");

const compactPuzzle = {
  ...puzzle,
  puzzleNumber: 3,
  date: "2026-07-01",
  dateLabel: "July 1, 2026",
  difficulty: "Hard",
  grid: [["A", "B"], ["C", "D"]],
  answers: [
    { word: "AB", path: [[0, 0], [0, 1]] },
    { word: "CD", path: [[1, 0], [1, 1]] },
  ],
};
const aggregate = aggregateWendStatistics([puzzle, compactPuzzle]);
assert.deepEqual(aggregate, {
  averageAnswersPerPuzzle: 2,
  averageBlockedCells: 0.5,
  averageOpenCells: 6,
  averageTurnsPerPuzzle: 1,
  difficulties: [
    { count: 1, label: "Hard" },
    { count: 1, label: "Medium" },
  ],
  firstPuzzleNumber: 2,
  gridSizes: [
    { count: 1, label: "2×2" },
    { count: 1, label: "3×3" },
  ],
  latestPuzzleNumber: 3,
  longestAnswer: { dateLabel: "June 10, 2026", length: 5, puzzleNumber: 2, word: "DOGSS" },
  monthlyCoverage: [
    { count: 1, key: "2026-07", label: "July 2026" },
    { count: 1, key: "2026-06", label: "June 2026" },
  ],
  mostWindingPuzzle: { dateLabel: "June 10, 2026", puzzleNumber: 2, turns: 2 },
  totalAnswers: 4,
  verifiedPuzzleCount: 2,
});

console.log("wend archive aggregate statistics test passed");

const root = process.cwd();
const detailSource = fs.readFileSync(path.join(root, "src", "app", "[slug]", "page.tsx"), "utf8");
assert.match(detailSource, /deriveWendMetrics/, "archive detail should derive facts from verified puzzle data");
assert.match(detailSource, /wendPuzzleSummary/, "archive detail should render a puzzle-specific summary");
assert.match(detailSource, /Wend #\{puzzle\.puzzleNumber\} puzzle facts/, "facts heading should include the puzzle number");
for (const metric of ["openCells", "blockedCells", "answerCount", "averageWordLength", "totalTurns", "mostWindingAnswer"]) {
  assert.match(detailSource, new RegExp(`metrics\\.${metric}`), `archive detail should render ${metric}`);
}

console.log("wend archive detail facts test passed");

const puzzleDir = path.join(root, "data", "puzzles", "wend");
const verifiedPuzzles = fs
  .readdirSync(puzzleDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(fs.readFileSync(path.join(puzzleDir, file), "utf8")))
  .filter((item) => item.isVerified);
const metricSignatures = verifiedPuzzles.map((item) => {
  const itemMetrics = deriveWendMetrics(item);
  return [
    itemMetrics.rows,
    itemMetrics.columns,
    itemMetrics.openCells,
    itemMetrics.blockedCells,
    itemMetrics.answerCount,
    itemMetrics.minWordLength,
    itemMetrics.maxWordLength,
    itemMetrics.totalTurns,
    itemMetrics.longestWord,
    itemMetrics.mostWindingAnswer.word,
  ].join("|");
});
assert.equal(new Set(metricSignatures).size, verifiedPuzzles.length, "each verified detail page should have a distinct puzzle-facts signature");

console.log(`wend puzzle facts are distinct across ${verifiedPuzzles.length} verified pages`);
