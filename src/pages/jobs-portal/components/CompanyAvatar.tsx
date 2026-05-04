import { ReactElement, useMemo } from 'react';
import { Avatar, SxProps, Theme } from '@mui/material';

const hashHue = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = s.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % 360;
};

type Props = {
  name: string;
  size?: number;
  sx?: SxProps<Theme>;
};

/**
 * Company initials avatar (LinkedIn-style tile) when no logo URL exists.
 */
const CompanyAvatar = ({ name, size = 48, sx }: Props): ReactElement => {
  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  const hue = hashHue(name);
  const bg = `hsl(${hue} 45% 92%)`;
  const color = `hsl(${hue} 50% 28%)`;

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        fontWeight: 600,
        bgcolor: bg,
        color,
        border: '1px solid rgba(0,0,0,0.06)',
        ...sx,
      }}
      variant="rounded"
      alt=""
    >
      {initials}
    </Avatar>
  );
};

export default CompanyAvatar;
