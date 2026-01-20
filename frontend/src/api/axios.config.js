import axios from 'axios';
import server from '../environment';

const apiClient = axios.create({
  baseURL: `${server}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // For query params (legacy API design)
      if (config.method === 'get' && config.params) {
        config.params.token = token;
      }
      // For request body (legacy API design)
      if (config.method === 'post' && config.data) {
        config.data.token = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
