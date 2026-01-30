import {
  AUTH_PROFILE_CLEAR,
  AUTH_PROFILE_FETCH_ERROR,
  AUTH_PROFILE_FETCH_START,
  AUTH_PROFILE_FETCH_SUCCESS,
  AUTH_PROFILE_SET,
  type AuthState,
  type AuthAction,
} from '../types/auth';

const initialState: AuthState = {
  profile: null,
  loading: false,
  error: null,
};

const AuthReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AUTH_PROFILE_FETCH_START:
      return { ...state, loading: true, error: null };
    case AUTH_PROFILE_FETCH_SUCCESS:
      return { ...state, profile: action.payload, loading: false, error: null };
    case AUTH_PROFILE_SET:
      return { ...state, profile: action.payload, loading: false, error: null };
    case AUTH_PROFILE_FETCH_ERROR:
      return { ...state, loading: false, error: action.payload, profile: null };
    case AUTH_PROFILE_CLEAR:
      return initialState;
    default:
      return state;
  }
};

export default AuthReducer;
