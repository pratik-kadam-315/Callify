import apiClient from './axios.config';
import httpStatus from 'http-status';

export const meetingApi = {
  getHistory: async () => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get('/users/get_all_activity', {
      params: { token },
    });
    return response.data;
  },

  addToHistory: async (meetingCode) => {
    const token = localStorage.getItem('token');
    const response = await apiClient.post('/users/add_to_activity', {
      token,
      meeting_code: meetingCode,
    });
    if (response.status === httpStatus.CREATED) {
      return response.data;
    }
    throw new Error('Failed to add meeting to history');
  },
};
