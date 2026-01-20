import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';

export default function LandingPage() {
    const router = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.dark} 0%, ${theme.palette.background.default} 80%)`,
            minHeight: 'calc(100vh - 64px)' // Full height minus navbar
        }}>
            <Container maxWidth="xl">
                <Grid container spacing={4} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                background: `linear-gradient(45deg, #FF9839 30%, ${theme.palette.primary.main} 90%)`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontSize: { xs: '2.5rem', md: '4rem' }
                            }}
                        >
                            Connect with your Loved Ones
                        </Typography>
                        <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                            High-quality video conferencing made simple. Distance is just a number with Callify.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => router("/auth")}
                                sx={{
                                    fontSize: '1.2rem',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '50px'
                                }}
                            >
                                Get Started
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => router("/guest")}
                                sx={{
                                    fontSize: '1.2rem',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '50px',
                                    borderColor: 'text.secondary',
                                    color: 'text.primary'
                                }}
                            >
                                Join as Guest
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                            component="img"
                            src="/mobile.png"
                            alt="Video Call Illustration"
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '60vh',
                                filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.5))',
                                animation: 'float 6s ease-in-out infinite'
                            }}
                        />
                        <style>
                            {`
                                @keyframes float {
                                    0% { transform: translateY(0px); }
                                    50% { transform: translateY(-20px); }
                                    100% { transform: translateY(0px); }
                                }
                            `}
                        </style>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}