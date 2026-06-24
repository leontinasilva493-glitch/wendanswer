import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact WendAnswerToday.org to report incorrect puzzle data, broken links, solver issues, or site feedback.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="page-shell">
      <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
        Contact
      </h1>
      <p className="section-copy">
        Found a wrong answer, broken link, or solver issue? Send the puzzle date, puzzle number, page URL, and a
        short description.
      </p>
      <section className="section rounded-lg border border-line bg-white p-5">
        <h2 className="text-2xl font-black text-ink">Support email</h2>
        <a className="mt-3 inline-flex text-lg font-bold text-brand" href={`mailto:${site.supportEmail}`}>
          {site.supportEmail}
        </a>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          During the 14-day launch window, reports about today&apos;s Wend puzzle should be checked before adding
          new expansion pages.
        </p>
      </section>
    </main>
  );
}
