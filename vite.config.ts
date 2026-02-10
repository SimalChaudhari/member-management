import { defineConfig, loadEnv } from 'vite';

declare const process: { cwd(): string };
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

function salesforceApiProxyPlugin(): import('vite').Plugin {
  return {
    name: 'salesforce-api-proxy',
    configureServer(server) {
      // Run before Vite's proxy: if client sent X-Salesforce-Target, proxy to that host (e.g. my.salesforce.com)
      server.middlewares.use((req: any, res: any, next: () => void) => {
        const target = req.headers['x-salesforce-target'] as string | undefined;
        if (req.url?.startsWith('/api/salesforce') && target && req.headers['authorization']) {
          const path = req.url.replace(/^\/api\/salesforce/, '') || '/';
          const proxyUrl = target.replace(/\/$/, '') + path;
          const headers: Record<string, string> = { ...req.headers as Record<string, string> };
          delete headers['x-salesforce-target'];
          delete headers.host;
          (async () => {
            try {
              const body = req.method !== 'GET' && req.method !== 'HEAD'
                  ? await new Promise<ArrayBuffer>((resolve: (v: ArrayBuffer) => void, reject: (e: Error) => void) => {
                      const chunks: Uint8Array[] = [];
                      req.on('data', (chunk: Uint8Array) => chunks.push(chunk));
                      req.on('end', () => {
                        const total = chunks.reduce((n, c) => n + c.length, 0);
                        const out = new Uint8Array(total);
                        let off = 0;
                        for (const c of chunks) {
                          out.set(c, off);
                          off += c.length;
                        }
                        resolve(out.buffer);
                      });
                      req.on('error', (e: Error) => reject(e));
                    })
                  : undefined;
              const r = await fetch(proxyUrl, {
                method: req.method,
                headers,
                body,
              });
              const buf = new Uint8Array(await r.arrayBuffer());
              // Node fetch() decompresses gzip; don't forward Content-Encoding or browser will try to decompress again
              r.headers.forEach((v: string, k: string) => {
                const lower = k.toLowerCase();
                if (lower !== 'content-encoding' && lower !== 'content-length') res.setHeader(k, v);
              });
              res.setHeader('Content-Length', String(buf.length));
              res.statusCode = r.status;
              res.end(buf);
            } catch (e) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: (e as Error)?.message ?? 'Proxy failed' }));
            }
          })();
          return;
        }
        next();
      });
    },
  };
}

function ssoTokenProxyPlugin(env: Record<string, string>): import('vite').Plugin {
  const SSO_BASE = env.VITE_SSO_BASE_URL ?? '';
  const SSO_APP_ID = env.VITE_SSO_APP_ID ?? '';
  const SSO_APP_SECRET = env.SSO_APP_SECRET ?? env.VITE_SSO_APP_SECRET ?? '';
  const TOKEN_URL = SSO_BASE ? `${SSO_BASE.replace(/\/$/, '')}/services/oauth2/token` : '';

  return {
    name: 'sso-token-proxy',
    configureServer(server) {
      if (!TOKEN_URL || !SSO_APP_ID || !SSO_APP_SECRET) return;
      server.middlewares.use((req: any, res: any, next: () => void) => {
        if (req.method !== 'POST' || req.url !== '/api/sso/token') {
          next();
          return;
        }
        let body = '';
        req.on('data', (chunk: unknown) => { body += String(chunk); });
        req.on('end', () => {
          try {
            const { code, redirect_uri } = JSON.parse(body) as { code?: string; redirect_uri?: string };
            if (!code || !redirect_uri) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing code or redirect_uri' }));
              return;
            }
            const params = new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: SSO_APP_ID,
              client_secret: SSO_APP_SECRET,
              redirect_uri,
              code,
            });
            fetch(TOKEN_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: params.toString(),
            })
              .then((r: Response) => r.text().then((text: string) => ({ status: r.status, text })))
              .then(({ status, text }: { status: number; text: string }) => {
                res.setHeader('Content-Type', 'application/json');
                const origin = req.headers?.origin;
                res.setHeader('Access-Control-Allow-Origin', Array.isArray(origin) ? origin[0] ?? '*' : origin ?? '*');
                res.statusCode = status;
                res.end(text);
              })
              .catch((err: Error) => {
                res.statusCode = 502;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err?.message ?? 'Token exchange failed' }));
              });
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid request body' }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_SSO_BASE_URL ?? env.VITE_API_URL ?? 'https://eservices-isca--fuat.sandbox.my.site.com';
  return {
    optimizeDeps: {
      include: ['@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
    },
    plugins: [tsconfigPaths(), react(), tailwindcss(), salesforceApiProxyPlugin(), ssoTokenProxyPlugin(env)],
    preview: { port: 5000 },
    server: {
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        // Avoid CORS in dev: browser calls same origin, Vite forwards to Salesforce
        '/api/salesforce': {
          target: proxyTarget.replace(/\/$/, ''),
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/salesforce/, ''),
        },
      },
    },
    base: '/',
  };
});
