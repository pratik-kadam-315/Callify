import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Layout from '../components/layout/Layout/Layout';
import PageContainer from '../components/layout/PageContainer/PageContainer';
import { useAuth } from '../hooks/useAuth';
import { MeetingCard } from '../components/features/MeetingHistory';
import { Loading } from '../components/common';
import useApi from '../hooks/useApi';

const MeetingHistory = () => {
  const { getHistoryOfUser, logout } = useAuth();
  const { data: meetings, loading, error, execute } = useApi(getHistoryOfUser);
  const navigate = useNavigate();

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <Layout
      headerProps={{
        showHistoryButton: true,
        showLogoutButton: true,
        onLogout: logout,
        onHistory: () => navigate('/history'),
      }}
    >
      <PageContainer>
        <Box>
          <Button
            startIcon={<HomeIcon />}
            onClick={() => navigate('/home')}
            aria-label="Back to home"
            sx={{
              mb: 3,
              textTransform: 'none',
              color: '#666666',
              '&:hover': {
                backgroundColor: 'rgba(255, 152, 57, 0.05)',
                color: '#FF9839',
              },
            }}
          >
            Back to Home
          </Button>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              fontWeight: 600,
              mb: 3,
              color: '#1a1a1a',
            }}
          >
            Meeting History
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {meetings && meetings.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {meetings.map((meeting, index) => (
                <MeetingCard key={index} meeting={meeting} />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                No meetings found in history
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Meetings you join will appear here
              </Typography>
            </Box>
          )}
        </Box>
      </PageContainer>
    </Layout>
  );
};

export default MeetingHistory;
