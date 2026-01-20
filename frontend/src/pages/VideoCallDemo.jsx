import React from 'react';
import VideoCallApp from '../components/VideoCallApp';

/**
 * VideoCallDemo Page - Demo page for the video call interface
 * This page showcases the complete video call application
 */
const VideoCallDemo = () => {
  return (
    <div className="h-screen">
      <VideoCallApp meetingCode="DEMO-123-456" />
    </div>
  );
};

export default VideoCallDemo;
