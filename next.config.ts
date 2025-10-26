import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    '/**/*': [
      './node_modules/.prisma/client/**/*',
      './node_modules/@prisma/client/**/*',
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/adapter-neon'],
  },
};

export default nextConfig;
