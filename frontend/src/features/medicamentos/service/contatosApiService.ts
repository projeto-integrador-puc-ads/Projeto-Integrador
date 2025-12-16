// src/features/service/contatosApiService.ts
import { contatosEmergenciaApi } from "../api/contatosEmergenciaApi";
import { getUsuarioId } from "../utils/session";

export interface Contato {
  id: number;
  nome: string;
  telefone: string;
  relacao?: string;
  usuarioId: number;
}

export interface ContatoPayload {
  nome: string;
  telefone: string;
  relacao?: string;
}

/**
 * LISTAR CONTATOS DO USUÁRIO LOGADO
 */
export async function carregarContatosDoUsuario(): Promise<Contato[]> {
  const usuarioId = getUsuarioId();
  if (!usuarioId) return [];
  return contatosEmergenciaApi.listarPorUsuario(usuarioId);
}

/**
 * CRIAR CONTATO
 */
export async function criarContato(payload: ContatoPayload): Promise<Contato> {
  const usuarioId = getUsuarioId();
  if (!usuarioId) throw new Error("Usuário não identificado.");
  return contatosEmergenciaApi.criar({ usuarioId, ...payload });
}

/**
 * ATUALIZAR CONTATO
 * (⚠️ não envia usuarioId — backend não aceita)
 */
export async function atualizarContato(id: number, payload: ContatoPayload): Promise<Contato> {
  return contatosEmergenciaApi.atualizar(id, payload);
}

/**
 * EXCLUIR CONTATO
 */
export async function excluirContato(id: number): Promise<void> {
  return contatosEmergenciaApi.excluir(id);
}
