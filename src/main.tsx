import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { theme } from './theme/theme.ts';
import { CssBaseline, ThemeProvider } from '@mui/material';
import BreakpointsProvider from 'providers/BreakpointsProvider.tsx';
import { StoreProvider } from 'providers/StoreProvider';
import router from 'routes/router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <BreakpointsProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </BreakpointsProvider>
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>,
);
