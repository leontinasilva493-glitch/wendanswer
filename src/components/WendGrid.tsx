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
  grid: string[][];
  answers: WendAnswer[];
  visibleWords: Set<string>;
  visibleLetters: Set<string>;
  onCellClick?: (answer: WendAnswer, cell: Cell) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div className="grid grid-cols-5 gap-2 rounded-xl border border-line bg-white p-3 shadow-soft">
        {grid.flatMap((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const cell: Cell = [rowIndex, colIndex];
            const key = `${rowIndex}-${colIndex}`;
            const path = pathIndex(cell, answers, visibleWords);
            const answer = answers.find((candidate) =>
              candidate.path.some((candidateCell) => sameCell(candidateCell, cell)),
            );
            const isLetterVisible = visibleLetters.has(key);
            const color = path ? colors[path.wordIndex % colors.length] : "";

            return (
              <button
                aria-label={`Letter ${letter} at row ${rowIndex + 1}, column ${colIndex + 1}`}
                className={`relative aspect-square rounded-lg border border-line text-xl font-bold transition hover:border-brand ${
                  path ? `${color} ring-2` : isLetterVisible ? "bg-blue-50 ring-2 ring-brand" : "bg-slate-50"
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
      <p className="mt-2 text-center text-xs text-slate-500">wendanswertoday.org</p>
    </div>
  );
}
