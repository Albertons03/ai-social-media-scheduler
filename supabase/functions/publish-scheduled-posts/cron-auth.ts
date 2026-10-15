export type CronAuthenticationResult =
  | { authenticated: true }
  | {
      authenticated: false;
      reason: "configuration_error" | "unauthorized";
    };

export function authenticateCronRequest(
  expectedSecret: string | undefined,
  authorizationHeader: string | null
): CronAuthenticationResult {
  if (!expectedSecret || expectedSecret.trim().length === 0) {
    return { authenticated: false, reason: "configuration_error" };
  }

  if (authorizationHeader !== `Bearer ${expectedSecret}`) {
    return { authenticated: false, reason: "unauthorized" };
  }

  return { authenticated: true };
}
