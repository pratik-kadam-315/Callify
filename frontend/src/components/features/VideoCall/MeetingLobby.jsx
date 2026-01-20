import { Box, Typography } from '@mui/material';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';

const MeetingLobby = ({ username, onUsernameChange, onConnect, localVideoRef }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: 4,
      }}
    >
      <Typography variant="h5" component="h2">
        Enter into Lobby
      </Typography>
      <Input
        label="Username"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{ maxWidth: '400px' }}
      />
      <Button variant="contained" onClick={onConnect}>
        Connect
      </Button>
      <Box sx={{ marginTop: 2 }}>
        <video ref={localVideoRef} autoPlay muted style={{ maxWidth: '100%', borderRadius: '8px' }} />
      </Box>
    </Box>
  );
};

export default MeetingLobby;
