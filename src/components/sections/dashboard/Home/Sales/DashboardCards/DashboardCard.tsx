import { ReactElement } from 'react';
import { Card, CardContent, Button, Stack, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

type DashboardCardProps = {
  title: string;
  icon: string;
  value?: string | number;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
  color?: 'primary' | 'warning' | 'error' | 'success' | 'info';
};

const DashboardCard = ({
  title,
  icon,
  value,
  description,
  buttonText,
  buttonAction,
  color = 'primary',
}: DashboardCardProps): ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery('(max-width: 1280px)');
  
  // Professional responsive sizing with smooth scaling
  const iconSize = isMobile ? 24 : isTablet ? 28 : isDesktop ? 32 : 30;
  const iconBoxSize = isMobile ? 48 : isTablet ? 56 : isDesktop ? 64 : 60;
  
  const colorMap = {
    primary: '#265EAC',
    warning: '#FF9800',
    error: '#F44336',
    success: '#4CAF50',
    info: '#2196F3',
  };

  return (
    <Card
      sx={(theme) => ({
        boxShadow: theme.shadows[4],
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        height: '100%',
        borderRadius: { xs: 1.5, sm: 2 },
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-4px)',
        },
      })}
    >
      <CardContent
        sx={{
          p: { xs: 1.25, sm: 2.25, md: 2.75, lg: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: 0,
          '&:last-child': {
            pb: { xs: 1.25, sm: 2.25, md: 2.75, lg: 3 },
          },
        }}
      >
        <Stack
          spacing={{ xs: 1, sm: 1.75, md: 2 }}
          flex={1}
          width="100%"
          alignItems="center"
          justifyContent="flex-start"
          sx={{
            minWidth: 0,
            maxWidth: '100%',
          }}
        >
          {/* Icon on Top - Centered */}
          <Box
            sx={{
              width: { xs: 40, sm: iconBoxSize, md: iconBoxSize },
              height: { xs: 40, sm: iconBoxSize, md: iconBoxSize },
              minWidth: { xs: 40, sm: iconBoxSize },
              minHeight: { xs: 40, sm: iconBoxSize },
              borderRadius: { xs: 1.25, sm: 2 },
              backgroundColor: `${colorMap[color]}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <IconifyIcon
              icon={icon}
              width={isMobile ? 20 : iconSize}
              height={isMobile ? 20 : iconSize}
              color={colorMap[color]}
            />
          </Box>

          {/* Title - Next Line */}
          <Typography
            variant="subtitle1"
            component="p"
            fontWeight={600}
            color="text.primary"
            sx={{
              fontSize: { xs: '0.8125rem', sm: '0.9375rem', md: '1rem', lg: '1.0625rem' },
              lineHeight: { xs: 1.3, sm: 1.5 },
              width: '100%',
              px: { xs: 0.25, sm: 0 },
              overflow: 'visible',
              whiteSpace: 'normal',
            }}
          >
            {title}
          </Typography>

          {/* Value - Next Line (30 days, 15 hours, etc.) - Auto Adjust */}
          {value && (
            <Typography
              variant="h5"
              component="p"
              fontWeight={700}
              color={colorMap[color]}
              sx={{
                fontSize: {
                  xs: 'clamp(0.875rem, 3vw, 1.5rem)',
                  sm: 'clamp(1.125rem, 2.5vw, 1.75rem)',
                  md: 'clamp(1.25rem, 2.2vw, 1.875rem)',
                  lg: isSmallScreen ? 'clamp(1.5rem, 1.8vw, 2rem)' : '2rem',
                },
                lineHeight: { xs: 1.2, sm: 1.3 },
                width: '100%',
                letterSpacing: { xs: '-0.01em', sm: '-0.02em' },
                overflow: 'visible',
                whiteSpace: 'normal',
              }}
            >
              {value}
            </Typography>
          )}

          {/* Description - Next Line */}
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: '0.6875rem',
                  sm: '0.8125rem',
                  md: '0.875rem',
                  lg: '0.9375rem',
                },
                lineHeight: { xs: 1.4, sm: 1.6 },
                px: { xs: 0.5, sm: 1.5, md: 2 },
                width: '100%',
                mt: { xs: 0.25, sm: 0.5 },
                overflow: 'visible',
                whiteSpace: 'normal',
              }}
            >
              {description}
            </Typography>
          )}

          {/* Button - Bottom */}
          {buttonText && (
            <Button
              variant="contained"
              onClick={buttonAction}
              fullWidth
              sx={{
                backgroundColor: colorMap[color],
                '&:hover': {
                  backgroundColor: colorMap[color],
                  opacity: 0.85,
                  transform: 'scale(1.02)',
                },
                textTransform: 'none',
                mt: 'auto',
                py: {
                  xs: 0.75,
                  sm: 1.125,
                  md: 1.25,
                  lg: 1.5,
                },
                px: {
                  xs: 1,
                  sm: 2,
                  md: 2.25,
                  lg: 2.5,
                },
                fontSize: {
                  xs: '0.6875rem',
                  sm: '0.8125rem',
                  md: '0.875rem',
                  lg: '0.9375rem',
                },
                minHeight: {
                  xs: 36,
                  sm: 42,
                  md: 44,
                  lg: 48,
                },
                maxWidth: '100%',
                width: '100%',
                whiteSpace: 'normal',
                overflow: 'visible',
                borderRadius: { xs: 1.5, sm: 2 },
                fontWeight: { xs: 500, sm: 600 },
                letterSpacing: { xs: '0.01em', sm: '0.02em' },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: (theme) => theme.shadows[2],
                '&:active': {
                  transform: 'scale(0.98)',
                },
                '& .MuiButton-startIcon': {
                  marginRight: { xs: 0.5, sm: 0.75, md: 1 },
                  flexShrink: 0,
                  '& svg': {
                    width: { xs: 16, sm: 18, md: 20, lg: 20 },
                    height: { xs: 16, sm: 18, md: 20, lg: 20 },
                    transition: 'transform 0.3s ease',
                  },
                },
                '&:hover .MuiButton-startIcon svg': {
                  transform: 'translateY(-2px)',
                },
                '& .MuiButton-label': {
                  overflow: 'visible',
                  whiteSpace: 'normal',
                  fontSize: 'inherit',
                },
              }}
              startIcon={
                <IconifyIcon
                  icon="mdi:download"
                  width={isMobile ? 16 : isTablet ? 18 : isDesktop ? 20 : 20}
                  height={isMobile ? 16 : isTablet ? 18 : isDesktop ? 20 : 20}
                />
              }
            >
              <Box
                component="span"
                sx={{
                  overflow: 'visible',
                  whiteSpace: 'normal',
                  fontSize: 'inherit',
                  maxWidth: '100%',
                }}
              >
                {buttonText}
              </Box>
            </Button>
          )}
          {!buttonText && !value && <Box sx={{ flex: 1 }} />}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;

