import { ChevronDown } from "lucide-react";

export function FaqDetails({
  answer,
  question,
  textSize = "text-sm",
}: {
  answer: string;
  question: string;
  textSize?: "text-sm" | "text-base";
}) {
  return (
    <details className="inner-card group overflow-hidden">
      <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-left font-black text-ink ${textSize}`}>
        <span>{question}</span>
        <ChevronDown aria-hidden className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-180" />
      </summary>
      <p className="border-t border-line px-4 py-3 text-sm leading-6 text-slate-700">{answer}</p>
    </details>
  );
}
