import { ReactElement, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import IconifyIcon from 'components/base/IconifyIcon';
import CompanyAvatar from 'pages/jobs-portal/components/CompanyAvatar';
import JobsShell from 'pages/jobs-portal/components/JobsShell';
import { paths } from 'routes/paths';
import {
  applyToJob,
  getCompanyDisplayName,
  getJob,
  getSavedJobIds,
  listMyApplications,
  setJobSaved,
} from 'services/jobs/jobsApi';
import type { JobPost } from 'services/jobs/types';
import dayjs from 'dayjs';

const JobDetail = (): ReactElement => {
  const { jobId = '' } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPost | null>(null);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getJob(jobId), getSavedJobIds(), listMyApplications()])
      .then(([j, savedIds, apps]) => {
        if (cancelled) return;
        setJob(j);
        setSaved(savedIds.includes(jobId));
        setApplied(apps.some((a) => a.jobId === jobId));
        if (j) {
          const init: Record<string, string> = {};
          j.screeningQuestions.forEach((q) => {
            init[q.id] = '';
          });
          setAnswers(init);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const handleApply = async () => {
    if (!job) return;
    setError(null);
    try {
      await applyToJob(job.jobId, {
        resumeLabel: 'Primary resume (mock)',
        coverLetter: coverLetter.trim() || undefined,
        screeningAnswers: answers,
      });
      setApplied(true);
      setApplyOpen(false);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const toggleSaved = async () => {
    const next = !saved;
    await setJobSaved(jobId, next);
    setSaved(next);
  };

  if (loading) {
    return (
      <JobsShell>
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rounded" height={200} />
        </Stack>
      </JobsShell>
    );
  }

  if (!job) {
    return (
      <JobsShell>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Job not found or no longer available.
        </Alert>
      </JobsShell>
    );
  }

  const companyName = getCompanyDisplayName(job.companyId);

  return (
    <JobsShell>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <CompanyAvatar name={companyName} size={64} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h5" component="h1" fontWeight={700} color="text.primary">
                    {job.title}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                    {companyName}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mt: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <IconifyIcon icon="mdi:map-marker-outline" width={20} height={20} style={{ opacity: 0.65 }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location} · {job.workArrangement.replace('_', '-')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <IconifyIcon icon="mdi:briefcase-outline" width={20} height={20} style={{ opacity: 0.65 }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.seniority} · {job.employmentType.replace('_', ' ')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <IconifyIcon icon="mdi:cash-multiple" width={20} height={20} style={{ opacity: 0.65 }} />
                      <Typography variant="body2" color="text.secondary">
                        SGD {job.salaryMin.toLocaleString()} – {job.salaryMax.toLocaleString()} / mo
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
                    Posted {dayjs(job.postedAt).format('D MMM YYYY')} · Closes{' '}
                    {dayjs(job.closingAt).format('D MMM YYYY')}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  disabled={applied}
                  onClick={() => setApplyOpen(true)}
                  sx={{ minWidth: 160 }}
                >
                  {applied ? 'Applied' : 'Easy apply'}
                </Button>
                <Button variant="outlined" color="primary" onClick={toggleSaved}>
                  {saved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="text" color="secondary" onClick={() => navigate(paths.jobsPortal.browseJobs)}>
                  Back to jobs
                </Button>
              </Stack>
              {applied ? (
                <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                  Application submitted — you can track status under My applications.
                </Alert>
              ) : null}
            </Box>

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                About the job
              </Typography>
              <Typography variant="body2" color="text.primary" whiteSpace="pre-wrap" sx={{ lineHeight: 1.6 }}>
                {job.description}
              </Typography>

              <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }} gutterBottom>
                Requirements
              </Typography>
              <Typography variant="body2" color="text.primary" whiteSpace="pre-wrap" sx={{ lineHeight: 1.6 }}>
                {job.requirements}
              </Typography>

              {job.benefits ? (
                <>
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }} gutterBottom>
                    Benefits
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                    {job.benefits}
                  </Typography>
                </>
              ) : null}
            </Box>
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              position: { md: 'sticky' },
              top: { md: 16 },
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              About the company
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <CompanyAvatar name={companyName} size={40} />
              <Typography variant="body2" fontWeight={600}>
                {companyName}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Verified employer (mock). Company details will load from your API.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">
              Job ID: {job.jobId}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={applyOpen} onClose={() => setApplyOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Easy apply</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              label="Cover letter (optional)"
              placeholder="Highlight why you are a strong fit…"
              multiline
              minRows={4}
              fullWidth
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            {job.screeningQuestions.map((q) => (
              <TextField
                key={q.id}
                label={q.questionText}
                fullWidth
                required
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              />
            ))}
            <FormControlLabel
              control={<Checkbox checked disabled />}
              label="Submit with profile resume: Primary (mock PDF)"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setApplyOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleApply} size="large">
            Submit application
          </Button>
        </DialogActions>
      </Dialog>
    </JobsShell>
  );
};

export default JobDetail;
