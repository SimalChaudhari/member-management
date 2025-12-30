import { ReactElement } from 'react';
import {
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';

import IconifyIcon from 'components/base/IconifyIcon';
import logo from 'assets/logo/isca-.png';
import Image from 'components/base/Image';
import navItems from 'data/nav-items';
import NavButton from './NavButton';
import ProfileDropdown from './ProfileDropdown';

const Sidebar = (): ReactElement => {
  return (
    <Stack
      justifyContent="space-between"
      bgcolor="primary.dark"
      height={1}
      boxShadow={(theme) => theme.shadows[8]}
      sx={{
        overflow: 'hidden',
        margin: { xs: 0, lg: 2.75 },
        borderRadius: { xs: 0, lg: 5 },
        '&:hover': {
          overflowY: 'auto',
        },
        width: 300,
        bgcolor: '#265EAC',
      }}
    >
      <Stack
        sx={{
          pt: { xs: 3, lg: 4 },
          pb: 2,
        }}
      >
        {/* Logo Section */}
        <Stack
          alignItems="center"
          sx={{
            mb: 3,
            px: 0,
          }}
        >
          <Link
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'calc(100% - 32px)',
              mx: 2,
              bgcolor: '#FFFFFF',
              borderRadius: 2,
              boxShadow: (theme) => theme.shadows[3],
              textDecoration: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: (theme) => theme.shadows[6],
              },
            }}
          >
            <Image src={logo} width={0.6} />
          </Link>
        </Stack>
        
        {/* Profile Section */}
        <ProfileDropdown />
      </Stack>
      <Stack
        justifyContent="space-between"
        sx={{
          flex: 1,
          overflow: 'hidden',
          '&:hover': {
            overflowY: 'auto',
          },
          width: 300,
        }}
      >
        {/* Navigation Menu */}
        <List
          sx={{
            px: 2,
            py: 1,
            flex: '1 1 auto',
            width: '100%',
            '& .MuiListItem-root': {
              px: 0,
            },
          }}
        >
          {navItems.map((navItem, index) => (
            <NavButton key={index} navItem={navItem} Link={Link} />
          ))}
        </List>
        
        {/* Logout Button */}
        <List
          sx={{
            px: 2,
            pb: 2.5,
            pt: 1,
            width: '100%',
          }}
        >
          <ListItem
            sx={{
              px: 0,
              py: 0.5,
            }}
          >
            <ListItemButton
              LinkComponent={Link}
              href="/"
              sx={{
                bgcolor: '#FFFFFF',
                color: '#000000',
                borderRadius: 2,
                py: 1.25,
                px: 2,
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[6],
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <IconifyIcon icon="ri:logout-circle-line" width={20} height={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Log out"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
    </Stack>
  );
};

export default Sidebar;
