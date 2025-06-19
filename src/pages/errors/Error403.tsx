import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/paths';

/**
 * 403 Forbidden Error Page
 * Displayed when user attempts to access a resource they don't have permission for
 */
const Error403 = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 3,
        }}
      >
        <Typography variant="h1" color="error" gutterBottom>
          403
        </Typography>
        <Typography variant="h4" color="textSecondary" paragraph>
          Access Forbidden
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Sorry, you don't have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(paths.home)}
          sx={{ mt: 3 }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default Error403; 