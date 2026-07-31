export function getPuzzleNeighbors<T extends { puzzleNumber: number }>(puzzles: T[], puzzleNumber: number) {
  const index = puzzles.findIndex((puzzle) => puzzle.puzzleNumber === puzzleNumber);
  if (index === -1) return { previous: undefined, next: undefined };

  return {
    previous: puzzles[index + 1],
    next: puzzles[index - 1],
  };
}
