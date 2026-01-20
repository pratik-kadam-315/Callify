import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  headerProps = {},
}) => {
  const location = useLocation();
  
  // Hide header and footer on video meeting pages
  const isVideoMeetingPage = location.pathname.match(/^\/[^/]+$/) && 
                              location.pathname !== '/' && 
                              location.pathname !== '/auth' &&
                              location.pathname !== '/home' &&
                              location.pathname !== '/history';

  const shouldShowHeader = showHeader && !isVideoMeetingPage;
  const shouldShowFooter = showFooter && !isVideoMeetingPage;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fafafa',
      }}
    >
      {shouldShowHeader && <Header {...headerProps} />}
      
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
        role="main"
      >
        {children}
      </Box>
      
      {shouldShowFooter && <Footer />}
    </Box>
  );
};

export default Layout;
