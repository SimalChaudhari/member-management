import { ReactElement, useState, Suspense } from 'react';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
  Alert,
  Zoom,
  Box,
  Fade,
  Skeleton,
  useTheme,
  Chip
} from '@mui/material';
import resetPassword from 'assets/authentication-banners/reset-password.png';
import passwordUpdated from 'assets/authentication-banners/password-updated.png';
import successTick from 'assets/authentication-banners/successTick.png';
import Image from 'components/base/Image';
import logo from 'assets/logo/isca-.png';
import IconifyIcon from 'components/base/IconifyIcon';

const ResetPassword = (): ReactElement => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSuccessful, setResetSuccessful] = useState(false);
  const theme = useTheme();

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) {
      setError('Both fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setResetSuccessful(true);
  };

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
        <Paper
          elevation={24}
          sx={{
            borderRadius: { xs: 2, md: 3 },
            overflow: 'hidden',
            width: { xs: '100%', md: 900 },
            maxWidth: 960,
            minHeight: { xs: 'auto', md: 520 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.10)',
            position: 'relative',
          }}
        >
          {/* Left Side - Form */}
          <Stack
            width={{ xs: 1, md: 0.55 }}
            p={{ xs: 3, sm: 4, md: 5 }}
            gap={{ xs: 3, sm: 4, md: 5 }}
            justifyContent="center"
            alignItems="stretch"
            sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,0.97) 100%)',
              minHeight: { xs: 'auto', md: 520 },
            }}
          >
            <Link href="/" sx={{ alignSelf: { xs: 'center', md: 'flex-start' }, mb: 1 }}>
              <Image src={logo} width={82.6} />
            </Link>

            {!resetSuccessful ? (
              <>
                <Typography
                  variant="h3"
                  color="primary.main"
                  fontWeight={700}
                  fontSize={{ xs: '1.5rem', sm: '2rem', md: '2.25rem' }}
                  textAlign={{ xs: 'center', md: 'left' }}
                  sx={{
                    background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.08)',
                    mb: 1,
                  }}
                >
                  Reset Your Password
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign={{ xs: 'center', md: 'left' }}
                  sx={{ mb: 2, opacity: 0.85 }}
                >
                  Enter your new password below. Make sure it's strong and unique for your ISCA account.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Stack
                  component="form"
                  gap={2.5}
                  onSubmit={handleResetPassword}
                  autoComplete="off"
                >
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="new-password">New Password</InputLabel>
                    <OutlinedInput
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      label="New Password"
                      placeholder="Enter new password"
                      startAdornment={
                        <InputAdornment position="start">
                          <IconifyIcon icon="mdi:lock" fallbackIcon="mdi:key" width={20} height={20} />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            size="small"
                          >
                            <IconifyIcon icon={showNewPassword ? 'mdi:eye-off' : 'mdi:eye'} fallbackIcon={showNewPassword ? 'mdi:eye-off' : 'mdi:eye'} width={20} height={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      label="Confirm Password"
                      placeholder="Confirm new password"
                      startAdornment={
                        <InputAdornment position="start">
                          <IconifyIcon icon="mdi:lock-check" fallbackIcon="mdi:key" width={20} height={20} />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            size="small"
                          >
                            <IconifyIcon icon={showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'} fallbackIcon={showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'} width={20} height={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      height: 48,
                      fontWeight: 600,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                      boxShadow: '0 8px 24px rgba(25, 118, 210, 0.18)',
                      textTransform: 'none',
                      letterSpacing: '0.5px',
                      fontSize: '1rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                        boxShadow: '0 12px 32px rgba(25, 118, 210, 0.22)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    fullWidth
                  >
                    Reset Password
                  </Button>
                </Stack>

                <Stack direction="row" justifyContent="center" alignItems="center" gap={1} sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Back to
                  </Typography>
                  <Link
                    href="/authentication/login"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.dark', textDecoration: 'underline' },
                    }}
                  >
                    Log in
                  </Link>
                </Stack>
              </>
            ) : (
              <Zoom in>
                <Stack alignItems="center" gap={3.5} justifyContent="center" width="100%" height="100%">
                  <Image src={successTick} width={64} sx={{ mb: 1 }} />
                  <Typography variant="h3" color="success.main" fontWeight={700} textAlign="center">
                    Password Reset Successfully
                  </Typography>
                  <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 2 }}>
                    Your ISCA login password has been updated.<br />You can now sign in with your new password.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    href="/authentication/login"
                    sx={{
                      height: 48,
                      fontWeight: 600,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                      boxShadow: '0 8px 24px rgba(25, 118, 210, 0.18)',
                      textTransform: 'none',
                      letterSpacing: '0.5px',
                      fontSize: '1rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                        boxShadow: '0 12px 32px rgba(25, 118, 210, 0.22)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    fullWidth
                  >
                    Continue to Login
                  </Button>
                </Stack>
              </Zoom>
            )}
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
                    Reset Password
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary.dark"
                    fontSize={{ xs: '0.875rem', sm: '1rem' }}
                    sx={{ opacity: 0.8, maxWidth: 300 }}
                  >
                    Your password is securely encrypted.
                    Please use a strong password to protect your account.
                  </Typography>
                </Stack>

              </Stack>
            </Stack>
          </Suspense>
        </Paper>
      </Stack>
    </Fade>
  );
};

export default ResetPassword;
