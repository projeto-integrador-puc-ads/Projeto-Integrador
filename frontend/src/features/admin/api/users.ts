import http from '@/lib/http';

export interface UserRole {
  id: number;
  name: string;
  code?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role?: UserRole;
  status?: string;
  crm?: string;
  certificacao?: string;
  experiencia?: string;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  roleId?: number;
  crm?: string;
  certificacao?: string;
  experiencia?: string;
}

export interface UpdateUserPayload {
  name?: string;
  username?: string;
  email?: string;
  roleId?: number;
  crm?: string;
  certificacao?: string;
  experiencia?: string;
  password?: string;
}

function stripPassword(user: any): AdminUser {
  if (!user) return user;
  // Remove password/hash from the object to avoid exposing in UI
  const { password: _pw, ...rest } = user;
  return rest as AdminUser;
}

export const adminUsersApi = {
  listar: async (): Promise<AdminUser[]> => {
    const { data } = await http.get<AdminUser[]>('/api/users');
    return Array.isArray(data) ? data.map(stripPassword) : [];
  },
  criar: async (payload: CreateUserPayload): Promise<string> => {
    const { data } = await http.post<string>('/api/auth/signup', payload);
    return data;
  },
  porId: async (id: number): Promise<AdminUser> => {
    const { data } = await http.get<AdminUser>(`/api/users/${id}`);
    return stripPassword(data);
  },
  atualizar: async (id: number, payload: UpdateUserPayload): Promise<AdminUser> => {
    const { data } = await http.put<AdminUser>(`/api/users/${id}`, payload);
    return data;
  },
  remover: async (id: number): Promise<void> => {
    await http.delete(`/api/users/${id}`);
  },
};
