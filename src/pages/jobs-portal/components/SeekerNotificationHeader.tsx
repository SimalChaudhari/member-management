import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import IconifyIcon from 'components/base/IconifyIcon';
import { paths } from 'routes/paths';
import {
  getSeekerInboxSummary,
  listSeekerNotifications,
  markSeekerNotificationsRead,
} from 'services/jobs/jobsApi';
import { useJobsPortalRole } from 'services/jobs/useJobsPortalRole';
import type { SeekerInboxSummary, SeekerNotification } from 'services/jobs/types';
import { fetchUserInfoFromMobileApi } from 'store/action/AuthActions';
import { useAppDispatch, useAuthProfile } from 'store/hooks';
import { iscaGold } from 'theme/colors';

const greetingLabel = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const formatWhen = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

const SeekerNotificationHeader = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { profile: userProfile } = useAuthProfile();
  const hasFetchedMobileApi = useRef(false);
  const { role } = useJobsPortalRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<SeekerInboxSummary | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuItems, setMenuItems] = useState<SeekerNotification[]>([]);

  const loadSummary = useCallback(() => {
    void getSeekerInboxSummary(role).then(setSummary);
  }, [role]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary, location.pathname, location.key]);

  useEffect(() => {
    if (!userProfile || userProfile.FullName || hasFetchedMobileApi.current) return;
    hasFetchedMobileApi.current = true;
    void dispatch(fetchUserInfoFromMobileApi());
  }, [dispatch, userProfile]);

  const displayName = (userProfile?.FullName ?? userProfile?.name ?? '').trim() || 'User';

  const openMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setMenuAnchor(event.currentTarget);
    void listSeekerNotifications().then(setMenuItems);
  };

  const closeMenu = (): void => {
    setMenuAnchor(null);
  };

  const onMarkAllRead = async (): Promise<void> => {
    await markSeekerNotificationsRead();
    closeMenu();
    loadSummary();
    setMenuItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const onOpenItem = async (n: SeekerNotification): Promise<void> => {
    await markSeekerNotificationsRead([n.id]);
    loadSummary();
    setMenuItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    navigate(paths.jobsPortal.myApplications);
    closeMenu();
  };

  const unread = summary?.unreadNotificationCount ?? 0;
  const appUpdates = summary?.applicationUpdatesCount ?? 0;
  const recJobs = summary?.recommendedJobsCount ?? 0;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 0,
        p: { xs: 2, sm: 2.25, md: 2.5 },
        borderRadius: { xs: 1.5, sm: 2 },
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(14, 65, 111, 0.06) 0%, rgba(14, 65, 111, 0.02) 50%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1px solid rgba(14, 65, 111, 0.1)',
        boxShadow: '0 2px 12px rgba(14, 65, 111, 0.06)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={{ xs: 2.25, md: 2.5 }}
        sx={{ width: '100%', minWidth: 0 }}
      >
      <Box sx={{ minWidth: 0, flex: { md: 1 }, pr: { md: 2 } }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            letterSpacing: '-0.02em',
            lineHeight: { xs: 1.25, sm: 1.2 },
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.65rem', lg: '2rem' },
            wordBreak: 'break-word',
          }}
        >
          <>
            {greetingLabel()},{' '}
            <Box component="span" sx={{ color: iscaGold[800] }}>
              {displayName}
            </Box>{' '}
            <Box component="span" aria-hidden sx={{ fontWeight: 600 }}>
              👋
            </Box>
          </>
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.75,
            color: 'text.secondary',
            maxWidth: { xs: '100%', sm: 'min(100%, 36rem)' },
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            lineHeight: 1.5,
          }}
        >
          You have{' '}
          <Box component="span" fontWeight={800} color="primary.main">
            {appUpdates}
          </Box>{' '}
          new application updates and{' '}
          <Box component="span" fontWeight={800} color="primary.main">
            {recJobs}
          </Box>{' '}
          recommended jobs today.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1.25, md: 1.5 }}
        flexWrap={{ md: 'wrap' }}
        useFlexGap
        sx={{
          flexShrink: 0,
          width: { xs: '100%', md: 'auto' },
          minWidth: 0,
          alignSelf: { xs: 'stretch', md: 'flex-end' },
          alignItems: { xs: 'stretch', md: 'center' },
        }}
      >
        <Badge
          badgeContent={unread}
          invisible={unread === 0}
          sx={{
            width: { xs: '100%', md: 'auto' },
            display: { xs: 'flex', md: 'inline-flex' },
            justifyContent: { xs: 'stretch', md: 'flex-start' },
            '& .MuiBadge-badge': {
              right: { xs: 14, md: 10 },
              top: { xs: 10, md: 10 },
              minWidth: 22,
              height: 22,
              borderRadius: '50%',
              bgcolor: iscaGold[700],
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.7rem',
            },
          }}
        >
          <Button
            variant="text"
            color="inherit"
            onClick={openMenu}
            startIcon={<IconifyIcon icon="mdi:bell-outline" width={20} height={20} />}
            sx={{
              width: { xs: '100%', md: 'auto' },
              justifyContent: { xs: 'center', md: 'flex-start' },
              px: { xs: 2, md: 2 },
              py: { xs: 1.35, md: 1 },
              borderRadius: 2,
              border: 'none',
              bgcolor: 'rgba(255, 255, 255, 0.85)',
              color: 'text.primary',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 1px 2px rgba(14, 65, 111, 0.06)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)',
                boxShadow: '0 2px 8px rgba(14, 65, 111, 0.1)',
              },
            }}
          >
            Notifications
          </Button>
        </Badge>
        <Button
          component={RouterLink}
          to={paths.jobsPortal.browseJobs}
          variant="contained"
          color="primary"
          size="large"
          sx={{
            width: { xs: '100%', md: 'auto' },
            justifyContent: 'center',
            px: { xs: 2, md: 2.5 },
            py: { xs: 1.35, md: 1 },
            borderRadius: 2,
            fontWeight: 700,
            textTransform: 'none',
          }}
        >
          Browse Jobs
        </Button>
      </Stack>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 'min(360px, calc(100vw - 32px))',
              maxWidth: '100vw',
              maxHeight: 'min(70vh, 480px)',
              overflow: 'auto',
              mt: 1,
              borderRadius: 2,
              border: '1px solid rgba(14, 65, 111, 0.08)',
              boxShadow: '0 8px 32px rgba(14, 65, 111, 0.12)',
            },
          },
        }}
      >
        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
          <Typography variant="subtitle1" fontWeight={800}>
            Notifications
          </Typography>
          <Button
            component={RouterLink}
            to={paths.jobsPortal.myApplications}
            size="small"
            onClick={closeMenu}
            sx={{ mt: 0.5, p: 0, minWidth: 0, textTransform: 'none', fontWeight: 700 }}
          >
            View my applications
          </Button>
        </Box>
        <Divider />
        {menuItems.length === 0 ? (
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet.
            </Typography>
          </Box>
        ) : (
          menuItems.map((n) => (
            <MenuItem
              key={n.id}
              dense
              onClick={() => void onOpenItem(n)}
              sx={{
                alignItems: 'flex-start',
                py: 1.25,
                bgcolor: n.read ? 'transparent' : 'action.hover',
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {n.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
                      {n.body}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                      {formatWhen(n.createdAt)}
                    </Typography>
                  </>
                }
              />
            </MenuItem>
          ))
        )}
        {menuItems.length > 0 ? (
          <>
            <Divider />
            <Box sx={{ px: 1, py: 1 }}>
              <Button fullWidth size="small" onClick={() => void onMarkAllRead()} sx={{ textTransform: 'none' }}>
                Mark all as read
              </Button>
            </Box>
          </>
        ) : null}
      </Menu>
      </Stack>
    </Paper>
  );
};

export default SeekerNotificationHeader;
