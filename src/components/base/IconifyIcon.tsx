import { Box, BoxProps } from '@mui/material';
import { Icon, IconProps } from '@iconify/react';
import { useState } from 'react';

interface IconifyProps extends BoxProps {
  icon: IconProps['icon'];
  width?: number | string;
  height?: number | string;
  color?: string;
  fallbackIcon?: string;
}

const IconifyIcon = ({ 
  icon, 
  width = 24, 
  height = 24, 
  color, 
  fallbackIcon = "mdi:help-circle",
  ...rest 
}: IconifyProps) => {
  const [iconError, setIconError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const handleIconError = () => {
    if (!iconError) {
      setIconError(true);
    } else if (!fallbackError) {
      setFallbackError(true);
    }
  };

  // If both icon and fallback failed, show a simple text-based icon
  if (iconError && fallbackError) {
    const iconText = icon.toString().includes('eye') ? (icon.toString().includes('off') ? '👁️‍🗨️' : '👁️') : 
                    icon.toString().includes('lock') ? '🔒' :
                    icon.toString().includes('email') ? '📧' :
                    icon.toString().includes('close') ? '✕' :
                    icon.toString().includes('login') ? '→' :
                    icon.toString().includes('shield') ? '🛡️' :
                    icon.toString().includes('clock') ? '🕐' :
                    icon.toString().includes('phone') ? '📱' :
                    icon.toString().includes('account') ? '👥' : '?';
    
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: typeof width === 'number' ? width * 0.6 : '14px',
          color: color || '#666',
          userSelect: 'none',
        }}
      >
        {iconText}
      </Box>
    );
  }

  return (
    <Box 
      component={Icon} 
      icon={iconError ? fallbackIcon : icon}
      width={width} 
      height={height}
      color={color}
      style={{ 
        display: 'inline-block',
        verticalAlign: 'middle',
        ...(color && { color }),
      }}
      onError={handleIconError}
      {...rest} 
    />
  );
};

export default IconifyIcon;
