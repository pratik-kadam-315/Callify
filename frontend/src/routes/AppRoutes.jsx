import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/Landing';
import Authentication from '../pages/Authentication';
import Home from '../pages/Home';
import MeetingHistory from '../pages/MeetingHistory';
import VideoMeet from '../pages/VideoMeetNew';
import VideoCallDemo from '../pages/VideoCallDemo';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRoutes = () => {
  console.log('AppRoutes rendering');
  
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <PublicRoute restricted>
            <Authentication />
          </PublicRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/meet/:meetingCode"
        element={
          <PrivateRoute>
            <VideoMeet />
          </PrivateRoute>
        }
      />
      <Route
        path="/demo"
        element={
          <PrivateRoute>
            <VideoCallDemo />
          </PrivateRoute>
        }
      />
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <MeetingHistory />
          </PrivateRoute>
        }
      />
      <Route
        path="/:meetingCode"
        element={<VideoMeet />}
      />
    </Routes>
  );
};

export default AppRoutes;
