import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  timeout: 1000000,
});

let token: string | null = null;
export function setAuthToken(t: string | null) { token = t; }

http.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default http;