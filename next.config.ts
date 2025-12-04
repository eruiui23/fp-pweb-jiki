import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverMinification: false,
  },
  // Suppress hydration mismatch warnings caused by browser extensions
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
