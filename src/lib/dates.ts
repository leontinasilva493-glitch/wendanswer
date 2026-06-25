export function monthSlug(dateLabel: string) {
  return dateLabel.toLowerCase().replace(",", "").replace(/\s+/g, "-");
}

export function wendSlug(puzzleNumber: number, dateLabel: string) {
  return `${puzzleNumber}-${monthSlug(dateLabel)}`;
}

export function wendArchiveSlug(puzzleNumber: number, dateLabel: string) {
  return `wend-answer-puzzle-${puzzleNumber}-${monthSlug(dateLabel)}`;
}

export function formatUpdated(iso: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}
