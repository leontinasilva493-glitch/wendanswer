import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const dispatch = await import("../src/lib/wend-dispatch.ts");
const publicStatus = await import("../src/lib/wend-public-status.ts");

assert.equal(dispatch.authorizeBearer(null, "secret"), false);
assert.equal(dispatch.authorizeBearer("Bearer wrong", "secret"), false);
assert.equal(dispatch.authorizeBearer("Bearer secret", "secret"), true);
assert.equal(dispatch.authorizeBearer("Bearer ", ""), false, "empty configuration must never authorize");

assert.deepEqual(dispatch.buildRepositoryDispatch("2026-07-10"), {
  event_type: "publish-wend-daily",
  client_payload: { expected_date: "2026-07-10" },
});
assert.equal(
  dispatch.githubRepositoryDispatchUrl("owner/wend-answer"),
  "https://api.github.com/repos/owner/wend-answer/dispatches",
);
assert.throws(() => dispatch.githubRepositoryDispatchUrl("not-a-repository"), /owner\/repository/);

const latest = {
  date: "2026-07-10",
  dateLabel: "July 10, 2026",
  isVerified: true,
  puzzleNumber: 32,
  updatedAt: "2026-07-10T10:42:08.123Z",
};
const expected = { date: "2026-07-10", dateLabel: "July 10, 2026", puzzleNumber: 32 };
const current = publicStatus.buildPublicWendStatus(latest, expected);
assert.equal(current.httpStatus, 200);
assert.equal(current.body.status, "current");
assert.equal(current.body.current, true);

const pending = publicStatus.buildPublicWendStatus(
  { ...latest, date: "2026-07-09", dateLabel: "July 9, 2026", puzzleNumber: 31 },
  expected,
);
assert.equal(pending.httpStatus, 503);
assert.equal(pending.body.status, "pending");
assert.equal(pending.body.current, false);
assert.deepEqual(pending.body.expected, expected);
assert.equal(pending.body.latestVerified.date, "2026-07-09");

const wrongNumber = publicStatus.buildPublicWendStatus({ ...latest, puzzleNumber: 31 }, expected);
assert.equal(wrongNumber.httpStatus, 503, "a matching date with the wrong puzzle number must stay pending");

const dispatchRoute = read("src/app/api/ops/wend-dispatch/route.ts");
assert.match(dispatchRoute, /Authorization/i, "dispatch route should require the Authorization header");
assert.match(dispatchRoute, /CRON_SECRET/, "dispatch route should require CRON_SECRET");
assert.match(dispatchRoute, /GITHUB_DISPATCH_TOKEN/, "dispatch route should keep the GitHub token server-side");
assert.match(dispatchRoute, /WEND_GITHUB_REPOSITORY/, "dispatch route should use an allowlisted repository");
assert.match(dispatchRoute, /status:\s*401/, "dispatch route should reject unauthorized calls");
assert.match(dispatchRoute, /status:\s*503/, "dispatch route should fail safely when configuration is missing");
assert.doesNotMatch(dispatchRoute, /source_url/, "public dispatch must not accept an arbitrary source URL");

const statusRoute = read("src/app/api/wend-status/route.ts");
assert.match(statusRoute, /force-dynamic/, "status endpoint should never be statically cached");
assert.match(statusRoute, /no-store/, "status endpoint should prohibit intermediary caching");
assert.match(statusRoute, /buildPublicWendStatus/, "status endpoint should use the tested current/pending policy");

console.log("wend ops routes test passed");
