import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  multiplier: number;
  jitter: boolean;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 5,
  initialDelayMs: 1000, // 1 second
  maxDelayMs: 32000, // 32 seconds
  multiplier: 2,
  jitter: true,
};

/**
 * Determines if an error is authentication-related (no retry)
 */
export function isAuthError(error: any): boolean {
  const status = error?.status || error?.response?.status;
  return [400, 401, 403, 404].includes(status);
}

/**
 * Determines if error is rate limiting (should respect Retry-After)
 */
export function isRateLimitError(error: any): boolean {
  const status = error?.status || error?.response?.status;
  return status === 429;
}

/**
 * Sleep for specified milliseconds
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff and optional jitter
 */
export function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig
): number {
  const baseDelay = Math.min(
    config.initialDelayMs * Math.pow(config.multiplier, attempt - 1),
    config.maxDelayMs
  );

  if (!config.jitter) {
    return baseDelay;
  }

  // Add jitter: random between 0.5x and 1.5x of base delay
  const jitterFactor = 0.5 + Math.random() * 1;
  return Math.floor(baseDelay * jitterFactor);
}

/**
 * Update post with error information
 */
export async function updatePostError(
  postId: string,
  userId: string,
  errorMessage: string,
  errorDetails: any,
  retryCount: number
): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update({
      error_message: errorMessage,
      error_details: errorDetails,
      retry_count: retryCount,
      last_retry_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("user_id", userId);

  if (error) {
    console.error(`Failed to update post error info: ${error.message}`);
  }
}

/**
 * Main retry wrapper with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  context: { postId: string; userId: string; platform: string },
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      console.log(
        `Publishing attempt ${attempt}/${config.maxAttempts} for post ${context.postId} on ${context.platform}`
      );
      return await operation();
    } catch (error: any) {
      lastError = error;
      const errorMessage = error.message || String(error);
      const status = error?.status || error?.response?.status;

      // Don't retry on authentication errors
      if (isAuthError(error)) {
        console.error(
          `Auth error (${status}) for post ${context.postId}, not retrying:`,
          errorMessage
        );
        await updatePostError(
          context.postId,
          context.userId,
          `Authentication failed: ${errorMessage}`,
          {
            status,
            errorMessage,
            platform: context.platform,
            attempt,
            authError: true,
          },
          attempt
        );
        throw error;
      }

      if (attempt === config.maxAttempts) {
        // Final attempt failed
        console.error(
          `Final attempt failed for post ${context.postId} after ${attempt} attempts:`,
          errorMessage
        );
        await updatePostError(
          context.postId,
          context.userId,
          `Publishing failed after ${attempt} attempts: ${errorMessage}`,
          {
            status,
            errorMessage,
            platform: context.platform,
            attempts: attempt,
            finalAttempt: true,
          },
          attempt
        );

        // Mark post as failed
        const { error: updateError } = await supabase
          .from("posts")
          .update({
            status: "failed",
          })
          .eq("id", context.postId)
          .eq("user_id", context.userId);

        if (updateError) {
          console.error("Failed to mark post as failed:", updateError);
        }

        throw error;
      }

      // Calculate retry delay
      const delay = calculateBackoffDelay(attempt, config);
      console.log(
        `Attempt ${attempt} failed, retrying after ${delay}ms for post ${context.postId}`
      );

      // Store error temporarily for debugging
      await updatePostError(
        context.postId,
        context.userId,
        errorMessage,
        {
          status,
          errorMessage,
          platform: context.platform,
          attempt,
          nextRetryIn: delay,
        },
        attempt
      );

      // Wait before retrying
      await sleep(delay);
    }
  }

  // Should not reach here
  throw lastError || new Error("Unknown error in retry handler");
}

/**
 * Execute operation with retry and timeout
 */
export async function withRetryAndTimeout<T>(
  operation: () => Promise<T>,
  context: { postId: string; userId: string; platform: string },
  timeoutMs: number = 30000,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  const timeoutPromise = new Promise<T>((_resolve, reject) => {
    setTimeout(
      () =>
        reject(
          new Error(
            `Operation timed out after ${timeoutMs}ms for post ${context.postId}`
          )
        ),
      timeoutMs
    );
  });

  return Promise.race([withRetry(operation, context, config), timeoutPromise]);
}
