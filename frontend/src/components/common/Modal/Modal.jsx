import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Button from '../Button/Button';

const Modal = ({ open, onClose, title, children, actions, maxWidth = 'sm' }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default Modal;
