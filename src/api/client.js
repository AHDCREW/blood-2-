import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

let getToken = () => null;

export function setAuthTokenGetter(fn) {
  getToken = fn;
}

apiClient.interceptors.request.use((config) => {
  const token = getToken?.();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.detail || error.message || 'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default apiClient;
