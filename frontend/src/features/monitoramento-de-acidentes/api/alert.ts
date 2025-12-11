import http from '@/lib/http';

export interface UserAlertStatus {
  id: number;
  userId: number;
  alert: boolean;
  name?: string;
  photoUrl?: string;
}

/**
 * Serviço de gerenciamento dos estados de alerta dos usuários.
 * Usado pela aba "Gerenciar Estados de Alerta" no SettingsPopup.
 */
export const alertsApi = {
  /** Lista todos os usuários e seus respectivos estados de alerta. */
  listarEstados: async (): Promise<UserAlertStatus[]> => {
    const { data } = await http.get<UserAlertStatus[]>('/api/usuarios/alertas');
    return data;
  },

  /**
   * Atualiza o estado de alerta (ativo/inativo) de um usuário específico.
   * @param userId ID do usuário
   * @param alert Novo estado de alerta
   */
  atualizarEstado: async (userId: number, alert: boolean): Promise<UserAlertStatus> => {
    const { data } = await http.patch<UserAlertStatus>(
      `/api/usuarios/${userId}/alerta`,
      { alert }
    );
    return data;
  },

  /** Reseta todos os estados de alerta (para uso administrativo). */
  resetarTodos: async (): Promise<void> => {
    await http.post('/api/usuarios/alertas/resetar');
  },
};
