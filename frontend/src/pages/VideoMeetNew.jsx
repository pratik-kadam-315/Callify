import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import { useWebRTCFixed } from '../hooks/useWebRTCFixed';

/**
 * VideoMeet Page - Modern video conferencing interface
 * Uses the new VideoCall component with proper WebRTC management
 */
const VideoMeet = () => {
  const { meetingCode } = useParams();
  const navigate = useNavigate();
  
  // WebRTC hook for managing connections
  const { 
    localStream, 
    remoteStream, 
    isConnecting, 
    error,
    toggleMicrophone,
    toggleCamera,
    cleanup,
    initializeLocalStream
  } = useWebRTCFixed(meetingCode);

  // State for UI management
  const [isInCall, setIsInCall] = useState(false);
  const [showJoinScreen, setShowJoinScreen] = useState(true);
  const [username, setUsername] = useState('');
  const [askForUsername, setAskForUsername] = useState(true);

  /**
   * Handle joining the meeting
   */
  const handleJoinMeeting = () => {
    if (username.trim()) {
      setShowJoinScreen(false);
      setIsInCall(true);
      setAskForUsername(false);
    }
  };

  /**
   * Handle ending the call
   */
  const handleEndCall = () => {
    // Clean up WebRTC resources
    cleanup();
    
    // Navigate back to home
    navigate('/home');
  };

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Escape key to leave call
      if (e.key === 'Escape' && isInCall) {
        handleEndCall();
      }
      
      // Space bar to toggle mute when in call
      if (e.key === ' ' && isInCall) {
        e.preventDefault();
        toggleMicrophone();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isInCall, toggleMicrophone]);

  /**
   * Handle page visibility change (pause video when tab is hidden)
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && localStream) {
        // Optionally pause video when tab is not visible to save resources
        localStream.getVideoTracks().forEach(track => {
          if (track.enabled) {
            track.enabled = false; // Temporarily disable
          }
        });
      } else if (!document.hidden && localStream) {
        // Re-enable video when tab becomes visible
        localStream.getVideoTracks().forEach(track => {
          track.enabled = true;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [localStream]);

  // Show join screen if user hasn't entered username
  if (showJoinScreen && askForUsername) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl mb-4">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Join Meeting</h1>
            <p className="text-gray-600 mt-2">Enter your name to join the call</p>
          </div>

          {/* Join Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="input"
                autoFocus
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Meeting Details
              </div>
              <p className="text-xs text-gray-500">Code: <span className="font-mono font-medium">{meetingCode}</span></p>
              <p className="text-xs text-gray-500 mt-1">Status: {isConnecting ? 'Connecting...' : 'Ready to join'}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Permissions Check */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Camera & Microphone</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  localStream ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {localStream ? 'Allowed' : 'Requesting...'}
                </span>
              </div>
            </div>

            <button
              onClick={handleJoinMeeting}
              disabled={!username.trim() || isConnecting}
              className="w-full btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/home')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>💡 Make sure your camera and microphone are working</p>
            <p className="mt-1">🎧 Use headphones for better audio quality</p>
          </div>
        </div>
      </div>
    );
  }

  // Show video call interface
  return (
    <div className="h-screen">
      <VideoCall
        meetingCode={meetingCode}
        localStream={localStream}
        remoteStream={remoteStream}
        onEndCall={handleEndCall}
      />
      
      {/* Connection Status Overlay */}
      {isConnecting && (
        <div className="absolute top-4 left-4 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm">
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting to meeting...
          </span>
        </div>
      )}
      
      {/* Error Overlay */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 text-red-800 px-4 py-3 rounded-lg max-w-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Connection Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMeet;
