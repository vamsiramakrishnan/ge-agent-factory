import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import {
  preflightTarget,
  submitFactoryRun,
  getFactoryRunSnapshot,
  watchRunEvents
} from './src/server/factory-bridge.js';

function geFactoryApiPlugin() {
  return {
    name: 'ge-agent-factory-api',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost');
        if (!url.pathname.startsWith('/api/factory')) return next();

        const sendJson = (status: number, data: any) => {
          res.statusCode = status;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify(data, null, 2));
        };

        try {
          if (req.method === 'POST' && url.pathname === '/api/factory/preflight') {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
            const result = await preflightTarget(body);
            return sendJson(result.ok ? 200 : 400, result);
          }

          if (req.method === 'POST' && url.pathname === '/api/factory/usecase') {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
            const result = await submitFactoryRun(body);
            return sendJson(200, result);
          }

          if (req.method === 'GET' && url.pathname.startsWith('/api/factory/runs/')) {
            const parts = url.pathname.split('/');
            const runId = parts[4];
            const isEvents = parts[5] === 'events';

            if (isEvents) {
              res.writeHead(200, {
                'content-type': 'text/event-stream',
                'cache-control': 'no-cache',
                'connection': 'keep-alive',
              });

              const cleanup = watchRunEvents(runId, (event) => {
                res.write(`data: ${JSON.stringify(event)}\n\n`);
                if (event.type === 'completed' || event.type === 'error') {
                  cleanup();
                  res.end();
                }
              });

              req.on('close', () => {
                cleanup();
              });
              return;
            } else {
              const result = await getFactoryRunSnapshot(runId);
              return sendJson(200, result);
            }
          }

          return sendJson(404, { error: 'Route not found' });
        } catch (error: any) {
          return sendJson(500, { ok: false, error: error.message });
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react(), tailwindcss(), geFactoryApiPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
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
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
