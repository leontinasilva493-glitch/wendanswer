import assert from "node:assert/strict";
import { waitForWendProduction } from "../scripts/wait-for-wend-production.mjs";

function response(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return body;
    },
  };
}

let elapsed = 0;
const calls = [];
const results = [
  response(503, { status: "pending", latestVerified: { date: "2026-07-09", puzzleNumber: 31 } }),
  response(200, {
    current: true,
    expected: { date: "2026-07-10", puzzleNumber: 32 },
    latestVerified: { date: "2026-07-10", puzzleNumber: 32 },
    status: "current",
  }),
];

const current = await waitForWendProduction({
  baseUrl: "https://example.com/",
  expectedDate: "2026-07-10",
  expectedPuzzleNumber: 32,
  fetchImpl: async (url, options) => {
    calls.push({ options, url });
    return results.shift();
  },
  now: () => elapsed,
  pollMs: 1_000,
  sleep: async (ms) => {
    elapsed += ms;
  },
  timeoutMs: 5_000,
});
assert.equal(current.latestVerified.puzzleNumber, 32);
assert.equal(calls.length, 2);
assert.equal(calls[0].url, "https://example.com/api/wend-status");
assert.equal(calls[0].options.cache, "no-store");

elapsed = 0;
await assert.rejects(
  () =>
    waitForWendProduction({
      baseUrl: "https://example.com",
      expectedDate: "2026-07-10",
      expectedPuzzleNumber: 32,
      fetchImpl: async () =>
        response(200, {
          current: true,
          expected: { date: "2026-07-10", puzzleNumber: 32 },
          latestVerified: { date: "2026-07-10", puzzleNumber: 31 },
          status: "current",
        }),
      now: () => elapsed,
      pollMs: 1_000,
      sleep: async (ms) => {
        elapsed += ms;
      },
      timeoutMs: 2_000,
    }),
  /Timed out.*2026-07-10.*Wend #32.*last response.*#31/i,
);

console.log("wend production gate test passed");
