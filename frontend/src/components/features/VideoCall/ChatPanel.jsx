import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import styles from '../../../styles/videoComponent.module.css';

const ChatPanel = ({ messages = [], onSendMessage, isOpen = false }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.chatRoom}>
      <div className={styles.chatContainer}>
        <Typography variant="h6" component="h1">
          Chat
        </Typography>

        <div className={styles.chattingDisplay}>
          {messages.length > 0 ? (
            messages.map((item, index) => (
              <Box key={index} sx={{ marginBottom: '20px' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {item.sender}
                </Typography>
                <Typography variant="body1">{item.data}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No Messages Yet
            </Typography>
          )}
        </div>

        <div className={styles.chattingArea}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            label="Enter Your chat"
            variant="outlined"
          />
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
