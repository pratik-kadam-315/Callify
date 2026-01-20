import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.background.paper,
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}
        >
            <Container maxWidth="xl">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Callify. All rights reserved.
                    </Typography>

                    <Stack direction="row" spacing={3}>
                        <Link href="#" color="inherit" underline="hover" variant="body2">
                            Privacy Policy
                        </Link>
                        <Link href="#" color="inherit" underline="hover" variant="body2">
                            Terms of Service
                        </Link>
                        <Link href="#" color="inherit" underline="hover" variant="body2">
                            Contact
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
