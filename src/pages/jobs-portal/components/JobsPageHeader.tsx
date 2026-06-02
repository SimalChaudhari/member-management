import { ReactElement, ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  /** Merged onto the root Stack (e.g. `{ mb: 0 }` when parent handles vertical spacing). */
  sx?: SxProps<Theme>;
};

const JobsPageHeader = ({ title, subtitle, action, sx: sxProp }: Props): ReactElement => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    justifyContent="space-between"
    alignItems={{ xs: 'stretch', sm: 'flex-start' }}
    spacing={{ xs: 1.5, sm: 2 }}
    sx={
      (sxProp != null
        ? [{ mb: { xs: 2, sm: 2 }, width: '100%', minWidth: 0 }, sxProp]
        : { mb: { xs: 2, sm: 2 }, width: '100%', minWidth: 0 }) as SxProps<Theme>
    }
  >
    <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        variant="h4"
        component="h1"
        color="text.primary"
        sx={{
          fontSize: { xs: '1.35rem', sm: '1.5rem', md: '2rem' },
          lineHeight: { xs: 1.3, md: 1.25 },
          wordBreak: 'break-word',
        }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: { sm: 'min(100%, 42rem)' } }}>
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
    {action ? (
      <Stack
        sx={{
          flexShrink: 0,
          width: { xs: '100%', sm: 'auto' },
          minWidth: 0,
          alignItems: { xs: 'stretch', sm: 'flex-end' },
        }}
      >
        {action}
      </Stack>
    ) : null}
  </Stack>
);

export default JobsPageHeader;
