import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
