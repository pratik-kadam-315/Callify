import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing WebRTC connections
 * Handles peer connections, media streams, and signaling
 */
export const useWebRTC = (meetingCode) => {
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
   * Create and send offer
   */
  const createOffer = useCallback(async () => {
    try {
      const pc = peerConnection.current || createPeerConnection();
      
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to signaling server
      if (socketRef.current) {
        socketRef.current.emit('offer', {
          offer,
          meetingCode
        });
      }

      console.log('Offer created and sent');
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Failed to create connection offer.');
    }
  }, [createPeerConnection, meetingCode]);

  /**
   * Handle incoming offer and create answer
   */
  const handleOffer = useCallback(async (offer) => {
    try {
      const pc = peerConnection.current || createPeerConnection();
      
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer to signaling server
      if (socketRef.current) {
        socketRef.current.emit('answer', {
          answer,
          meetingCode
        });
      }

      console.log('Answer created and sent');
    } catch (err) {
      console.error('Error handling offer:', err);
      setError('Failed to handle incoming call.');
    }
  }, [createPeerConnection, meetingCode]);

  /**
   * Handle incoming answer
   */
  const handleAnswer = useCallback(async (answer) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('Answer received and set');
      }
    } catch (err) {
      console.error('Error handling answer:', err);
      setError('Failed to establish connection.');
    }
  }, []);

  /**
   * Handle incoming ICE candidates
   */
  const handleIceCandidate = useCallback(async (candidate) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('ICE candidate added');
      }
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  }, []);

  /**
   * Initialize WebRTC connection
   */
  const initializeConnection = useCallback(async () => {
    try {
      // Initialize local stream first
      await initializeLocalStream();
      
      // Set up socket connection (this would connect to your signaling server)
      // For now, we'll simulate the connection
      console.log('Initializing WebRTC connection for meeting:', meetingCode);
      
      // In a real implementation, you would:
      // 1. Connect to WebSocket server
      // 2. Join meeting room
      // 3. Handle signaling events
      // 4. Create offer or wait for offer
      
      // For demo purposes, we'll just create the peer connection
      createPeerConnection();
      
    } catch (err) {
      console.error('Error initializing connection:', err);
    }
  }, [initializeLocalStream, createPeerConnection, meetingCode]);

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
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate
  };
};
