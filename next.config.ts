import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    HOST_API: process.env.HOST_API,
  },
  /* config options here */
};

export default nextConfig;
