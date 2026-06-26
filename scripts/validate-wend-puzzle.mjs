const requiredFields = [
  "game",
  "puzzleNumber",
  "date",
  "dateLabel",
  "updatedAt",
  "difficulty",
  "grid",
  "hints",
  "answers",
  "explanation",
  "quickHint",
  "fastTip",
  "commonMistake",
  "difficultyNote",
  "relatedGames",
  "isVerified",
];

function assertCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function sameCell(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function isAdjacent(a, b) {
  const rowDelta = Math.abs(a[0] - b[0]);
  const colDelta = Math.abs(a[1] - b[1]);
  return rowDelta + colDelta === 1;
}

function assertCellInGrid(grid, cell, label) {
  assertCondition(Array.isArray(cell) && cell.length === 2, `${label} must be a [row, col] coordinate`);
  const [row, col] = cell;
  assertCondition(Number.isInteger(row) && Number.isInteger(col), `${label} must use integer coordinates`);
  assertCondition(row >= 0 && row < grid.length, `${label} row ${row} is outside the grid`);
  assertCondition(col >= 0 && col < grid[row].length, `${label} column ${col} is outside the grid`);
  assertCondition(grid[row][col] !== null, `${label} points to a blocked cell`);
}

export function validateWendPuzzle(puzzle, { allowUnverified = false, expectedDate } = {}) {
  for (const field of requiredFields) {
    assertCondition(field in puzzle, `Missing required Wend field: ${field}`);
  }

  assertCondition(puzzle.game === "wend", "Expected puzzle.game to be wend");
  assertCondition(!expectedDate || puzzle.date === expectedDate, `Expected Wend date ${expectedDate}, got ${puzzle.date}`);
  assertCondition(puzzle.isVerified || allowUnverified, "Refusing to publish unverified Wend data");
  assertCondition(Array.isArray(puzzle.grid) && puzzle.grid.length > 0, "Expected a non-empty grid");
  assertCondition(Array.isArray(puzzle.answers) && puzzle.answers.length > 0, "Expected at least one answer");
  const openCellCount = puzzle.grid.reduce((count, row) => count + row.filter((letter) => letter !== null).length, 0);
  const usedCells = new Set();

  const width = puzzle.grid[0].length;
  assertCondition(width > 0, "Expected a non-empty first grid row");
  puzzle.grid.forEach((row, rowIndex) => {
    assertCondition(Array.isArray(row), `Grid row ${rowIndex + 1} must be an array`);
    assertCondition(row.length === width, "Grid rows must all have the same width");
    row.forEach((letter, colIndex) => {
      assertCondition(letter === null || (typeof letter === "string" && letter.length > 0), `Grid r${rowIndex + 1}c${colIndex + 1} must contain a letter or null blocked cell`);
    });
  });

  for (const answer of puzzle.answers) {
    assertCondition(typeof answer.word === "string" && answer.word.length > 0, "Each answer needs a non-empty word");
    assertCondition(Array.isArray(answer.path) && answer.path.length === answer.word.length, `${answer.word} path length must match word length`);

    answer.path.forEach((cell, index) => {
      assertCellInGrid(puzzle.grid, cell, `${answer.word} step ${index + 1}`);
      const usedKey = `${cell[0]}-${cell[1]}`;
      assertCondition(!usedCells.has(usedKey), `${answer.word} uses r${cell[0] + 1}c${cell[1] + 1} more than once`);
      usedCells.add(usedKey);
      if (index > 0) {
        const previous = answer.path[index - 1];
        assertCondition(isAdjacent(previous, cell), `${answer.word} step ${index + 1} is not orthogonally adjacent to step ${index}`);
      }
    });

    const spelled = answer.path.map(([row, col]) => puzzle.grid[row][col]).join("");
    assertCondition(spelled.toUpperCase() === answer.word.toUpperCase(), `${answer.word} path spells ${spelled}, expected ${answer.word}`);
  }

  assertCondition(usedCells.size === openCellCount, `Solution uses ${usedCells.size} open cells and does not use every open cell (${openCellCount})`);
}
