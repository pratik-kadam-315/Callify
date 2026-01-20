import { Snackbar, Alert as MUIAlert } from '@mui/material';

const Alert = ({ open, message, severity = 'info', onClose, autoHideDuration = 4000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <MUIAlert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </MUIAlert>
    </Snackbar>
  );
};

export default Alert;
