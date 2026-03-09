import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { PaymentAssigner } from './pages/PaymentAssigner';

const theme = createTheme({
  palette: {
    primary: { main: '#1A1A2E' },
    background: { default: '#F8F9FA' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none' as const },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PaymentAssigner />
    </ThemeProvider>
  );
}
