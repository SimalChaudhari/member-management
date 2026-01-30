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
