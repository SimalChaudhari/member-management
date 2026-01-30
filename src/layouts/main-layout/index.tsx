import { PropsWithChildren, ReactElement, useState } from 'react';
import { Box, Container, Drawer, Stack, useTheme, useMediaQuery } from '@mui/material';

import Sidebar from 'layouts/main-layout/Sidebar/Sidebar';
import Topbar from 'layouts/main-layout/Topbar/Topbar';
import { SidebarContext } from 'providers/SidebarProvider';

export const drawerWidth = 340;
export const drawerWidthCollapsed = 120;

const MainLayout = ({ children }: PropsWithChildren): ReactElement => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery('(max-width: 1280px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  
  // On small screens (≤1280px), default to collapsed, but can be toggled
  // On mobile/tablet, when drawer is open, always show full sidebar
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isCollapsed = isSmallScreen && !sidebarExpanded && !(isMobileOrTablet && mobileOpen);
  const currentDrawerWidth = isCollapsed ? drawerWidthCollapsed : drawerWidth;
  
  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

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
        height="100vh"
        bgcolor="background.default"
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Box
          component="nav"
          sx={{ width: { lg: currentDrawerWidth }, flexShrink: { lg: 0 } }}
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
            <Sidebar isCollapsed={isCollapsed} />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', lg: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: currentDrawerWidth,
                border: 0,
                backgroundColor: 'background.default',
                transition: 'width 0.3s ease-in-out',
              },
            }}
            open
          >
            <Sidebar isCollapsed={isCollapsed} />
          </Drawer>
        </Box>
        <Stack
          direction="column"
          sx={{
            flexGrow: 1,
            width: { lg: `calc(100% - ${currentDrawerWidth}px)` },
            height: '100%',
            overflow: 'hidden',
            border: 'none',
            outline: 'none',
            transition: 'width 0.3s ease-in-out',
          }}
        >
          <Topbar 
            handleDrawerToggle={handleDrawerToggle} 
            handleSidebarToggle={handleSidebarToggle}
            isSidebarExpanded={sidebarExpanded}
            isSmallScreen={isSmallScreen}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: 0,
              pb: 0,
              minHeight: 0,
              overflow: 'auto',
              overflowX: 'hidden',
              width: '100%',
              border: 'none',
              outline: 'none',
            }}
          >
            <Container 
              maxWidth={false} 
              sx={{ 
                width: '100%',
                maxWidth: '100%',
                px: { xs: 0, sm: 2.5, md: 3, lg: 3 },
                pt: { xs: 0, sm: 2.5, md: 3 },
                pb: { xs: 0, sm: 2.5, md: 3, lg: 4 },
                mx: 0,
                boxSizing: 'border-box',
              }}
            >
              <SidebarContext.Provider value={{ sidebarExpanded, isSmallScreen }}>
                {children}
              </SidebarContext.Provider>
            </Container>
          </Box>
        </Stack>
      </Stack>
      {/* <Footer /> */}
    </>
  );
};

export default MainLayout;
