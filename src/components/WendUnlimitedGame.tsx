"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Dices, Infinity } from "lucide-react";
import type { WendPuzzle } from "@/lib/puzzles";
import { loadWendPlayMeta, saveWendPlayMeta, type WendPlayDifficulty } from "@/lib/wend-play-storage";
import { WendPlayableGame } from "./WendPlayableGame";

export function WendUnlimitedGame({ puzzles }: { puzzles: WendPuzzle[] }) {
  const [difficulty, setDifficulty] = useState<WendPlayDifficulty>("all");
  const [currentPuzzleNumber, setCurrentPuzzleNumber] = useState<number>(puzzles[0]?.puzzleNumber ?? 0);
  const [resumeLoaded, setResumeLoaded] = useState(false);

  useEffect(() => {
    const saved = loadWendPlayMeta();
    if (saved) {
      setDifficulty(saved.difficulty);
      setCurrentPuzzleNumber(saved.currentPuzzleNumber);
    }
    setResumeLoaded(true);
  }, []);

  const filteredPuzzles = useMemo(
    () => puzzles.filter((puzzle) => difficulty === "all" || puzzle.difficulty === difficulty),
    [difficulty, puzzles],
  );

  const puzzle = useMemo(() => {
    if (filteredPuzzles.length === 0) return undefined;
    return (
      filteredPuzzles.find((candidate) => candidate.puzzleNumber === currentPuzzleNumber) ?? filteredPuzzles[0]
    );
  }, [currentPuzzleNumber, filteredPuzzles]);

  const currentIndex = puzzle ? filteredPuzzles.findIndex((candidate) => candidate.puzzleNumber === puzzle.puzzleNumber) : -1;
  const visibleNumber = currentIndex >= 0 ? currentIndex + 1 : 0;

  useEffect(() => {
    if (!puzzle) return;
    if (puzzle.puzzleNumber !== currentPuzzleNumber) {
      setCurrentPuzzleNumber(puzzle.puzzleNumber);
      return;
    }
    if (!resumeLoaded) return;
    saveWendPlayMeta({ currentPuzzleNumber: puzzle.puzzleNumber, difficulty });
  }, [difficulty, currentPuzzleNumber, puzzle, resumeLoaded]);

  const savedPuzzleLabel = resumeLoaded ? `Saved locally: #${puzzle?.puzzleNumber ?? currentPuzzleNumber}` : "Loading local progress...";

  function moveBy(delta: number) {
    if (filteredPuzzles.length === 0) return;
    setCurrentPuzzleNumber((current) => {
      const activeIndex = filteredPuzzles.findIndex((candidate) => candidate.puzzleNumber === current);
      const nextIndex = (activeIndex + delta + filteredPuzzles.length) % filteredPuzzles.length;
      return filteredPuzzles[nextIndex].puzzleNumber;
    });
  }

  function randomPuzzle() {
    if (filteredPuzzles.length <= 1) return;
    const next = filteredPuzzles[Math.floor(Math.random() * filteredPuzzles.length)];
    if (!next) return;
    setCurrentPuzzleNumber(next.puzzleNumber);
  }

  function choosePuzzle(value: string) {
    const nextNumber = Number(value);
    if (!Number.isInteger(nextNumber)) return;
    setCurrentPuzzleNumber(nextNumber);
  }

  function changeDifficulty(value: string) {
    const nextDifficulty = value as WendPlayDifficulty;
    setDifficulty(nextDifficulty);
    const nextPuzzles = puzzles.filter((candidate) => nextDifficulty === "all" || candidate.difficulty === nextDifficulty);
    const nextPuzzle = nextPuzzles.find((candidate) => candidate.puzzleNumber === currentPuzzleNumber) ?? nextPuzzles[0];
    if (nextPuzzle) {
      setCurrentPuzzleNumber(nextPuzzle.puzzleNumber);
    }
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
              <p className="text-sm font-black uppercase tracking-normal text-brand">Unofficial practice tool</p>
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-normal text-ink md:text-3xl">
              {puzzle.dateLabel}
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
              Puzzle {visibleNumber} of {filteredPuzzles.length} in this difficulty set. Your progress is saved locally in
              this browser.
            </p>
            <p className="mt-2 text-xs font-black uppercase tracking-normal text-slate-500">{savedPuzzleLabel}</p>
          </div>
          <div className="grid gap-2 lg:w-[520px]">
            <div className="grid gap-2 sm:grid-cols-2">
              <label>
                <span className="mb-1 block text-xs font-black uppercase tracking-normal text-slate-500">Difficulty</span>
                <select
                  aria-label="Difficulty"
                  className="min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  onChange={(event) => changeDifficulty(event.target.value)}
                  value={difficulty}
                >
                  <option value="all">All difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </label>
              <label>
                <span className="mb-1 block text-xs font-black uppercase tracking-normal text-slate-500">Choose Puzzle</span>
                <select
                  aria-label="Choose Puzzle"
                  className="min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                  onChange={(event) => choosePuzzle(event.target.value)}
                  value={puzzle.puzzleNumber}
                >
                  {filteredPuzzles.map((candidate, index) => (
                    <option key={candidate.puzzleNumber} value={candidate.puzzleNumber}>
                      Puzzle {index + 1} - {candidate.difficulty}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <button className="btn btn-ghost gap-2" onClick={() => moveBy(-1)} type="button">
                <ChevronLeft aria-hidden className="h-4 w-4" />
                Previous Puzzle
              </button>
              <button className="btn btn-primary gap-2" onClick={randomPuzzle} type="button">
                <Dices aria-hidden className="h-4 w-4" />
                New Puzzle
              </button>
              <button className="btn btn-ghost gap-2" onClick={() => moveBy(1)} type="button">
                Next Puzzle
                <ChevronRight aria-hidden className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <WendPlayableGame key={puzzle.puzzleNumber} puzzle={puzzle} />
      </div>
    </div>
  );
}
