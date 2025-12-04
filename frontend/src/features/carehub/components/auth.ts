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

// Normaliza uma role (string ou array) para string maiúscula ou null
export function normalizeRole(role: any): string | null {
  if (!role) return null;
  // Array de strings ou objetos
  if (Array.isArray(role)) {
    const first = role[0];
    if (!first) return null;
    if (typeof first === 'string') return first.toUpperCase();
    if (typeof first === 'object') return (first.roleName || first.name || first.code || String(first)).toString().toUpperCase();
  }
  if (typeof role === 'object') {
    // tentar extrair propriedades comuns de um objeto role
    return (role.roleName || role.name || role.code || role.authority || '').toString().toUpperCase() || null;
  }
  return String(role).toUpperCase();
}

export function isCuidador(role?: any): boolean {
  // 1) checar cache específico de cuidador
  const isCuidadorCached = localStorage.getItem('carehub_is_cuidador');
  if (isCuidadorCached === 'true') return true;
  if (isCuidadorCached === 'false') return false;

  // 2) checar explictamente o objeto user salvo
  const user = getUser();
  if (user) {
    // roles como array de strings
    if (Array.isArray(user.roles)) {
      const roles = user.roles.map((x: any) => String(x).toUpperCase());
      if (roles.some((s: string) => s.includes('CUIDADOR') || s.includes('CAREHUB_CUIDADOR'))) return true;
    }
    // permissions possivelmente presente
    if (Array.isArray(user.permissions)) {
      if (user.permissions.some((p: any) => String(p).toUpperCase().includes('CUIDADOR'))) return true;
    }
    // campos diretos
    if (user.roleName && String(user.roleName).toUpperCase().includes('CUIDADOR')) return true;
    if (user.roleCode && String(user.roleCode).toUpperCase().includes('CUIDADOR')) return true;
  }

  // 2) checar token JWT (se presente) por claims comuns
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwtToken') || localStorage.getItem('authToken');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const claims = JSON.stringify(payload).toUpperCase();
      if (claims.includes('CUIDADOR') || claims.includes('CAREHUB_CUIDADOR')) return true;
    } catch (e) {
      // ignore parse errors
    }
  }

  // 3) fallback: checar argumento role passado
  const r = normalizeRole(role ?? getUserRole());
  if (!r) return false;
  return r.includes('CUIDADOR') || r.includes('ROLE_CUIDADOR') || r.includes('CAREHUB_CUIDADOR');
}

export function isCliente(role?: any): boolean {
  // 1) checar cache específico de cliente
  const isClienteCached = localStorage.getItem('carehub_is_cliente');
  if (isClienteCached === 'true') return true;
  if (isClienteCached === 'false') return false;

  // 2) checar objeto user salvo
  const user = getUser();
  if (user) {
    if (Array.isArray(user.roles)) {
      const roles = user.roles.map((x: any) => String(x).toUpperCase());
      if (roles.some((s: string) => s.includes('CLIENTE') || s.includes('CAREHUB_CLIENTE') || s.includes('IDOSO'))) return true;
    }
    if (Array.isArray(user.permissions)) {
      if (user.permissions.some((p: any) => String(p).toUpperCase().includes('CLIENTE'))) return true;
    }
    if (user.roleName && String(user.roleName).toUpperCase().includes('CLIENTE')) return true;
  }

  const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwtToken') || localStorage.getItem('authToken');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const claims = JSON.stringify(payload).toUpperCase();
      if (claims.includes('CLIENTE') || claims.includes('CAREHUB_CLIENTE') || claims.includes('IDOSO')) return true;
    } catch (e) {
      // ignore
    }
  }

  const r = normalizeRole(role ?? getUserRole());
  if (!r) return false;
  return r.includes('CLIENTE') || r.includes('IDOSO') || r.includes('ROLE_CLIENTE') || r.includes('CAREHUB_CLIENTE');
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
        console.debug('CareHub: Token JWT inicializado no interceptor');
      });
    } else {
      console.debug('CareHub: Nenhum token encontrado no localStorage');
      console.debug('CareHub: Chaves verificadas:', ['token', 'accessToken', 'jwtToken', 'authToken']);
    }
  } catch (error) {
    console.error('CareHub: Erro ao inicializar token:', error);
  }
}

// Função para verificar se usuário é cuidador via localStorage (roleName) e cachear resultado
export async function checkAndCacheUserType() {
  const userId = getUserId();
  if (!userId) return;

  try {
    // Verificar pelo roleName no localStorage (mais confiável e sem chamadas API)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const roleName = (user.roleName || user.roleCode || '').toUpperCase();
      
      // Verificar se é cuidador
      if (roleName.includes('CUIDADOR') || roleName.includes('CAREHUB_CUIDADOR')) {
        localStorage.setItem('carehub_is_cuidador', 'true');
        localStorage.setItem('carehub_is_cliente', 'false');
        return;
      }
      
      // Verificar se é cliente/idoso
      if (roleName.includes('IDOSO') || roleName.includes('CLIENTE') || roleName.includes('FAMILIAR') || roleName.includes('CAREHUB_CLIENTE')) {
        localStorage.setItem('carehub_is_cuidador', 'false');
        localStorage.setItem('carehub_is_cliente', 'true');
        return;
      }
      
      // Role padrão (ROLE_USER) - assumir como cliente
      localStorage.setItem('carehub_is_cuidador', 'false');
      localStorage.setItem('carehub_is_cliente', 'true');
    }
  } catch {
    // Fallback: assumir como cliente
    localStorage.setItem('carehub_is_cuidador', 'false');
    localStorage.setItem('carehub_is_cliente', 'true');
  }
}

// Função utilitária para salvar token (pode ser chamada do LoginForm)
export function saveAuthToken(token: string) {
  try {
    localStorage.setItem('token', token);
    // Também inicializar no interceptor imediatamente
    import('../libHttp').then(({ setAuthToken: setToken }) => {
      setToken(token);
      console.debug('CareHub: Token salvo e inicializado');
      // Verificar tipo de usuário após salvar token
      checkAndCacheUserType();
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
      console.debug('CareHub: Token configurado manualmente no interceptor');
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

  return results;
}
