# SSO / Auth code backup – restore after git reset

Agar aapne `git fetch origin` + `git reset --hard origin/main` chala diya aur SSO/auth wala code chala gaya, to is file se copy-paste karke wapas laga sakte ho.

---

## 1. `src/App.tsx` (pura file)

```tsx
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { exchangeCodeForToken, fetchUserInfo, storeProfile, storeSsoTokens, type SsoTokenResponse } from 'services/sso';
import { paths } from 'routes/paths';
import PageLoader from 'components/loading/PageLoader';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [exchanging, setExchanging] = useState(false);
  const exchangedRef = useRef(false);

  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  const hasCode = Boolean(code);

  useEffect(() => {
    if (!code || exchangedRef.current) return;
    exchangedRef.current = true;
    setExchanging(true);
    exchangeCodeForToken(code)
      .then(async (data: SsoTokenResponse) => {
        storeSsoTokens(data);
        try {
          const profile = await fetchUserInfo();
          storeProfile(profile);
        } catch {}
        navigate(paths.home, { replace: true });
      })
      .catch((err: Error) => {
        navigate(paths.auth.login, { replace: true, state: { ssoError: err?.message ?? 'SSO sign-in failed' } });
      })
      .finally(() => setExchanging(false));
  }, [code, navigate]);

  if (hasCode || exchanging) return <PageLoader />;
  return <Outlet />;
};

export default App;
```

---

## 2. `src/services/sso.ts`

Create folder `src/services/` if missing. File ka full code: [project me already hai – copy from `src/services/sso.ts`]. Agar file hi nahi hai to batao, main pura content yahan de sakta hoon.

---

## 3. `src/components/auth/RequireAuth.tsx`

Create folder `src/components/auth/` if missing.

```tsx
import { PropsWithChildren, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredAccessToken } from 'services/sso';
import { paths } from 'routes/paths';

export function RequireAuth({ children }: PropsWithChildren): ReactElement {
  const location = useLocation();
  const token = getStoredAccessToken();
  if (!token) return <Navigate to={paths.auth.login} state={{ from: location }} replace />;
  return <>{children}</>;
}
```

---

## 4. `src/components/auth/RedirectIfAuth.tsx`

```tsx
import { PropsWithChildren, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { getStoredAccessToken } from 'services/sso';
import { paths } from 'routes/paths';

export function RedirectIfAuth({ children }: PropsWithChildren): ReactElement {
  const token = getStoredAccessToken();
  if (token) return <Navigate to={paths.home} replace />;
  return <>{children}</>;
}
```

---

## 5. `src/config/axios.tsx` – request/response interceptors

Replace the axios file with:

- Import: `import { getStoredAccessToken, clearSsoTokens } from 'services/sso';` and `import { paths } from 'routes/paths';`
- Request interceptor: use `const token = getStoredAccessToken();` and `Authorization: Bearer ${token}`.
- Response 401: call `clearSsoTokens()` and `window.location.href = paths.auth.login`.

---

## 6. Router (`src/routes/router.tsx`)

- Import: `Navigate`, `paths`, `RedirectIfAuth`, `RequireAuth`.
- Home route: wrap `MainLayout` in `<RequireAuth>...</RequireAuth>`.
- Auth route: wrap `AuthLayout` in `<RedirectIfAuth>...</RedirectIfAuth>`.
- Catch-all: `{ path: '*', element: <Navigate to={paths.auth.login} replace /> }`.

---

## 7. Vite (`vite.config.ts`)

Add the SSO token proxy plugin (getEnv, SSO_BASE, SSO_APP_ID, SSO_APP_SECRET, TOKEN_URL, ssoTokenProxyPlugin that handles POST `/api/sso/token`). Include `ssoTokenProxyPlugin()` in the `plugins` array.

---

## 8. Login (`src/pages/authentication/Login.tsx`)

- Imports: `useNavigate`, `useSearchParams`, `useLocation`, `getSsoAuthorizeUrl`, `exchangeCodeForToken`, `fetchUserInfo`, `storeProfile`, `storeSsoTokens`, `paths`.
- State: `ssoExchanging`, `ssoError` (initial from `location.state?.ssoError`).
- useEffects: (1) set ssoError from `location.state`, (2) if `searchParams.get('code')` then exchange code, store tokens/profile, navigate to home; on error set ssoError.
- UI: After Sign In button add Divider “or”, then “Login with SSO” button (`window.location.href = getSsoAuthorizeUrl()`), then show `ssoError` if set.

---

## 9. `.gitignore`

Add:

```
.env
.env.*
src/.env
.env.local
.env.*.local
```

---

Abhi project me yeh sab files maujood honi chahiye. Agar koi file missing hai to batao – us file ka pura code yahan add kar dunga.
