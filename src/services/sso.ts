import { ssoConfig, type SsoTokenResponse } from 'config/sso';

export type { SsoTokenResponse };

// ============================================================================
// CONSTANTS
// ============================================================================

// Generic storage keys - work for both SSO and regular email/password login
const TOKEN_STORAGE_KEY = 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';
const INSTANCE_URL_STORAGE_KEY = 'instance_url';
const PROFILE_STORAGE_KEY = 'user_profile';

// Legacy storage keys for backward compatibility
const LEGACY_TOKEN_KEY = 'token';
const LEGACY_SSO_TOKEN_KEY = 'sf_sso_token';
const LEGACY_SSO_REFRESH_TOKEN_KEY = 'sf_sso_refresh_token';
const LEGACY_SSO_INSTANCE_URL_KEY = 'sf_sso_instance_url';
const LEGACY_SSO_PROFILE_KEY = 'sf_sso_profile';

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

/**
 * Store authentication tokens (works for both SSO and regular login)
 * @param accessToken - Access token to store
 * @param refreshToken - Optional refresh token
 * @param instanceUrl - Optional instance URL (for Salesforce)
 */
export function storeAuthToken(accessToken: string, refreshToken?: string, instanceUrl?: string): void {
  if (accessToken) {
    const token = String(accessToken).trim();
    // Store in sessionStorage (session-only, cleared when browser closes)
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    sessionStorage.setItem(LEGACY_TOKEN_KEY, token); // Legacy key for backward compatibility
  }
  
  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, String(refreshToken).trim());
  }
  
  if (instanceUrl) {
    sessionStorage.setItem(INSTANCE_URL_STORAGE_KEY, String(instanceUrl).trim());
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
  // Check sessionStorage first (primary storage)
  const sessionToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  
  // Fallback to legacy keys for backward compatibility
  const legacyToken = sessionStorage.getItem(LEGACY_TOKEN_KEY) ?? sessionStorage.getItem(LEGACY_SSO_TOKEN_KEY);
  
  const token = sessionToken ?? legacyToken;
  
  if (!token) {
    return null;
  }
  
  // Only trim leading/trailing whitespace - don't remove spaces within token
  // Salesforce tokens can contain spaces, so we only trim edges
  return token.trim();
}

export function getStoredInstanceUrl(): string | null {
  // Check generic key first, then legacy SSO key
  return sessionStorage.getItem(INSTANCE_URL_STORAGE_KEY) ?? sessionStorage.getItem(LEGACY_SSO_INSTANCE_URL_KEY);
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
  sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function getStoredProfile(): UserProfile | null {
  try {
    // Check generic key first, then legacy SSO key
    const s = sessionStorage.getItem(PROFILE_STORAGE_KEY) ?? sessionStorage.getItem(LEGACY_SSO_PROFILE_KEY);
    if (!s) return null;
    return JSON.parse(s) as UserProfile;
  } catch {
    return null;
  }
}

export function clearSsoTokens(): void {
  // Clear all data from sessionStorage (generic and legacy keys)
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(INSTANCE_URL_STORAGE_KEY);
  sessionStorage.removeItem(PROFILE_STORAGE_KEY);
  // Legacy keys for backward compatibility
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_SSO_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_SSO_REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_SSO_INSTANCE_URL_KEY);
  sessionStorage.removeItem(LEGACY_SSO_PROFILE_KEY);
}
