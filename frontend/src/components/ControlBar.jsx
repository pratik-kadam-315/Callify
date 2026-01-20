import React, { useState, useRef, useEffect } from 'react';

/**
 * ControlBar Component - Video call controls with modern UI
 * Includes mute, camera, screen share, chat, and end call controls
 */
const ControlBar = ({ 
  isMuted, 
  isVideoOff, 
  isScreenSharing, 
  participantCount,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onEndCall,
  showChat,
  unreadMessages = 0
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Control button component
  const ControlButton = ({ 
    onClick, 
    isActive = false, 
    isDanger = false, 
    icon, 
    activeIcon, 
    label, 
    badge = null 
  }) => (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3
        ${isDanger 
          ? 'bg-red-600 hover:bg-red-700 text-white' 
          : isActive 
            ? 'bg-gray-700 text-white' 
            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
        }
        hover:scale-105 active:scale-95
      `}
    >
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
      {isActive && activeIcon ? activeIcon : icon}
      <span className="hidden sm:inline text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {/* Mute/Unmute */}
          <ControlButton
            onClick={onToggleMute}
            isActive={isMuted}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            }
            activeIcon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            }
            label={isMuted ? 'Unmute' : 'Mute'}
          />

          {/* Camera On/Off */}
          <ControlButton
            onClick={onToggleVideo}
            isActive={isVideoOff}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            }
            activeIcon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            }
            label={isVideoOff ? 'Start Video' : 'Stop Video'}
          />

          {/* Screen Share */}
          <ControlButton
            onClick={onToggleScreenShare}
            isActive={isScreenSharing}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" />
                <path d="M7 8h6v4H7V8z" />
              </svg>
            }
            activeIcon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd" />
                <path d="M8 8h4v4H8V8z" />
              </svg>
            }
            label={isScreenSharing ? 'Stop Share' : 'Share Screen'}
          />
        </div>

        {/* Center Info */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Meeting ID</p>
            <p className="text-white font-mono text-sm">123-456-789</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Duration</p>
            <p className="text-white font-mono text-sm">00:12:34</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Participants */}
          <ControlButton
            onClick={() => setShowParticipants(!showParticipants)}
            isActive={showParticipants}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            }
            label="Participants"
            badge={participantCount}
          />

          {/* Chat */}
          <ControlButton
            onClick={onToggleChat}
            isActive={showChat}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
            }
            label="Chat"
            badge={unreadMessages > 0 ? unreadMessages : null}
          />

          {/* Fullscreen */}
          <ControlButton
            onClick={toggleFullscreen}
            isActive={isFullscreen}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8V4m0 0h4M3 4l4 4m10 0V4m0 0h-4m4 0l-4 4m-6 4v4m0 0h4m-4 0l4-4m6 4l-4-4m4 4v-4m0 4h-4" />
              </svg>
            }
            activeIcon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 3H4m0 0v4m0-4l4 4m4-4h4m0 0v4m0-4l-4 4m-6 8v4m0 0h4m-4 0l4-4m6 4l-4-4m4 4v-4m0 4h-4" />
              </svg>
            }
            label="Fullscreen"
          />

          {/* End Call */}
          <ControlButton
            onClick={onEndCall}
            isDanger={true}
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            }
            label="Leave"
          />
        </div>
      </div>

      {/* Participants Panel (Overlay) */}
      {showParticipants && (
        <div className="absolute top-0 left-0 w-80 h-full bg-gray-900 border-r border-gray-800 z-20">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Participants ({participantCount + 1})</h3>
              <button
                onClick={() => setShowParticipants(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto h-full pb-20">
            {/* Host */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">Y</span>
                </div>
                <div>
                  <p className="text-white font-medium">You (Host)</p>
                  <p className="text-gray-400 text-sm">In meeting</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Other participants would be mapped here */}
            {Array.from({ length: participantCount }).map((_, index) => (
              <div key={index} className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">P{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Participant {index + 1}</p>
                    <p className="text-gray-400 text-sm">In meeting</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlBar;
