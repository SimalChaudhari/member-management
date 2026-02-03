import { PaletteOptions } from '@mui/material';
import { 
  iscaBlue, 
  iscaTeal, 
  iscaGreen, 
  iscaOrange, 
  iscaRed, 
  iscaDark, 
  iscaText, 
  iscaBackground 
} from './colors';

const palette: PaletteOptions = {
  primary: {
    main: iscaBlue[500],
    light: iscaBlue[300],
    dark: iscaBlue[700],
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: iscaTeal[500],
    light: iscaTeal[300],
    dark: iscaTeal[700],
    contrastText: '#FFFFFF',
  },
  info: {
    main: iscaBlue[500],
    light: iscaBlue[300],
    dark: iscaBlue[700],
    contrastText: '#FFFFFF',
  },
  success: {
    main: iscaGreen[500],
    light: iscaGreen[300],
    dark: iscaGreen[700],
    contrastText: '#FFFFFF',
  },
  error: {
    main: iscaRed[500],
    light: iscaRed[300],
    dark: iscaRed[700],
    contrastText: '#FFFFFF',
  },
  warning: {
    main: iscaOrange[500],
    light: iscaOrange[300],
    dark: iscaOrange[700],
    contrastText: '#FFFFFF',
  },
  text: {
    primary: iscaText.primary,
    secondary: iscaText.secondary,
    disabled: iscaText.disabled,
  },
  action: {
    active: iscaBlue[200],
    hover: iscaBlue[50],
    selected: iscaBlue[100],
    disabled: iscaDark[300],
    disabledBackground: iscaDark[100],
    focus: iscaBlue[100],
  },
  background: {
    default: iscaBackground.default,
    paper: iscaBackground.paper,
    blue: iscaBackground.blue,
    red: iscaBackground.red,
  } as PaletteOptions['background'],
  divider: iscaDark[200],
  common: {
    black: iscaDark[900],
    white: '#FFFFFF',
  },
  grey: {
    50: iscaDark[50],
    100: iscaDark[100],
    200: iscaDark[200],
    300: iscaDark[300],
    400: iscaDark[400],
    500: iscaDark[500],
    600: iscaDark[600],
    700: iscaDark[700],
    800: iscaDark[800],
    900: iscaDark[900],
  },
};

export default palette;
