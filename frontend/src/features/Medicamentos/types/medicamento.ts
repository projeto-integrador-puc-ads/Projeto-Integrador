export type TarjaMedicamento =
    | 'comum'
    | 'tarja preta'
    | 'tarja vermelha'
    | 'tarja amarela';

export interface Medicamento {
  id?: string;
  nome: string;
  dosagem: string;
  quantidade: string;
  tarja: TarjaMedicamento;
  dataMedicamento: string;
  dataInicio?: string;
  dataFim?: string;
  horarioMedicamento: string;
  contatoEmergencia: string;
}

export interface HistoricoMedicamento {
    id: number;
    nome: string;
    hora: string;
    acao: string;
    data: string;
}
