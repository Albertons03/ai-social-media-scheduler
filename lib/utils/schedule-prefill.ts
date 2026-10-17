export type SchedulePrefillPlatform = "twitter" | "linkedin" | "tiktok";

export interface SchedulePrefill {
  platform?: SchedulePrefillPlatform;
  scheduled_for?: string;
}

const PLATFORMS: readonly string[] = ["twitter", "linkedin", "tiktok"];
const PREFILL_QUERY_KEYS = ["platform", "time", "openAI"] as const;
// Requires an explicit UTC "Z" or numeric offset so the instant is unambiguous
const ISO_WITH_ZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

export function buildScheduleHref(
  platform: string,
  date: Date,
  extraParams: Record<string, string> = {}
): string {
  const params = new URLSearchParams({
    platform,
    time: date.toISOString(),
    ...extraParams,
  });
  return `/schedule?${params.toString()}`;
}

// Returns a normalized UTC ISO string, or null when the value is not a valid zoned timestamp
export function parseSuggestedTime(raw: string | null): string | null {
  if (!raw || !ISO_WITH_ZONE.test(raw)) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function parsePrefillParams(
  params: URLSearchParams
): SchedulePrefill | null {
  const prefill: SchedulePrefill = {};

  const platform = params.get("platform");
  if (platform && PLATFORMS.includes(platform)) {
    prefill.platform = platform as SchedulePrefillPlatform;
  }

  const time = parseSuggestedTime(params.get("time"));
  if (time) prefill.scheduled_for = time;

  return Object.keys(prefill).length > 0 ? prefill : null;
}

// Removes only the consumed prefill keys and keeps unrelated query parameters
export function stripPrefillParams(params: URLSearchParams): string {
  const next = new URLSearchParams(params.toString());
  for (const key of PREFILL_QUERY_KEYS) next.delete(key);
  return next.toString();
}

export function resolveFormInitialData(
  prefill: SchedulePrefill | null,
  aiContent: string,
  aiPlatform: SchedulePrefillPlatform
): SchedulePrefill | { content: string; platform: SchedulePrefillPlatform } | undefined {
  if (prefill) return prefill;
  if (aiContent) return { content: aiContent, platform: aiPlatform };
  return undefined;
}

// Converts a UTC instant to a datetime-local string exactly once.
// timeZone defaults to the browser's local zone.
export function utcToLocalDatetimeString(
  utcString: string | null | undefined,
  timeZone?: string
): string {
  if (!utcString) return "";
  const date = new Date(utcString);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get(
    "minute"
  )}`;
}

// Next occurrence of a static suggestion slot, built in the browser's local zone.
export function nextSuggestedDate(
  now: Date,
  dayOfWeek: number,
  hour: number
): Date {
  const next = new Date(now.getTime());
  const daysToAdd =
    (dayOfWeek - next.getDay() + 7) % 7 || (hour > next.getHours() ? 0 : 7);
  next.setDate(next.getDate() + daysToAdd);
  next.setHours(hour, 0, 0, 0);
  return next;
}

// datetime-local value (local wall time) for a suggested slot; never UTC wall time
export function suggestedTimeToInputValue(
  date: Date,
  timeZone?: string
): string {
  return utcToLocalDatetimeString(date.toISOString(), timeZone);
}

// Converts a datetime-local string (local wall time) to a UTC ISO string
export function localDatetimeStringToUtc(localString: string): string {
  if (!localString) return "";
  return new Date(localString).toISOString();
}