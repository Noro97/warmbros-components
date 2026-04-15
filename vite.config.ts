import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

const isStorybook = process.argv[1]?.includes('storybook');

export default defineConfig({
  plugins: [
    react(),
    ...(!isStorybook
      ? [
          dts({
            tsconfigPath: './tsconfig.json',
            insertTypesEntry: true,
          }),
        ]
      : []),
  ],
  build: {
    lib: {
      // Multi-entry so heavy 3D components ship as separate files
      // and consumers importing the main barrel never touch them.
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        SplineScene: resolve(__dirname, 'src/components/SplineScene/index.ts'),
        Receipt3D: resolve(__dirname, 'src/components/Receipt3D/index.ts'),
      },
      name: 'WarmBrosComponents',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        // Peer-dep: consumer already ships framer-motion, don't double-bundle.
        'framer-motion',
        // Externalize the heavy runtimes so consumers install them only if they use 3D subpaths.
        '@splinetool/react-spline',
        '@splinetool/runtime',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        // Pin the emitted CSS filename so the package.json "exports" map
        // (./styles.css → ./dist/components.css) stays stable regardless of
        // the package name or entry keys.
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'components.css';
          return 'assets/[name][extname]';
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
});
