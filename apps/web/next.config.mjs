/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // /api/* is proxied at runtime via src/app/api/[...path]/route.ts (uses API_GATEWAY_HOST).
  async redirects() {
    return [
      { source: "/news", destination: "/blogs", permanent: true },
      { source: "/news/:slug", destination: "/blogs/:slug", permanent: true },
      { source: "/community-charity", destination: "/jana-seva", permanent: true },
      { source: "/community-charity/:path*", destination: "/jana-seva/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
