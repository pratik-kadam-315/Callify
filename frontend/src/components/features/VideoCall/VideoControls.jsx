import { IconButton, Badge } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';

const VideoControls = ({
  videoEnabled,
  audioEnabled,
  screenSharing,
  screenShareAvailable,
  unreadMessages = 0,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onEndCall,
  onToggleChat,
}) => {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '1rem' }}>
      <IconButton onClick={onToggleVideo} style={{ color: 'white' }}>
        {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
      </IconButton>

      <IconButton onClick={onEndCall} style={{ color: 'red' }}>
        <CallEndIcon />
      </IconButton>

      <IconButton onClick={onToggleAudio} style={{ color: 'white' }}>
        {audioEnabled ? <MicIcon /> : <MicOffIcon />}
      </IconButton>

      {screenShareAvailable && (
        <IconButton onClick={onToggleScreenShare} style={{ color: 'white' }}>
          {screenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
        </IconButton>
      )}

      <Badge badgeContent={unreadMessages} max={999} color="orange">
        <IconButton onClick={onToggleChat} style={{ color: 'white' }}>
          <ChatIcon />
        </IconButton>
      </Badge>
    </div>
  );
};

export default VideoControls;
