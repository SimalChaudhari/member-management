import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import JobsShell from 'pages/jobs-portal/components/JobsShell';
import { listPendingModerationJobs, moderateJob } from 'services/jobs/jobsApi';
import type { PendingModerationJob } from 'services/jobs/types';
import dayjs from 'dayjs';

const th = {
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
};

const pendingChip = (
  <Chip
    size="small"
    label="Pending review"
    sx={{
      fontWeight: 700,
      fontSize: '0.7rem',
      height: 24,
      bgcolor: 'rgba(59, 130, 246, 0.1)',
      color: '#1d4ed8',
      border: '1px solid rgba(59, 130, 246, 0.35)',
    }}
  />
);

const ModerateJobs = (): ReactElement => {
  const [rows, setRows] = useState<PendingModerationJob[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    listPendingModerationJobs()
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (jobId: string) => {
    await moderateJob(jobId, true);
    load();
  };

  const reject = async (jobId: string) => {
    await moderateJob(jobId, false);
    load();
  };

  return (
    <JobsShell>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700} letterSpacing="-0.02em">
          Moderate jobs
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Review job ads before they appear to candidates — same queue style as employer job posts.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }}>
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
            {loading ? 'Loading queue…' : `${rows.length} job${rows.length === 1 ? '' : 's'} awaiting moderation`}
          </Typography>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
                <TableCell sx={th}>Job title</TableCell>
                <TableCell sx={th}>Company</TableCell>
                <TableCell sx={th}>Submitted</TableCell>
                <TableCell sx={th}>Status</TableCell>
                <TableCell align="right" sx={th}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      Loading…
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Alert severity="info" sx={{ m: 2, borderRadius: 2 }}>
                      No jobs awaiting moderation.
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.jobId} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {r.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {r.companyName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(r.submittedAt).format('D MMM YYYY')}
                      </Typography>
                    </TableCell>
                    <TableCell>{pendingChip}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.75} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => reject(r.jobId)}
                          sx={{ minWidth: 0, px: 1.25, fontWeight: 600 }}
                        >
                          Reject
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          disableElevation
                          onClick={() => approve(r.jobId)}
                          sx={{ minWidth: 0, px: 1.25, fontWeight: 600 }}
                        >
                          Approve
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
    </JobsShell>
  );
};

export default ModerateJobs;
