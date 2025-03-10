import config from "@formscale/ui/tailwind.config";
import type { Config } from "tailwindcss";

export default {
  presets: [config],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"],
} satisfies Config;
