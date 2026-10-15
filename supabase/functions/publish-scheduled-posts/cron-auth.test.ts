import { authenticateCronRequest } from "./cron-auth.ts";

declare const Deno: {
  test(name: string, fn: () => void): void;
};

function assertResult(
  actual: ReturnType<typeof authenticateCronRequest>,
  expected: ReturnType<typeof authenticateCronRequest>
): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error("Unexpected authentication result");
  }
}

Deno.test("rejects a missing configured secret as a configuration error", () => {
  assertResult(authenticateCronRequest(undefined, null), {
    authenticated: false,
    reason: "configuration_error",
  });
});

Deno.test("rejects an empty configured secret as a configuration error", () => {
  assertResult(authenticateCronRequest("", null), {
    authenticated: false,
    reason: "configuration_error",
  });
});

Deno.test(
  "rejects a whitespace-only configured secret as a configuration error",
  () => {
    assertResult(authenticateCronRequest(" \t\n", null), {
      authenticated: false,
      reason: "configuration_error",
    });
  }
);

Deno.test("rejects a missing Authorization header", () => {
  assertResult(authenticateCronRequest("configured-secret", null), {
    authenticated: false,
    reason: "unauthorized",
  });
});

Deno.test("rejects an incorrect bearer token", () => {
  assertResult(
    authenticateCronRequest("configured-secret", "Bearer incorrect-secret"),
    { authenticated: false, reason: "unauthorized" }
  );
});

Deno.test("rejects a malformed Authorization header", () => {
  assertResult(
    authenticateCronRequest("configured-secret", "Basic configured-secret"),
    { authenticated: false, reason: "unauthorized" }
  );
});

Deno.test("accepts only an exact bearer token", () => {
  assertResult(
    authenticateCronRequest("configured-secret", "Bearer configured-secret"),
    { authenticated: true }
  );
});

Deno.test("does not expose secrets in authentication results", () => {
  const expectedSecret = "expected-secret-value";
  const suppliedSecret = "incorrect-supplied-value";

  const results = [
    authenticateCronRequest(expectedSecret, `Bearer ${suppliedSecret}`),
    authenticateCronRequest(expectedSecret, `Bearer ${expectedSecret}`),
  ];

  for (const result of results) {
    const serialized = JSON.stringify(result);
    if (
      serialized.includes(expectedSecret) ||
      serialized.includes(suppliedSecret)
    ) {
      throw new Error("Authentication result exposed credential material");
    }
  }
});
