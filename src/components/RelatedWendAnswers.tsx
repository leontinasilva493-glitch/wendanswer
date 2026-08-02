import Link from "next/link";
import { ArrowRight, Grid3X3 } from "lucide-react";
import { wendArchiveSlug } from "@/lib/dates";
import type { WendPuzzle } from "@/lib/puzzles";
import { selectRelatedWendPuzzles } from "@/lib/wend-related";

export function RelatedWendAnswers({ current, puzzles }: { current: WendPuzzle; puzzles: WendPuzzle[] }) {
  const related = selectRelatedWendPuzzles(current, puzzles, 4);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-wend-answers-heading" className="section content-card" id="related-wend-answers">
      <h2 className="section-heading" id="related-wend-answers-heading">
        <span className="section-icon"><Grid3X3 aria-hidden className="h-5 w-5" /></span>
        <span>Related LinkedIn Wend Answers</span>
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Compare verified puzzles with a similar grid, difficulty label, or number of path turns.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {related.map(({ puzzle, reason }) => (
          <Link
            className="group rounded-lg border border-line bg-white p-4 transition hover:border-brand hover:shadow-sm"
            href={`/${wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel)}`}
            key={puzzle.puzzleNumber}
          >
            <span className="flex items-start justify-between gap-4">
              <span>
                <span className="block text-base font-black text-ink group-hover:text-brand">
                  Wend #{puzzle.puzzleNumber} answer – {puzzle.dateLabel}
                </span>
                <span className="mt-1 block text-sm font-semibold leading-6 text-slate-600">{reason}</span>
              </span>
              <ArrowRight aria-hidden className="mt-1 h-5 w-5 shrink-0 text-brand" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
