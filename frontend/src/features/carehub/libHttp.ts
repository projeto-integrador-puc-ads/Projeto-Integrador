// Local shim for http client to avoid global dependencies
import axios from 'axios';

const http = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '',
  timeout: 15000,
});

let token: string | null = null;
export function setAuthToken(t: string | null) { token = t; }

http.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
    console.log('CareHub: Enviando token na requisição:', config.url, 'Token:', token.substring(0, 20) + '...');
  } else {
    console.log('CareHub: Nenhum token disponível para requisição:', config.url);
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('CareHub: Erro 401 detectado:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        token: token ? token.substring(0, 20) + '...' : 'Nenhum token',
        response: error.response?.data
      });
    }
    return Promise.reject(error);
  }
);

export default http;
