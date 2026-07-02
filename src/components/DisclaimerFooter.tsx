import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function DisclaimerFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-center gap-3">
          <Image
            alt={site.logo.alt}
            className="h-10 w-10 rounded-lg object-cover shadow-sm"
            height={40}
            src={site.logo.headerSrc}
            width={40}
          />
          <div>
            <p className="font-black text-ink">WendAnswerToday</p>
            <p className="text-xs font-semibold text-slate-500">{site.logo.description}</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-600">{site.disclaimer}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
          <Link href="/contact">Contact</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
