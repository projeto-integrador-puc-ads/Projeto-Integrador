import { useQuery } from '@tanstack/react-query';
import { contarMensagensNaoLidas } from '../api/mensagens';

export function useMensagensNaoLidas(usuarioId: number | undefined) {
  return useQuery({
    queryKey: ['mensagens-nao-lidas', usuarioId],
    queryFn: () => contarMensagensNaoLidas(usuarioId!),
    enabled: !!usuarioId,
    refetchInterval: 10000, // Atualiza a cada 10 segundos
    staleTime: 5000,
  });
}
