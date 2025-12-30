import { PropsWithChildren, ReactElement, useState } from 'react';
import { Box, Container, Drawer, Stack } from '@mui/material';

import Sidebar from 'layouts/main-layout/Sidebar/Sidebar';
import Topbar from 'layouts/main-layout/Topbar/Topbar';

export const drawerWidth = 300;

const MainLayout = ({ children }: PropsWithChildren): ReactElement => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <>
      <Stack 
        direction="row" 
        minHeight="100vh"
        height="100vh"
        bgcolor="background.default"
        sx={{ width: '100%', overflow: 'hidden' }}
      >
        <Box
          component="nav"
          sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', lg: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                border: 0,
                backgroundColor: 'background.default',
              },
            }}
          >
            <Sidebar />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', lg: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                border: 0,
                backgroundColor: 'background.default',
              },
            }}
            open
          >
            <Sidebar />
          </Drawer>
        </Box>
        <Stack
          direction="column"
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Topbar handleDrawerToggle={handleDrawerToggle} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: 0,
              pb: 0,
              height: '100%',
              overflow: 'auto',
            }}
          >
            <Container maxWidth={false} sx={{ width: '100%', height: '100%', px: 3 }}>
              {children}
            </Container>
          </Box>
        </Stack>
      </Stack>
      {/* <Footer /> */}
    </>
  );
};

export default MainLayout;
