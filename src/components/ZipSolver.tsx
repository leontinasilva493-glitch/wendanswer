"use client";

import { useState } from "react";
import type { Cell, SimplePuzzle } from "@/lib/puzzles";

function sameCell(a: Cell, b: Cell) {
  return a[0] === b[0] && a[1] === b[1];
}

export function ZipSolver({ puzzle }: { puzzle: SimplePuzzle }) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const path = puzzle.path ?? [];
  const grid = puzzle.grid ?? [];

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            className="btn btn-primary"
            onClick={() => setVisibleSteps((step) => Math.min(path.length, step + 1))}
            type="button"
          >
            Reveal Next Step
          </button>
          <button className="btn btn-success" onClick={() => setVisibleSteps(path.length)} type="button">
            Reveal Full Path
          </button>
          <button className="btn btn-ghost" onClick={() => setVisibleSteps(0)} type="button">
            Clear
          </button>
        </div>
        <p className="rounded-lg border border-line bg-white p-4 text-sm leading-6 text-slate-700">
          Step {visibleSteps} of {path.length}. Use the numbered anchors as fixed points, then reveal only the next
          move when you need it.
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2 rounded-xl border border-line bg-white p-3 shadow-soft">
        {grid.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {
            const step = path.findIndex((cell) => sameCell(cell, [rowIndex, colIndex]));
            const shown = step >= 0 && step < visibleSteps;
            return (
              <div
                className={`relative flex aspect-square items-center justify-center rounded-lg border text-lg font-bold ${
                  shown ? "border-brand bg-blue-100 text-blue-900 ring-2 ring-brand" : "border-line bg-slate-50"
                }`}
                key={`${rowIndex}-${colIndex}`}
              >
                {value}
                {shown ? (
                  <span className="absolute right-1 top-1 rounded-full bg-white/90 px-1.5 text-[11px]">
                    {step + 1}
                  </span>
                ) : null}
              </div>
            );
          }),
        )}
      </div>
    </section>
  );
}
