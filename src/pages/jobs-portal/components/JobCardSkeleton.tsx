import { ReactElement } from 'react';
import { Card, Skeleton, Stack } from '@mui/material';

const JobCardSkeleton = (): ReactElement => (
  <Card sx={{ p: 2 }}>
    <Stack direction="row" spacing={2}>
      <Skeleton variant="rounded" width={56} height={56} />
      <Stack spacing={1} sx={{ flex: 1 }}>
        <Skeleton width="70%" height={24} />
        <Skeleton width="40%" height={20} />
        <Skeleton width="90%" height={18} />
      </Stack>
      <Skeleton variant="rounded" width={120} height={40} sx={{ display: { xs: 'none', sm: 'block' } }} />
    </Stack>
  </Card>
);

export default JobCardSkeleton;
