/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["@skyhearts/shared", "@skyhearts/db"],
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
