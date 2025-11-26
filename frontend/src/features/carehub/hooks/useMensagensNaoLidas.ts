import { useQuery } from '@tanstack/react-query';
import { contarMensagensNaoLidas } from '../api/mensagens';
import { initializeAuthToken } from '../components/auth';

export function useMensagensNaoLidas(usuarioId: number | undefined) {
  return useQuery({
    queryKey: ['mensagens-nao-lidas', usuarioId],
    queryFn: async () => {
      // Tentar inicializar token automaticamente antes da requisição
      initializeAuthToken();

      // Pequeno delay para garantir que o token seja configurado
      await new Promise(resolve => setTimeout(resolve, 100));

      return contarMensagensNaoLidas(usuarioId!);
    },
    enabled: !!usuarioId,
    refetchInterval: 10000, // Atualiza a cada 10 segundos
    staleTime: 5 * 60 * 1000, // 5 minutos - considera dados "frescos"
    gcTime: 10 * 60 * 1000, // 10 minutos - mantém cache
    retry: (failureCount, error: any) => {
      // Se erro 401, tentar inicializar token novamente
      if (error?.response?.status === 401 && failureCount < 2) {
        console.log('CareHub: Tentando re-inicializar token após erro 401');
        initializeAuthToken();
        return true;
      }
      return false;
    },
  });
}
