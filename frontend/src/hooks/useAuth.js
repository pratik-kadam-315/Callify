import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context || Object.keys(context).length === 0) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return {
    ...context,
    isAuthenticated,
    logout,
  };
};

export default useAuth;
