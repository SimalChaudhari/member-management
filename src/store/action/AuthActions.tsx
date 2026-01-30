import axiosInstance from 'config/axios';
import {
  getStoredAccessToken,
  getStoredInstanceUrl,
  getStoredProfile,
  storeProfile,
  clearSsoTokens,
} from 'services/sso';
import type { UserProfile } from 'store/types/auth';
import {
  AUTH_PROFILE_CLEAR,
  AUTH_PROFILE_FETCH_ERROR,
  AUTH_PROFILE_FETCH_START,
  AUTH_PROFILE_FETCH_SUCCESS,
  AUTH_PROFILE_SET,
} from 'store/types/auth';
import type { AppDispatch } from 'store/Store';

function mapUserInfoToProfile(raw: Record<string, unknown>): UserProfile {
  return {
    name: ([raw.name, raw.preferred_username].find(Boolean) as string) ?? 'User',
    email: raw.email as string | undefined,
    picture: raw.picture as string | undefined,
    preferred_username: raw.preferred_username as string | undefined,
    user_id: raw.user_id as string | undefined,
    sub: raw.sub as string | undefined,
  };
}

/**
 * Fetch user profile from Salesforce UserInfo (uses axios – reusable for all API calls)
 */
export const fetchProfile =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    const token = getStoredAccessToken();
    const instanceUrl = getStoredInstanceUrl();

    if (!token || !instanceUrl) {
      dispatch({ type: AUTH_PROFILE_CLEAR });
      return false;
    }

    const stored = getStoredProfile();
    if (stored) {
      dispatch({ type: AUTH_PROFILE_SET, payload: stored });
      return true;
    }

    dispatch({ type: AUTH_PROFILE_FETCH_START });

    try {
      const url = `${instanceUrl.replace(/\/$/, '')}/services/oauth2/userinfo`;
      const response = await axiosInstance.get<Record<string, unknown>>(url);
      const profile = mapUserInfoToProfile(response.data);
      storeProfile(profile);
      dispatch({ type: AUTH_PROFILE_FETCH_SUCCESS, payload: profile });
      return true;
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as Error).message)
          : 'Failed to load profile';
      dispatch({ type: AUTH_PROFILE_FETCH_ERROR, payload: message });
      return false;
    }
  };

export const setProfileFromStorage = (profile: UserProfile | null) => ({
  type: AUTH_PROFILE_SET,
  payload: profile,
});

/**
 * Clear profile and SSO tokens (logout).
 */
export const clearProfile = () => (dispatch: AppDispatch) => {
  clearSsoTokens();
  dispatch({ type: AUTH_PROFILE_CLEAR });
};
