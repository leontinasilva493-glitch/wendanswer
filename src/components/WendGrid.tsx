"use client";

import type { Cell, WendAnswer } from "@/lib/puzzles";

const colors = [
  "bg-blue-100 text-blue-900 ring-blue-500",
  "bg-amber-100 text-amber-950 ring-amber-500",
  "bg-green-100 text-green-950 ring-green-500",
  "bg-indigo-100 text-indigo-950 ring-indigo-500",
  "bg-rose-100 text-rose-950 ring-rose-500",
];

function sameCell(a: Cell, b: Cell) {
  return a[0] === b[0] && a[1] === b[1];
}

function pathIndex(cell: Cell, answers: WendAnswer[], visibleWords: Set<string>) {
  for (let wordIndex = 0; wordIndex < answers.length; wordIndex += 1) {
    const answer = answers[wordIndex];
    if (!visibleWords.has(answer.word)) continue;
    const step = answer.path.findIndex((candidate) => sameCell(candidate, cell));
    if (step >= 0) return { wordIndex, step };
  }
  return null;
}

export function WendGrid({
  grid,
  answers,
  visibleWords,
  visibleLetters,
  onCellClick,
}: {
  grid: Array<Array<string | null>>;
  answers: WendAnswer[];
  visibleWords: Set<string>;
  visibleLetters: Set<string>;
  onCellClick?: (answer: WendAnswer, cell: Cell) => void;
}) {
  const columnCount = grid[0]?.length ?? 0;

  function isBlockedCell(row: number, col: number) {
    return grid[row]?.[col] === null;
  }

  function blockedBorders(row: number, col: number) {
    return [
      !isBlockedCell(row - 1, col) ? "border-t-[#444] border-t-[5px]" : "border-t-0",
      !isBlockedCell(row + 1, col) ? "border-b-[#444] border-b-[5px]" : "border-b-0",
      !isBlockedCell(row, col - 1) ? "border-l-[#444] border-l-[5px]" : "border-l-0",
      !isBlockedCell(row, col + 1) ? "border-r-[#444] border-r-[5px]" : "border-r-0",
    ].join(" ");
  }

  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div
        className="grid overflow-hidden rounded-[14px] border-[7px] border-[#444] bg-[#f7f9fc] shadow-soft"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {grid.flatMap((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const cell: Cell = [rowIndex, colIndex];
            const key = `${rowIndex}-${colIndex}`;
            if (letter === null) {
              return (
                <div
                  aria-label={`Blocked cell at row ${rowIndex + 1}, column ${colIndex + 1}`}
                  className={`aspect-square bg-[#b5b5b5] ${blockedBorders(rowIndex, colIndex)}`}
                  key={key}
                />
              );
            }

            const path = pathIndex(cell, answers, visibleWords);
            const answer = answers.find((candidate) =>
              candidate.path.some((candidateCell) => sameCell(candidateCell, cell)),
            );
            const isLetterVisible = visibleLetters.has(key);
            const color = path ? colors[path.wordIndex % colors.length] : "";

            return (
              <button
                aria-label={`Letter ${letter} at row ${rowIndex + 1}, column ${colIndex + 1}`}
                className={`relative aspect-square border border-[#dedede] text-[clamp(1.8rem,7vw,3rem)] font-black text-[#050b12] transition hover:border-brand ${
                  path ? `${color} ring-2` : isLetterVisible ? "bg-blue-50 ring-2 ring-brand" : "bg-[#f7f9fc]"
                }`}
                key={key}
                onClick={() => answer && onCellClick?.(answer, cell)}
                type="button"
              >
                {letter}
                {path ? (
                  <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/85 text-[11px] font-bold">
                    {path.step + 1}
                  </span>
                ) : null}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
