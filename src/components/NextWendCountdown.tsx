import { Clock3 } from "lucide-react";
import { NextWendCountdownTicker } from "@/components/NextWendCountdownTicker";

type NextWendCountdownProps = {
  dateLabel: string;
  puzzleNumber: number;
  releaseAtIso: string;
};

export function NextWendCountdown({ dateLabel, puzzleNumber, releaseAtIso }: NextWendCountdownProps) {
  return (
    <aside
      aria-label={`Countdown to Wend #${puzzleNumber} on ${dateLabel} at 8:00 UTC`}
      className="mx-auto mt-8 max-w-[760px] rounded-lg border border-line bg-white p-5 text-center shadow-lg shadow-slate-200/60 sm:p-6"
    >
      <p className="flex items-center justify-center gap-2 text-base font-black text-ink sm:text-lg">
        <Clock3 aria-hidden className="h-5 w-5 text-brand" />
        <span>Next Wend #{puzzleNumber} unlocks in</span>
      </p>

      <NextWendCountdownTicker releaseAtIso={releaseAtIso} />

      <p className="mt-4 text-sm font-semibold text-slate-600">Expected {dateLabel} at 8:00 UTC</p>
    </aside>
  );
}
