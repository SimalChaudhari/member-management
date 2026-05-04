import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

import IconifyIcon from 'components/base/IconifyIcon';
import JobsShell from 'pages/jobs-portal/components/JobsShell';
import PostJobForm from 'pages/jobs-portal/employer/PostJobForm';
import { paths } from 'routes/paths';
import { getCompanyDisplayName, listEmployerJobs } from 'services/jobs/jobsApi';
import type { JobPost } from 'services/jobs/types';
import dayjs from 'dayjs';

type TabKey = 'all' | 'active' | 'draft' | 'review' | 'paused' | 'closed';

const statusChip = (s: JobPost['status']): ReactElement => {
  const label: Record<JobPost['status'], string> = {
    draft: 'Draft',
    pending_moderation: 'In review',
    active: 'Active',
    paused: 'Paused',
    closed: 'Closed',
    filled: 'Closed',
  };
  const sx: Record<
    JobPost['status'],
    { bgcolor: string; color: string; border: string }
  > = {
    draft: { bgcolor: 'rgba(234, 179, 8, 0.15)', color: '#a16207', border: '1px solid rgba(234, 179, 8, 0.4)' },
    pending_moderation: { bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#1d4ed8', border: '1px solid rgba(59, 130, 246, 0.35)' },
    active: { bgcolor: 'rgba(34, 197, 94, 0.12)', color: '#15803d', border: '1px solid rgba(34, 197, 94, 0.35)' },
    paused: { bgcolor: 'rgba(249, 115, 22, 0.12)', color: '#c2410c', border: '1px solid rgba(249, 115, 22, 0.35)' },
    closed: { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c', border: '1px solid rgba(239, 68, 68, 0.3)' },
    filled: { bgcolor: 'rgba(100, 116, 139, 0.12)', color: '#475569', border: '1px solid rgba(100, 116, 139, 0.3)' },
  };
  const st = sx[s];
  return (
    <Chip
      size="small"
      label={label[s]}
      sx={{
        fontWeight: 700,
        fontSize: '0.7rem',
        height: 24,
        ...st,
      }}
    />
  );
};

const matchesTab = (job: JobPost, tab: TabKey): boolean => {
  if (tab === 'all') return true;
  if (tab === 'active') return job.status === 'active';
  if (tab === 'draft') return job.status === 'draft';
  if (tab === 'review') return job.status === 'pending_moderation';
  if (tab === 'paused') return job.status === 'paused';
  if (tab === 'closed') return job.status === 'closed' || job.status === 'filled';
  return true;
};

const MyJobPosts = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('all');
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const companyName = getCompanyDisplayName('co1');

  const reload = useCallback(() => {
    setLoading(true);
    listEmployerJobs('co1')
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setPostModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const counts = useMemo(() => {
    const c = {
      all: jobs.length,
      active: 0,
      draft: 0,
      review: 0,
      paused: 0,
      closed: 0,
    };
    jobs.forEach((j) => {
      if (j.status === 'active') c.active += 1;
      if (j.status === 'draft') c.draft += 1;
      if (j.status === 'pending_moderation') c.review += 1;
      if (j.status === 'paused') c.paused += 1;
      if (j.status === 'closed' || j.status === 'filled') c.closed += 1;
    });
    return c;
  }, [jobs]);

  const filtered = useMemo(() => jobs.filter((j) => matchesTab(j, tab)), [jobs, tab]);

  const tabBtn = (key: TabKey, label: string, count: number) => (
    <ToggleButton key={key} value={key} sx={{ textTransform: 'none', fontWeight: 600, px: 1.5 }}>
      {label} ({count})
    </ToggleButton>
  );

  return (
    <JobsShell>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'flex-start' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} letterSpacing="-0.02em">
            All job posts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {companyName} · manage listings and applicant pipeline
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<IconifyIcon icon="mdi:plus" width={22} height={22} />}
          onClick={() => setPostModalOpen(true)}
          sx={{ alignSelf: { xs: 'stretch', md: 'center' }, minWidth: 200, fontWeight: 700 }}
        >
          Post new job
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={tab}
            onChange={(_, v) => v != null && setTab(v)}
            sx={{
              flexWrap: 'wrap',
              gap: 0.75,
              '& .MuiToggleButton-root': {
                borderRadius: '999px',
                border: '1px solid',
                borderColor: 'divider',
                px: 1.25,
                '&.Mui-selected': {
                  bgcolor: 'primary.dark',
                  color: '#fff',
                  borderColor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              },
            }}
          >
            {tabBtn('all', 'All', counts.all)}
            {tabBtn('active', 'Active', counts.active)}
            {tabBtn('draft', 'Draft', counts.draft)}
            {tabBtn('review', 'In review', counts.review)}
            {tabBtn('paused', 'Paused', counts.paused)}
            {tabBtn('closed', 'Closed', counts.closed)}
          </ToggleButtonGroup>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Job title
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Created
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Closes
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Applicants
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      Loading…
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                      No jobs in this view. Try another filter or post a new job.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((j) => (
                  <TableRow key={j.jobId} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {j.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(j.postedAt).format('D MMM YYYY')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(j.closingAt).format('D MMM YYYY')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {j.applicationsCount ?? 0}
                      </Typography>
                    </TableCell>
                    <TableCell>{statusChip(j.status)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.75} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                        <Button size="small" variant="outlined" sx={{ minWidth: 0, px: 1.25, fontWeight: 600 }} disabled>
                          Edit
                        </Button>
                        <Button
                          component={RouterLink}
                          to={paths.jobsPortal.jobApplicants(j.jobId)}
                          size="small"
                          variant="contained"
                          disableElevation
                          sx={{ minWidth: 0, px: 1.25, fontWeight: 600 }}
                        >
                          Applicants
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        fullWidth
        maxWidth="md"
        scroll="body"
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            px: 3,
            pt: 2,
            pb: 2,
            // borderBottom: '1px solid',
            // borderColor: 'divider',
            fontWeight: 800,
            fontSize: '1.25rem',
          }}
        >
          Create job posting
          <IconButton aria-label="Close" size="small" onClick={() => setPostModalOpen(false)} sx={{ mt: -0.5 }}>
            <IconifyIcon icon="mdi:close" width={22} height={22} />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 4,
            px: 3,
            pb: 3,
            overflow: 'visible',
          }}
        >
          <PostJobForm
            key={formKey}
            formKey={formKey}
            showTitle={false}
            onSubmitted={() => {
              setPostModalOpen(false);
              setFormKey((k) => k + 1);
              reload();
            }}
          />
        </DialogContent>
      </Dialog>
    </JobsShell>
  );
};

export default MyJobPosts;
