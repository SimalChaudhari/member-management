/**
 * Auth / profile state and action types for Redux
 */

export type UserProfile = {
  name: string;
  email?: string;
  picture?: string;
  preferred_username?: string;
  user_id?: string;
  sub?: string;
};

export type AuthState = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
};

export const AUTH_PROFILE_FETCH_START = 'AUTH_PROFILE_FETCH_START';
export const AUTH_PROFILE_FETCH_SUCCESS = 'AUTH_PROFILE_FETCH_SUCCESS';
export const AUTH_PROFILE_FETCH_ERROR = 'AUTH_PROFILE_FETCH_ERROR';
export const AUTH_PROFILE_SET = 'AUTH_PROFILE_SET';
export const AUTH_PROFILE_CLEAR = 'AUTH_PROFILE_CLEAR';

export type AuthProfileFetchStartAction = { type: typeof AUTH_PROFILE_FETCH_START };
export type AuthProfileFetchSuccessAction = { type: typeof AUTH_PROFILE_FETCH_SUCCESS; payload: UserProfile };
export type AuthProfileFetchErrorAction = { type: typeof AUTH_PROFILE_FETCH_ERROR; payload: string };
export type AuthProfileSetAction = { type: typeof AUTH_PROFILE_SET; payload: UserProfile | null };
export type AuthProfileClearAction = { type: typeof AUTH_PROFILE_CLEAR };

export type AuthAction =
  | AuthProfileFetchStartAction
  | AuthProfileFetchSuccessAction
  | AuthProfileFetchErrorAction
  | AuthProfileSetAction
  | AuthProfileClearAction;
