import type { WendPuzzle } from "./puzzles";
import { expectedWendDate, nextWendRelease, wendDateLabel } from "./wend-schedule";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysBetween(startDate: string, endDate: string) {
  const startTime = Date.parse(`${startDate}T00:00:00.000Z`);
  const endTime = Date.parse(`${endDate}T00:00:00.000Z`);

  return Math.round((endTime - startTime) / MS_PER_DAY);
}

export function expectedWendDisplay(latestPuzzle: WendPuzzle, now = new Date()) {
  const date = expectedWendDate(now);
  const puzzleNumber = latestPuzzle.puzzleNumber + daysBetween(latestPuzzle.date, date);

  return {
    date,
    dateLabel: wendDateLabel(date),
    puzzleNumber,
  };
}

export function nextWendDisplay(latestPuzzle: WendPuzzle, now = new Date()) {
  const releaseAt = nextWendRelease(now);
  const date = expectedWendDate(releaseAt);
  const puzzleNumber = latestPuzzle.puzzleNumber + daysBetween(latestPuzzle.date, date);

  return {
    date,
    dateLabel: wendDateLabel(date),
    puzzleNumber,
    releaseAtIso: releaseAt.toISOString(),
  };
}

export { expectedWendDate, nextWendRelease, wendDateLabel } from "./wend-schedule";

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
