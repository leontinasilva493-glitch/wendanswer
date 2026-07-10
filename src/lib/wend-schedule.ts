export const WEND_TIME_ZONE = "America/Los_Angeles";

const datePartsFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "2-digit",
  timeZone: WEND_TIME_ZONE,
  year: "numeric",
});

const dateLabelFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

const offsetFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: WEND_TIME_ZONE,
  timeZoneName: "longOffset",
});

function dateParts(date: Date) {
  const parts = Object.fromEntries(datePartsFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return { day: parts.day, month: parts.month, year: parts.year };
}

function addDays(date: string, amount: number) {
  const result = new Date(`${date}T00:00:00.000Z`);
  result.setUTCDate(result.getUTCDate() + amount);
  return result.toISOString().slice(0, 10);
}

function timeZoneOffsetMinutes(date: Date) {
  const label = offsetFormatter.formatToParts(date).find(({ type }) => type === "timeZoneName")?.value;
  const match = label?.match(/^GMT([+-])(\d{2}):?(\d{2})$/);
  if (!match) throw new Error(`Unable to resolve ${WEND_TIME_ZONE} offset for ${date.toISOString()}`);

  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "+" ? minutes : -minutes;
}

function startOfWendDate(date: string) {
  const utcMidnight = new Date(`${date}T00:00:00.000Z`);
  return new Date(utcMidnight.getTime() - timeZoneOffsetMinutes(utcMidnight) * 60_000);
}

export function expectedWendDate(now = new Date()) {
  const { day, month, year } = dateParts(now);
  return `${year}-${month}-${day}`;
}

export function nextWendRelease(now = new Date()) {
  return startOfWendDate(addDays(expectedWendDate(now), 1));
}

export function wendDateLabel(date: string) {
  return dateLabelFormatter.format(new Date(`${date}T00:00:00.000Z`));
}
