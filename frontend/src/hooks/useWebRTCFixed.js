import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing WebRTC connections
 * Handles peer connections, media streams, and signaling
 */
export const useWebRTCFixed = (meetingCode) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs for WebRTC objects
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const socketRef = useRef(null);

  // WebRTC configuration
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  /**
   * Initialize local media stream (camera and microphone)
   * Only call this when explicitly requested, not on mount
   */
  const initializeLocalStream = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Get user media (camera and microphone)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      setLocalStream(stream);
      setIsConnecting(false);
      
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera or microphone. Please check permissions.');
      setIsConnecting(false);
      throw err;
    }
  }, []);

  /**
   * Create and configure peer connection
   */
  const createPeerConnection = useCallback(() => {
    try {
      const pc = new RTCPeerConnection(configuration);

      // Handle incoming remote stream
      pc.ontrack = (event) => {
        console.log('Received remote stream:', event.streams[0]);
        setRemoteStream(event.streams[0]);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          // Send ICE candidate to remote peer via signaling server
          socketRef.current.emit('ice-candidate', {
            candidate: event.candidate,
            meetingCode
          });
        }
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setError('Connection lost. Please try reconnecting.');
        }
      };

      // Add local stream tracks to peer connection
      if (localStream) {
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });
      }

      peerConnection.current = pc;
      return pc;
    } catch (err) {
      console.error('Error creating peer connection:', err);
      setError('Failed to establish connection.');
      throw err;
    }
  }, [localStream, meetingCode]);

  /**
   * Toggle microphone
   */
  const toggleMicrophone = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const isEnabled = audioTracks[0].enabled;
        audioTracks[0].enabled = !isEnabled;
        return !isEnabled;
      }
    }
    return false;
  }, [localStream]);

  /**
   * Toggle camera
   */
  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const isEnabled = videoTracks[0].enabled;
        videoTracks[0].enabled = !isEnabled;
        return !isEnabled;
      }
    }
    return false;
  }, [localStream]);

  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    // Close socket connection
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    // Reset state
    setLocalStream(null);
    setRemoteStream(null);
    setError(null);
    setIsConnecting(false);
  }, [localStream]);

  // Return functions and state
  return {
    localStream,
    remoteStream,
    isConnecting,
    error,
    toggleMicrophone,
    toggleCamera,
    cleanup,
    initializeLocalStream
  };
};
