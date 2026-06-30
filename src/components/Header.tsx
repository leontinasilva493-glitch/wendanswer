import Image from "next/image";
import Link from "next/link";
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
          <Link href="/where-is-linkedin-wend">Find Wend</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
      </div>
    </header>
  );
}
