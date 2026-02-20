/**
 * Vercel serverless function: GET /api/sso/userinfo
 * Proxies Salesforce /services/oauth2/userinfo to avoid CORS.
 * Client sends: Authorization: Bearer <token>, X-Instance-Url: <salesforce instance url>
 */

export const config = {
  runtime: 'nodejs',
};

function setCors(res, req) {
  const origin = req.headers?.origin;
  const o = Array.isArray(origin) ? origin[0] : origin;
  if (o) res.setHeader('Access-Control-Allow-Origin', o);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Instance-Url');
}

export default async function handler(req, res) {
  setCors(res, req);
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const auth = req.headers?.authorization;
  const instanceUrl = (req.headers['x-instance-url'] || '').toString().trim();

  if (!auth || !instanceUrl) {
    return res.status(400).json({ error: 'Missing Authorization or X-Instance-Url header' });
  }

  const userinfoUrl = `${instanceUrl.replace(/\/$/, '')}/services/oauth2/userinfo`;

  try {
    const response = await fetch(userinfoUrl, {
      method: 'GET',
      headers: {
        Authorization: auth,
        Accept: 'application/json',
      },
    });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).send(text);
  } catch (err) {
    res.status(502).json({ error: err?.message || 'UserInfo request failed' });
  }
}
