// Free-tier hosts (e.g. Render) put idle services to sleep. When the web
// server starts, it pings the API so both wake up together instead of the
// API only waking on the first proxied request.

type WakeOptions = {
  deadlineMs?: number;
  intervalMs?: number;
  attemptTimeoutMs?: number;
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  log?: (message: string) => void;
};

function describeError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause = (error as Error & { cause?: unknown }).cause;
  const causeText = cause instanceof Error
    ? `${cause.name}: ${cause.message}${'code' in cause ? ` (${String(cause.code)})` : ''}`
    : cause !== undefined ? String(cause) : '';
  return `${error.name}: ${error.message}${causeText ? ` <- ${causeText}` : ''}`;
}

/**
 * Browser-side wake-up: a sleeping Render free service reliably wakes on a
 * request from a browser. `no-cors` because we only need the request to
 * arrive, not to read the response. Never throws.
 */
export function wakeApiFromBrowser(origin: string | undefined, fetchImpl: typeof fetch = fetch): void {
  if (!origin) return;
  try {
    void fetchImpl(new URL('/health', origin).toString(), {
      mode: 'no-cors',
      cache: 'no-store',
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Invalid origin or fetch unavailable: nothing to wake.
  }
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Polls `${origin}/health` until it answers OK or the deadline passes. Never throws. */
export async function wakeApi(origin: string, options: WakeOptions = {}): Promise<boolean> {
  const {
    deadlineMs = 180_000,
    intervalMs = 5_000,
    attemptTimeoutMs = 60_000,
    fetchImpl = fetch,
    sleep = defaultSleep,
    now = Date.now,
    log = () => undefined,
  } = options;
  const healthUrl = new URL('/health', origin).toString();
  const deadline = now() + deadlineMs;
  let attempt = 0;

  while (now() < deadline) {
    attempt++;
    try {
      const response = await fetchImpl(healthUrl, {
        cache: 'no-store',
        signal: AbortSignal.timeout(attemptTimeoutMs),
      });
      if (response.ok) {
        log(`[wake-api] ${healthUrl} OK on attempt ${attempt}`);
        return true;
      }
      log(`[wake-api] attempt ${attempt}: HTTP ${response.status}`);
    } catch (error) {
      // API still starting (timeout, connection refused, ...): try again.
      log(`[wake-api] attempt ${attempt}: ${describeError(error)}`);
    }
    await sleep(intervalMs);
  }
  return false;
}
