import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Update SOP | WendAnswerToday.org",
  robots: {
    index: false,
    follow: false,
  },
};

const steps = [
  "Open the current Wend puzzle after the daily reset.",
  "Record date, puzzle number, grid, difficulty, answer words, and paths.",
  "Write three progressive hints: gentle nudge, direction clue, almost there.",
  "Update or add the Wend JSON file in data/puzzles/wend.",
  "Confirm today page, archive, history detail, solver, sitemap, robots, and llms.txt locally.",
  "Run npm run build and npm run smoke:local before deploy.",
  "After deploy, inspect the live page, request indexing when appropriate, and note Search Console impressions.",
];

export default function DailyUpdateSopPage() {
  return (
    <main className="page-shell">
      <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
        Daily Update SOP
      </h1>
      <p className="section-copy">
        The first 14 days should be boring on purpose: update Wend accurately, verify the site, deploy, and watch
        real data.
      </p>
      <section className="section rounded-lg border border-line bg-white p-5">
        <ol className="space-y-3 text-sm leading-6 text-slate-700">
          {steps.map((step) => (
            <li className="flex gap-3" key={step}>
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {steps.indexOf(step) + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
