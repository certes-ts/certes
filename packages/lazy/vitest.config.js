import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    watch: false,
    benchmark: {
      include: ['**/*.bench.ts'],
      outputFile: './bench/report.json',
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'json-summary', 'lcov', 'text'],
      reportsDirectory: './coverage',
      enabled: true,
      clean: true,
      passWithNoTests: true,
    },
    clearMocks: true,
    restoreMocks: true,
    passWithNoTests: true,
    silent: 'passed-only',
  },
});
