import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { WendSolver } from "@/components/WendSolver";
import { wendPuzzles } from "@/lib/puzzles";
import { breadcrumbJson, noindexFollow, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Wend Practice Puzzle",
  description:
    "Play unofficial Wend-style practice puzzles with spoiler-safe reveal controls, word paths, and puzzle navigation.",
  path: "/wend-unlimited",
  imageTitle: "Wend Practice Puzzle",
  imageSubtitle: "Unofficial Wend-style practice puzzles.",
  robots: noindexFollow,
});

type WendUnlimitedPageProps = {
  searchParams?: Promise<{
    puzzle?: string | string[];
  }>;
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function practiceHref(puzzleNumber: number) {
  return `/wend-unlimited?puzzle=${puzzleNumber}`;
}

const practicePuzzles = [...wendPuzzles].reverse();

export default async function WendUnlimitedPage({ searchParams }: WendUnlimitedPageProps) {
  const params = await searchParams;
  const requestedPuzzle = Number.parseInt(firstParam(params?.puzzle) ?? "1", 10);
  const safePuzzleNumber = Number.isFinite(requestedPuzzle) ? requestedPuzzle : 1;
  const currentPuzzleNumber = Math.min(Math.max(safePuzzleNumber, 1), practicePuzzles.length);
  const currentIndex = currentPuzzleNumber - 1;
  const currentPuzzle = practicePuzzles[currentIndex];
  const letterCount = currentPuzzle.grid.flat().filter(Boolean).length;
  const previousHref = currentPuzzleNumber > 1 ? practiceHref(currentPuzzleNumber - 1) : null;
  const nextHref = currentPuzzleNumber < practicePuzzles.length ? practiceHref(currentPuzzleNumber + 1) : null;

  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Wend Practice", path: "/wend-unlimited" }])} />
      <section className="content-card">
        <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">Wend Practice Puzzle</h1>
        <p className="section-copy">
          Practice Wend-style word paths with spoiler-safe reveal controls. Move through the practice set one board
          at a time and reveal only the help you need.
        </p>
      </section>
      <section className="section content-card">
        <div className="mb-6 grid gap-3 rounded-lg border border-line bg-white p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          {previousHref ? (
            <Link className="btn btn-ghost justify-center border-brand text-brand" href={previousHref}>
              Previous
            </Link>
          ) : (
            <span aria-disabled="true" className="btn btn-ghost justify-center border-slate-200 text-slate-400">
              Previous
            </span>
          )}
          <div className="text-center">
            <p className="text-lg font-black text-ink">
              Practice Puzzle {currentPuzzleNumber} of {practicePuzzles.length}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              Puzzle #{currentPuzzle.puzzleNumber} / Difficulty {currentPuzzle.difficulty} / Letters {letterCount}
            </p>
          </div>
          {nextHref ? (
            <Link className="btn btn-primary justify-center" href={nextHref}>
              Next
            </Link>
          ) : (
            <span aria-disabled="true" className="btn btn-ghost justify-center border-slate-200 text-slate-400">
              Next
            </span>
          )}
        </div>
        <WendSolver puzzle={{ ...currentPuzzle, dateLabel: `Practice Puzzle ${currentPuzzleNumber}` }} />
      </section>
    </main>
  );
}
