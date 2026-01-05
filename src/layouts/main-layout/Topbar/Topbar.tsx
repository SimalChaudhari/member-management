import { MouseEventHandler, ReactElement } from 'react';
import {
  AppBar,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
// import AccountDropdown from './AccountDropdown';
import Image from 'components/base/Image';
import logo from 'assets/logo/elegent-favicon-logo.png';

interface TopbarProps {
  handleDrawerToggle: MouseEventHandler;
  handleSidebarToggle?: MouseEventHandler;
  isSidebarExpanded?: boolean;
  isSmallScreen?: boolean;
}

const Topbar = ({ 
  handleDrawerToggle, 
  handleSidebarToggle,
  isSidebarExpanded = false,
  isSmallScreen = false,
}: TopbarProps): ReactElement => {
  const isSmallScreenCheck = useMediaQuery('(max-width: 1280px)');
  const showToggleButton = (isSmallScreen || isSmallScreenCheck) && handleSidebarToggle;
  
  return (
    <AppBar
      position="relative"
      sx={{
        width: '100%',
        ml: 0,
        backgroundColor: { xs: '#0E416F', lg: 'inherit' },
      }}
    >
      <Container maxWidth={false} sx={{ width: '100%', px: 3 }}>
        <Toolbar
          sx={{
            px: 0,
            py: 2.75,
            minHeight: 'auto',
          }}
        >
          <Stack direction="row" gap={1} display={{ xs: 'block', lg: 'none' }}>
            <IconButton color="inherit" sx={{ p: 0.75 }} onClick={handleDrawerToggle}>
              <Image src={logo} width={1} height={1} />
            </IconButton>
          </Stack>
          {/* Sidebar Toggle Button for Desktop (1280px and below) - Show on laptop and desktop */}
          {showToggleButton && (
            <IconButton 
              sx={{ 
                p: 1.25,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: 1.5,
                color: 'text.primary',
                mr: 2,
                display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
              }} 
              onClick={handleSidebarToggle}
              aria-label="Toggle sidebar"
            >
              <IconifyIcon 
                icon={isSidebarExpanded ? "mdi:menu-open" : "mdi:menu"} 
                width={24} 
                height={24} 
              />
            </IconButton>
          )}
          <Stack
            display={{ xs: 'none', lg: 'flex' }}
            direction="row"
            gap={{ lg: 6.25 }}
            alignItems="center"
            flex={'1 1 auto'}
          >
            {/* <Typography variant="h5" component="h5">
            {pathname === '/' ? 'Dashboard' : title}
          </Typography> */}
            <TextField
              variant="outlined"
              placeholder="Search..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
                    <IconifyIcon icon="mdi:search" width={1} height={1} />
                  </InputAdornment>
                ),
              }}
              fullWidth
              sx={{
                maxWidth: 330,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'common.white',
                  borderRadius: 5,
                  boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                },
              }}
            />
          </Stack>
          {/* <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.75 }}>
            <AccountDropdown />
          </Stack> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Topbar;
