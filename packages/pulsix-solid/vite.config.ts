import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import solidPlugin from 'vite-plugin-solid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'PulsixReact', // Non molto usato per ESM/CJS
      formats: ['es', 'cjs'], // UMD non serve qui
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      // Externalizza dipendenze che non devono essere nel bundle
      external: ['solid-js', 'pulsix'],
      output: {
        globals: { // Non necessario per ESM/CJS, ma utile per UMD se lo aggiungessi
          react: 'React',
          'react-dom': 'ReactDOM',
          pulsix: 'PulsixSdk' // Il nome globale UMD del core
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});