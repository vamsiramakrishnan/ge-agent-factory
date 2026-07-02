import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { handleGeNodeRequest } from './src/server/ge-api-router.mjs';

function geApiPlugin() {
  return {
    name: 'ge-api',
    configureServer(server: import('vite').ViteDevServer) {
      const sharedLib = path.resolve(import.meta.dirname, '../../tools/lib');
      server.watcher.add(`${sharedLib}/**/*.mjs`);
      server.watcher.on('change', (file) => {
        if (file.startsWith(sharedLib)) {
          server.restart();
        }
      });
      server.middlewares.use(async (req, res, next) => {
        await handleGeNodeRequest(req, res, next);
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), geApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
    // Workspace packages (@ge/ui) are consumed as TSX source and carry a
    // test-harness react in packages/ui/node_modules — dedupe pins every
    // react import to this app's single copy, or hooks crash with
    // "Cannot read properties of null (reading 'useState')".
    dedupe: ['react', 'react-dom'],
  },
});
