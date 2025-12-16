import { useCallback, useEffect, useState } from "react";
import type { Contato, ContatoPayload } from "../service/contatosApiService";

import {
  carregarContatosDoUsuario,
  criarContato as apiCriarContato,
  atualizarContato as apiAtualizarContato,
  excluirContato as apiExcluirContato,
} from "../service/contatosApiService";

/**
 * Hook que gerencia lista de contatos + operações.
 * Uso: const { contatos, loading, refresh, create, update, remove } = useContatos();
 */
export function useContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const c = await carregarContatosDoUsuario();
      setContatos(c);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (payload: ContatoPayload) => {
    const criado = await apiCriarContato(payload as any);
    setContatos((prev) => [...prev, criado]);
    return criado;
  }, []);

  const update = useCallback(async (id: number, payload: ContatoPayload) => {
    const atualizado = await apiAtualizarContato(id, payload as any);
    setContatos((prev) => prev.map((c) => (c.id === atualizado.id ? atualizado : c)));
    return atualizado;
  }, []);

  const remove = useCallback(async (id: number) => {
    await apiExcluirContato(id);
    setContatos((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    contatos,
    loading,
    refresh,
    create,
    update,
    remove,
  };
}
