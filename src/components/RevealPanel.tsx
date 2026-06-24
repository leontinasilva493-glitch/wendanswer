"use client";

import { useState } from "react";

export function RevealPanel({
  label,
  children,
  tone = "blue",
}: {
  label: string;
  children: React.ReactNode;
  tone?: "blue" | "amber" | "green";
}) {
  const [open, setOpen] = useState(false);
  const toneClass =
    tone === "amber"
      ? "border-hint bg-amber-50 text-amber-950"
      : tone === "green"
        ? "border-success bg-green-50 text-green-950"
        : "border-brand bg-blue-50 text-blue-950";

  return (
    <div className={`rounded-lg border ${toneClass}`}>
      <button
        className="flex min-h-11 w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span>{label}</span>
        <span aria-hidden>{open ? "Hide" : "Show"}</span>
      </button>
      {open ? <div className="border-t border-current/15 px-4 py-3 text-sm">{children}</div> : null}
    </div>
  );
}
