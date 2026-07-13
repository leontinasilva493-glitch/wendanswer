import type { Cell } from "./puzzles";

export type WendPlayDifficulty = "all" | "Easy" | "Medium" | "Hard";

export type WendPlayMeta = {
  currentPuzzleNumber: number;
  difficulty: WendPlayDifficulty;
};

export type WendPlayProgress = {
  selectedCells: Cell[];
  foundWords: string[];
  hintIndex: number;
  solved: boolean;
  updatedAt: string;
};

const metaKey = "wend-play-meta-v1";

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota / privacy mode failures.
  }
}

export function loadWendPlayMeta(): WendPlayMeta | null {
  return readJson<WendPlayMeta>(metaKey);
}

export function saveWendPlayMeta(meta: WendPlayMeta) {
  writeJson(metaKey, meta);
}

export function loadWendPlayProgress(puzzleNumber: number): WendPlayProgress | null {
  return readJson<WendPlayProgress>(`wend-play-progress-${puzzleNumber}`);
}

export function saveWendPlayProgress(puzzleNumber: number, progress: WendPlayProgress) {
  writeJson(`wend-play-progress-${puzzleNumber}`, progress);
}
