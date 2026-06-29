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
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 className="max-w-3xl text-2xl font-black leading-tight text-ink md:text-4xl">
          LinkedIn Wend #{puzzleNumber} unlocks in
        </h2>
        <p className="mt-3 text-base font-extrabold text-slate-700 md:text-lg">
          Next Wend answer for {dateLabel} - expected at 8:00 UTC
        </p>

        <div
          aria-label={`Countdown to Wend #${puzzleNumber} on ${dateLabel} at 8:00 UTC`}
          className="mt-6 grid grid-cols-3 gap-3 sm:gap-4"
        >
          {boxes.map((box) => (
            <div
              className="min-w-[5.25rem] rounded-lg border border-line bg-white px-4 py-5 text-center shadow-md shadow-slate-200/70"
              key={box.label}
            >
              <div className="tabular-nums text-4xl font-black leading-none text-brand md:text-5xl">{box.value}</div>
              <div className="mt-3 text-xs font-extrabold text-slate-700 md:text-sm">{box.label}</div>
            </div>
          ))}
        </div>

        <p className="mt-6 inline-flex max-w-full items-start gap-2 rounded-full bg-amber-100 px-5 py-3 text-sm font-semibold leading-6 text-amber-950">
          <Clock3 aria-hidden className="mt-1 h-4 w-4 shrink-0" />
          <span>
            Wend #{puzzleNumber} is expected on {dateLabel} at 8:00 UTC.
            {!isCurrentPuzzleReady
              ? " The current answer may show the latest verified puzzle until the new one is checked."
              : ""}
          </span>
        </p>
      </div>
    </section>
  );
}
