import { Clock3, ShieldCheck } from "lucide-react";

type WendFreshnessNoticeProps = {
  expectedDateLabel: string;
  expectedPuzzleNumber: number;
  fallbackDateLabel: string;
  fallbackPuzzleNumber: number;
};

export function WendFreshnessNotice({
  expectedDateLabel,
  expectedPuzzleNumber,
  fallbackDateLabel,
  fallbackPuzzleNumber,
}: WendFreshnessNoticeProps) {
  return (
    <aside
      aria-live="polite"
      className="mx-auto mt-6 max-w-4xl rounded-xl border border-amber-300 bg-amber-50 p-5 text-left text-amber-950 shadow-sm"
      role="status"
    >
      <div className="flex items-start gap-3">
        <Clock3 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <p className="font-black">Verification pending for Wend #{expectedPuzzleNumber}</p>
          <p className="mt-1 text-sm leading-6">
            Today&apos;s answer for {expectedDateLabel} is being verified. We will not present an older or
            unverified board as today&apos;s answer.
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm font-bold">
            <ShieldCheck aria-hidden className="h-4 w-4" />
            Latest verified: Wend #{fallbackPuzzleNumber} from {fallbackDateLabel}
          </p>
        </div>
      </div>
    </aside>
  );
}
