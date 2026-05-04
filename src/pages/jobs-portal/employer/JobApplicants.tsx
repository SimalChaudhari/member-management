import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { listApplicants, updateApplicationStatus } from 'services/jobs/jobsApi';
import type { ApplicationStatus, EmployerApplicantRow } from 'services/jobs/types';
import dayjs from 'dayjs';

const stages: ApplicationStatus[] = [
  'submitted',
  'viewed',
  'shortlisted',
  'interview',
  'offer',
  'hired',
  'rejected',
];

const JobApplicants = (): ReactElement => {
  const { jobId = '' } = useParams<{ jobId: string }>();
  const [rows, setRows] = useState<EmployerApplicantRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    listApplicants(jobId).then((r) => {
      setRows(r);
      setLoading(false);
    });
  };

  useEffect(() => {
    refresh();
  }, [jobId]);

  const onStatus = async (applicationId: string, status: ApplicationStatus) => {
    await updateApplicationStatus(applicationId, status);
    refresh();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>
        Applicants
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Job ID: {jobId}
      </Typography>
      {loading ? (
        <Typography color="text.secondary">Loading…</Typography>
      ) : rows.length === 0 ? (
        <Alert severity="info">No applicants yet for this job.</Alert>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Match</TableCell>
              <TableCell>Applied</TableCell>
              <TableCell>Summary</TableCell>
              <TableCell>Stage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.applicationId}>
                <TableCell>{r.matchScore}%</TableCell>
                <TableCell>{dayjs(r.appliedAt).format('D MMM YYYY')}</TableCell>
                <TableCell sx={{ maxWidth: 280 }}>{r.profileSummary}</TableCell>
                <TableCell sx={{ minWidth: 160 }}>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    value={r.status}
                    onChange={(e) => onStatus(r.applicationId, e.target.value as ApplicationStatus)}
                  >
                    {stages.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Stack>
  );
};

export default JobApplicants;
