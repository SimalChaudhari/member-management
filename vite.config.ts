import { defineConfig, loadEnv } from 'vite';

declare const process: { cwd(): string };
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

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
              .then((r) => r.text().then((text) => ({ status: r.status, text })))
              .then(({ status, text }) => {
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
  return {
    optimizeDeps: {
      include: ['@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
    },
    plugins: [tsconfigPaths(), react(), tailwindcss(), ssoTokenProxyPlugin(env)],
    preview: { port: 5000 },
    server: { host: '0.0.0.0', port: 3000 },
    base: '/',
  };
});
