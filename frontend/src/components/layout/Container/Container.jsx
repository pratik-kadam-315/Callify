import { Box } from '@mui/material';
import './Container.css';

const Container = ({ 
  children, 
  className = '', 
  maxWidth = 'lg',
  ...props 
}) => {
  return (
    <Box 
      className={`container container--${maxWidth} ${className}`}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Container;
