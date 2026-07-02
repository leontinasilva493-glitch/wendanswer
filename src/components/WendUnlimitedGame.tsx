"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Dices, Infinity } from "lucide-react";
import type { WendPuzzle } from "@/lib/puzzles";
import { WendPlayableGame } from "./WendPlayableGame";

export function WendUnlimitedGame({ puzzles }: { puzzles: WendPuzzle[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const puzzle = puzzles[currentIndex];
  const visibleNumber = currentIndex + 1;

  const shuffledIndexes = useMemo(() => puzzles.map((_, index) => index), [puzzles]);

  function moveBy(delta: number) {
    if (puzzles.length === 0) return;
    setCurrentIndex((index) => (index + delta + puzzles.length) % puzzles.length);
  }

  function randomPuzzle() {
    if (puzzles.length <= 1) return;
    setCurrentIndex((index) => {
      const next = shuffledIndexes[Math.floor(Math.random() * shuffledIndexes.length)];
      return next === index ? (next + 1) % puzzles.length : next;
    });
  }

  function choosePuzzle(value: string) {
    const nextIndex = Number(value);
    if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= puzzles.length) return;
    setCurrentIndex(nextIndex);
  }

  if (!puzzle) {
    return (
      <div className="content-card">
        <p className="font-semibold text-slate-700">No verified Wend Unlimited puzzles are available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="content-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="section-icon">
                <Infinity aria-hidden className="h-5 w-5" />
              </span>
              <p className="text-sm font-black uppercase tracking-normal text-brand">Unofficial practice bank</p>
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-normal text-ink md:text-3xl">
              {puzzle.dateLabel}
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
              Puzzle {visibleNumber} of {puzzles.length}. Every board is pregenerated and validated before shipping.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[460px]">
            <label className="sm:col-span-3">
              <span className="mb-1 block text-xs font-black uppercase tracking-normal text-slate-500">Choose Puzzle</span>
              <select
                aria-label="Choose Puzzle"
                className="min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                onChange={(event) => choosePuzzle(event.target.value)}
                value={currentIndex}
              >
                {puzzles.map((candidate, index) => (
                  <option key={candidate.puzzleNumber} value={index}>
                    Puzzle {index + 1} - {candidate.difficulty}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn btn-ghost gap-2" onClick={() => moveBy(-1)} type="button">
              <ChevronLeft aria-hidden className="h-4 w-4" />
              Previous Puzzle
            </button>
            <button className="btn btn-primary gap-2" onClick={randomPuzzle} type="button">
              <Dices aria-hidden className="h-4 w-4" />
              Random Puzzle
            </button>
            <button className="btn btn-ghost gap-2" onClick={() => moveBy(1)} type="button">
              Next Puzzle
              <ChevronRight aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="content-card">
        <WendPlayableGame key={puzzle.puzzleNumber} puzzle={puzzle} />
      </div>
    </div>
  );
}
