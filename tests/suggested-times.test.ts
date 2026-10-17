import {
  localDatetimeStringToUtc,
  nextSuggestedDate,
  suggestedTimeToInputValue,
} from "../lib/utils/schedule-prefill.ts";

function assertEquals<T>(actual: T, expected: T, msg?: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${msg ?? "assertEquals"}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

const BUDAPEST = "Europe/Budapest";

Deno.test("Monday 08:00 Budapest (DST) fills the field as 08:00, not 06:00", () => {
  const slot = new Date("2026-10-19T06:00:00.000Z"); // 08:00 CEST
  assertEquals(suggestedTimeToInputValue(slot, BUDAPEST), "2026-10-19T08:00");
});

Deno.test("Tuesday 10:00 Budapest (DST) fills the field as 10:00, not 08:00", () => {
  const slot = new Date("2026-10-20T08:00:00.000Z"); // 10:00 CEST
  assertEquals(suggestedTimeToInputValue(slot, BUDAPEST), "2026-10-20T10:00");
});

Deno.test("Monday 08:00 Budapest after the DST end (UTC+1)", () => {
  const slot = new Date("2026-10-26T07:00:00.000Z"); // 08:00 CET
  assertEquals(suggestedTimeToInputValue(slot, BUDAPEST), "2026-10-26T08:00");
});

Deno.test("UTC timezone: wall time equals the UTC instant", () => {
  const slot = new Date("2026-10-19T08:00:00.000Z");
  assertEquals(suggestedTimeToInputValue(slot, "UTC"), "2026-10-19T08:00");
});

Deno.test("old toISOString().slice(0,16) conversion is wrong in Budapest", () => {
  const slot = new Date("2026-10-19T06:00:00.000Z");
  assertEquals(slot.toISOString().slice(0, 16), "2026-10-19T06:00");
  assertEquals(
    suggestedTimeToInputValue(slot, BUDAPEST) === "2026-10-19T06:00",
    false
  );
});

Deno.test("nextSuggestedDate picks the next Monday 08:00 from a fixed Saturday", () => {
  const now = new Date(2026, 9, 17, 12, 0); // Sat 2026-10-17 12:00 local
  const next = nextSuggestedDate(now, 1, 8);
  assertEquals(
    [next.getFullYear(), next.getMonth(), next.getDate(), next.getHours()],
    [2026, 9, 19, 8]
  );
});

Deno.test("nextSuggestedDate rolls to next week when today's hour has passed", () => {
  const now = new Date(2026, 9, 19, 9, 0); // Mon 09:00 local
  const next = nextSuggestedDate(now, 1, 8);
  assertEquals([next.getMonth(), next.getDate(), next.getHours()], [9, 26, 8]);
});

Deno.test("nextSuggestedDate does not mutate its input", () => {
  const now = new Date(2026, 9, 17, 12, 0);
  const before = now.getTime();
  nextSuggestedDate(now, 2, 10);
  assertEquals(now.getTime(), before);
});

Deno.test("round trip: slot -> field value -> UTC equals the original instant", () => {
  // Zone-independent: uses the process's local zone for both directions
  const now = new Date(2026, 9, 17, 12, 0);
  for (const [day, hour] of [
    [1, 8],
    [2, 10],
  ]) {
    const slot = nextSuggestedDate(now, day, hour);
    const value = suggestedTimeToInputValue(slot);
    assertEquals(value.slice(11), `${String(hour).padStart(2, "0")}:00`);
    assertEquals(localDatetimeStringToUtc(value), slot.toISOString());
  }
});

Deno.test("round trip in Budapest: field 08:00 submits as 06:00Z", () => {
  // Skip the absolute assertion unless the process runs in Budapest time
  const offset = new Date(2026, 9, 19).getTimezoneOffset();
  if (offset !== -120) return;
  assertEquals(
    localDatetimeStringToUtc("2026-10-19T08:00"),
    "2026-10-19T06:00:00.000Z"
  );
});

Deno.test("empty field value converts to an empty string", () => {
  assertEquals(localDatetimeStringToUtc(""), "");
});
