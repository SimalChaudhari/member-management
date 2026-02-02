import { ReactElement, MouseEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import IconifyIcon from 'components/base/IconifyIcon';
import profile from 'assets/profile/profile.jpg';
import { useAuthProfile, useAppDispatch } from 'store/hooks';
import { fetchUserInfoFromMobileApi } from 'store/action/AuthActions';
import { paths } from 'routes/paths';

interface ProfileDropdownProps {
  isCollapsed?: boolean;
}

const ProfileDropdown = ({ isCollapsed = false }: ProfileDropdownProps): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile: userProfile, loading, logout } = useAuthProfile();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Fetch user info from mobileapi endpoint on mount
  useEffect(() => {
    if (userProfile && !userProfile.FullName) {
      // Only fetch if we don't already have the mobileapi data
      dispatch(fetchUserInfoFromMobileApi());
    }
  }, [dispatch, userProfile]);

  // Use FullName from API if available, otherwise fallback to name
  const userName = userProfile?.FullName || userProfile?.name || 'User'
  const userEmail = userProfile?.email || '';

  const avatarSrc = userProfile?.picture ?? profile;

  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleHome = () => {
    handleMenuClose();
    navigate(paths.home);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate(paths.profileMembership.editProfile);
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate(paths.profileMembership.editProfile);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={isCollapsed ? 'center' : 'flex-start'}
        onClick={handleProfileClick}
        id="profile-menu-button"
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          width: isCollapsed ? 'calc(100% - 16px)' : 'calc(100% - 32px)',
          mx: isCollapsed ? 1 : 2,
          px: isCollapsed ? 1 : 2,
          py: isCollapsed ? 1 : 1.5,
          gap: isCollapsed ? 0 : 1.5,
          cursor: 'pointer',
          bgcolor: 'rgba(255, 255, 255, 0.15)',
          transition: 'all 0.2s ease-in-out',
          borderRadius: 2,
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
        }}
      >
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Avatar
            alt={userName}
            src={avatarSrc}
            sx={{
              width: isCollapsed ? 40 : 48,
              height: isCollapsed ? 40 : 48,
              border: '2px solid #FFFFFF',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: isCollapsed ? 12 : 14,
              height: isCollapsed ? 12 : 14,
              bgcolor: '#4CAF50',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
            }}
          />
        </Box>
        {!isCollapsed && (
          <>
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              {loading ? (
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.25 }}>
                  <CircularProgress size={14} sx={{ color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                    Loading…
                  </Typography>
                </Stack>
              ) : (
                <>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: '#FFFFFF',
                      fontSize: '0.95rem',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      mb: 0.25,
                    }}
                  >
                    {userName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', fontWeight: 400 }}
                  >
                    {userEmail}
                  </Typography>
                </>
              )}
            </Stack>
            <IconifyIcon
              icon="ion:chevron-down-outline"
              width={20}
              height={20}
              color="#FFFFFF"
              sx={{
                opacity: 0.85,
                flexShrink: 0,
                transition: 'transform 0.2s ease-in-out',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </>
        )}
      </Stack>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{ 'aria-labelledby': 'profile-menu-button' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[8],
            width: anchorEl ? anchorEl.offsetWidth : 'auto',
            mt: 0.5,
          },
        }}
      >
        <MenuItem onClick={handleHome}>
          <ListItemIcon>
            <IconifyIcon icon="ion:home-sharp" width={20} height={20} />
          </ListItemIcon>
          <ListItemText primary="Home" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
        </MenuItem>
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <IconifyIcon icon="mdi:account-outline" width={20} height={20} />
          </ListItemIcon>
          <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <IconifyIcon icon="material-symbols:settings" width={20} height={20} />
          </ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} disableRipple disableTouchRipple sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <IconifyIcon icon="ri:logout-circle-line" color="error.main" width={20} height={20} />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileDropdown;
