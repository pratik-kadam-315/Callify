import React, { useState, useEffect, useRef } from 'react';
import VideoGrid from './VideoGrid';
import ControlBar from './ControlBar';
import ChatSidebar from './ChatSidebar';
import { useTheme } from '../contexts/ThemeContext';

/**
 * VideoCallApp Component - Main video call application
 * Combines VideoGrid, ControlBar, and ChatSidebar into a complete video call interface
 */
const VideoCallApp = ({ meetingCode = '123-456-789' }) => {
  // Theme
  const { isDark, toggleTheme } = useTheme();
  
  // Join screen state
  const [showJoinScreen, setShowJoinScreen] = useState(true);
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Media states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // UI states
  const [showChat, setShowChat] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  // Media streams
  const [localStream, setLocalStream] = useState(null);
  const [screenShareStream, setScreenShareStream] = useState(null);
  
  // Participants
  const [participants, setParticipants] = useState([
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'Participant',
      stream: null,
      isMuted: false,
      hasVideo: true
    },
    {
      id: '2', 
      name: 'Bob Smith',
      role: 'Participant',
      stream: null,
      isMuted: true,
      hasVideo: false
    },
    {
      id: '3',
      name: 'Carol Davis',
      role: 'Participant', 
      stream: null,
      isMuted: false,
      hasVideo: true
    }
  ]);
  
  // Chat messages
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: 'Welcome to the meeting!',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      type: 'user',
      sender: 'Alice Johnson',
      content: 'Hi everyone! Can you hear me?',
      timestamp: new Date(Date.now() - 240000),
      isOwn: false
    },
    {
      type: 'user',
      sender: 'You',
      content: 'Yes, I can hear you clearly!',
      timestamp: new Date(Date.now() - 180000),
      isOwn: true
    },
    {
      type: 'user',
      sender: 'Bob Smith',
      content: 'Great! Let me share my screen in a moment.',
      timestamp: new Date(Date.now() - 120000),
      isOwn: false
    },
    {
      type: 'file',
      sender: 'Carol Davis',
      fileName: 'presentation.pdf',
      fileSize: '2.4 MB',
      timestamp: new Date(Date.now() - 60000),
      isOwn: false
    }
  ]);

  const localVideoRef = useRef(null);

  // Initialize local media stream only after joining
  const initializeMedia = async () => {
    console.log('🎥 initializeMedia() called');
    try {
      setIsConnecting(true);
      console.log('📹 Requesting camera and microphone permissions...');
      
      // First, try to stop any existing tracks
      if (localStream) {
        console.log('🔄 Stopping existing tracks...');
        localStream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
      
      // Request permissions with constraints
      console.log('🎤 Calling getUserMedia with constraints:', {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      });
      
      console.log('✅ getUserMedia successful, stream:', stream);
      console.log('📹 Stream tracks:', stream.getTracks());
      
      setLocalStream(stream);
      
      // Attach to local video element if available
      if (localVideoRef.current) {
        console.log('🎥 Attaching stream to local video element');
        localVideoRef.current.srcObject = stream;
      }
      setIsConnecting(false);
      
      console.log('🎥 Media initialization complete');
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setIsConnecting(false);
      
      // Handle different error types with better user guidance
      if (error.name === 'NotAllowedError') {
        const shouldRetry = window.confirm(
          'Camera and microphone access was denied.\n\n' +
          'To enable access:\n' +
          '1. Click the camera icon in your browser\'s address bar\n' +
          '2. Select "Allow" for camera and microphone\n' +
          '3. Refresh the page\n\n' +
          'Would you like to try again?'
        );
        if (shouldRetry) {
          setTimeout(() => initializeMedia(), 1000);
        }
      } else if (error.name === 'NotFoundError') {
        alert(
          'No camera or microphone found.\n\n' +
          'Please check:\n' +
          '• Camera is connected and not used by another app\n' +
          '• Microphone is connected and working\n' +
          '• Browser has permission to access devices'
        );
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        const shouldRetry = window.confirm(
          'Camera or microphone is already in use by another application or tab.\n\n' +
          'To fix this:\n' +
          '1. Close other tabs using camera/microphone\n' +
          '2. Close video conferencing apps (Zoom, Teams, etc.)\n' +
          '3. Refresh the page\n\n' +
          'Would you like to try again?'
        );
        if (shouldRetry) {
          setTimeout(() => initializeMedia(), 2000);
        } else {
          // Create dummy stream for demo purposes
          createDummyStream();
        }
      } else if (error.name === 'OverconstrainedError') {
        alert(
          'Camera does not support the requested settings.\n\n' +
          'Trying with lower quality settings...'
        );
        // Retry with lower quality
        setTimeout(() => initializeMediaWithLowerQuality(), 1000);
      } else {
        alert('Error accessing camera and microphone: ' + error.message);
        // Create dummy stream for demo purposes
        createDummyStream();
      }
    }
  };

  // Fallback with lower quality
  const initializeMediaWithLowerQuality = async () => {
    try {
      setIsConnecting(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          facingMode: 'user'
        },
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsConnecting(false);
    } catch (error) {
      console.error('Error with lower quality:', error);
      setIsConnecting(false);
      createDummyStream();
    }
  };

  // Handle joining the meeting
  const handleJoinMeeting = async () => {
    if (username.trim()) {
      setShowJoinScreen(false);
      console.log('Joining meeting with username:', username);
      await initializeMedia();
    }
  };

  // Create dummy stream for demo
  const createDummyStream = () => {
    try {
      // Create a canvas element to generate dummy video
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      // Create animated gradient background
      let hue = 0;
      const animate = () => {
        hue = (hue + 1) % 360;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
        gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 30%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Demo Mode', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '24px Arial';
        ctx.fillText('Camera/Mic Unavailable', canvas.width / 2, canvas.height / 2 + 20);
        
        // Add time
        ctx.font = '16px Arial';
        ctx.fillText(new Date().toLocaleTimeString(), canvas.width / 2, canvas.height / 2 + 60);
      };
      
      // Start animation
      const animationId = setInterval(animate, 50);
      
      const stream = canvas.captureStream(30);
      
      // Store animation ID for cleanup
      stream._animationId = animationId;
      
      setLocalStream(stream);
      
      // Attach to local video element if available
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error creating dummy stream:', error);
      // Final fallback - create a simple static image
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Add overlay text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Video Call Demo', canvas.width / 2, canvas.height / 2);
        
        const stream = canvas.captureStream(30);
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      };
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4cCIgaGVpZ2h0PSIxMjgiIHZpZXdCb3g9IjAgMjQ4IiB4bGluaz0iI2FmMmYyZSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzNhYzFmZiIgLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmZmYiIC8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI2cHgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RGVtbyBNb2RlPC90ZXh0Pjwvc3ZnPg==';
    }
  };

  // Cleanup function for streams
  const cleanupStream = (stream) => {
    if (stream) {
      // Stop animation if it's a dummy stream
      if (stream._animationId) {
        clearInterval(stream._animationId);
      }
      
      // Stop all tracks
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
    }
  };

  // Toggle microphone
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const isEnabled = audioTracks[0].enabled;
        audioTracks[0].enabled = !isEnabled;
        setIsMuted(!isEnabled);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  // Toggle camera
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const isEnabled = videoTracks[0].enabled;
        videoTracks[0].enabled = !isEnabled;
        setIsVideoOff(!isEnabled);
      }
    } else {
      setIsVideoOff(!isVideoOff);
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
        setScreenShareStream(null);
      }
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setScreenShareStream(stream);
        setIsScreenSharing(true);
        
        // Handle screen share ending
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          setScreenShareStream(null);
          setIsScreenSharing(false);
        });
      } catch (error) {
        console.error('Error starting screen share:', error);
        // Demo mode - create dummy screen share
        createDummyScreenShare();
      }
    }
  };

  // Create dummy screen share
  const createDummyScreenShare = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    // Draw desktop-like background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw some windows
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(100, 100, 600, 400);
    ctx.fillRect(800, 200, 500, 300);
    ctx.fillRect(300, 600, 700, 350);
    
    // Add window titles
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Screen Sharing Demo', canvas.width / 2, 50);
    
    const stream = canvas.captureStream(30);
    setScreenShareStream(stream);
    setIsScreenSharing(true);
    
    // Auto-stop after 10 seconds
    setTimeout(() => {
      stream.getTracks().forEach(track => track.stop());
      setScreenShareStream(null);
      setIsScreenSharing(false);
    }, 10000);
  };

  // Send chat message
  const sendMessage = (content) => {
    const newMessage = {
      type: 'user',
      sender: 'You',
      content,
      timestamp: new Date(),
      isOwn: true
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Toggle chat
  const toggleChat = () => {
    if (!showChat) {
      setUnreadMessages(0);
    }
    setShowChat(!showChat);
  };

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const sampleMessages = [
          'This is a great presentation!',
          'Can you explain that slide again?',
          'I have a question about the timeline.',
          'Thanks for sharing!',
          'Looking good so far.'
        ];
        
        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        
        const newMessage = {
          type: 'user',
          sender: randomParticipant.name,
          content: randomMessage,
          timestamp: new Date(),
          isOwn: false
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        if (!showChat) {
          setUnreadMessages(prev => prev + 1);
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [showChat, participants]);

  // End call function
  const endCall = () => {
    if (window.confirm('Are you sure you want to leave the meeting?')) {
      // Cleanup and navigate away
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (screenShareStream) {
        screenShareStream.getTracks().forEach(track => track.stop());
      }
      window.location.href = '/home';
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup streams properly
      cleanupStream(localStream);
      cleanupStream(screenShareStream);
    };
  }, [localStream, screenShareStream]);

  // Show join screen first
  if (showJoinScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl mb-4">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Join Meeting</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Enter your name to join call</p>
          </div>

          {/* Join Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleJoinMeeting()}
                disabled={isConnecting}
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Meeting Details
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Code: <span className="font-mono font-medium">{meetingCode}</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Status: {isConnecting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : 'Ready to join'}
              </p>
            </div>

            {/* Permissions Check */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Camera & Microphone</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                  Will be requested
                </span>
              </div>
            </div>

            <button
              onClick={handleJoinMeeting}
              disabled={!username.trim() || isConnecting}
              className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isConnecting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : (
                'Join Meeting'
              )}
              Cancel
            </button>
          </div>

          {/* Tips */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>💡 Make sure your camera and microphone are working</p>
            <p className="mt-1">🎧 Use headphones for better audio quality</p>
          </div>
        </div>
    <div className="h-screen bg-gray-900 dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Theme Toggle for Main Interface */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
        >
          {isDark ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Video Grid */}
        <div className="flex-1">
          <VideoGrid
            participants={participants}
            localStream={localStream}
            isScreenSharing={isScreenSharing}
            screenShareStream={screenShareStream}
          />
        </div>

        {/* Chat Sidebar */}
        <ChatSidebar
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          messages={messages}
          onSendMessage={sendMessage}
          unreadCount={unreadMessages}
        />
      </div>

      {/* Control Bar */}
      <ControlBar
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        participantCount={participants.length}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onToggleChat={toggleChat}
        onEndCall={endCall}
        showChat={showChat}
        unreadMessages={unreadMessages}
      />

      {/* Hidden local video for stream management */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />
    </div>
  );
};

export default VideoCallApp;
