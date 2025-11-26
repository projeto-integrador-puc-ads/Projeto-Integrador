// Lightweight auth helpers for CareHub feature only.
// These read from localStorage and provide minimal fallback behavior so CareHub pages work
export function getUserId(): number | null {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.userId || null;
    }
  } catch (e) {
    // fallback to old keys
    const v = localStorage.getItem('userId') || localStorage.getItem('userID');
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function getUserRole(): string | null {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.roleName || user.roleCode || null;
    }
  } catch (e) {
    // fallback to old keys
    return localStorage.getItem('roles') || localStorage.getItem('userRole') || localStorage.getItem('role') || null;
  }
  return null;
}

export function getUser(): any {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
}

// Função para inicializar o token JWT no interceptor HTTP
export function initializeAuthToken() {
  try {
    // Tentar múltiplas chaves onde o token pode estar salvo
    const token = localStorage.getItem('token') ||
                  localStorage.getItem('accessToken') ||
                  localStorage.getItem('jwtToken') ||
                  localStorage.getItem('authToken');

    if (token) {
      // Importar dinamicamente para evitar dependências circulares
      import('../libHttp').then(({ setAuthToken }) => {
        setAuthToken(token);
        console.log('CareHub: Token JWT inicializado no interceptor:', token.substring(0, 20) + '...');
      });
    } else {
      console.log('CareHub: Nenhum token encontrado no localStorage');
      console.log('CareHub: Chaves verificadas:', ['token', 'accessToken', 'jwtToken', 'authToken']);
    }
  } catch (error) {
    console.error('CareHub: Erro ao inicializar token:', error);
  }
}

// Função utilitária para salvar token (pode ser chamada do LoginForm)
export function saveAuthToken(token: string) {
  try {
    localStorage.setItem('token', token);
    // Também inicializar no interceptor imediatamente
    import('../libHttp').then(({ setAuthToken: setToken }) => {
      setToken(token);
      console.log('CareHub: Token salvo e inicializado');
    });
  } catch (error) {
    console.error('CareHub: Erro ao salvar token:', error);
  }
}

// Função para configurar token manualmente (para debug)
export function setTokenManually(token: string) {
  try {
    import('../libHttp').then(({ setAuthToken }) => {
      setAuthToken(token);
      console.log('CareHub: Token configurado manualmente no interceptor');
    });
  } catch (error) {
    console.error('CareHub: Erro ao configurar token manualmente:', error);
  }
}

// Função para verificar todas as chaves de autenticação no localStorage
export function debugAuthStorage() {
  const keys = ['token', 'accessToken', 'jwtToken', 'authToken', 'user', 'userId', 'roles', 'userRole'];
  const results: { [key: string]: any } = {};

  keys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      if (key === 'user') {
        try {
          results[key] = JSON.parse(value);
        } catch {
          results[key] = value;
        }
      } else {
        results[key] = value.length > 50 ? value.substring(0, 50) + '...' : value;
      }
    } else {
      results[key] = null;
    }
  });

  console.log('CareHub Debug - localStorage auth keys:', results);
  return results;
}
