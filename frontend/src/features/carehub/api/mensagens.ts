import http from '../libHttp';

export interface ContatoDTO {
  id: number;
  nome: string;
  perfil: string;
  email: string;
  mensagensNaoLidas?: number; // Contador de mensagens não lidas (badge)
  ultimaMensagem?: string; // Preview da última mensagem
  dataUltimaMensagem?: string; // Data/hora da última mensagem
}

export async function contarMensagensNaoLidas(usuarioId: number): Promise<number> {
  const response = await http.get<number>('/api/carehub/mensagens/contador-nao-lidas', {
    headers: { 'X-User-Id': String(usuarioId) },
  });
  return response.data;
}

export async function listarContatos(usuarioId: number): Promise<ContatoDTO[]> {
  const response = await http.get<ContatoDTO[]>('/api/carehub/mensagens/contatos', {
    headers: { 'X-User-Id': String(usuarioId) },
  });
  return response.data;
}

export async function marcarConversaComoLida(usuarioId: number, remetenteId: number): Promise<void> {
  await http.put(`/api/carehub/mensagens/marcar-lidas/${remetenteId}`, null, {
    headers: { 'X-User-Id': String(usuarioId) },
  });
}
