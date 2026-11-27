// Runs once when the Next.js server starts.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const origin = process.env.API_PROXY_URL;
  if (!origin) return;

  const { wakeApi } = await import('./lib/wake-api');
  // Fire-and-forget: never delay the web server start.
  void wakeApi(origin).then((awake) => {
    if (!awake) console.warn(`[wake-api] ${origin}/health did not answer in time`);
  });
}
