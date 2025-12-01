// Local shim for http client to avoid global dependencies
import axios from 'axios';

const http = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '',
  timeout: 15000,
});

let token: string | null = null;
let devUserId: number | string | null = null; // usado em desenvolvimento para simular usuário
export function setAuthToken(t: string | null) { token = t; }
export function setDevUserId(id: number | string | null) { devUserId = id; }

// Auto-inicializa token a partir do localStorage para garantir que o
// interceptor envie o Authorization mesmo quando a página atual não
// executar explicitamente `initializeAuthToken()`.
try {
  const stored = typeof localStorage !== 'undefined' ? (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('jwtToken') ||
    localStorage.getItem('authToken') ||
    // fallback: some flows store a `user` object with accessToken inside
    (function() {
      try {
        const u = localStorage.getItem('user');
        if (!u) return null;
        const parsed = JSON.parse(u);
        return parsed?.accessToken || parsed?.token || parsed?.access_token || null;
      } catch (e) {
        return null;
      }
    })() || null
  ) : null;
  if (stored) {
    token = stored;
    // Não logar o token por segurança; apenas confirmar existência em debug
    console.debug('CareHub: token presente no localStorage e carregado no cliente HTTP');
  }
} catch (e) {
  // Ignora em ambientes sem localStorage
}

http.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
    // Indica que Authorization foi adicionado sem expor o token em logs
    console.debug('CareHub: Authorization header set for', config.url);
  } else {
    console.debug('CareHub: Nenhum token disponível para requisição:', config.url);
  }
  // Adiciona X-User-Id automaticamente quando definido (modo dev)
  if (devUserId) {
    config.headers = config.headers || {};
    // Não sobrescreve se já foi especificado manualmente
    if (!(config.headers as any)['X-User-Id']) {
      (config.headers as any)['X-User-Id'] = String(devUserId);
      console.debug('CareHub: Injetando X-User-Id (dev) na requisição', config.url);
    }
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // Log mais informativo para debug
    if (status === 401) {
      console.error('CareHub: Erro 401 detectado:', {
        url,
        method: error.config?.method,
        headers: error.config?.headers,
        response: error.response?.data
      });
    } else {
      console.warn('CareHub: Erro na requisição:', { url, status, data: error.response?.data });
    }

    // Normaliza mensagem de erro para o frontend
    const payload = error.response?.data;
    const message =
      (payload && (payload.message || payload.error || payload.msg)) ||
      (payload && typeof payload === 'string' ? payload : null) ||
      error.message ||
      'Erro desconhecido';

    const normalized = {
      status: status || 0,
      message,
      original: error,
      data: payload,
    };

    return Promise.reject(normalized);
  }
);

export default http;
