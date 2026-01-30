/**
 * Salesforce OpenID Connect / OAuth2 SSO configuration.
 * Set VITE_SSO_* in .env (see docs/ENV.md). Fallbacks for local dev if .env not set.
 * Values are trimmed to avoid invalid_client_id from stray spaces/quotes in .env.
 */
const baseUrl = import.meta.env.VITE_SSO_BASE_URL ?? '';
const clientId = import.meta.env.VITE_SSO_APP_ID ?? '';
const clientSecret = import.meta.env.VITE_SSO_APP_SECRET ?? '';
const redirectUri =
(import.meta.env.VITE_SSO_REDIRECT_URI ?? '') ||
    (typeof window !== 'undefined' ? `${window.location.origin}` : '') || '';

export const ssoConfig = {
  baseUrl,
  clientId,
  clientSecret,
  redirectUri,
  authorizeUrl: `${baseUrl}/services/oauth2/authorize`,
  tokenUrl: `${baseUrl}/services/oauth2/token`,
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
