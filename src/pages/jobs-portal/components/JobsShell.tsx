import { PropsWithChildren, ReactElement } from 'react';
import { Box } from '@mui/material';

/**
 * Full-width jobs portal content area (horizontal padding only).
 */
const JobsShell = ({ children }: PropsWithChildren): ReactElement => (
  <Box
    sx={{
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      mx: 'auto',
      boxSizing: 'border-box',
      px: { xs: 1.5, sm: 2, md: 2.5 },
    }}
  >
    {children}
  </Box>
);

export default JobsShell;
