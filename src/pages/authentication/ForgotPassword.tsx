import { ReactElement, Suspense, useState, useEffect, useRef } from 'react';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  Link,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Paper,
  useTheme,
  Alert,
  Fade,
  Zoom,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import Image from 'components/base/Image';
import IconifyIcon from 'components/base/IconifyIcon';
import logo from 'assets/logo/isca-.png';

const ForgotPassword = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [, setStep] = useState<'form' | 'success'>('form');
  
  const theme = useTheme();
  const emailRef = useRef<HTMLInputElement>(null);

  // Auto-focus email field on mount
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidation = validateEmail(email);
    setEmailError(emailValidation);
    
    if (emailValidation) return;
    
    setIsLoading(true);
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setStep('success');
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500 + Math.random() * 1000);
  };

  const isFormValid = email && !emailError;

  return (
    <Fade in timeout={800}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        width="100%"
        maxWidth={{ xs: '100%', md: 1000 }}
        mx="auto"
        sx={{
          minHeight: { xs: 'calc(100vh - 32px)', md: 'auto' },
        }}
      >
        {/* Main Forgot Password Card */}
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
            p={{ xs: 3, sm: 4, md: 5 }}
            gap={{ xs: 3, sm: 4, md: 5 }}
            order={{ xs: 2, md: 1 }}
            sx={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
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
                  fontSize={{ xs: '1.75rem', sm: '2.125rem', md: '2.5rem' }}
                  textAlign={{ xs: 'center', md: 'left' }}
                  sx={{
                    background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Reset Password
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  textAlign={{ xs: 'center', md: 'left' }}
                  fontSize={{ xs: '0.875rem', sm: '1rem' }}
                  sx={{ opacity: 0.8 }}
                >
                  Enter your email to receive a password reset link
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
                }}
                action={
                  <IconifyIcon 
                    icon="mdi:close" 
                    fallbackIcon="mdi:close-circle" 
                    width={16} 
                    height={16} 
                  />
                }
              >
                Reset link sent! Check your email.
              </Alert>
            </Zoom>

            {/* Form */}
            <Stack 
              component="form"
              onSubmit={handleSubmit}
              gap={{ xs: 2.5, sm: 3 }}
              width={{ xs: '100%', sm: 400 }}
              mx="auto"
            >
              <FormControl variant="outlined" fullWidth>
                <InputLabel 
                  htmlFor="email"
                  sx={{ 
                    color: focusedField === 'email' ? 'primary.main' : 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  Email Address
                </InputLabel>
                <TextField
                  ref={emailRef}
                  variant="outlined"
                  placeholder="Enter your email address"
                  id="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  error={!!emailError}
                  helperText={emailError}
                  autoComplete="email"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-1px)',
                        boxShadow: theme.shadows[4],
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[8],
                      },
                      '&.Mui-error': {
                        backgroundColor: 'rgba(244, 67, 54, 0.05)',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconifyIcon 
                          icon="mdi:email" 
                          color={focusedField === 'email' ? theme.palette.primary.main : '#666'}
                          width={20}
                          height={20}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Chip 
                  label="Secure Reset" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                  icon={<IconifyIcon icon="mdi:shield-check" fallbackIcon="mdi:shield" width={14} height={14} />}
                />
                <Chip 
                  label="Email Verification" 
                  size="small" 
                  color="info" 
                  variant="outlined"
                  icon={<IconifyIcon icon="mdi:email-check" fallbackIcon="mdi:email" width={14} height={14} />}
                />
              </Stack>

              <Button 
                type="submit"
                variant="contained" 
                fullWidth
                disabled={!isFormValid || isLoading}
                sx={{
                  py: 1.75,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                  boxShadow: theme.shadows[4],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                    boxShadow: theme.shadows[8],
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #BDBDBD 0%, #9E9E9E 100%)',
                    transform: 'none',
                  },
                  '& .MuiButton-startIcon': {
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover .MuiButton-startIcon': {
                    transform: 'translateX(4px)',
                  },
                }}
                startIcon={
                  isLoading ? (
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        border: '2px solid transparent',
                        borderTop: '2px solid currentColor',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                  ) : (
                    <IconifyIcon icon="mdi:email-send" fallbackIcon="mdi:send" width={20} height={20} />
                  )
                }
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
              </Divider>

              <Typography 
                variant="body2" 
                color="text.secondary" 
                textAlign="center"
                sx={{ opacity: 0.8 }}
              >
                Remember your password?{' '}
                <Link
                  href="/authentication/login"
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'none',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  Back to login
                </Link>
              </Typography>

              {/* Security Information */}
              <Stack gap={1} sx={{ mt: 0 }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  textAlign="center"
                  sx={{ opacity: 0.7 }}
                >
                  🔒 Your email will only be used for password reset
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  textAlign="center"
                  sx={{ opacity: 0.7 }}
                >
                  ⏰ Reset link expires in 24 hours
                </Typography>
              </Stack>

              {/* Keyboard Shortcuts Help */}
              <Typography 
                variant="caption" 
                color="text.secondary" 
                textAlign="center"
                sx={{ 
                  opacity: 0.6,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              >
                💡 Keyboard shortcuts available
              </Typography>
            </Stack>
          </Stack>

          {/* Right Side - Branding */}
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
                    icon="mdi:email-lock" 
                    fallbackIcon="mdi:email"
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
                    Password Recovery
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="primary.dark"
                    fontSize={{ xs: '0.875rem', sm: '1rem' }}
                    sx={{ opacity: 0.8, maxWidth: 300 }}
                  >
                    Don't worry! We'll send you a secure link to reset your password and get back to your account.
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
                    label="24hr Expiry" 
                    size="small" 
                    color="warning" 
                    variant="outlined"
                    icon={<IconifyIcon icon="mdi:clock-alert" fallbackIcon="mdi:clock" width={14} height={14} />}
                  />
                  <Chip 
                    label="Email Verified" 
                    size="small" 
                    color="info" 
                    variant="outlined"
                    icon={<IconifyIcon icon="mdi:email-check" fallbackIcon="mdi:email" width={14} height={14} />}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Suspense>
        </Paper>

      </Stack>
    </Fade>
  );
};

export default ForgotPassword;
