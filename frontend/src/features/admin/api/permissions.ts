import http from '@/lib/http';

export interface Permission {
  id: number;
  name: string;
  moduleId?: number;
  moduleName?: string;
  createdAt?: string;
}

export interface PermissionPayload {
  name: string;
  moduleId?: number | null;
}

export interface ModuleItem {
  id: number;
  name: string;
}

export const adminPermissionsApi = {
  listar: async (): Promise<Permission[]> => {
    const { data } = await http.get<Permission[]>('/api/permissions');
    return Array.isArray(data) ? data : [];
  },
  listarModulos: async (): Promise<ModuleItem[]> => {
    const { data } = await http.get<ModuleItem[]>('/api/modules');
    return Array.isArray(data) ? data : [];
  },
  criar: async (payload: PermissionPayload): Promise<Permission> => {
    const { data } = await http.post<Permission>('/api/permissions', payload);
    return data;
  },
  atualizar: async (id: number, payload: PermissionPayload): Promise<Permission> => {
    const { data } = await http.put<Permission>(`/api/permissions/${id}`, payload);
    return data;
  },
  remover: async (id: number): Promise<void> => {
    await http.delete(`/api/permissions/${id}`);
  },
};
