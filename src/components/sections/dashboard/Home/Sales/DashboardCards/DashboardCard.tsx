import { ReactElement } from 'react';
import { Card, CardContent, Button, Stack, Typography, Box } from '@mui/material';
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
        width: 1,
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
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2} flex={1}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                backgroundColor: `${colorMap[color]}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconifyIcon icon={icon} width={28} height={28} color={colorMap[color]} />
            </Box>
            <Stack flex={1}>
              <Typography variant="subtitle1" component="p" fontWeight={600} color="text.primary">
                {title}
              </Typography>
              {value && (
                <Typography variant="h5" component="p" fontWeight={700} color={colorMap[color]}>
                  {value}
                </Typography>
              )}
            </Stack>
          </Stack>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
          {buttonText && (
            <Button
              variant="contained"
              onClick={buttonAction}
              sx={{
                backgroundColor: colorMap[color],
                '&:hover': {
                  backgroundColor: colorMap[color],
                  opacity: 0.9,
                },
                textTransform: 'none',
                mt: 'auto',
              }}
              startIcon={<IconifyIcon icon="mdi:download" width={18} height={18} />}
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

