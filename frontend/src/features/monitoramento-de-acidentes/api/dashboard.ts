import http from '@/lib/http';

export interface AcidenteLocalizacao {
  latitude: number;
  longitude: number;
  tipo?: string;
  timestamp?: string;
}

export interface AcidentesPorTipo {
  tipo: string;
  quantidade: number;
}

export const dashboardApi = {
  totalRegistros: async (userId?: number): Promise<number> => {
    const url = userId
      ? `/api/registros-acidentes/total-registros?userId=${userId}`
      : '/api/registros-acidentes/total-registros';
    const { data } = await http.get<number>(url);
    return data;
  },

  acidentesHoje: async (userId?: number): Promise<number> => {
    const url = userId
      ? `/api/registros-acidentes/acidentes-hoje?userId=${userId}`
      : '/api/registros-acidentes/acidentes-hoje';
    const { data } = await http.get<number>(url);
    return data;
  },


  acidentesLocalizacao: async (userId?: number): Promise<AcidenteLocalizacao[]> => {
    const url = userId
      ? `/api/registros-acidentes/localizacao?userId=${userId}`
      : '/api/registros-acidentes/localizacao';
    const { data } = await http.get<AcidenteLocalizacao[]>(url);
    return Array.isArray(data) ? data : [];
  },

  acidentesPorHorario: async (userId?: string): Promise<number[]> => {
    const url = userId
      ? `/api/registros-acidentes/por-horario?userId=${userId}`
      : '/api/registros-acidentes/por-horario';
    const { data } = await http.get<number[]>(url);
    return data;
  },

  acidentesPorTipo: async (userId?: number): Promise<AcidentesPorTipo[]> => {
    const url = userId
      ? `/api/registros-acidentes/por-tipo?userId=${userId}`
      : '/api/registros-acidentes/por-tipo';
    const { data } = await http.get<AcidentesPorTipo[]>(url);
    return Array.isArray(data) ? data : [];
  },

  acidentesHeatmap: async (userId?: number): Promise<number[][]> => {
    const url = userId
      ? `/api/registros-acidentes/heatmap?userId=${userId}`
      : '/api/registros-acidentes/heatmap';
    const { data } = await http.get<number[][]>(url);
    return data;
  },
};
