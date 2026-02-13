import { ReactElement, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { useAuthProfile } from 'store/hooks';
import NavButton from './NavButton';
import ProfileDropdown from './ProfileDropdown';

interface SidebarProps {
  isCollapsed?: boolean;
}

const Sidebar = ({ isCollapsed = false }: SidebarProps): ReactElement => {
  const { logout } = useAuthProfile();
  const { pathname } = useLocation();
  const collapsedWidth = 80;
  const expandedWidth = 300;
  
  // Track which menu item is currently open (only one can be open at a time)
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  /**
   * Check if a menu item has an active submenu based on current pathname.
   * Section root path (e.g. /support-community) counts as active so one click opens the menu.
   */
  const isMenuActive = (navItem: (typeof navItems)[number]): boolean => {
    if (!navItem.sublist) return false;
    if (pathname === navItem.path) return true;
    return navItem.sublist.some(subItem =>
      pathname === `${navItem.path}/${subItem.path}` ||
      (subItem.sublist && subItem.sublist.some(nestedItem =>
        pathname === `${navItem.path}/${subItem.path}/${nestedItem.path}`
      ))
    );
  };

  /**
   * Auto-open menu if current path matches a submenu item; close all when none match (e.g. dashboard).
   */
  useEffect(() => {
    if (!isCollapsed) {
      const activeIndex = navItems.findIndex((item) => isMenuActive(item));
      if (activeIndex !== -1) {
        setOpenMenuIndex(activeIndex);
      } else {
        setOpenMenuIndex(null);
      }
    }
  }, [pathname, isCollapsed]);

  /**
   * Handle menu item click - close all other menus and toggle the clicked one
   */
  const handleMenuToggle = (index: number, currentState: boolean) => {
    if (currentState) {
      // If clicking the same menu that's open, close it
      setOpenMenuIndex(null);
    } else {
      // Open the clicked menu and close all others
      setOpenMenuIndex(index);
    }
  };

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
        width: isCollapsed ? collapsedWidth : expandedWidth,
        bgcolor: '#265EAC',
        transition: 'width 0.3s ease-in-out',
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
              width: isCollapsed ? 'calc(100% - 16px)' : 'calc(100% - 32px)',
              mx: isCollapsed ? 1 : 2,
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
            <Image src={logo} width={isCollapsed ? 0.4 : 0.6} />
          </Link>
        </Stack>
        
        {/* Profile Section */}
        <ProfileDropdown isCollapsed={isCollapsed} />
      </Stack>
      <Stack
        justifyContent="space-between"
        sx={{
          flex: 1,
          overflow: 'hidden',
          '&:hover': {
            overflowY: 'auto',
          },
          width: isCollapsed ? collapsedWidth : expandedWidth,
        }}
      >
        {/* Navigation Menu */}
        <List
          sx={{
            px: isCollapsed ? 1 : 2,
            py: 1,
            flex: '1 1 auto',
            width: '100%',
            '& .MuiListItem-root': {
              px: 0,
            },
          }}
        >
          {navItems.map((navItem, index) => (
            <NavButton
              key={index}
              navItem={navItem}
              Link={Link}
              isCollapsed={isCollapsed}
              isOpen={openMenuIndex === index}
              onToggle={(currentState) => handleMenuToggle(index, currentState)}
            />
          ))}
        </List>
        
        {/* Logout Button */}
        <List
          sx={{
            px: isCollapsed ? 1 : 2,
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
              onClick={logout}
              sx={{
                bgcolor: '#FFFFFF',
                color: '#000000',
                borderRadius: 2,
                py: 1.25,
                px: isCollapsed ? 1 : 2,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[6],
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: isCollapsed ? 0 : 40, justifyContent: 'center' }}>
                <IconifyIcon icon="ri:logout-circle-line" width={20} height={20} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary="Log out"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
    </Stack>
  );
};

export default Sidebar;
