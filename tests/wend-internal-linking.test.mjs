import assert from "node:assert/strict";
import {
  archiveMonthAnchor,
  groupArchivePuzzlesByMonth,
} from "../src/lib/wend-archive.ts";
import { selectRelatedWendPuzzles } from "../src/lib/wend-related.ts";

function turnPath(turns) {
  if (turns === 0) return [[0, 0], [0, 1], [0, 2], [0, 3]];
  if (turns === 1) return [[0, 0], [0, 1], [1, 1], [2, 1]];
  if (turns === 2) return [[0, 0], [0, 1], [1, 1], [1, 2]];
  return [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]];
}

function puzzle(puzzleNumber, date, dateLabel, difficulty, rows, columns, turns) {
  return {
    game: "wend",
    puzzleNumber,
    date,
    dateLabel,
    difficulty,
    grid: Array.from({ length: rows }, () => Array.from({ length: columns }, () => "A")),
    answers: [{ word: `WORD${puzzleNumber}`, path: turnPath(turns) }],
    quickHint: "",
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

const current = puzzle(10, "2026-07-10", "July 10, 2026", "Medium", 5, 5, 2);
const candidates = [
  current,
  puzzle(12, "2026-07-12", "July 12, 2026", "Hard", 4, 4, 3),
  puzzle(7, "2026-07-07", "July 7, 2026", "Medium", 5, 5, 1),
  puzzle(11, "2026-07-11", "July 11, 2026", "Hard", 5, 5, 2),
  puzzle(8, "2026-07-08", "July 8, 2026", "Medium", 4, 4, 2),
  puzzle(9, "2026-07-09", "July 9, 2026", "Medium", 5, 5, 1),
];

const related = selectRelatedWendPuzzles(current, candidates, 4);
assert.deepEqual(
  related.map((item) => item.puzzle.puzzleNumber),
  [9, 7, 11, 8],
  "related answers should prioritize grid size, then difficulty, turn similarity, and chronological distance",
);
assert.equal(new Set(related.map((item) => item.puzzle.puzzleNumber)).size, 4, "related answers should not repeat");
assert.equal(related.some((item) => item.puzzle.puzzleNumber === current.puzzleNumber), false, "the current answer should not recommend itself");
assert.match(related[0].reason, /Same 5×5 grid/);
assert.match(related[0].reason, /Medium difficulty/);
assert.match(related[0].reason, /1-turn difference/);
assert.match(related[3].reason, /Same Medium difficulty/);
assert.match(related[3].reason, /Same path-turn count/);
assert.deepEqual(selectRelatedWendPuzzles(current, candidates, 0), [], "a zero limit should return no recommendations");

console.log("wend related-answer ranking test passed");

const grouped = groupArchivePuzzlesByMonth([
  puzzle(1, "2026-06-09", "June 9, 2026", "Medium", 5, 5, 0),
  puzzle(24, "2026-07-02", "July 2, 2026", "Medium", 5, 5, 0),
  puzzle(2, "2026-06-10", "June 10, 2026", "Medium", 5, 5, 0),
  puzzle(23, "2026-07-01", "July 1, 2026", "Medium", 5, 5, 0),
]);

assert.deepEqual(
  grouped.map((group) => ({
    anchor: group.anchor,
    key: group.key,
    label: group.label,
    puzzleNumbers: group.puzzles.map((item) => item.puzzleNumber),
  })),
  [
    { anchor: "july-2026", key: "2026-07", label: "July 2026", puzzleNumbers: [24, 23] },
    { anchor: "june-2026", key: "2026-06", label: "June 2026", puzzleNumbers: [2, 1] },
  ],
  "archive groups should expose stable month anchors and newest-first puzzles",
);
assert.equal(archiveMonthAnchor("2026-07"), "july-2026");

console.log("wend archive month grouping test passed");
