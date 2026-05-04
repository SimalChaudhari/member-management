import { ReactElement, useEffect, useState } from 'react';
import { Paper, Stack, Typography } from '@mui/material';

import JobListingCard from 'pages/jobs-portal/components/JobListingCard';
import JobsPageHeader from 'pages/jobs-portal/components/JobsPageHeader';
import JobsShell from 'pages/jobs-portal/components/JobsShell';
import { paths } from 'routes/paths';
import { getCompanyDisplayName, getJob, getSavedJobIds } from 'services/jobs/jobsApi';
import type { JobPost } from 'services/jobs/types';

const SavedJobs = (): ReactElement => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ids = await getSavedJobIds();
      const list: JobPost[] = [];
      for (const id of ids) {
        const j = await getJob(id);
        if (j) list.push(j);
      }
      if (!cancelled) {
        setJobs(list);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <JobsShell>
      <JobsPageHeader title="Saved jobs" subtitle="Jobs you bookmarked for later." />
      {loading ? (
        <Typography color="text.secondary">Loading…</Typography>
      ) : jobs.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
          <Typography color="text.secondary">No saved jobs yet. Save roles from search to see them here.</Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {jobs.map((job) => (
            <JobListingCard
              key={job.jobId}
              job={job}
              companyName={getCompanyDisplayName(job.companyId)}
              to={paths.jobsPortal.jobDetail(job.jobId)}
              actionLabel="View job"
            />
          ))}
        </Stack>
      )}
    </JobsShell>
  );
};

export default SavedJobs;
