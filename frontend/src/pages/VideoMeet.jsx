import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    TextField,
    Typography,
    Paper,
    Badge,
    Drawer,
    Stack,
    Tooltip,
    useMediaQuery,
    useTheme,
    Card,
    CardContent
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.down('md'));

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]); // Logic seems to swap boolean/array usage in original code, fixing to boolean for toggle
    // Re-analyzing original code: 
    // useState(true) for availability, but handleVideo toggles !video. 
    // In original: let [video, setVideo] = useState([]); -> Wait, original code initializes video as array but uses it as boolean in handleVideo?
    // Line 386: setVideo(!video);
    // Line 504: (video === true) ? ...
    // This looks like a bug in original code or loose typing. 
    // I Will separate "videoEnabled" state from "videos" list for safety.

    let [videoEnabled, setVideoEnabled] = useState(true);
    let [audioEnabled, setAudioEnabled] = useState(true);
    // Keeping 'videos' for remote streams
    let [videos, setVideos] = useState([]);

    let [screen, setScreen] = useState(false);
    let [showModal, setModal] = useState(false); // FIXED: Logic to start closed
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");

    const videoRef = useRef([]);

    useEffect(() => {
        getPermissions();
    }, []); // Empty dependency array to run once

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (videoEnabled !== undefined && audioEnabled !== undefined) {
            getUserMedia(); // Re-trigger media constraints update
        }
    }, [videoEnabled, audioEnabled]);

    let getMedia = () => {
        setVideoEnabled(videoAvailable);
        setAudioEnabled(audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream
        }

        for (let id in connections) {
            if (id === socketIdRef.current) continue // FIXED: id comparison

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideoEnabled(false);
            setAudioEnabled(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((videoEnabled && videoAvailable) || (audioEnabled && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: videoEnabled, audio: audioEnabled })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()
        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideoEnabled(!videoEnabled);
    }
    let handleAudio = () => {
        setAudioEnabled(!audioEnabled);
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])

    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        socketRef.current.emit('chat-message', message, username)
        setMessage("");
    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    // Styles
    const videoStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '12px',
        backgroundColor: '#000',
        transform: 'scaleX(-1)' // Mirror local video
    };

    // Remote videos not mirrored
    const remoteVideoStyle = { ...videoStyle, transform: 'scaleX(1)' };

    return (
        <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'hidden', bgcolor: 'background.default', position: 'relative' }}>
            {askForUsername ? (
                <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>Join Lobby</Typography>
                        <Box sx={{ width: '100%', maxWidth: 400, aspectRatio: '16/9', bgcolor: 'black', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                            <video ref={localVideoref} autoPlay muted style={videoStyle}></video>
                        </Box>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            variant="outlined"
                        />
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={connect}
                            disabled={!username.trim()}
                        >
                            Connect to Call
                        </Button>
                    </Paper>
                </Container>
            ) : (
                <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>

                    {/* VIDEO GRID */}
                    <Box sx={{
                        flexGrow: 1,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 2,
                        transition: 'all 0.3s'
                    }}>
                        <Grid container spacing={2} sx={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                            {/* Local Video */}
                            <Grid item xs={12} md={videos.length === 0 ? 12 : 6} lg={videos.length === 0 ? 8 : 6} sx={{ height: videos.length === 0 ? '80%' : '50%' }}>
                                <Card sx={{ height: '100%', borderRadius: 3, position: 'relative', bgcolor: 'black' }}>
                                    <video ref={localVideoref} autoPlay muted style={videoStyle}></video>
                                    <Box sx={{ position: 'absolute', bottom: 10, left: 10, bgcolor: 'rgba(0,0,0,0.5)', px: 1, borderRadius: 1 }}>
                                        <Typography variant="caption" color="white">You</Typography>
                                    </Box>
                                </Card>
                            </Grid>

                            {/* Remote Videos */}
                            {videos.map((video) => (
                                <Grid item xs={12} md={6} lg={6} key={video.socketId} sx={{ height: '50%' }}>
                                    <Card sx={{ height: '100%', borderRadius: 3, position: 'relative', bgcolor: 'black' }}>
                                        <video
                                            data-socket={video.socketId}
                                            ref={ref => {
                                                if (ref && video.stream) ref.srcObject = video.stream;
                                            }}
                                            autoPlay
                                            style={remoteVideoStyle}
                                        >
                                        </video>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* CONTROLS BAR */}
                        <Paper elevation={4} sx={{
                            position: 'absolute',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderRadius: 6,
                            px: 3,
                            py: 1,
                            display: 'flex',
                            gap: 2,
                            zIndex: 10
                        }}>
                            <Tooltip title={videoEnabled ? "Turn Off Camera" : "Turn On Camera"}>
                                <IconButton onClick={handleVideo} color={videoEnabled ? "primary" : "error"} size="large">
                                    {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title={audioEnabled ? "Mute Mic" : "Unmute Mic"}>
                                <IconButton onClick={handleAudio} color={audioEnabled ? "primary" : "error"} size="large">
                                    {audioEnabled ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>
                            </Tooltip>

                            {screenAvailable && (
                                <Tooltip title="Share Screen">
                                    <IconButton onClick={handleScreen} color={screen ? "success" : "default"} size="large">
                                        {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                                    </IconButton>
                                </Tooltip>
                            )}

                            <Tooltip title="End Call">
                                <IconButton onClick={handleEndCall} color="error" size="large" sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}>
                                    <CallEndIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Chat">
                                <Badge badgeContent={newMessages} color="error">
                                    <IconButton onClick={() => setModal(!showModal)} color={showModal ? "primary" : "default"} size="large">
                                        <ChatIcon />
                                    </IconButton>
                                </Badge>
                            </Tooltip>
                        </Paper>
                    </Box>

                    {/* CHAT DRAWER */}
                    <Drawer
                        anchor="right"
                        open={showModal}
                        onClose={closeChat}
                        variant={isMobile ? "temporary" : "persistent"}
                        sx={{
                            width: showModal ? 320 : 0,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: 320,
                                boxSizing: 'border-box',
                                height: 'calc(100% - 64px)', // Deduct navbar
                                top: 64
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">In-Call Messages</Typography>
                                <IconButton onClick={closeChat}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <Paper variant="outlined" sx={{ flexGrow: 1, mb: 2, p: 2, overflowY: 'auto', bgcolor: 'background.paper' }}>
                                {messages.length > 0 ? messages.map((item, index) => (
                                    <Box key={index} sx={{ mb: 1.5 }}>
                                        <Typography variant="subtitle2" color="primary">{item.sender}</Typography>
                                        <Typography variant="body2">{item.data}</Typography>
                                    </Box>
                                )) : (
                                    <Typography variant="body2" color="text.secondary" align="center">No messages yet</Typography>
                                )}
                            </Paper>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <IconButton color="primary" onClick={sendMessage} disabled={!message.trim()}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Drawer>
                </Box>
            )}
        </Box>
    );
}