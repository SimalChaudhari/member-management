import { PropsWithChildren, ReactElement } from 'react';
import { Box } from '@mui/material';

/**
 * Full-width jobs portal content area (horizontal padding only).
 */
const JobsShell = ({ children }: PropsWithChildren): ReactElement => (
  <Box
    sx={{
      width: '100%',
      mx: 'auto',
      px: { xs: 0, sm: 0.5 },
    }}
  >
    {children}
  </Box>
);

export default JobsShell;
