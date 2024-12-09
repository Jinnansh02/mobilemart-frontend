import axios from 'axios';
import { store } from '../store/store';

const API_URL = 'https://mobilemart-backend-lp0r.onrender.com';
// const API_URL = 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 50000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
