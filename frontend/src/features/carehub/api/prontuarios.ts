import http from '../libHttp';

export interface ProntuarioResponse {
  id: number;
  clienteId: number;
  clienteNome: string;
  tipoSanguineo?: string;
  alergias?: string;
  medicamentosUso?: string;
  condicoesPreexistentes?: string;
  observacoes?: string;
  dataAtualizacao: string;
}

export async function verificarPodeEditar(clienteId: number, cuidadorId: number): Promise<boolean> {
  try {
    const response = await http.get<boolean>(`/api/carehub/prontuarios/pode-editar/${clienteId}`, {
      headers: { 'X-User-Id': String(cuidadorId) },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar permissão de edição:', error);
    return false;
  }
}

export async function buscarProntuarioPorCliente(clienteId: number): Promise<ProntuarioResponse> {
  const response = await http.get<ProntuarioResponse>(`/api/carehub/prontuarios/cliente/${clienteId}`);
  return response.data;
}
