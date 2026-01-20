import { useState, useRef, useEffect, useCallback } from 'react';

const useMediaStream = (initialVideo = true, initialAudio = true) => {
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [videoEnabled, setVideoEnabled] = useState(initialVideo);
  const [audioEnabled, setAudioEnabled] = useState(initialAudio);
  const [screenSharing, setScreenSharing] = useState(false);
  const [permissions, setPermissions] = useState({
    video: false,
    audio: false,
    screen: false,
  });

  const requestPermissions = useCallback(async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setPermissions({
        video: !!videoPermission,
        audio: !!audioPermission,
        screen: !!navigator.mediaDevices.getDisplayMedia,
      });
    } catch (error) {
      console.error('Permission error:', error);
    }
  }, []);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  const getUserMedia = useCallback(async (video, audio) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = { video: video && permissions.video, audio: audio && permissions.audio };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      streamRef.current = stream;
      window.localStream = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('getUserMedia error:', error);
      throw error;
    }
  }, [permissions]);

  const getDisplayMedia = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      streamRef.current = stream;
      window.localStream = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach(track => {
        track.onended = () => {
          setScreenSharing(false);
          getUserMedia(videoEnabled, audioEnabled);
        };
      });

      return stream;
    } catch (error) {
      console.error('getDisplayMedia error:', error);
      throw error;
    }
  }, [videoEnabled, audioEnabled, getUserMedia]);

  const toggleVideo = useCallback(() => {
    const newValue = !videoEnabled;
    setVideoEnabled(newValue);
    if (newValue) {
      getUserMedia(true, audioEnabled);
    } else {
      const tracks = streamRef.current?.getVideoTracks() || [];
      tracks.forEach(track => track.stop());
    }
  }, [videoEnabled, audioEnabled, getUserMedia]);

  const toggleAudio = useCallback(() => {
    const newValue = !audioEnabled;
    setAudioEnabled(newValue);
    const tracks = streamRef.current?.getAudioTracks() || [];
    tracks.forEach(track => (track.enabled = newValue));
  }, [audioEnabled]);

  const toggleScreenShare = useCallback(() => {
    const newValue = !screenSharing;
    setScreenSharing(newValue);
    if (newValue) {
      getDisplayMedia();
    } else {
      getUserMedia(videoEnabled, audioEnabled);
    }
  }, [screenSharing, videoEnabled, audioEnabled, getDisplayMedia, getUserMedia]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, []);

  return {
    localVideoRef,
    streamRef,
    videoEnabled,
    audioEnabled,
    screenSharing,
    permissions,
    getUserMedia,
    getDisplayMedia,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    stopStream,
  };
};

export default useMediaStream;
