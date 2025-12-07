import http from '../libHttp';

export interface AvaliacaoResponse {
  id: number;
  cuidadorId: number;
  cuidadorNome: string;
  clienteId: number;
  clienteNome: string;
  nota: number;
  comentario: string;
  dataAvaliacao: string;
  agendamentoId?: number;
}

export interface AvaliacaoRequest {
  cuidadorId: number;
  agendamentoId?: number;
  nota: number;
  comentario: string;
}

export async function listarAvaliacoesCuidador(cuidadorId: number): Promise<AvaliacaoResponse[]> {
  const response = await http.get<AvaliacaoResponse[]>(`/api/carehub/avaliacoes/cuidador/${cuidadorId}`);
  return response.data;
}

export async function criarAvaliacao(clienteId: number, avaliacao: AvaliacaoRequest): Promise<AvaliacaoResponse> {
  const response = await http.post<AvaliacaoResponse>('/api/carehub/avaliacoes', avaliacao, {
    headers: { 'X-User-Id': String(clienteId) },
  });
  return response.data;
}
