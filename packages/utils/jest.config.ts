import type { Config } from "jest";
import baseConfig from "../../jest.config.base";

const config: Config = {
  ...baseConfig,
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/__tests__/**"],
  coverageDirectory: "coverage",
};

export default config;
