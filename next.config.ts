import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Parent Desktop/package-lock.json confuses Turbopack's workspace root.
  // Pin to this app so manifests use a single consistent project path.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
