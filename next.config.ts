import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/clarity",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
