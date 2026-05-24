/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@skyhearts/shared', '@skyhearts/db'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
};

module.exports = nextConfig;
