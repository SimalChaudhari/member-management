import { ssoConfig, type SsoTokenResponse } from 'config/sso';

export type { SsoTokenResponse };

// ============================================================================
// CONSTANTS
// ============================================================================

// Cookie keys - work for both SSO and regular email/password login
const TOKEN_COOKIE_KEY = 'auth_token';
const REFRESH_TOKEN_COOKIE_KEY = 'refresh_token';
const INSTANCE_URL_COOKIE_KEY = 'instance_url';
const PROFILE_COOKIE_KEY = 'user_profile';

// Cookie options: session cookie (cleared when browser closes), SameSite for CSRF protection
const COOKIE_OPTS = `path=/; SameSite=Lax${typeof window !== 'undefined' && window.location?.protocol === 'https:' ? '; Secure' : ''}`;

// ============================================================================
// COOKIE HELPERS
// ============================================================================

function setCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  const encoded = encodeURIComponent(value);
  document.cookie = `${name}=${encoded}; ${COOKIE_OPTS}`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${encodeURIComponent(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; Max-Age=0; SameSite=Lax`;
}

// ============================================================================
// TYPES
// ============================================================================

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
    scope: 'openid api refresh_token',
  });
  return `${ssoConfig.authorizeUrl}?${params.toString()}`;
}

/**
 * Token exchange: use same-origin proxy in dev and production to avoid CORS.
 * In production the live server must expose /api/sso/token (or VITE_SSO_TOKEN_PROXY_URL)
 * and perform the exchange with Salesforce server-side.
 */
export async function exchangeCodeForToken(code: string): Promise<SsoTokenResponse> {
  const redirectUri = ssoConfig.redirectUri;
  const proxyUrl = import.meta.env.DEV ? '/api/sso/token' : (ssoConfig.tokenProxyUrl || '/api/sso/token');

  const response = await fetch(proxyUrl, {
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

/**
 * Store authentication tokens in cookies (works for both SSO and regular login)
 * Uses session cookies - cleared when browser closes
 * @param accessToken - Access token to store
 * @param refreshToken - Optional refresh token
 * @param instanceUrl - Optional instance URL (for Salesforce)
 */
export function storeAuthToken(accessToken: string, refreshToken?: string, instanceUrl?: string): void {
  if (accessToken) {
    const token = String(accessToken).trim();
    setCookie(TOKEN_COOKIE_KEY, token);
  }

  if (refreshToken) {
    setCookie(REFRESH_TOKEN_COOKIE_KEY, String(refreshToken).trim());
  }

  if (instanceUrl) {
    setCookie(INSTANCE_URL_COOKIE_KEY, String(instanceUrl).trim());
  }
}

/**
 * Store SSO tokens from OAuth response (uses generic storage keys)
 */
export function storeSsoTokens(data: SsoTokenResponse): void {
  storeAuthToken(
    data.access_token ?? '',
    data.refresh_token,
    data.instance_url
  );
}

export function getStoredAccessToken(): string | null {
  const token = getCookie(TOKEN_COOKIE_KEY);

  if (!token) {
    return null;
  }

  // Only trim leading/trailing whitespace - don't remove spaces within token
  // Salesforce tokens can contain spaces, so we only trim edges
  return token.trim();
}

export function getStoredInstanceUrl(): string | null {
  return getCookie(INSTANCE_URL_COOKIE_KEY);
}

export async function fetchUserInfo(): Promise<UserProfile> {
  const token = getStoredAccessToken();
  const instanceUrl = getStoredInstanceUrl();
  if (!token || !instanceUrl) {
    throw new Error('No access token or instance URL');
  }
  const url = `${instanceUrl.replace(/\/$/, '')}/services/oauth2/userinfo`;
  const res = await fetch(url, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
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
  try {
    setCookie(PROFILE_COOKIE_KEY, JSON.stringify(profile));
  } catch {
    // Cookie may exceed size limit; profile will be refetched
  }
}

export function getStoredProfile(): UserProfile | null {
  try {
    const s = getCookie(PROFILE_COOKIE_KEY);
    if (!s) return null;
    return JSON.parse(s) as UserProfile;
  } catch {
    return null;
  }
}

export function clearSsoTokens(): void {
  removeCookie(TOKEN_COOKIE_KEY);
  removeCookie(REFRESH_TOKEN_COOKIE_KEY);
  removeCookie(INSTANCE_URL_COOKIE_KEY);
  removeCookie(PROFILE_COOKIE_KEY);
}
