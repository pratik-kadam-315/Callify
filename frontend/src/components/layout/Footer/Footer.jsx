import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Support', href: '#support' },
    ],
    company: [
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy', href: '#privacy' },
    ],
    legal: [
      { label: 'Terms', href: '#terms' },
      { label: 'Cookies', href: '#cookies' },
      { label: 'Policy', href: '#policy' },
    ],
  };

  const socialLinks = [
    { icon: <FacebookIcon />, label: 'Facebook', href: '#' },
    { icon: <TwitterIcon />, label: 'Twitter', href: '#' },
    { icon: <LinkedInIcon />, label: 'LinkedIn', href: '#' },
    { icon: <GitHubIcon />, label: 'GitHub', href: '#' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        mt: 'auto',
        py: { xs: 4, md: 6 },
      }}
      role="contentinfo"
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: '1.25rem',
                mb: 2,
                color: '#ffffff',
              }}
            >
              Callify
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#999999',
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              Professional video conferencing made simple. Connect with your team effortlessly.
            </Typography>
          </Grid>

          {/* Product Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="subtitle2"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#ffffff',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              Product
            </Typography>
            <Box component="nav" aria-label="Product navigation">
              {footerLinks.product.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  underline="none"
                  sx={{
                    display: 'block',
                    color: '#999999',
                    mb: 1.5,
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#FF9839',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="subtitle2"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#ffffff',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              Company
            </Typography>
            <Box component="nav" aria-label="Company navigation">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  underline="none"
                  sx={{
                    display: 'block',
                    color: '#999999',
                    mb: 1.5,
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#FF9839',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography
              variant="subtitle2"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#ffffff',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              Legal
            </Typography>
            <Box component="nav" aria-label="Legal navigation">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  underline="none"
                  sx={{
                    display: 'block',
                    color: '#999999',
                    mb: 1.5,
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#FF9839',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Social Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="subtitle2"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: '#ffffff',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  sx={{
                    color: '#999999',
                    '&:hover': {
                      color: '#FF9839',
                      backgroundColor: 'rgba(255, 152, 57, 0.1)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            mt: 4,
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#999999',
              fontSize: '0.875rem',
            }}
          >
            © {currentYear} Callify. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              href="#privacy"
              underline="none"
              sx={{
                color: '#999999',
                fontSize: '0.875rem',
                '&:hover': { color: '#FF9839' },
              }}
            >
              Privacy
            </Link>
            <Link
              href="#terms"
              underline="none"
              sx={{
                color: '#999999',
                fontSize: '0.875rem',
                '&:hover': { color: '#FF9839' },
              }}
            >
              Terms
            </Link>
            <Link
              href="#cookies"
              underline="none"
              sx={{
                color: '#999999',
                fontSize: '0.875rem',
                '&:hover': { color: '#FF9839' },
              }}
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
