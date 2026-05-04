import { ReactElement, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import JobsPageHeader from 'pages/jobs-portal/components/JobsPageHeader';
import JobsShell from 'pages/jobs-portal/components/JobsShell';
import { paths } from 'routes/paths';
import { listMyApplications } from 'services/jobs/jobsApi';
import type { ApplicationRecord } from 'services/jobs/types';
import dayjs from 'dayjs';

const statusColor = (s: ApplicationRecord['status']): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
  if (s === 'hired' || s === 'offer') return 'success';
  if (s === 'rejected' || s === 'withdrawn') return 'error';
  if (s === 'interview' || s === 'shortlisted') return 'primary';
  if (s === 'viewed') return 'warning';
  return 'default';
};

const MyApplications = (): ReactElement => {
  const [rows, setRows] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyApplications()
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  return (
    <JobsShell>
      <JobsPageHeader
        title="My applications"
        subtitle="Track where you are in each employer’s hiring process."
      />
      {loading ? (
        <Typography color="text.secondary">Loading…</Typography>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Applied</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Job
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.applicationId} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {r.jobTitle}
                    </Typography>
                  </TableCell>
                  <TableCell>{r.companyName}</TableCell>
                  <TableCell>{dayjs(r.appliedAt).format('D MMM YYYY')}</TableCell>
                  <TableCell>
                    <Chip size="small" label={r.status} color={statusColor(r.status)} variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      component={RouterLink}
                      to={paths.jobsPortal.jobDetail(r.jobId)}
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      View
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </JobsShell>
  );
};

export default MyApplications;
