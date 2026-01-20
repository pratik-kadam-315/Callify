import { Card as MUICard, CardContent, CardActions } from '@mui/material';

const Card = ({ children, actions, ...props }) => {
  return (
    <MUICard variant="outlined" {...props}>
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MUICard>
  );
};

export default Card;
