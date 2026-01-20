import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF', // Modern purple
      light: '#8F88FF',
      dark: '#4B44B3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6584', // Soft pink/red
      light: '#FF8FAB',
      dark: '#C13E5A',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none', // Remove uppercase default
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(108, 99, 255, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #6C63FF 30%, #8F88FF 90%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default gradient overlay in dark mode
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0,0,0,0.25)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

export default theme;
