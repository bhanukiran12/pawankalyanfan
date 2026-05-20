/** @type {import('next').NextConfig} */
function gatewayOrigin() {
  const raw = process.env.API_GATEWAY_URL || process.env.API_GATEWAY_HOST;
  if (!raw) return "http://localhost:4000";
  const trimmed = raw.replace(/\/$/, "");
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${gatewayOrigin()}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/news", destination: "/blogs", permanent: true },
      { source: "/news/:slug", destination: "/blogs/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
