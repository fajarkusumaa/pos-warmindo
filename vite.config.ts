import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Middleware lokal agar endpoint Vercel Serverless Functions (/api/*)
 * juga langsung berjalan saat menjalankan `npm run dev` tanpa perlu `vercel dev`.
 */
function vercelApiLocalPlugin(): Plugin {
  return {
    name: 'vercel-api-local',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        const env = loadEnv(server.config.mode, process.cwd(), '');
        for (const [k, v] of Object.entries(env)) {
          if (process.env[k] === undefined) process.env[k] = v;
        }

        const urlObj = new URL(req.url, 'http://localhost');
        const route = urlObj.pathname.replace(/^\/api\//, '').replace(/\/$/, '');

        const routeMap: Record<string, string> = {
          bootstrap: './api/bootstrap.ts',
          orders: './api/orders.ts',
          mutations: './api/mutations.ts',
        };

        const modulePath = routeMap[route];
        if (!modulePath) return next();

        try {
          // Parse JSON body for POST requests
          let body: any = {};
          if (req.method === 'POST') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(Buffer.from(chunk));
            }
            const raw = Buffer.concat(chunks).toString('utf-8');
            if (raw) body = JSON.parse(raw);
          }

          const query: Record<string, string> = {};
          urlObj.searchParams.forEach((v, k) => {
            query[k] = v;
          });

          const mod = await server.ssrLoadModule(modulePath);
          const handler = mod.default;

          const vercelReq = Object.assign(req, { query, body });
          const vercelRes = Object.assign(res, {
            status(code: number) {
              res.statusCode = code;
              return vercelRes;
            },
            json(data: unknown) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return vercelRes;
            },
          });

          await handler(vercelReq, vercelRes);
        } catch (err: any) {
          console.error(`[Vite Local API Error /api/${route}]:`, err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Internal Server Error' }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiLocalPlugin()],
});
