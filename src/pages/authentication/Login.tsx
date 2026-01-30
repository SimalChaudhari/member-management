import { ReactElement, Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Alert,
  Fade,
  Zoom,
  Box,
  Divider,
  Chip,
  Tooltip,
  Snackbar,
  CircularProgress,
  OutlinedInput,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import logo from 'assets/logo/isca-.png';
import Image from 'components/base/Image';
import { getSsoAuthorizeUrl, exchangeCodeForToken, fetchUserInfo, storeProfile, storeSsoTokens } from 'services/sso';
import { paths } from 'routes/paths';

const Login = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [ssoExchanging, setSsoExchanging] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(() => (location.state as { ssoError?: string } | null)?.ssoError ?? null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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
        } catch {
          // optional
        }
        navigate(paths.home, { replace: true });
      })
      .catch((err) => {
        if (!cancelled) {
          setSsoError(err?.message ?? 'SSO sign-in failed');
          setSsoExchanging(false);
        }
      });
    return () => { cancelled = true; };
  }, [searchParams, navigate]);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e as any);
      }
      // Tab navigation enhancement
      if (e.key === 'Tab') {
        setFocusedField(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    
    if (emailValidation || passwordValidation) return;
    
    setIsLoading(true);
    setAttemptCount(prev => prev + 1);
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500 + Math.random() * 1000); // Random delay for realism
  };

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <Fade in timeout={800}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        width="100%"
        maxWidth={{ xs: '100%', md: 1000 }}
        mx="auto"
        sx={{
          minHeight: { xs: 'calc(100vh - 64px)', md: 'auto' },
          p: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 4, sm: 5, md: 6 },
        }}
      >
        {/* Main Login Card */}
        <Paper
          elevation={24}
          sx={{
            borderRadius: { xs: 2, md: 3 },
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '100%',
            height: { xs: 'auto', md: 700 },
            minHeight: { xs: 'auto', md: 700 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #1976D2 0%, #1565C0 50%, #0D47A1 100%)',
              zIndex: 1,
            },
          }}
        >
          {/* Left Side - Form */}
          <Stack 
            width={{ xs: 1, md: 0.55 }} 
            p={{ xs: 3, sm: 4 }}
            gap={{ xs: 3, sm: 4 }}
            order={{ xs: 2, md: 1 }}
            sx={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Stack gap={2}>
              <Link 
                href="/" 
                sx={{ 
                  alignSelf: { xs: 'center', md: 'flex-start' },
                  textDecoration: 'none',
                }}
              >
                <Image 
                  src={logo} 
                  width={82.6}
                  sx={{
                    width: { xs: 60, sm: 70, md: 82.6 },
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              </Link>
              
              <Stack gap={1}>
                <Typography 
                  variant="h3" 
                  color="primary.main" 
                  fontWeight={700}
                  fontSize={{ xs: '1.75rem', sm: '2rem', md: '2.25rem' }}
                  textAlign={{ xs: 'center', md: 'left' }}
                  sx={{
                    background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  textAlign={{ xs: 'center', md: 'left' }}
                  fontSize={{ xs: '0.875rem', sm: '1rem' }}
                  sx={{ opacity: 0.8 }}
                >
                  Sign in to your ISCA member portal
                </Typography>
              </Stack>
            </Stack>

            {/* Success Alert */}
            <Zoom in={showSuccess}>
              <Alert 
                severity="success" 
                sx={{ 
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  mb: 2,
                }}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => setShowSuccess(false)}
                  >
                    <IconifyIcon icon="mdi:close" fallbackIcon="mdi:close-circle" width={16} height={16} />
                  </IconButton>
                }
              >
                Login successful! Redirecting...
              </Alert>
            </Zoom>

            {/* Form */}
            <Stack 
              component="form"
              onSubmit={handleSubmit}
              gap={3}
              width={{ xs: '100%', sm: 400 }}
              mx="auto"
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email Address"
                  placeholder="company@yopmail.com"
                  startAdornment={
                    <InputAdornment position="start">
                      <IconifyIcon icon="mdi:email" fallbackIcon="mdi:at" width={20} height={20} />
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  placeholder="••••••••"
                  startAdornment={
                    <InputAdornment position="start">
                      <IconifyIcon icon="mdi:lock" fallbackIcon="mdi:key" width={20} height={20} />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        <IconifyIcon 
                          icon={showPassword ? "mdi:eye-off" : "mdi:eye"} 
                          fallbackIcon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                          width={20} 
                          height={20} 
                        />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Link 
                  href="/authentication/forgot-password" 
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'none',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  Forgot password?
                </Link>
                <Stack direction="row" gap={1}>
                  <Chip 
                    label="Secure Login" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                    icon={<IconifyIcon icon="mdi:shield-check" fallbackIcon="mdi:shield" width={14} height={14} />}
                  />
                  {attemptCount > 0 && (
                    <Chip 
                      label={`Attempt ${attemptCount}`}
                      size="small" 
                      color="info" 
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Stack>

              {/* Submit Button */}
              <Stack gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <IconifyIcon 
                        icon="mdi:login" 
                        fallbackIcon="mdi:account-arrow-right" 
                        width={20} 
                        height={20} 
                      />
                    )
                  }
                  sx={{
                    height: { xs: 48, sm: 52 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                      boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #BDBDBD 0%, #9E9E9E 100%)',
                      boxShadow: 'none',
                      transform: 'none',
                    },
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <Divider sx={{ my: 1, '&::before, &::after': { borderColor: 'divider' } }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', px: 1 }}>or</Typography>
                </Divider>
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  fullWidth
                  disabled={ssoExchanging}
                  onClick={() => { window.location.href = getSsoAuthorizeUrl(); }}
                  startIcon={
                    ssoExchanging ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <IconifyIcon icon="mdi:openid" width={22} height={22} />
                    )
                  }
                  sx={{
                    height: { xs: 48, sm: 52 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  {ssoExchanging ? 'Signing in with SSO…' : 'Login with SSO'}
                </Button>
                {ssoError && (
                  <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center' }}>
                    {ssoError}
                  </Typography>
                )}
              </Stack>
            </Stack>

            {/* Footer Links */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              justifyContent="space-between" 
              alignItems={{ xs: 'center', sm: 'flex-start' }}
              gap={{ xs: 1, sm: 2 }}
              sx={{ 
                pt: 3,
                mt: 'auto',
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <Link 
                href="/authentication/forgot-password" 
                sx={{ 
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontSize: { xs: '0.875rem', sm: '0.9rem' },
                  fontWeight: 500,
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: 'primary.dark',
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot your password?
              </Link>
              <Stack direction="row" gap={0.5} alignItems="center">
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  fontSize={{ xs: '0.875rem', sm: '0.9rem' }}
                >
                  Don't have an account?
                </Typography>
                <Link 
                  href="/authentication/sign-up" 
                  sx={{ 
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontSize: { xs: '0.875rem', sm: '0.9rem' },
                    fontWeight: 600,
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up
                </Link>
              </Stack>
            </Stack>

          </Stack>

          <Suspense
            fallback={
              <Skeleton 
                variant="rectangular" 
                height={1} 
                width={1} 
                sx={{ 
                  bgcolor: 'primary.main',
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                }} 
              />
            }
          >
            <Stack
              width={{ xs: 1, md: 0.45 }}
              height={{ xs: 200, sm: 250, md: '100%' }}
              sx={{
                background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                order: { xs: 1, md: 2 },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)
                  `,
                },
              }}
            >
              <Stack
                alignItems="center"
                gap={3}
                sx={{ position: 'relative', zIndex: 1 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: theme.shadows[8],
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                    },
                  }}
                >
                  <IconifyIcon 
                    icon="mdi:account-group" 
                    fallbackIcon="mdi:account-multiple"
                    width={40} 
                    height={40} 
                    color="white"
                  />
                </Box>
                
                <Stack gap={1} textAlign="center">
                  <Typography 
                    variant="h4" 
                    color="primary.main" 
                    fontWeight={700}
                    fontSize={{ xs: '1.25rem', sm: '1.5rem', md: '2rem' }}
                    sx={{
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    ISCA Member Portal
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="primary.dark"
                    fontSize={{ xs: '0.875rem', sm: '1rem' }}
                    sx={{ opacity: 0.8, maxWidth: 300 }}
                  >
                    Access your membership benefits, manage your profile, and stay connected with the ISCA community.
                  </Typography>
                </Stack>

                <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center">
                  <Chip 
                    label="Secure" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                    icon={<IconifyIcon icon="mdi:shield-check" fallbackIcon="mdi:shield" width={14} height={14} />}
                  />
                  <Chip 
                    label="24/7 Access" 
                    size="small" 
                    color="info" 
                    variant="outlined"
                    icon={<IconifyIcon icon="mdi:clock" fallbackIcon="mdi:clock-outline" width={14} height={14} />}
                  />
                  <Chip 
                    label="Mobile Ready" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    icon={<IconifyIcon icon="mdi:cellphone" fallbackIcon="mdi:phone" width={14} height={14} />}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Suspense>
        </Paper>

        {/* Keyboard Shortcuts Snackbar */}
        <Snackbar
          open={showKeyboardShortcuts}
          autoHideDuration={4000}
          onClose={() => setShowKeyboardShortcuts(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              '& .MuiAlert-message': {
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              },
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              Keyboard Shortcuts
            </Typography>
            <Typography variant="body2">
              • <strong>Tab</strong> - Navigate between fields
            </Typography>
            <Typography variant="body2">
              • <strong>Ctrl/Cmd + Enter</strong> - Submit form
            </Typography>
            <Typography variant="body2">
              • <strong>Space</strong> - Toggle password visibility
            </Typography>
          </Alert>
        </Snackbar>
      </Stack>
    </Fade>
  );
};

export default Login;
