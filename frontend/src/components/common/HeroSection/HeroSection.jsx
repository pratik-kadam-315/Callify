import { Box, Typography, Button } from '@mui/material';

const HeroSection = ({
  title,
  subtitle,
  highlightText,
  ctaText = 'Get Started',
  ctaLink = '/auth',
  imageSrc,
  imageAlt = 'Hero illustration',
  onCtaClick,
}) => {
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: { xs: 3, md: 6 },
        minHeight: { xs: 'auto', md: 'calc(100vh - 200px)' },
      }}
      component="section"
      aria-labelledby="hero-title"
    >
      <Box
        sx={{
          flex: 1,
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography
          id="hero-title"
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 2,
            color: '#1a1a1a',
          }}
        >
          {title.split(highlightText)[0]}
          <Box
            component="span"
            sx={{
              color: '#FF9839',
            }}
          >
            {highlightText}
          </Box>
          {title.split(highlightText)[1]}
        </Typography>

        {subtitle && (
          <Typography
            variant="h6"
            component="p"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' },
              color: '#666',
              mb: 4,
              maxWidth: '600px',
              mx: { xs: 'auto', md: 0 },
            }}
          >
            {subtitle}
          </Typography>
        )}

        {ctaText && (
          <Button
            variant="contained"
            size="large"
            onClick={handleCtaClick}
            component={onCtaClick ? 'button' : 'a'}
            href={!onCtaClick ? ctaLink : undefined}
            aria-label={`${ctaText} - ${subtitle || 'Get started with Callify'}`}
            sx={{
              backgroundColor: '#FF9839',
              color: '#fff',
              padding: '12px 32px',
              fontSize: '1.1rem',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#e6892a',
              },
            }}
          >
            {ctaText}
          </Button>
        )}
      </Box>

      {imageSrc && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{
              maxWidth: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
            loading="lazy"
          />
        </Box>
      )}
    </Box>
  );
};

export default HeroSection;
