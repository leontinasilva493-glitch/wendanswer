import patchesToday from "../../data/puzzles/patches/2026-06-23.json";
import zipToday from "../../data/puzzles/zip/2026-06-23.json";
import { wendArchiveSlug, wendSlug } from "./dates";
import { generatedWendPuzzles } from "./generated/wend-puzzles";

export type Cell = [number, number];

export type WendAnswer = {
  word: string;
  path: Cell[];
};

export type WendPuzzle = {
  game: "wend";
  puzzleNumber: number;
  date: string;
  dateLabel: string;
  updatedAt: string;
  difficulty: string;
  grid: Array<Array<string | null>>;
  hints: { level: number; title: string; text: string }[];
  answers: WendAnswer[];
  explanation: string;
  quickHint: string;
  fastTip: string;
  commonMistake: string;
  difficultyNote: string;
  relatedGames: string[];
  isVerified: boolean;
};

export type SimplePuzzle = {
  game: "patches" | "zip";
  puzzleNumber: number;
  date: string;
  dateLabel: string;
  difficulty: string;
  hints: string[];
  answer: string;
  explanation: string;
  isVerified: boolean;
  updatedAt: string;
  grid?: string[][];
  path?: Cell[];
};

export const allWendPuzzles = generatedWendPuzzles as unknown as WendPuzzle[];
export const verifiedWendPuzzles = allWendPuzzles.filter((puzzle) => puzzle.isVerified);
export const wendPuzzles = verifiedWendPuzzles;
export const todayWend = verifiedWendPuzzles[0] ?? allWendPuzzles[0];
export const todayPatches = patchesToday as SimplePuzzle;
export const todayZip = zipToday as SimplePuzzle;

export const games = [
  {
    name: "Wend",
    slug: "wend",
    status: "Updated",
    number: todayWend.puzzleNumber,
    todayPath: "/linkedin-wend-answer-today",
    archivePath: "/linkedin-wend-archive",
    solverPath: "/linkedin-wend-solver",
  },
  {
    name: "Patches",
    slug: "patches",
    status: "Updated",
    number: todayPatches.puzzleNumber,
    todayPath: "/linkedin-patches-answer-today",
    archivePath: "/linkedin-patches-archive",
  },
  {
    name: "Zip",
    slug: "zip",
    status: "Updated",
    number: todayZip.puzzleNumber,
    todayPath: "/linkedin-zip-answer-today",
    solverPath: "/linkedin-zip-solver",
  },
  { name: "Tango", slug: "tango", status: "Coming Soon" },
  { name: "Queens", slug: "queens", status: "Coming Soon" },
  { name: "Mini Sudoku", slug: "mini-sudoku", status: "Coming Soon" },
  { name: "Pinpoint", slug: "pinpoint", status: "Coming Soon" },
  { name: "Crossclimb", slug: "crossclimb", status: "Coming Soon" },
];

export function findWendBySlug(slug: string) {
  return wendPuzzles.find(
    (puzzle) => wendSlug(puzzle.puzzleNumber, puzzle.dateLabel) === slug,
  );
}

export function findWendByArchiveSlug(slug: string) {
  return wendPuzzles.find(
    (puzzle) => wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel) === slug,
  );
}

export function getWendNeighbors(puzzleNumber: number) {
  const index = wendPuzzles.findIndex((puzzle) => puzzle.puzzleNumber === puzzleNumber);
  return {
    previous: wendPuzzles[index + 1],
    next: wendPuzzles[index - 1],
  };
}
