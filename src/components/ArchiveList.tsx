import Link from "next/link";
import type { WendPuzzle } from "@/lib/puzzles";
import { wendArchiveSlug } from "@/lib/dates";

export function ArchiveList({ puzzles }: { puzzles: WendPuzzle[] }) {
  return (
    <div className="inner-card overflow-hidden">
      {puzzles.map((puzzle) => (
        <div
          className="grid gap-3 border-b border-line p-4 last:border-b-0 sm:grid-cols-[90px_1fr_auto]"
          key={puzzle.date}
        >
          <div className="font-bold text-ink">#{puzzle.puzzleNumber}</div>
          <div>
            <p className="font-semibold text-ink">{puzzle.dateLabel}</p>
            <p className="mt-1 text-sm text-slate-600">
              {puzzle.difficulty} · {puzzle.quickHint}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link className="chip" href={`/${wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel)}`}>
              View answer
            </Link>
            <Link className="chip" href="/linkedin-wend-solver">
              View solver
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
