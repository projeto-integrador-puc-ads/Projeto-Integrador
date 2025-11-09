import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  timeout: 15000,
});

let token: string | null = null;
export function setAuthToken(t: string | null) { token = t; }

http.interceptors.request.use((config) => {
  if (token) {
    console.log('📤 Adding Authorization header with token:', token.substring(0, 20) + '...');
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No token available for request:', config.url);
  }
  return config;
});

export default http;