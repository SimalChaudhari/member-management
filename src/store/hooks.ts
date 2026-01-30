import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from 'store/Store';
import { getStoredAccessToken } from 'services/sso';
import { paths } from 'routes/paths';
import { fetchProfile, clearProfile } from 'store/action/AuthActions';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Auth profile from Redux. Fetches profile on mount when token exists.
 */
export function useAuthProfile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profile, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (getStoredAccessToken()) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  const logout = () => {
    dispatch(clearProfile());
    navigate(paths.auth.login, { replace: true });
  };

  const refreshProfile = () => {
    dispatch(fetchProfile());
  };

  return { profile, loading, error, logout, refreshProfile };
}
