import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  timeout: 15000,
});

let token: string | null = null;
export function setAuthToken(t: string | null) { token = t; }

let devUserId: number | null = null;
export function setDevUserId(id: number | null) { devUserId = id; }

http.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  if (devUserId) {
    config.headers = config.headers || {};
    (config.headers as any)['X-User-Id'] = String(devUserId);
  }
  return config;
});

export default http;