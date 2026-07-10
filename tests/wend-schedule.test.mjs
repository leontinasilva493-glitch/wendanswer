import assert from "node:assert/strict";

const browserSchedule = await import("../src/lib/wend-schedule.ts");
const nodeSchedule = await import("../scripts/wend-schedule.mjs");

const fixtures = [
  ["2026-07-10T06:59:59.999Z", "2026-07-09"],
  ["2026-07-10T07:00:00.000Z", "2026-07-10"],
  ["2026-01-10T07:59:59.999Z", "2026-01-09"],
  ["2026-01-10T08:00:00.000Z", "2026-01-10"],
  ["2026-03-08T07:59:59.999Z", "2026-03-07"],
  ["2026-03-08T08:00:00.000Z", "2026-03-08"],
  ["2026-11-01T06:59:59.999Z", "2026-10-31"],
  ["2026-11-01T07:00:00.000Z", "2026-11-01"],
];

for (const schedule of [browserSchedule, nodeSchedule]) {
  for (const [instant, expectedDate] of fixtures) {
    assert.equal(
      schedule.expectedWendDate(new Date(instant)),
      expectedDate,
      `${instant} should resolve to ${expectedDate} in America/Los_Angeles`,
    );
  }

  assert.equal(schedule.nextWendRelease(new Date("2026-07-10T12:00:00.000Z")).toISOString(), "2026-07-11T07:00:00.000Z");
  assert.equal(schedule.nextWendRelease(new Date("2026-01-10T12:00:00.000Z")).toISOString(), "2026-01-11T08:00:00.000Z");
  assert.equal(schedule.nextWendRelease(new Date("2026-03-08T12:00:00.000Z")).toISOString(), "2026-03-09T07:00:00.000Z");
  assert.equal(schedule.nextWendRelease(new Date("2026-11-01T12:00:00.000Z")).toISOString(), "2026-11-02T08:00:00.000Z");
  assert.equal(schedule.wendDateLabel("2026-07-10"), "July 10, 2026");
}

console.log("wend schedule test passed");
