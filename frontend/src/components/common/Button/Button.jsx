import { Button as MUIButton } from '@mui/material';

const Button = ({ 
  children, 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <MUIButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </MUIButton>
  );
};

export default Button;
