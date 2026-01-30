import { ReactElement } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const ComingSoon = (): ReactElement => {
  return (
    <Container maxWidth={false} sx={{ width: '100%', height: '100%' }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        spacing={3}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'primary.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconifyIcon icon="mdi:clock-outline" width={60} height={60} />
        </Box>
        <Typography variant="h3" fontWeight={600}>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={500}>
          We're working hard to bring you this feature. Please check back soon!
        </Typography>
      </Stack>
    </Container>
  );
};

export default ComingSoon;

