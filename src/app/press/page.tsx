import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, Mail } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const pressLinks = [
  {
    title: "Ko-fi Updates",
    source: "Ko-fi",
    description: "Updates and notes from the WendAnswerToday creator.",
    href: "https://ko-fi.com/duckweed43816/posts",
  },
  {
    title: "WendAnswer GitHub Repository",
    source: "GitHub",
    description: "Public source repository for WendAnswerToday.org development.",
    href: "https://github.com/leontinasilva493-glitch/wendanswer",
  },
  {
    title: "Linktree",
    source: "Linktree",
    description: "Creator link hub for WendAnswerToday-related profiles and updates.",
    href: "https://linktr.ee/duckweed1014",
  },
  {
    title: "F6S Founder Profile",
    source: "F6S",
    description: "Founder profile for Leontina Silva and related startup activity.",
    href: "https://www.f6s.com/leontina-silva",
  },
  {
    title: "AlternativeTo Profile",
    source: "AlternativeTo",
    description: "AlternativeTo user profile for Leontina Silva and related product activity.",
    href: "https://alternativeto.net/user/leontinasilva493-glitch",
  },
  {
    title: "StackShare Post",
    source: "StackShare",
    description: "StackShare post connected to Leontina Silva and related product activity.",
    href: "https://stackshare.io/posts/f989ee1abq",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Press",
  description:
    "Press links, external references, and creator contact information for WendAnswerToday.org.",
  path: "/press",
  imageTitle: "Press",
  imageSubtitle: "External links and references for WendAnswerToday.org.",
});

export default function PressPage() {
  return (
    <main className="page-shell">
      <section className="content-card">
        <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
          Press
        </h1>
        <p className="section-copy">
          Mentions, references, and external links for WendAnswerToday.org.
        </p>
      </section>

      <section className="section content-card">
        <h2 className="section-heading">External Links</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {pressLinks.map((item) => (
            <article className="inner-card" key={item.href}>
              <p className="text-xs font-black uppercase tracking-[0.08em] text-brand">{item.source}</p>
              <h3 className="mt-2 text-xl font-black text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
              <a
                className="btn btn-ghost mt-4 gap-2 border-brand text-brand"
                href={item.href}
                rel="nofollow noopener"
                target="_blank"
              >
                View Link
                <ExternalLink aria-hidden className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid gap-4 lg:grid-cols-2">
        <article className="content-card">
          <h2 className="section-heading">About WendAnswerToday</h2>
          <p className="section-copy">
            WendAnswerToday.org is an unofficial fan-made Wend help site with spoiler-safe hints, answer reveals,
            word paths, solver help, archive pages, and practice puzzles. It is not affiliated with, endorsed by,
            or sponsored by LinkedIn.
          </p>
        </article>
        <article className="content-card">
          <h2 className="section-heading">Press Contact</h2>
          <p className="section-copy">
            For corrections, link updates, or press questions, use the support email or contact page.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="btn btn-primary gap-2" href={`mailto:${site.supportEmail}`}>
              <Mail aria-hidden className="h-4 w-4" />
              {site.supportEmail}
            </a>
            <Link className="btn btn-ghost border-brand text-brand" href="/contact">
              Contact
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
