import { apiClient } from '../utils/apiClient';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },
  signup: async (userData) => {
    const response = await apiClient.post('/api/auth/signup', userData);
    return response.data;
  },
  logout: () => {
    // Add any logout API calls here if needed
  },
};
