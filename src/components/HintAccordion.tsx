"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Hint = {
  level: number;
  title: string;
  text: string;
};

export function HintAccordion({ hints }: { hints: Hint[] }) {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="space-y-3">
      {hints.map((hint) => (
        <div key={hint.level} className="inner-card overflow-hidden">
          <button
            className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left"
            onClick={() => setOpen(open === hint.level ? null : hint.level)}
            type="button"
          >
            <span>
              <span className="text-sm font-semibold text-hint">Hint {hint.level}</span>
              <span className="ml-2 text-sm font-semibold text-ink">{hint.title}</span>
            </span>
            <ChevronDown
              aria-hidden
              className={`h-5 w-5 text-slate-500 transition ${open === hint.level ? "rotate-180" : ""}`}
            />
          </button>
          {open === hint.level ? (
            <p className="border-t border-line px-4 py-3 text-sm leading-6 text-slate-700">{hint.text}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
