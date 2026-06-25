import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { WendSolver } from "@/components/WendSolver";
import { todayWend } from "@/lib/puzzles";
import { breadcrumbJson, noindexFollow, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Wend Practice Puzzle",
  description:
    "Try a temporary unofficial Wend-style practice puzzle. Full unlimited mode is paused during the MVP launch.",
  path: "/wend-unlimited",
  imageTitle: "Wend Practice Puzzle",
  imageSubtitle: "Temporary practice mode for MVP validation.",
  robots: noindexFollow,
});

export default function WendUnlimitedPage() {
  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Wend Practice", path: "/wend-unlimited" }])} />
      <section className="content-card">
        <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">Wend Practice Puzzle</h1>
        <p className="section-copy">
          Full unlimited mode is paused for the MVP launch. This page keeps a single unofficial practice puzzle
          available without promoting it as a public SEO page.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link className="chip" href="/linkedin-wend-answer-today">
            Today's Answer
          </Link>
          <Link className="chip" href="/linkedin-wend-solver">
            Wend Solver
          </Link>
        </div>
      </section>
      <section className="section content-card">
        <WendSolver puzzle={{ ...todayWend, puzzleNumber: 1, dateLabel: "Practice Puzzle" }} />
      </section>
    </main>
  );
}
