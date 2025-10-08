// ✅ named exports
export type TipoUsuario =
  | 'IDOSO'
  | 'CUIDADOR'
  | 'FAMILIAR'
  | 'PROFISSIONAL_SAUDE';

export interface UsuarioDTO {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  tipoUsuario: TipoUsuario;
  ativo: boolean;
}
