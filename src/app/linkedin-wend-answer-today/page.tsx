import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, CircleHelp, Lightbulb, Route, ShieldCheck, Sparkles } from "lucide-react";
import { FaqDetails } from "@/components/FaqDetails";
import { HintAccordion } from "@/components/HintAccordion";
import { JsonLd } from "@/components/JsonLd";
import { RelatedGames } from "@/components/RelatedGames";
import { WendAnswerReveal } from "@/components/WendAnswerReveal";
import { formatUpdated } from "@/lib/dates";
import { todayWend, wendPuzzles } from "@/lib/puzzles";
import { articleJson, breadcrumbJson, faqJson, pageMetadata } from "@/lib/seo";
import { expectedWendDisplay, isWendReadyForToday } from "@/lib/wend-status";

const path = "/linkedin-wend-answer-today";
const fallbackDescription =
  "Get today’s LinkedIn Wend hints, answer, word path, and spoiler-safe solver. Reveal one letter, one word, or the full path only when you need it.";

export const revalidate = 60;

function pageTitle(wendReady: boolean) {
  const expectedWend = expectedWendDisplay(todayWend);
  return wendReady
    ? `LinkedIn Wend Answer Today - ${todayWend.dateLabel} | Wend #${todayWend.puzzleNumber}`
    : `LinkedIn Wend Answer Today - ${expectedWend.dateLabel} | Wend #${expectedWend.puzzleNumber}`;
}

function pageDescription(wendReady: boolean) {
  const expectedWend = expectedWendDisplay(todayWend);
  return wendReady
    ? `Get the verified LinkedIn Wend answer for ${todayWend.dateLabel}, puzzle #${todayWend.puzzleNumber}, with spoiler-safe hints, word path, and reveal controls.`
    : `Get today's LinkedIn Wend answer status for ${expectedWend.dateLabel}, puzzle #${expectedWend.puzzleNumber}, plus spoiler-safe hints, word path help, and reveal controls.`;
}

export function generateMetadata(): Metadata {
  const wendReady = isWendReadyForToday(todayWend);
  const expectedWend = expectedWendDisplay(todayWend);
  const title = pageTitle(wendReady);
  const description = pageDescription(wendReady);

  return pageMetadata({
    title,
    description,
    path,
    type: "article",
    imageTitle: title,
    imageSubtitle: wendReady
      ? `${todayWend.dateLabel} - Wend #${todayWend.puzzleNumber}`
      : `${expectedWend.dateLabel} - Wend #${expectedWend.puzzleNumber}`,
    publishedTime: wendReady ? todayWend.date : undefined,
    modifiedTime: wendReady ? todayWend.updatedAt : undefined,
  });
}

const faq = [
  {
    question: "Can I reveal the full Wend answer immediately?",
    answer: "Yes. Use Reveal all if you are ready, or use Reveal Letter and Get Word to protect the rest of the puzzle.",
  },
  {
    question: "Does the solver use official screenshots?",
    answer: "No. The grid is rendered with custom HTML elements and does not use official game assets.",
  },
];

export default function WendTodayPage() {
  const wendReady = isWendReadyForToday(todayWend);
  const lastVerifiedWend = wendPuzzles.find((puzzle) => puzzle.isVerified) ?? todayWend;
  const displayWend = wendReady ? todayWend : lastVerifiedWend;
  const description = pageDescription(wendReady);

  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Wend Answer Today", path }])} />
      {wendReady ? (
        <JsonLd
          data={articleJson({
            headline: "LinkedIn Wend Answer Today",
            description,
            path,
            datePublished: todayWend.date,
            dateModified: todayWend.updatedAt,
          })}
        />
      ) : null}
      <JsonLd data={faqJson(faq)} />

      <section className="content-card grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="min-w-0">
          <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
            LinkedIn Wend Answer Today
          </h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold text-slate-700 sm:text-base">
            <span className="rounded-lg bg-white px-3 py-2">{todayWend.dateLabel}</span>
            <span className="rounded-lg bg-white px-3 py-2">Puzzle #{todayWend.puzzleNumber}</span>
            <span className="rounded-lg bg-white px-3 py-2">Updated {formatUpdated(todayWend.updatedAt)}</span>
          </div>
          <h2 className="mt-5 break-words text-xl font-black leading-tight text-ink sm:text-2xl">
            Wend #{todayWend.puzzleNumber} Hints, Word Path
            <span className="block">& Solution for {todayWend.dateLabel}</span>
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-700">
            Need a nudge, not a spoiler? Start with a gentle hint, reveal one word, or view the full path
            only when you need it.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a className="btn btn-secondary" href="#hints">
              Hint 1
            </a>
            <a className="btn btn-primary" href="#answer">
              Get Word
            </a>
            <a className="btn btn-success" href="#answer">
              Reveal all
            </a>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link className="chip" href="/linkedin-wend-solver">
              Open Solver
            </Link>
            <a className="chip" href="https://www.linkedin.com/games/" rel="nofollow noopener" target="_blank">
              Open LinkedIn Games
            </a>
          </div>
        </div>
        <div className="inner-card p-4">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Streak-safe help</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Save your streak without spoiling the whole puzzle</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Start with today’s hint, then reveal one letter or one word only if the path is still stuck.
          </p>
        </div>
      </section>

      <section className="section" id="answer">
        <WendAnswerReveal archived={!wendReady} puzzle={displayWend} />
      </section>

      <section className="section content-card" id="hints">
        <h2 className="section-heading">
          <span className="section-icon">
            <CircleHelp aria-hidden className="h-5 w-5" />
          </span>
          <span>Spoiler-safe hints</span>
        </h2>
        <div className="mt-5">
          <HintAccordion hints={displayWend.hints} />
        </div>
      </section>

      <section className="section content-card">
        <h2 className="section-heading">
          <span className="section-icon">
            <Route aria-hidden className="h-5 w-5" />
          </span>
          <span>Step-by-step explanation</span>
        </h2>
        <p className="section-copy">{displayWend.explanation}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link className="chip" href="/how-to-play-linkedin-wend">
            How to Play
          </Link>
          <Link className="chip" href="/how-to-solve-linkedin-wend">
            Solving Tips
          </Link>
        </div>
      </section>

      <section className="section grid gap-3 md:grid-cols-3">
        <article className="content-card">
          <h2 className="flex items-center gap-2 text-xl font-black text-ink">
            <Lightbulb aria-hidden className="h-5 w-5 text-hint" />
            Fast solving tip
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{displayWend.fastTip}</p>
        </article>
        <article className="content-card">
          <h2 className="flex items-center gap-2 text-xl font-black text-ink">
            <ShieldCheck aria-hidden className="h-5 w-5 text-brand" />
            Common mistake
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{displayWend.commonMistake}</p>
        </article>
        <article className="content-card">
          <h2 className="flex items-center gap-2 text-xl font-black text-ink">
            <BookOpen aria-hidden className="h-5 w-5 text-success" />
            Difficulty note
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{displayWend.difficultyNote}</p>
        </article>
      </section>

      <section className="section content-card">
        <h2 className="section-heading">
          <span className="section-icon">
            <Sparkles aria-hidden className="h-5 w-5" />
          </span>
          <span>Finished today's Wend?</span>
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
          Keep the session going with another Wend path, or check recent solved boards after you finish today's puzzle.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className="btn btn-primary" href="https://www.linkedin.com/games/wend" rel="nofollow noopener" target="_blank">
            Play Official Wend
          </a>
          <Link className="btn btn-ghost border-brand text-brand" href="/linkedin-wend-archive">
            View Wend Archive
          </Link>
        </div>
      </section>

      <section className="section content-card">
        <h2 className="section-heading">
          <span className="section-icon">
            <CircleHelp aria-hidden className="h-5 w-5" />
          </span>
          <span>Today’s LinkedIn Wend FAQ</span>
        </h2>
        <div className="mt-5 space-y-3">
          {faq.map((item) => (
            <FaqDetails answer={item.answer} key={item.question} question={item.question} textSize="text-base" />
          ))}
        </div>
      </section>

      <RelatedGames />
    </main>
  );
}
