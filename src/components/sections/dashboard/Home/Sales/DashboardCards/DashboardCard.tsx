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
  
  const iconSize = isMobile ? 24 : isTablet ? 28 : 32;
  const iconBoxSize = isMobile ? 48 : isTablet ? 56 : 64;
  
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
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
        },
      })}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Stack
          spacing={{ xs: 1.5, sm: 2 }}
          flex={1}
          width="100%"
          alignItems="center"
          sx={{ minWidth: 0 }}
        >
          {/* Icon on Top - Centered */}
          <Box
            sx={{
              width: iconBoxSize,
              height: iconBoxSize,
              borderRadius: 2,
              backgroundColor: `${colorMap[color]}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconifyIcon icon={icon} width={iconSize} height={iconSize} color={colorMap[color]} />
          </Box>

          {/* Title - Next Line */}
          <Typography
            variant="subtitle1"
            component="p"
            fontWeight={600}
            color="text.primary"
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
              width: '100%',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </Typography>

          {/* Value - Next Line */}
          {value && (
            <Typography
              variant="h5"
              component="p"
              fontWeight={700}
              color={colorMap[color]}
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                width: '100%',
                wordBreak: 'break-word',
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
                fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                px: { xs: 1, sm: 1.5 },
                width: '100%',
                wordBreak: 'break-word',
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
                  opacity: 0.9,
                },
                textTransform: 'none',
                mt: 'auto',
                py: { xs: 1, sm: 1.25, md: 1.5 },
                px: { xs: 1, sm: 2, md: 2.5 },
                fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                minHeight: { xs: 40, sm: 44, md: 48 },
                maxWidth: '100%',
                width: '100%',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                '& .MuiButton-startIcon': {
                  marginRight: { xs: 0.75, sm: 1 },
                  '& svg': {
                    width: { xs: 18, sm: 18, md: 20 },
                    height: { xs: 18, sm: 18, md: 20 },
                  },
                },
              }}
              startIcon={
                <IconifyIcon
                  icon="mdi:download"
                  width={isMobile ? 20 : isTablet ? 18 : 20}
                  height={isMobile ? 20 : isTablet ? 18 : 20}
                />
              }
            >
              {buttonText}
            </Button>
          )}
          {!buttonText && !value && <Box sx={{ flex: 1 }} />}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;

