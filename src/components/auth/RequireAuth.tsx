import { PropsWithChildren, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredAccessToken } from 'services/sso';
import { paths } from 'routes/paths';

/**
 * Protects dashboard routes: without login (no SSO token), redirects to login.
 */
export function RequireAuth({ children }: PropsWithChildren): ReactElement {
  const location = useLocation();
  const token = getStoredAccessToken();

  if (!token) {
    return <Navigate to={paths.auth.login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
