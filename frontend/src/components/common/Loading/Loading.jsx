import { CircularProgress, Box } from '@mui/material';

const Loading = ({ fullScreen = false }) => {
  const containerStyle = fullScreen
    ? {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }
    : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      };

  return (
    <Box sx={containerStyle}>
      <CircularProgress />
    </Box>
  );
};

export default Loading;
