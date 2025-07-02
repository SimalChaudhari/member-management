import { MouseEventHandler, ReactElement } from 'react';
import {
  AppBar,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { drawerWidth } from 'layouts/main-layout';
import AccountDropdown from './AccountDropdown';
import Image from 'components/base/Image';
import logo from 'assets/logo/elegent-favicon-logo.png';

interface TopbarProps {
  handleDrawerToggle: MouseEventHandler;
}

const Topbar = ({ handleDrawerToggle }: TopbarProps): ReactElement => {
  return (
    <AppBar
      sx={{
        width: { lg: `calc(100% - ${drawerWidth}px + 24px)` },
        ml: { lg: `${drawerWidth}px` },
        backgroundColor: { xs: '#0E416F', lg: 'inherit' },
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            p: 2.75,
          }}
        >
          <Stack direction="row" gap={1} display={{ xs: 'block', lg: 'none' }}>
            <IconButton color="inherit" sx={{ p: 0.75 }} onClick={handleDrawerToggle}>
              <Image src={logo} width={1} height={1} />
            </IconButton>
          </Stack>
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
          <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.75 }}>
            <AccountDropdown />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Topbar;
