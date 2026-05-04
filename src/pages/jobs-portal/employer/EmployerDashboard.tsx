import { ReactElement, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Paper, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

import JobsPageHeader from 'pages/jobs-portal/components/JobsPageHeader';
import JobsShell from 'pages/jobs-portal/components/JobsShell';
import { paths } from 'routes/paths';
import { listEmployerJobs } from 'services/jobs/jobsApi';
import type { JobPost } from 'services/jobs/types';

const EmployerDashboard = (): ReactElement => {
  const [jobs, setJobs] = useState<JobPost[]>([]);

  useEffect(() => {
    listEmployerJobs('co1').then(setJobs);
  }, []);

  const active = jobs.filter((j) => j.status === 'active').length;
  const drafts = jobs.filter((j) => j.status === 'draft').length;
  const pending = jobs.filter((j) => j.status === 'pending_moderation').length;

  return (
    <JobsShell>
      <JobsPageHeader
        title="Talent dashboard"
        subtitle="Post roles, review applicants, and move candidates through your pipeline."
        action={
          <Button
            component={RouterLink}
            to={`${paths.jobsPortal.myJobPosts}?new=1`}
            variant="contained"
            size="large"
          >
            Post a free job
          </Button>
        }
      />

      <Grid2 container spacing={2} sx={{ mb: 3 }}>
        <Grid2 xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderTop: '4px solid',
              borderTopColor: 'primary.main',
            }}
          >
            <Typography variant="h3" fontWeight={700} color="primary">
              {active}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Active jobs
            </Typography>
          </Paper>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderTop: '4px solid',
              borderTopColor: 'warning.main',
            }}
          >
            <Typography variant="h3" fontWeight={700} color="warning.main">
              {pending}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              In review
            </Typography>
          </Paper>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderTop: '4px solid',
              borderTopColor: 'text.secondary',
            }}
          >
            <Typography variant="h3" fontWeight={700} color="text.secondary">
              {drafts}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Drafts
            </Typography>
          </Paper>
        </Grid2>
      </Grid2>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button component={RouterLink} to={paths.jobsPortal.myJobPosts} variant="outlined" size="large" fullWidth>
          Manage job posts
        </Button>
      </Stack>
    </JobsShell>
  );
};

export default EmployerDashboard;
