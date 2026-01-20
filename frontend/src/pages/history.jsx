import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Container, Grid, IconButton, Box, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // Ignore error
            }
        }
        fetchHistory();
    }, [])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={() => navigate("/home")} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight="bold">
                    Meeting History
                </Typography>
            </Box>

            {meetings.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                    <CalendarTodayIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6">No scheduled meetings yet</Typography>
                    <Typography variant="body2">Join a meeting to see it here</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {meetings.map((e, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                            <Card variant="outlined" sx={{ borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Chip icon={<LinkIcon />} label="Meeting Code" color="primary" size="small" variant="outlined" sx={{ mr: 1 }} />
                                        <Typography variant="h6" component="div">
                                            {e.meetingCode}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                                        <Typography variant="body2">
                                            {formatDate(e.date)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    )
}