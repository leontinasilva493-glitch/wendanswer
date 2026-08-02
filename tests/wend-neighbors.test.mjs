import assert from "node:assert/strict";
import { getPuzzleNeighbors } from "../src/lib/wend-neighbors.ts";

const puzzles = [
  { puzzleNumber: 3, label: "latest" },
  { puzzleNumber: 2, label: "middle" },
  { puzzleNumber: 1, label: "oldest" },
];

assert.deepEqual(getPuzzleNeighbors(puzzles, 2), {
  previous: puzzles[2],
  next: puzzles[0],
});
assert.deepEqual(getPuzzleNeighbors(puzzles, 3), {
  previous: puzzles[1],
  next: undefined,
});
assert.deepEqual(getPuzzleNeighbors(puzzles, 1), {
  previous: undefined,
  next: puzzles[1],
});
assert.deepEqual(
  getPuzzleNeighbors(puzzles, 999),
  { previous: undefined, next: undefined },
  "an unknown puzzle number must not inherit the first puzzle as its previous neighbor",
);

console.log("wend neighbor boundary test passed");
