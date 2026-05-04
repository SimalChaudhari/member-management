import { ReactElement, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import JobCardSkeleton from 'pages/jobs-portal/components/JobCardSkeleton';
import JobListingCard from 'pages/jobs-portal/components/JobListingCard';
import JobsPageHeader from 'pages/jobs-portal/components/JobsPageHeader';
import JobsShell from 'pages/jobs-portal/components/JobsShell';
import { paths } from 'routes/paths';
import { getCompanyDisplayName, listRecommendedJobs } from 'services/jobs/jobsApi';
import { useJobsPortalRole } from 'services/jobs/useJobsPortalRole';
import type { JobPost } from 'services/jobs/types';

const SeekerDashboard = (): ReactElement => {
  const { role } = useJobsPortalRole();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listRecommendedJobs(role)
      .then((j) => {
        if (!cancelled) setJobs(j);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [role]);

  return (
    <JobsShell>
      <JobsPageHeader
        title="Top job picks for you"
        subtitle="Based on your profile, skills, and preferences (mock recommendations in dev)."
        action={
          <Button component={RouterLink} to={paths.jobsPortal.browseJobs} variant="outlined" color="primary">
            See all jobs
          </Button>
        }
      />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(10,102,194,0.08) 0%, rgba(10,102,194,0.02) 100%)',
          border: '1px solid rgba(10, 102, 194, 0.12)',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Finish your profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Stronger profiles get better matches and more recruiter views — add headline, experience, and salary
          expectations.
        </Typography>
        <Button component={RouterLink} to={paths.jobsPortal.careerProfile} variant="contained" size="medium">
          Update career profile
        </Button>
      </Paper>

      {loading ? (
        <Stack spacing={1.5}>
          <JobCardSkeleton />
          <JobCardSkeleton />
        </Stack>
      ) : (
        <Grid container spacing={1.5}>
          {jobs.map((job) => (
            <Grid xs={12} key={job.jobId}>
              <JobListingCard
                job={job}
                companyName={getCompanyDisplayName(job.companyId)}
                to={paths.jobsPortal.jobDetail(job.jobId)}
                actionLabel="View job"
              />
            </Grid>
          ))}
        </Grid>
      )}
    </JobsShell>
  );
};

export default SeekerDashboard;
