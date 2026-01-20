import React, { useState, useEffect, useRef } from 'react';

/**
 * VideoCall Component - A modern video conferencing interface
 * Features: Video display, chat toggle, responsive design, proper media stream handling
 */
const VideoCall = ({ meetingCode, localStream, remoteStream, onEndCall }) => {
  // State management
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Refs for DOM elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatContainerRef = useRef(null);

  /**
   * Effect: Handle media streams
   * Attaches streams to video elements when they become available
   */
  useEffect(() => {
    // Attach local stream to local video element
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }

    // Attach remote stream to remote video element
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }

    // Cleanup function
    return () => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, [localStream, remoteStream]);

  /**
   * Effect: Auto-scroll chat to bottom when new messages arrive
   */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  /**
   * Toggle microphone mute state
   */
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  /**
   * Toggle video camera state
   */
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  /**
   * Toggle chat panel
   */
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  /**
   * Send chat message
   */
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  /**
   * Handle screen sharing toggle
   */
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        // Replace video track with screen share track
        if (localStream) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = localStream.getVideoTracks()[0];
          // This would typically be handled by WebRTC peer connection
          console.log('Screen sharing started');
        }
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing and revert to camera
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <div className="relative w-full h-full bg-black">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              muted={false}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                <p className="text-xl">Waiting for others to join...</p>
                <p className="text-sm text-gray-400 mt-2">Meeting Code: {meetingCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {localStream && !isVideoOff ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted={true} // Always mute local video to avoid echo
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs mt-2">Camera Off</p>
              </div>
            </div>
          )}
        </div>

        {/* Meeting Info Overlay */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
          <p className="text-sm font-medium">Meeting: {meetingCode}</p>
          <p className="text-xs text-gray-300">
            {remoteStream ? '1 participant' : 'Waiting...'}
          </p>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className={`transition-all duration-300 ${isChatOpen ? 'w-80' : 'w-0'} bg-gray-800 border-l border-gray-700 overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Chat</h3>
          </div>

          {/* Chat Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No messages yet</p>
                <p className="text-sm mt-2">Start a conversation!</p>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div key={message.id} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-blue-400">{message.sender}</span>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                  <p className="text-white text-sm">{message.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Microphone Toggle */}
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-colors ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoOff 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isVideoOff ? 'Start Video' : 'Stop Video'}
          >
            {isVideoOff ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            )}
          </button>

          {/* Screen Share Toggle */}
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition-colors ${
              isScreenSharing 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </button>

          {/* Chat Toggle */}
          <button
            onClick={toggleChat}
            className={`p-3 rounded-full transition-colors ${
              isChatOpen 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isChatOpen ? 'Close Chat' : 'Open Chat'}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            title="End Call"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
              <path fillRule="evenodd" d="M2 8h16v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8zm3 2a1 1 0 000 2h.01a1 1 0 100-2H5zm3 0a1 1 0 000 2h3a1 1 0 100-2H8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
