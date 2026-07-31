import assert from "node:assert/strict";
import { redirectDestinationPath } from "../scripts/http-checks.mjs";

const baseUrl = "http://127.0.0.1:3210";
const destination = "/wend-answer-puzzle-51-july-29-2026";

assert.equal(redirectDestinationPath(destination, baseUrl), destination);
assert.equal(
  redirectDestinationPath(`${destination}, ${destination}`, baseUrl),
  destination,
  "duplicate identical Location values should resolve to the same safe destination",
);
assert.equal(
  redirectDestinationPath(`${destination}, /different-target`, baseUrl),
  null,
  "conflicting Location values must not be accepted",
);
assert.equal(redirectDestinationPath(null, baseUrl), null);

console.log("HTTP redirect Location normalization test passed");
