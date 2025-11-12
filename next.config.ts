import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 
   * Next.js tự động load env vars từ:
   * - .env.local (highest priority)
   * - .env.development hoặc .env.production (based on NODE_ENV)
   * - .env
   * 
   * Không cần hard-code env vars ở đây trừ khi có lý do đặc biệt
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chainivo.online",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
