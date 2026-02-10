import { ReactElement, useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Button,
  Stack,
  Typography,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Link,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import logo from 'assets/logo/isca-.png';
import Image from 'components/base/Image';
import AuthLayout from 'layouts/auth-layout';
import authPageConfig from 'config/authPageConfig.json';
import {
  getSsoAuthorizeUrl,
  exchangeCodeForToken,
  fetchUserInfo,
  storeProfile,
  storeSsoTokens,
} from 'services/sso';
import { paths } from 'routes/paths';
import { useAppDispatch } from 'store/hooks';
import { setProfileFromStorage } from 'store/action/AuthActions';
import logo2 from 'assets/login/login.png';

const config = authPageConfig.login as {
  title: string;
  leftPanel?: {
    greetingText?: string;
    mainText?: string;
  };
};

const Login = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [ssoExchanging, setSsoExchanging] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(
    () => (location.state as { ssoError?: string } | null)?.ssoError ?? null
  );

  useEffect(() => {
    const err = (location.state as { ssoError?: string } | null)?.ssoError;
    if (err) setSsoError(err);
  }, [location.state]);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code || ssoExchanging) return;
    let cancelled = false;
    setSsoExchanging(true);
    setSsoError(null);
    exchangeCodeForToken(code)
      .then(async (data) => {
        if (cancelled) return;
        storeSsoTokens(data);
        try {
          const profile = await fetchUserInfo();
          storeProfile(profile);
          dispatch(setProfileFromStorage(profile));
        } catch {}
        navigate(paths.home, { replace: true });
      })
      .catch((err) => {
        if (!cancelled) {
          setSsoError(err?.message ?? 'SSO sign-in failed');
          setSsoExchanging(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [searchParams, navigate, dispatch]);

  const leftPanel = config.leftPanel;
  const greetingText = leftPanel?.greetingText ?? 'Welcome to';
  const mainText = leftPanel?.mainText ?? 'Institute of Singapore Chartered Accountants';

  const ssoContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 380, width: '100%' }}>
      <Typography variant="h3" sx={{ color: '#000', fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }}>
        {/* {config.title} */}
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 380, boxSizing: 'border-box', mt: 3 }}>
        <Button
          type="button"
          variant="outlined"
          size="large"
          fullWidth
          disabled={ssoExchanging}
          onClick={() => {
            window.location.href = getSsoAuthorizeUrl();
          }}
          startIcon={
            ssoExchanging ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <IconifyIcon icon="mdi:openid" width={22} height={22} />
            )
          }
          sx={{
            width: '100%',
            boxSizing: 'border-box',
            height: { xs: 48, sm: 52 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 600,
            borderRadius: '50px',
            borderColor: '#2563eb',
            color: '#2563eb',
            '&:hover': { borderColor: '#1d4ed8', backgroundColor: 'rgba(37, 99, 235, 0.04)' },
          }}
        >
          {ssoExchanging ? 'Signing in with SSO…' : 'Login with SSO'}
        </Button>
      </Box>

      {ssoError && (
        <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center', width: '100%', mt: 2 }}>
          {ssoError}
        </Typography>
      )}
    </Box>
  );

  return (
    <AuthLayout>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: 1000 },
          height: '100%',
          mx: 'auto',
        }}
      >
        {isMobile ? (
          <Stack alignItems="center" gap={2} width="100%" sx={{ py: 2 }}>
            <Link href="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Image src={logo} width={150} sx={{ width: 150 }} />
            </Link>
            {ssoContent}
          </Stack>
        ) : (
          <Paper
            elevation={8}
            sx={{
              position: 'relative',
              borderRadius: 2,
              width: '100%',
              maxWidth: 960,
              minHeight: 560,
              display: 'flex',
              flexDirection: 'row',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #1976D2 0%, #1565C0 100%)',
                zIndex: 1,
              },
            }}
          >
            {/* Left – Image panel */}
            <Box
              sx={{
                width: { md: '50%' },
                minWidth: 280,
                position: 'relative',
                backgroundImage: `url(${logo2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, rgba(25, 118, 210, 0.30) 0%, rgba(21, 101, 192, 0.8) 100%)`,
                  zIndex: 0,
                },
              }}
            >
              <Stack alignItems="center" justifyContent="center" gap={2} sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, fontSize: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  {greetingText}
                </Typography>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4, textShadow: '0 2px 4px rgba(0,0,0,0.2)', whiteSpace: 'pre-line' }}>
                  {mainText}
                </Typography>
              </Stack>
            </Box>

            {/* Right – SSO only */}
            <Box
              sx={{
                width: { md: '50%' },
                p: { sm: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.98)',
                minWidth: 0,
              }}
            >
              <Link href="/" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', mb: 1, width: '100%' }}>
                <Image src={logo} width={82.6} sx={{ width: 150 }} />
              </Link>
              {ssoContent}
            </Box>
          </Paper>
        )}
      </Stack>
    </AuthLayout>
  );
};

export default Login;
