import fs from "node:fs";
import path from "node:path";
import { validateWendPuzzle } from "./validate-wend-puzzle.mjs";

const root = process.cwd();
const outputFile = path.join(root, "data", "puzzles", "wend-unlimited", "puzzles.json");
const updatedAt = "2026-07-01T00:00:00Z";

const wordPools = {
  5: [
    "APPLE",
    "BEACH",
    "BREAD",
    "BRICK",
    "CHAIR",
    "CLOUD",
    "CORAL",
    "CRANE",
    "DREAM",
    "EAGLE",
    "FIELD",
    "FLAME",
    "FROST",
    "GIANT",
    "GRACE",
    "GRAPE",
    "HONEY",
    "HOUSE",
    "IVORY",
    "JELLY",
    "LASER",
    "LEMON",
    "LIGHT",
    "MAGIC",
    "MAPLE",
    "MARCH",
    "METAL",
    "MONEY",
    "MUSIC",
    "NERVE",
    "OASIS",
    "OCEAN",
    "OLIVE",
    "ORBIT",
    "PAPER",
    "PEARL",
    "PIANO",
    "PLANT",
    "QUILT",
    "RADIO",
    "RIVER",
    "ROBIN",
    "SHAPE",
    "SHELL",
    "SPARK",
    "STONE",
    "SUGAR",
    "TIGER",
    "UNITY",
    "WATER",
  ],
  6: [
    "ANCHOR",
    "BAKERY",
    "BASKET",
    "BREEZE",
    "BRIGHT",
    "BUTTON",
    "CAMERA",
    "CANDLE",
    "CASTLE",
    "CIRCLE",
    "COFFEE",
    "COPPER",
    "COTTON",
    "DANCER",
    "DESERT",
    "DRAGON",
    "FAMILY",
    "FLOWER",
    "FOREST",
    "GARDEN",
    "GENTLE",
    "GUITAR",
    "HARBOR",
    "ISLAND",
    "JACKET",
    "JUNGLE",
    "KETTLE",
    "LADDER",
    "LETTER",
    "MARKET",
    "MEADOW",
    "MIRROR",
    "MOMENT",
    "NATURE",
    "ORANGE",
    "PALACE",
    "PARADE",
    "PLANET",
    "POCKET",
    "RABBIT",
    "ROCKET",
    "SADDLE",
    "SILVER",
    "SPRING",
    "STUDIO",
    "SUMMER",
    "TENNIS",
    "TIMBER",
    "VELVET",
    "WINDOW",
  ],
  7: [
    "AIRPORT",
    "BALANCE",
    "BICYCLE",
    "BLANKET",
    "CABINET",
    "CAPTAIN",
    "CARAMEL",
    "CENTRAL",
    "CHICKEN",
    "CLASSIC",
    "COCONUT",
    "COMPASS",
    "COUNTRY",
    "CRYSTAL",
    "DIAMOND",
    "DOLPHIN",
    "ELEGANT",
    "FESTIVE",
    "FIREMAN",
    "FREEDOM",
    "GALLERY",
    "GLACIER",
    "HARVEST",
    "HARMONY",
    "HORIZON",
    "JOURNEY",
    "JUSTICE",
    "KITCHEN",
    "LIBRARY",
    "LULLABY",
    "MACHINE",
    "MEASURE",
    "MORNING",
    "MYSTERY",
    "ORCHARD",
    "PAINTER",
    "PASSAGE",
    "PIONEER",
    "POPULAR",
    "PRAIRIE",
    "RAINBOW",
    "SAILING",
    "SANDALS",
    "SEASIDE",
    "SILENCE",
    "SKYLINE",
    "STADIUM",
    "SUNRISE",
    "TEACHER",
    "THEATER",
    "THUNDER",
    "TROUBLE",
    "KINGDOM",
    "VANILLA",
    "VICTORY",
    "VILLAGE",
    "VINTAGE",
    "WEATHER",
    "WELCOME",
    "WHISPER",
  ],
};

const plans = [
  { boardSize: 6, wordLength: 5, answerCount: 5, count: 25, difficulty: "Easy" },
  { boardSize: 7, wordLength: 6, answerCount: 6, count: 25, difficulty: "Medium" },
  { boardSize: 8, wordLength: 7, answerCount: 7, count: 25, difficulty: "Hard" },
];

function createRng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function cellKey([row, col]) {
  return `${row}-${col}`;
}

function neighbors([row, col], size) {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ].filter(([nextRow, nextCol]) => nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size);
}

function hasTurn(pathCells) {
  for (let index = 2; index < pathCells.length; index += 1) {
    const [aRow, aCol] = pathCells[index - 2];
    const [bRow, bCol] = pathCells[index - 1];
    const [cRow, cCol] = pathCells[index];
    const firstDirection = [bRow - aRow, bCol - aCol].join(",");
    const secondDirection = [cRow - bRow, cCol - bCol].join(",");
    if (firstDirection !== secondDirection) return true;
  }
  return false;
}

function countTurningSegments(pathCells, segmentLength) {
  let turning = 0;
  for (let index = 0; index < pathCells.length; index += segmentLength) {
    if (hasTurn(pathCells.slice(index, index + segmentLength))) turning += 1;
  }
  return turning;
}

function generatePath(size, totalCells, segmentLength, seed) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const rng = createRng(seed + attempt * 104729);
    const start = [Math.floor(rng() * size), Math.floor(rng() * size)];
    const pathCells = [start];
    const visited = new Set([cellKey(start)]);
    let explored = 0;
    const maxExplored = 150000;

    function walk() {
      explored += 1;
      if (explored > maxExplored) return null;
      if (pathCells.length === totalCells) return [...pathCells];

      const options = neighbors(pathCells[pathCells.length - 1], size)
        .filter((cell) => !visited.has(cellKey(cell)))
        .map((cell) => {
          const onward = neighbors(cell, size).filter((next) => !visited.has(cellKey(next))).length;
          return { cell, score: onward + rng() * 0.35 };
        })
        .sort((a, b) => a.score - b.score);

      for (const option of options) {
        const key = cellKey(option.cell);
        visited.add(key);
        pathCells.push(option.cell);
        const result = walk();
        if (result) return result;
        pathCells.pop();
        visited.delete(key);
      }

      return null;
    }

    const result = walk();
    if (!result) continue;
    const requiredTurningSegments = Math.ceil(totalCells / segmentLength * 0.75);
    if (countTurningSegments(result, segmentLength) >= requiredTurningSegments) return result;
  }

  throw new Error(`Unable to generate a Wend-like path for ${size}x${size} board with ${totalCells} open cells`);
}

function pickWords(length, count, offset) {
  const pool = wordPools[length];
  return Array.from({ length: count }, (_, index) => pool[(offset + index * 7) % pool.length]);
}

function buildPuzzle(index) {
  const planIndex = Math.floor(index / 25);
  const plan = plans[planIndex];
  const localIndex = index % 25;
  const offsetStep = plan.wordLength === 7 ? 2 : 3;
  const words = pickWords(plan.wordLength, plan.answerCount, localIndex * offsetStep + planIndex * 11);
  const totalOpenCells = plan.wordLength * plan.answerCount;
  const pathCells = generatePath(
    plan.boardSize,
    totalOpenCells,
    plan.wordLength,
    (index + 1) * 7919 + planIndex * 15485863,
  );
  for (const word of words) {
    if (word.length !== plan.wordLength) {
      throw new Error(`${word} must be ${plan.wordLength} letters for ${plan.boardSize}x${plan.boardSize} puzzle generation`);
    }
  }
  const grid = Array.from({ length: plan.boardSize }, () => Array.from({ length: plan.boardSize }, () => null));
  const answers = [];
  let cursor = 0;

  for (const word of words) {
    const path = pathCells.slice(cursor, cursor + word.length);
    word.split("").forEach((letter, letterIndex) => {
      const [row, col] = path[letterIndex];
      grid[row][col] = letter;
    });
    answers.push({ word, path });
    cursor += word.length;
  }

  const displayNumber = index + 1;
  const label = `Unofficial Practice #${displayNumber}`;
  return {
    game: "wend",
    puzzleNumber: 1000 + displayNumber,
    date: `unlimited-${String(displayNumber).padStart(3, "0")}`,
    dateLabel: label,
    updatedAt,
    difficulty: plan.difficulty,
    grid,
    hints: [
      {
        level: 1,
        title: "Gentle nudge",
        text: `This unofficial board uses ${plan.answerCount} answer paths and blocked cells. Start by tracing the most constrained corner.`,
      },
      {
        level: 2,
        title: "Direction clue",
        text: "After each word, continue from a neighboring cell instead of jumping across the board.",
      },
      {
        level: 3,
        title: "Almost there",
        text: "Every open cell belongs to exactly one answer path, so completed words should tile the board.",
      },
    ],
    answers,
    explanation: `${label} is a pregenerated Wend-style practice board. The verified solution uses every open cell exactly once across ${words.join(", ")}.`,
    quickHint: "Trace adjacent letters and avoid reusing cells.",
    fastTip: "When a path reaches an edge, check the neighboring cell that keeps the route connected.",
    commonMistake: "Do not treat this as a normal word search; Wend paths can turn and must tile every open cell.",
    difficultyNote: `${plan.difficulty} because this ${plan.boardSize}x${plan.boardSize} practice grid has ${plan.answerCount} separate paths and obstacle cells.`,
    relatedGames: ["patches", "zip", "tango", "queens"],
    isVerified: true,
  };
}

const puzzles = Array.from({ length: 75 }, (_, index) => buildPuzzle(index));
for (const puzzle of puzzles) {
  validateWendPuzzle(puzzle);
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(puzzles, null, 2)}\n`);
console.log(`Generated ${path.relative(root, outputFile)} with ${puzzles.length} verified Wend Unlimited puzzles.`);
