import type { WendPuzzle } from "./puzzles";

export type RelatedWendPuzzle = {
  puzzle: WendPuzzle;
  reason: string;
};

function turnDifferenceLabel(difference: number) {
  if (difference === 0) return "Same path-turn count";
  return `${difference}-turn difference`;
}

function gridSize(puzzle: WendPuzzle) {
  return `${puzzle.grid.length}×${puzzle.grid[0]?.length ?? 0}`;
}

function totalTurns(puzzle: WendPuzzle) {
  return puzzle.answers.reduce((puzzleTurns, answer) => {
    let answerTurns = 0;
    for (let index = 2; index < answer.path.length; index += 1) {
      const previous = answer.path[index - 2];
      const current = answer.path[index - 1];
      const next = answer.path[index];
      const incoming = `${Math.sign(current[0] - previous[0])},${Math.sign(current[1] - previous[1])}`;
      const outgoing = `${Math.sign(next[0] - current[0])},${Math.sign(next[1] - current[1])}`;
      if (incoming !== outgoing) answerTurns += 1;
    }
    return puzzleTurns + answerTurns;
  }, 0);
}

export function selectRelatedWendPuzzles(
  current: WendPuzzle,
  puzzles: WendPuzzle[],
  limit = 4,
): RelatedWendPuzzle[] {
  const currentGrid = gridSize(current);
  const currentTurns = totalTurns(current);

  return puzzles
    .filter((puzzle) => puzzle.puzzleNumber !== current.puzzleNumber)
    .map((puzzle) => {
      const candidateGrid = gridSize(puzzle);
      const candidateTurns = totalTurns(puzzle);
      const sameGrid = candidateGrid === currentGrid;
      const sameDifficulty = puzzle.difficulty === current.difficulty;
      const turnDifference = Math.abs(candidateTurns - currentTurns);
      const reasonParts = [
        sameGrid ? `Same ${candidateGrid} grid` : null,
        sameDifficulty ? `${sameGrid ? "" : "Same "}${puzzle.difficulty} difficulty` : null,
        turnDifferenceLabel(turnDifference),
      ].filter(Boolean);

      return {
        puzzle,
        reason: reasonParts.join(" · "),
        sameDifficulty,
        sameGrid,
        turnDifference,
      };
    })
    .sort((left, right) => {
      if (left.sameGrid !== right.sameGrid) return Number(right.sameGrid) - Number(left.sameGrid);
      if (left.sameDifficulty !== right.sameDifficulty) return Number(right.sameDifficulty) - Number(left.sameDifficulty);
      if (left.turnDifference !== right.turnDifference) return left.turnDifference - right.turnDifference;

      const leftDistance = Math.abs(left.puzzle.puzzleNumber - current.puzzleNumber);
      const rightDistance = Math.abs(right.puzzle.puzzleNumber - current.puzzleNumber);
      if (leftDistance !== rightDistance) return leftDistance - rightDistance;
      return right.puzzle.puzzleNumber - left.puzzle.puzzleNumber;
    })
    .slice(0, Math.max(0, Math.floor(limit)))
    .map(({ puzzle, reason }) => ({ puzzle, reason }));
}
