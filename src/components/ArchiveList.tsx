import Link from "next/link";
import { wendArchiveSlug } from "@/lib/dates";
import type { WendPuzzle } from "@/lib/puzzles";

export function ArchiveList({ puzzles }: { puzzles: WendPuzzle[] }) {
  return (
    <div className="archive-grid">
      {puzzles.map((puzzle) => (
        <article className="archive-card" key={puzzle.date}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-black text-brand">Wend #{puzzle.puzzleNumber}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {puzzle.difficulty}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-ink">{puzzle.dateLabel}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{puzzle.quickHint}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link className="chip" href={`/${wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel)}`}>
              View answer
            </Link>
            <Link className="chip" href="/linkedin-wend-solver">
              View solver
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
