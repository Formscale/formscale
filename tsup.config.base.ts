import { defineConfig } from "tsup";

export const baseConfig = defineConfig({
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
});
