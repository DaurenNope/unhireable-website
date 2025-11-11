import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["next-auth"],
  // Ensure TypeScript path aliases are resolved correctly
  typescript: {
    // We handle type checking separately
  },
};

export default nextConfig;
