import { ReactElement, useEffect, useState } from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

import { listEmployerJobs, listJobs, listPendingModerationJobs } from 'services/jobs/jobsApi';

const AdminOverview = (): ReactElement => {
  const [activeJobs, setActiveJobs] = useState(0);
  const [pendingJobs, setPendingJobs] = useState(0);
  const [publicListings, setPublicListings] = useState(0);

  useEffect(() => {
    Promise.all([listJobs({}), listPendingModerationJobs(), listEmployerJobs('co1')]).then(
      ([pub, pend, allCo]) => {
        setPublicListings(pub.length);
        setPendingJobs(pend.length);
        setActiveJobs(allCo.filter((j) => j.status === 'active').length);
      },
    );
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>
        Admin overview
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Mock marketplace snapshot — replace with analytics API.
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h4">{publicListings}</Typography>
              <Typography color="text.secondary">Active public job listings (mock)</Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h4">{pendingJobs}</Typography>
              <Typography color="text.secondary">Jobs pending moderation</Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h4">{activeJobs}</Typography>
              <Typography color="text.secondary">Demo employer (co1) active posts</Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Stack>
  );
};

export default AdminOverview;
