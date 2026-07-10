type LatestVerifiedWend = {
  date: string;
  dateLabel: string;
  isVerified: boolean;
  puzzleNumber: number;
  updatedAt: string;
  publication?: unknown;
};

type ExpectedWend = {
  date: string;
  dateLabel: string;
  puzzleNumber: number;
};

export function buildPublicWendStatus(latestVerified: LatestVerifiedWend, expected: ExpectedWend) {
  const current =
    latestVerified.isVerified &&
    latestVerified.date === expected.date &&
    latestVerified.puzzleNumber === expected.puzzleNumber;
  return {
    body: {
      current,
      expected,
      latestVerified: {
        date: latestVerified.date,
        dateLabel: latestVerified.dateLabel,
        isVerified: latestVerified.isVerified,
        publication: latestVerified.publication ?? null,
        puzzleNumber: latestVerified.puzzleNumber,
        updatedAt: latestVerified.updatedAt,
      },
      status: current ? "current" : "pending",
    },
    httpStatus: current ? 200 : 503,
  } as const;
}
