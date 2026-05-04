import { ReactElement, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import JobsPageHeader from 'pages/jobs-portal/components/JobsPageHeader';
import JobsShell from 'pages/jobs-portal/components/JobsShell';

const initialsFrom = (s: string): string => {
  const p = s.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return '?';
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
};

const CareerProfile = (): ReactElement => {
  const [saved, setSaved] = useState(false);
  const [headline, setHeadline] = useState('Chartered Accountant · Audit & assurance');
  const [summary, setSummary] = useState(
    'Experienced professional seeking roles in audit, risk, or internal controls.',
  );
  const [locationPref, setLocationPref] = useState('Singapore');
  const [openToRoles, setOpenToRoles] = useState('Audit, Risk, Internal controls');
  const [yearsExp, setYearsExp] = useState('5');
  const [expectedSalary, setExpectedSalary] = useState('6500');
  const [visibility, setVisibility] = useState('public');

  const initials = useMemo(() => initialsFrom(headline), [headline]);

  const strength = useMemo(() => {
    let n = 40;
    if (headline.trim().length > 10) n += 15;
    if (summary.trim().length > 40) n += 20;
    if (expectedSalary) n += 15;
    if (openToRoles.trim()) n += 10;
    return Math.min(100, n);
  }, [headline, summary, expectedSalary, openToRoles]);

  return (
    <JobsShell>
      <JobsPageHeader
        title="Career profile"
        subtitle="Complete your profile to improve job matches and employer visibility. (Dev preview — not persisted.)"
      />

      <Grid container spacing={3} alignItems="flex-start">
        <Grid xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing="0.08em">
                  Public headline
                </Typography>
                <TextField
                  label="Headline"
                  fullWidth
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Role · specialisms · level"
                  sx={{ mt: 0.5 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Stack>

            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>
              About you
            </Typography>
            <TextField
              label="Summary"
              fullWidth
              multiline
              minRows={5}
              placeholder="Summarize your experience, industries, and what you want next…"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>
              Experience & preferences
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <TextField
                  label="Years of experience"
                  fullWidth
                  value={yearsExp}
                  onChange={(e) => setYearsExp(e.target.value)}
                  type="number"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  label="Preferred location"
                  fullWidth
                  value={locationPref}
                  onChange={(e) => setLocationPref(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  label="Open to roles (keywords)"
                  fullWidth
                  value={openToRoles}
                  onChange={(e) => setOpenToRoles(e.target.value)}
                  placeholder="e.g. Audit, FP&A, Risk"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>
              Compensation & visibility
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <TextField
                  label="Expected salary (SGD / month)"
                  fullWidth
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  select
                  label="Who can see your profile"
                  fullWidth
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <MenuItem value="public">Recruiters at verified companies</MenuItem>
                  <MenuItem value="hidden">Hidden — apply only</MenuItem>
                  <MenuItem value="anonymous">Anonymous summary</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="contained" size="large" onClick={() => setSaved(true)} sx={{ minWidth: 140 }}>
                Save profile
              </Button>
            </Stack>
            {saved ? (
              <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }} onClose={() => setSaved(false)}>
                Saved locally for this session only.
              </Alert>
            ) : null}
          </Paper>
        </Grid>

        <Grid xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              position: { lg: 'sticky' },
              top: { lg: 16 },
            }}
          >
            <Typography variant="subtitle1" fontWeight={800} gutterBottom>
              Profile strength
            </Typography>
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Completeness
                </Typography>
                <Typography variant="body2" fontWeight={800} color="primary">
                  {strength}%
                </Typography>
              </Stack>
              <LinearProgress variant="determinate" value={strength} sx={{ height: 8, borderRadius: 1 }} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add a strong summary, salary expectation, and role keywords to rank higher in employer search.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Tips
            </Typography>
            <Stack component="ul" spacing={1} sx={{ m: 0, pl: 2.25, color: 'text.secondary', fontSize: '0.875rem' }}>
              <li>Use your headline like a LinkedIn title — role, level, domain.</li>
              <li>Keep your summary under ~400 words and outcome-focused.</li>
              <li>Align expected salary with market ranges for your seniority.</li>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </JobsShell>
  );
};

export default CareerProfile;
