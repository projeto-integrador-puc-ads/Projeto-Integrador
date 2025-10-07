import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1565C0' },
    secondary: { main: '#2E7D32' },
    background: { default: '#F7F9FC', paper: '#FFFFFF' },
    text: { primary: '#112233', secondary: '#345' },
  },
  typography: {
    fontFamily: 'Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
    fontSize: 16,
    h1: { fontSize: '2.25rem', fontWeight: 700 },
    h2: { fontSize: '1.9rem', fontWeight: 700 },
    h3: { fontSize: '1.6rem', fontWeight: 700 },
    body1: { fontSize: '1.125rem', lineHeight: 1.7 },
    button: { textTransform: 'none', fontSize: '1.0625rem', fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  spacing: 10,
  components: {
    MuiButton: {
      defaultProps: { size: 'large' },
      styleOverrides: { root: { padding: '12px 20px', borderRadius: 16 } },
    },
    MuiIconButton: {
      defaultProps: { size: 'large' },
      styleOverrides: { root: { padding: 14 } },
    },
    MuiCard: { styleOverrides: { root: { boxShadow: '0 6px 20px rgba(0,0,0,0.06)' } } },
    MuiListItemButton: { styleOverrides: { root: { padding: '14px 18px' } } },
  },
});
