import { baseConfig } from "../../tsup.config.base";

export default {
  ...baseConfig,
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  noExternal: ["@formscale/ui"],
  esbuildOptions(options) {
    options.resolveExtensions = [".tsx", ".ts", ".jsx", ".js"];
  },
};
