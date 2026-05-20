/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/news", destination: "/blogs", permanent: true },
      { source: "/news/:slug", destination: "/blogs/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
