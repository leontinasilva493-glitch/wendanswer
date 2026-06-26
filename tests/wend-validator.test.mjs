import assert from "node:assert/strict";
import { validateWendPuzzle } from "../scripts/validate-wend-puzzle.mjs";

const validPuzzle = {
  game: "wend",
  puzzleNumber: 99,
  date: "2026-06-26",
  dateLabel: "June 26, 2026",
  updatedAt: "2026-06-26T08:02:00Z",
  difficulty: "Easy",
  grid: [
    ["C", "A", "T"],
    ["D", "O", "G"],
    ["R", "U", "N"],
  ],
  hints: [{ level: 1, title: "Gentle nudge", text: "Start in the top-left corner." }],
  answers: [
    { word: "CAT", path: [[0, 0], [0, 1], [0, 2]] },
    { word: "DOG", path: [[1, 0], [1, 1], [1, 2]] },
  ],
  explanation: "Rows spell the answer words.",
  quickHint: "Start with rows.",
  fastTip: "Check row words first.",
  commonMistake: "Do not skip a cell.",
  difficultyNote: "Easy row paths.",
  relatedGames: [],
  isVerified: true,
};

assert.doesNotThrow(() => validateWendPuzzle(validPuzzle, { expectedDate: "2026-06-26" }));

assert.throws(
  () =>
    validateWendPuzzle(
      {
        ...validPuzzle,
        answers: [{ word: "CAT", path: [[0, 0], [1, 1], [1, 2]] }],
      },
      { expectedDate: "2026-06-26" },
    ),
  /spells COG, expected CAT/,
);

assert.throws(
  () =>
    validateWendPuzzle(
      {
        ...validPuzzle,
        answers: [{ word: "CAT", path: [[0, 0], [0, 2], [0, 1]] }],
      },
      { expectedDate: "2026-06-26" },
    ),
  /is not adjacent/,
);

assert.throws(
  () => validateWendPuzzle({ ...validPuzzle, isVerified: false }, { expectedDate: "2026-06-26" }),
  /Refusing to publish unverified Wend data/,
);

assert.throws(
  () => validateWendPuzzle(validPuzzle, { expectedDate: "2026-06-27" }),
  /Expected Wend date 2026-06-27/,
);

console.log("wend validator test passed");
