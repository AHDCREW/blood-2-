/**
 * Axios API client.
 *
 * In development: Vite proxies /api/* → FastAPI (vite.config.js).
 *   This makes calls same-origin → geolocation works on HTTP LAN.
 *   baseURL = '' (relative paths like '/api/requests/recent')
 *
 * In production: set VITE_API_URL to your HTTPS backend origin
 *   and remove the proxy block.
 */
import axios from 'axios';
import toast from 'react-hot-toast';

// Use relative base in dev (proxy handles it). In prod, VITE_API_URL points to HTTPS backend.
const baseURL = import.meta.env.VITE_API_URL || '';

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
