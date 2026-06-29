"use client";

import { useEffect, useState } from "react";

type CountdownValue = {
  hours: number;
  minutes: number;
  seconds: number;
};

type NextWendCountdownTickerProps = {
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

export function NextWendCountdownTicker({ releaseAtIso }: NextWendCountdownTickerProps) {
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
    <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
      {boxes.map((box) => (
        <div className="flex items-baseline justify-center gap-2 rounded-lg bg-slate-50 px-3 py-3" key={box.label}>
          <span className="tabular-nums text-3xl font-black leading-none text-brand sm:text-4xl">{box.value}</span>
          <span className="text-xs font-extrabold text-slate-700 sm:text-sm">{box.label}</span>
        </div>
      ))}
    </div>
  );
}
