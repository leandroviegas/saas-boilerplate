import { env } from '@/lib/config';
import axios from 'axios';
import cookies from 'js-cookie';

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: false
});

api.interceptors.request.use(
  (config) => {
    const token = cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;
    let errorData = response?.data || {};

    if (!errorData.message) {
      errorData = { ...errorData, message: 'An unexpected error occurred.' };
      if (response) response.data = errorData;
    }
    return Promise.reject(error);
  }
);

export default api;