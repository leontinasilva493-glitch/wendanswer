import Link from "next/link";
import type { WendPuzzle } from "@/lib/puzzles";

export function WendVerificationNotice({
  puzzle,
  expectedDate,
}: {
  puzzle: WendPuzzle;
  expectedDate: string;
}) {
  return (
    <section className="content-card border-amber-200 bg-amber-50">
      <p className="text-sm font-bold uppercase tracking-[0.08em] text-amber-800">Verification pending</p>
      <h2 className="mt-2 text-2xl font-black text-ink">Today&apos;s Wend is being verified</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
        The expected Wend date is {expectedDate}. We are not showing an old or unverified answer as today&apos;s
        solution.
      </p>
      <p className="mt-3 text-sm font-semibold text-slate-700">
        Last verified puzzle available here: Wend #{puzzle.puzzleNumber} from {puzzle.dateLabel}.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link className="chip" href="/linkedin-wend-archive">
          View archive
        </Link>
        <a className="chip" href="https://www.linkedin.com/games/" rel="nofollow noopener" target="_blank">
          Open LinkedIn Games
        </a>
      </div>
    </section>
  );
}
