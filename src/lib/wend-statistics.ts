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

export type WendArchiveStatistics = {
  averageAnswersPerPuzzle: number;
  averageBlockedCells: number;
  averageOpenCells: number;
  averageTurnsPerPuzzle: number;
  difficulties: Array<{ count: number; label: string }>;
  firstPuzzleNumber: number;
  gridSizes: Array<{ count: number; label: string }>;
  latestPuzzleNumber: number;
  longestAnswer: { dateLabel: string; length: number; puzzleNumber: number; word: string };
  monthlyCoverage: Array<{ count: number; key: string; label: string }>;
  mostWindingPuzzle: { dateLabel: string; puzzleNumber: number; turns: number };
  totalAnswers: number;
  verifiedPuzzleCount: number;
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

function roundedAverage(total: number, count: number) {
  return count === 0 ? 0 : Number((total / count).toFixed(1));
}

function monthLabel(key: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC", year: "numeric" }).format(
    new Date(`${key}-01T00:00:00Z`),
  );
}

export function aggregateWendStatistics(puzzles: WendPuzzle[]): WendArchiveStatistics {
  const metrics = puzzles.map((puzzle) => ({ metrics: deriveWendMetrics(puzzle), puzzle }));
  const puzzleNumbers = puzzles.map((puzzle) => puzzle.puzzleNumber);
  const gridCounts = new Map<string, number>();
  const difficultyCounts = new Map<string, number>();
  const monthCounts = new Map<string, number>();
  let longestAnswer = { dateLabel: "", length: 0, puzzleNumber: 0, word: "" };
  let mostWindingPuzzle = { dateLabel: "", puzzleNumber: 0, turns: 0 };

  for (const item of metrics) {
    const gridSize = `${item.metrics.rows}×${item.metrics.columns}`;
    const monthKey = item.puzzle.date.slice(0, 7);
    gridCounts.set(gridSize, (gridCounts.get(gridSize) ?? 0) + 1);
    difficultyCounts.set(item.puzzle.difficulty, (difficultyCounts.get(item.puzzle.difficulty) ?? 0) + 1);
    monthCounts.set(monthKey, (monthCounts.get(monthKey) ?? 0) + 1);

    for (const answer of item.puzzle.answers) {
      if (answer.word.length > longestAnswer.length) {
        longestAnswer = {
          dateLabel: item.puzzle.dateLabel,
          length: answer.word.length,
          puzzleNumber: item.puzzle.puzzleNumber,
          word: answer.word,
        };
      }
    }

    if (item.metrics.totalTurns > mostWindingPuzzle.turns) {
      mostWindingPuzzle = {
        dateLabel: item.puzzle.dateLabel,
        puzzleNumber: item.puzzle.puzzleNumber,
        turns: item.metrics.totalTurns,
      };
    }
  }

  const verifiedPuzzleCount = puzzles.length;
  const totalAnswers = metrics.reduce((sum, item) => sum + item.metrics.answerCount, 0);

  return {
    averageAnswersPerPuzzle: roundedAverage(totalAnswers, verifiedPuzzleCount),
    averageBlockedCells: roundedAverage(metrics.reduce((sum, item) => sum + item.metrics.blockedCells, 0), verifiedPuzzleCount),
    averageOpenCells: roundedAverage(metrics.reduce((sum, item) => sum + item.metrics.openCells, 0), verifiedPuzzleCount),
    averageTurnsPerPuzzle: roundedAverage(metrics.reduce((sum, item) => sum + item.metrics.totalTurns, 0), verifiedPuzzleCount),
    difficulties: [...difficultyCounts.entries()]
      .map(([label, count]) => ({ count, label }))
      .sort((left, right) => left.label.localeCompare(right.label)),
    firstPuzzleNumber: puzzleNumbers.length > 0 ? Math.min(...puzzleNumbers) : 0,
    gridSizes: [...gridCounts.entries()]
      .map(([label, count]) => ({ count, label }))
      .sort((left, right) => Number(left.label.split("×")[0]) - Number(right.label.split("×")[0])),
    latestPuzzleNumber: puzzleNumbers.length > 0 ? Math.max(...puzzleNumbers) : 0,
    longestAnswer,
    monthlyCoverage: [...monthCounts.entries()]
      .map(([key, count]) => ({ count, key, label: monthLabel(key) }))
      .sort((left, right) => right.key.localeCompare(left.key)),
    mostWindingPuzzle,
    totalAnswers,
    verifiedPuzzleCount,
  };
}
