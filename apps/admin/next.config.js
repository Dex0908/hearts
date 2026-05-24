/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["@skyhearts/shared", "@skyhearts/db"],
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

module.exports = nextConfig;

