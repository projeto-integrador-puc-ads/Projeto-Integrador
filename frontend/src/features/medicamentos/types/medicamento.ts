export type TarjaMedicamento = 'sem_tarja' | 'amarela' | 'vermelha' | 'preta';
export type TipoMedicamento = 'comprimido' | 'liquido';

export interface ContatoPerfil {
  id: string;
  nome: string;
  telefone: string;
  relacao?: string;
}

export interface Medicamento {
  id?: string;
  nome: string;

  // 🔥 ADICIONADO:
  anvisaId?: number;

  tipo: TipoMedicamento;
  unidadePorDose: number;
  mlPorDose: number;
  quantidadeTotal: number;
  vezesAoDia: number;
  horarios: string[];
  tarja: TarjaMedicamento;

  contatoEmergenciaId?: string;

  dataInicio?: string;
  dataFim?: string;
  dataMedicamento?: string;

  checkins?: string[];
}
