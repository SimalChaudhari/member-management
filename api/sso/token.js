/**
 * Vercel serverless function: POST /api/sso/token
 * Exchanges OAuth code for Salesforce tokens (avoids CORS by doing exchange server-side).
 * Set in Vercel: VITE_SSO_BASE_URL, VITE_SSO_APP_ID, VITE_SSO_APP_SECRET (or SSO_APP_SECRET).
 */

export const config = {
  runtime: 'nodejs20.x',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = process.env.VITE_SSO_BASE_URL || process.env.SSO_BASE_URL || '';
  const clientId = process.env.VITE_SSO_APP_ID || process.env.SSO_APP_ID || '';
  const clientSecret = process.env.SSO_APP_SECRET || process.env.VITE_SSO_APP_SECRET || '';

  if (!baseUrl || !clientId || !clientSecret) {
    return res.status(500).json({ error: 'SSO not configured (missing env)' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { code, redirect_uri } = body;
  if (!code || !redirect_uri) {
    return res.status(400).json({ error: 'Missing code or redirect_uri' });
  }

  const tokenUrl = `${baseUrl.replace(/\/$/, '')}/services/oauth2/token`;
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri,
    code,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).send(text);
  } catch (err) {
    res.status(502).json({ error: err?.message || 'Token exchange failed' });
  }
}
