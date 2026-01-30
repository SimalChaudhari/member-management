import { ReactElement, Suspense, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Link,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import signupBanner from 'assets/authentication-banners/signup.png';
import IconifyIcon from 'components/base/IconifyIcon';
import logo from 'assets/logo/isca-.png';
import Image from 'components/base/Image';

const SignUp = (): ReactElement => {
  const theme = useTheme();
  const [captchaCode] = useState('5V4CGJ');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, showing error handling
      setError('This email is already registered. Please try another one.');
    }, 1500);
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
     
    >
      <Paper
        elevation={0}
        sx={{
          width: { xs: '100%', md: 960 },
          maxWidth: 960,
          minHeight: { xs: 'auto', md: 591 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {/* Left Side - Form */}
        <Stack
          width={{ xs: 1, md: 0.55 }}
          p={{ xs: 3, sm: 4, md: 5 }}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,0.97) 100%)',
          }}
        >
          <Link 
            href="/" 
            sx={{ 
              width: 'fit-content',
              mb: { xs: 3, md: 4 },
              transition: 'transform 0.2s ease-in-out',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            <Image 
              src={logo} 
              width={82.6} 
              sx={{ 
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} 
            />
          </Link>

          <Stack gap={3} width="100%" maxWidth={450} mx="auto">
            <Stack gap={1}>
              <Typography
                variant="h3"
                sx={{
                  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  mb: 1,
                }}
              >
                CREATE ACCOUNT
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign={{ xs: 'center', md: 'left' }}
                sx={{ opacity: 0.85 }}
              >
                Create an Account Today
              </Typography>
            </Stack>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 2,
                  animation: 'fadeIn 0.3s ease-in-out',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(-10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <Stack gap={2.5}>
              {/* Name Fields */}
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel 
                    shrink 
                    htmlFor="firstName"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600
                    }}
                  >
                    First Name
                  </InputLabel>
                  <TextField
                    variant="filled"
                    placeholder="First Name"
                    id="firstName"
                    required
                    sx={{
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'action.hover',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'action.selected'
                        }
                      }
                    }}
                  />
                </FormControl>
                <FormControl variant="standard" fullWidth>
                  <InputLabel 
                    shrink 
                    htmlFor="lastName"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600
                    }}
                  >
                    Last Name
                  </InputLabel>
                  <TextField
                    variant="filled"
                    placeholder="Last Name"
                    id="lastName"
                    required
                    sx={{
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'action.hover',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'action.selected'
                        }
                      }
                    }}
                  />
                </FormControl>
              </Stack>

              {/* Name As Per ID */}
              <FormControl variant="standard" fullWidth>
                <InputLabel 
                  shrink 
                  htmlFor="nameAsPerID"
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600
                  }}
                >
                  Name As Per ID{' '}
                  <Typography 
                    component="span" 
                    color="error.main" 
                    fontSize="0.85em"
                  >
                    (Example: Tan Zhi Wen)
                  </Typography>
                </InputLabel>
                <TextField
                  variant="filled"
                  placeholder="Name As Per ID"
                  id="nameAsPerID"
                  required
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'action.hover',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }
                  }}
                />
              </FormControl>

              {/* Email */}
              <FormControl variant="standard" fullWidth>
                <InputLabel 
                  shrink 
                  htmlFor="email"
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600
                  }}
                >
                  Email Address
                </InputLabel>
                <TextField
                  variant="filled"
                  placeholder="Email Address"
                  type="email"
                  id="email"
                  required
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'action.hover',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }
                  }}
                />
              </FormControl>


              {/* Terms */}
              <FormControlLabel
                control={
                  <Checkbox 
                    required
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main'
                      }
                    }}
                  />
                }
                label={
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ opacity: 0.85 }}
                  >
                    I confirm that I have read and I agree to (i) the{' '}
                    <Link 
                      href="#" 
                      underline="hover"
                      sx={{ color: 'primary.main' }}
                    >
                      Terms of Use
                    </Link>
                    , and (ii) the{' '}
                    <Link 
                      href="#" 
                      underline="hover"
                      sx={{ color: 'primary.main' }}
                    >
                      Privacy and Data Protection Policy
                    </Link>
                    {' '}which sets out how my personal data will be collected, used, disclosed and processed by the Institute of Singapore Chartered Accountants and the purposes of processing.
                  </Typography>
                }
                sx={{ 
                  alignItems: 'flex-start',
                  mt: 1
                }}
              />

              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  bgcolor: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.dark'
                  },
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'inherit'
                    }}
                  >
                    <IconifyIcon 
                      icon="eos-icons:loading" 
                      width={24} 
                      height={24}
                    />
                  </Box>
                ) : 'CREATE ACCOUNT'}
              </Button>

              <Stack 
                direction="row" 
                alignItems="center"
                justifyContent="center" 
                mt={3}
                gap={1}
              >
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                >
                  Already have an account?
                </Typography>
                <Link 
                  href="/authentication/login" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Login here
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* Right Side - Banner */}
        <Suspense
          fallback={
            <Skeleton
              variant="rectangular"
              height="100%"
              width="100%"
              sx={{
                bgcolor: 'primary.main',
                background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)'
              }}
            />
          }
        >
          <Box
            sx={{
              width: { xs: '100%', md: '45%' },
              height: { xs: 200, md: 'auto' },
              position: 'relative',
              overflow: 'hidden',
              display: { xs: 'none', md: 'block' },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.95) 0%, rgba(21, 101, 192, 0.95) 100%)',
                zIndex: 1
              }
            }}
          >
            <Image
              alt="Signup banner"
              src={signupBanner}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <Stack
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              zIndex={2}
              alignItems="center"
              justifyContent="center"
              p={4}
              gap={3}
              sx={{
                background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)'
              }}
            >
              <IconifyIcon
                icon="mdi:account-plus"
                width={64}
                height={64}
                color="white"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}
              />
              <Stack gap={1} textAlign="center">
                <Typography
                  variant="h4"
                  color="white"
                  fontWeight={700}
                  sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                  Welcome to ISCA
                </Typography>
                <Typography
                  variant="body1"
                  color="white"
                  sx={{ opacity: 0.9 }}
                >
                  Join Singapore's national accountancy body
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Suspense>
      </Paper>
    </Stack>
  );
};

export default SignUp;
