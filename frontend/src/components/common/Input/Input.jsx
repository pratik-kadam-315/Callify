import { TextField } from '@mui/material';

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  fullWidth = false,
  margin = 'normal',
  variant = 'outlined',
  error = false,
  helperText = '',
  ...props
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
      fullWidth={fullWidth}
      margin={margin}
      variant={variant}
      error={error}
      helperText={helperText}
      {...props}
    />
  );
};

export default Input;
