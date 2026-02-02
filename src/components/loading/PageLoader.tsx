import { CircularProgress, Stack, StackOwnProps, Typography } from '@mui/material';

const PageLoader = (props: StackOwnProps) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        minHeight: '100vh',
      }}
      {...props}
    >
      <CircularProgress size={40} />

      <Typography variant="body1" color="text.secondary">
        Loading...
      </Typography>
    </Stack>
  );
};

export default PageLoader;
