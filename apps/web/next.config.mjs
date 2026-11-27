const proxyUrl = process.env.API_PROXY_URL;
let apiOrigin;
if (proxyUrl) {
  let url;
  try { url = new URL(proxyUrl); } catch {
    throw new Error('API_PROXY_URL must be an HTTP(S) origin without a path');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash) {
    throw new Error('API_PROXY_URL must be an HTTP(S) origin without credentials, path, query or fragment');
  }
  apiOrigin = url.origin;
  if (process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('Clear NEXT_PUBLIC_API_URL when using API_PROXY_URL');
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: Boolean(apiOrigin),
  // A sleeping free-tier API can take longer than Next's default 30s proxy
  // timeout to boot; wait longer so the first request doesn't fail with 500.
  ...(apiOrigin ? { experimental: { proxyTimeout: 120_000 } } : {}),
  async rewrites() {
    return apiOrigin ? [
      { source: '/api/:path(.*/)', destination: `${apiOrigin}/api/:path` },
      { source: '/api/:path*', destination: `${apiOrigin}/api/:path*` },
    ] : [];
  },
};

export default nextConfig;
