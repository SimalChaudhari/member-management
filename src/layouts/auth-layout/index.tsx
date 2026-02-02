import { Box } from '@mui/material';
import { PropsWithChildren, ReactElement } from 'react';
const AuthLayout = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 3, md: 4 },
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Box>
  );
};

export default AuthLayout;
