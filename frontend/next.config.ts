import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import type { NextConfig } from "next";

(async () => {
  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
  }
})();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
