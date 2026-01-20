import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = ({ 
  title = 'Callify-Video Conferencing',
  showGuestButton = false,
  showRegisterButton = false,
  showLoginButton = false,
  showHistoryButton = false,
  showLogoutButton = false,
  onLogout,
  onHistory,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#ffffff', 
        color: '#1a1a1a',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        height: { xs: 56, sm: 64 },
      }}
      role="banner"
      component="header"
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography 
          variant="h6" 
          component="h1"
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            color: '#1a1a1a',
            cursor: 'pointer',
            '&:hover': {
              color: '#FF9839',
            },
          }}
          onClick={() => navigate('/')}
          aria-label="Callify homepage"
        >
          {title}
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1 }, 
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {showGuestButton && (
            <Button
              color="inherit"
              onClick={() => handleNavigate('/aljk23')}
              aria-label="Join as guest"
              sx={{ 
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: '#666666',
                '&:hover': {
                  color: '#FF9839',
                  backgroundColor: 'rgba(255, 152, 57, 0.05)',
                },
              }}
            >
              Join as Guest
            </Button>
          )}
          
          {showRegisterButton && (
            <Button
              color="inherit"
              onClick={() => handleNavigate('/auth')}
              aria-label="Register new account"
              sx={{ 
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: '#666666',
                '&:hover': {
                  color: '#FF9839',
                  backgroundColor: 'rgba(255, 152, 57, 0.05)',
                },
              }}
            >
              Register
            </Button>
          )}
          
          {showLoginButton && (
            <Button
              variant="contained"
              onClick={() => handleNavigate('/auth')}
              aria-label="Login to account"
              sx={{ 
                textTransform: 'none',
                backgroundColor: '#FF9839',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 2, sm: 3 },
                fontWeight: 600,
                '&:hover': { 
                  backgroundColor: '#e6892a',
                },
                boxShadow: '0 2px 4px rgba(255, 152, 57, 0.3)',
              }}
            >
              Login
            </Button>
          )}
          
          {showHistoryButton && (
            <Button
              color="inherit"
              onClick={onHistory || (() => handleNavigate('/history'))}
              aria-label="View meeting history"
              sx={{ 
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: isActive('/history') ? '#FF9839' : '#666666',
                borderBottom: isActive('/history') ? '2px solid #FF9839' : '2px solid transparent',
                borderRadius: 0,
                '&:hover': {
                  color: '#FF9839',
                  backgroundColor: 'rgba(255, 152, 57, 0.05)',
                },
              }}
            >
              History
            </Button>
          )}
          
          {showLogoutButton && (
            <Button
              variant="outlined"
              onClick={onLogout}
              aria-label="Logout from account"
              sx={{ 
                textTransform: 'none',
                borderColor: '#FF9839',
                color: '#FF9839',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 2, sm: 3 },
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#e6892a',
                  backgroundColor: 'rgba(255, 152, 57, 0.1)',
                },
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
