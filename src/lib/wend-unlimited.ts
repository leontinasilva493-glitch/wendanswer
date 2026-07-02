import unlimitedPuzzles from "../../data/puzzles/wend-unlimited/puzzles.json";
import type { WendPuzzle } from "./puzzles";

export const unlimitedWendPuzzles = (unlimitedPuzzles as WendPuzzle[]).filter((puzzle) => puzzle.isVerified);

export function getUnlimitedWendPuzzle(puzzleNumber: number) {
  return unlimitedWendPuzzles.find((puzzle) => puzzle.puzzleNumber === puzzleNumber);
}
