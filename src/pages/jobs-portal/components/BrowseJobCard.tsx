import { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, Chip, IconButton, Stack, Typography } from '@mui/material';

import IconifyIcon from 'components/base/IconifyIcon';
import CompanyAvatar from 'pages/jobs-portal/components/CompanyAvatar';
import type { JobPost } from 'services/jobs/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const SALARY_GREEN = '#057642';
const GOLD = '#b8952a';

type Props = {
  job: JobPost;
  companyName: string;
  to: string;
  matchScore: number;
};

const formatMoney = (n: number) =>
  `$${n.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const labelWork = (w: JobPost['workArrangement']) =>
  w === 'on_site' ? 'On-site' : w.charAt(0).toUpperCase() + w.slice(1);

const labelEmp = (e: JobPost['employmentType']) => {
  const map: Record<JobPost['employmentType'], string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };
  return map[e];
};

const BrowseJobCard = ({ job, companyName, to, matchScore }: Props): ReactElement => {
  const posted = dayjs(job.postedAt).fromNow();
  const closes = dayjs(job.closingAt).format('D MMM YYYY');
  const subtitle = [companyName, job.officeDistrict].filter(Boolean).join(' · ');

  const tagPills = [
    labelWork(job.workArrangement),
    labelEmp(job.employmentType),
    job.seniority,
    ...job.skills.slice(0, 2),
  ];

  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: 2,
        border: '1px solid',
        borderColor: job.featured ? GOLD : 'divider',
        boxShadow: job.featured ? `0 0 0 1px ${GOLD}` : 'none',
        bgcolor: 'background.paper',
        transition: 'box-shadow 0.2s ease',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      {job.featured ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 1.5,
            py: 0.75,
            bgcolor: 'rgba(184, 149, 42, 0.08)',
            borderBottom: `1px solid ${GOLD}`,
          }}
        >
          <Chip
            label="FEATURED"
            size="small"
            sx={{
              height: 22,
              fontWeight: 800,
              fontSize: '0.65rem',
              letterSpacing: '0.06em',
              bgcolor: GOLD,
              color: '#fff',
            }}
          />
          <IconButton size="small" aria-label="Save job" sx={{ color: 'text.secondary' }}>
            <IconifyIcon icon="mdi:bookmark-outline" width={22} height={22} />
          </IconButton>
        </Stack>
      ) : null}

      <Box
        component={RouterLink}
        to={to}
        sx={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          p: 2,
          '&:hover .browse-job-title': { textDecoration: 'underline', textDecorationColor: 'primary.main' },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <CompanyAvatar name={companyName} size={52} sx={{ flexShrink: 0 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography className="browse-job-title" variant="subtitle1" fontWeight={700} color="primary" sx={{ lineHeight: 1.35 }}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ color: SALARY_GREEN, flexShrink: 0, display: { xs: 'none', sm: 'block' } }}
          >
            {matchScore}% match
          </Typography>
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.75, pl: { xs: 0, sm: 8.5 } }}>
          {tagPills.map((t) => (
            <Typography
              key={t}
              component="span"
              variant="caption"
              sx={{
                px: 1.25,
                py: 0.35,
                borderRadius: 10,
                bgcolor: 'rgba(0, 0, 0, 0.06)',
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.72rem',
              }}
            >
              {t}
            </Typography>
          ))}
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1}
          sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: SALARY_GREEN }}>
            {formatMoney(job.salaryMin)} – {formatMoney(job.salaryMax)} / mo
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconifyIcon icon="mdi:clock-outline" width={16} height={16} style={{ opacity: 0.7 }} />
              {posted}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconifyIcon icon="mdi:calendar-clock-outline" width={16} height={16} style={{ opacity: 0.7 }} />
              Closes {closes}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: SALARY_GREEN, display: { xs: 'block', sm: 'none' }, mt: 1 }}
        >
          {matchScore}% match
        </Typography>
      </Box>
    </Card>
  );
};

export default BrowseJobCard;
