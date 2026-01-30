import { PropsWithChildren, ReactElement } from 'react';
import { Stack, Box } from '@mui/material';

const AuthLayout = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, sm: 2, md: 3 },
        py: { xs: 3, sm: 4, md: 5 },
        pb: { xs: 4, sm: 5, md: 6 },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {/* Floating Elements */}
        {[...Array(6)].map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              width: { xs: 60, sm: 80, md: 100 },
              height: { xs: 60, sm: 80, md: 100 },
              borderRadius: '50%',
              background: `linear-gradient(135deg, rgba(220, 53, 69, ${0.1 + index * 0.05}) 0%, rgba(220, 53, 69, ${0.05 + index * 0.03}) 100%)`,
              animation: `float ${6 + index * 2}s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`,
              left: `${20 + index * 15}%`,
              top: `${10 + index * 20}%`,
              '@keyframes float': {
                '0%, 100%': {
                  transform: 'translateY(0px) rotate(0deg)',
                },
                '50%': {
                  transform: 'translateY(-20px) rotate(180deg)',
                },
              },
            }}
          />
        ))}

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(220, 53, 69, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(220, 53, 69, 0.08) 0%, transparent 50%)',
          }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
