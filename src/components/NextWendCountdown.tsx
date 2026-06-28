"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

type CountdownValue = {
  hours: number;
  minutes: number;
  seconds: number;
};

type NextWendCountdownProps = {
  dateLabel: string;
  isCurrentPuzzleReady: boolean;
  puzzleNumber: number;
  releaseAtIso: string;
};

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function getRemaining(releaseAtIso: string): CountdownValue {
  const totalSeconds = Math.max(0, Math.floor((Date.parse(releaseAtIso) - Date.now()) / 1000));

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function NextWendCountdown({
  dateLabel,
  isCurrentPuzzleReady,
  puzzleNumber,
  releaseAtIso,
}: NextWendCountdownProps) {
  const [remaining, setRemaining] = useState<CountdownValue | null>(null);

  useEffect(() => {
    const updateRemaining = () => setRemaining(getRemaining(releaseAtIso));

    updateRemaining();
    const timer = window.setInterval(updateRemaining, 1000);

    return () => window.clearInterval(timer);
  }, [releaseAtIso]);

  const boxes = [
    { label: "Hours", value: remaining ? pad(remaining.hours) : "--" },
    { label: "Minutes", value: remaining ? pad(remaining.minutes) : "--" },
    { label: "Seconds", value: remaining ? pad(remaining.seconds) : "--" },
  ];

  return (
    <section className="section content-card">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-brand">
            <Clock3 aria-hidden className="h-4 w-4" />
            Next Wend update
          </p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-ink md:text-3xl">
            Next LinkedIn Wend puzzle unlocks in
          </h2>
          <p className="mt-3 text-base font-extrabold text-slate-700">
            {dateLabel} · Wend #{puzzleNumber} · expected at 8:00 UTC
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            LinkedIn Wend usually resets at 8:00 UTC. We update the answer page after the new puzzle is verified,
            so this timer is useful for tomorrow's Wend answer and next-puzzle searches without promising an
            unverified solution.
          </p>
          {!isCurrentPuzzleReady ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">
              The visible game module may use the latest verified puzzle while today's answer is catching up; this
              countdown still tracks the next scheduled Wend reset.
            </p>
          ) : null}
        </div>

        <div
          aria-label={`Countdown to Wend #${puzzleNumber} on ${dateLabel} at 8:00 UTC`}
          className="grid grid-cols-3 gap-3"
        >
          {boxes.map((box) => (
            <div
              className="min-w-[5.25rem] rounded-lg border border-line bg-slate-50 px-4 py-4 text-center shadow-sm"
              key={box.label}
            >
              <div className="tabular-nums text-3xl font-black leading-none text-brand md:text-4xl">{box.value}</div>
              <div className="mt-2 text-xs font-extrabold uppercase tracking-wide text-slate-600">{box.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
