import http from '@/lib/http';
import type { UsuarioDTO, TipoUsuario } from '@/shared/types/usuario';

const base = '/api/usuarios';

export const usuariosApi = {
  listar: async (): Promise<UsuarioDTO[]> => {
    const { data } = await http.get(base); // GET /api/usuarios
    return data;
  },
  criar: async (payload: Omit<UsuarioDTO, 'id'>): Promise<UsuarioDTO> => {
    const { data } = await http.post(base, payload); // POST /api/usuarios
    return data;
  },
  porId: async (id: number): Promise<UsuarioDTO> => {
    const { data } = await http.get(`${base}/${id}`); // GET /api/usuarios/{id}
    return data;
  },
  porEmail: async (email: string): Promise<UsuarioDTO> => {
    const { data } = await http.get(`${base}/email/${encodeURIComponent(email)}`); // GET /email/{email}
    return data;
  },
  porTipo: async (tipo: TipoUsuario): Promise<UsuarioDTO[]> => {
    const { data } = await http.get(`${base}/tipo/${tipo}`); // GET /tipo/{TIPO}
    return data;
  },
  ativos: async (): Promise<UsuarioDTO[]> => {
    const { data } = await http.get(`${base}/ativos`); // GET /ativos
    return data;
  },
  atualizar: async (id: number, dto: UsuarioDTO): Promise<UsuarioDTO> => {
    const { data } = await http.put(`${base}/${id}`, dto); // PUT /{id}
    return data;
  },
  desativar: async (id: number): Promise<void> => {
    await http.patch(`${base}/${id}/desativar`); // PATCH /{id}/desativar
  },
  remover: async (id: number): Promise<void> => {
    await http.delete(`${base}/${id}`); // DELETE /{id}
  },
};
