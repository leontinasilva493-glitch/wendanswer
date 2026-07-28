import type { WendPuzzle } from "./puzzles";

export type ArchiveFilters = {
  difficulty: string;
  gridSize: string;
  month: string;
  query: string;
};

export const defaultArchiveFilters: ArchiveFilters = {
  difficulty: "all",
  gridSize: "all",
  month: "all",
  query: "",
};

export function archiveMonthKey(puzzle: WendPuzzle) {
  return puzzle.date.slice(0, 7);
}

export function archiveMonthLabel(month: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${month}-01T00:00:00Z`));
}

export function archiveGridSize(puzzle: WendPuzzle) {
  return `${puzzle.grid.length}×${puzzle.grid[0]?.length ?? 0}`;
}

export function filterArchivePuzzles(puzzles: WendPuzzle[], filters: ArchiveFilters) {
  const query = filters.query.trim().toLowerCase();
  return puzzles.filter((puzzle) => {
    if (filters.month !== "all" && archiveMonthKey(puzzle) !== filters.month) return false;
    if (filters.difficulty !== "all" && puzzle.difficulty !== filters.difficulty) return false;
    if (filters.gridSize !== "all" && archiveGridSize(puzzle) !== filters.gridSize) return false;
    if (!query) return true;

    const haystack = [
      `#${puzzle.puzzleNumber}`,
      String(puzzle.puzzleNumber),
      puzzle.date,
      puzzle.dateLabel,
      puzzle.quickHint,
      ...puzzle.answers.map((answer) => answer.word),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

export function archiveCoverage(puzzles: WendPuzzle[]) {
  const numbers = puzzles.map((puzzle) => puzzle.puzzleNumber).sort((left, right) => left - right);
  const firstPuzzleNumber = numbers[0] ?? 0;
  const latestPuzzleNumber = numbers.at(-1) ?? 0;
  const available = new Set(numbers);
  const missingPuzzleNumbers = Array.from(
    { length: Math.max(0, latestPuzzleNumber - firstPuzzleNumber + 1) },
    (_, index) => firstPuzzleNumber + index,
  ).filter((number) => !available.has(number));

  return {
    firstPuzzleNumber,
    latestPuzzleNumber,
    missingPuzzleNumbers,
    verifiedCount: puzzles.length,
  };
}
