// All /api/* calls (BetterAuth + REST) are proxied to the Express server. This keeps
// auth cookies first-party and removes CORS problems in production.
const nextConfig = {
  async rewrites() {
    const api = process.env.API_URL || "http://localhost:5000";
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },
};
export default nextConfig;
