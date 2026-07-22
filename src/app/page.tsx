import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleHelp, ExternalLink, Lightbulb, ListChecks, Route, Zap } from "lucide-react";
import { ArchiveList } from "@/components/ArchiveList";
import { FaqDetails } from "@/components/FaqDetails";
import { HintAccordion } from "@/components/HintAccordion";
import { JsonLd } from "@/components/JsonLd";
import { NextWendCountdown } from "@/components/NextWendCountdown";
import { WendAnswerReveal } from "@/components/WendAnswerReveal";
import { WendFreshnessNotice } from "@/components/WendFreshnessNotice";
import { todayWend, wendPuzzles } from "@/lib/puzzles";
import { faqJson, pageMetadata } from "@/lib/seo";
import { expectedWendDisplay, isWendReadyForToday, nextWendDisplay } from "@/lib/wend-status";

export const revalidate = 60;

function latestVerifiedWend() {
  return wendPuzzles.find((puzzle) => puzzle.isVerified) ?? todayWend;
}

function displayedWend() {
  return isWendReadyForToday(todayWend) ? todayWend : latestVerifiedWend();
}

function shortDateLabel(dateLabel: string) {
  return dateLabel.replace(/,\s+\d{4}$/, "");
}

export function generateMetadata(): Metadata {
  const wendReady = isWendReadyForToday(todayWend);
  const expectedWend = expectedWendDisplay(todayWend);
  const heroWend = wendReady ? displayedWend() : expectedWend;

  return pageMetadata({
    title: wendReady
      ? `LinkedIn Wend Answer Today #${heroWend.puzzleNumber} — ${heroWend.dateLabel}`
      : `LinkedIn Wend Answer Today #${heroWend.puzzleNumber} — ${shortDateLabel(heroWend.dateLabel)} (Verifying)`,
    description: wendReady
      ? `Get the verified LinkedIn Wend answer today for ${heroWend.dateLabel} (Wend #${heroWend.puzzleNumber}). Reveal a hint, one letter, one word, or the complete path without unwanted spoilers.`
      : `The LinkedIn Wend answer for ${heroWend.dateLabel} (Wend #${heroWend.puzzleNumber}) is being verified. Use the latest verified hints and paths without mistaking them for today’s puzzle.`,
    path: "/",
    keywords: [
      "linkedin wend",
      "linkedin wend answer",
      "wend linkedin",
      "wend linkedin answer",
      "wend answer today",
      `wend answer ${heroWend.dateLabel}`,
      `wend #${heroWend.puzzleNumber} answer`,
      "wend answers",
      "wend full answer",
      "wend answer for date",
      "wend answer for LinkedIn Games",
    ],
    absoluteTitle: true,
    imageTitle: wendReady
      ? `LinkedIn Wend #${heroWend.puzzleNumber} Answer`
      : `LinkedIn Wend #${heroWend.puzzleNumber} Status`,
    imageSubtitle: wendReady
      ? `LinkedIn Wend answer today for ${heroWend.dateLabel}.`
      : `Verification pending for ${heroWend.dateLabel}.`,
  });
}

function homepageFaq(wendReady: boolean) {
  return [
    {
      question: "What time does a new LinkedIn Wend puzzle appear?",
      answer:
        "The official LinkedIn Wend puzzle is expected around midnight Pacific Time. This page publishes the corresponding answer only after the new grid and its paths have been verified.",
    },
    {
      question: "Can I get a hint without seeing the full answer?",
      answer:
        "Yes. Start with the spoiler-safe hints, then reveal one letter or one word. The full LinkedIn Wend answer remains hidden until you choose to show it.",
    },
    wendReady
      ? {
          question: "How is today's LinkedIn Wend answer verified?",
          answer:
            "Each published word follows the rendered grid path through adjacent open cells and avoids every blocked hole, so the visible answer matches the displayed board.",
        }
      : {
          question: "Why does the page say verification pending?",
          answer:
            "It means the current puzzle is known but its solution has not passed the site's checks yet. The latest verified puzzle remains available with its original date and number.",
        },
    {
      question: "Where can I find older LinkedIn Wend answers?",
      answer:
        "Open the LinkedIn Wend archive and choose a puzzle by number or date. Each archive URL preserves that puzzle's own hints, words, path explanation, and verification date, which makes it safer to share than a changing today page.",
    },
  ];
}

export default function HomePage() {
  const archivePuzzles = wendPuzzles;
  const recentArchivePuzzles = archivePuzzles.slice(0, 4);
  const wendReady = isWendReadyForToday(todayWend);
  const lastVerifiedWend = latestVerifiedWend();
  const displayWend = wendReady ? todayWend : lastVerifiedWend;
  const expectedWend = expectedWendDisplay(todayWend);
  const heroWend = wendReady ? displayWend : expectedWend;
  const nextWend = nextWendDisplay(displayWend);
  const faq = homepageFaq(wendReady);

  return (
    <main className="page-shell">
      <JsonLd data={faqJson(faq)} />

      <section className="mx-auto max-w-4xl py-12 text-center md:py-16">
        <p className="mx-auto mb-4 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-black text-brand shadow-sm">
          <span>Wend #{heroWend.puzzleNumber} {wendReady ? "answer" : "status"}</span>
          <span aria-hidden className="text-slate-300">
            |
          </span>
          <span>{heroWend.dateLabel}</span>
          <span aria-hidden className="text-slate-300">
            |
          </span>
          <span>updated daily at midnight Pacific Time</span>
        </p>
        <h1 className="break-words text-4xl font-black leading-tight tracking-normal text-ink sm:text-5xl md:text-6xl">
          LinkedIn Wend Answer Today #{heroWend.puzzleNumber} — {heroWend.dateLabel}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-700 md:text-xl">
          {wendReady
            ? "Open the official LinkedIn Wend game, get a spoiler-safe clue, or check today’s verified answer. Reveal one letter or one word first, then view the complete path only if you still need it."
            : "Today’s LinkedIn Wend answer is still being checked. You can open the official game now or use the latest verified puzzle below, clearly labeled with its original date and puzzle number."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a className="btn btn-primary min-w-[12rem] gap-2" href="#answer">
            {wendReady ? "Get Today's Answer" : "View Latest Verified Answer"}
            <ArrowRight aria-hidden className="h-5 w-5" />
          </a>
          <a
            className="btn btn-ghost min-w-[12rem] gap-2 border-brand text-brand"
            href="https://www.linkedin.com/games/wend"
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink aria-hidden className="h-5 w-5" />
            Official Wend Game
          </a>
        </div>
        {!wendReady ? (
          <WendFreshnessNotice
            expectedDateLabel={expectedWend.dateLabel}
            expectedPuzzleNumber={expectedWend.puzzleNumber}
            fallbackDateLabel={displayWend.dateLabel}
            fallbackPuzzleNumber={displayWend.puzzleNumber}
          />
        ) : null}
        <NextWendCountdown
          dateLabel={nextWend.dateLabel}
          placeholder={!wendReady}
          puzzleNumber={nextWend.puzzleNumber}
          releaseAtIso={nextWend.releaseAtIso}
        />
      </section>

      <section className="section" data-nosnippet={!wendReady ? "" : undefined} id="answer">
        <WendAnswerReveal archived={!wendReady} latestVerified={!wendReady} puzzle={displayWend} />
      </section>

      <section className="section grid gap-6 lg:grid-cols-2" id="hints">
        <div className="content-card">
          <h2 className="section-heading">
            <span className="section-icon">
              <Lightbulb aria-hidden className="h-5 w-5" />
            </span>
            <span>LinkedIn Wend hints without full spoilers</span>
          </h2>
          <div className="mt-5">
            <HintAccordion hints={displayWend.hints} />
          </div>
        </div>

        <div className="content-card">
          <h2 className="section-heading">
            <span className="section-icon">
              <Route aria-hidden className="h-5 w-5" />
            </span>
            <span>
              {wendReady
                ? "How today’s LinkedIn Wend answer is solved"
                : "How the latest verified LinkedIn Wend answer is solved"}
            </span>
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-700">{displayWend.explanation}</p>
          <Link className="btn btn-ghost mt-5 gap-2 border-brand text-brand" href="/how-to-solve-linkedin-wend">
            Learn Solving Strategies
            <ArrowRight aria-hidden className="h-5 w-5" />
          </Link>
        </div>

        <div className="content-card lg:col-span-2">
          <h2 className="section-heading">
            <span className="section-icon">
              <CircleHelp aria-hidden className="h-5 w-5" />
            </span>
            <span>LinkedIn Wend questions and answers</span>
          </h2>
          <div className="mt-5 space-y-3">
            {faq.map((item) => (
              <FaqDetails answer={item.answer} key={item.question} question={item.question} />
            ))}
          </div>
          <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand" href="/faq">
            View all FAQs
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="section grid gap-3 md:grid-cols-3">
        <article className="content-card">
          <h2 className="flex items-center gap-2 text-lg font-black text-ink">
            <Zap aria-hidden className="h-5 w-5 text-hint" />
            LinkedIn Wend solving tip
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{displayWend.fastTip}</p>
        </article>
        <article className="content-card">
          <h2 className="flex items-center gap-2 text-lg font-black text-ink">
            <ListChecks aria-hidden className="h-5 w-5 text-brand" />
            Common Wend path mistake
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{displayWend.commonMistake}</p>
        </article>
        <article className="content-card">
          <h2 className="flex items-center gap-2 text-lg font-black text-ink">
            <CircleHelp aria-hidden className="h-5 w-5 text-success" />
            {wendReady ? "Today’s Wend difficulty" : "Latest verified Wend difficulty"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{displayWend.difficultyNote}</p>
        </article>
      </section>

      <section className="section grid gap-6 lg:grid-cols-2">
        <article className="content-card">
          <h2 className="text-2xl font-black text-ink">What is the LinkedIn Wend game?</h2>
          <p className="section-copy">
            LinkedIn Wend is a daily word-path puzzle in LinkedIn Games. Each board contains letters and blocked hole
            cells. Your job is to trace the hidden words through adjacent open cells so the completed paths account for
            the playable grid. A path can turn, but it cannot cross a blocked cell.
          </p>
          <p className="section-copy">
            This page is a spoiler-safe companion to the official Wend game. Use the official game link when you want
            to play, then return here only for the level of help you need. The answer stays hidden by default, so
            opening the page does not reveal every word automatically.
          </p>
        </article>

        <article className="content-card">
          <h2 className="text-2xl font-black text-ink">How to use today’s LinkedIn Wend answer</h2>
          <p className="section-copy">
            Try the LinkedIn Wend puzzle before opening the full solution. The help controls are ordered from the
            lightest clue to the strongest reveal, which lets you protect your streak without losing the satisfaction
            of finishing the board yourself.
          </p>
          <p className="section-copy">
            Start with a spoiler-safe hint. A hint points you toward a constrained area, useful starting word, or route
            pattern without displaying the answer. Look at word lengths, edge cells, and spaces beside holes before
            revealing anything else.
          </p>
          <p className="section-copy">
            If the path is still unclear, reveal one letter or one word. One letter can confirm direction while leaving
            most of the puzzle intact. One word can unlock the remaining routes because every solved path removes
            possibilities from the open cells.
          </p>
          <p className="section-copy">
            Use the complete LinkedIn Wend answer only when you want to verify the board. The full reveal shows the
            answer words and their paths together, so you can compare the route with your own attempt instead of
            reading an isolated word list.
          </p>
        </article>

        <article className="content-card lg:col-span-2">
          <h2 className="text-2xl font-black text-ink">A practical Wend solving checklist</h2>
          <p className="section-copy">
            Before using a reveal, scan the board as a set of constrained routes rather than a normal word search.
            Count the open cells, note the answer lengths, and mark edge letters or narrow spaces beside blocked holes.
            Those cells usually have fewer legal exits, so they give you stronger starting evidence than a familiar
            letter sequence in the middle of the grid.
          </p>
          <p className="section-copy">
            Start with the route that has the fewest choices. Trace it slowly through adjacent cells and stop as soon as
            one move would isolate an unused area. A valid path must leave enough connected space for every unsolved
            word. If two routes seem possible, keep both in mind instead of committing the board to the first word you
            recognize.
          </p>
          <p className="section-copy">
            Compare the unsolved cells with the remaining word lengths after every confirmed path. A seven-letter space
            cannot hold a six-letter answer, and a pocket separated by holes may determine which word belongs there.
            Rechecking the available cell count often exposes a wrong turn before you spend time tracing the rest of
            the board.
          </p>
          <p className="section-copy">
            If a guess forces another path to cross a blocked cell, reuse a letter, or strand an open cell, backtrack to
            the last branch. Ask for the next letter only when the board geometry cannot separate the alternatives. That
            keeps the hint useful while preserving as much of the solve as possible.
          </p>
        </article>
      </section>

      <section className="section grid gap-6 lg:grid-cols-2">
        <article className="content-card">
          <h2 className="text-2xl font-black text-ink">How we verify each LinkedIn Wend answer</h2>
          <p className="section-copy">
            Every published LinkedIn Wend answer is tied to one puzzle number and one Pacific Time date. Before the
            page labels a puzzle as today’s answer, the word list and rendered paths are checked against the grid: the
            paths must use adjacent open cells, avoid blocked holes, and remain consistent with the displayed solution.
          </p>
          <p className="section-copy">
            When the current board has not passed those checks, the page shows “Verification pending.” It may still
            offer the latest verified puzzle, but that older puzzle is labeled with its own date and number. This
            prevents an earlier Wend answer from being presented as today’s result. The page updates after the new
            puzzle is released and the verification step is complete.
          </p>
        </article>

        <article className="content-card">
          <h2 className="text-2xl font-black text-ink">Where to play the LinkedIn Wend game</h2>
          <p className="section-copy">
            Play LinkedIn Wend on the{" "}
            <a
              className="font-bold text-brand"
              href="https://www.linkedin.com/games/wend"
              rel="noopener noreferrer"
              target="_blank"
            >
              official LinkedIn Games page
            </a>
            . If Wend is missing from your game list, use our{" "}
            <Link className="font-bold text-brand" href="/where-is-linkedin-wend">
              LinkedIn Wend availability guide
            </Link>{" "}
            for the direct game link and basic browser, account, and device checks. You can also{" "}
            <Link className="font-bold text-brand" href="/how-to-play-linkedin-wend">
              read the rules
            </Link>{" "}
            before starting if this is your first board.
          </p>
          <p className="section-copy">
            WendAnswerToday.org is an independent, fan-made help site. It does not host the official LinkedIn Wend game
            and is not affiliated with LinkedIn. Its purpose is to provide clearly labeled hints, answer paths,{" "}
            <Link className="font-bold text-brand" href="/linkedin-wend-solver">
              solver help
            </Link>
            , and a{" "}
            <Link className="font-bold text-brand" href="/linkedin-wend-archive">
              dated archive
            </Link>{" "}
            without forcing spoilers.
          </p>
        </article>
      </section>

      <section className="section">
        <p className="inline-flex rounded-sm bg-slate-200 px-3 py-2 text-sm font-black uppercase tracking-normal text-slate-700">
          Recent puzzles
        </p>
        <h2 className="mt-5 break-words text-3xl font-black leading-tight tracking-normal text-ink md:text-4xl">
          Recent LinkedIn Wend Answers
        </h2>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-700">
          Need an earlier puzzle? The archive groups every verified LinkedIn Wend answer by puzzle number and date.
          Each archive page keeps its own hints, answer words, and path explanation, so a past puzzle is never labeled
          as today. Use it to check a puzzle shared by a colleague, compare recent difficulty, or practice the route
          rules on a completed board.
        </p>
        <div className="mt-5">
          <ArchiveList puzzles={recentArchivePuzzles} variant="preview" />
        </div>
        <div className="mt-8 flex justify-center">
          <Link className="btn btn-primary gap-2 rounded-full px-8" href="/linkedin-wend-archive">
            View Full Archive
            <ArrowRight aria-hidden className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
