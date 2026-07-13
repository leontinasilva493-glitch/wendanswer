import type { Metadata } from "next";
import Link from "next/link";
import { CircleHelp, Infinity, ShieldCheck, Sparkles, Route, Undo2, Share2 } from "lucide-react";
import { FaqDetails } from "@/components/FaqDetails";
import { JsonLd } from "@/components/JsonLd";
import { WendUnlimitedGame } from "@/components/WendUnlimitedGame";
import { breadcrumbJson, faqJson, howToJson, pageMetadata } from "@/lib/seo";
import { unlimitedWendPuzzles } from "@/lib/wend-unlimited";

const path = "/play-wend";

export const metadata: Metadata = pageMetadata({
  title: "Play Wend Unlimited",
  description:
    "Play Wend Unlimited online with no login, previous and next puzzle controls, hints, undo, solved state, and local progress.",
  path,
  imageTitle: "Play Wend Unlimited",
  imageSubtitle: "No login practice with local progress and verified Wend-style puzzles.",
  keywords: [
    "wend unlimited",
    "play wend unlimited",
    "wend game online",
    "linkedin wend game no login",
    "wend practice puzzle",
  ],
});

const howTo = [
  {
    name: "Start a puzzle",
    text: "Open Play Wend Unlimited and choose New puzzle, Previous, or Next. Your last puzzle opens from local progress.",
  },
  {
    name: "Trace a path",
    text: "Tap adjacent letters to build a Wend path, then use Undo if you need to step back one move.",
  },
  {
    name: "Use hints when stuck",
    text: "Tap Hint to reveal the next spoiler-light clue from the puzzle's built-in hint ladder.",
  },
  {
    name: "Finish and share",
    text: "Solve the board, keep your local progress in this browser, and copy or share the completion result.",
  },
];

const faq = [
  {
    question: "Do I need a LinkedIn login to play?",
    answer: "No. Play Wend Unlimited works in the browser with no login and stores progress locally on this device.",
  },
  {
    question: "Is this the official LinkedIn Wend game?",
    answer: "No. This is an unofficial practice tool built for Wend-style puzzle solving and SEO-safe discovery.",
  },
  {
    question: "What happens to my progress?",
    answer: "Your current puzzle, found words, hints, and solved state are saved in local storage so you can continue later.",
  },
  {
    question: "Can I switch puzzles without losing my place?",
    answer: "Yes. Previous, Next, and automatic local restore let you move around the bank and keep each puzzle's progress in this browser.",
  },
];

export default function PlayWendPage() {
  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Play Wend Unlimited", path }])} />
      <JsonLd
        data={howToJson({
          name: "How to play Wend Unlimited",
          description: "Learn the lightweight flow for playing unofficial Wend practice puzzles online.",
          path,
          steps: howTo,
        })}
      />
      <JsonLd data={faqJson(faq)} />

      <section className="content-card grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-normal text-brand">Unofficial Wend practice tool</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal text-ink md:text-5xl">Play Wend Unlimited</h1>
          <p className="section-copy">
            Play Wend Unlimited online with no login. New puzzle, Previous, Next, Hint, Undo, solved state, Share
            result, and local progress are all built into this practice mode.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="chip" href="#game">
              Start Playing
            </Link>
            <Link className="chip" href="/linkedin-wend-answer-today">
              Today Answer
            </Link>
            <Link className="chip" href="#how-to-play">
              How to Play
            </Link>
            <Link className="chip" href="#faq">
              FAQ
            </Link>
          </div>
        </div>
        <div className="inner-card p-4">
          <div className="flex items-center gap-2">
            <span className="section-icon">
              <Infinity aria-hidden className="h-5 w-5" />
            </span>
            <p className="text-sm font-black uppercase tracking-normal text-brand">No login practice</p>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <p className="font-semibold">Official Wend is still the daily LinkedIn game.</p>
            <p>This page is the internal practice tool for repeat solving, not a replacement for the official game.</p>
            <div className="grid gap-2 rounded-lg border border-line bg-slate-50 p-3">
              <div className="flex items-center gap-2 font-black text-ink">
                <ShieldCheck aria-hidden className="h-4 w-4 text-success" />
                Local progress stays in this browser
              </div>
              <div className="flex items-center gap-2 font-black text-ink">
                <Undo2 aria-hidden className="h-4 w-4 text-brand" />
                Undo and Hint are built in
              </div>
              <div className="flex items-center gap-2 font-black text-ink">
                <Share2 aria-hidden className="h-4 w-4 text-brand" />
                Share the solved result
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="game">
        <WendUnlimitedGame puzzles={unlimitedWendPuzzles} />
      </section>

      <section className="section content-card" id="how-to-play">
        <h2 className="section-heading">
          <span className="section-icon">
            <Route aria-hidden className="h-5 w-5" />
          </span>
          <span>How to play</span>
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {howTo.map((item, index) => (
            <article className="inner-card p-4" key={item.name}>
              <p className="text-xs font-black uppercase tracking-normal text-brand">Step {index + 1}</p>
              <h3 className="mt-2 text-lg font-black text-ink">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section content-card">
        <h2 className="section-heading">
          <span className="section-icon">
            <CircleHelp aria-hidden className="h-5 w-5" />
          </span>
          <span>FAQ</span>
        </h2>
        <div className="mt-5 space-y-3" id="faq">
          {faq.map((item) => (
            <FaqDetails answer={item.answer} key={item.question} question={item.question} textSize="text-base" />
          ))}
        </div>
      </section>

      <section className="section content-card" id="official-compare">
        <h2 className="section-heading">
          <span className="section-icon">
            <Sparkles aria-hidden className="h-5 w-5" />
          </span>
          <span>Official Wend vs Play Wend Unlimited</span>
        </h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <article className="inner-card p-4">
            <p className="text-sm font-black uppercase tracking-normal text-slate-500">Official Wend</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <li>Daily puzzle on LinkedIn.</li>
              <li>Requires the LinkedIn game surface.</li>
              <li>Best for the real streak.</li>
            </ul>
          </article>
          <article className="inner-card p-4">
            <p className="text-sm font-black uppercase tracking-normal text-brand">Play Wend Unlimited</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <li>No login practice tool with local progress.</li>
              <li>Previous, Next, Hint, Undo, and Share result.</li>
              <li>Good for repeat solving and puzzle drills.</li>
            </ul>
          </article>
        </div>
        <div className="mt-4">
          <Link className="btn btn-primary" href="/linkedin-wend-answer-today">
            Open Today Answer
          </Link>
        </div>
      </section>
    </main>
  );
}
