import path from "path";
import type { NextConfig } from "next";

const nextConfig = ({
  /* config options here */
  // Ensure Turbopack resolves modules from the project folder
  turbopack: {
    root: path.resolve(__dirname),
  },
} as unknown) as NextConfig;

export default nextConfig;
