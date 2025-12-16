import http from "@/lib/http";

export interface CreateContatoPayload {
  usuarioId: number;
  nome: string;
  telefone: string;
  relacao?: string;
}

export interface UpdateContatoPayload {
  usuarioId: number;
  nome: string;
  telefone: string;
  relacao?: string;
}

export interface ContatoEmergencia {
  id: number;
  nome: string;
  telefone: string;
  relacao?: string;
  usuarioId: number;
}

export const contatosEmergenciaApi = {
  listarPorUsuario: async (usuarioId: number) => {
    const { data } = await http.get<ContatoEmergencia[]>(
      `/contatos-emergencia/${usuarioId}`
    );
    return data;
  },

  criar: async (payload: CreateContatoPayload) => {
    const { data } = await http.post<ContatoEmergencia>(
      `/contatos-emergencia`,
      payload
    );
    return data;
  },

  atualizar: async (id: number, payload: UpdateContatoPayload) => {
    const { data } = await http.put<ContatoEmergencia>(
      `/contatos-emergencia/${id}`,
      payload
    );
    return data;
  },

  excluir: async (id: number) => {
    await http.delete(`/contatos-emergencia/${id}`);
  },
};
