/**
 * OpenID Connect / OAuth2 SSO configuration.
 * Set VITE_SSO_* in .env (never commit .env). See docs/ENV.md.
 */
const baseUrl = import.meta.env.VITE_SSO_BASE_URL ?? '';
const clientId = import.meta.env.VITE_SSO_APP_ID ?? '';
const clientSecret = import.meta.env.VITE_SSO_APP_SECRET ?? '';
const redirectUri = import.meta.env.VITE_SSO_REDIRECT_URI ?? (typeof window !== 'undefined' ? `${window.location.origin}` : '');

const ssoConfig = {
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

const TOKEN_STORAGE_KEY = 'sf_sso_token';
const REFRESH_TOKEN_STORAGE_KEY = 'sf_sso_refresh_token';
const INSTANCE_URL_STORAGE_KEY = 'sf_sso_instance_url';
const PROFILE_STORAGE_KEY = 'sf_sso_profile';

export type UserProfile = {
  name: string;
  email?: string;
  picture?: string;
  preferred_username?: string;
  user_id?: string;
  sub?: string;
};

export function getSsoAuthorizeUrl(): string {
  const params = new URLSearchParams({
    client_id: ssoConfig.clientId,
    redirect_uri: ssoConfig.redirectUri,
    response_type: 'code',
  });
  return `${ssoConfig.authorizeUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<SsoTokenResponse> {
  const redirectUri = ssoConfig.redirectUri;

  if (import.meta.env.DEV) {
    const response = await fetch('/api/sso/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text ? `SSO token exchange failed: ${text}` : `SSO token exchange failed: ${response.status}`);
    }
    return JSON.parse(text) as SsoTokenResponse;
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: ssoConfig.clientId,
    client_secret: ssoConfig.clientSecret,
    redirect_uri: redirectUri,
    code,
  });

  const response = await fetch(ssoConfig.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SSO token exchange failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<SsoTokenResponse>;
}

export function storeSsoTokens(data: SsoTokenResponse): void {
  if (data.access_token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    sessionStorage.setItem('token', data.access_token);
  }
  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refresh_token);
  }
  if (data.instance_url) {
    localStorage.setItem(INSTANCE_URL_STORAGE_KEY, data.instance_url);
  }
}

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY) ?? sessionStorage.getItem('token');
}

export function getStoredInstanceUrl(): string | null {
  return localStorage.getItem(INSTANCE_URL_STORAGE_KEY);
}

export async function fetchUserInfo(): Promise<UserProfile> {
  const token = getStoredAccessToken();
  const instanceUrl = getStoredInstanceUrl();
  if (!token || !instanceUrl) {
    throw new Error('No access token or instance URL');
  }
  const url = `${instanceUrl.replace(/\/$/, '')}/services/oauth2/userinfo`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`UserInfo failed: ${res.status} ${text}`);
  }
  const raw = (await res.json()) as Record<string, unknown>;
  const profile: UserProfile = {
    name: [raw.name, raw.preferred_username].find(Boolean) as string ?? 'User',
    email: raw.email as string | undefined,
    picture: raw.picture as string | undefined,
    preferred_username: raw.preferred_username as string | undefined,
    user_id: raw.user_id as string | undefined,
    sub: raw.sub as string | undefined,
  };
  return profile;
}

export function storeProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function getStoredProfile(): UserProfile | null {
  try {
    const s = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!s) return null;
    return JSON.parse(s) as UserProfile;
  } catch {
    return null;
  }
}

export function clearSsoTokens(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(INSTANCE_URL_STORAGE_KEY);
  localStorage.removeItem(PROFILE_STORAGE_KEY);
  sessionStorage.removeItem('token');
}
