import type { WendPuzzle } from "./puzzles";

export const WEND_RELEASE_HOUR_UTC = 8;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const dateLabelFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(startDate: string, endDate: string) {
  const startTime = Date.parse(`${startDate}T00:00:00.000Z`);
  const endTime = Date.parse(`${endDate}T00:00:00.000Z`);

  return Math.round((endTime - startTime) / MS_PER_DAY);
}

export function wendDateLabel(date: string) {
  return dateLabelFormatter.format(new Date(`${date}T00:00:00.000Z`));
}

export function expectedWendDate(now = new Date()) {
  const releaseDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (now.getUTCHours() < WEND_RELEASE_HOUR_UTC) {
    releaseDate.setUTCDate(releaseDate.getUTCDate() - 1);
  }
  return isoDate(releaseDate);
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
