import type { Metadata } from "next";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Disclaimer",
  description: "Disclaimer for WendAnswerToday.org, an unofficial fan-made puzzle help site.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <main className="page-shell">
      <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">Disclaimer</h1>
      <div className="section-copy space-y-4">
        <p>{site.disclaimer}</p>
        <p>
          WendAnswerToday.org provides hints, answers, solvers, archives, and unofficial practice puzzles for
          people who enjoy daily puzzle games.
        </p>
        <p>
          We do not use LinkedIn logos, official screenshots, or official interface assets. Practice puzzles are
          unofficial word-path exercises and should not be described as official games.
        </p>
      </div>
    </main>
  );
}
