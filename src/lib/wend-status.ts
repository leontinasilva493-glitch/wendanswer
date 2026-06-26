import type { WendPuzzle } from "./puzzles";

export const WEND_RELEASE_HOUR_UTC = 8;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function expectedWendDate(now = new Date()) {
  const releaseDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (now.getUTCHours() < WEND_RELEASE_HOUR_UTC) {
    releaseDate.setUTCDate(releaseDate.getUTCDate() - 1);
  }
  return isoDate(releaseDate);
}

export function isWendReadyForToday(puzzle: WendPuzzle, now = new Date()) {
  return puzzle.isVerified && puzzle.date === expectedWendDate(now);
}

export function wendReadiness(puzzle: WendPuzzle, now = new Date()) {
  const expectedDate = expectedWendDate(now);
  return {
    expectedDate,
    isReady: puzzle.isVerified && puzzle.date === expectedDate,
    isVerified: puzzle.isVerified,
    isCurrentDate: puzzle.date === expectedDate,
  };
}
