import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { WendUnlimitedGame } from "@/components/WendUnlimitedGame";
import { breadcrumbJson, noindexFollow, pageMetadata } from "@/lib/seo";
import { unlimitedWendPuzzles } from "@/lib/wend-unlimited";

export const metadata: Metadata = pageMetadata({
  title: "Wend Unlimited",
  description:
    "Play unofficial Wend-style practice puzzles from a pregenerated, verified Wend Unlimited bank.",
  path: "/wend-unlimited",
  imageTitle: "Wend Unlimited",
  imageSubtitle: "Unofficial practice puzzles, pregenerated and verified.",
  robots: noindexFollow,
});

export default function WendUnlimitedPage() {
  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Wend Unlimited", path: "/wend-unlimited" }])} />
      <section className="content-card">
        <p className="text-sm font-black uppercase tracking-normal text-brand">Unofficial Wend-style practice</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal text-ink md:text-5xl">Wend Unlimited</h1>
        <p className="section-copy">
          This is an Unofficial practice mode and is not affiliated with, endorsed by, or sponsored by LinkedIn.
          Choose from {unlimitedWendPuzzles.length} pregenerated boards; each one is verified for a complete solution
          before it appears here.
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
      <section className="section">
        <WendUnlimitedGame puzzles={unlimitedWendPuzzles} />
      </section>
    </main>
  );
}
