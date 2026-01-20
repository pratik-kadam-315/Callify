import React, { useState, useRef, useEffect } from 'react';

/**
 * VideoGrid Component - Displays participant videos in a responsive grid
 * Supports up to 9 participants with dynamic layout
 */
const VideoGrid = ({ participants, localStream, isScreenSharing, screenShareStream }) => {
  const videoRefs = useRef({});
  const [dominantSpeaker, setDominantSpeaker] = useState(null);

  // Attach streams to video elements
  useEffect(() => {
    console.log('🎥 VideoGrid useEffect triggered');
    console.log('📹 Participants:', participants);
    console.log('📹 Local stream:', localStream);
    console.log('📹 Screen share stream:', screenShareStream);
    
    // Only attach streams if they exist and video elements are ready
    participants.forEach(participant => {
      const videoElement = videoRefs.current[participant.id];
      if (videoElement && participant.stream) {
        console.log('🎥 Attaching participant stream:', participant.id, participant.stream);
        videoElement.srcObject = participant.stream;
      } else {
        console.log('⚠️ No stream for participant:', participant.id);
      }
    });

    // Handle local video
    const localVideoElement = videoRefs.current['local'];
    if (localVideoElement && localStream) {
      console.log('🎥 Attaching local stream to video element');
      localVideoElement.srcObject = localStream;
    } else {
      console.log('⚠️ No local stream available');
    }

    // Handle screen share
    const screenShareElement = videoRefs.current['screen-share'];
    if (screenShareElement && screenShareStream) {
      console.log('🎥 Attaching screen share stream');
      screenShareElement.srcObject = screenShareStream;
    } else {
      console.log('⚠️ No screen share stream available');
    }
  }, [participants, localStream, screenShareStream]);

  // Determine grid layout based on participant count
  const getGridClass = () => {
    const count = participants.length + 1; // +1 for local user
    
    if (isScreenSharing) return 'grid-cols-1';
    if (count <= 1) return 'grid-cols-1';
    if (count <= 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    return 'grid-cols-3';
  };

  // Get video container size based on participant count
  const getVideoContainerClass = () => {
    const count = participants.length + 1;
    
    if (isScreenSharing) return 'aspect-video';
    if (count <= 2) return 'aspect-video';
    if (count <= 4) return 'aspect-video';
    return 'aspect-square';
  };

  return (
    <div className="flex-1 bg-gray-900 relative overflow-hidden">
      {/* Screen Share View */}
      {isScreenSharing && (
        <div className="h-full flex items-center justify-center">
          <div className="relative w-full max-w-6xl mx-auto">
            <video
              ref={el => videoRefs.current['screen-share'] = el}
              autoPlay
              playsInline
              muted={false}
              className="w-full h-full bg-black rounded-lg shadow-2xl"
            />
            
            {/* Screen Share Overlay */}
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Sharing Screen
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {!isScreenSharing && (
        <div className={`h-full p-4 grid ${getGridClass()} gap-4 content-center`}>
          {/* Local Video */}
          <div className={`relative ${getVideoContainerClass()} bg-gray-800 rounded-lg overflow-hidden shadow-lg group`}>
            {localStream ? (
              <video
                ref={el => videoRefs.current['local'] = el}
                autoPlay
                playsInline
                muted={true}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-sm">Camera Off</p>
                  <p className="text-gray-400 text-xs mt-1">Click to enable camera</p>
                </div>
              </div>
            )}
            
            {/* Video Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">You</p>
                  <p className="text-gray-300 text-sm">Host</p>
                </div>
                <div className="flex items-center gap-2">
                  {localStream?.getAudioTracks()?.[0]?.enabled ? (
                    <div className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 100-2h8a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-red-600/50 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 011.707.707l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414zm2.12-10.607a1 1 0 010 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414zm2.829 2.828a1 1 0 010 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414zm2.829 2.828a1 1 0 010 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414zm2.829 2.828a1 1 0 010 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414zm2.829 2.828a1 1 0 010 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {localStream?.getVideoTracks()?.[0]?.enabled ? (
                    <div className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 11-6 0V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 001.414 1.414l-2 1A1 1 0 00-1.414-1.414z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-red-600/50 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414zm2.12-10.607a1 1 0 010 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414zm2.829 2.828a1 1 0 010 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414zm2.829 2.828a1 1 0 010 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414zm2.829 2.828a1 1 0 010 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414zm2.829 2.828a1 1 0 010 1.414l14 14a1 1 0 001.414 1.414l-14 14a1 1 0 01-1.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hover Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-gray-700/80 text-white p-2 rounded-lg hover:bg-gray-600/80">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Participant Videos */}
          {participants.map((participant) => (
            <div 
              key={participant.id} 
              className={`relative ${getVideoContainerClass()} bg-gray-800 rounded-lg overflow-hidden shadow-lg group`}
            >
              {participant.stream ? (
                <video
                  ref={el => videoRefs.current[participant.id] = el}
                  autoPlay
                  playsInline
                  muted={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-gray-400">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">No video</p>
                  </div>
                </div>
              )}

              {/* Participant Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{participant.name}</p>
                    <p className="text-gray-300 text-sm">{participant.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {participant.isMuted ? (
                      <div className="w-8 h-8 bg-red-600/50 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {!participant.hasVideo && (
                      <div className="w-8 h-8 bg-red-600/50 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dominant Speaker Indicator */}
              {dominantSpeaker === participant.id && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Speaking
                </div>
              )}
            </div>
          ))}

          {/* Empty Slots for Grid Layout */}
          {Array.from({ length: Math.max(0, 9 - participants.length - 1) }).map((_, index) => (
            <div key={`empty-${index}`} className={`${getVideoContainerClass()} bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center`}>
              <p className="text-gray-600 text-sm">Empty Slot</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
