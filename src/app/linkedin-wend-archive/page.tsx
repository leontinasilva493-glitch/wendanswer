import type { Metadata } from "next";
import { ArchiveList } from "@/components/ArchiveList";
import { JsonLd } from "@/components/JsonLd";
import { RelatedGames } from "@/components/RelatedGames";
import { wendPuzzles } from "@/lib/puzzles";
import { breadcrumbJson, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "LinkedIn Wend Answer Archive",
  description:
    "Browse past LinkedIn Wend answers by puzzle number and date, with quick hints, solver links, and archived answer pages.",
  path: "/linkedin-wend-archive",
  imageTitle: "LinkedIn Wend Archive",
  imageSubtitle: "Past Wend answers by puzzle number and date.",
});

export default function WendArchivePage() {
  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Wend Archive", path: "/linkedin-wend-archive" }])} />
      <section>
        <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">LinkedIn Wend Answer Archive</h1>
        <p className="section-copy">
          Recent Wend answers are organized by puzzle number and date. Open a detail page for the answer, path,
          explanation, previous puzzle, next puzzle, and solver links.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">Recent Wend Answers</h2>
        <div className="mt-5">
          <ArchiveList puzzles={wendPuzzles} />
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Browse by month</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="chip">June 2026</span>
        </div>
      </section>

      <RelatedGames />
    </main>
  );
}
