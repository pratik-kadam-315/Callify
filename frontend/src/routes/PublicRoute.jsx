import { Navigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../utils/storage';

const PublicRoute = ({ children, restricted = false }) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  // If route is restricted and user is authenticated, redirect to home
  if (restricted && token) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
