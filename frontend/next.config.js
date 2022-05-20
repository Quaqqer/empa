/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ["."],
  },
  rewrites: async () => {
    return [
      { source: "/api/:path*", destination: "http://localhost:5000/:path*" },
    ];
  },
};

module.exports = nextConfig;
