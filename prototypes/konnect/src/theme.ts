import { createTheme } from '@mui/material/styles';

// Kontrol color tokens
const neutral = {
  50: '#FFFFFF',
  100: '#F1F5FB',
  200: '#E6E9F1',
  300: '#CDD6E5',
  400: '#93A2BA',
  500: '#72839D',
  600: '#526480',
  700: '#1A3865',
  800: '#001D4A',
  900: '#001029',
};

const blue = {
  100: '#E9F1FF',
  200: '#A8CAFE',
  300: '#448CFB',
  400: '#2678F5',
  500: '#1058C5',
  600: '#08357A',
};

const green = {
  100: '#E3FAE4',
  200: '#B7EAC5',
  300: '#01A62F',
  400: '#01A62F',
  500: '#005F1A',
};

const red = {
  100: '#FFEAEA',
  200: '#FDCCCC',
  300: '#E85959',
  400: '#CD0F0F',
  500: '#AF0D0D',
};

const orange = {
  100: '#FFF4E3',
  200: '#FFE3BA',
  300: '#FFBB54',
  400: '#C37F19',
  600: '#774100',
};

const purple = {
  100: '#F4EBF3',
  200: '#ECD2E9',
  300: '#8F3985',
};

export const colors = { neutral, blue, green, red, orange, purple };

const theme = createTheme({
  palette: {
    primary: { main: blue[400], light: blue[100], dark: blue[600] },
    secondary: { main: neutral[600] },
    error: { main: red[400], light: red[100] },
    warning: { main: orange[300], light: orange[100], dark: orange[600] },
    success: { main: green[300], light: green[100], dark: green[500] },
    info: { main: blue[400], light: blue[100] },
    background: { default: neutral[100], paper: neutral[50] },
    text: { primary: neutral[800], secondary: neutral[600] },
    divider: neutral[200],
  },
  typography: {
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    fontSize: 14,
    h1: { fontSize: '1.75rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    h3: { fontSize: '1.25rem', fontWeight: 700 },
    h4: { fontSize: '1rem', fontWeight: 700 },
    h5: { fontSize: '0.875rem', fontWeight: 700 },
    h6: { fontSize: '0.75rem', fontWeight: 700 },
    subtitle1: { fontSize: '1rem', fontWeight: 700 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 700 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    caption: { fontSize: '0.75rem', fontWeight: 400, color: neutral[600] },
    button: { textTransform: 'none' as const, fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '6px 6px 20px rgba(26, 56, 101, 0.1)',
    '0px 0px 124px rgba(26, 56, 101, 0.3)',
    '10px 0px 20px rgba(26, 56, 101, 0.1)',
    '-10px 0px 20px rgba(26, 56, 101, 0.1)',
    '2px 2px 4px rgba(0, 29, 74, 0.1)',
    '2px 2px 24px rgba(0, 29, 74, 0.15)',
    ...Array(19).fill('none'),
  ] as unknown as typeof createTheme extends (o: infer O) => unknown ? O extends { shadows?: infer S } ? S : never : never,
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: 'none', fontWeight: 700, fontSize: '0.875rem' },
        sizeSmall: { height: 30, fontSize: '0.75rem' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 700 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: blue[400],
            boxShadow: '0px 0px 0px 4px #B0D1FC',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: red[400],
            boxShadow: '0px 0px 0px 4px #FDCCCC',
          },
        },
        notchedOutline: { borderColor: neutral[300] },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, fontSize: '0.875rem' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 0 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12, border: `1px solid ${neutral[200]}` },
      },
    },
  },
});

export default theme;
