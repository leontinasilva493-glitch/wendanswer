import type { Cell, WendAnswer, WendPuzzle } from "./puzzles";

export type WendPuzzleMetrics = {
  answerCount: number;
  averageWordLength: number;
  blockedCells: number;
  columns: number;
  cornerStarts: number;
  edgeStarts: number;
  longestWord: string;
  maxWordLength: number;
  minWordLength: number;
  mostWindingAnswer: { turns: number; word: string };
  openCells: number;
  rows: number;
  totalTurns: number;
};

function direction(from: Cell, to: Cell) {
  return `${Math.sign(to[0] - from[0])},${Math.sign(to[1] - from[1])}`;
}

export function answerTurns(answer: WendAnswer) {
  let turns = 0;
  for (let index = 2; index < answer.path.length; index += 1) {
    if (direction(answer.path[index - 2], answer.path[index - 1]) !== direction(answer.path[index - 1], answer.path[index])) {
      turns += 1;
    }
  }
  return turns;
}

function isEdge([row, col]: Cell, rows: number, columns: number) {
  return row === 0 || col === 0 || row === rows - 1 || col === columns - 1;
}

function isCorner([row, col]: Cell, rows: number, columns: number) {
  return (row === 0 || row === rows - 1) && (col === 0 || col === columns - 1);
}

export function deriveWendMetrics(puzzle: WendPuzzle): WendPuzzleMetrics {
  const rows = puzzle.grid.length;
  const columns = puzzle.grid[0]?.length ?? 0;
  const openCells = puzzle.grid.reduce(
    (count, row) => count + row.filter((cell) => cell !== null).length,
    0,
  );
  const blockedCells = rows * columns - openCells;
  const lengths = puzzle.answers.map((answer) => answer.word.length);
  const turns = puzzle.answers.map((answer) => ({ turns: answerTurns(answer), word: answer.word }));
  const mostWindingAnswer = turns.reduce(
    (best, candidate) =>
      candidate.turns > best.turns ||
      (candidate.turns === best.turns && candidate.word.length > best.word.length)
        ? candidate
        : best,
    turns[0] ?? { turns: 0, word: "" },
  );
  const longestWord = puzzle.answers.reduce(
    (best, answer) => (answer.word.length > best.length ? answer.word : best),
    "",
  );

  return {
    answerCount: puzzle.answers.length,
    averageWordLength: lengths.reduce((sum, length) => sum + length, 0) / lengths.length,
    blockedCells,
    columns,
    cornerStarts: puzzle.answers.filter((answer) => isCorner(answer.path[0], rows, columns)).length,
    edgeStarts: puzzle.answers.filter((answer) => isEdge(answer.path[0], rows, columns)).length,
    longestWord,
    maxWordLength: Math.max(...lengths),
    minWordLength: Math.min(...lengths),
    mostWindingAnswer,
    openCells,
    rows,
    totalTurns: turns.reduce((sum, answer) => sum + answer.turns, 0),
  };
}

function countLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function wendPuzzleSummary(puzzle: WendPuzzle, metrics = deriveWendMetrics(puzzle)) {
  const windingNote = metrics.mostWindingAnswer.word
    ? `${metrics.mostWindingAnswer.word} is the most winding answer at ${countLabel(metrics.mostWindingAnswer.turns, "turn")}.`
    : "";
  return `Wend #${puzzle.puzzleNumber} uses a ${metrics.rows}×${metrics.columns} grid with ${countLabel(metrics.openCells, "open cell")} and ${countLabel(metrics.blockedCells, "blocked cell")}. Its ${countLabel(metrics.answerCount, "answer")} range from ${metrics.minWordLength} to ${metrics.maxWordLength} letters, and the verified paths make ${countLabel(metrics.totalTurns, "turn")} in total. ${metrics.longestWord} is the longest answer. ${windingNote}`.trim();
}

