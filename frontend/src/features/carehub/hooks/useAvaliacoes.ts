import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listarAvaliacoesCuidador, criarAvaliacao } from '../api/avaliacoes';
import type { AvaliacaoRequest } from '../api/avaliacoes';

export function useAvaliacoesCuidador(cuidadorId: number) {
  return useQuery({
    queryKey: ['avaliacoes', cuidadorId],
    queryFn: () => listarAvaliacoesCuidador(cuidadorId),
    staleTime: 5 * 60 * 1000, // 5 minutos - avaliações mudam pouco
    gcTime: 10 * 60 * 1000, // 10 minutos - mantém cache
  });
}

export function useCriarAvaliacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clienteId, avaliacao }: { clienteId: number; avaliacao: AvaliacaoRequest }) =>
      criarAvaliacao(clienteId, avaliacao),
    onSuccess: (_, variables) => {
      // Invalidar cache das avaliações do cuidador
      queryClient.invalidateQueries({ 
        queryKey: ['avaliacoes', variables.avaliacao.cuidadorId] 
      });
    },
  });
}
