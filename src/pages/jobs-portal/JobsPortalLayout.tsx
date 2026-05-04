import { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Alert,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ThemeProvider,
  Typography,
} from '@mui/material';

import { useJobsPortalRole } from 'services/jobs/useJobsPortalRole';
import type { JobsPortalRole } from 'services/jobs/types';
import { jobsPortalTheme } from 'pages/jobs-portal/theme/jobsTheme';

const roleLabel: Record<JobsPortalRole, string> = {
  individual: 'Job seeker',
  corporate: 'Employer',
  admin: 'Admin',
};

/**
 * Shell for Jobs Portal routes. Nested theme = LinkedIn Jobs–style polish. Dev role switch until API provides account type.
 */
const JobsPortalLayout = (): ReactElement => {
  const { role, setRole } = useJobsPortalRole();

  return (
    <ThemeProvider theme={jobsPortalTheme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '72vh',
          width: '100%',
          ml: { xs: 0, sm: -2.5, md: -3 },
          mr: { xs: 0, sm: -2.5, md: -3 },
          px: { xs: 0, sm: 2.5, md: 3 },
          py: { xs: 2, md: 3 },
          borderRadius: { lg: 2 },
        }}
      >
        <Stack spacing={2.5} sx={{ width: '100%' }}>
          <Alert
            severity="info"
            icon={false}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.light',
              bgcolor: 'rgba(10, 102, 194, 0.06)',
              '& .MuiAlert-message': { width: '100%' },
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
              justifyContent="space-between"
            >
              <Stack spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                  <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                    Jobs — development preview
                  </Typography>
                  <Chip label="Mock data" size="small" sx={{ fontWeight: 600, height: 22 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Switch role to preview navigation. Connect your API in <code>services/jobs/jobsApi.ts</code>.
                </Typography>
              </Stack>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="jobs-dev-role-label">Preview as</InputLabel>
                <Select
                  labelId="jobs-dev-role-label"
                  label="Preview as"
                  value={role}
                  onChange={(e) => setRole(e.target.value as JobsPortalRole)}
                >
                  <MenuItem value="individual">{roleLabel.individual}</MenuItem>
                  <MenuItem value="corporate">{roleLabel.corporate}</MenuItem>
                  <MenuItem value="admin">{roleLabel.admin}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Alert>
          <Outlet />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default JobsPortalLayout;
