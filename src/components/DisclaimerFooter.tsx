import Link from "next/link";
import { site } from "@/lib/site";

export function DisclaimerFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm leading-6 text-slate-600">{site.disclaimer}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/status">Status</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/llms.txt">llms.txt</Link>
        </div>
      </div>
    </footer>
  );
}
