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

apiClient.interceptors.request.use(async (config) => {
  let token = getToken?.();
  if (token && typeof token.then === 'function') token = await token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function getErrorMessage(error) {
  const data = error.response?.data;
  const msg = data?.message ?? data?.detail;
  if (typeof msg === 'string') return msg;
  if (Array.isArray(msg)) return msg.map((e) => e.msg ?? e.message ?? JSON.stringify(e)).join('. ') || 'Validation error';
  if (msg && typeof msg === 'object' && !Array.isArray(msg)) return msg.message ?? msg.detail ?? JSON.stringify(msg);
  return error.message || 'Something went wrong';
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(getErrorMessage(error));
    return Promise.reject(error);
  }
);

export default apiClient;
