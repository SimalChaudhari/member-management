/**
 * Salesforce OpenID Connect / OAuth2 SSO configuration.
 * Set VITE_SSO_* in .env (see docs/ENV.md). Fallbacks for local dev if .env not set.
 * Values are trimmed to avoid invalid_client_id from stray spaces/quotes in .env.
 *
 * Production: use a same-origin token proxy to avoid CORS. Set VITE_SSO_TOKEN_PROXY_URL
 * if your proxy lives at a different path (e.g. "https://yourapp.com/api/sso/token").
 * Otherwise the app calls "/api/sso/token" and your live server must handle it.
 */
const baseUrl = import.meta.env.VITE_SSO_BASE_URL ?? '';
const clientId = import.meta.env.VITE_SSO_APP_ID ?? '';
const clientSecret = import.meta.env.VITE_SSO_APP_SECRET ?? '';
const redirectUri =
  (import.meta.env.VITE_SSO_REDIRECT_URI ?? '') ||
  (typeof window !== 'undefined' ? `${window.location.origin}` : '') ||
  '';

/** In production, use this URL for token exchange to avoid CORS. Empty = use relative /api/sso/token */
const tokenProxyUrl = import.meta.env.VITE_SSO_TOKEN_PROXY_URL ?? '';

export const ssoConfig = {
  baseUrl,
  clientId,
  clientSecret,
  redirectUri,
  authorizeUrl: `${baseUrl}/services/oauth2/authorize`,
  tokenUrl: `${baseUrl}/services/oauth2/token`,
  /** Same-origin (or configured) proxy URL for token exchange. Use this in browser to avoid CORS. */
  tokenProxyUrl: tokenProxyUrl ? tokenProxyUrl.replace(/\/$/, '') : '',
} as const;

export type SsoTokenResponse = {
  access_token: string;
  refresh_token?: string;
  sfdc_community_url?: string;
  sfdc_community_id?: string;
  signature?: string;
  scope?: string;
  id_token?: string;
  instance_url?: string;
  id?: string;
  token_type?: string;
  issued_at?: string;
};
