import { Container } from '@mui/material';

const PageContainer = ({ 
  children, 
  maxWidth = 'xl',
  sx = {},
  ...props 
}) => {
  return (
    <Container 
      maxWidth={maxWidth} 
      sx={{ 
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
        ...sx
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

export default PageContainer;
