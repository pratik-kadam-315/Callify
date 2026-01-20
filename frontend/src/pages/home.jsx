import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, Paper, Grid, IconButton, Tooltip } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        if (meetingCode.trim()) {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Grid container spacing={4} alignItems="center">
                {/* Left Panel: Content */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom component="h1">
                            Quality Video Calls for Everyone
                        </Typography>
                        <Typography variant="h6" color="text.secondary" paragraph>
                            Connect, collaborate, and celebrate from anywhere with secure and high-quality video meetings.
                        </Typography>

                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                mt: 4,
                                borderRadius: 4,
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                alignItems: 'center'
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Enter Meeting Code"
                                variant="outlined"
                                value={meetingCode}
                                onChange={e => setMeetingCode(e.target.value)}
                                placeholder="e.g. daily-standup"
                                InputProps={{
                                    startAdornment: <VideoCallIcon color="action" sx={{ mr: 1 }} />
                                }}
                            />
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleJoinVideoCall}
                                disabled={!meetingCode.trim()}
                                sx={{
                                    minWidth: '120px',
                                    height: '56px', // match textfield height
                                    borderRadius: 2
                                }}
                            >
                                Join
                            </Button>
                        </Paper>

                        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Button
                                startIcon={<RestoreIcon />}
                                variant="outlined"
                                onClick={() => navigate("/history")}
                            >
                                View History
                            </Button>
                            <Button
                                startIcon={<LogoutIcon />}
                                color="error"
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    navigate("/auth");
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* Right Panel: Image */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box
                        component="img"
                        src="/logo3.png" // Using existing asset
                        alt="Meeting Illustration"
                        onError={(e) => { e.target.style.display = 'none'; }} // Fallback if image missing
                        sx={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 4,
                            // If image fails, this box will be invisible
                        }}
                    />
                    {/* Fallback visual if image is missing/broken */}
                    <Box sx={{
                        display: 'none', // Remove this if you don't have the image
                        width: '100%',
                        height: 400,
                        bgcolor: 'action.hover',
                        borderRadius: 4,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <VideoCallIcon sx={{ fontSize: 100, color: 'text.secondary' }} />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default withAuth(HomeComponent);