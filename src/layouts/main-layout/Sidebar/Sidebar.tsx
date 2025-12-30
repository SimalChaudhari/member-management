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
        alignItems="center"
        sx={{
          pt: { xs: 4, lg: 5 },
          pb: 3,
        }}
      >
        <Link
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 190,
            bgcolor: '#FFFFFF',
            borderRadius: 0,
            boxShadow: (theme) => theme.shadows[2],
          }}
        >
          <Image src={logo} width={0.8} />
        </Link>
      </Stack>
      <Stack
        justifyContent="space-between"
        height={1}
        sx={{
          overflow: 'hidden',
          '&:hover': {
            overflowY: 'auto',
          },
          width: 300,
        }}
      >
        <List
          sx={{
            mx: 2.5,
            py: 1.25,
            flex: '1 1 auto',
            width: 260,
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
                bgcolor: '#FFFFFF',
                color: '#000000',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
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
