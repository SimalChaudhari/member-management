import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import JobsShell from 'pages/jobs-portal/components/JobsShell';
import { listPendingEmployers, setEmployerVerification } from 'services/jobs/jobsApi';
import type { PendingEmployer } from 'services/jobs/types';
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
    label="Pending verification"
    sx={{
      fontWeight: 700,
      fontSize: '0.7rem',
      height: 24,
      bgcolor: 'rgba(234, 179, 8, 0.15)',
      color: '#a16207',
      border: '1px solid rgba(234, 179, 8, 0.4)',
    }}
  />
);

const VerifyEmployers = (): ReactElement => {
  const [rows, setRows] = useState<PendingEmployer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    listPendingEmployers()
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const decide = async (companyId: string, status: 'approved' | 'rejected') => {
    await setEmployerVerification(companyId, status);
    load();
  };

  return (
    <JobsShell>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700} letterSpacing="-0.02em">
          Verify employers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Approve company registrations before they can publish jobs — layout matches employer job posts.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }}>
          <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
            {loading ? 'Loading queue…' : `${rows.length} employer${rows.length === 1 ? '' : 's'} pending verification`}
          </Typography>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
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
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      Loading…
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Alert severity="info" sx={{ m: 2, borderRadius: 2 }}>
                      No employers pending verification.
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.companyId} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>
                        {r.name}
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
                          onClick={() => decide(r.companyId, 'rejected')}
                          sx={{ minWidth: 0, px: 1.25, fontWeight: 600 }}
                        >
                          Reject
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          disableElevation
                          onClick={() => decide(r.companyId, 'approved')}
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

export default VerifyEmployers;
