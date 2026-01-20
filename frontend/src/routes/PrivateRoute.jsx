import { Navigate, useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../utils/storage';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
