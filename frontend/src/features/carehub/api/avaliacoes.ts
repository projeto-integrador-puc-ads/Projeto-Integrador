import http from '@/lib/http';

export interface AvaliacaoResponse {
  id: number;
  cuidadorId: number;
  cuidadorNome: string;
  clienteId: number;
  clienteNome: string;
  nota: number;
  comentario: string;
  dataAvaliacao: string;
}

export interface AvaliacaoRequest {
  cuidadorId: number;
  nota: number;
  comentario: string;
}

export async function verificarPodeAvaliar(clienteId: number, cuidadorId: number): Promise<boolean> {
  try {
    const response = await http.get<boolean>(`/api/carehub/avaliacoes/pode-avaliar/${cuidadorId}`, {
      headers: { 'X-User-Id': clienteId },
    });
    return response.data;
  } catch {
    return false;
  }
}

export async function listarAvaliacoesCuidador(cuidadorId: number): Promise<AvaliacaoResponse[]> {
  const response = await http.get<AvaliacaoResponse[]>(`/api/carehub/avaliacoes/cuidador/${cuidadorId}`);
  return response.data;
}

export async function criarAvaliacao(clienteId: number, avaliacao: AvaliacaoRequest): Promise<AvaliacaoResponse> {
  const response = await http.post<AvaliacaoResponse>('/api/carehub/avaliacoes', avaliacao, {
    headers: { 'X-User-Id': clienteId },
  });
  return response.data;
}
