import { ReactElement, useEffect, useState } from 'react';
import { Alert, Button, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material';

import { createJobDraft } from 'services/jobs/jobsApi';
import type { EmploymentType, WorkArrangement } from 'services/jobs/types';

export type PostJobFormProps = {
  /** When true, reset fields (e.g. modal reopened) */
  formKey?: number;
  onSubmitted?: () => void;
  showTitle?: boolean;
};

const emptyClosing = () => {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return d.toISOString().slice(0, 10);
};

/**
 * Shared job posting form — used on the post page and inside the “New job” modal.
 */
const PostJobForm = ({
  formKey = 0,
  onSubmitted,
  showTitle = true,
}: PostJobFormProps): ReactElement => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [location, setLocation] = useState('Singapore');
  const [salaryMin, setSalaryMin] = useState('5000');
  const [salaryMax, setSalaryMax] = useState('7000');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');
  const [workArrangement, setWorkArrangement] = useState<WorkArrangement>('hybrid');
  const [seniority, setSeniority] = useState('Mid');
  const [closing, setClosing] = useState(emptyClosing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setTitle('');
    setDescription('');
    setRequirements('');
    setBenefits('');
    setLocation('Singapore');
    setSalaryMin('5000');
    setSalaryMax('7000');
    setEmploymentType('full_time');
    setWorkArrangement('hybrid');
    setSeniority('Mid');
    setClosing(emptyClosing());
    setError(null);
    setSuccess(null);
  }, [formKey]);

  const submit = async (publish: boolean) => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      await createJobDraft(
        'co1',
        {
          title,
          description,
          requirements,
          benefits: benefits || undefined,
          location,
          salaryMin: Number(salaryMin),
          salaryMax: Number(salaryMax),
          employmentType,
          workArrangement,
          seniority,
          closingAt: new Date(closing).toISOString(),
        },
        publish,
      );
      setSuccess(publish ? 'Job submitted for moderation.' : 'Draft saved.');
      onSubmitted?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={2} sx={!showTitle ? { pt: 0.5 } : undefined}>
      {showTitle ? (
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Job details
        </Typography>
      ) : null}

      {error ? (
        <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 1.5 }}>
          {error}
        </Alert>
      ) : null}
      {success ? (
        <Alert severity="success" sx={{ borderRadius: 1.5 }}>
          {success}
        </Alert>
      ) : null}

      <TextField
        label="Job title"
        placeholder="e.g. Senior Audit Manager"
        fullWidth
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mt: 0.5 }}
      />

      <TextField
        label="Description"
        fullWidth
        required
        multiline
        minRows={5}
        placeholder="Describe the role, team, and impact…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <TextField
        label="Requirements"
        fullWidth
        required
        multiline
        minRows={3}
        placeholder="Qualifications, years of experience, certifications…"
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
      />

      <TextField
        label="Benefits (optional)"
        fullWidth
        multiline
        minRows={2}
        value={benefits}
        onChange={(e) => setBenefits(e.target.value)}
      />

      <Divider sx={{ my: 0.5 }} />
      <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
        Location & compensation
      </Typography>

      <TextField label="Location" fullWidth value={location} onChange={(e) => setLocation(e.target.value)} />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Salary min (SGD / month)" fullWidth value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
        <TextField label="Salary max (SGD / month)" fullWidth value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          select
          fullWidth
          label="Employment type"
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
        >
          <MenuItem value="full_time">Full-time</MenuItem>
          <MenuItem value="part_time">Part-time</MenuItem>
          <MenuItem value="contract">Contract</MenuItem>
          <MenuItem value="internship">Internship</MenuItem>
        </TextField>
        <TextField
          select
          fullWidth
          label="Work arrangement"
          value={workArrangement}
          onChange={(e) => setWorkArrangement(e.target.value as WorkArrangement)}
        >
          <MenuItem value="remote">Remote</MenuItem>
          <MenuItem value="hybrid">Hybrid</MenuItem>
          <MenuItem value="on_site">On-site</MenuItem>
        </TextField>
      </Stack>

      <TextField label="Seniority" fullWidth value={seniority} onChange={(e) => setSeniority(e.target.value)} />

      <TextField
        label="Application closing date"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={closing}
        onChange={(e) => setClosing(e.target.value)}
      />

      <Stack direction="row" spacing={1.5} justifyContent="flex-end" flexWrap="wrap" useFlexGap sx={{ pt: 1 }}>
        <Button variant="outlined" size="large" disabled={submitting} onClick={() => submit(false)}>
          Save draft
        </Button>
        <Button variant="contained" size="large" disabled={submitting} onClick={() => submit(true)}>
          Submit for moderation
        </Button>
      </Stack>
    </Stack>
  );
};

export default PostJobForm;
