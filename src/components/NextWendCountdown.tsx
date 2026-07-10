import { Clock3 } from "lucide-react";
import { NextWendCountdownTicker } from "@/components/NextWendCountdownTicker";

type NextWendCountdownProps = {
  dateLabel: string;
  puzzleNumber: number;
  releaseAtIso: string;
  placeholder?: boolean;
};

export function NextWendCountdown({
  dateLabel,
  puzzleNumber,
  releaseAtIso,
  placeholder = false,
}: NextWendCountdownProps) {
  const title = placeholder ? "Next Wend update placeholder" : `Next Wend #${puzzleNumber} unlocks in`;
  const footer = placeholder
    ? `Waiting for today's verified puzzle — expected ${dateLabel} at midnight Pacific Time`
    : `Expected ${dateLabel} at midnight Pacific Time`;

  return (
    <aside
      aria-label={
        placeholder
          ? "Wend countdown placeholder while today's puzzle finishes publishing"
          : `Countdown to Wend #${puzzleNumber} on ${dateLabel} at midnight Pacific Time`
      }
      className="mx-auto mt-7 max-w-[760px] rounded-lg border border-line bg-white px-5 py-4 text-center shadow-lg shadow-slate-200/60 sm:px-6"
    >
      <p className="flex items-center justify-center gap-2 text-base font-black text-ink sm:text-lg">
        <Clock3 aria-hidden className="h-5 w-5 text-brand" />
        <span>{title}</span>
      </p>

      <NextWendCountdownTicker placeholder={placeholder} releaseAtIso={releaseAtIso} />

      <p className="mt-3 text-sm font-semibold text-slate-600">{footer}</p>
    </aside>
  );
}
