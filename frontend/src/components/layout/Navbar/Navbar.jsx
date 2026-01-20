import { IconButton, Typography } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import Button from '../../common/Button/Button';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ 
  title = 'Callify-Video Conferencing', 
  onLogout,
  showHistoryButton = false,
  showLogoutButton = false 
}) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </div>

      <div className="navbar__right">
        {showHistoryButton && (
          <>
            <IconButton 
              onClick={() => navigate('/history')}
              aria-label="history"
            >
              <RestoreIcon />
            </IconButton>
            <Typography variant="body2">History</Typography>
          </>
        )}

        {showLogoutButton && (
          <Button variant="outlined" onClick={onLogout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
