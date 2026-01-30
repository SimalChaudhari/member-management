import { PropsWithChildren, ReactElement } from 'react';
import { Stack, Box } from '@mui/material';

const AuthLayout = ({ children }: PropsWithChildren): ReactElement => {
  return (
  

    <>
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
    </>
  );
};

export default AuthLayout;
