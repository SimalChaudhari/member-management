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

const Sidebar = (): ReactElement => {
  return (
    <Stack
      justifyContent="space-between"
      bgcolor="primary.dark"
      height={1}
      boxShadow={(theme) => theme.shadows[8]}
      sx={{
        overflow: 'hidden',
        margin: { xs: 0, lg: 3.75 },
        borderRadius: { xs: 0, lg: 5 },
        '&:hover': {
          overflowY: 'auto',
        },
        width: 218,
        bgcolor: 'background.blue',
      }}
    >
      <Link
        href="/"
        sx={{
          position: 'fixed',
          zIndex: 5,
          mt: { xs: 5, lg: 6.25 },
          mx: { xs: 2 },
          mb: 3.75,
          width: { xs: 180 },
          bgcolor: 'background.paper',
          borderRadius: 5,
          p: 1,
          boxShadow: (theme) => theme.shadows[4],
        }}
      >
        <Image src={logo} width={1} />
      </Link>
      <Stack
        justifyContent="space-between"
        mt={16.25}
        height={1}
        sx={{
          overflow: 'hidden',
          '&:hover': {
            overflowY: 'auto',
          },
          width: 218,
        }}
      >
        <List
          sx={{
            mx: 2.5,
            py: 1.25,
            flex: '1 1 auto',
            width: 178,
          }}
        >
          {navItems.map((navItem, index) => (
            <NavButton key={index} navItem={navItem} Link={Link} />
          ))}
        </List>
        <List
          sx={{
            mx: 2.5,
          }}
        >
          <ListItem
            sx={{
              mx: 0,
              my: 2.5,
            }}
          >
            <ListItemButton
              LinkComponent={Link}
              href="/"
              sx={{
                bgcolor: 'background.red',
                color: 'error.contrastText',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'error.dark',
                  color: 'error.contrastText',
                  transform: 'translateY(-1px)',
                  boxShadow: (theme) => theme.shadows[4],
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <IconifyIcon icon="ri:logout-circle-line" />
              </ListItemIcon>
              <ListItemText>Log out</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
    </Stack>
  );
};

export default Sidebar;
