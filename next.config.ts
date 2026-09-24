import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
  },
  outputFileTracingExcludes: {
    "/api/admin/*": ["./public/images/**/*"],
  },
};

export default nextConfig;
