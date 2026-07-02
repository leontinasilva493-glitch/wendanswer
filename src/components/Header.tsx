import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ExternalLink, Infinity } from "lucide-react";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link className="flex items-center gap-2 font-black text-ink" href="/">
          <Image
            alt={site.logo.alt}
            className="h-9 w-9 rounded-lg object-cover shadow-sm"
            height={36}
            priority
            src={site.logo.headerSrc}
            width={36}
          />
          <span>WendAnswerToday</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-700 md:flex">
          <Link href="/linkedin-wend-answer-today">Today</Link>
          <Link href="/linkedin-wend-solver">Solver</Link>
          <Link href="/linkedin-wend-archive">Archive</Link>
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 outline-none transition hover:text-brand focus-visible:text-brand [&::-webkit-details-marker]:hidden">
              <span>Wend Game</span>
              <ChevronDown aria-hidden className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-lg border border-line bg-white p-2 text-sm shadow-xl">
              <a
                className="flex items-start gap-3 rounded-md px-3 py-3 text-slate-700 transition hover:bg-brand/5 hover:text-brand focus-visible:bg-brand/5 focus-visible:text-brand focus-visible:outline-none"
                href="https://www.linkedin.com/games/wend"
                rel="nofollow noopener"
                target="_blank"
              >
                <ExternalLink aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-black text-ink">
                    Play Official Wend
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-normal text-success">
                      Official
                    </span>
                  </span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                    Open the official daily Wend game on LinkedIn in a new tab.
                  </span>
                </span>
              </a>
              <Link
                className="flex items-start gap-3 rounded-md px-3 py-3 text-slate-700 transition hover:bg-brand/5 hover:text-brand focus-visible:bg-brand/5 focus-visible:text-brand focus-visible:outline-none"
                href="/wend-unlimited"
              >
                <Infinity aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0">
                  <span className="block font-black text-ink">Wend Unlimited</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                    Play unofficial practice boards with submit-and-solve gameplay.
                  </span>
                </span>
              </Link>
            </div>
          </details>
          <Link href="/where-is-linkedin-wend">Find Wend</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
      </div>
    </header>
  );
}
