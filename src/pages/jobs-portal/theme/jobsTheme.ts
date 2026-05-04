import { createTheme } from '@mui/material/styles';

/**
 * LinkedIn Jobs–inspired palette: professional blue, warm gray canvas, crisp typography.
 */
export const jobsPortalTheme = createTheme({
  palette: {
    primary: {
      main: '#0a66c2',
      dark: '#004182',
      light: '#378fe9',
    },
    secondary: {
      main: '#5c5c5c',
    },
    background: {
      default: '#f3f2ef',
      paper: '#ffffff',
    },
    text: {
      primary: '#191919',
      secondary: '#666666',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, "Apple Color Emoji", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.0625rem',
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    caption: {
      fontSize: '0.75rem',
      color: '#666666',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 24,
          paddingLeft: 20,
          paddingRight: 20,
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#004182',
          },
        },
        outlined: {
          borderColor: '#0a66c2',
          color: '#0a66c2',
          '&:hover': {
            borderColor: '#004182',
            backgroundColor: 'rgba(10, 102, 194, 0.04)',
          },
        },
        sizeSmall: {
          paddingLeft: 16,
          paddingRight: 16,
          fontSize: '0.875rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderColor: 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});
