import { ReactElement, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
  Alert,
  Zoom,
  Divider,
  CircularProgress,
  OutlinedInput,
  Radio,
  RadioGroup,
  Checkbox,
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
  subtitle: string;
  inputPlaceholder: string;
  buttonText: string;
  leftPanel?: {
    backgroundImage?: string;
    imageOpacity?: number;
    greetingText?: string;
    mainText?: string;
  };
  footerLinks: Array<{ text?: string; href?: string; type?: string; linkText?: string; linkHref?: string }>;
};

const Login = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [accountType, setAccountType] = useState<'individual' | 'corporate'>('individual');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ssoExchanging, setSsoExchanging] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(
    () => (location.state as { ssoError?: string } | null)?.ssoError ?? null
  );

  const emailRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validateEmail = useCallback((value: string) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  }, []);

  const validatePassword = useCallback((value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitted(true);
      const emailVal = validateEmail(email);
      const passwordVal = validatePassword(password);
      setEmailError(emailVal);
      setPasswordError(passwordVal);
      if (emailVal || passwordVal) return;
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 1500);
    },
    [email, password, validateEmail, validatePassword]
  );

  const formContent = (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 380, width: '100%' }}>
        <Typography variant="h3" sx={{ color: '#000', fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }}>
          {config.title}
        </Typography>
      </Box>

      {showSuccess && (
        <Zoom in>
          <Alert severity="success" sx={{ width: '100%', maxWidth: 380 }} onClose={() => setShowSuccess(false)}>
            Login successful! Redirecting...
          </Alert>
        </Zoom>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 380,
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: 2,
        }}
      >
        <FormControl component="fieldset" fullWidth sx={{ maxWidth: 380, width: '100%' }}>
          <RadioGroup
            row
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as 'individual' | 'corporate')}
            sx={{ justifyContent: 'center', gap: 2 }}
          >
            <FormControlLabel
              value="individual"
              control={<Radio sx={{ color: 'primary.main' }} />}
              label={<Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Individual</Typography>}
            />
            <FormControlLabel
              value="corporate"
              control={<Radio sx={{ color: 'primary.main' }} />}
              label={<Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Corporate / ATO</Typography>}
            />
          </RadioGroup>
        </FormControl>

        <FormControl variant="outlined" fullWidth sx={{ width: '100%', maxWidth: 380, boxSizing: 'border-box', mx: 'auto' }} error={!!emailError && isSubmitted}>
          {emailError && isSubmitted && (
            <Typography variant="caption" color="error" sx={{ mb: 0.5, textAlign: 'left', width: '100%' }}>
              {emailError}
            </Typography>
          )}
          <OutlinedInput
            id="email"
            inputRef={emailRef}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // Only validate if form has been submitted
              if (isSubmitted) {
                setEmailError(validateEmail(e.target.value));
              } else {
                setEmailError('');
              }
            }}
            onBlur={() => {
              // Only validate on blur if form has been submitted
              if (isSubmitted) {
                setEmailError(validateEmail(email));
              }
            }}
            placeholder={config.inputPlaceholder}
            sx={{ width: '100%', boxSizing: 'border-box', borderRadius: 1 }}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth sx={{ width: '100%', maxWidth: 380, boxSizing: 'border-box', mx: 'auto' }} error={!!passwordError && isSubmitted}>
          {passwordError && isSubmitted && (
            <Typography variant="caption" color="error" sx={{ mb: 0.5, textAlign: 'left', width: '100%' }}>
              {passwordError}
            </Typography>
          )}
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              // Only validate if form has been submitted
              if (isSubmitted) {
                setPasswordError(validatePassword(e.target.value));
              } else {
                setPasswordError('');
              }
            }}
            onBlur={() => {
              // Only validate on blur if form has been submitted
              if (isSubmitted) {
                setPasswordError(validatePassword(password));
              }
            }}
            placeholder="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  sx={{ 
                    padding: '4px',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  <IconifyIcon 
                    icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} 
                    width={20} 
                    height={20} 
                    color="#666"
                  />
                </IconButton>
              </InputAdornment>
            }
            sx={{ 
              width: '100%', 
              boxSizing: 'border-box', 
              borderRadius: 1,
              '& .MuiInputAdornment-root': {
                marginRight: '4px',
              }
            }}
          />
        </FormControl>

        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" maxWidth={380} flexWrap="wrap" gap={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{ color: 'primary.main' }}
              />
            }
            label={<Typography variant="body2">Remember me</Typography>}
          />
         </Stack>

        <Box sx={{ width: '100%', maxWidth: 380, boxSizing: 'border-box' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading}
            endIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <IconifyIcon icon="mdi:arrow-right" width={20} height={20} color="white" />
              )
            }
            sx={{
              width: '100%',
              boxSizing: 'border-box',
              height: { xs: 48, sm: 52 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: '2px solid white',
              boxShadow: '0 0 0 1px #2563eb',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                border: '2px solid white',
                boxShadow: '0 0 0 1px #2563eb',
              },
            }}
          >
            {config.buttonText}
          </Button>
        </Box>

        <Divider sx={{ width: '100%', maxWidth: 380, my: 1, '&::before, &::after': { borderColor: '#EAEAEA' } }}>
          <Typography variant="body2" sx={{ color: '#666', px: 1 }}>
            or
          </Typography>
        </Divider>
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
            maxWidth: 380,
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
        {ssoError && (
          <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center', width: '100%' }}>
            {ssoError}
          </Typography>
        )}
      </Box>

      <Stack sx={{ mt: 2, width: '100%', maxWidth: 380, alignItems: 'center', gap: 1.5 }}>
        {config.footerLinks.map((link: (typeof config.footerLinks)[0], index: number) => {
          if (link.type === 'textWithLink') {
            return (
              <Stack key={index} direction="row" gap={0.5} alignItems="center" flexWrap="wrap" justifyContent="center">
                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#666' }}>
                  {link.text}
                </Typography>
                <Link
                  href={link.linkHref}
                  sx={{
                    textDecoration: 'none',
                    color: '#1976D2',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {link.linkText}
                </Link>
              </Stack>
            );
          }
          return (
            <Link
              key={index}
              href={link.href}
              sx={{
                textDecoration: 'none',
                color: '#1976D2',
                fontSize: '0.875rem',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {link.text}
            </Link>
          );
        })}
      </Stack>
    </>
  );

  const leftPanel = config.leftPanel;
  const greetingText = leftPanel?.greetingText ?? 'Welcome to';
  const mainText = leftPanel?.mainText ?? 'Institute of Singapore Chartered Accountants';
  const imageOpacity = leftPanel?.imageOpacity ?? 0.3;

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
              <Image src={logo} width={70} sx={{ width: 60 }} />
            </Link>
            {formContent}
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

            {/* Right – Form */}
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
                <Image src={logo} width={82.6} sx={{ width: 70 }} />
              </Link>
              {formContent}
            </Box>
          </Paper>
        )}
      </Stack>
    </AuthLayout>
  );
};

export default Login;
