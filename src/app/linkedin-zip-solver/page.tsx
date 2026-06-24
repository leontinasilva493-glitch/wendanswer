import type { Metadata } from "next";
import { ZipSolver } from "@/components/ZipSolver";
import { todayZip } from "@/lib/puzzles";
import { noindexFollow, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "LinkedIn Zip Solver",
  description:
    "Use a lightweight LinkedIn Zip path solver to reveal the next step, full path, or clear the grid on mobile.",
  path: "/linkedin-zip-solver",
  robots: noindexFollow,
});

export default function ZipSolverPage() {
  return (
    <main className="page-shell">
      <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">LinkedIn Zip Solver</h1>
      <p className="section-copy">Reveal the Zip path step by step without showing the full answer first.</p>
      <section className="section">
        <ZipSolver puzzle={todayZip} />
      </section>
    </main>
  );
}
