import http from './libHttp';
import type {
  CuidadorBuscarParams,
  CuidadorResponseDTO,
  ClienteResponseDTO,
  Page,
  AgendamentoRequestDTO,
  AgendamentoResponseDTO,
  ProntuarioRequestDTO,
  ProntuarioResponseDTO,
  MensagemRequestDTO,
  MensagemResponseDTO,
  AvaliacaoRequestDTO,
  AvaliacaoResponseDTO,
} from './types';

export const clientesApi = {
  listarTodos: async (): Promise<Array<{ id: number; nome: string }>> => {
    const { data } = await http.get('/api/carehub/clientes');
    return data;
  },
  buscarPorId: async (id: number): Promise<ClienteResponseDTO> => {
    const { data } = await http.get(`/api/carehub/clientes/${id}`);
    return data;
  },
};

export const cuidadoresApi = {
  listarTodos: async (): Promise<CuidadorResponseDTO[]> => {
    const { data } = await http.get('/api/carehub/cuidadores');
    return data;
  },
  buscar: async (params: CuidadorBuscarParams): Promise<Page<CuidadorResponseDTO>> => {
    const { data } = await http.get('/api/carehub/cuidadores/buscar', { params });
    return data;
  },
  porId: async (id: number): Promise<CuidadorResponseDTO> => {
    const { data } = await http.get(`/api/carehub/cuidadores/${id}`);
    return data;
  },
};

export const agendamentosApi = {
  criar: async (dto: AgendamentoRequestDTO): Promise<AgendamentoResponseDTO> => {
    const { data } = await http.post('/api/carehub/agendamentos', dto);
    return data;
  },
  atualizarStatus: async (id: number, status: string): Promise<AgendamentoResponseDTO> => {
    const { data } = await http.put(`/api/carehub/agendamentos/${id}/status`, null, { params: { status } });
    return data;
  },
  porCuidador: async (cuidadorId: number): Promise<AgendamentoResponseDTO[]> => {
    const { data } = await http.get(`/api/carehub/agendamentos/cuidador/${cuidadorId}`);
    return data;
  },
  porCliente: async (clienteId: number): Promise<AgendamentoResponseDTO[]> => {
    const { data } = await http.get(`/api/carehub/agendamentos/cliente/${clienteId}`);
    return data;
  },
  // Sistema de avaliação estilo Uber/99
  avaliacoesPendentes: async (): Promise<AgendamentoResponseDTO[]> => {
    const { data } = await http.get('/api/carehub/agendamentos/avaliacoes-pendentes');
    return data;
  },
  contarAvaliacoesPendentes: async (): Promise<{ count: number }> => {
    const { data } = await http.get('/api/carehub/agendamentos/avaliacoes-pendentes/count');
    return data;
  },
  // Notificação para cuidador: agendamentos pendentes de confirmação
  contarPendentesCuidador: async (): Promise<{ count: number }> => {
    const { data } = await http.get('/api/carehub/agendamentos/pendentes-cuidador/count');
    return data;
  },
  // Notificação para cliente: contrapropostas aguardando resposta
  contarReagendadosCliente: async (): Promise<{ count: number }> => {
    const { data } = await http.get('/api/carehub/agendamentos/reagendados-cliente/count');
    return data;
  },
};

export const prontuariosApi = {
  criar: async (dto: ProntuarioRequestDTO): Promise<ProntuarioResponseDTO> => {
    const { data } = await http.post('/api/carehub/prontuarios', dto);
    return data;
  },
  atualizar: async (id: number, dto: ProntuarioRequestDTO): Promise<ProntuarioResponseDTO> => {
    const { data } = await http.put(`/api/carehub/prontuarios/${id}`, dto);
    return data;
  },
  porId: async (id: number): Promise<ProntuarioResponseDTO> => {
    const { data } = await http.get(`/api/carehub/prontuarios/${id}`);
    return data;
  },
  porCliente: async (clienteId: number): Promise<ProntuarioResponseDTO> => {
    const { data } = await http.get(`/api/carehub/prontuarios/cliente/${clienteId}`);
    return data;
  },
};

export const mensagensApi = {
  enviar: async (remetenteId: number, dto: MensagemRequestDTO): Promise<MensagemResponseDTO> => {
    const { data } = await http.post('/api/carehub/mensagens', dto, {
      headers: { 'X-User-Id': String(remetenteId) },
    });
    return data;
  },
  uploadMedia: async (remetenteId: number, destinatarioId: number, file: File): Promise<MensagemResponseDTO> => {
    const form = new FormData();
    form.append('file', file, file.name);
    form.append('destinatarioId', String(destinatarioId));
    const { data } = await http.post('/api/carehub/mensagens/media', form, {
      // Não setar Content-Type manualmente para multipart/form-data; axios
      // define o boundary automaticamente.
      headers: { 'X-User-Id': String(remetenteId) },
    });
    return data;
  },
  conversa: async (autenticadoId: number, usuarioId: number): Promise<MensagemResponseDTO[]> => {
    const { data } = await http.get(`/api/carehub/mensagens/conversa/${usuarioId}`, {
      headers: { 'X-User-Id': String(autenticadoId) },
    });
    return data;
  },
  naoLidas: async (destinatarioId: number): Promise<MensagemResponseDTO[]> => {
    const { data } = await http.get('/api/carehub/mensagens/nao-lidas', {
      headers: { 'X-User-Id': String(destinatarioId) },
    });
    return data;
  },
  marcarComoLida: async (id: number): Promise<void> => {
    await http.put(`/api/carehub/mensagens/${id}/lida`);
  },
};

export const avaliacoesApi = {
  criar: async (clienteId: number, dto: AvaliacaoRequestDTO): Promise<AvaliacaoResponseDTO> => {
    const { data } = await http.post('/api/carehub/avaliacoes', dto, {
      headers: { 'X-User-Id': String(clienteId) },
    });
    return data;
  },
  porCuidador: async (cuidadorId: number): Promise<AvaliacaoResponseDTO[]> => {
    const { data } = await http.get(`/api/carehub/avaliacoes/cuidador/${cuidadorId}`);
    return data;
  },
  deletar: async (id: number): Promise<void> => {
    await http.delete(`/api/carehub/avaliacoes/${id}`);
  },
};
