import {
  buildScheduleHref,
  parsePrefillParams,
  parseSuggestedTime,
  resolveFormInitialData,
  stripPrefillParams,
  utcToLocalDatetimeString,
} from "../lib/utils/schedule-prefill.ts";

function assertEquals<T>(actual: T, expected: T, msg?: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${msg ?? "assertEquals"}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

const BUDAPEST = "Europe/Budapest";
// 09:00 Budapest (UTC+2, CEST) on Monday 2026-10-19
const SUGGESTED = new Date("2026-10-19T07:00:00.000Z");

Deno.test("suggested 09:00 Budapest is carried as the 07:00Z instant", () => {
  const href = buildScheduleHref("linkedin", SUGGESTED, { openAI: "true" });
  const url = new URL(href, "http://localhost");
  assertEquals(url.searchParams.get("time"), "2026-10-19T07:00:00.000Z");
  assertEquals(url.searchParams.get("platform"), "linkedin");
});

Deno.test("prefill is parsed once and displays 09:00 in Europe/Budapest", () => {
  const href = buildScheduleHref("linkedin", SUGGESTED);
  const url = new URL(href, "http://localhost");
  const prefill = parsePrefillParams(url.searchParams);
  assertEquals(prefill?.scheduled_for, "2026-10-19T07:00:00.000Z");
  assertEquals(
    utcToLocalDatetimeString(prefill?.scheduled_for, BUDAPEST),
    "2026-10-19T09:00"
  );
});

Deno.test("daylight saving: winter instant displays at UTC+1", () => {
  assertEquals(
    utcToLocalDatetimeString("2026-10-26T08:00:00.000Z", BUDAPEST),
    "2026-10-26T09:00"
  );
});

Deno.test("legacy zone-less time values are rejected as ambiguous", () => {
  assertEquals(parseSuggestedTime("2026-10-19T07:00"), null);
});

Deno.test("invalid time query does not crash and yields no prefill", () => {
  for (const bad of ["garbage", "2026-13-45T99:99Z", "", "null"]) {
    const params = new URLSearchParams({ time: bad });
    assertEquals(parsePrefillParams(params), null, bad);
  }
  assertEquals(parsePrefillParams(new URLSearchParams({ platform: "x" })), null);
  assertEquals(utcToLocalDatetimeString("not-a-date", BUDAPEST), "");
});

Deno.test("normal Create Post starts with an empty date", () => {
  const initial = resolveFormInitialData(null, "", "twitter");
  assertEquals(initial, undefined);
  assertEquals(utcToLocalDatetimeString(undefined, BUDAPEST), "");
});

Deno.test("reopening after close does not reuse stale prefill", () => {
  const prefill = parsePrefillParams(
    new URLSearchParams({ time: "2026-10-19T07:00:00.000Z" })
  );
  assertEquals(
    resolveFormInitialData(prefill, "", "twitter")?.scheduled_for,
    "2026-10-19T07:00:00.000Z"
  );
  // Closing the modal resets the prefill state to null
  const afterClose = resolveFormInitialData(null, "", "twitter");
  assertEquals(afterClose, undefined);
});

Deno.test("consumed params are removed and unrelated params preserved", () => {
  const params = new URLSearchParams(
    "platform=linkedin&time=2026-10-19T07:00:00.000Z&openAI=true&view=month"
  );
  assertEquals(stripPrefillParams(params), "view=month");
});
