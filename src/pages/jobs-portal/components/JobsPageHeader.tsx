import { ReactElement, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

const JobsPageHeader = ({ title, subtitle, action }: Props): ReactElement => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    justifyContent="space-between"
    alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
    spacing={2}
    sx={{ mb: 2 }}
  >
    <Stack spacing={0.5}>
      <Typography variant="h4" component="h1" color="text.primary">
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
    {action ? <Stack sx={{ flexShrink: 0 }}>{action}</Stack> : null}
  </Stack>
);

export default JobsPageHeader;
