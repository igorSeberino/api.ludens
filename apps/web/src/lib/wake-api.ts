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
};

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
  } = options;
  const healthUrl = new URL('/health', origin).toString();
  const deadline = now() + deadlineMs;

  while (now() < deadline) {
    try {
      const response = await fetchImpl(healthUrl, {
        cache: 'no-store',
        signal: AbortSignal.timeout(attemptTimeoutMs),
      });
      if (response.ok) return true;
    } catch {
      // API still starting (timeout, connection refused, ...): try again.
    }
    await sleep(intervalMs);
  }
  return false;
}
