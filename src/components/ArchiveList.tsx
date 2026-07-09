import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { wendArchiveSlug } from "@/lib/dates";
import type { WendPuzzle } from "@/lib/puzzles";

type ArchiveListVariant = "full" | "preview";

export function ArchiveList({ puzzles, variant = "full" }: { puzzles: WendPuzzle[]; variant?: ArchiveListVariant }) {
  if (variant === "preview") {
    return (
      <div className="recent-puzzle-grid">
        {puzzles.map((puzzle) => (
          <Link
            aria-label={`View Wend #${puzzle.puzzleNumber} answer for ${puzzle.dateLabel}`}
            className="recent-puzzle-card"
            href={`/${wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel)}`}
            key={puzzle.date}
          >
            <span className="text-4xl font-black tracking-normal text-ink">#{puzzle.puzzleNumber}</span>
            <span className="text-lg font-black text-ink">{puzzle.dateLabel}</span>
            <span className="mt-auto flex items-center justify-between gap-4 text-base font-black text-slate-600">
              <span>Interactive</span>
              <ArrowRight aria-hidden className="h-5 w-5 text-brand" />
            </span>
          </Link>
        ))}
      </div>
    );
  }

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
