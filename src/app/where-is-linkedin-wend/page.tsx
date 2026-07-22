import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Where Is LinkedIn Wend?",
  description:
    "Find LinkedIn Wend, open the direct Wend game link, and troubleshoot when Wend is not showing on mobile or desktop.",
  path: "/where-is-linkedin-wend",
  imageTitle: "Where Is LinkedIn Wend?",
  imageSubtitle: "Direct link and quick fixes when Wend is not showing.",
});

const fixes = [
  "Open the direct official URL: linkedin.com/games/wend.",
  "Try desktop if the LinkedIn mobile app is not showing Wend yet.",
  "Update the LinkedIn app, then fully close and reopen it.",
  "Clear browser cache or try a private browser window if the game page loops.",
  "If the game is slow to load, wait for the board before chasing a fast time.",
];

export default function WhereIsLinkedInWendPage() {
  return (
    <main className="page-shell">
      <section>
        <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
          Where Is LinkedIn Wend?
        </h1>
        <p className="section-copy">
          Wend can be easy to miss when LinkedIn rolls out games unevenly. If Wend is not showing in the app,
          use the direct game link or switch between mobile and desktop.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className="btn btn-primary" href="https://www.linkedin.com/games/wend" rel="noopener noreferrer" target="_blank">
            Open LinkedIn Wend
          </a>
          <Link className="btn btn-ghost" href="/">
            Today’s Wend help
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Why can’t I see Wend?</h2>
        <p className="section-copy">
          LinkedIn game entry points can differ by account, app version, region, device, and rollout timing. That
          means a friend may see Wend before it appears in your own mobile or desktop menu.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">Quick fixes</h2>
        <div className="mt-5 grid gap-3">
          {fixes.map((fix, index) => (
            <article className="rounded-lg border border-line bg-white p-4" key={fix}>
              <p className="text-sm font-black text-brand">Step {index + 1}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{fix}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section rounded-lg border border-line bg-white p-5">
        <h2 className="text-2xl font-black text-ink">Trying to protect a streak?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          If LinkedIn Games are not loading or the timer feels wrong, use the smallest spoiler-safe hint first.
          You can still reveal one letter or one word without dumping the full answer.
        </p>
        <Link className="btn btn-primary mt-4" href="/#answer">
          Get today’s Wend hint
        </Link>
      </section>
    </main>
  );
}
