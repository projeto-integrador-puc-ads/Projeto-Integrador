import http, { setAuthToken } from './http';

interface LoginResponse {
  accessToken: string;
  userId?: number;      // Opcional por enquanto (backend ainda não retorna)
  username?: string;    // Opcional por enquanto
  role?: string;        // Opcional por enquanto
}

interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

/**
 * Login to the backend and store the JWT token
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await http.post<LoginResponse>('/api/auth/login', credentials);
    const { accessToken, userId, username, role } = response.data;
    
    // Store token in http client
    setAuthToken(accessToken);
    
    // Store token in localStorage for persistence
    localStorage.setItem('jwt_token', accessToken);
    
    // Store user info if available
    if (userId) {
      localStorage.setItem('userId', userId.toString());
      console.log(`✅ Stored userId: ${userId}`);
    }
    if (username) {
      localStorage.setItem('username', username);
      console.log(`✅ Stored username: ${username}`);
    }
    if (role) {
      localStorage.setItem('userRole', role);
      console.log(`✅ Stored role: ${role}`);
    }
    
    console.log(`✅ Login successful for ${credentials.usernameOrEmail}`);
    
    return response.data;
  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

/**
 * Logout - clear token and user data
 */
export function logout() {
  setAuthToken(null);
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('userRole');
  localStorage.removeItem('devUserId'); // Limpar variável antiga também
  console.log('� Logout complete - all data cleared');
}

/**
 * Get current user ID from localStorage
 */
export function getUserId(): number | null {
  const id = localStorage.getItem('userId');
  return id ? parseInt(id) : null;
}

/**
 * Get current user role from localStorage
 */
export function getUserRole(): string | null {
  return localStorage.getItem('userRole');
}

/**
 * Get current username from localStorage
 */
export function getUsername(): string | null {
  return localStorage.getItem('username');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('jwt_token');
}

/**
 * Restore token from localStorage on app startup (WITHOUT auto-login)
 */
export function restoreAuthToken(): string | null {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    const userId = getUserId();
    const role = getUserRole();
    console.log(`🔑 Restored session: User ${userId || 'unknown'} (${role || 'unknown'})`);
    setAuthToken(token);
    return token;
  }
  console.log('ℹ️ No saved session found');
  return null;
}

/**
 * Test user credentials for development/testing
 */
export const TEST_USERS = {
  admin: {
    email: 'admin@carehub.test',
    password: 'admin123',
    name: 'Admin CareHub',
    role: 'ADMIN'
  },
  cliente: {
    email: 'maria@example.com',
    password: '123456',
    name: 'Dona Maria',
    role: 'CLIENTE',
    id: 2
  },
  cuidador: {
    email: 'joao@example.com',
    password: '123456',
    name: 'João Cuidador',
    role: 'CUIDADOR',
    id: 3
  }
};
