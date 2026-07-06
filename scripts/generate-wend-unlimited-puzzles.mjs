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

function directionKey(from, to) {
  return `${to[0] - from[0]},${to[1] - from[1]}`;
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
    const firstDirection = directionKey(pathCells[index - 2], pathCells[index - 1]);
    const secondDirection = directionKey(pathCells[index - 1], pathCells[index]);
    if (firstDirection !== secondDirection) return true;
  }
  return false;
}

function countTurns(pathCells) {
  let turns = 0;
  for (let index = 2; index < pathCells.length; index += 1) {
    const firstDirection = directionKey(pathCells[index - 2], pathCells[index - 1]);
    const secondDirection = directionKey(pathCells[index - 1], pathCells[index]);
    if (firstDirection !== secondDirection) turns += 1;
  }
  return turns;
}

function pathOpeningDirection(pathCells) {
  return pathCells.length < 2 ? "0,0" : directionKey(pathCells[0], pathCells[1]);
}

function shuffle(items, rng) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function allCells(size) {
  return Array.from({ length: size * size }, (_, index) => [Math.floor(index / size), index % size]);
}

function generateWordCandidates(size, wordLength, usedCells, rng, limit = 96) {
  const candidates = [];
  const starts = shuffle(
    allCells(size).filter((cell) => !usedCells.has(cellKey(cell))),
    rng,
  );

  function walk(pathCells, localVisited, turns) {
    if (candidates.length >= limit) return;
    if (pathCells.length === wordLength) {
      if (turns > 0) candidates.push(pathCells.map((cell) => [...cell]));
      return;
    }

    const current = pathCells[pathCells.length - 1];
    const previousDirection = pathCells.length >= 2 ? directionKey(pathCells[pathCells.length - 2], current) : null;
    const options = shuffle(
      neighbors(current, size)
        .filter((cell) => {
          const key = cellKey(cell);
          return !usedCells.has(key) && !localVisited.has(key);
        })
        .map((cell) => {
          const nextDirection = directionKey(current, cell);
          const nextTurns = turns + (previousDirection && previousDirection !== nextDirection ? 1 : 0);
          const onward = neighbors(cell, size).filter((next) => {
            const key = cellKey(next);
            return !usedCells.has(key) && !localVisited.has(key);
          }).length;
          return { cell, nextTurns, score: nextTurns * 5 + onward + rng() * 0.3 };
        })
        .sort((a, b) => b.score - a.score),
      rng,
    );

    for (const option of options) {
      const key = cellKey(option.cell);
      localVisited.add(key);
      pathCells.push(option.cell);
      walk(pathCells, localVisited, option.nextTurns);
      pathCells.pop();
      localVisited.delete(key);
      if (candidates.length >= limit) return;
    }
  }

  for (const start of starts) {
    const startKey = cellKey(start);
    const localVisited = new Set([startKey]);
    walk([start], localVisited, 0);
    if (candidates.length >= limit) break;
  }

  return candidates;
}

function generatePaths(size, wordLength, answerCount, seed) {
  const totalOpenCells = wordLength * answerCount;

  for (let attempt = 0; attempt < 300; attempt += 1) {
    const rng = createRng(seed + attempt * 104729);
    const usedCells = new Set();
    const paths = [];

    function placeWord(index) {
      if (index === answerCount) {
        const openingDirections = new Set(paths.map(pathOpeningDirection));
        const multiTurnCount = paths.filter((path) => countTurns(path) >= 2).length;
        return (
          openingDirections.size >= Math.min(3, answerCount) &&
          multiTurnCount >= Math.ceil(answerCount * 0.4) &&
          usedCells.size === totalOpenCells
        );
      }

      const seen = new Set();
      const existingDirections = new Set(paths.map(pathOpeningDirection));
      const candidates = generateWordCandidates(size, wordLength, usedCells, rng)
        .filter((candidate) => {
          const fingerprint = JSON.stringify(candidate);
          if (seen.has(fingerprint)) return false;
          seen.add(fingerprint);
          return true;
        })
        .map((candidate) => {
          const openingDirection = pathOpeningDirection(candidate);
          const turnCount = countTurns(candidate);
          const newDirectionBonus = existingDirections.has(openingDirection) ? 0 : 4;
          const rowSpread = new Set(candidate.map(([row]) => row)).size;
          const colSpread = new Set(candidate.map(([, col]) => col)).size;
          return {
            candidate,
            score: turnCount * 8 + newDirectionBonus + rowSpread + colSpread + rng(),
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 28);

      for (const { candidate } of candidates) {
        for (const cell of candidate) usedCells.add(cellKey(cell));
        paths.push(candidate);
        if (placeWord(index + 1)) return true;
        paths.pop();
        for (const cell of candidate) usedCells.delete(cellKey(cell));
      }

      return false;
    }

    if (placeWord(0)) return paths;
  }

  throw new Error(`Unable to generate Wend Unlimited paths for ${size}x${size} board with ${answerCount} words of length ${wordLength}`);
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
  const paths = generatePaths(plan.boardSize, plan.wordLength, plan.answerCount, (index + 1) * 7919 + planIndex * 15485863);
  for (const word of words) {
    if (word.length !== plan.wordLength) {
      throw new Error(`${word} must be ${plan.wordLength} letters for ${plan.boardSize}x${plan.boardSize} puzzle generation`);
    }
  }
  const grid = Array.from({ length: plan.boardSize }, () => Array.from({ length: plan.boardSize }, () => null));
  const answers = [];
  words.forEach((word, wordIndex) => {
    const path = paths[wordIndex];
    word.split("").forEach((letter, letterIndex) => {
      const [row, col] = path[letterIndex];
      grid[row][col] = letter;
    });
    answers.push({ word, path });
  });

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
