import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import paths from 'routes/paths';

/**
 * 500 Server Error Page
 * Displayed when an unexpected server error occurs
 */
const Error500 = () => {
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
          500
        </Typography>
        <Typography variant="h4" color="textSecondary" paragraph>
          Internal Server Error
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Sorry, something went wrong on our end. Please try again later.
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

export default Error500; 