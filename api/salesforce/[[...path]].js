/**
 * Vercel serverless: proxy all /api/salesforce/* to Salesforce (avoids CORS).
 * Client sends: Authorization: Bearer <token>, X-Salesforce-Target: <origin e.g. https://xxx.salesforce.com>
 */

export const config = {
  runtime: 'nodejs',
};

function setCors(res, req) {
  const origin = req.headers?.origin;
  const o = Array.isArray(origin) ? origin[0] : origin;
  if (o) res.setHeader('Access-Control-Allow-Origin', o);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept, X-Salesforce-Target');
}

export default async function handler(req, res) {
  setCors(res, req);
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const target = (req.headers['x-salesforce-target'] || '').toString().trim();
  const auth = req.headers?.authorization;

  if (!target || !auth) {
    return res.status(400).json({ error: 'Missing X-Salesforce-Target or Authorization header' });
  }

  // Path: from catch-all query.path or fallback from req.url (e.g. /api/salesforce/services/apexrest/...)
  let path = (req.query.path && (Array.isArray(req.query.path) ? req.query.path.join('/') : String(req.query.path))) || '';
  if (!path && req.url) {
    const match = req.url.match(/^\/api\/salesforce\/?(.*?)(?:\?|$)/);
    path = (match && match[1]) || '';
  }
  const search = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const targetUrl = `${target.replace(/\/$/, '')}/${path}${search}`;

  try {
    const headers = {
      Authorization: auth,
      Accept: req.headers?.accept || 'application/json',
    };
    const ct = req.headers?.['content-type'];
    if (ct) headers['Content-Type'] = ct;
    const body = req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body !== undefined && body !== null ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    });
    const text = await response.text();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.status(response.status).send(text);
  } catch (err) {
    res.status(502).json({ error: err?.message || 'Salesforce proxy failed' });
  }
}
