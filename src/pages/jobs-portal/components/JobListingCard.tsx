import { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, Stack, Typography } from '@mui/material';

import IconifyIcon from 'components/base/IconifyIcon';
import CompanyAvatar from 'pages/jobs-portal/components/CompanyAvatar';
import type { JobPost } from 'services/jobs/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type Props = {
  job: JobPost;
  companyName: string;
  to: string;
  actionLabel?: string;
  /** When true, card body links to job; action stays separate */
  showSkillPills?: boolean;
};

const JobListingCard = ({
  job,
  companyName,
  to,
  actionLabel = 'View job',
  showSkillPills = true,
}: Props): ReactElement => {
  const posted = dayjs(job.postedAt).fromNow();

  return (
    <Card
      sx={{
        overflow: 'visible',
        '&:hover': {
          borderColor: 'rgba(10, 102, 194, 0.35)',
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          p: 2,
          alignItems: { sm: 'flex-start' },
        }}
      >
        <CompanyAvatar name={companyName} size={56} sx={{ flexShrink: 0 }} />

        <Box
          component={RouterLink}
          to={to}
          sx={{
            flex: 1,
            minWidth: 0,
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: 1,
            p: 0.5,
            mx: -0.5,
            '&:hover .job-card-title': { textDecoration: 'underline' },
          }}
        >
          <Typography className="job-card-title" variant="subtitle1" color="primary.main">
            {job.title}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mt: 0.25, fontWeight: 500 }}>
            {companyName}
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mt: 1 }} rowGap={0.5}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconifyIcon icon="mdi:map-marker-outline" width={18} height={18} style={{ opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary">
                {job.location} · {job.workArrangement.replace('_', '-')}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconifyIcon icon="mdi:cash-multiple" width={18} height={18} style={{ opacity: 0.7 }} />
              <Typography variant="body2" color="text.secondary">
                SGD {job.salaryMin.toLocaleString()}–{job.salaryMax.toLocaleString()} / mo
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {posted} · {job.employmentType.replace('_', ' ')}
            </Typography>
          </Stack>
          {showSkillPills && job.skills.length > 0 ? (
            <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.5 }}>
              {job.skills.slice(0, 5).map((s) => (
                <Typography
                  key={s}
                  component="span"
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {s}
                </Typography>
              ))}
            </Stack>
          ) : null}
        </Box>

        <Stack
          direction={{ xs: 'row', sm: 'column' }}
          spacing={1}
          sx={{
            flexShrink: 0,
            alignItems: { xs: 'center', sm: 'stretch' },
            justifyContent: { xs: 'flex-end', sm: 'flex-start' },
            minWidth: { sm: 140 },
          }}
        >
          <Button component={RouterLink} to={to} variant="contained" color="primary" size="medium" fullWidth>
            {actionLabel}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default JobListingCard;
