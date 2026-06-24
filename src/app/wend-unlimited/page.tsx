import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { RelatedGames } from "@/components/RelatedGames";
import { WendSolver } from "@/components/WendSolver";
import { todayWend } from "@/lib/puzzles";
import { breadcrumbJson, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Wend Unlimited Practice",
  description:
    "Play an unofficial Wend-style word path practice puzzle with hints, reveal controls, reset, and mobile-friendly solving.",
  path: "/wend-unlimited",
  imageTitle: "Wend Unlimited Practice",
  imageSubtitle: "Unofficial word path practice with spoiler-safe reveals.",
});

export default function WendUnlimitedPage() {
  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Wend Unlimited", path: "/wend-unlimited" }])} />
      <section>
        <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">Wend Unlimited Practice</h1>
        <p className="section-copy">
          Unofficial Wend-style word path practice. This practice puzzle is inspired by word-path solving and is
          not affiliated with LinkedIn.
        </p>
      </section>
      <section className="section">
        <WendSolver puzzle={{ ...todayWend, puzzleNumber: 1, dateLabel: "Practice Puzzle" }} />
      </section>
      <section className="section flex flex-wrap gap-2">
        <button className="btn btn-primary" type="button">
          New Puzzle
        </button>
        <button className="btn btn-ghost" type="button">
          Share
        </button>
      </section>
      <RelatedGames />
    </main>
  );
}
