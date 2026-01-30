import { PropsWithChildren, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredAccessToken } from 'services/sso';
import { paths } from 'routes/paths';

export function RedirectIfAuth({ children }: PropsWithChildren): ReactElement {
  const token = getStoredAccessToken();
  if (token) return <Navigate to={paths.home} replace />;
  return <>{children}</>;
}
