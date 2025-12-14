import { defineConfig } from 'tsdown';

export default defineConfig({
  plugins: [],
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{d,test,test-d,bench}.{ts,tsx}',
    '!**/__fixtures__',
  ],
  clean: true,
  dts: true,
  format: 'esm',
  sourcemap: true,
  unbundle: true,
  treeshake: true,
  platform: 'neutral',
  minify: false,
  exports: true,
});
