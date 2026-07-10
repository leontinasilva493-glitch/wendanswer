import assert from "node:assert/strict";
import {
  parseSecondaryAnswerData,
  preparePublicPuzzle,
  prepareTrustedPuzzle,
  sourceHash,
} from "../scripts/wend-source-verification.mjs";

const puzzle = {
  game: "wend",
  puzzleNumber: 32,
  date: "2026-07-10",
  dateLabel: "July 10, 2026",
  updatedAt: "old-value",
  answers: [{ word: "ZEBRA" }, { word: "FREEZE" }, { word: "PIZZERIA" }, { word: "ZOOKEEPER" }],
  isVerified: false,
};

const secondarySource = `/* Format example: { date: "YYYY-MM-DD", number: 8, words: ["EXAMPLE"] } */
window.WendAnswers = [
  {
    date: "2026-07-10",
    number: 32,
    words: ["ZOOKEEPER", "PIZZERIA", "FREEZE", "ZEBRA"],
  },
  { date: "2026-07-09", number: 31, words: ["OLD"] },
];`;

const secondary = parseSecondaryAnswerData(secondarySource, "2026-07-10");
assert.deepEqual(secondary, {
  date: "2026-07-10",
  puzzleNumber: 32,
  words: ["ZOOKEEPER", "PIZZERIA", "FREEZE", "ZEBRA"],
});
assert.throws(() => parseSecondaryAnswerData(secondarySource, "2026-07-11"), /2026-07-11/);

assert.throws(
  () => prepareTrustedPuzzle(puzzle, { capturedAt: "2026-07-10T10:42:08.123Z", verifiedBy: "" }),
  /verifier identity/i,
);

const trusted = prepareTrustedPuzzle(puzzle, {
  capturedAt: "2026-07-10T10:42:08.123Z",
  sourceUrl: "workflow-input",
  verifiedBy: "octocat",
});
assert.equal(trusted.isVerified, true);
assert.equal(trusted.updatedAt, "2026-07-10T10:42:08.123Z");
assert.equal(trusted.publication.sourceType, "trusted-json");
assert.equal(trusted.publication.verificationMethod, "trusted-workflow-input");
assert.equal(trusted.publication.verifiedBy, "octocat");

const publicPuzzle = preparePublicPuzzle(puzzle, secondary, {
  capturedAt: "2026-07-10T10:42:08.123Z",
  primarySourceUrl: "https://wendanswertoday.me/",
  secondarySourceUrl: "https://wendgames.org/src/answers-data.js",
});
assert.equal(publicPuzzle.isVerified, true);
assert.equal(publicPuzzle.publication.verificationMethod, "two-source-agreement");
assert.equal(publicPuzzle.publication.sourceUrls.length, 2);

assert.throws(
  () => preparePublicPuzzle(puzzle, { ...secondary, words: ["WRONG"] }, { capturedAt: "2026-07-10T10:42:08.123Z" }),
  /answer words do not match/i,
);
assert.throws(
  () => preparePublicPuzzle(puzzle, { ...secondary, puzzleNumber: 31 }, { capturedAt: "2026-07-10T10:42:08.123Z" }),
  /puzzle number/i,
);

assert.equal(
  sourceHash({ ...puzzle, answers: [...puzzle.answers].reverse() }),
  sourceHash(puzzle),
  "normalized source hashes should not depend on answer order",
);
assert.match(sourceHash(puzzle), /^[a-f0-9]{64}$/);

const puzzleWithPaths = {
  ...puzzle,
  grid: [["A", "B"]],
  answers: [{ word: "AB", path: [[0, 0], [0, 1]] }],
};
assert.notEqual(
  sourceHash(puzzleWithPaths),
  sourceHash({ ...puzzleWithPaths, answers: [{ word: "AB", path: [[0, 1], [0, 0]] }] }),
  "source hashes should cover answer geometry, not only answer words",
);

console.log("wend source verification test passed");
