import apiClient from './axios.config';
import httpStatus from 'http-status';

export const authApi = {
  register: async (name, username, password) => {
    const response = await apiClient.post('/users/register', {
      name,
      username,
      password,
    });
    return response.data;
  },

  login: async (username, password) => {
    const response = await apiClient.post('/users/login', {
      username,
      password,
    });
    if (response.status === httpStatus.OK) {
      return response.data;
    }
    throw new Error('Login failed');
  },
};
