export type Usuario = {
  id_usuario: number;
  nome: string;
  idade: number;
  peso: number;
  altura: number;
};

export type Opcao = {
  texto: string;
  peso: number;
};

export type Pergunta = {
  id: number;
  texto: string;
  opcoes: Opcao[];
};

export type RespostaQuestionario = {
  id: number;
  usuarioId: number;
  perguntaId: number;
  resposta: string;
  peso: number;
};

export type RespostaDTO = {
  perguntaId: number;
  resposta: string;
  peso: number;
};


export type Doenca = {
  id: number;
  nome: string;
  nomeAbreviado?: string;
  categoria?: string;
  causaObito?: string;
  codigo?: string;
  restricaoSexo?: string;
};

export type Alergia = {
  id: number;
  codigo: string;
  nome: string;
  categoria?: string;
};

export type UsuarioDoenca = {
  id_usuario_doenca: number;
  usuarioId: number;
  doencaId: number;
  doenca?: Doenca;
};

export type UsuarioAlergia = {
  id_usuario_alergia: number;
  usuarioId: number;
  alergiaId: number;
  alergia?: Alergia;
};

export type PrescricaoExercicio = {
  id_prescricao_exercicio: number;

  id_exercicio?: number;
  exercicio?: Exercicio;
};

export type Exame = {
  id?: number;
  nome?: string;
};

export type Exercicio = {
  id?: number;
  nome?: string;
};

export type Medico = {
  id_medico: number;
  nome: string;
  local_trabalho: string;
};

export type Medicamento = {
  id?: number;
  id_medicamento?: number; 
  nome?: string;
  principio_ativo?: string;
  concentracao?: string;
  via?: string;
};

export type PrescricaoMedicamento = {
  id_prescricao_medicamento: number;
  id_medicamento?: number;
  nome_medicamento: string;
  principio_ativo?: string;
  concentracao: string;
  via: string;
  dosagem?: string;
  frequencia?: string;
};

export type PrescricaoExame = {
  id_prescricao_exame: number;
  exame?: { nome: string };
  observacao?: string;
};

export type Prescricao = {
  id_prescricao: number;
  data_prescricao: string;
  nomeMedico: string;
  observacoes?: string;
  medicamentos: PrescricaoMedicamento[];
  exames: PrescricaoExame[];
};