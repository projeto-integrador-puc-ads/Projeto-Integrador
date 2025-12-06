import http from '@/lib/http';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  name: string;
  roleName: string;
  roleCode: string;
  permissions: Array<{
    id: number;
    name: string;
    module_id: number | string;
  }>;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await http.post<LoginResponse>('/api/auth/login', credentials);
    console.log('Login response data:', data); // Log para depuração
    return data;
  },
}; 
