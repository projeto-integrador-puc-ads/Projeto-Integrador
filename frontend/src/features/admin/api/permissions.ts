import http from '@/lib/http';

export interface Permission {
  id: number;
  name: string;
  moduleId?: number;
  moduleName?: string;
  createdAt?: string;
}

export const adminPermissionsApi = {
  listar: async (): Promise<Permission[]> => {
    const { data } = await http.get<Permission[]>('/api/permissions');
    return Array.isArray(data) ? data : [];
  },
};
